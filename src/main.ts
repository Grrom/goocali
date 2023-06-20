import FileSystemHelper from "./helpers/file-system-helper";
import AuthHelper from "./helpers/auth-helper";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const main = async () => {
  let tokenDetails = FileSystemHelper.getTokenDetails();
  let authHelper = AuthHelper.getInstance();

  await AuthHelper.needsToReInitializeToken();

  listEvents(authHelper.getAuth());
};

async function listEvents(auth: OAuth2Client) {
  const calendar = google.calendar({ version: "v3", auth });
  const res = await calendar.events.list({
    calendarId: FileSystemHelper.calendarId,
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log("No upcoming events found.");
    return;
  }
  console.log("Upcoming 10 events:");
  events.map((event, i) => {
    const start = event.start!.dateTime || event.start!.date;
    console.log(`${start} - ${event.summary}`);
  });
}

main();
