# WalletConnect Developer Guide

## Overview

WalletConnect is a comprehensive protocol suite that enables secure, encrypted communication between decentralized applications (dApps) and crypto wallets across different platforms and blockchain networks. This guide provides detailed technical documentation for developers implementing WalletConnect 2.0 in their applications.

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Core API Deep Dive](#core-api-deep-dive)
4. [Client APIs](#client-apis)
5. [Server Components](#server-components)
6. [Data Structures & Protocols](#data-structures--protocols)
7. [Authentication Systems](#authentication-systems)
8. [Implementation Guide](#implementation-guide)
9. [Advanced Features](#advanced-features)
10. [Security Considerations](#security-considerations)
11. [Best Practices](#best-practices)
12. [Error Handling](#error-handling)
13. [Testing & Debugging](#testing--debugging)
14. [Performance Optimization](#performance-optimization)
15. [Troubleshooting](#troubleshooting)
16. [Migration Guide](#migration-guide)
17. [API Reference](#api-reference)

## Introduction

WalletConnect 2.0 is a revolutionary protocol suite that fundamentally transforms how decentralized applications interact with crypto wallets. Built on a foundation of security, interoperability, and user experience, it provides:

### Core Capabilities

- **Secure Communication**: End-to-end encrypted messaging using ChaCha20-Poly1305 encryption
- **Cross-Platform Support**: Seamless operation across web, mobile, and desktop environments
- **Multi-Chain Compatibility**: Support for multiple blockchain networks through standardized interfaces
- **Protocol Agnostic**: Single pairing supports multiple protocols (Sign, Auth, Push, Chat)
- **Decentralized Architecture**: No single point of failure with distributed relay network
- **Identity Management**: Blockchain-based identity with device-specific key management

### Key Innovations

- **Universal Pairing**: One QR code scan enables multiple protocol interactions
- **Session Persistence**: Maintain connections across app restarts and network changes
- **Push Notifications**: Real-time updates for on-chain and off-chain events
- **Wallet-to-Wallet Chat**: Direct encrypted messaging between blockchain accounts
- **Domain Verification**: Cryptographic proof of dApp authenticity

### Development Status

⚠️ **Important**: All features are under active development and subject to change. The protocol specifications are experimental and constantly evolving. Developers should expect breaking changes and regularly update their implementations.

### Protocol Foundation

WalletConnect 2.0 operates on a **publish-subscribe messaging pattern** with **topic-based routing**, enabling efficient message delivery across a decentralized network of relay servers.

## Architecture Overview

WalletConnect 2.0 consists of several interconnected components:

### Client-Side Components

- **Sign API**: Remote signer protocol for secure wallet-dApp communication
- **Notify API**: Push notification protocol for off-chain and on-chain events
- **Chat API**: Direct messaging protocol between wallets
- **Core API**: Shared modules across all high-level APIs

### Server-Side Components

- **Relay Server**: Routes messages using publish-subscribe pattern
- **Keys Server**: Indexes Chat invite keys and verifies identity ownership
- **Push Server**: Observes messages via Relay Server webhooks
- **Notify Server**: Tracks encryption keys and publishes messages
- **Verify Server**: Authenticates attestation origins
- **Blockchain API**: Handles blockchain interactions and identity resolution

## Core API Deep Dive

The Core API forms the foundation of WalletConnect 2.0, providing essential infrastructure modules that all higher-level APIs depend on. Understanding these components is crucial for effective implementation.

### Architecture Principles

- **Modular Design**: Each API module has a specific responsibility
- **Shared Infrastructure**: Common functionality reduces code duplication
- **Extensibility**: New protocols can leverage existing core modules
- **Security First**: All modules implement security best practices

## Client APIs

### Core API

The Core API consolidates essential modules shared across all WalletConnect APIs:

#### Relay API

- Low-level publish-subscribe messaging
- Decentralized message routing between peers
- Encoded message transmission

#### Crypto API

- Keychain management
- X25519 shared symmetric key derivation
- ChaCha20-Poly1305 encryption/decryption
- Ed25519 did-jwt authentication

#### Storage API

- Persistent data storage for state management
- Simple key-value storage interface
- Cross-API data sharing

#### Pairing API

- Lightweight encrypted communication layer
- Protocol-agnostic peer connections
- Secure channel for protocol proposals

#### Sync API

- Multi-client private data synchronization
- Single signature authentication
- Cross-device data accessibility

#### Verify API

- Domain origin attestation
- Message content verification
- Relay server attestation registration

#### Identity API

- Identity key registration/management
- Blockchain account representation
- Device-specific identity handling

### Sign API

The Sign API enables secure transaction signing between wallets and dApps:

**Key Features:**

- Remote transaction signing
- Session management
- Multi-chain support
- Secure key handling

### Notify API

Push notification protocol for real-time updates:

**Capabilities:**

- Off-chain event notifications
- On-chain event monitoring
- Cross-platform push delivery
- Encrypted notification content

### Chat API

Direct messaging between wallet users:

**Features:**

- End-to-end encrypted messaging
- Blockchain address-based contacts
- Cross-wallet communication
- Seed phrase recovery support

**User Flow:**

1. Register blockchain account for discoverability
2. Invite other wallet users via blockchain address
3. Establish mutually approved chat threads
4. Exchange encrypted messages

## Server Components

### Relay Server

- **Function**: Message routing between clients
- **Pattern**: Publish-subscribe with topic-based routing
- **Protocol**: Decentralized messaging network

### Keys Server

- **Function**: Chat invite key indexing
- **Verification**: Identity key ownership validation
- **Discovery**: Contact discoverability management

### Push Server

- **Function**: Message observation for clients
- **Method**: Webhook integration with Relay Server
- **Purpose**: Notification delivery management

### Notify Server

- **Function**: Encryption key tracking
- **Publishing**: Message publication to Relay Server
- **Security**: Client key management

### Verify Server

- **Function**: Attestation origin authentication
- **Validation**: JSON-RPC payload verification
- **Security**: Domain origin confirmation

### Blockchain API

- **Function**: Multi-blockchain interaction
- **Services**: Identity resolution, ENS interactions
- **Data**: Transaction history management

## Implementation Guide

### Basic Setup

1. **Install WalletConnect SDK**

```bash
npm install @walletconnect/client
```

2. **Initialize Client**

```javascript
import { Client } from "@walletconnect/client";

const client = await Client.init({
  projectId: "your-project-id",
  metadata: {
    name: "Your App Name",
    description: "Your App Description",
    url: "https://your-app.com",
    icons: ["https://your-app.com/icon.png"],
  },
});
```

### Pairing Flow

The Pairing API enables multi-protocol communication over a single connection:

**User Flow Example:**

1. Website displays QR code or deep link
2. User scans QR code or redirects to wallet
3. Session proposal and authentication request appear
4. User approves session and authenticates
5. User returns to website after success
6. Authentication and sign session established

**Implementation:**

```javascript
// Create pairing
const { uri } = await client.core.pairing.create();

// Display QR code with URI
displayQRCode(uri);

// Listen for session proposals
client.on("session_proposal", handleSessionProposal);
```

### Session Management

```javascript
// Approve session
await client.approve({
  id: proposalId,
  namespaces: {
    eip155: {
      accounts: ["eip155:1:0x..."],
      methods: ["eth_sendTransaction", "personal_sign"],
      events: ["accountsChanged", "chainChanged"],
    },
  },
});

// Send transaction request
const result = await client.request({
  topic: sessionTopic,
  chainId: "eip155:1",
  request: {
    method: "eth_sendTransaction",
    params: [transactionObject],
  },
});
```

## Authentication

### dApp Authentication

For Notify API integration, dApps must host authentication keys:

**DID Document Structure:**

```json
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:web:app.example.com",
  "verificationMethod": [
    {
      "id": "did:web:app.example.com#wc-notify-subscribe-key",
      "type": "JsonWebKey2020",
      "controller": "did:web:app.example.com",
      "publicKeyJwk": {
        // Subscribe key details
      }
    },
    {
      "id": "did:web:app.example.com#wc-notify-authentication-key",
      "type": "JsonWebKey2020",
      "controller": "did:web:app.example.com",
      "publicKeyJwk": {
        // Authentication key details
      }
    }
  ],
  "authentication": ["did:web:app.example.com#wc-notify-authentication-key"]
}
```

**Hosting Requirements:**

- Host `did.json` under `.well-known` path
- Example: `https://app.example.com/.well-known/did.json`
- Include both subscribe and authentication keys

## Best Practices

### Security

1. **Always verify domain origins** using the Verify API
2. **Implement proper key management** with secure storage
3. **Use end-to-end encryption** for all sensitive communications
4. **Validate all incoming requests** before processing

### User Experience

1. **Minimize QR code scans** by using Pairing API effectively
2. **Provide clear session information** to users
3. **Handle connection states gracefully** with proper error handling
4. **Implement reconnection logic** for network interruptions

### Performance

1. **Cache pairing sessions** to avoid repeated connections
2. **Implement efficient message handling** to prevent bottlenecks
3. **Use appropriate timeouts** for network requests
4. **Monitor connection health** and implement heartbeat mechanisms

### Development

1. **Test on multiple wallet providers** for compatibility
2. **Implement comprehensive error handling** for all scenarios
3. **Use TypeScript** for better type safety
4. **Follow semantic versioning** for API updates

## Troubleshooting

### Common Issues

**Connection Problems:**

- Verify project ID configuration
- Check network connectivity
- Ensure proper relay server access
- Validate metadata format

**Authentication Failures:**

- Verify DID document hosting
- Check key format and encoding
- Ensure proper domain configuration
- Validate signature algorithms

**Session Management:**

- Monitor session expiration
- Handle disconnection events
- Implement proper cleanup
- Manage multiple sessions correctly

**Message Delivery:**

- Check topic subscription
- Verify message encoding
- Monitor relay server status
- Implement retry mechanisms

### Debug Tools

1. **Enable debug logging** in development
2. **Monitor network requests** for API calls
3. **Use browser developer tools** for web debugging
4. **Implement health check endpoints** for server monitoring

### Support Resources

- **Documentation**: [WalletConnect Specs](https://specs.walletconnect.com/2.0/)
- **GitHub**: Official repositories and issue tracking
- **Discord**: Community support and discussions
- **Examples**: Reference implementations and demos

## Conclusion

WalletConnect 2.0 provides a robust foundation for wallet-dApp communication with its comprehensive API suite. By following this guide and implementing best practices, developers can create secure, user-friendly applications that leverage the full potential of the WalletConnect ecosystem.

Remember that all features are under active development, so stay updated with the latest specifications and changes through the official documentation and community channels.

## Data Structures & Protocols

### Message Format Specification

WalletConnect 2.0 uses standardized message formats for all communications:

#### Base Message Structure

```typescript
interface BaseMessage {
  id: number; // Unique message identifier
  jsonrpc: "2.0"; // JSON-RPC version
  method: string; // Method name
  params: any; // Method parameters
}

interface ResponseMessage {
  id: number; // Matching request ID
  jsonrpc: "2.0"; // JSON-RPC version
  result?: any; // Success result
  error?: {
    // Error details
    code: number;
    message: string;
    data?: any;
  };
}
```

#### Envelope Structure

All messages are wrapped in encrypted envelopes:

```typescript
interface Envelope {
  type: number; // Message type identifier
  sealed: string; // Encrypted payload (base64)
  iv: string; // Initialization vector
  sealbox: string; // Sealed box for key exchange
}
```

### Protocol Specifications

#### Session Proposal Protocol

```typescript
interface SessionProposal {
  id: number;
  params: {
    id: number;
    pairingTopic: string;
    expiry: number;
    requiredNamespaces: Record<string, Namespace>;
    optionalNamespaces?: Record<string, Namespace>;
    relays: Relay[];
    proposer: {
      publicKey: string;
      metadata: Metadata;
    };
  };
}

interface Namespace {
  chains?: string[]; // Supported chains
  methods: string[]; // Required methods
  events: string[]; // Required events
  accounts?: string[]; // Account addresses
}
```

#### Session Settlement Protocol

```typescript
interface SessionSettle {
  relay: Relay;
  namespaces: Record<string, Namespace>;
  requiredNamespaces: Record<string, Namespace>;
  optionalNamespaces: Record<string, Namespace>;
  pairingTopic: string;
  expiry: number;
  controller: {
    publicKey: string;
    metadata: Metadata;
  };
}
```

### Chat Protocol Data Structures

#### Invite Proposal Structure

```typescript
interface ChatInviteProposal {
  id: number;
  params: {
    message: string; // Opening message
    inviterAccount: string; // Blockchain account
    inviteeAccount: string; // Target account
    inviterPubKey: string; // Public key for encryption
    timestamp: number;
  };
}
```

#### Chat Message Structure

```typescript
interface ChatMessage {
  timestamp: number;
  type: "text" | "media" | "reaction";
  content: string;
  author: string; // Sender account
  reference?: string; // Referenced message ID
}
```

### Notify Protocol Data Structures

#### Subscription Structure

```typescript
interface NotifySubscription {
  topic: string;
  account: string;
  relay: Relay;
  metadata: {
    name: string;
    description: string;
    url: string;
    icons: string[];
  };
  scope: Record<string, ScopeValue>;
  expiry: number;
  symKey: string;
}

interface ScopeValue {
  description: string;
  enabled: boolean;
}
```

#### Notification Structure

```typescript
interface Notification {
  id: string;
  topic: string;
  params: {
    id: string;
    account: string;
    notification: {
      type: string;
      title: string;
      body: string;
      icon?: string;
      url?: string;
    };
  };
}
```

## Authentication Systems

### JWT-Based Authentication

WalletConnect uses did-jwt (Decentralized Identifier JSON Web Tokens) for authentication across all protocols.

#### Standard JWT Claims

All WalletConnect JWTs include these mandatory fields:

```typescript
interface WalletConnectJWT {
  iat: number; // Issued at timestamp
  exp: number; // Expiration timestamp (iat + 30 days)
  iss: string; // Issuer public key (did:key format)
  ksu: string; // Key server URL for verification
  act: string; // Action intent description
}
```

### Chat Authentication

Chat API requires specific authentication for different message types:

#### Invite Proposal Authentication

```typescript
interface InviteProposalJWT extends WalletConnectJWT {
  sub: string; // Opening message content
  aud: string; // Invitee blockchain account (did:pkh)
  pke: string; // Proposer public key for exchange (did:key)
  act: "invite_proposal";
}
```

**Example JWT Payload**:

```json
{
  "iat": 1640995200,
  "exp": 1643587200,
  "iss": "did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
  "ksu": "https://keys.walletconnect.com",
  "act": "invite_proposal",
  "sub": "Hello! Let's start chatting.",
  "aud": "did:pkh:eip155:1:0x1234567890123456789012345678901234567890",
  "pke": "did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"
}
```

#### Invite Approval Authentication

```typescript
interface InviteApprovalJWT extends WalletConnectJWT {
  sub: string; // Responder public key (did:key)
  aud: string; // Proposer blockchain account (did:pkh)
  act: "invite_approval";
}
```

#### Chat Message Authentication

```typescript
interface ChatMessageJWT extends WalletConnectJWT {
  sub: string; // Message content
  aud: string; // Recipient account
  act: "chat_message";
}
```

#### Chat Receipt Authentication

```typescript
interface ChatReceiptJWT extends WalletConnectJWT {
  sub: string; // Message ID being acknowledged
  aud: string; // Original sender account
  act: "chat_receipt";
}
```

### DID (Decentralized Identifier) Formats

#### DID:KEY Format

Used for cryptographic public keys:

```
did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK
```

#### DID:PKH Format

Used for blockchain account addresses:

```
did:pkh:eip155:1:0x1234567890123456789012345678901234567890
did:pkh:cosmos:cosmoshub-4:cosmos1234567890123456789012345678901234567890
```

#### DID:WEB Format

Used for domain-based identifiers:

```
did:web:app.example.com
```

### Notify API Authentication

#### DApp Authentication Requirements

Notify API requires dApps to host authentication keys as DID documents:

**DID Document Structure**:

```json
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:web:app.example.com",
  "verificationMethod": [
    {
      "id": "did:web:app.example.com#wc-notify-subscribe-key",
      "type": "JsonWebKey2020",
      "controller": "did:web:app.example.com",
      "publicKeyJwk": {
        "kty": "OKP",
        "crv": "Ed25519",
        "x": "base64url-encoded-public-key"
      }
    },
    {
      "id": "did:web:app.example.com#wc-notify-authentication-key",
      "type": "JsonWebKey2020",
      "controller": "did:web:app.example.com",
      "publicKeyJwk": {
        "kty": "OKP",
        "crv": "Ed25519",
        "x": "base64url-encoded-public-key"
      }
    }
  ],
  "authentication": ["did:web:app.example.com#wc-notify-authentication-key"],
  "keyAgreement": ["did:web:app.example.com#wc-notify-subscribe-key"]
}
```

**Hosting Requirements**:

- Host at `https://your-domain.com/.well-known/did.json`
- Ensure HTTPS with valid SSL certificate
- Include both subscribe and authentication keys
- Maintain key rotation procedures

### Multi-Client Identity Management

For applications supporting multiple clients with the same blockchain account:

#### Identity Key Registration

```typescript
interface IdentityRegistration {
  account: string; // Blockchain account
  statement: string; // Human-readable statement
  domain: string; // Application domain
  nonce: string; // Unique nonce
  requestId: string; // Request identifier
  resources?: string[]; // Additional resources
}
```

#### Key Verification Process

1. **Generate Identity Key**: Create Ed25519 key pair for device
2. **Create Registration Message**: Format SIWE-compatible message
3. **Sign with Account**: Use blockchain account to sign message
4. **Submit to Key Server**: Register identity key with signature
5. **Verify Registration**: Key server validates and stores mapping

## Advanced Features

### Session Management

#### Session Lifecycle

```typescript
interface SessionLifecycle {
  // Creation phase
  proposal: SessionProposal;
  settlement: SessionSettle;

  // Active phase
  requests: SessionRequest[];
  events: SessionEvent[];

  // Termination phase
  disconnect: SessionDisconnect;
}
```

#### Session Persistence

```typescript
interface SessionStorage {
  topic: string;
  relay: Relay;
  expiry: number;
  acknowledged: boolean;
  controller: string;
  namespaces: Record<string, Namespace>;
  requiredNamespaces: Record<string, Namespace>;
  optionalNamespaces: Record<string, Namespace>;
  sessionProperties?: Record<string, string>;
}
```

### Event System

#### Event Types

```typescript
type ClientEvents =
  | "session_proposal"
  | "session_request"
  | "session_ping"
  | "session_event"
  | "session_update"
  | "session_extend"
  | "session_delete"
  | "auth_request"
  | "notify_subscription"
  | "notify_message"
  | "chat_invite"
  | "chat_message";
```

#### Event Handlers

```typescript
// Session events
client.on("session_proposal", (event) => {
  // Handle incoming session proposal
  console.log("Session proposal:", event);
});

client.on("session_request", (event) => {
  // Handle transaction request
  console.log("Transaction request:", event);
});

// Auth events
client.on("auth_request", (event) => {
  // Handle authentication request
  console.log("Auth request:", event);
});

// Notify events
client.on("notify_subscription", (event) => {
  // Handle notification subscription
  console.log("Notify subscription:", event);
});

// Chat events
client.on("chat_invite", (event) => {
  // Handle chat invitation
  console.log("Chat invite:", event);
});
```

### Error Handling Patterns

#### Standard Error Codes

```typescript
enum WalletConnectError {
  // Generic errors
  INVALID_METHOD = 1001,
  INVALID_EVENT = 1002,
  INVALID_UPDATE_REQUEST = 1003,
  INVALID_EXTEND_REQUEST = 1004,
  INVALID_SESSION_SETTLE_REQUEST = 1005,

  // Auth errors
  UNAUTHORIZED_METHOD = 3001,
  UNAUTHORIZED_EVENT = 3002,
  UNAUTHORIZED_UPDATE_REQUEST = 3003,
  UNAUTHORIZED_EXTEND_REQUEST = 3004,

  // User errors
  USER_REJECTED = 5000,
  USER_REJECTED_CHAINS = 5001,
  USER_REJECTED_METHODS = 5002,
  USER_REJECTED_EVENTS = 5003,

  // Provider errors
  UNSUPPORTED_CHAINS = 5100,
  UNSUPPORTED_METHODS = 5101,
  UNSUPPORTED_EVENTS = 5102,
  UNSUPPORTED_ACCOUNTS = 5103,
  UNSUPPORTED_NAMESPACE_KEY = 5104,
}
```

#### Error Response Format

```typescript
interface ErrorResponse {
  id: number;
  jsonrpc: "2.0";
  error: {
    code: number;
    message: string;
    data?: {
      details?: string;
      cause?: string;
      stack?: string;
    };
  };
}
```

## Security Considerations

### Cryptographic Security

#### Key Management Best Practices

1. **Secure Key Generation**: Use cryptographically secure random number generators
2. **Key Storage**: Utilize platform-specific secure storage (Keychain, Android Keystore)
3. **Key Rotation**: Implement regular key rotation for long-lived sessions
4. **Forward Secrecy**: Generate new keys for each session
5. **Key Derivation**: Use proper key derivation functions (HKDF)

#### Encryption Standards

- **Symmetric Encryption**: ChaCha20-Poly1305 AEAD
- **Key Exchange**: X25519 Elliptic Curve Diffie-Hellman
- **Digital Signatures**: Ed25519 with did-jwt
- **Hash Functions**: SHA-256 for message integrity

### Network Security

#### Transport Layer Security

- **TLS 1.3**: All communications over HTTPS/WSS
- **Certificate Pinning**: Pin relay server certificates
- **Domain Validation**: Verify dApp domain ownership
- **Message Integrity**: Cryptographic message authentication

#### Relay Server Security

- **Distributed Architecture**: No single point of failure
- **Message Encryption**: End-to-end encryption prevents relay inspection
- **Rate Limiting**: Protection against spam and DoS attacks
- **Topic Isolation**: Messages isolated by cryptographic topics

### Application Security

#### Input Validation

```typescript
// Validate session proposals
function validateSessionProposal(proposal: SessionProposal): boolean {
  // Check required fields
  if (!proposal.params.requiredNamespaces) return false;

  // Validate namespace format
  for (const [key, namespace] of Object.entries(
    proposal.params.requiredNamespaces
  )) {
    if (!namespace.methods || !Array.isArray(namespace.methods)) return false;
    if (!namespace.events || !Array.isArray(namespace.events)) return false;
  }

  // Validate expiry
  if (proposal.params.expiry <= Date.now() / 1000) return false;

  return true;
}
```

#### Permission Management

```typescript
// Implement granular permissions
interface PermissionManager {
  checkMethodPermission(method: string, account: string): boolean;
  checkChainPermission(chainId: string, account: string): boolean;
  requestPermission(permission: Permission): Promise<boolean>;
  revokePermission(permission: Permission): Promise<void>;
}
```

### Privacy Considerations

#### Data Minimization

- **Selective Disclosure**: Only share necessary information
- **Temporary Data**: Clear sensitive data after use
- **Local Storage**: Minimize data stored on device
- **Metadata Protection**: Avoid leaking metadata

#### User Consent

- **Explicit Consent**: Clear user approval for all actions
- **Granular Control**: Fine-grained permission management
- **Revocation Rights**: Easy permission revocation
- **Transparency**: Clear information about data usage

## Testing & Debugging

### Development Environment Setup

#### Test Network Configuration

```typescript
const testConfig = {
  projectId: "test-project-id",
  relayUrl: "wss://relay.walletconnect.com",
  metadata: {
    name: "Test App",
    description: "WalletConnect Test Application",
    url: "https://test.example.com",
    icons: ["https://test.example.com/icon.png"],
  },
};
```

#### Mock Wallet Implementation

```typescript
class MockWallet {
  private sessions: Map<string, Session> = new Map();

  async approveSession(proposal: SessionProposal): Promise<Session> {
    const session = {
      topic: generateTopic(),
      relay: proposal.params.relays[0],
      expiry: Math.floor(Date.now() / 1000) + 86400,
      acknowledged: true,
      controller: "mock-wallet-public-key",
      namespaces: this.buildNamespaces(proposal.params.requiredNamespaces),
      requiredNamespaces: proposal.params.requiredNamespaces,
      optionalNamespaces: proposal.params.optionalNamespaces || {},
    };

    this.sessions.set(session.topic, session);
    return session;
  }

  async handleRequest(request: SessionRequest): Promise<any> {
    switch (request.params.request.method) {
      case "eth_sendTransaction":
        return "0x1234567890abcdef..."; // Mock transaction hash
      case "personal_sign":
        return "0xabcdef1234567890..."; // Mock signature
      default:
        throw new Error(`Unsupported method: ${request.params.request.method}`);
    }
  }
}
```

### Unit Testing

#### Testing Session Management

```typescript
describe("WalletConnect Session Management", () => {
  let client: Client;
  let mockWallet: MockWallet;

  beforeEach(async () => {
    client = await Client.init(testConfig);
    mockWallet = new MockWallet();
  });

  test("should create session proposal", async () => {
    const { uri } = await client.connect({
      requiredNamespaces: {
        eip155: {
          methods: ["eth_sendTransaction"],
          chains: ["eip155:1"],
          events: ["accountsChanged"],
        },
      },
    });

    expect(uri).toMatch(/^wc:[a-f0-9-]+@2/);
  });

  test("should handle session approval", async () => {
    const proposal = await createMockProposal();
    const session = await mockWallet.approveSession(proposal);

    expect(session.acknowledged).toBe(true);
    expect(session.namespaces.eip155).toBeDefined();
  });
});
```

#### Testing Authentication

```typescript
describe("WalletConnect Authentication", () => {
  test("should validate JWT structure", () => {
    const jwt = createMockJWT({
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 2592000,
      iss: "did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
      ksu: "https://keys.walletconnect.com",
      act: "invite_proposal",
    });

    expect(validateJWT(jwt)).toBe(true);
  });
});
```

### Integration Testing

#### End-to-End Testing

```typescript
describe("WalletConnect E2E", () => {
  test("complete pairing and transaction flow", async () => {
    // 1. Create pairing
    const dapp = await Client.init(testConfig);
    const wallet = await Client.init(testConfig);

    // 2. Establish connection
    const { uri } = await dapp.connect({
      requiredNamespaces: {
        eip155: {
          methods: ["eth_sendTransaction"],
          chains: ["eip155:1"],
          events: ["accountsChanged"],
        },
      },
    });

    await wallet.pair({ uri });

    // 3. Approve session
    wallet.on("session_proposal", async (proposal) => {
      await wallet.approve({
        id: proposal.id,
        namespaces: {
          eip155: {
            accounts: ["eip155:1:0x1234..."],
            methods: ["eth_sendTransaction"],
            events: ["accountsChanged"],
          },
        },
      });
    });

    // 4. Send transaction
    const result = await dapp.request({
      topic: sessionTopic,
      chainId: "eip155:1",
      request: {
        method: "eth_sendTransaction",
        params: [{ to: "0x...", value: "0x0" }],
      },
    });

    expect(result).toMatch(/^0x[a-f0-9]{64}$/);
  });
});
```

### Debugging Tools

#### Debug Logging

```typescript
// Enable debug mode
const client = await Client.init({
  ...config,
  logger: "debug",
});

// Custom logger
const customLogger = {
  debug: (message: string, data?: any) =>
    console.log(`[DEBUG] ${message}`, data),
  info: (message: string, data?: any) => console.log(`[INFO] ${message}`, data),
  warn: (message: string, data?: any) =>
    console.warn(`[WARN] ${message}`, data),
  error: (message: string, data?: any) =>
    console.error(`[ERROR] ${message}`, data),
};
```

#### Network Monitoring

```typescript
// Monitor relay messages
client.core.relayer.on("relayer_message", (message) => {
  console.log("Relay message:", {
    topic: message.topic,
    type: message.type,
    timestamp: Date.now(),
  });
});

// Monitor connection state
client.core.relayer.on("relayer_connect", () => {
  console.log("Relay connected");
});

client.core.relayer.on("relayer_disconnect", () => {
  console.log("Relay disconnected");
});
```

## Performance Optimization

### Connection Optimization

#### Connection Pooling

```typescript
class ConnectionPool {
  private connections: Map<string, Client> = new Map();
  private maxConnections = 10;

  async getConnection(config: ClientConfig): Promise<Client> {
    const key = this.generateKey(config);

    if (this.connections.has(key)) {
      return this.connections.get(key)!;
    }

    if (this.connections.size >= this.maxConnections) {
      await this.evictOldestConnection();
    }

    const client = await Client.init(config);
    this.connections.set(key, client);
    return client;
  }
}
```

#### Lazy Loading

```typescript
class LazyWalletConnect {
  private client: Client | null = null;

  async getClient(): Promise<Client> {
    if (!this.client) {
      this.client = await Client.init(config);
    }
    return this.client;
  }

  async connect(options: ConnectOptions): Promise<{ uri: string }> {
    const client = await this.getClient();
    return client.connect(options);
  }
}
```

### Memory Management

#### Session Cleanup

```typescript
class SessionManager {
  private sessions: Map<string, Session> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup expired sessions every hour
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredSessions();
    }, 3600000);
  }

  private cleanupExpiredSessions(): void {
    const now = Math.floor(Date.now() / 1000);

    for (const [topic, session] of this.sessions.entries()) {
      if (session.expiry < now) {
        this.sessions.delete(topic);
        console.log(`Cleaned up expired session: ${topic}`);
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.sessions.clear();
  }
}
```

#### Message Batching

```typescript
class MessageBatcher {
  private queue: Message[] = [];
  private batchSize = 10;
  private flushInterval = 1000; // 1 second

  constructor(private client: Client) {
    setInterval(() => this.flush(), this.flushInterval);
  }

  enqueue(message: Message): void {
    this.queue.push(message);

    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  private async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0, this.batchSize);
    await this.processBatch(batch);
  }
}
```

### Caching Strategies

#### Session Caching

```typescript
class SessionCache {
  private cache = new Map<string, CachedSession>();
  private ttl = 3600000; // 1 hour

  set(topic: string, session: Session): void {
    this.cache.set(topic, {
      session,
      timestamp: Date.now(),
    });
  }

  get(topic: string): Session | null {
    const cached = this.cache.get(topic);

    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(topic);
      return null;
    }

    return cached.session;
  }
}
```

## Migration Guide

### Migrating from WalletConnect v1

#### Key Differences

1. **Protocol Changes**: v2 uses different message formats and encryption
2. **API Structure**: Modular API design vs monolithic v1 client
3. **Session Management**: Enhanced session persistence and recovery
4. **Multi-Protocol**: Single pairing supports multiple protocols

#### Migration Steps

##### 1. Update Dependencies

```bash
# Remove v1 dependencies
npm uninstall @walletconnect/client @walletconnect/qrcode-modal

# Install v2 dependencies
npm install @walletconnect/sign-client @walletconnect/modal
```

##### 2. Update Client Initialization

```typescript
// v1 Initialization
import WalletConnect from "@walletconnect/client";
const connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org",
  qrcodeModal: QRCodeModal,
});

// v2 Initialization
import { SignClient } from "@walletconnect/sign-client";
const client = await SignClient.init({
  projectId: "your-project-id",
  metadata: {
    name: "Your App",
    description: "Your App Description",
    url: "https://your-app.com",
    icons: ["https://your-app.com/icon.png"],
  },
});
```

##### 3. Update Connection Flow

```typescript
// v1 Connection
connector.createSession();
connector.on("connect", (error, payload) => {
  if (error) throw error;
  const { accounts, chainId } = payload.params[0];
});

// v2 Connection
const { uri, approval } = await client.connect({
  requiredNamespaces: {
    eip155: {
      methods: ["eth_sendTransaction", "personal_sign"],
      chains: ["eip155:1"],
      events: ["accountsChanged", "chainChanged"],
    },
  },
});

// Display QR code with uri
const session = await approval();
```

##### 4. Update Request Handling

```typescript
// v1 Requests
connector.sendCustomRequest({
  method: "eth_sendTransaction",
  params: [transactionObject],
});

// v2 Requests
const result = await client.request({
  topic: session.topic,
  chainId: "eip155:1",
  request: {
    method: "eth_sendTransaction",
    params: [transactionObject],
  },
});
```

### Breaking Changes Checklist

- [ ] Update client initialization with project ID
- [ ] Replace bridge URL with relay configuration
- [ ] Update session management to use topics
- [ ] Migrate request/response handling
- [ ] Update event listeners
- [ ] Implement new error handling
- [ ] Update QR code generation
- [ ] Test multi-chain support

## API Reference

### Core Client Methods

#### `Client.init(config: ClientConfig): Promise<Client>`

Initialize WalletConnect client with configuration.

**Parameters:**

- `config.projectId`: Your WalletConnect project ID
- `config.metadata`: App metadata for display in wallets
- `config.relayUrl`: Custom relay server URL (optional)
- `config.logger`: Logging level ("debug" | "info" | "warn" | "error")

#### `client.connect(options: ConnectOptions): Promise<{ uri: string, approval: () => Promise<Session> }>`

Create new session proposal and return pairing URI.

**Parameters:**

- `options.requiredNamespaces`: Required blockchain namespaces
- `options.optionalNamespaces`: Optional blockchain namespaces
- `options.sessionProperties`: Custom session properties

#### `client.request(params: RequestParams): Promise<any>`

Send JSON-RPC request to connected wallet.

**Parameters:**

- `params.topic`: Session topic
- `params.chainId`: Target blockchain
- `params.request`: JSON-RPC request object

#### `client.disconnect(params: DisconnectParams): Promise<void>`

Terminate session connection.

**Parameters:**

- `params.topic`: Session topic
- `params.reason`: Disconnect reason

### Event Types

#### Session Events

- `session_proposal`: New session proposal received
- `session_request`: Transaction request received
- `session_ping`: Ping message received
- `session_event`: Blockchain event received
- `session_update`: Session update received
- `session_extend`: Session extension received
- `session_delete`: Session deletion received

#### Auth Events

- `auth_request`: Authentication request received

#### Notify Events

- `notify_subscription`: Notification subscription created
- `notify_message`: Push notification received

#### Chat Events

- `chat_invite`: Chat invitation received
- `chat_message`: Chat message received

### Error Codes Reference

| Code | Name                | Description           |
| ---- | ------------------- | --------------------- |
| 1001 | INVALID_METHOD      | Method not supported  |
| 1002 | INVALID_EVENT       | Event not supported   |
| 3001 | UNAUTHORIZED_METHOD | Method not authorized |
| 5000 | USER_REJECTED       | User rejected request |
| 5100 | UNSUPPORTED_CHAINS  | Chain not supported   |
| 5101 | UNSUPPORTED_METHODS | Method not supported  |

### Configuration Options

#### Client Configuration

```typescript
interface ClientConfig {
  projectId: string;
  metadata: Metadata;
  relayUrl?: string;
  logger?: LogLevel;
  keychain?: KeyChain;
  storage?: IKeyValueStorage;
}
```

#### Metadata Structure

```typescript
interface Metadata {
  name: string;
  description: string;
  url: string;
  icons: string[];
  verifyUrl?: string;
  redirect?: {
    native?: string;
    universal?: string;
  };
}
```

#### Namespace Configuration

```typescript
interface Namespace {
  chains?: string[];
  methods: string[];
  events: string[];
  accounts?: string[];
  rpcMap?: Record<string, string>;
  defaultChain?: string;
}
```

### Utility Functions

#### Topic Generation

```typescript
function generateTopic(): string {
  return crypto.randomBytes(32).toString("hex");
}
```

#### URI Parsing

```typescript
function parseUri(uri: string): {
  protocol: string;
  topic: string;
  version: string;
  symKey: string;
  relay: Relay;
} {
  // Implementation details...
}
```

#### Validation Helpers

```typescript
function isValidChainId(chainId: string): boolean {
  return /^[-a-z0-9]{3,8}:[-_a-zA-Z0-9]{1,32}$/.test(chainId);
}

function isValidAccountId(accountId: string): boolean {
  return /^[-a-z0-9]{3,8}:[-_a-zA-Z0-9]{1,32}:[-_a-zA-Z0-9]{1,64}$/.test(
    accountId
  );
}
```

This comprehensive guide covers all aspects of WalletConnect 2.0 development, from basic concepts to advanced implementation details. Regular updates to this documentation will be necessary as the protocol continues to evolve.
