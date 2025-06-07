# XRP Ledger Developer Guide for AgriTrust XRPL

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Core Concepts](#core-concepts)
4. [Setting Up Development Environment](#setting-up-development-environment)
5. [Account Management](#account-management)
6. [Payment System](#payment-system)
7. [Token Integration (RLUSD)](#token-integration-rlusd)
8. [Smart Contracts & Hooks](#smart-contracts--hooks)
9. [Data Storage & IPFS Integration](#data-storage--ipfs-integration)
10. [Security Best Practices](#security-best-practices)
11. [Testing](#testing)
12. [Deployment](#deployment)
13. [Common Use Cases](#common-use-cases)
14. [Troubleshooting](#troubleshooting)
15. [Resources](#resources)

## Introduction

The XRP Ledger (XRPL) is a decentralized, public blockchain optimized for fast, low-cost transactions and digital asset exchange. This guide provides comprehensive documentation for developers building on AgriTrust XRPL, an agricultural investment platform that leverages XRPL's capabilities for transparent, secure farming investments.

### Why XRP Ledger for Agricultural Finance?

- **Fast Transactions**: 3-5 second settlement times
- **Low Costs**: Minimal transaction fees (fractions of a penny)
- **Built-in DEX**: Native decentralized exchange functionality
- **Regulatory Clarity**: Clear regulatory framework
- **Sustainability**: Carbon-neutral consensus mechanism
- **Scalability**: 1,500+ transactions per second

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Basic understanding of blockchain concepts
- Familiarity with JavaScript/TypeScript
- Understanding of async/await and Promises

### Key Dependencies

```json
{
  "xrpl": "^3.0.0",
  "@xrplf/isomorphic": "^1.0.1",
  "ripple-lib": "^1.10.1"
}
```

## Core Concepts

### 1. Accounts

Every participant on XRPL has an account identified by a unique address starting with 'r' (e.g., `rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH`).

**Key Properties:**

- **Address**: Public identifier (like a bank account number)
- **Secret/Seed**: Private key for signing transactions
- **Sequence**: Prevents replay attacks
- **Reserve**: Minimum XRP balance required

### 2. Transactions

All actions on XRPL are transactions that must be:

- Cryptographically signed
- Include appropriate fees
- Have correct sequence numbers
- Meet validation requirements

### 3. Ledger

The shared state of all accounts and transactions, updated every 3-5 seconds through consensus.

### 4. Tokens

XRPL supports native tokens through the Trust Lines system. For AgriTrust, we primarily use:

- **XRP**: Native currency for fees
- **RLUSD**: Stablecoin for investments
- **Custom Tokens**: For specific agricultural projects

## Setting Up Development Environment

### 1. Install Dependencies

```bash
npm install xrpl @xrplf/isomorphic
# or
yarn add xrpl @xrplf/isomorphic
# or
pnpm add xrpl @xrplf/isomorphic
```

### 2. Basic Setup

```typescript
// lib/xrpl.ts
import { Client, Wallet, xrpToDrops, dropsToXrp } from "xrpl";

// Environment configuration
export const XRPL_CONFIG = {
  TESTNET_URL: "wss://s.altnet.rippletest.net:51233",
  MAINNET_URL: "wss://xrplcluster.com",
  DEVNET_URL: "wss://s.devnet.rippletest.net:51233",
};

// Initialize client
export class XRPLService {
  private client: Client;
  private isConnected: boolean = false;

  constructor(serverUrl: string = XRPL_CONFIG.TESTNET_URL) {
    this.client = new Client(serverUrl);
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
      this.isConnected = true;
      console.log("Connected to XRPL");
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect();
      this.isConnected = false;
      console.log("Disconnected from XRPL");
    }
  }

  getClient(): Client {
    return this.client;
  }
}
```

### 3. Environment Variables

```env
# .env.local
XRPL_NETWORK=testnet # testnet, mainnet, devnet
XRPL_WALLET_SEED=sYourWalletSeedHere
RLUSD_ISSUER=rRLUSDIssuerAddressHere
NEXT_PUBLIC_XRPL_EXPLORER_URL=https://testnet.xrpl.org
```

## Account Management

### 1. Creating Accounts

```typescript
// lib/account.ts
import { Wallet, Client } from "xrpl";

export class AccountManager {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  // Generate a new wallet
  generateWallet(): Wallet {
    return Wallet.generate();
  }

  // Create wallet from seed
  createWalletFromSeed(seed: string): Wallet {
    return Wallet.fromSeed(seed);
  }

  // Fund account on testnet
  async fundAccount(address: string): Promise<void> {
    const fundResult = await this.client.fundWallet();
    console.log("Account funded:", fundResult);
  }

  // Get account info
  async getAccountInfo(address: string) {
    try {
      const response = await this.client.request({
        command: "account_info",
        account: address,
      });
      return response.result.account_data;
    } catch (error) {
      console.error("Error getting account info:", error);
      throw error;
    }
  }

  // Get account balance
  async getBalance(address: string): Promise<string> {
    const accountInfo = await this.getAccountInfo(address);
    return dropsToXrp(accountInfo.Balance);
  }
}
```

### 2. Wallet Integration Component

```typescript
// components/wallet/wallet-connect.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { XRPLService, AccountManager } from "@/lib/xrpl";

export function WalletConnect() {
  const [wallet, setWallet] = useState<any>(null);
  const [balance, setBalance] = useState<string>("0");
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    try {
      const xrplService = new XRPLService();
      await xrplService.connect();

      const accountManager = new AccountManager(xrplService.getClient());
      const newWallet = accountManager.generateWallet();

      // Fund on testnet
      await accountManager.fundAccount(newWallet.address);

      setWallet(newWallet);
      setIsConnected(true);

      // Get balance
      const balance = await accountManager.getBalance(newWallet.address);
      setBalance(balance);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      {!isConnected ? (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      ) : (
        <div>
          <p>Address: {wallet?.address}</p>
          <p>Balance: {balance} XRP</p>
        </div>
      )}
    </div>
  );
}
```

## Payment System

### 1. Basic Payment Transaction

```typescript
// lib/payments.ts
import { Client, Wallet, xrpToDrops, Payment } from "xrpl";

export class PaymentService {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async sendXRP(
    senderWallet: Wallet,
    destinationAddress: string,
    amount: string
  ): Promise<any> {
    const payment: Payment = {
      TransactionType: "Payment",
      Account: senderWallet.address,
      Destination: destinationAddress,
      Amount: xrpToDrops(amount),
      Fee: "12", // 12 drops (0.000012 XRP)
    };

    try {
      const prepared = await this.client.autofill(payment);
      const signed = senderWallet.sign(prepared);
      const result = await this.client.submitAndWait(signed.tx_blob);

      console.log("Payment successful:", result);
      return result;
    } catch (error) {
      console.error("Payment failed:", error);
      throw error;
    }
  }

  async sendToken(
    senderWallet: Wallet,
    destinationAddress: string,
    amount: string,
    currency: string,
    issuer: string
  ): Promise<any> {
    const payment: Payment = {
      TransactionType: "Payment",
      Account: senderWallet.address,
      Destination: destinationAddress,
      Amount: {
        currency: currency,
        issuer: issuer,
        value: amount,
      },
    };

    try {
      const prepared = await this.client.autofill(payment);
      const signed = senderWallet.sign(prepared);
      const result = await this.client.submitAndWait(signed.tx_blob);

      return result;
    } catch (error) {
      console.error("Token payment failed:", error);
      throw error;
    }
  }
}
```

### 2. Investment Payment Component

```typescript
// components/investment/payment-form.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentService } from "@/lib/payments";

interface PaymentFormProps {
  projectId: string;
  farmerAddress: string;
  minimumInvestment: number;
}

export function PaymentForm({
  projectId,
  farmerAddress,
  minimumInvestment,
}: PaymentFormProps) {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInvestment = async () => {
    setIsProcessing(true);
    try {
      // Implementation would include:
      // 1. Validate amount
      // 2. Create payment transaction
      // 3. Submit to XRPL
      // 4. Record investment in database
      // 5. Update project funding status

      console.log("Investment processing...", {
        projectId,
        amount,
        farmerAddress,
      });
    } catch (error) {
      console.error("Investment failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="amount">Investment Amount (RLUSD)</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min={minimumInvestment}
          placeholder={`Minimum: ${minimumInvestment} RLUSD`}
        />
      </div>

      <Button
        onClick={handleInvestment}
        disabled={isProcessing || !amount}
        className="w-full"
      >
        {isProcessing ? "Processing..." : "Invest Now"}
      </Button>
    </div>
  );
}
```

## Token Integration (RLUSD)

### 1. Trust Line Management

```typescript
// lib/trustlines.ts
import { Client, Wallet, TrustSet } from "xrpl";

export class TrustLineService {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async createTrustLine(
    wallet: Wallet,
    currency: string,
    issuer: string,
    limit?: string
  ): Promise<any> {
    const trustSet: TrustSet = {
      TransactionType: "TrustSet",
      Account: wallet.address,
      LimitAmount: {
        currency: currency,
        issuer: issuer,
        value: limit || "1000000000", // Default limit
      },
    };

    try {
      const prepared = await this.client.autofill(trustSet);
      const signed = wallet.sign(prepared);
      const result = await this.client.submitAndWait(signed.tx_blob);

      console.log("Trust line created:", result);
      return result;
    } catch (error) {
      console.error("Trust line creation failed:", error);
      throw error;
    }
  }

  async getTrustLines(address: string): Promise<any[]> {
    try {
      const response = await this.client.request({
        command: "account_lines",
        account: address,
      });
      return response.result.lines;
    } catch (error) {
      console.error("Error getting trust lines:", error);
      throw error;
    }
  }
}
```

### 2. RLUSD Integration

```typescript
// lib/rlusd.ts
import { PaymentService, TrustLineService } from "@/lib/xrpl";

export class RLUSDService {
  private paymentService: PaymentService;
  private trustLineService: TrustLineService;
  private issuer: string;

  constructor(
    paymentService: PaymentService,
    trustLineService: TrustLineService,
    issuer: string
  ) {
    this.paymentService = paymentService;
    this.trustLineService = trustLineService;
    this.issuer = issuer;
  }

  async setupRLUSDTrustLine(wallet: any): Promise<any> {
    return await this.trustLineService.createTrustLine(
      wallet,
      "RLUSD",
      this.issuer,
      "1000000" // 1M RLUSD limit
    );
  }

  async sendRLUSD(
    senderWallet: any,
    destinationAddress: string,
    amount: string
  ): Promise<any> {
    return await this.paymentService.sendToken(
      senderWallet,
      destinationAddress,
      amount,
      "RLUSD",
      this.issuer
    );
  }

  async getRLUSDBalance(address: string): Promise<string> {
    const trustLines = await this.trustLineService.getTrustLines(address);
    const rlusdLine = trustLines.find(
      (line) => line.currency === "RLUSD" && line.account === this.issuer
    );
    return rlusdLine?.balance || "0";
  }
}
```

## Smart Contracts & Hooks

### 1. Hook Integration for Automated Settlements

```typescript
// lib/hooks.ts
import { Client, Wallet } from "xrpl";

export class HookService {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  // Set up hook for automated profit distribution
  async setupSettlementHook(
    wallet: Wallet,
    hookDefinition: string
  ): Promise<any> {
    const hookTransaction = {
      TransactionType: "SetHook",
      Account: wallet.address,
      Hooks: [
        {
          Hook: {
            HookDefinition: hookDefinition,
            HookApiVersion: 0,
            HookNamespace: "agritrust",
            HookOn: "0xFFFFFFFFFFFFFFFF", // All transaction types
          },
        },
      ],
    };

    try {
      const prepared = await this.client.autofill(hookTransaction);
      const signed = wallet.sign(prepared);
      return await this.client.submitAndWait(signed.tx_blob);
    } catch (error) {
      console.error("Hook setup failed:", error);
      throw error;
    }
  }
}
```

### 2. Automated Settlement Logic

```typescript
// lib/settlement.ts
export class SettlementService {
  private client: Client;
  private paymentService: PaymentService;

  constructor(client: Client, paymentService: PaymentService) {
    this.client = client;
    this.paymentService = paymentService;
  }

  async processSettlement(
    farmerWallet: Wallet,
    projectData: {
      investors: Array<{ address: string; investment: number }>;
      totalReturns: number;
      projectId: string;
    }
  ): Promise<any[]> {
    const results = [];

    for (const investor of projectData.investors) {
      const returnAmount = this.calculateReturn(
        investor.investment,
        projectData.totalReturns
      );

      try {
        const payment = await this.paymentService.sendRLUSD(
          farmerWallet,
          investor.address,
          returnAmount.toString()
        );

        results.push({
          investor: investor.address,
          amount: returnAmount,
          status: "success",
          txHash: payment.hash,
        });
      } catch (error) {
        results.push({
          investor: investor.address,
          amount: returnAmount,
          status: "failed",
          error: error.message,
        });
      }
    }

    return results;
  }

  private calculateReturn(investment: number, totalReturns: number): number {
    // Calculate proportional return based on investment
    // This would include the actual business logic for ROI calculation
    return investment + investment * 0.15; // Example 15% return
  }
}
```

## Data Storage & IPFS Integration

### 1. Document Storage

```typescript
// lib/storage.ts
import { create } from "ipfs-http-client";

export class DocumentStorage {
  private ipfs: any;

  constructor() {
    // Initialize IPFS client
    this.ipfs = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
    });
  }

  async storeDocument(document: File): Promise<string> {
    try {
      const result = await this.ipfs.add(document);
      return result.path; // Returns IPFS hash
    } catch (error) {
      console.error("IPFS storage failed:", error);
      throw error;
    }
  }

  async getDocument(hash: string): Promise<any> {
    try {
      const chunks = [];
      for await (const chunk of this.ipfs.cat(hash)) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    } catch (error) {
      console.error("IPFS retrieval failed:", error);
      throw error;
    }
  }
}
```

### 2. Metadata Transaction

```typescript
// lib/metadata.ts
import { Client, Wallet, Memo } from "xrpl";

export class MetadataService {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async storeMetadata(
    wallet: Wallet,
    projectId: string,
    ipfsHash: string,
    documentType: string
  ): Promise<any> {
    const metadata = {
      project_id: projectId,
      document_type: documentType,
      ipfs_hash: ipfsHash,
      timestamp: new Date().toISOString(),
    };

    const memo: Memo = {
      MemoType: Buffer.from("agritrust/metadata", "utf8").toString("hex"),
      MemoData: Buffer.from(JSON.stringify(metadata), "utf8").toString("hex"),
    };

    const transaction = {
      TransactionType: "Payment",
      Account: wallet.address,
      Destination: wallet.address, // Self-payment for metadata storage
      Amount: "1", // 1 drop
      Memos: [memo],
    };

    try {
      const prepared = await this.client.autofill(transaction);
      const signed = wallet.sign(prepared);
      return await this.client.submitAndWait(signed.tx_blob);
    } catch (error) {
      console.error("Metadata storage failed:", error);
      throw error;
    }
  }
}
```

## Security Best Practices

### 1. Wallet Security

```typescript
// lib/security.ts
import crypto from "crypto";

export class SecurityService {
  // Encrypt sensitive data
  static encrypt(text: string, key: string): string {
    const cipher = crypto.createCipher("aes-256-cbc", key);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  // Decrypt sensitive data
  static decrypt(encryptedText: string, key: string): string {
    const decipher = crypto.createDecipher("aes-256-cbc", key);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  // Validate wallet address
  static isValidXRPAddress(address: string): boolean {
    return /^r[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(address);
  }

  // Generate secure random string
  static generateSecureRandom(length: number = 32): string {
    return crypto.randomBytes(length).toString("hex");
  }
}

// Secure wallet storage
export class SecureWalletManager {
  private static readonly ENCRYPTION_KEY = process.env.WALLET_ENCRYPTION_KEY!;

  static storeWallet(wallet: any, userId: string): string {
    const walletData = JSON.stringify({
      address: wallet.address,
      seed: wallet.seed,
    });

    return SecurityService.encrypt(walletData, this.ENCRYPTION_KEY + userId);
  }

  static retrieveWallet(encryptedData: string, userId: string): any {
    const decryptedData = SecurityService.decrypt(
      encryptedData,
      this.ENCRYPTION_KEY + userId
    );
    return JSON.parse(decryptedData);
  }
}
```

### 2. Transaction Validation

```typescript
// lib/validation.ts
export class TransactionValidator {
  static validatePayment(payment: any): boolean {
    // Basic validation rules
    if (!payment.Account || !payment.Destination) return false;
    if (!payment.Amount || parseFloat(payment.Amount) <= 0) return false;
    if (payment.Account === payment.Destination) return false;

    // Additional business logic validation
    return true;
  }

  static validateInvestmentAmount(
    amount: number,
    minimumInvestment: number,
    availableFunding: number
  ): { valid: boolean; error?: string } {
    if (amount < minimumInvestment) {
      return {
        valid: false,
        error: `Minimum investment is ${minimumInvestment} RLUSD`,
      };
    }

    if (amount > availableFunding) {
      return {
        valid: false,
        error: "Investment amount exceeds available funding",
      };
    }

    return { valid: true };
  }
}
```

## Testing

### 1. Unit Tests

```typescript
// tests/xrpl.test.ts
import { XRPLService, AccountManager } from "@/lib/xrpl";

describe("XRPL Service", () => {
  let xrplService: XRPLService;
  let accountManager: AccountManager;

  beforeEach(() => {
    xrplService = new XRPLService(XRPL_CONFIG.TESTNET_URL);
    accountManager = new AccountManager(xrplService.getClient());
  });

  test("should connect to XRPL testnet", async () => {
    await xrplService.connect();
    expect(xrplService.getClient().isConnected()).toBe(true);
    await xrplService.disconnect();
  });

  test("should generate valid wallet", () => {
    const wallet = accountManager.generateWallet();
    expect(wallet.address).toMatch(/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/);
    expect(wallet.seed).toBeDefined();
  });

  test("should get account balance", async () => {
    await xrplService.connect();
    // Use a known testnet account
    const balance = await accountManager.getBalance("rTestAddress");
    expect(typeof balance).toBe("string");
    await xrplService.disconnect();
  });
});
```

### 2. Integration Tests

```typescript
// tests/integration.test.ts
describe("Payment Integration", () => {
  test("should process investment payment", async () => {
    // Test complete investment flow
    // 1. Create investor wallet
    // 2. Fund wallet
    // 3. Create trust line for RLUSD
    // 4. Make investment payment
    // 5. Verify transaction
  });

  test("should process settlement distribution", async () => {
    // Test settlement flow
    // 1. Create farmer wallet with returns
    // 2. Calculate investor returns
    // 3. Process distribution
    // 4. Verify all payments
  });
});
```

## Deployment

### 1. Environment Configuration

```typescript
// lib/config.ts
export const XRPL_CONFIG = {
  development: {
    server: "wss://s.altnet.rippletest.net:51233",
    explorer: "https://testnet.xrpl.org",
    faucet: "https://faucet.altnet.rippletest.net/accounts",
  },
  production: {
    server: "wss://xrplcluster.com",
    explorer: "https://xrpl.org",
    faucet: null,
  },
};

export const getXRPLConfig = () => {
  const env = process.env.NODE_ENV || "development";
  return XRPL_CONFIG[env as keyof typeof XRPL_CONFIG];
};
```

### 2. Production Considerations

```typescript
// lib/production.ts
export class ProductionService {
  // Connection pooling for high availability
  private static clients: Client[] = [];

  static async getClient(): Promise<Client> {
    // Implement client pooling and failover logic
    // Return healthy client from pool
  }

  // Transaction monitoring
  static async monitorTransaction(txHash: string): Promise<any> {
    // Monitor transaction status
    // Implement retry logic
    // Alert on failures
  }

  // Health checks
  static async healthCheck(): Promise<boolean> {
    // Check XRPL connectivity
    // Verify wallet balances
    // Test critical functions
    return true;
  }
}
```

## Common Use Cases

### 1. Investment Flow

```typescript
// Complete investment flow example
export class InvestmentFlow {
  async processInvestment(
    investorWallet: Wallet,
    projectId: string,
    amount: string,
    farmerAddress: string
  ): Promise<any> {
    // 1. Validate investment
    const validation = TransactionValidator.validateInvestmentAmount(
      parseFloat(amount),
      100, // minimum
      10000 // available
    );

    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // 2. Send RLUSD to farmer
    const payment = await this.paymentService.sendRLUSD(
      investorWallet,
      farmerAddress,
      amount
    );

    // 3. Record investment in database
    await this.recordInvestment({
      projectId,
      investorAddress: investorWallet.address,
      amount: parseFloat(amount),
      txHash: payment.hash,
    });

    // 4. Update project funding status
    await this.updateProjectFunding(projectId, parseFloat(amount));

    return payment;
  }
}
```

### 2. Settlement Processing

```typescript
// Automated settlement example
export class SettlementFlow {
  async processProjectSettlement(
    projectId: string,
    totalReturns: number,
    farmerWallet: Wallet
  ): Promise<any> {
    // 1. Get project investors
    const investors = await this.getProjectInvestors(projectId);

    // 2. Calculate returns for each investor
    const settlements = investors.map((investor) => ({
      address: investor.address,
      investment: investor.amount,
      returns: this.calculateReturns(investor.amount, totalReturns),
    }));

    // 3. Process payments
    const results = await this.settlementService.processSettlement(
      farmerWallet,
      { investors: settlements, totalReturns, projectId }
    );

    // 4. Store settlement record on IPFS
    const settlementDoc = await this.createSettlementDocument(results);
    const ipfsHash = await this.documentStorage.storeDocument(settlementDoc);

    // 5. Record settlement on XRPL
    await this.metadataService.storeMetadata(
      farmerWallet,
      projectId,
      ipfsHash,
      "settlement"
    );

    return results;
  }
}
```

## Troubleshooting

### Common Issues

1. **Connection Issues**

   ```typescript
   // Retry connection logic
   async connectWithRetry(maxRetries: number = 3): Promise<void> {
     for (let i = 0; i < maxRetries; i++) {
       try {
         await this.client.connect()
         return
       } catch (error) {
         if (i === maxRetries - 1) throw error
         await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
       }
     }
   }
   ```

2. **Transaction Failures**

   ```typescript
   // Check common failure reasons
   async diagnosePresentmentFailure(error: any): string {
     if (error.code === 'tecUNFUNDED_PAYMENT') {
       return 'Insufficient balance'
     }
     if (error.code === 'tecNO_LINE') {
       return 'Trust line not established'
     }
     if (error.code === 'tecPATH_DRY') {
       return 'No available liquidity path'
     }
     return 'Unknown error'
   }
   ```

3. **Fee Calculation**
   ```typescript
   // Dynamic fee calculation
   async calculateOptimalFee(): Promise<string> {
     const serverInfo = await this.client.request({ command: 'server_info' })
     const baseFee = serverInfo.result.info.validated_ledger.base_fee_xrp
     return xrpToDrops((parseFloat(baseFee) * 1.2).toString()) // 20% buffer
   }
   ```

## Resources

### Official Documentation

- [XRPL.org Documentation](https://xrpl.org/docs.html)
- [XRPL JavaScript Library](https://js.xrpl.org/)
- [XRPL Dev Tools](https://xrpl.org/dev-tools.html)

### Development Tools

- [XRP Testnet Faucet](https://faucet.altnet.rippletest.net/accounts)
- [XRPL Explorer](https://livenet.xrpl.org/)
- [Transaction Sender](https://xrpl.org/tx-sender.html)

### Community Resources

- [XRPL Discord](https://discord.gg/sfX3ERAMjH)
- [GitHub Repository](https://github.com/XRPLF/xrpl.js)
- [Stack Overflow - XRPL Tag](https://stackoverflow.com/questions/tagged/xrp-ledger)

### AgriTrust Specific

- Project GitHub: [Coming Soon]
- API Documentation: [Coming Soon]
- Support: [Coming Soon]

---

**Next Steps:**

1. Set up your development environment
2. Generate test accounts on testnet
3. Implement basic payment functionality
4. Add RLUSD token support
5. Integrate with your existing AgriTrust platform
6. Test thoroughly before mainnet deployment

For additional support, refer to the XRPL community resources or contact the AgriTrust development team.
