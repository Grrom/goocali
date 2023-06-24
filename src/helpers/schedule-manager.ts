import CalendarSchedule from "../models/calendar-schedule";
import GCalendarHelper from "./g-calendar-helper";

export default class ScheduleManager {
  private static instance: ScheduleManager;

  private schedules: Map<String, CalendarSchedule>;

  constructor() {
    this.schedules = new Map<String, CalendarSchedule>();
  }

  static getInstance(): ScheduleManager {
    if (!this.instance) {
      this.instance = new ScheduleManager();
    }
    return this.instance;
  }

  private saveJob(key: string, value: CalendarSchedule): void {
    this.schedules.set(key, value);
    console.log(`Saved job: ${key}`);
  }

  getJob(key: string): CalendarSchedule {
    const schedule = this.schedules.get(key);
    if (!schedule) {
      throw new Error(`Dependency not found: ${key}`);
    }
    return schedule;
  }

  scheduleJobs = async () => {
    const schedules = await GCalendarHelper.getCalendarSchedules();
    schedules.forEach((schedule) => {
      this.saveJob(schedule.title, schedule);
    });
  };

  cancelJobs() {
    while (this.schedules.size > 0) {
      const [key, value] = this.schedules.entries().next().value;
      this.schedules.values().next().value.stopjobs();
      console.log(`Cancelled job: ${value.title}`);
      this.schedules.delete(key);
    }
  }
}
