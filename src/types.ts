export interface Credentials {
  username?: string;
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  accessToken?: string;
}

export interface Options {
  isTesting?: boolean;
  verbose?: boolean;
}
