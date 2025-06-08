import { create, IPFSHTTPClient } from "ipfs-http-client";
import { Buffer } from "buffer"; // Ensure Buffer is available, especially in browser environments

// Define the structure for IPFS configuration
// This could be expanded with more options like custom headers, timeout, etc.
export interface IPFSConfig {
  host: string;
  port: number;
  protocol: "http" | "https";
  apiPath?: string; // e.g., /api/v0
}

// Default configuration, can be overridden by environment variables
const DEFAULT_IPFS_CONFIG: IPFSConfig = {
  host: process.env.NEXT_PUBLIC_IPFS_HOST || "ipfs.infura.io",
  port: parseInt(process.env.NEXT_PUBLIC_IPFS_PORT || "5001", 10),
  protocol: (process.env.NEXT_PUBLIC_IPFS_PROTOCOL || "https") as "http" | "https",
  apiPath: process.env.NEXT_PUBLIC_IPFS_API_PATH || "/api/v0",
};

export class IPFSService {
  private ipfs: IPFSHTTPClient;
  private static instance: IPFSService;

  constructor(config: IPFSConfig = DEFAULT_IPFS_CONFIG) {
    try {
      this.ipfs = create({
        host: config.host,
        port: config.port,
        protocol: config.protocol,
        apiPath: config.apiPath,
        // Add headers if needed, e.g., for authenticated IPFS gateways
        // headers: {
        //   authorization: `Basic ${Buffer.from('PROJECT_ID:PROJECT_SECRET').toString('base64')}`
        // }
      });
      console.log(`IPFS client initialized with host: ${config.host}:${config.port}`);
    } catch (error) {
      console.error("Failed to initialize IPFS client:", error);
      throw new Error(
        `Failed to initialize IPFS client. Check IPFS daemon or gateway status and configuration. Error: ${error}`
      );
    }
  }

  public static getInstance(config?: IPFSConfig): IPFSService {
    if (!IPFSService.instance) {
      IPFSService.instance = new IPFSService(config);
    }
    return IPFSService.instance;
  }

  /**
   * Stores a file or data buffer on IPFS.
   * @param content The content to store (File object, Blob, Uint8Array, or string).
   * @returns A promise that resolves with the IPFS CID (Content Identifier) string.
   */
  public async storeDocument(
    content: File | Blob | Uint8Array | string
  ): Promise<string> {
    try {
      const result = await this.ipfs.add(content);
      console.log(`Document stored on IPFS. CID: ${result.cid.toString()}`);
      return result.cid.toString(); // cid is an object, convert to string
    } catch (error) {
      console.error("IPFS storage failed:", error);
      throw new Error(`IPFS storage failed: ${error}`);
    }
  }

  /**
   * Retrieves a document from IPFS using its CID.
   * @param cid The IPFS CID string of the document.
   * @returns A promise that resolves with the document content as a Uint8Array.
   */
  public async getDocument(cid: string): Promise<Uint8Array> {
    try {
      const chunks = [];
      for await (const chunk of this.ipfs.cat(cid)) {
        chunks.push(chunk);
      }
      if (chunks.length === 0) {
        // This case might indicate an empty file or an issue,
        // though ipfs.cat usually throws if CID not found.
        console.warn(`IPFS cat for CID ${cid} returned no chunks.`);
        return new Uint8Array(0); 
      }
      const data = Buffer.concat(chunks); // Use Buffer to handle Uint8Array concatenation
      console.log(`Document retrieved from IPFS. CID: ${cid}, Size: ${data.length} bytes`);
      return data;
    } catch (error) {
      console.error(`IPFS retrieval for CID ${cid} failed:`, error);
      throw new Error(`IPFS retrieval for CID ${cid} failed: ${error}`);
    }
  }

  /**
   * Pins a CID to the local IPFS node (or pinning service if configured).
   * Pinning ensures the data is not garbage collected.
   * @param cid The IPFS CID string to pin.
   * @returns A promise that resolves when the CID is pinned.
   */
  public async pinDocument(cid: string): Promise<void> {
    try {
      await this.ipfs.pin.add(cid);
      console.log(`Document pinned on IPFS. CID: ${cid}`);
    } catch (error) {
      console.error(`IPFS pinning for CID ${cid} failed:`, error);
      // Not re-throwing as pinning might be optional or handled differently
      // depending on IPFS setup (e.g., if using a remote pinning service).
      // Consider if this should throw or just warn.
      console.warn(`Warning: IPFS pinning for CID ${cid} failed. The content might not persist if not pinned elsewhere.`);
    }
  }

  /**
   * Unpins a CID from the local IPFS node.
   * @param cid The IPFS CID string to unpin.
   * @returns A promise that resolves when the CID is unpinned.
   */
  public async unpinDocument(cid: string): Promise<void> {
    try {
      await this.ipfs.pin.rm(cid);
      console.log(`Document unpinned from IPFS. CID: ${cid}`);
    } catch (error) {
      console.error(`IPFS unpinning for CID ${cid} failed:`, error);
      // Similar to pin, consider error handling strategy.
    }
  }
}