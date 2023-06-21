import FileSystemHelper from "./helpers/file-system-helper";
import AuthHelper from "./helpers/auth-helper";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import RequestHelper from "./helpers/request-helper";

const main = async () => {
  console.log(
    await RequestHelper.post(
      new URL(
        `https://www.googleapis.com/calendar/v3/calendars/${FileSystemHelper.calendarId}/events/watch`
      ),
      {
        id: "goals_chanel",
        type: "web_hook",
        address: "http://localhost:4000/",
      }
    )
  );
};

const listen = async () => {
  const oauth2Client: OAuth2Client = AuthHelper.getInstance().getAuth();
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  const res = await calendar.events.watch({
    auth: oauth2Client,
    calendarId: FileSystemHelper.calendarId,
    requestBody: {
      id: "goals_chanel",
      type: "web_hook",
      address: "https://c54f-175-176-23-37.ngrok-free.app/",
    },
  });
  console.log(res);
};

listen();
main();
