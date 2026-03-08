import { AxiosError } from 'axios';
import { Alert } from 'react-native';

interface BackendError {
  message: string;
  code?: string;
}

export function handleAxiosErrorWithAlert(error: AxiosError<BackendError>) {
  let title = "Request Failed";
  let message = "Something went wrong. Please try again.";

  if (error.response) {
    /**
     * Logic: Server responded with an error (4xx or 5xx)
     * We try to extract the message sent by our Node.js backend
     */
    title = `Error ${error.response.status}`;
    message = error.response.data?.message || "Server error occurred.";

    // Logic: Specific handling for Unauthorized
    if (error.response.status === 401) {
      title = "Session Expired";
      message = "Please log in again to continue.";
    }

  } else if (error.request) {
    /**
     * Logic: No response was received (Internet is down)
     */
    title = "Network Error";
    message = "Could not connect to the server. Check your internet connection.";
  } else {
    /**
     * Logic: Error happened during request setup
     */
    message = error.message;
  }

  // 1. Log for developers
  console.log(`[API Error] ${title}: ${message}`);

  // 2. Alert for users
  Alert.alert(
    title,
    message,
    [{ text: "OK", onPress: () => console.log("Alert closed") }],
    { cancelable: true }
  );
}