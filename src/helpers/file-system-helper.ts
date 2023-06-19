import fs from "fs";
import TokenDetails from "../types/token-details";
import { Credentials } from "google-auth-library/build/src/auth/credentials";
import dotenv from "dotenv";
import ClientData from "../types/client-data";

dotenv.config(); //turn this into a singleton and invoke once in constructor

export default class FileSystemHelper {
  private static readonly tokenDetailsPath =
    process.env.TOKEN_DETAILS_PATH ?? "token-details.json";

  static getTokenDetails = (): TokenDetails => {
    const jsonString = fs.readFileSync(this.tokenDetailsPath, "utf8");
    const jsonObject = JSON.parse(jsonString);

    return jsonObject;
  };

  static getClientData = (): ClientData => {
    return {
      clientId: process.env.CLIENT_ID ?? "",
      clientSecret: process.env.CLIENT_SECRET ?? "",
      redirectUri: process.env.REDIRECT_URI ?? "",
    };
  };

  static getAuthListenerPort = (): number =>
    parseInt(process.env.AUTH_LISTENER_PORT ?? "") || 4000;

  static saveAuthToken = (tokens: Credentials) => {
    const tokenDetails: TokenDetails = this.getTokenDetails();
    tokenDetails.authToken = tokens.access_token!;
    tokenDetails.refreshToken = tokens.refresh_token!;
    tokenDetails.tokenExpiryInMillis = tokens.expiry_date!;

    fs.writeFileSync(this.tokenDetailsPath, JSON.stringify(tokenDetails));
  };
}
