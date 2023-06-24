import schedule, { Job } from "node-schedule";

export default class CalendarSchedule {
  title: string;
  startTime: Date;
  endTime: Date;
  eventStarting: Job;
  eventEnding: Job;

  constructor(fromAPi: any) {
    this.title = fromAPi["summary"];
    this.startTime = new Date(fromAPi["start"]["dateTime"]);
    this.endTime = new Date(fromAPi["end"]["dateTime"]);

    this.eventStarting = schedule.scheduleJob(this.startTime, () => {
      console.log(`Event starting: ${this.title} ${this.startTime}`);
    });

    this.eventEnding = schedule.scheduleJob(this.endTime, () => {
      console.log(`Event ending: ${this.title} ${this.endTime}`);
    });
  }

  stopjobs() {
    this.eventStarting.cancel();
    this.eventEnding.cancel();
  }
}
