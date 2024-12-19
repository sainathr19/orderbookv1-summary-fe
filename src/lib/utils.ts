import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AssetDetails, SupportedAssets } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateAmount(price: number, rawAmount: string, decimals: number): number {
  const convertedAmount = Number(rawAmount) / Math.pow(10, decimals);
  const totalAmount = price * convertedAmount;
  return totalAmount;
}

export function formatAmount(rawAmount: string, decimals: number): number {
  const convertedAmount = Number(rawAmount) / Math.pow(10, decimals);
  return convertedAmount
}

export const formatDate = (rawDate: string): string => {
  const date = new Date(rawDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
};

export const trimAddress = (address : string) : string => {
  return address.slice(0,4) +".."+  address.slice(-4,-1)
}

export const parseAssetDetails = (
  config: SupportedAssets,
  chainName: string,
  atomicSwapAddress: string
): AssetDetails |null => {

  let network = config.data.networks[chainName];

  if (!network) {
    console.log(`Chain '${chainName}' not found.`);
    return null;
  }

  const assetConfig = network.assetConfig.find(
    (assetEntry) => assetEntry.tokenAddress.toLowerCase() === atomicSwapAddress.toLowerCase()
  );

  if (!assetConfig) {
    console.log(`Asset with atomicSwapAddress '${atomicSwapAddress}' not found on chain '${chainName}'.`);
    return null;
  }

  return {
    symbol: assetConfig.symbol,
    chainLogo: network.networkLogo,
    assetLogo: assetConfig.logo,
  };
};
