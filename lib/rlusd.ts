import { Wallet, TxResponse } from "xrpl";
import { XRPLService } from "./xrpl";
import { PaymentService } from "./payment";
import { TrustLineService } from "./trustline";
import {
  RLUSD_CURRENCY_CODE,
  RLUSD_ISSUER_ADDRESS_TESTNET,
  // Add other issuer addresses if needed for different environments
} from "./config";

export class RLUSDService {
  private paymentService: PaymentService;
  private trustLineService: TrustLineService;
  private xrplService: XRPLService;
  private rlusdIssuerAddress: string;

  constructor(
    xrplServiceInstance?: XRPLService,
    paymentServiceInstance?: PaymentService,
    trustLineServiceInstance?: TrustLineService
  ) {
    this.xrplService = xrplServiceInstance || XRPLService.getInstance();
    this.paymentService =
      paymentServiceInstance || new PaymentService(this.xrplService);
    this.trustLineService =
      trustLineServiceInstance || new TrustLineService(this.xrplService);

    // Determine issuer based on network - for now, defaults to testnet
    // A more robust approach would be to have this in config per environment
    const networkConfig = this.xrplService.getNetworkConfig();
    if (networkConfig.server.includes("altnet") || networkConfig.server.includes("testnet")) {
      this.rlusdIssuerAddress = RLUSD_ISSUER_ADDRESS_TESTNET;
    } else if (networkConfig.server.includes("devnet")) {
      // Assuming devnet might use the same testnet issuer for RLUSD for this project
      this.rlusdIssuerAddress = RLUSD_ISSUER_ADDRESS_TESTNET; // Or a specific devnet issuer if available
    } else {
      // Fallback or mainnet issuer - ensure this is configured
      this.rlusdIssuerAddress = process.env.NEXT_PUBLIC_RLUSD_ISSUER_ADDRESS_MAINNET || RLUSD_ISSUER_ADDRESS_TESTNET;
      if (this.rlusdIssuerAddress === RLUSD_ISSUER_ADDRESS_TESTNET && !networkConfig.server.includes("altnet")) {
        console.warn("RLUSD Service: Using testnet issuer address for a non-testnet environment. Ensure this is intended.");
      }
    }
    if (this.rlusdIssuerAddress === "rRLUSDIssuerAddressPlaceholder") {
        console.warn("RLUSD Service: RLUSD Issuer address is a placeholder. Please configure it in your environment variables.");
    }
  }

  /**
   * Sets up a trust line for RLUSD for the given wallet.
   * @param wallet The Wallet object of the account.
   * @param limit Optional limit for the trust line.
   * @returns A promise that resolves with the transaction result.
   */
  public async setupRLUSDTrustLine(
    wallet: Wallet,
    limit?: string
  ): Promise<TxResponse> {
    console.log(
      `Setting up RLUSD trust line for ${wallet.address} with issuer ${this.rlusdIssuerAddress}`
    );
    return this.trustLineService.setTrustLine(
      wallet,
      RLUSD_CURRENCY_CODE,
      this.rlusdIssuerAddress,
      limit
    );
  }

  /**
   * Sends RLUSD from one account to another.
   * @param senderWallet The Wallet object of the sender.
   * @param destinationAddress The XRPL address of the recipient.
   * @param amount The amount of RLUSD to send (as a string).
   * @returns A promise that resolves with the transaction result.
   */
  public async sendRLUSD(
    senderWallet: Wallet,
    destinationAddress: string,
    amount: string
  ): Promise<TxResponse> {
    // Ensure trust line exists for sender (optional check, as payment might fail anyway)
    // const hasTrust = await this.trustLineService.hasTrustLine(senderWallet.address, RLUSD_CURRENCY_CODE, this.rlusdIssuerAddress);
    // if (!hasTrust) {
    //   throw new Error(`Sender ${senderWallet.address} does not have a trust line for RLUSD from ${this.rlusdIssuerAddress}`);
    // }

    console.log(
      `Sending ${amount} RLUSD from ${senderWallet.address} to ${destinationAddress} (Issuer: ${this.rlusdIssuerAddress})`
    );
    return this.paymentService.sendToken(
      senderWallet,
      destinationAddress,
      amount,
      RLUSD_CURRENCY_CODE,
      this.rlusdIssuerAddress
    );
  }

  /**
   * Retrieves the RLUSD balance for a given account.
   * @param accountAddress The XRPL address of the account.
   * @returns A promise that resolves with the RLUSD balance as a string.
   */
  public async getRLUSDBalance(accountAddress: string): Promise<string> {
    const trustLines = await this.trustLineService.getAccountTrustLines(
      accountAddress
    );
    const rlusdLine = trustLines.find(
      (line) =>
        line.currency === RLUSD_CURRENCY_CODE &&
        line.account === this.rlusdIssuerAddress
    );
    return rlusdLine ? rlusdLine.balance : "0";
  }

  /**
   * Gets the configured RLUSD issuer address for the current network.
   * @returns The RLUSD issuer address string.
   */
  public getRLUSDIssuerAddress(): string {
    return this.rlusdIssuerAddress;
  }
}