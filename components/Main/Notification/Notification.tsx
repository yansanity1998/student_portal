import React, { useEffect, useRef } from 'react';
import { View, Text, Button, Platform, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';


// 1. GLOBAL CONFIGURATION (Must be at the top level of the file)
// This ensures notifications are handled everywhere, even when backgrounded.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// 2. RESPONSE LISTNER moved inside component for better lifecycle management

/**
 * Utility function to schedule a local notification with sound and high importance.
 * This ensures it appears even when the phone is "off" (locked) and plays a sound.
 */
export async function schedulePushNotification(title: string, body: string, data?: any) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      data: data || { screen: 'Notification', detail: 'This came from the system tray!' },
      sound: true, // Enable sound
      priority: Notifications.AndroidNotificationPriority.MAX, // High priority for system tray/lock screen
      sticky: false, // Ensure it can be cleared by user
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5, 
    },
  });
}

/**
 * Function to register for push notifications and set up Android channels.
 * Channels are crucial for sound and importance on Android.
 */
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    // Create a notification channel for Android (Mandatory for sound/importance)
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC, // Show on lock screen
      sound: 'default', // Use default sound
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get notification permissions! Go to settings to enable them.');
      return;
    }
    
    try {
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (projectId) {
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log('Push Token:', token);
      } else {
        console.warn('Project ID not found in app.json - Push notifications (external) will not work, but local ones should.');
      }
    } catch (e) {
      console.error('Error getting push token:', e);
    }
  } else {
    console.log('Must use physical device for Push Notifications (External). Local notifications may still work on some simulators.');
  }

  return token;
}

const Notification = () => {
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        await registerForPushNotificationsAsync();
        
        // Detailed logging for debugging
        console.log('Notifications registered. Scheduling sample...');
        
        // Trigger a static sample notification immediately when the compone    nt mounts
        await schedulePushNotification(
          "Welcome to ICI Portal! 🚀",
          "If you see this, notifications are working!"
        );
      } catch (error) {
        console.error('Failed to setup notifications:', error);
      }
    };

    setupNotifications();

    // Listener for when a notification is received (foreground)
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification Received in Foreground:', notification);
    });

    // 2. RESPONSE LISTNER (Capture Click action)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const { title, body } = response.notification.request.content;
      console.log('User Tapped a Notification!', response);
      alert(`User Clicked!\n\nTitle: ${title}\nBody: ${body}`);
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>
      <Text style={styles.description}>
        Notifications are configured with high priority and sound. 
        They will appear on your lock screen.
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Test Notification"
          onPress={async () => {
            await schedulePushNotification(
              "ICI Portal Alert! 🔔",
              "This is a test notification with sound and high priority."
            );
          }}
          color="#0B8B82"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  }
});

export default Notification;
