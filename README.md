# `token-negotiator-server`

The Token Negotiator provides the client gateway to connect user digital tokens from on or off chain sources, enabling developers to create bespoke tokenised web experiences. 

The Token Negotiator Server extends the capabilities of Token Negotiator for Web Applications Server Side.

## Usage

```js
​	​
// Server Side Configuration

import { Server } from "@tokenscript/token-negotiator-server";

const negotiatorServer = new Server({
  issuers: {
    socios: {
      collectionID: string, // to match the client configs collectionID
      consumerKey: string, // your socios API consumer key
      consumerSecret: string, // your socios API consumer secret 
      partnerTag: string, // your socios API partner tag
      redirectURI: string, // your socios API application redirect_uri
      returnToApplicationURL: string, // re-direct on Oauth2 success
    }
  }
});

// example redirectURI configuration end point
app.get("/user-login-callback", async (request, response) => { 

    // retrieve access token
    const accessTokenData = await tokenNegotiatorServer.socios.getAccessToken(request.query.code, response);

    // set token
    tokenNegotiatorServer.utils.setAccessTokenCookie(
      response,
      'socios',
      accessTokenData
    );

    // navigate back to the application page including the wallet provider details.
    response.redirect(`${process.env.SOCIOS_RETURN_TO_APP_URL}`);
});

// example user-balance configuration end point
app.get("/user-balance", cors(), async (request, response) => {
  const output = await tokenNegotiatorServer.socios.getFungibleTokenBalance(request.cookies['tn-oauth2-access-token-socios']);
  response.json(output);
});

// example user-nfts configuration end point
app.get("/user-nfts", cors(), async (request, response) =>{
  const output = await tokenNegotiatorServer.socios.getNonFungibleTokens(request.cookies['tn-oauth2-access-token-socios']);
  response.json(output);
});
​
// Client Side Configuration

import { Client } from "@tokenscript/token-negotiator";

const negotiatorClient = new Client({
  type: "active", // active mode is required to connect to the Socios Wallet
  issuers: [
    onChain: true, // set onChain to true (blockchain tokens via API, Oauth2 flow)
    fungible: true, // set to true / false based on the collection
    chain: "eth", // set to 'eth' for Socios (current version)
    blockchain: "evm", // set to 'evm' for Socios (current version)
    collectionID: "socios", // chose a unique name in your applications issuers to identfiy the tokens from
    contract: "0x3506424F91fD33084466F402d5D97f05F8e3b4AF", // Chiliz Smart Contract
    oAuth2options: {
      consumerKey: "...", // your Socios API consumer key
      redirectURI: "http://localhost:5000/user-login-callback", // your Socios API redirect URI
      partnerTag: "smarttokenlabs", // your Socios API partner tag name
      returnToApplicationURL: "/index.html", // re-direct on Oauth2 success
      endpoints: { // end points to your web application. 
        redirectURI: {
          path: "http://localhost:5000/user-login-callback", // end point to your defined redirect URI (to complete the Oauth2 verification)
          params: {}
        },
        userBalance: {
          path: 'http://localhost:5000/user-balance', // end point to check a users balance
          params: {}
        },
        userNfts: {
          path: 'http://localhost:5000/user-nfts', // end point to check the users NFT balance
          params: {}
        },
        userLogout: {
          path: 'http://localhost:5000/user-logout', // end point to log a user out
          params: {}
        }
      }
    }
  ],
  uiOptions: {
    openingHeading:
      "Open a new world of perks, benefits and opportunities with your Socios tokens.",
    issuerHeading: "Get discount with Socios Tokens",
    repeatAction: "try again",
    position: "top-right"
  }
});

negotiatorClient.negotiate();

negotiatorClient.on("tokens-selected", (tokens) => {
  console.log("tokens-selected", tokens);
});

```

## Documentation

See https://tokenscript.gitbook.io/token-negotiator/


