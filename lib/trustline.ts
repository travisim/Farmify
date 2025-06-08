import {
  Client,
  Wallet,
  TrustSet,
  AccountLinesRequest,
  AccountLinesResponse,
  TxResponse,
} from "xrpl";
import { XRPLService } from "./xrpl";

export class TrustLineService {
  private client: Client;
  private xrplService: XRPLService;

  constructor(xrplServiceInstance?: XRPLService) {
    this.xrplService = xrplServiceInstance || XRPLService.getInstance();
    this.client = this.xrplService.getClient();
  }

  /**
   * Creates or modifies a trust line from an account to an issuer for a specific currency.
   * @param wallet The Wallet object of the account setting the trust line.
   * @param currency The currency code (e.g., "RLUSD").
   * @param issuerAddress The XRPL address of the token issuer.
   * @param limit The maximum amount of the currency the account is willing to hold. Defaults to a large number.
   * @returns A promise that resolves with the transaction result.
   */
  public async setTrustLine(
    wallet: Wallet,
    currency: string,
    issuerAddress: string,
    limit?: string
  ): Promise<TxResponse> {
    if (!this.client.isConnected()) {
      await this.xrplService.connect();
    }

    const trustSetTransaction: TrustSet = {
      TransactionType: "TrustSet",
      Account: wallet.address,
      LimitAmount: {
        currency: currency,
        issuer: issuerAddress,
        value: limit || "10000000000", // Default large limit (e.g., 10 Billion)
      },
      // Fee will be autofilled
    };

    try {
      const prepared = await this.client.autofill(trustSetTransaction);
      const signed = wallet.sign(prepared);
      console.log(
        `Setting trust line for ${currency} from ${issuerAddress} for account ${wallet.address}...`
      );
      const result = await this.client.submitAndWait(signed.tx_blob);
      console.log(
        "Trust line set successfully:",
        JSON.stringify(result, null, 2)
      );
      return result;
    } catch (error) {
      console.error("Setting trust line failed:", error);
      throw error;
    }
  }

  /**
   * Retrieves all trust lines for a given account.
   * @param accountAddress The XRPL address of the account.
   * @returns A promise that resolves with an array of trust line objects.
   */
  public async getAccountTrustLines(
    accountAddress: string
  ): Promise<AccountLinesResponse["result"]["lines"]> {
    if (!this.client.isConnected()) {
      await this.xrplService.connect();
    }

    const request: AccountLinesRequest = {
      command: "account_lines",
      account: accountAddress,
      ledger_index: "validated",
    };

    try {
      const response: AccountLinesResponse = await this.client.request(request);
      return response.result.lines;
    } catch (error: any) {
      if (error.data?.error === "actNotFound") {
        console.warn(`Account ${accountAddress} not found on the ledger.`);
        return []; // Return empty array if account not found
      }
      console.error(
        `Error getting trust lines for account ${accountAddress}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Checks if a specific trust line exists for an account.
   * @param accountAddress The XRPL address of the account.
   * @param currency The currency code.
   * @param issuerAddress The issuer's XRPL address.
   * @returns Promise<boolean> True if the trust line exists, false otherwise.
   */
  public async hasTrustLine(
    accountAddress: string,
    currency: string,
    issuerAddress: string
  ): Promise<boolean> {
    const trustLines = await this.getAccountTrustLines(accountAddress);
    return trustLines.some(
      (line) =>
        line.currency === currency && line.account === issuerAddress
    );
  }
}