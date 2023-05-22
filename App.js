import { StatusBar } from "expo-status-bar";
import { Alert, Button, Platform, StyleSheet, View } from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

// how the notification should be handle by the device
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
    };
  },
});

export default function App() {
  useEffect(() => {
    const configurePushNotifications = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission required",
          "Push notifications need the appropriate permissions."
        );
        return;
      }
      // Returns an Expo token that can be used to send a push notification to the device using Expo's push notifications service.

      const pushTokenData = await Notifications.getExpoPushTokenAsync();
      console.log(pushTokenData);

      // app is running on android or not
      if (Platform.OS === "android") {
        // find which Notifications should be received there.

        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          // set the highest priority notification which can annoyed to the user so make sure only important notifications should give highest priority
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    };

    configurePushNotifications();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (notification) => {
        console.log(notification);
      }
    );

    // user has to interaction with notification

    const sub2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
        const username = response.notification.request.content.data.userName;
        console.log(username);
      }
    );

    return () => {
      subscription.remove();
      sub2.remove();
    };
  }, []);

  const scheduleNotificationHandler = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "My first local notification",
        body: "This is the body of the notification.",
        data: { userName: "Ana de Armas" },
      },
      trigger: {
        seconds: 5,
      },
    });
  };

  const sendPushNotificationsHandler = () => {
    // http request
  };

  return (
    <View style={styles.container}>
      <Button
        title="Schedule Notifications"
        onPress={scheduleNotificationHandler}
      />
      <Button
        style={{ margin: 10 }}
        title="Push Notification"
        onPress={sendPushNotificationsHandler}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
