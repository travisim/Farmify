import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Wallet } from "xrpl";
import { SettlementService } from "@/lib/settlement";
import { AccountManager } from "@/lib/account";
import { getDB } from "@/lib/db";
import { XRPLService } from "@/lib/xrpl";
import { IPFSService } from "@/lib/ipfs"; // For direct use if needed, though SettlementService wraps it

// Expected request body structure (using FormData for file upload)
// farmerSeed: string;
// projectNftId: string;
// revenueAmountRLUSD: string;
// proofDocument: File; // This will be part of FormData
// documentSha256: string;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const farmerSeed = formData.get("farmerSeed") as string;
    const projectNftId = formData.get("projectNftId") as string;
    const revenueAmountRLUSD = formData.get("revenueAmountRLUSD") as string;
    const proofDocumentFile = formData.get("proofDocument") as File | null;
    const documentSha256 = formData.get("documentSha256") as string;

    if (
      !farmerSeed ||
      !projectNftId ||
      !revenueAmountRLUSD ||
      !proofDocumentFile ||
      !documentSha256
    ) {
      return NextResponse.json(
        { error: "Missing required fields for settlement submission." },
        { status: 400 }
      );
    }

    if (isNaN(parseFloat(revenueAmountRLUSD)) || parseFloat(revenueAmountRLUSD) <=0) {
        return NextResponse.json({ error: "Invalid revenue amount." }, { status: 400 });
    }

    // Initialize services
    const xrplService = XRPLService.getInstance();
    if (!xrplService.getIsConnected()) {
        await xrplService.connect();
    }
    
    const accountManager = new AccountManager(xrplService);
    // SettlementService initializes IPFSService and MetadataService internally
    const settlementService = new SettlementService(xrplService); 
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

    // Verify project exists and belongs to the farmer
    const project = await db.get(
      "SELECT nft_id, status FROM project_cache WHERE nft_id = ? AND farmer_account = ?",
      projectNftId,
      farmerWallet.address
    );

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or farmer not authorized." },
        { status: 404 }
      );
    }
    // Optionally, check project status (e.g., must be 'harvesting' or similar)
    // if (project.status !== 'harvesting' && project.status !== 'active') { // Example check
    //     return NextResponse.json({ error: `Project status (${project.status}) does not allow settlement submission.` }, { status: 400 });
    // }


    // Convert File to Uint8Array for IPFSService
    const documentBuffer = await proofDocumentFile.arrayBuffer();
    const documentUint8Array = new Uint8Array(documentBuffer);

    console.log(`Submitting revenue proof for project ${projectNftId} by farmer ${farmerWallet.address}`);
    const { ipfsCID, xrplTx } =
      await settlementService.submitRevenueProof(
        farmerWallet,
        projectNftId,
        revenueAmountRLUSD,
        documentUint8Array,
        documentSha256
      );
    
    const txHash = xrplTx.result.hash;
     if (!txHash) {
        console.error("Failed to get transaction hash from settlement submission:", xrplTx);
        return NextResponse.json({ error: "Settlement submission transaction failed or hash not found." }, { status: 500 });
    }
    console.log(`Revenue proof submitted. IPFS CID: ${ipfsCID}, XRPL Tx: ${txHash}`);

    // Update cache
    const now = Math.floor(Date.now() / 1000);
    const submissionTimestamp = xrplTx.result.date !== undefined 
                                ? (xrplTx.result.date + 946684800) 
                                : now;

    await db.run(
      `INSERT INTO settlement_cache (
          project_nft_id, farmer_account, settlement_status, revenue_amount_rlusd, 
          document_ipfs_hash, document_sha256, submission_tx_hash, submission_timestamp, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(project_nft_id) DO UPDATE SET
          settlement_status = excluded.settlement_status,
          revenue_amount_rlusd = excluded.revenue_amount_rlusd,
          document_ipfs_hash = excluded.document_ipfs_hash,
          document_sha256 = excluded.document_sha256,
          submission_tx_hash = excluded.submission_tx_hash,
          submission_timestamp = excluded.submission_timestamp,
          updated_at = excluded.updated_at;`,
      projectNftId,
      farmerWallet.address,
      "pending_verification", // Initial status after submission
      parseFloat(revenueAmountRLUSD),
      ipfsCID,
      documentSha256,
      txHash,
      submissionTimestamp,
      now,
      now
    );

    // Update project_cache status
    await db.run(
        `UPDATE project_cache SET status = ?, last_updated = ? WHERE nft_id = ?`,
        "pending_verification", // Or "settlement_submitted"
        now,
        projectNftId
    );
    console.log(`Settlement cache updated for project ${projectNftId}. Status: pending_verification`);

    return NextResponse.json(
      {
        message: "Revenue proof submitted successfully for verification.",
        ipfsCID: ipfsCID,
        transactionHash: txHash,
        xrplResponse: xrplTx.result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting revenue proof:", error);
    if (error.data && error.data.tec_message) {
        return NextResponse.json(
            { error: `XRPL transaction failed: ${error.data.tec_message}`, details: error.data },
            { status: 500 }
          );
    }
    return NextResponse.json(
      { error: "Failed to submit revenue proof", details: error.message },
      { status: 500 }
    );
  }
}