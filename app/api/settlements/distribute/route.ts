import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  SettlementService,
  ProjectSettlementDetails,
  InvestorShare,
} from "@/lib/settlement";
import { getDB } from "@/lib/db";
import { XRPLService } from "@/lib/xrpl";

interface DistributeProfitsRequestBody {
  // adminSeed: string; // Or some other form of admin authentication
  projectNftId: string;
  // The following details would typically be fetched based on projectNftId
  // from a verified settlement record, rather than passed in the request directly
  // for a distribution-only endpoint.
  // However, for this example, we might pass them or fetch them.
  // Let's assume we fetch most details based on projectNftId.
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as DistributeProfitsRequestBody;
    const { projectNftId } = body;

    if (!projectNftId) {
      return NextResponse.json(
        { error: "Missing projectNftId for profit distribution." },
        { status: 400 }
      );
    }

    // Initialize services
    const xrplService = XRPLService.getInstance();
    if (!xrplService.getIsConnected()) {
        await xrplService.connect();
    }
    
    const settlementService = new SettlementService(xrplService);
    const db = await getDB();

    // 1. Fetch verified settlement details and project details from cache
    const settlementRecord = await db.get(
      "SELECT * FROM settlement_cache WHERE project_nft_id = ? AND settlement_status = 'verified'",
      projectNftId
    );

    if (!settlementRecord) {
      return NextResponse.json(
        { error: "Verified settlement record not found for this project. Distribution cannot proceed." },
        { status: 404 }
      );
    }

    const projectRecord = await db.get(
        "SELECT farmer_account FROM project_cache WHERE nft_id = ?",
        projectNftId
    );

    if (!projectRecord) {
        return NextResponse.json(
            { error: "Project details not found in cache." },
            { status: 404 }
        );
    }

    // 2. Fetch investor data for this project
    const investments = await db.all(
      "SELECT investor_account, amount_rlusd FROM investment_cache WHERE project_nft_id = ?",
      projectNftId
    );

    if (!investments || investments.length === 0) {
      // Handle case with no investors or if farmer gets 100% (edge case)
      console.warn(`No investors found for project ${projectNftId} or farmer takes all. Check logic if this is unexpected.`);
      // Potentially, only farmer payout occurs.
    }
    
    // Calculate total investment to determine shares (if not already stored)
    const totalInvestmentRLUSD = investments.reduce((sum, inv) => sum + inv.amount_rlusd, 0);

    const investorShares: InvestorShare[] = investments.map(inv => ({
        address: inv.investor_account,
        investmentAmount: inv.amount_rlusd,
        // Share percentage is based on their investment relative to total investment for the project
        sharePercentage: totalInvestmentRLUSD > 0 ? inv.amount_rlusd / totalInvestmentRLUSD : 0,
    }));


    // Construct ProjectSettlementDetails
    // These percentages should ideally come from project config or platform defaults
    const platformFeePercentage = parseFloat(process.env.NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE || "0.10"); // e.g., 10%
    const farmerSharePercentageAfterPlatform = parseFloat(process.env.NEXT_PUBLIC_FARMER_SHARE_PERCENTAGE || "0.50"); // e.g., 50% of remainder

    const projectSettlementDetails: ProjectSettlementDetails = {
      projectId: projectNftId,
      farmerAddress: projectRecord.farmer_account,
      totalRevenueRLUSD: settlementRecord.revenue_amount_rlusd,
      investorShares: investorShares,
      platformFeePercentage: platformFeePercentage,
      farmerSharePercentage: farmerSharePercentageAfterPlatform,
    };

    console.log(`Distributing profits for project ${projectNftId}`);
    const distributionResults = await settlementService.distributeProfits(
      projectSettlementDetails
    );
    
    // 3. Update settlement_cache and project_cache status to 'completed'
    const now = Math.floor(Date.now() / 1000);
    await db.run(
        `UPDATE settlement_cache SET settlement_status = ?, updated_at = ? WHERE project_nft_id = ?`,
        "completed",
        now,
        projectNftId
    );
    await db.run(
        `UPDATE project_cache SET status = ?, last_updated = ? WHERE nft_id = ?`,
        "completed",
        now,
        projectNftId
    );
    console.log(`Profit distribution completed for project ${projectNftId}. Status updated.`);

    // Store individual distribution transactions
    for (const result of distributionResults) {
        if (result.result.meta && (result.result.meta as any).TransactionResult === 'tesSUCCESS') {
            const recipient = (result.result.tx_json as any).Destination; // Or parse more accurately
            const amount = (result.result.tx_json as any).Amount;
            let recipientType = "unknown";
            if (recipient === projectRecord.farmer_account) recipientType = "farmer";
            else if (investorShares.some(inv => inv.address === recipient)) recipientType = "investor";
            // else if (recipient === PLATFORM_WALLET_ADDRESS) recipientType = "platform"; // If platform fee was paid

            await db.run(
                `INSERT INTO profit_distributions (
                    settlement_cache_id, project_nft_id, recipient_address, recipient_type, 
                    payout_amount_rlusd, distribution_tx_hash, distribution_timestamp, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                settlementRecord.id, 
                projectNftId,
                recipient,
                recipientType,
                typeof amount === 'object' ? parseFloat(amount.value) : parseFloat(amount) / 1000000, // Handle drops vs IOU
                result.result.hash,
                result.result.date !== undefined ? (result.result.date + 946684800) : now,
                "completed"
            );
        }
    }


    return NextResponse.json(
      {
        message: "Profit distribution processed.",
        details: distributionResults.map(dr => ({ hash: dr.result.hash, status: (dr.result.meta as any)?.TransactionResult })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error distributing profits:", error);
    if (error.data && error.data.tec_message) {
        return NextResponse.json(
            { error: `XRPL transaction failed: ${error.data.tec_message}`, details: error.data },
            { status: 500 }
          );
    }
    return NextResponse.json(
      { error: "Failed to distribute profits", details: error.message },
      { status: 500 }
    );
  }
}