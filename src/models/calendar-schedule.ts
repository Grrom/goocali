export default class CalendarSchedule {
  title: string;
  startTime: Date;
  endTime: Date;

  constructor(fromAPi: any) {
    this.title = fromAPi["summary"];
    this.startTime = CalendarSchedule.isoStringToUTC8(
      fromAPi["start"]["dateTime"]
    );
    this.endTime = CalendarSchedule.isoStringToUTC8(fromAPi["end"]["dateTime"]);
  }

  private static isoStringToUTC8 = (isoString: string) => {
    const date = new Date(isoString);
    date.setHours(date.getHours() + 8);
    return date;
  };
}
