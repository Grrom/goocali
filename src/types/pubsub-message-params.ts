enum ScheduleEventType {
  starting = "starting",
  ending = "ending",
}

type PubsubMessageParams = {
  title: string;
  message?: string;
  description?: string;
  type: ScheduleEventType;
  topic: string;
};

export { ScheduleEventType };
export default PubsubMessageParams;
