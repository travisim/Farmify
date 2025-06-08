import {
  Client,
  Wallet,
  SetHook,
  HookParameter,
  TxResponse,
  TransactionMetadata,
} from "xrpl";
import { XRPLService } from "./xrpl";

// Interface for a simplified Hook definition for our purposes
export interface AgriTrustHookDefinition {
  hookName: string; // A friendly name for the hook
  hookNamespace: string; // Namespace for the hook, e.g., "agritrust_settlement"
  hookOn: string; // Bitmask of transaction types, e.g., "0xFFFFFFFFFFFFFFFF" for all
  hookApiVersion?: number; // Defaults to 0
  hookParameters?: HookParameter[]; // Parameters to pass to the hook
  createFile: string; // The compiled hook code as a hex string (WASM)
  // Note: The actual compilation of C/Rust to WASM and then to hex is outside this scope.
  // This service assumes `createFile` (representing HookDefinition) is provided.
}

export class HookService {
  private client: Client;
  private xrplService: XRPLService;

  constructor(xrplServiceInstance?: XRPLService) {
    this.xrplService = xrplServiceInstance || XRPLService.getInstance();
    this.client = this.xrplService.getClient();
  }

  /**
   * Sets or updates hooks on an XRPL account.
   * @param wallet The Wallet object of the account where the hook will be set.
   * @param hooks An array of hook definitions to set. Up to 8 hooks can be set.
   * @returns A promise that resolves with the transaction result.
   */
  public async setHooks(
    wallet: Wallet,
    hooks: AgriTrustHookDefinition[]
  ): Promise<TxResponse> {
    if (!this.client.isConnected()) {
      await this.xrplService.connect();
    }

    if (hooks.length === 0 || hooks.length > 8) {
      throw new Error("Number of hooks must be between 1 and 8.");
    }

    const setHookTransaction: SetHook = {
      TransactionType: "SetHook",
      Account: wallet.address,
      Hooks: hooks.map((hDef) => ({
        Hook: {
          CreateCode: hDef.createFile, // This should be the hex of compiled WASM
          HookOn: hDef.hookOn,
          HookNamespace: this.toHex(hDef.hookNamespace), // Namespace needs to be hex
          HookApiVersion: hDef.hookApiVersion || 0,
          Flags: 1, // hsflCreate: If the hook does not exist, create it. If it does exist, replace it.
          ...(hDef.hookParameters && { HookParameters: hDef.hookParameters }),
        },
      })),
      // Fee will be autofilled
    };

    try {
      const prepared = await this.client.autofill(setHookTransaction);
      const signed = wallet.sign(prepared);
      console.log(`Setting hooks for account ${wallet.address}...`);
      const result = await this.client.submitAndWait(signed.tx_blob);
      console.log("SetHook transaction successful:", JSON.stringify(result, null, 2));
      
      // Verify hook installation (optional, good practice)
      // This would involve checking the account_info for the Hooks array
      // and comparing hashes. For brevity, not implemented here.

      return result;
    } catch (error) {
      console.error("SetHook transaction failed:", error);
      throw error;
    }
  }

  /**
   * Clears all hooks from an account.
   * To clear hooks, submit a SetHook transaction with an empty Hooks array.
   * @param wallet The Wallet object of the account.
   * @returns A promise that resolves with the transaction result.
   */
  public async clearHooks(wallet: Wallet): Promise<TxResponse> {
     if (!this.client.isConnected()) {
      await this.xrplService.connect();
    }
    const clearHookTransaction: SetHook = {
        TransactionType: "SetHook",
        Account: wallet.address,
        Hooks: [] // Empty array clears all hooks
    };
    try {
      const prepared = await this.client.autofill(clearHookTransaction);
      const signed = wallet.sign(prepared);
      console.log(`Clearing all hooks for account ${wallet.address}...`);
      const result = await this.client.submitAndWait(signed.tx_blob);
      console.log("ClearHooks (SetHook with empty Hooks) transaction successful:", JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error("ClearHooks transaction failed:", error);
      throw error;
    }
  }


  // Helper to convert string to hex, ensuring it's 64 chars for namespace
  private toHex(str: string): string {
    let hex = Buffer.from(str, "utf8").toString("hex").toUpperCase();
    // HookNamespace must be 64 hex characters (32 bytes). Pad with 0s if shorter.
    // Truncate or hash if longer, but for simplicity, let's assume it fits or pad.
    if (hex.length > 64) {
        console.warn(`HookNamespace "${str}" is too long when converted to hex. It will be truncated.`);
        hex = hex.substring(0, 64);
    } else {
        hex = hex.padEnd(64, "0");
    }
    return hex;
  }
}