import { setAccessTokenCookie } from './utils/index.js'
import { TokenNegotiatorSeverTokenConfigInterface } from './interface.js'
export class Server {
  public socios: any;
  public utils: any = {
    setAccessTokenCookie
  }
  constructor(private tokenConfig: TokenNegotiatorSeverTokenConfigInterface) { this.initSocios(); }
  async initSocios() {
    if (this.tokenConfig.issuers.socios) {
      const {Socios} = await import("./socios/index.js");
      this.socios = new Socios(this.tokenConfig);
    }
  }
}