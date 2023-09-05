export interface SociosFungibleResponseTokenInterface {
  id:string
  totalBalance: string
  currencyNetwork: {
    id:string;
    shortCode: string;
    symbol: string;
    precision: number;
    networkType: string
  }
  blockchainAddress: string
}

export interface SociosNonFungibleResponseTokenInterface {
  summary: {
    collectibleId: string;
    name: string;
    description: string;
    imageUrl: string;
    animationUrl: string;
    externalUrl: string;
    backgroundColor: string;
    metadataUrl: string;
    supplyPosition: number;
    totalSupply: number;
  },
  blockchain: {
    tokenId: string;
    blockchainType: string;
    networkType: string;
    collectionId: string;
    smartContractAddress: string;
    isVerifiedSmartContract: boolean
  }
}
