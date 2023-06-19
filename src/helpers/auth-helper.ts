import { google } from "googleapis";
import { Credentials, OAuth2Client } from "google-auth-library";
import FileSystemHelper from "./file-system-helper";
import tokenStatus from "../types/token-status";
import TokenDetails from "../types/token-details";
import ClientData from "../types/client-data";

export default class AuthHelper {
  private refreshToken: string;
  private clientId: string;
  private redirectUri: string;
  private clientSecret: string;
  private tokenExpiryInMillis: number;

  private oauth2Client: OAuth2Client;

  private static instance: AuthHelper;

  scopes: string[] = [
    "https://www.googleapis.com/auth/fitness.activity.read",
    "https://www.googleapis.com/auth/fitness.sleep.read",
  ];

  private constructor() {
    const tokenDetails: TokenDetails = FileSystemHelper.getTokenDetails();
    const clientData: ClientData = FileSystemHelper.getClientData();

    this.clientId = clientData.clientId;
    this.refreshToken = tokenDetails.refreshToken;
    this.redirectUri = clientData.redirectUri;
    this.clientSecret = clientData.clientSecret;
    this.tokenExpiryInMillis = tokenDetails.tokenExpiryInMillis;

    this.oauth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.redirectUri
    );
  }

  static getInstance = (): AuthHelper => {
    if (!this.instance) {
      this.instance = new AuthHelper();
      return this.instance;
    }
    return this.instance;
  };

  static needsToReInitializeToken = async () => {
    try {
      switch (this.instance.checkTokenStatus()) {
        case tokenStatus.expired:
          await this.instance.refreshAuthToken();
          console.log("Sync token refresh complete");
          return true;
        case tokenStatus.expiringSoon:
          this.instance.refreshAuthToken().then(() => {
            console.log("Async token refresh complete");
          });
          return false;
        case tokenStatus.active:
        default:
          console.log("No need to refresh token");
          return false;
      }
    } catch (error) {
      console.log("Error refreshing token: ", error);
    }
  };

  checkTokenStatus = (): tokenStatus => {
    const currentTime = new Date().getTime();
    const expirationThreshold = 0.1 * 60 * 60 * 1000;
    const expirationThresholdTime =
      this.tokenExpiryInMillis - expirationThreshold;

    if (this.tokenExpiryInMillis <= currentTime) return tokenStatus.expired;
    if (expirationThresholdTime <= currentTime) return tokenStatus.expiringSoon;
    return tokenStatus.active;
  };

  refreshAuthToken = async () => {
    this.oauth2Client.setCredentials({
      refresh_token: this.refreshToken,
    });
    let response = await this.oauth2Client.refreshAccessToken();

    FileSystemHelper.saveAuthToken(response.credentials);
    console.log("Auth token refreshed!");
  };

  exchangeAuthCodeForTokens = async (
    authCode: string
  ): Promise<Credentials> => {
    let { tokens }: { tokens: Credentials } = await this.oauth2Client.getToken(
      authCode
    );
    return tokens;
  };

  generateAuthLink = (): URL => {
    const authorizationUrl = this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: this.scopes,
      include_granted_scopes: true,
    });

    return new URL(authorizationUrl);
  };
}
