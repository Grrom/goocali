import fs from "fs";
import TokenDetails from "../types/token-details";
import dotenv from "dotenv";
import ClientData from "../types/client-data";
import { Credentials } from "google-auth-library";

dotenv.config(); //turn this into a singleton and invoke once in constructor

export default class FileSystemHelper {
  private static readonly tokenDetailsPath =
    process.env.TOKEN_DETAILS_PATH ?? "token-details.json";
  static readonly calendarId = process.env.CALENDAR_ID ?? "";
  static readonly receivingUrl = process.env.RECEIVING_URL ?? "";
  static readonly port = process.env.PORT ?? 4000;

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

  static saveAuthToken = (tokens: Credentials) => {
    const tokenDetails: TokenDetails = this.getTokenDetails();
    tokenDetails.authToken = tokens.access_token!;
    tokenDetails.refreshToken = tokens.refresh_token!;
    tokenDetails.tokenExpiryInMillis = tokens.expiry_date!;

    fs.writeFileSync(this.tokenDetailsPath, JSON.stringify(tokenDetails));
  };
}
