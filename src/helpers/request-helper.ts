import RequestParams, { AuthType } from "../types/request-params";
import AuthHelper from "./auth-helper";
import FileSystemHelper from "./file-system-helper";
import fetch, { Response } from "node-fetch";

export default class RequestHelper {
  private static getAuthToken = async (type: AuthType): Promise<string> => {
    if (type === AuthType.pubsub) {
      return AuthHelper.getInstance().getPubsubAuth();
    }
    if (type === AuthType.gcalendar) {
      await AuthHelper.getInstance().checkAndRefreshToken();
      return (
        await AuthHelper.getInstance().getGCalendarAuth().getAccessToken()
      ).token!;
    }

    return FileSystemHelper.getTokenDetails().authToken;
  };

  public static async get({ url, authType }: RequestParams): Promise<Response> {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${await this.getAuthToken(authType)}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  }

  public static async post({
    url,
    body,
    authType,
  }: RequestParams): Promise<Response> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await this.getAuthToken(authType)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response;
  }

  public static async put({
    url,
    body,
    authType,
  }: RequestParams): Promise<Response> {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${await this.getAuthToken(authType)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  }

  public static async delete({
    url,
    authType,
  }: RequestParams): Promise<Response> {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${await this.getAuthToken(authType)}`,
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  }
}
