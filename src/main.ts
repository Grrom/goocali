import GCalendarHelper from "./helpers/g-calendar-helper";
import { Response, Request } from "express";

const express = require("express");
const app = express();

const PORT = 8000;

GCalendarHelper.getCalendarSchedules();

app.post("/webhook", async (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`⚡Server is running here 👉 http://localhost:${PORT}`);
});
