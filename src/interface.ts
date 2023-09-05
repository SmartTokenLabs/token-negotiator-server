export interface TokenNegotiatorSeverTokenConfigInterface {
  issuers: {
    socios?: {
      collectionID: string;
      consumerKey: string;
      consumerSecret: string;
      redirectURI: string;
      partnerTag: string;
      returnToApplicationURL: string;
    }
  }
}