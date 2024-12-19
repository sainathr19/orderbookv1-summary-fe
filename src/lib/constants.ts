import { SupportedAssets } from "./types";

export const DEFAULT_ASSETS : SupportedAssets = {
    "data": {
      "networks": {
        "bitcoin": {
          "chainId": 2,
          "fillerAddresses": [
            "bc1qhww67feqfdf6xasjat88x5stqa6vzx0c6fgtnj"
          ],
          "networkLogo": "https://garden-finance.imgix.net/chain_images/bitcoin.svg",
          "explorer": "https://mempool.space/",
          "networkType": "mainnet",
          "assetConfig": [
            {
              "name": "Bitcoin",
              "decimals": 8,
              "symbol": "BTC",
              "baseFees": 5000,
              "logo": "https://garden-finance.imgix.net/token-images/bitcoin.svg",
              "coinGeckoId": "bitcoin",
              "tokenAddress": "primary",
              "atomicSwapAddress": ""
            }
          ]
        },
        "bitcoin_testnet": {
          "chainId": 3,
          "fillerAddresses": [
            "tb1q3rfu7wn2m83trw068w78yqe6palnh0zweq3fe3"
          ],
          "networkLogo": "https://garden-finance.imgix.net/token-images/bitcoin.svg",
          "explorer": "https://mempool.space/testnet/",
          "networkType": "testnet",
          "assetConfig": [
            {
              "name": "Bitcoin",
              "decimals": 8,
              "symbol": "BTC",
              "baseFees": 1000,
              "logo": "https://garden-finance.imgix.net/token-images/bitcoin.svg",
              "coinGeckoId": "bitcoin",
              "tokenAddress": "primary",
              "atomicSwapAddress": ""
            }
          ]
        },
        "ethereum": {
          "chainId": 1,
          "fillerAddresses": [
            "0x9DD9C2D208B07Bf9A4eF9CA311F36d7185749635"
          ],
          "networkLogo": "https://garden-finance.imgix.net/chain_images/ethereum.svg",
          "explorer": "https://etherscan.io/",
          "networkType": "mainnet",
          "assetConfig": [
            {
              "name": "Wrapped Bitcoin",
              "decimals": 8,
              "symbol": "WBTC",
              "baseFees": 10000,
              "logo": "https://garden-finance.imgix.net/token-images/wbtc.svg",
              "coinGeckoId": "wrapped-bitcoin",
              "tokenAddress": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
              "atomicSwapAddress": "0xA5E38d098b54C00F10e32E51647086232a9A0afD"
            },
            {
              "name": "Swell Bitcoin",
              "decimals": 8,
              "symbol": "swBTC",
              "baseFees": 10000,
              "logo": "https://garden-finance.imgix.net/token-images/swbtc.svg",
              "coinGeckoId": "swell-restaked-btc",
              "tokenAddress": "0x8DB2350D78aBc13f5673A411D4700BCF87864dDE",
              "atomicSwapAddress": "0x45Fb0001329072896A7Bcb448E81A6404053BB2F"
            }
          ]
        },
        "ethereum_arbitrum": {
          "chainId": 42161,
          "fillerAddresses": [
            "0x9DD9C2D208B07Bf9A4eF9CA311F36d7185749635"
          ],
          "networkLogo": "https://garden-finance.imgix.net/chain_images/arbitrum.svg",
          "explorer": "https://arbiscan.io/",
          "networkType": "mainnet",
          "assetConfig": [
            {
              "name": "Wrapped Bitcoin",
              "decimals": 8,
              "symbol": "WBTC",
              "baseFees": 0,
              "logo": "https://garden-finance.imgix.net/token-images/wbtc.svg",
              "coinGeckoId": "wrapped-bitcoin",
              "tokenAddress": "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
              "atomicSwapAddress": "0x203DAC25763aE783Ad532A035FfF33d8df9437eE"
            },
            {
              "name": "DLC Bitcoin",
              "decimals": 8,
              "symbol": "dlcBTC",
              "baseFees": 0,
              "logo": "https://garden-finance.imgix.net/token-images/dlcBTCIcon.svg",
              "coinGeckoId": "dlcbtc",
              "tokenAddress": "0x050c24dbf1eec17babe5fc585f06116a259cc77a",
              "atomicSwapAddress": "0x4f4ef08bc134258b7d09fffdf5de096353f376f1"
            }
          ]
        },
        "ethereum_arbitrum_sepolia": {
          "chainId": 421614,
          "fillerAddresses": [
            "0x0205ed605dc5f032be4c709e01dd1f38ddfc3beb"
          ],
          "networkLogo": "https://garden-finance.imgix.net/chain_images/arbitrumSepolia.svg",
          "explorer": "https://sepolia.arbiscan.io",
          "networkType": "testnet",
          "assetConfig": [
            {
              "name": "DLC Bitcoin",
              "decimals": 8,
              "symbol": "dlcBTC",
              "baseFees": 0,
              "logo": "https://garden-finance.imgix.net/token-images/dlcBTCIcon.svg",
              "coinGeckoId": "dlcbtc",
              "tokenAddress": "0x685437f025c5f33a94818408c286bc1f023201fc",
              "atomicSwapAddress": "0xa2c0765b408b2edf7579bf03514cb2c9ec6daeaf"
            }
          ]
        },
        "ethereum_sepolia": {
          "chainId": 11155111,
          "fillerAddresses": [
            "0x1b7119fe340ff9fFb99492DdE9C9044389BfE387"
          ],
          "networkLogo": "https://garden-finance.imgix.net/chain_images/sepolia.svg",
          "explorer": "https://sepolia.etherscan.io/",
          "networkType": "testnet",
          "assetConfig": [
            {
              "name": "Wrapped Bitcoin",
              "decimals": 8,
              "symbol": "WBTC",
              "baseFees": 0,
              "logo": "https://garden-finance.imgix.net/token-images/wbtc.svg",
              "coinGeckoId": "wrapped-bitcoin",
              "tokenAddress": "0x3d1e56247033fe191dc789b5838e366dc04b1b73",
              "atomicSwapAddress": "0x9ceD08aeE17Fbc333BB7741Ec5eB2907b0CA4241"
            }
          ]
        }
      }
    }
  }