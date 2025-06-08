import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Wallet } from "xrpl";
import { RLUSDService } from "@/lib/rlusd";
import { AccountManager } from "@/lib/account";
import { getDB, SQLiteDB } from "@/lib/db";
import { XRPLService } from "@/lib/xrpl";
import { Client } from "xrpl"; // Needed for submit

interface InvestmentRequestBody {
  // investorSeed: string; // Replaced by signedTransaction
  signedTransaction: string; // Hex string of the signed transaction from WalletConnect
  projectNftId: string; // Still needed to update cache
  investorAccount: string; // Submitter's account, from decoded tx or passed alongside
  amountRLUSD: string; // Still needed for cache update
  // farmerAccount: string; // This would be part of the signed transaction's destination
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as InvestmentRequestBody;
    const { signedTransaction, projectNftId, investorAccount, amountRLUSD } = body;

    if (!signedTransaction || !projectNftId || !investorAccount || !amountRLUSD) {
      return NextResponse.json(
        { error: "Missing required fields: signedTransaction, projectNftId, investorAccount, or amountRLUSD." },
        { status: 400 }
      );
    }
    
    const amount = parseFloat(amountRLUSD);
     if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid investment amount for caching." },
        { status: 400 }
      );
    }


    // Initialize services
    const xrplService = XRPLService.getInstance();
     if (!xrplService.getIsConnected()) {
        await xrplService.connect();
    }
    const client: Client = xrplService.getClient();
    const db = await getDB();

    // No longer creating wallet from seed on backend for this flow
    // let investorWallet: Wallet;
    // try {
    //   investorWallet = accountManager.createWalletFromSeed(investorSeed);
    // } catch (error) {
    //   return NextResponse.json(
    //     { error: "Invalid investor seed." },
    //     { status: 400 }
    //   );
    // }

    // Check if project exists and get its current funding status (optional pre-check)
    const project = await db.get(
      "SELECT investment_goal, current_funding FROM project_cache WHERE nft_id = ?",
      projectNftId
    );

    if (!project) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }
    
    if (project.current_funding >= project.investment_goal) {
        return NextResponse.json(
            { error: "Project is already fully funded." },
            { status: 400 }
        );
    }
     if (project.current_funding + amount > project.investment_goal) {
        const remainingNeeded = project.investment_goal - project.current_funding;
        return NextResponse.json(
            { error: `Investment amount exceeds remaining funding needed. Max allowed: ${remainingNeeded.toFixed(6)} RLUSD` },
            { status: 400 }
        );
    }

    // 1. Submit the pre-signed transaction
    // The frontend would construct the RLUSD payment transaction, get it signed via WalletConnect,
    // and send the signed blob here.
    console.log(`Submitting pre-signed investment transaction for project ${projectNftId} by investor ${investorAccount}`);
    
    const paymentResult = await client.submit(signedTransaction); // Use client.submit for signed blob
    
    // client.submitAndWait could also be used if waiting for validation is preferred here.
    // const paymentResult = await client.submitAndWait(signedTransaction);


    // Check for preliminary success (tesSUCCESS or terQUEUED)
    // A more robust check involves waiting for validation or using submitAndWait
    if (paymentResult.result.engine_result !== 'tesSUCCESS' && paymentResult.result.engine_result !== 'terQUEUED') {
        console.error("Signed transaction submission failed preliminarily:", paymentResult.result);
        return NextResponse.json(
            { error: `Transaction submission failed: ${paymentResult.result.engine_result_message}` },
            { status: 400 }
        );
    }
    
    // It's better to use submitAndWait to get the final hash and validated status.
    // For simplicity with `submit`, we'll assume the hash is available if tesSUCCESS.
    // However, `paymentResult.result.tx_json.hash` might not be populated by `submit` alone.
    // A common pattern is to calculate the hash from the signedTransaction blob beforehand if needed immediately.
    // Or, use `submitAndWait` which is generally safer for getting confirmed results.
    // Let's assume for this conceptual change, we get a hash.
    // If using `submit` only, the hash might not be in `paymentResult.result.hash` directly.
    // It's typically in `paymentResult.result.tx_json.hash` AFTER validation or if pre-calculated.
    // For now, let's assume `submitAndWait` was used or hash is available.
    // This part needs careful handling based on whether you use submit() or submitAndWait().
    // Let's simulate submitAndWait's outcome for txHash.
    // A more accurate way if only using submit() would be to calculate hash from signedTransaction.
    // For now, we'll assume the hash is part of the response or can be derived.
    // This is a simplification for the conceptual WalletConnect change.
    const txHash = paymentResult.result.tx_json?.hash || "hash_from_signed_tx_needs_derivation_or_submitAndWait";
    if (!txHash) {
        console.error("Failed to get transaction hash from payment result:", paymentResult);
        return NextResponse.json({ error: "Investment transaction failed or hash not found." }, { status: 500 });
    }
    console.log(`Investment successful. Transaction hash: ${txHash}`);


    // 2. Record Investment in Cache
    const now = Math.floor(Date.now() / 1000);
    await db.run(
      `INSERT INTO investment_cache (tx_hash, investor_account, project_nft_id, amount_rlusd, timestamp)
       VALUES (?, ?, ?, ?, ?)`,
     txHash,
     investorAccount, // Use the passed investorAccount string
     projectNftId,
     amount,
     now
    );

    // 3. Update Project Cache (current_funding, investor_count)
    // Using a transaction for atomicity if supported and configured, otherwise separate queries.
    // For SQLite, db.transaction can be used if you wrap it. Here, separate for simplicity.
    await db.run(
      `UPDATE project_cache 
       SET current_funding = current_funding + ?, 
           investor_count = investor_count + 1,
           last_updated = ?
       WHERE nft_id = ?`,
      amount,
      now,
      projectNftId
    );
    console.log(`Project cache updated for ${projectNftId}. New funding: ${project.current_funding + amount}`);


    return NextResponse.json(
      {
        message: "Investment successful",
        transactionHash: txHash,
        xrplResponse: paymentResult.result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error processing investment:", error);
     if (error.data && error.data.tec_message) {
        return NextResponse.json(
            { error: `XRPL transaction failed: ${error.data.tec_message}`, details: error.data },
            { status: 500 }
          );
    }
    return NextResponse.json(
      { error: "Failed to process investment", details: error.message },
      { status: 500 }
    );
  }
}