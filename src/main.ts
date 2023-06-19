import FileSystemHelper from "./helpers/file-system-helper";
import AuthHelper from "./helpers/auth-helper";

const main = async () => {
  let tokenDetails = FileSystemHelper.getTokenDetails();
  let authHelper = AuthHelper.getInstance();

  if (await AuthHelper.needsToReInitializeToken()) {
    tokenDetails = FileSystemHelper.getTokenDetails();
    authHelper = AuthHelper.getInstance();
  }
};

main();
