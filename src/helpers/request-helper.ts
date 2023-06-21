import AuthHelper from "./auth-helper";
import FileSystemHelper from "./file-system-helper";
import fetch from "node-fetch";

export default class RequestHelper {
  private static getAuthToken = async () => {
    await AuthHelper.checkAndRefreshToken();
    return FileSystemHelper.getTokenDetails().authToken;
  };

  public static async get<T>(url: URL): Promise<T> {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${await this.getAuthToken()}`,
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  }

  public static async post<T>(url: URL, body: object): Promise<T> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await this.getAuthToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  }

  public static async put<T>(url: URL, body: object): Promise<T> {
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

  public static async delete<T>(url: URL): Promise<T> {
    const response = await fetch(url, {
      method: "DELETE",
    });
    return await response.json();
  }
}
