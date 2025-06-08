import { Wallet, TxResponse } from "xrpl";
import { XRPLService } from "./xrpl";
import { IPFSService } from "./ipfs";
import { MetadataService, AgriTrustMetadata } from "./metadata";
import { RLUSDService } from "./rlusd";
import { AccountManager } from "./account"; // For admin wallet
import { ADMIN_NOTARY_WALLET_SEED, RLUSD_CURRENCY_CODE } from "./config";

export interface SettlementProofData extends AgriTrustMetadata {
  dataType: "settlement_proof";
  projectId: string; // NFTokenID of the project
  revenueAmount: string; // Total revenue from sales, as a string
  revenueCurrency: string; // e.g., "RLUSD"
  documentIPFSHash: string; // CID of the sales invoice/proof on IPFS
  documentHashSha256: string; // SHA-256 hash of the document itself for integrity
  verificationDate?: string; // ISO 8601, set upon admin verification
  adminVerifierAddress?: string; // XRPL address of the admin who verified
  profitDistribution?: {
    investorsTotal: string;
    farmerTotal: string;
    platformTotal: string;
    [key: string]: string; // Could include individual investor payouts if stored publicly
  };
}

export interface InvestorShare {
  address: string;
  investmentAmount: number; // Original investment in RLUSD
  sharePercentage: number; // Percentage of profit share
  payoutAmount?: string; // Calculated payout in RLUSD
}

export interface ProjectSettlementDetails {
  projectId: string; // NFTokenID
  farmerAddress: string;
  totalRevenueRLUSD: number;
  // Assuming costs are tracked off-chain or via other metadata for simplicity here
  // For a real system, project costs would be needed to calculate net profit.
  // Let's assume totalRevenueRLUSD is the amount to be distributed according to ratios.
  investorShares: InvestorShare[]; // List of investors and their stakes
  platformFeePercentage: number; // e.g., 0.20 for 20%
  farmerSharePercentage: number; // e.g., 0.40 for 40% (after platform fee)
  // The remaining percentage goes to investors collectively
}

export class SettlementService {
  private xrplService: XRPLService;
  private ipfsService: IPFSService;
  private metadataService: MetadataService;
  private rlusdService: RLUSDService;
  private accountManager: AccountManager;
  private adminNotaryWallet: Wallet;

  constructor(
    xrplServiceInstance?: XRPLService,
    ipfsServiceInstance?: IPFSService,
    metadataServiceInstance?: MetadataService,
    rlusdServiceInstance?: RLUSDService,
    accountManagerInstance?: AccountManager
  ) {
    this.xrplService = xrplServiceInstance || XRPLService.getInstance();
    this.ipfsService = ipfsServiceInstance || IPFSService.getInstance();
    this.metadataService =
      metadataServiceInstance || new MetadataService(this.xrplService);
    this.rlusdService =
      rlusdServiceInstance || new RLUSDService(this.xrplService);
    this.accountManager = accountManagerInstance || new AccountManager(this.xrplService);

    if (!ADMIN_NOTARY_WALLET_SEED || ADMIN_NOTARY_WALLET_SEED === "sEdTXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX") {
        console.warn("SettlementService: ADMIN_NOTARY_WALLET_SEED is not configured or is a placeholder. Settlement notarization will fail.");
        // In a real app, you might throw an error or prevent instantiation.
        // For now, we'll create a dummy wallet to avoid crashing, but operations will fail.
        this.adminNotaryWallet = Wallet.generate(); 
    } else {
        this.adminNotaryWallet = this.accountManager.createWalletFromSeed(ADMIN_NOTARY_WALLET_SEED);
    }
  }

  public getAdminNotaryWalletAddress(): string | undefined {
    return this.adminNotaryWallet?.address;
  }

  /**
   * Farmer submits proof of revenue.
   * 1. Uploads document to IPFS.
   * 2. Creates a preliminary settlement proof metadata object (without admin verification details yet).
   * 3. Stores this metadata on XRPL via a memo from the farmer's wallet.
   * This record indicates that a settlement is pending verification.
   */
  public async submitRevenueProof(
    farmerWallet: Wallet,
    projectId: string,
    revenueAmountRLUSD: string,
    proofDocument: File | Uint8Array, // File from form upload or Uint8Array
    documentSha256: string // Pre-calculated SHA256 hash of the document
  ): Promise<{ ipfsCID: string; xrplTx: TxResponse }> {
    const ipfsCID = await this.ipfsService.storeDocument(proofDocument);
    await this.ipfsService.pinDocument(ipfsCID); // Pin for persistence

    const settlementData: Partial<SettlementProofData> = {
      dataType: "settlement_proof",
      projectId: projectId,
      revenueAmount: revenueAmountRLUSD,
      revenueCurrency: RLUSD_CURRENCY_CODE,
      documentIPFSHash: ipfsCID,
      documentHashSha256: documentSha256,
      timestamp: new Date().toISOString(),
      // verificationDate and adminVerifierAddress will be added by admin
    };

    console.log(`Submitting revenue proof for project ${projectId} by farmer ${farmerWallet.address}`);
    const xrplTx = await this.metadataService.storeMetadata(
      farmerWallet,
      settlementData,
      "agritrust_settlement" // Specific memo type for settlement submissions
    );

    return { ipfsCID, xrplTx };
  }

  /**
   * Admin verifies the submitted revenue proof.
   * 1. Retrieves document from IPFS.
   * 2. Verifies document content and SHA256 hash.
   * 3. If valid, updates/creates a settlement proof metadata on XRPL from the admin notary wallet.
   *    This record confirms verification.
   */
  public async verifySettlement(
    // adminNotaryWallet: Wallet, // Using the service's internal admin wallet
    projectId: string,
    revenueAmountRLUSD: string, // As reported by farmer, to be verified
    documentIPFSHash: string,
    documentSha256FromFarmer: string,
    // In a real system, admin would fetch the document and recalculate SHA256
    calculatedDocumentSha256ByAdmin: string,
    profitDistribution?: SettlementProofData['profitDistribution'] // Optional: if calculated at verification
  ): Promise<TxResponse> {
    // Simulate document verification
    if (documentSha256FromFarmer !== calculatedDocumentSha256ByAdmin) {
      throw new Error(
        "Document SHA256 hash mismatch. Verification failed."
      );
    }
    // Further checks: revenue amount vs document, etc.

    const verifiedSettlementData: SettlementProofData = {
      dataType: "settlement_proof",
      projectId: projectId,
      revenueAmount: revenueAmountRLUSD,
      revenueCurrency: RLUSD_CURRENCY_CODE,
      documentIPFSHash: documentIPFSHash,
      documentHashSha256: calculatedDocumentSha256ByAdmin, // Use admin's calculated hash
      timestamp: new Date().toISOString(), // Original submission timestamp could be fetched
      verificationDate: new Date().toISOString(),
      adminVerifierAddress: this.adminNotaryWallet.address,
      profitDistribution: profitDistribution // if provided
    };

    console.log(`Admin ${this.adminNotaryWallet.address} verifying settlement for project ${projectId}`);
    return this.metadataService.storeMetadata(
      this.adminNotaryWallet,
      verifiedSettlementData,
      "agritrust_settlement_verified"
    );
  }

  /**
   * Distributes profits to investors and farmer after successful verification.
   * This would be triggered after verifySettlement.
   * Assumes settlementDetails contains all necessary info including verified revenue.
   */
  public async distributeProfits(
    // platformWallet: Wallet, // Wallet to send payments from (could be farmer's or a project escrow)
    settlementDetails: ProjectSettlementDetails
  ): Promise<TxResponse[]> {
    const distributionResults: TxResponse[] = [];
    const {
      projectId,
      farmerAddress,
      totalRevenueRLUSD,
      investorShares,
      platformFeePercentage,
      farmerSharePercentage,
    } = settlementDetails;

    if (!this.adminNotaryWallet) {
        throw new Error("Admin notary wallet is not configured. Cannot distribute profits.");
    }
    // For simplicity, let's assume the adminNotaryWallet (or a designated platform wallet)
    // holds the funds and makes the distributions. In a real scenario, this would be
    // the farmer's project wallet or an escrow account.
    const sourceWallet = this.adminNotaryWallet;


    const platformFee = totalRevenueRLUSD * platformFeePercentage;
    const remainingAfterPlatform = totalRevenueRLUSD - platformFee;
    const farmerPayout = remainingAfterPlatform * farmerSharePercentage;
    const totalInvestorPayout = remainingAfterPlatform - farmerPayout;

    console.log(`Distributing profits for project ${projectId}:`);
    console.log(`  Total Revenue: ${totalRevenueRLUSD} RLUSD`);
    console.log(`  Platform Fee (${platformFeePercentage*100}%): ${platformFee} RLUSD`);
    // TODO: Send platformFee to platform wallet (not implemented here)

    console.log(`  Farmer Payout (${farmerSharePercentage*100}% of remainder): ${farmerPayout} RLUSD`);
    if (farmerPayout > 0) {
      try {
        const farmerTx = await this.rlusdService.sendRLUSD(
          sourceWallet,
          farmerAddress,
          farmerPayout.toFixed(6) // RLUSD precision
        );
        distributionResults.push(farmerTx);
        console.log(`    Farmer payment successful: ${farmerTx.result.hash}`);
      } catch (error) {
        console.error(`    Farmer payment to ${farmerAddress} failed:`, error);
        // Handle failed payment (e.g., log, retry, notify)
      }
    }

    console.log(`  Total Investor Payout: ${totalInvestorPayout} RLUSD`);
    for (const investor of investorShares) {
      // Calculate individual investor payout based on their sharePercentage of totalInvestorPayout
      // This assumes sharePercentage is of the *investor pool*, not total revenue.
      // If sharePercentage is of total investment, logic needs adjustment.
      // For now, let's assume sharePercentage is their portion of the totalInvestorPayout.
      const investorPayoutAmount = totalInvestorPayout * investor.sharePercentage;

      if (investorPayoutAmount > 0) {
        console.log(`    Investor ${investor.address} Payout: ${investorPayoutAmount.toFixed(6)} RLUSD`);
        try {
          const investorTx = await this.rlusdService.sendRLUSD(
            sourceWallet,
            investor.address,
            investorPayoutAmount.toFixed(6)
          );
          distributionResults.push(investorTx);
          console.log(`      Investor payment successful: ${investorTx.result.hash}`);
        } catch (error) {
          console.error(`      Investor payment to ${investor.address} failed:`, error);
          // Handle failed payment
        }
      }
    }
    
    // After all distributions, record the final profit distribution details on XRPL
    const finalSettlementProof = await this.metadataService.storeMetadata(
        sourceWallet, // Or farmerWallet if they trigger this final step
        {
            dataType: "settlement_distribution_complete",
            projectId: projectId,
            timestamp: new Date().toISOString(),
            totalRevenueRLUSD: totalRevenueRLUSD.toFixed(6),
            platformFee: platformFee.toFixed(6),
            farmerPayout: farmerPayout.toFixed(6), // Corrected: removed trailing comma that might have been an issue
            totalInvestorPayout: totalInvestorPayout.toFixed(6)
            // Could include a summary of investor payouts or link to individual txs
        } as AgriTrustMetadata, // Ensured this closing parenthesis is correct
        "agritrust_settlement_final"
    );
    distributionResults.push(finalSettlementProof);

    return distributionResults; // Added missing return statement if it was implicitly missing before the end of the block
  }
}