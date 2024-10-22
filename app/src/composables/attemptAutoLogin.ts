import {useAuthenticatedUserStore} from "stores/authUserStore";
import useNotificationMessage, {NotificationType} from "src/composables/notificationMessage";

export default async function useAttemptAutoLogin() {
  const userStore = useAuthenticatedUserStore();
  const isUserSessionActive = await userStore.autoLogin();

  if(!isUserSessionActive){
    useNotificationMessage(NotificationType.ERROR,'Your session expired, please log in again!');
    return false
  }else{
    return true;
  }

}
