import { Client, Wallet, Memo, Payment, TxResponse, convertStringToHex } from "xrpl";
import { XRPLService } from "./xrpl";

// Define a more specific type for metadata payloads for better type safety
export interface AgriTrustMetadata {
  dataType: string; // e.g., "project_details", "project_update", "settlement_proof"
  projectId?: string; // Link to the project NFT ID or a unique project identifier
  timestamp: string; // ISO 8601 timestamp
  [key: string]: any; // Allow other arbitrary data
}

export class MetadataService {
  private client: Client;
  private xrplService: XRPLService;

  constructor(xrplServiceInstance?: XRPLService) {
    this.xrplService = xrplServiceInstance || XRPLService.getInstance();
    this.client = this.xrplService.getClient();
  }

  /**
   * Stores arbitrary JSON metadata on the XRPL by sending a tiny payment to self with data in Memos.
   * @param wallet The Wallet object of the account storing the metadata.
   * @param metadata The metadata object to store. Should conform to AgriTrustMetadata or be a simple object.
   * @param memoTypePrefix A prefix for the MemoType, e.g., "agritrust". Max 11 bytes for prefix.
   *                       The actual MemoType will be like "agritrust/project_details".
   * @returns A promise that resolves with the transaction result.
   */
  public async storeMetadata(
    wallet: Wallet,
    metadata: AgriTrustMetadata | Record<string, any>,
    memoTypePrefix: string = "agritrust"
  ): Promise<TxResponse> {
    if (!this.client.isConnected()) {
      await this.xrplService.connect();
    }

    const metadataString = JSON.stringify(metadata);
    const dataType = (metadata as AgriTrustMetadata).dataType || "generic";
    
    // Construct MemoType: Ensure it's a valid hex string.
    // Max length for MemoType is typically around 24-26 hex characters (12-13 bytes) if you want it human-readable after hex decoding.
    // Let's use a simple scheme: prefix/dataType
    let fullMemoType = `${memoTypePrefix}/${dataType}`;
    if (fullMemoType.length > 40) { // Arbitrary limit to prevent overly long memo types
        console.warn(`Generated MemoType "${fullMemoType}" is long, consider shortening prefix or dataType.`);
        fullMemoType = fullMemoType.substring(0, 40);
    }
    
    const memo: Memo = {
      Memo: {
        // MemoType should be a HEX string.
        MemoType: convertStringToHex(fullMemoType),
        // MemoData should be a HEX string.
        MemoData: convertStringToHex(metadataString),
      }
    };

    const paymentTransaction: Payment = {
      TransactionType: "Payment",
      Account: wallet.address,
      Destination: wallet.address, // Self-payment
      Amount: "1", // 1 drop (smallest unit of XRP)
      Memos: [memo],
      // Fee will be autofilled
    };

    try {
      const prepared = await this.client.autofill(paymentTransaction);
      const signed = wallet.sign(prepared);
      console.log(
        `Storing metadata for account ${wallet.address} with MemoType ${fullMemoType}...`
      );
      const result = await this.client.submitAndWait(signed.tx_blob);
      console.log(
        "Metadata stored successfully:",
        JSON.stringify(result, null, 2)
      );
      return result;
    } catch (error) {
      console.error("Metadata storage failed:", error);
      throw error;
    }
  }

  // Future methods could include:
  // - getMetadataForAccount(accountAddress: string, memoTypePrefix?: string): Promise<AgriTrustMetadata[]>
  // - getMetadataForTransaction(txHash: string): Promise<AgriTrustMetadata | null>
  // These would involve parsing account_tx or tx commands and decoding MemoData.
}