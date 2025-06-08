import {
  Client,
  Wallet,
  xrpToDrops,
  Payment,
  TransactionMetadata,
  SubmitResponse,
} from "xrpl";
import { XRPLService } from "./xrpl";
import { RLUSD_CURRENCY_CODE, RLUSD_ISSUER_ADDRESS_TESTNET } from "./config"; // Assuming testnet for now

import {
  TxResponse, // Import TxResponse from xrpl library
} from "xrpl";
// Removed custom PaymentResult interface

export class PaymentService {
  private client: Client;
  private xrplService: XRPLService;

  constructor(xrplServiceInstance?: XRPLService) {
    this.xrplService = xrplServiceInstance || XRPLService.getInstance();
    this.client = this.xrplService.getClient();
  }

  /**
   * Sends XRP from one account to another.
   * @param senderWallet The Wallet object of the sender.
   * @param destinationAddress The XRPL address of the recipient.
   * @param amountXRP The amount of XRP to send (as a string).
   * @returns A promise that resolves with the transaction result.
   */
  public async sendXRP(
    senderWallet: Wallet,
    destinationAddress: string,
    amountXRP: string
  ): Promise<TxResponse> { // Changed return type
    if (!this.client.isConnected()) {
      await this.xrplService.connect();
    }

    const paymentTransaction: Payment = {
      TransactionType: "Payment",
      Account: senderWallet.address,
      Amount: xrpToDrops(amountXRP), // Convert XRP to drops
      Destination: destinationAddress,
      // Fee will be autofilled by client.autofill()
    };

    try {
      const prepared = await this.client.autofill(paymentTransaction);
      const signed = senderWallet.sign(prepared);
      console.log(`Sending ${amountXRP} XRP to ${destinationAddress}...`);
      const result = await this.client.submitAndWait(signed.tx_blob);
      console.log("XRP Payment successful:", JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error("XRP Payment failed:", error);
      throw error;
    }
  }

  /**
   * Sends a specified token (e.g., RLUSD) from one account to another.
   * @param senderWallet The Wallet object of the sender.
   * @param destinationAddress The XRPL address of the recipient.
   * @param amount The amount of the token to send (as a string).
   * @param currency The currency code of the token (e.g., "RLUSD").
   * @param issuerAddress The XRPL address of the token issuer.
   * @returns A promise that resolves with the transaction result.
   */
  public async sendToken(
    senderWallet: Wallet,
    destinationAddress: string,
    amount: string,
    currency: string,
    issuerAddress: string
  ): Promise<TxResponse> { // Changed return type
    if (!this.client.isConnected()) {
      await this.xrplService.connect();
    }

    const paymentTransaction: Payment = {
      TransactionType: "Payment",
      Account: senderWallet.address,
      Amount: {
        currency: currency,
        value: amount,
        issuer: issuerAddress,
      },
      Destination: destinationAddress,
      // Fee will be autofilled
    };

    try {
      const prepared = await this.client.autofill(paymentTransaction);
      const signed = senderWallet.sign(prepared);
      console.log(
        `Sending ${amount} ${currency} to ${destinationAddress}...`
      );
      const result = await this.client.submitAndWait(signed.tx_blob);
      console.log(
        "Token Payment successful:",
        JSON.stringify(result, null, 2)
      );
      return result;
    } catch (error) {
      console.error("Token Payment failed:", error);
      throw error;
    }
  }

  /**
   * Convenience method to send RLUSD.
   * Uses RLUSD_CURRENCY_CODE and RLUSD_ISSUER_ADDRESS_TESTNET from config.
   * TODO: Make issuer address dynamic based on network.
   */
  public async sendRLUSD(
    senderWallet: Wallet,
    destinationAddress: string,
    amount: string
  ): Promise<TxResponse> { // Changed return type
    // For now, assumes testnet issuer. This should be made dynamic
    // based on the connected network environment from XRPLService.
    const networkConfig = this.xrplService.getNetworkConfig();
    let issuer = RLUSD_ISSUER_ADDRESS_TESTNET; // Default to testnet

    // A more robust solution would involve fetching issuer based on networkConfig.server
    // or having distinct issuer addresses per environment in config.ts
    if (networkConfig.server === this.xrplService.getNetworkConfig().server) {
        // This logic is a bit circular, needs refinement if mainnet/devnet issuers differ
        // and are stored in config. For now, we'll stick to the testnet one.
        // console.log("Using RLUSD Testnet Issuer for payment.");
    }


    return this.sendToken(
      senderWallet,
      destinationAddress,
      amount,
      RLUSD_CURRENCY_CODE,
      issuer
    );
  }
}