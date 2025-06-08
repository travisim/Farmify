import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { Wallet } from "xrpl"; // Not directly needed if using SettlementService's admin wallet
import { SettlementService } from "@/lib/settlement";
// import { AccountManager } from "@/lib/account"; // Not needed if using SettlementService's admin wallet
import { getDB } from "@/lib/db";
import { XRPLService } from "@/lib/xrpl";

interface VerifySettlementRequestBody {
  // adminSeed: string; // Temporary: In a real app, admin auth would be different
  projectNftId: string;
  revenueAmountRLUSD: string; // The revenue amount confirmed by admin
  documentIPFSHash: string; // Hash of the proof document on IPFS
  documentSha256FromFarmer: string; // SHA256 hash provided by farmer
  calculatedDocumentSha256ByAdmin: string; // SHA256 hash calculated by admin during verification
  // Optional: profit distribution details if calculated at this stage
  profitDistribution?: {
    investorsTotal: string;
    farmerTotal: string;
    platformTotal: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as VerifySettlementRequestBody;
    const {
      projectNftId,
      revenueAmountRLUSD,
      documentIPFSHash,
      documentSha256FromFarmer,
      calculatedDocumentSha256ByAdmin,
      profitDistribution,
    } = body;

    if (
      !projectNftId ||
      !revenueAmountRLUSD ||
      !documentIPFSHash ||
      !documentSha256FromFarmer ||
      !calculatedDocumentSha256ByAdmin
    ) {
      return NextResponse.json(
        { error: "Missing required fields for settlement verification." },
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
    
    // SettlementService initializes its own admin wallet from env var
    const settlementService = new SettlementService(xrplService);
    const db = await getDB();

    // Verify the settlement submission exists and is pending
    const existingSettlement = await db.get(
      "SELECT project_nft_id, settlement_status FROM settlement_cache WHERE project_nft_id = ?",
      projectNftId
    );

    if (!existingSettlement) {
      return NextResponse.json(
        { error: "Settlement submission not found for this project." },
        { status: 404 }
      );
    }
    if (existingSettlement.settlement_status !== "pending_verification") {
      return NextResponse.json(
        { error: `Settlement is not pending verification. Current status: ${existingSettlement.settlement_status}` },
        { status: 400 }
      );
    }

    console.log(`Admin verifying settlement for project ${projectNftId}`);
    const verificationTx = await settlementService.verifySettlement(
      projectNftId,
      revenueAmountRLUSD,
      documentIPFSHash,
      documentSha256FromFarmer,
      calculatedDocumentSha256ByAdmin,
      profitDistribution
    );

    const txHash = verificationTx.result.hash;
    if (!txHash) {
        console.error("Failed to get transaction hash from settlement verification:", verificationTx);
        return NextResponse.json({ error: "Settlement verification transaction failed or hash not found." }, { status: 500 });
    }
    console.log(`Settlement verified. XRPL Tx: ${txHash}`);

    // Update cache
    const now = Math.floor(Date.now() / 1000);
    const verificationTimestamp = verificationTx.result.date !== undefined 
                                  ? (verificationTx.result.date + 946684800) 
                                  : now;
    
    // Get admin verifier address from the service's wallet
    // This requires SettlementService to expose its admin wallet address or for AccountManager to be used
    // For now, we'll assume it's available via a method or directly if SettlementService is refactored.
    // Let's assume settlementService.adminNotaryWallet.address is accessible or add a getter.
    // For this example, we'll hardcode a placeholder or fetch from service if possible.
    const adminVerifierAddress = settlementService.getAdminNotaryWalletAddress() || "unknown_admin_fallback";


    await db.run(
      `UPDATE settlement_cache 
       SET settlement_status = ?, 
           verification_tx_hash = ?, 
           verification_timestamp = ?,
           admin_verifier_address = ?,
           updated_at = ?
       WHERE project_nft_id = ?`,
      "verified", // Status after successful verification
      txHash,
      verificationTimestamp,
      adminVerifierAddress, 
      now,
      projectNftId
    );

    // Update project_cache status
     await db.run(
        `UPDATE project_cache SET status = ?, last_updated = ? WHERE nft_id = ?`,
        "verified", // Or "distribution_pending" if that's the next distinct step
        now,
        projectNftId
    );
    console.log(`Settlement cache updated for project ${projectNftId}. Status: verified`);

    return NextResponse.json(
      {
        message: "Settlement verified successfully.",
        transactionHash: txHash,
        xrplResponse: verificationTx.result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error verifying settlement:", error);
    if (error.data && error.data.tec_message) {
        return NextResponse.json(
            { error: `XRPL transaction failed: ${error.data.tec_message}`, details: error.data },
            { status: 500 }
          );
    }
    return NextResponse.json(
      { error: "Failed to verify settlement", details: error.message },
      { status: 500 }
    );
  }
}