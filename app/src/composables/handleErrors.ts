import useNotificationMessage from "src/composables/notificationMessage";

export default function useHandleErrors(
  errorCode: number,
  errors: {[p: string]: unknown},
) :boolean{
  let shouldRedirectToLogin = false;
  if (errorCode === 500) {
    useNotificationMessage('error','An error occurred, please try again or contact IT support!')
  } else if (errorCode === 401) {
    useNotificationMessage('error','There is no user in the system with the entered email and password!')
    shouldRedirectToLogin = true;
  } else if (errorCode === 422) {
    for (const [, value] of Object.entries(errors)) {
      Array(value).map(el=> {
        useNotificationMessage('error',String(el))
      })
    }
  }
  return shouldRedirectToLogin;
};
