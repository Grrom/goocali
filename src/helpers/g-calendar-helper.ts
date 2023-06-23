import CalendarSchedule from "../models/calendar-schedule";
import FileSystemHelper from "./file-system-helper";
import RequestHelper from "./request-helper";

export default class GCalendarHelper {
  private constructor() {}

  private static stopWatcher = async ({
    channelId,
    resourceId,
  }: {
    channelId: string;
    resourceId: string;
  }) => {
    return RequestHelper.post({
      url: new URL("https://www.googleapis.com/calendar/v3/channels/stop"),
      body: {
        id: channelId,
        resourceId: resourceId,
      },
    });
  };

  static getCalendarSchedules = async (): Promise<CalendarSchedule[]> => {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const timeMin = now.toISOString();
    const timeMax = endOfDay.toISOString();

    const schedules = await RequestHelper.get({
      url: new URL(
        `https://www.googleapis.com/calendar/v3/calendars/${FileSystemHelper.calendarId}/events?timeMin=${timeMin}&timeMax=${timeMax}`
      ),
    });

    const parsedSchedules = await schedules.json();
    const calendarSchedules = parsedSchedules.items.map(
      (schedule: any) => new CalendarSchedule(schedule)
    );

    return calendarSchedules;
  };

  static assignJobs = async () => {};

  static getResource = async () => {
    const resourceUri =
      "https://www.googleapis.com/calendar/v3/calendars/5e40d62696c3c0af6e74e5dc3c97521a1cc84f2ea5757eba38d9bcd3e9851271@group.calendar.google.com/events?alt=json";
    const resourceResponse = await RequestHelper.get({
      url: new URL(resourceUri),
    });
    console.log(resourceResponse);
  };

  static watchCalendar = async () => {
    const today = new Date();
    const yesterday = new Date();

    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    yesterday.setDate(today.getDate() - 1);

    const todayChannelId = today.getTime().toString();
    const yesterdayChannelId = yesterday.getTime().toString();

    const watchResponse = await RequestHelper.post({
      url: new URL(
        `https://www.googleapis.com/calendar/v3/calendars/${FileSystemHelper.calendarId}/events/watch`
      ),
      body: {
        id: todayChannelId,
        type: "web_hook",
        address: FileSystemHelper.receivingUrl,
      },
    });

    const parsedWatchResponse = await watchResponse.json();

    if (parsedWatchResponse.error) {
      console.log(parsedWatchResponse.error.message);
    } else {
      console.log("Started watcher for today's channel");

      const resourceId = parsedWatchResponse.resourceId;
      const watcherStopResponse = await this.stopWatcher({
        channelId: yesterdayChannelId,
        resourceId: resourceId,
      });
      if (watcherStopResponse.status === 204) {
        console.log("Stopped watcher for yesterday's channel");
      }
    }
  };
}
