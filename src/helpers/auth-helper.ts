import { google } from "googleapis";
import { exec } from "child_process";
import { OAuth2Client } from "google-auth-library";
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

    this.oauth2Client.setCredentials({
      refresh_token: tokenDetails.refreshToken,
      access_token: tokenDetails.authToken,
    });
  }

  static getInstance = (): AuthHelper => {
    if (!this.instance) {
      this.instance = new AuthHelper();
      return this.instance;
    }
    return this.instance;
  };

  getGCalendarAuth = (): OAuth2Client => {
    if (!this.oauth2Client) {
      throw "AuthHelper not initialized!";
    }
    return this.oauth2Client;
  };

  checkAndRefreshToken = async () => {
    try {
      switch (this.checkTokenStatus()) {
        case tokenStatus.expired:
          await this.refreshAuthToken();
          console.log("Sync token refresh complete");
          return true;
        case tokenStatus.expiringSoon:
          this.refreshAuthToken().then(() => {
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

  getPubsubAuth = async (): Promise<string> => {
    const command = "gcloud auth print-access-token";
    return await new Promise((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          resolve(stdout.trim());
        }
      });
    });
  };
}
