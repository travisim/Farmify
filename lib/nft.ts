import {
  Client,
  Wallet,
  NFTokenMint,
  NFTokenMintFlags,
  TxResponse,
  AccountNFTsRequest,
  AccountNFTsResponse,
  NFTokenCreateOffer,
  NFTokenCreateOfferFlags,
  NFTokenAcceptOffer,
  NFTokenBurn,
  convertStringToHex,
} from "xrpl";
import { XRPLService } from "./xrpl";

// Define a structure for the URI data, aligning with plan.MD
export interface ProjectNFTData {
  v: string; // version
  t: string; // title
  c: string; // category (e.g., "rice", "vegetables")
  l: string; // location (e.g., "Thailand", or more specific)
  g: number; // investment goal (RLUSD)
  d: number; // duration (days)
  roi: number; // expected ROI (%)
  cat: string; // project category (e.g., "crop", "livestock") - might be redundant with 'c'
  risk: "low" | "medium" | "high";
  cert?: string[]; // certifications (e.g., ["organic", "fair_trade"])
  stage: "funding" | "active" | "harvesting" | "completed" | "settlement_required" | "verification_pending";
  // Add other compact fields as necessary
}

export class NFTService {
  private client: Client;
  private xrplService: XRPLService;

  constructor(xrplServiceInstance?: XRPLService) {
    this.xrplService = xrplServiceInstance || XRPLService.getInstance();
    this.client = this.xrplService.getClient();
  }

  /**
   * Mints an NFT representing an agricultural project.
   * The project data is encoded in the URI field.
   * @param wallet The Wallet object of the farmer/minter.
   * @param projectData The core data for the project NFT.
   * @param taxon The NFTokenTaxon, e.g., 1 for agricultural projects.
   * @param transferFee Optional transfer fee for the NFT (0 for non-transferable if soulbound).
   * @param flags Optional flags for the NFTokenMint transaction. Defaults to make it non-transferable.
   * @returns A promise that resolves with the transaction result.
   */
  public async mintProjectNFT(
    wallet: Wallet,
    projectData: ProjectNFTData,
    taxon: number = 1, // Default taxon for AgriTrust projects
    transferFee: number = 0, // Default to 0 for non-transferable or no fee
    flags: NFTokenMintFlags = NFTokenMintFlags.tfTransferable // Default to transferable, can be overridden
                                                            // Use `0` or `undefined` for default flags if not making it non-transferable by default
  ): Promise<TxResponse> {
    if (!this.client.isConnected()) {
      await this.xrplService.connect();
    }

    // Encode projectData into a URI-compatible string (e.g., data:application/json,...)
    // For XRPL, the URI field in NFTokenMint expects a HEX string.
    const uriDataString = `data:application/json,${JSON.stringify(projectData)}`;
    const uriHex = convertStringToHex(uriDataString);

    const nftMintTransaction: NFTokenMint = {
      TransactionType: "NFTokenMint",
      Account: wallet.address,
      NFTokenTaxon: taxon,
      URI: uriHex,
      Flags: flags,
      TransferFee: transferFee > 0 ? transferFee * 1000 : 0, // TransferFee is in units of 0.001% to 50.000%
                                                              // For 1% fee, value is 1000. For 0.1% fee, value is 100.
      // Issuer: wallet.address, // Issuer can be set if needed, defaults to Account
      // Fee will be autofilled
    };
     if (transferFee > 0) {
        nftMintTransaction.TransferFee = Math.min(Math.max(transferFee * 1000, 0), 50000); // Clamp between 0% and 50%
     }


    try {
      const prepared = await this.client.autofill(nftMintTransaction);
      const signed = wallet.sign(prepared);
      console.log(`Minting project NFT for account ${wallet.address}...`);
      const result = await this.client.submitAndWait(signed.tx_blob);
      console.log(
        "Project NFT minted successfully:",
        JSON.stringify(result, null, 2)
      );
      return result;
    } catch (error) {
      console.error("Project NFT minting failed:", error);
      throw error;
    }
  }

  /**
   * Retrieves all NFTs for a given account.
   * @param accountAddress The XRPL address of the account.
   * @returns A promise that resolves with an array of NFT objects.
   */
  public async getAccountNFTs(
    accountAddress: string
  ): Promise<AccountNFTsResponse["result"]["account_nfts"]> {
    if (!this.client.isConnected()) {
      await this.xrplService.connect();
    }

    const request: AccountNFTsRequest = {
      command: "account_nfts",
      account: accountAddress,
      ledger_index: "validated",
    };

    try {
      const response: AccountNFTsResponse = await this.client.request(request);
      return response.result.account_nfts;
    } catch (error: any) {
      if (error.data?.error === "actNotFound") {
        console.warn(`Account ${accountAddress} not found on the ledger or has no NFTs.`);
        return [];
      }
      console.error(
        `Error getting NFTs for account ${accountAddress}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Burns (destroys) an NFT.
   * @param wallet The Wallet object of the NFT owner.
   * @param nfTokenID The ID of the NFToken to burn.
   * @returns A promise that resolves with the transaction result.
   */
  public async burnNFT(
    wallet: Wallet,
    nfTokenID: string
  ): Promise<TxResponse> {
    if (!this.client.isConnected()) {
      await this.xrplService.connect();
    }

    const burnTransaction: NFTokenBurn = {
      TransactionType: "NFTokenBurn",
      Account: wallet.address,
      NFTokenID: nfTokenID,
      // Owner: wallet.address, // Optional: only if Account is not the owner but has permissions
      // Fee will be autofilled
    };

    try {
      const prepared = await this.client.autofill(burnTransaction);
      const signed = wallet.sign(prepared);
      console.log(`Burning NFT ${nfTokenID} for account ${wallet.address}...`);
      const result = await this.client.submitAndWait(signed.tx_blob);
      console.log("NFT burned successfully:", JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error("NFT burning failed:", error);
      throw error;
    }
  }

  // TODO: Implement methods for creating and accepting NFT offers if needed
  // createNFTSellOffer, createNFTBuyOffer, acceptNFTOffer
}