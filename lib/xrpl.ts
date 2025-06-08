import { Client, Wallet, xrpToDrops, dropsToXrp, ClientOptions } from "xrpl";
import { getXRPLConfig, NetworkConfig } from "./config";

export class XRPLService {
  private client: Client;
  private isConnected: boolean = false;
  private networkConfig: NetworkConfig;

  constructor(options?: ClientOptions) {
    this.networkConfig = getXRPLConfig();
    const clientOptions = options || {};
    this.client = new Client(this.networkConfig.server, clientOptions);

    this.client.on("connected", () => {
      console.log(
        `Successfully connected to XRPL via ${this.networkConfig.server}`
      );
      this.isConnected = true;
    });

    this.client.on("disconnected", (code: number) => {
      console.log(
        `Disconnected from XRPL (code: ${code}). Attempting to reconnect...`
      );
      this.isConnected = false;
      // Add reconnection logic if needed, or handle in consuming services
    });

    this.client.on("error", (errorCode, errorMessage, data) => {
      console.error("XRPL Client Error:", {
        errorCode,
        errorMessage,
        data,
      });
      // Potentially disconnect or attempt to re-establish connection based on error type
    });
  }

  public async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        await this.client.connect();
      } catch (error) {
        console.error("Failed to connect to XRPL:", error);
        // Rethrow or handle as appropriate for the application
        throw error;
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      try {
        await this.client.disconnect();
      } catch (error) {
        console.error("Failed to disconnect from XRPL:", error);
        // Rethrow or handle
        throw error;
      }
    }
  }

  public getClient(): Client {
    if (!this.client) {
      throw new Error(
        "XRPL client has not been initialized. Call connect() first."
      );
    }
    return this.client;
  }

  public getIsConnected(): boolean {
    return this.isConnected && this.client.isConnected();
  }

  public getNetworkConfig(): NetworkConfig {
    return this.networkConfig;
  }

  // Static method to get a shared instance (Singleton-like, but simple)
  private static instance: XRPLService;
  public static getInstance(options?: ClientOptions): XRPLService {
    if (!XRPLService.instance) {
      XRPLService.instance = new XRPLService(options);
    }
    return XRPLService.instance;
  }
}

// Export utility functions directly from xrpl lib for convenience
export { Wallet, xrpToDrops, dropsToXrp };