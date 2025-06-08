import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDB } from "@/lib/db";
import { XRPLService } from "@/lib/xrpl"; // For potential direct XRPL fallbacks or live data
import { convertHexToString } from "xrpl"; // Utility to decode hex URI if needed

// Helper function to decode URI if it's hex-encoded JSON
function parseProjectDataURI(uri?: string | null): object | null {
  if (!uri) return null;
  try {
    if (uri.startsWith("data:application/json,")) {
      return JSON.parse(uri.substring("data:application/json,".length));
    }
    // Attempt to decode if it looks like a hex string (simple check)
    if (/^[0-9a-fA-F]+$/.test(uri)) {
      const decoded = convertHexToString(uri);
      if (decoded.startsWith("data:application/json,")) {
        return JSON.parse(decoded.substring("data:application/json,".length));
      }
      return { rawDecodedUri: decoded }; // Fallback if not JSON
    }
    return { rawUri: uri }; // If not a known format
  } catch (e) {
    console.warn("Failed to parse project_data_uri:", uri, e);
    return { errorParsingUri: uri };
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { nftId: string } }
) {
  try {
    const nftId = params.nftId;
    if (!nftId) {
      return NextResponse.json(
        { error: "Project NFT ID is required" },
        { status: 400 }
      );
    }

    const db = await getDB();

    // Fetch core project details from cache
    const project = await db.get(
      "SELECT * FROM project_cache WHERE nft_id = ?",
      nftId
    );

    if (!project) {
      // Optional: Fallback to fetching directly from XRPL if not in cache
      // This would involve using NFTService.getAccountNFTs and finding the specific NFT,
      // then decoding its URI. For now, we'll assume cache is the primary source.
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Parse the stored URI data
    project.parsed_uri_data = parseProjectDataURI(project.project_data_uri);

    // Fetch related data: investments, updates
    // Fetch investments for this project
    const investments = await db.all(
      "SELECT investor_account, amount_rlusd, timestamp, tx_hash FROM investment_cache WHERE project_nft_id = ? ORDER BY timestamp DESC",
      nftId
    );

    // Fetch project updates for this project
    const updates = await db.all(
      "SELECT transaction_hash, sender_address, memo_type, memo_data_json, xrpl_timestamp FROM project_update_memos WHERE project_nft_id = ? ORDER BY xrpl_timestamp DESC",
      nftId
    );

    // Decode memo_data_json for updates
    const decodedUpdates = updates.map(update => {
        try {
            return { ...update, memo_data: JSON.parse(update.memo_data_json) };
        } catch (e) {
            console.warn(`Failed to parse memo_data_json for update ${update.transaction_hash}`, e);
            return { ...update, memo_data: { error: "Failed to parse JSON" } };
        }
    });


    // Combine all data
    const projectDetails = {
      ...project,
      investments: investments.map(inv => ({
        ...inv,
        // Convert timestamp to ISO string for consistency if needed
        timestamp_iso: new Date(inv.timestamp * 1000).toISOString()
      })),
      updates: decodedUpdates.map(upd => ({
        ...upd,
        xrpl_timestamp_iso: new Date(upd.xrpl_timestamp * 1000).toISOString()
      })),
    };

    return NextResponse.json(projectDetails);
  } catch (error: any) {
    console.error(`Error fetching project ${params.nftId}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch project details", details: error.message },
      { status: 500 }
    );
  }
}