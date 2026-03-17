import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Alert,
  LogBox,
  ScrollView,
  StatusBar,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Suppress the Expo Go SDK 53+ warning about remote push tokens.
LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications',
  'addPushTokenListener',
  'getExpoPushTokenAsync',
]);

// ─── FOREGROUND HANDLER ──────────────────────────────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ─── GLOBAL CLICK LISTENER (top-level — fires even from lock screen) ─────────
Notifications.addNotificationResponseReceivedListener(response => {
  const { title, body, data } = response.notification.request.content;
  const d = data as any;
  Alert.alert(
    `🔔 ${title}`,
    `${body}\n\n📍 ${d?.room ?? ''}\n⏰ ${d?.time ?? ''}\n🆔 ${d?.id ?? ''}`,
  );
});

// ─── SCHEDULE A LOCAL NOTIFICATION ──────────────────────────────────────────
export async function schedulePushNotification(
  title: string,
  body: string,
  data?: Record<string, any>,
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data ?? {
        source: 'ICI Portal',
        id: 'ICI-NOTIF-001',
      },
      sound: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 3,
    },
  });
}

// ─── SETUP PERMISSIONS + CHANNEL ────────────────────────────────────────────
async function setupNotifications(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('ici-portal', {
      name: 'ICI Portal Alerts',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0B8B82',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      sound: 'default',
      enableVibrate: true,
    });
  }

  if (!Device.isDevice) return true;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    Alert.alert('Permission Required', 'Enable notifications in Settings > Apps > ICI Portal.');
    return false;
  }
  return true;
}

// ─── STATIC NOTIFICATION DATA ────────────────────────────────────────────────
type NotifItem = {
  id: string;
  icon: string;
  title: string;
  body: string;
  time: string;
  room?: string;
  category: string;
  unread: boolean;
};

const STATIC_NOTIFICATIONS: NotifItem[] = [
  {
    id: 'ICI-SCHEDULE-001',
    icon: '📘',
    title: 'Upcoming Class',
    body: 'Advanced Mathematics starts in 15 minutes at Lab 4B.',
    time: '08:15 AM',
    room: 'Lab 4B',
    category: 'Schedule',
    unread: true,
  },
  {
    id: 'ICI-MSG-001',
    icon: '💬',
    title: 'New Message from Prof. Santos',
    body: 'Please submit your assignment by end of day.',
    time: '07:50 AM',
    room: undefined,
    category: 'Message',
    unread: true,
  },
  {
    id: 'ICI-GRADE-001',
    icon: '📝',
    title: 'Grade Released',
    body: 'Your Physics of Motion midterm grade has been posted.',
    time: 'Yesterday',
    room: undefined,
    category: 'Grades',
    unread: false,
  },
  {
    id: 'ICI-ATTENDANCE-001',
    icon: '✅',
    title: 'Attendance Recorded',
    body: 'Your attendance for Computer Science on Monday was marked Present.',
    time: 'Yesterday',
    room: 'Digital Hub',
    category: 'Attendance',
    unread: false,
  },
  {
    id: 'ICI-BILLING-001',
    icon: '💳',
    title: 'Billing Reminder',
    body: 'Your tuition fee payment is due on March 31, 2026.',
    time: 'Mar 15',
    room: undefined,
    category: 'Billing',
    unread: false,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Schedule: '#0B8B82',
  Message: '#3B82F6',
  Grades: '#8B5CF6',
  Attendance: '#10B981',
  Billing: '#F59E0B',
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────
const Notification = () => {
  const foregroundSub = useRef<Notifications.Subscription | null>(null);
  const [notifications, setNotifications] = useState<NotifItem[]>(STATIC_NOTIFICATIONS);

  useEffect(() => {
    const init = async () => {
      const ok = await setupNotifications();
      if (!ok) return;

      // Send the first static notification automatically
      const first = STATIC_NOTIFICATIONS[0];
      await schedulePushNotification(first.title, first.body, {
        id: first.id,
        room: first.room,
        time: first.time,
        category: first.category,
      });
    };
    init();

    foregroundSub.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('[Notification] Received in foreground:', notification.request.content.title);
    });

    return () => {
      foregroundSub.current?.remove();
    };
  }, []);

  const handleItemPress = (item: NotifItem) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n => (n.id === item.id ? { ...n, unread: false } : n)),
    );

    Alert.alert(
      `${item.icon} ${item.title}`,
      `${item.body}${item.room ? `\n\n📍 Room: ${item.room}` : ''}\n⏰ ${item.time}\n🆔 ${item.id}`,
    );
  };

  const handleSendTest = async () => {
    const ok = await setupNotifications();
    if (!ok) return;
    const item = STATIC_NOTIFICATIONS[1];
    await schedulePushNotification(item.title, item.body, {
      id: item.id,
      category: item.category,
    });
    Alert.alert('Sent!', 'Minimize the app — notification arrives in 3 seconds. Tap it!');
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F9F9" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.headerSub}>{unreadCount} unread</Text>
          )}
        </View>
        <TouchableOpacity style={styles.testBtn} onPress={handleSendTest} activeOpacity={0.8}>
          <Text style={styles.testBtnText}>Send Test 🔔</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {notifications.map(item => {
          const color = CATEGORY_COLORS[item.category] ?? '#888';
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, item.unread && styles.cardUnread]}
              onPress={() => handleItemPress(item)}
              activeOpacity={0.7}
            >
              {/* Unread dot */}
              {item.unread && <View style={[styles.unreadDot, { backgroundColor: color }]} />}

              {/* Left accent */}
              <View style={[styles.accent, { backgroundColor: color }]} />

              {/* Icon */}
              <View style={[styles.iconBox, { backgroundColor: color + '18' }]}>
                <Text style={styles.iconText}>{item.icon}</Text>
              </View>

              {/* Content */}
              <View style={styles.content}>
                <View style={styles.topRow}>
                  <Text style={[styles.notifTitle, item.unread && styles.notifTitleBold]}>
                    {item.title}
                  </Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
                <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
                <View style={[styles.badge, { backgroundColor: color + '18' }]}>
                  <Text style={[styles.badgeText, { color }]}>{item.category}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar as any).currentHeight + 16 : 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5F4F3',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0B3D3A',
  },
  headerSub: {
    fontSize: 12,
    color: '#0B8B82',
    fontWeight: '600',
    marginTop: 2,
  },
  testBtn: {
    backgroundColor: '#0B8B82',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  testBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  list: {
    padding: 16,
    paddingBottom: 120,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  cardUnread: {
    backgroundColor: '#F0FFFE',
  },
  unreadDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  accent: {
    width: 4,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    marginVertical: 14,
  },
  iconText: {
    fontSize: 22,
  },
  content: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 18,
    paddingVertical: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  notifTitleBold: {
    fontWeight: '800',
    color: '#0B3D3A',
  },
  time: {
    fontSize: 11,
    color: '#999',
    whiteSpace: 'nowrap',
  } as any,
  body: {
    fontSize: 12,
    color: '#666',
    lineHeight: 17,
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});

export default Notification;
