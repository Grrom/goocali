enum AuthType {
  pubsub,
  gcalendar,
}

type RequestParams = {
  url: URL;
  body?: object;
  authType: AuthType;
};

export { AuthType };
export default RequestParams;
