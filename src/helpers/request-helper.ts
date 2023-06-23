import RequestParams from "../types/request-params";
import AuthHelper from "./auth-helper";
import FileSystemHelper from "./file-system-helper";
import fetch, { Response } from "node-fetch";

export default class RequestHelper {
  private static getAuthToken = async () => {
    await AuthHelper.checkAndRefreshToken();
    return FileSystemHelper.getTokenDetails().authToken;
  };

  public static async get({ url }: RequestParams): Promise<Response> {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${await this.getAuthToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  }

  public static async post({ url, body }: RequestParams): Promise<Response> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await this.getAuthToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response;
  }

  public static async put({ url, body }: RequestParams): Promise<Response> {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${await this.getAuthToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  }

  public static async delete({ url }: RequestParams): Promise<Response> {
    const response = await fetch(url, {
      method: "DELETE",
    });
    return await response.json();
  }
}
