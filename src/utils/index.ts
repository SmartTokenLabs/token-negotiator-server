export const setAccessTokenCookie = (response:any, name:string, value:any, ) => {   
    const expiresIn = value.expires_in * 1000;
    response.cookie(`tn-oauth2-access-token-${name}`, value.access_token, { maxAge: expiresIn, httpOnly: true, secure: true });
    response.cookie(`tn-oauth2-expiry-${name}`, value.expires_in, { maxAge: expiresIn, secure: false });
}


