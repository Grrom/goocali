import RequestHelper from "./request-helper";
import PubsubMessageParams from "../types/pubsub-message-params";
import { AuthType } from "../types/request-params";
import SubscriberParams from "../types/subscriber-params";

export default class PubsubHelper {
  private constructor() {}

  static publishMessage = async (params: PubsubMessageParams) => {
    RequestHelper.post({
      url: new URL(
        `https://pubsub.googleapis.com/v1/projects/personal-data-system/topics/${params.topic}:publish`
      ),
      body: {
        messages: [
          {
            attributes: params,
          },
        ],
      },
      authType: AuthType.pubsub,
    })
      .then((response) => {
        if (response.status === 200)
          console.log(`Message ${params.title} published.`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  static initSubscribers = async () => {
    //use this to create dynamically create subscriptions, or just create them manually from the gcloud console

    this.initSubscriber({
      subscription: "calendar_sub",
      topic: "schedule_starting",
      pushEndpoint: "https://test-listener.grrom.repl.co/listener",
    });
    this.initSubscriber({
      subscription: "send_alert_sub",
      topic: "send_alert",
      pushEndpoint: "https://test-listener.grrom.repl.co/listener",
    });
  };

  private static initSubscriber = async ({
    subscription,
    topic,
    pushEndpoint,
  }: SubscriberParams) => {
    RequestHelper.put({
      url: new URL(
        `https://pubsub.googleapis.com/v1/projects/personal-data-system/subscriptions/${subscription}`
      ),
      body: {
        topic: `projects/personal-data-system/topics/${topic}`,
        pushConfig: {
          pushEndpoint: pushEndpoint,
        },
      },
      authType: AuthType.pubsub,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
}
