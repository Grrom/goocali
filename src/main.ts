import { Response, Request } from "express";
import ScheduleManager from "./helpers/schedule-manager";
import express from "express";
import FileSystemHelper from "./helpers/file-system-helper";
import GCalendarHelper from "./helpers/g-calendar-helper";

const app = express();
const PORT = FileSystemHelper.port;

app.post("/webhook", async (req: Request, res: Response) => {
  ScheduleManager.getInstance().rescheduleJobs();
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`⚡Server is running here 👉 http://localhost:${PORT}`);
});

GCalendarHelper.watchCalendar();
ScheduleManager.getInstance().scheduleJobs();
