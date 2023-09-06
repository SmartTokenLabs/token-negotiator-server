// node-fetch is to become a fully native feature of Node Js (leading to the decision to use this lib alternative options).
import fetch from "node-fetch";
import "dotenv/config";
import { SociosFungibleResponseTokenInterface, SociosNonFungibleResponseTokenInterface } from './interface.js'
import { TokenNegotiatorSeverTokenConfigInterface } from './../interface.js'

export class Socios {
  constructor(private tokenConfig: TokenNegotiatorSeverTokenConfigInterface) {}
  public formatFungibleTokenResponse (tokens:SociosFungibleResponseTokenInterface[]) {
    if(!tokens || tokens === null) return [];
    const output = tokens.map((balanceObj:SociosFungibleResponseTokenInterface) => {
      return {
        api: 'socios',
        title: balanceObj.currencyNetwork.symbol,
        symbol: balanceObj.currencyNetwork.shortCode,
        decimals: balanceObj.currencyNetwork.precision,
        image: undefined, // TODO fetch this data from secondary API (as per suggestion from Socios team)
        balance: balanceObj.totalBalance,
        data: balanceObj
      }
    })
    return output
  }
  public formatNonFungibleTokenResponse (tokens: SociosNonFungibleResponseTokenInterface[]) {
    if(!tokens || tokens === null) return [];
    const output = tokens.map((token:SociosNonFungibleResponseTokenInterface) => {
      return {
        api: 'socios',
        blockchain: token.blockchain.blockchainType,
        tokenId: token.blockchain.tokenId,
        title: token.summary.name,
        image: token.summary.imageUrl,
        description: token.summary.description,
        symbol: undefined,
        attributes: undefined,
        externalUrl: token.summary.externalUrl,
        smartContract: token.blockchain.smartContractAddress,
        collection: token.blockchain.collectionId,
        tokenUri: token.summary.metadataUrl,
        meta: token.summary.metadataUrl
      }
    })
    return output
  }
  public async getAccessToken(temporaryCode:string) {
    const clientId = this.tokenConfig?.issuers?.socios?.consumerKey;
    const clientSecret = this.tokenConfig?.issuers?.socios?.consumerSecret;
    const redirectURI = this.tokenConfig?.issuers?.socios?.redirectURI;
    const grantType = 'authorization_code';
    const url = 'https://partner.socios.com/oauth2/token';
    const body = new URLSearchParams({
      grant_type: grantType ?? '',
      code: temporaryCode ?? '',
      client_id: clientId ?? '',
      client_secret: clientSecret ?? '',
      redirect_uri: redirectURI ?? ''
    });

    const res = await fetch(url, {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return res.json();
  }
  public async getFungibleTokenBalance(accessToken: string) {
    try {
      const response = await fetch('https://api-public.socios.com/wallet/1.0.0/user/wallet', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.warn('network response failed')
        return [];
        // throw new Error('Network response was not ok');
      }

      const result:any = await response.json();

      if (result.data) {
        return this.formatFungibleTokenResponse(result.data);
      } else {
        return [];
      }
    } catch (error) {
      console.error('Failed to collect token balance from Socios API: ', error);
      // throw error;
      return [];
    }
  }
  public async getNonFungibleTokens(accessToken:string) {
    try {
      const response = await fetch('https://api-public.socios.com/nft/1.0.0/user/nfts', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.warn('network response failed')
        return [];
        // throw new Error('Network response was not ok');
      }

      const result: any = await response.json();

      if (result.data) {
        return this.formatNonFungibleTokenResponse(result.data);
      } else {
        return [];
      }
    } catch (error) {
      console.error('Failed to collect tokens from Socios API: ', error);
      // throw error;
      return [];
    }
  }

  // public async getSignMessage(accessToken:string, message:string) {}
  // public async getVoucherCode(accessToken:string, voucherCode:string) {}
  
}

