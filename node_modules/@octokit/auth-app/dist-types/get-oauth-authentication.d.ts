import { RequestInterface, OAuthOptions, StrategyOptionsWithDefaults, OAuthAccesTokenAuthentication } from "./types";
export declare function getOAuthAuthentication(state: StrategyOptionsWithDefaults, options: OAuthOptions, customRequest?: RequestInterface): Promise<OAuthAccesTokenAuthentication>;
