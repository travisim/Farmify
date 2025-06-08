import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Wallet } from "xrpl";
import { MetadataService, AgriTrustMetadata } from "@/lib/metadata";
import { AccountManager } from "@/lib/account";
import { getDB } from "@/lib/db";
import { XRPLService } from "@/lib/xrpl";

interface ProjectUpdateRequestBody {
  farmerSeed: string; // Temporary: In a real app, from authenticated session
  projectNftId: string;
  message: string;
  stage?: string; // Optional: e.g., "planting", "growing", "harvesting"
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ProjectUpdateRequestBody;
    const { farmerSeed, projectNftId, message, stage } = body;

    if (!farmerSeed || !projectNftId || !message) {
      return NextResponse.json(
        { error: "Missing required fields: farmerSeed, projectNftId, or message." },
        { status: 400 }
      );
    }

    // Initialize services
    const xrplService = XRPLService.getInstance();
    if (!xrplService.getIsConnected()) {
        await xrplService.connect();
    }
    
    const accountManager = new AccountManager(xrplService);
    const metadataService = new MetadataService(xrplService);
    const db = await getDB();

    let farmerWallet: Wallet;
    try {
      farmerWallet = accountManager.createWalletFromSeed(farmerSeed);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid farmer seed." },
        { status: 400 }
      );
    }

    // Verify project exists in cache (optional, but good practice)
    const project = await db.get(
      "SELECT nft_id FROM project_cache WHERE nft_id = ? AND farmer_account = ?",
      projectNftId,
      farmerWallet.address // Ensure the farmer owns the project they are updating
    );

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or farmer not authorized to update this project." },
        { status: 404 }
      );
    }

    // 1. Store Project Update as Metadata on XRPL
    const updateData: AgriTrustMetadata = {
      dataType: "project_update",
      projectId: projectNftId,
      timestamp: new Date().toISOString(),
      message: message,
      ...(stage && { stage: stage }), // Conditionally add stage if provided
    };

    console.log(`Storing update for project ${projectNftId} by farmer ${farmerWallet.address}`);
    const metadataResult = await metadataService.storeMetadata(
      farmerWallet,
      updateData,
      "agritrust_update" // Specific memo type for project updates
    );

    const txHash = metadataResult.result.hash;
    if (!txHash) {
        console.error("Failed to get transaction hash from metadata storage result:", metadataResult);
        return NextResponse.json({ error: "Project update transaction failed or hash not found." }, { status: 500 });
    }
    console.log(`Project update stored on XRPL. Transaction hash: ${txHash}`);
    
    // Get XRPL transaction timestamp
    // The submitAndWait result might not have the ledger timestamp directly in a simple field.
    // For an accurate XRPL timestamp, one might need to fetch the validated transaction.
    // For simplicity, we'll use client-side timestamp for caching, or rely on block explorers.
    // If `metadataResult.result.date` exists (it's in `ValidatedLedgerResponse`), use it.
    // Otherwise, fallback to current time. `submitAndWait` should give validated tx.
    const xrplTxTimestamp = metadataResult.result.date !== undefined 
                            ? (metadataResult.result.date + 946684800) // Ripple epoch to Unix epoch
                            : Math.floor(Date.now() / 1000);


    // 2. Cache Project Update in SQLite
    const now = Math.floor(Date.now() / 1000);
    await db.run(
      `INSERT INTO project_update_memos (project_nft_id, transaction_hash, sender_address, memo_type, memo_data_json, xrpl_timestamp, cached_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      projectNftId,
      txHash,
      farmerWallet.address,
      "agritrust_update/" + updateData.dataType, // Reconstruct memo type for consistency
      JSON.stringify(updateData), // Store the full update data as JSON
      xrplTxTimestamp,
      now
    );
    console.log(`Project update for ${projectNftId} cached in SQLite.`);

    // 3. Optionally, update project_cache.status if stage is provided and valid
    if (stage) {
        await db.run(
            `UPDATE project_cache SET status = ?, last_updated = ? WHERE nft_id = ?`,
            stage,
            now,
            projectNftId
        );
        console.log(`Project ${projectNftId} status updated to ${stage}.`);
    }


    return NextResponse.json(
      {
        message: "Project update posted successfully",
        transactionHash: txHash,
        xrplResponse: metadataResult.result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error posting project update:", error);
    if (error.data && error.data.tec_message) {
        return NextResponse.json(
            { error: `XRPL transaction failed: ${error.data.tec_message}`, details: error.data },
            { status: 500 }
          );
    }
    return NextResponse.json(
      { error: "Failed to post project update", details: error.message },
      { status: 500 }
    );
  }
}