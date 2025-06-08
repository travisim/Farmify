export const XRPL_NETWORKS = {
  testnet: "wss://s.altnet.rippletest.net:51233",
  mainnet: "wss://xrplcluster.com",
  devnet: "wss://s.devnet.rippletest.net:51233",
};

export interface NetworkConfig {
  server: string;
  explorer: string;
  faucet?: string | null;
}

export const XRPL_ENVIRONMENT_CONFIG: {
  development: NetworkConfig;
  production: NetworkConfig;
  test: NetworkConfig;
} = {
  development: {
    server: XRPL_NETWORKS.devnet, // Using devnet for development as per plan.MD general direction
    explorer: "https://devnet.xrpl.org",
    faucet: "https://faucet.devnet.rippletest.net/accounts",
  },
  production: {
    server: XRPL_NETWORKS.mainnet,
    explorer: "https://livenet.xrpl.org", // Corrected from xrpl.org to livenet.xrpl.org for consistency
    faucet: null,
  },
  test: {
    server: XRPL_NETWORKS.testnet,
    explorer: "https://testnet.xrpl.org",
    faucet: "https://faucet.altnet.rippletest.net/accounts",
  },
};

export function getXRPLConfig(): NetworkConfig {
  const env = process.env.NODE_ENV || "development";
  if (env === "production") {
    return XRPL_ENVIRONMENT_CONFIG.production;
  } else if (env === "test") {
    return XRPL_ENVIRONMENT_CONFIG.test;
  }
  return XRPL_ENVIRONMENT_CONFIG.development;
}

export const RLUSD_ISSUER_ADDRESS_TESTNET =
  process.env.NEXT_PUBLIC_RLUSD_ISSUER_ADDRESS_TESTNET ||
  "rRLUSDIssuerAddressPlaceholder"; // Placeholder, should be in .env

export const RLUSD_CURRENCY_CODE = "RLUSD";

// Placeholder for admin/notary account that will be used for settlement verification
export const ADMIN_NOTARY_WALLET_SEED = process.env.ADMIN_NOTARY_WALLET_SEED || "sEdTXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"; // THIS IS A PLACEHOLDER