import { Client, Wallet, dropsToXrp, AccountInfoRequest } from "xrpl";
import { XRPLService } from "./xrpl"; // Assuming XRPLService is in xrpl.ts

export class AccountManager {
  private client: Client;
  private xrplService: XRPLService;

  constructor(xrplServiceInstance?: XRPLService) {
    this.xrplService = xrplServiceInstance || XRPLService.getInstance();
    this.client = this.xrplService.getClient();
  }

  /**
   * Generates a new XRPL wallet (account).
   * @returns A new Wallet object.
   */
  public generateWallet(): Wallet {
    return Wallet.generate();
  }

  /**
   * Creates a Wallet object from a given seed.
   * @param seed The seed (secret key) of the account.
   * @returns A Wallet object.
   */
  public createWalletFromSeed(seed: string): Wallet {
    try {
      return Wallet.fromSeed(seed);
    } catch (error) {
      console.error("Error creating wallet from seed:", error);
      throw new Error(
        "Invalid seed provided. Please check the seed and try again."
      );
    }
  }

  /**
   * Funds an account on the XRPL testnet or devnet using the faucet.
   * Note: This typically only works on testnet/devnet.
   * @param walletToFund The Wallet object to fund. If undefined, the faucet typically funds a new wallet.
   * @returns A promise that resolves with the fund result.
   */
  public async fundAccountFromFaucet(walletToFund?: Wallet): Promise<any> {
    if (!this.xrplService.getNetworkConfig().faucet) {
      console.warn(
        "Faucet URL is not configured for the current network. Skipping funding."
      );
      return {
        warning:
          "Faucet URL not configured for the current network. Account not funded.",
      };
    }
    if (!this.client.isConnected()) {
      await this.xrplService.connect();
    }
    try {
      const accountToLog = walletToFund
        ? walletToFund.address
        : "a new wallet from faucet";
      console.log(`Attempting to fund account: ${accountToLog}`);
      // Pass walletToFund (which can be Wallet or undefined)
      // If walletToFund is undefined, client.fundWallet() typically has the faucet generate and fund a new wallet.
      const fundResult = await this.client.fundWallet(walletToFund);
      console.log(`Account ${accountToLog} funded:`, fundResult);
      return fundResult;
    } catch (error) {
      console.error("Error funding account from faucet:", error);
      throw error;
    }
  }

  /**
   * Retrieves account information from the XRPL.
   * @param address The XRPL address of the account.
   * @returns A promise that resolves with the account data.
   */
  public async getAccountInfo(address: string): Promise<any> {
    if (!this.client.isConnected()) {
      await this.xrplService.connect();
    }
    try {
      const request: AccountInfoRequest = {
        command: "account_info",
        account: address,
        ledger_index: "validated", // Use 'validated' for confirmed data
      };
      const response = await this.client.request(request);
      return response.result.account_data;
    } catch (error: any) {
      if (error.data?.error === "actNotFound") {
        console.warn(`Account ${address} not found on the ledger.`);
        return null; // Or throw a custom error e.g., new AccountNotFoundError()
      }
      console.error(`Error getting account info for ${address}:`, error);
      throw error;
    }
  }

  /**
   * Retrieves the XRP balance of an account.
   * @param address The XRPL address of the account.
   * @returns A promise that resolves with the XRP balance as a string.
   */
  public async getXRPBalance(address: string): Promise<string> {
    const accountInfo = await this.getAccountInfo(address);
    if (accountInfo && accountInfo.Balance) {
      return String(dropsToXrp(accountInfo.Balance));
    }
    // If account is not found or has no balance field (should not happen for found accounts)
    return "0";
  }
}