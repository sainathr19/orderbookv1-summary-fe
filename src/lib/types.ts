export interface SingleSwap {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    initiatorAddress: string;
    redeemerAddress?: string | null;
    chain: string;
    asset: string;
    amount: string;
    priceByOracle : number
  }

  export interface MatchedOrder {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    InitiatorAtomicSwapID: number;
    FollowerAtomicSwapID: number;
    initiatorAtomicSwap: SingleSwap;
    followerAtomicSwap: SingleSwap;
    userBtcWalletAddress?: string | null;
    tags? : string[],
    maker : string,
    taker : string
  }
  
  export interface AssetConfig {
    name: string;
    decimals: number;
    symbol: string;
    baseFees: number;
    logo: string;
    tokenAddress: string;
    atomicSwapAddress: string;
    coinGeckoId : string
  }
  
  export interface Network {
    chainId: number;
    fillerAddresses: string[];
    networkLogo: string;
    explorer: string;
    networkType: "testnet" | "mainnet";
    assetConfig: AssetConfig[];
  }
  
  export interface SupportedAssets {
    data : {
      networks: {
        [key: string]: Network;
      };
    }
  }
  

  export interface AssetDetails {
    symbol: string;
    chainLogo: string;
    assetLogo: string;
  };