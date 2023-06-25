import schedule, { Job } from "node-schedule";
import PubsubHelper from "../helpers/pubsub-helper";
import PubsubMessageParams, {
  ScheduleEventType,
} from "../types/pubsub-message-params";
import ScheduleManager from "../helpers/schedule-manager";

export default class CalendarSchedule {
  title: string;
  description: string | undefined;
  startTime: Date;
  endTime: Date;
  eventStarting?: Job;
  eventEnding?: Job;

  constructor(fromAPi: any) {
    this.title = fromAPi["summary"];
    this.startTime = new Date(fromAPi["start"]["dateTime"]);
    this.endTime = new Date(fromAPi["end"]["dateTime"]);
    this.description = fromAPi["description"];
  }

  pubsubStartMessage(): PubsubMessageParams {
    return {
      title: this.title,
      message: `Schedule starting: ${this.title}`,
      description: this.description,
      type: ScheduleEventType.starting,
    };
  }

  pubsubEndMessage(): PubsubMessageParams {
    return {
      title: this.title,
      message: `Schedule ending: ${this.title}`,
      description: this.description,
      type: ScheduleEventType.ending,
    };
  }

  stopjobs() {
    this.eventStarting?.cancel();
    this.eventEnding?.cancel();
  }

  scheduleJobs() {
    this.eventStarting = schedule.scheduleJob(this.startTime, () => {
      PubsubHelper.publishMessage(this.pubsubStartMessage());
      console.log(`Event starting: ${this.title} ${this.startTime}`);
    });

    this.eventEnding = schedule.scheduleJob(this.endTime, () => {
      PubsubHelper.publishMessage(this.pubsubEndMessage());
      console.log(`Event ending: ${this.title} ${this.endTime}`);
      this.handleEndingSchedule(this.title);
    });

    console.log(`Scheduled jobs: ${this.title}`);
  }

  handleEndingSchedule(schedule: string) {
    switch (schedule) {
      case "sleep":
        ScheduleManager.getInstance().rescheduleJobs();
        break;
      default:
        break;
    }
  }
}
