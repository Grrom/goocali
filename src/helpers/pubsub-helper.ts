import RequestHelper from "./request-helper";
import PubsubMessageParams from "../types/pubsub-message-params";
import { AuthType } from "../types/request-params";

export default class PubsubHelper {
  private constructor() {}

  static publishMessage = async (params: PubsubMessageParams) => {
    RequestHelper.post({
      url: new URL(
        "https://pubsub.googleapis.com/v1/projects/personal-data-system/topics/schedule_starting:publish"
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
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  static initSubscriber = async () => {
    RequestHelper.put({
      url: new URL(
        "https://pubsub.googleapis.com/v1/projects/personal-data-system/subscriptions/schedule_starting_sub_test"
      ),
      body: {
        topic: "projects/personal-data-system/topics/schedule_starting",
        pushConfig: {
          pushEndpoint: "https://test-listener.grrom.repl.co/listener",
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
