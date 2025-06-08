import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Wallet } from "xrpl";
import { NFTService, ProjectNFTData } from "@/lib/nft";
import { MetadataService, AgriTrustMetadata } from "@/lib/metadata";
import { AccountManager } from "@/lib/account";
import { getDB } from "@/lib/db";
import { XRPLService } from "@/lib/xrpl"; // To ensure client is connected

// Define the expected request body structure for creating a project
// This should align with plan.MD's ProjectCreationFlow (Section 4.6)
interface CreateProjectRequestBody {
  farmerSeed: string; // Temporary: In a real app, this would come from an authenticated session
  projectDetails: ProjectNFTData; // Core data for NFT URI
  extendedDetails: Omit<AgriTrustMetadata, "dataType" | "timestamp" | "projectId"> & {
    // Specific extended fields based on plan.MD Section 5.1 (e.g., budget, timeline)
    budget?: Record<string, number>;
    timeline?: Array<{ stage: string; start: string; end: string; description: string }>;
    farmerProfile?: Record<string, any>; // e.g., experience, specialization
  };
  nftTaxon?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateProjectRequestBody;

    const {
      farmerSeed,
      projectDetails,
      extendedDetails,
      nftTaxon = 1, // Default taxon for AgriTrust projects
    } = body;

    if (!farmerSeed || !projectDetails || !extendedDetails) {
      return NextResponse.json(
        { error: "Missing required fields: farmerSeed, projectDetails, or extendedDetails" },
        { status: 400 }
      );
    }

    // Initialize services
    // Ensure XRPL client is connected
    const xrplService = XRPLService.getInstance();
    if (!xrplService.getIsConnected()) {
        await xrplService.connect();
    }
    
    const accountManager = new AccountManager(xrplService);
    const nftService = new NFTService(xrplService);
    const metadataService = new MetadataService(xrplService);
    const db = await getDB();

    // Create farmer wallet from seed (temporary authentication mechanism)
    let farmerWallet: Wallet;
    try {
      farmerWallet = accountManager.createWalletFromSeed(farmerSeed);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid farmer seed provided." },
        { status: 400 }
      );
    }
    
    // 1. Mint the Project NFT
    // The plan.MD (Section 5.1) suggests tfTransferable=false (soulbound) for project NFTs.
    // The NFTokenMintFlags.tfTransferable is 8. To make it non-transferable, this flag should NOT be set.
    // Flags: 0 means no flags set.
    // However, the example in plan.MD uses Flags: 8 (tfTransferable).
    // Let's stick to the example for now, but this might need clarification.
    // For now, let's assume it should be transferable as per the example JSON.
    // If it needs to be soulbound (non-transferable), flags should be 0 or specific non-transferable flags.
    // The default in nft.ts is tfTransferable.
    const nftMintResult = await nftService.mintProjectNFT(
      farmerWallet,
      projectDetails,
      nftTaxon
      // Add transferFee and flags if they differ from defaults and are part of request
    );

    const nftID = (nftMintResult.result.meta as any)?.AffectedNodes?.find(
        (node: any) => node.CreatedNode && node.CreatedNode.LedgerEntryType === "NFTokenPage"
      )?.CreatedNode?.NewFields?.NFTokens?.[0]?.NFToken?.NFTokenID || 
      (nftMintResult.result.meta as any)?.AffectedNodes?.find(
        (node: any) => node.ModifiedNode && node.ModifiedNode.LedgerEntryType === "NFTokenPage"
      )?.ModifiedNode?.FinalFields?.NFTokens?.[0]?.NFToken?.NFTokenID;


    if (!nftID) {
        console.error("Failed to extract NFTokenID from mint result:", nftMintResult);
        return NextResponse.json(
            { error: "Failed to mint project NFT or extract NFTokenID." },
            { status: 500 }
        );
    }
    console.log(`Project NFT minted with ID: ${nftID}`);

    // 2. Store Extended Project Data via Memo
    const fullExtendedDetails: AgriTrustMetadata = {
      dataType: "project_extended_details",
      projectId: nftID, // Link to the minted NFT
      timestamp: new Date().toISOString(),
      ...extendedDetails,
    };
    await metadataService.storeMetadata(
      farmerWallet,
      fullExtendedDetails,
      "agritrust_project"
    );
    console.log(`Extended project details stored for NFT ID: ${nftID}`);

    // 3. Cache Project in SQLite
    const now = Math.floor(Date.now() / 1000);
    await db.run(
      `INSERT INTO project_cache (
        nft_id, farmer_account, title, project_data_uri, category, location, 
        investment_goal, duration_days, expected_roi, status, created_at, last_updated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(nft_id) DO UPDATE SET
        title = excluded.title,
        project_data_uri = excluded.project_data_uri,
        category = excluded.category,
        location = excluded.location,
        investment_goal = excluded.investment_goal,
        duration_days = excluded.duration_days,
        expected_roi = excluded.expected_roi,
        status = excluded.status,
        last_updated = excluded.last_updated;`,
      nftID,
      farmerWallet.address,
      projectDetails.t, // title
      `data:application/json,${JSON.stringify(projectDetails)}`, // Storing the compact URI data
      projectDetails.c, // category
      projectDetails.l, // location
      projectDetails.g, // investment_goal
      projectDetails.d, // duration_days
      projectDetails.roi, // expected_roi
      projectDetails.stage, // status
      now,
      now
    );
    console.log(`Project ${nftID} cached in SQLite.`);

    return NextResponse.json(
      {
        message: "Project created successfully",
        nftId: nftID,
        xrplResponse: nftMintResult.result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating project:", error);
    // Check if it's an XRPL error with a specific result message
    if (error.data && error.data.tec_message) {
        return NextResponse.json(
            { error: `XRPL transaction failed: ${error.data.tec_message}`, details: error.data },
            { status: 500 }
          );
    }
    return NextResponse.json(
      { error: "Failed to create project", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const farmerAccount = searchParams.get("farmerAccount");

    let query = "SELECT * FROM project_cache";
    const conditions: string[] = [];
    const queryParams: any[] = [];

    if (status) {
      conditions.push("status = ?");
      queryParams.push(status);
    }
    if (category) {
      conditions.push("category = ?");
      queryParams.push(category);
    }
    if (farmerAccount) {
      conditions.push("farmer_account = ?");
      queryParams.push(farmerAccount);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?;";
    queryParams.push(limit, offset);

    const projects = await db.all(query, ...queryParams);

    // Also get total count for pagination
    let countQuery = "SELECT COUNT(*) as total FROM project_cache";
    if (conditions.length > 0) {
      // Re-use conditions but remove limit/offset params for count
      const countQueryParams = queryParams.slice(0, -2);
      countQuery += " WHERE " + conditions.join(" AND ");
      const totalResult = await db.get(countQuery, ...countQueryParams);
      return NextResponse.json({ projects, total: totalResult.total, limit, offset });
    } else {
      const totalResult = await db.get(countQuery);
      return NextResponse.json({ projects, total: totalResult.total, limit, offset });
    }

  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects", details: error.message },
      { status: 500 }
    );
  }
}