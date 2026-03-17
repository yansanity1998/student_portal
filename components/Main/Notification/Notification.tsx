import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { CheckCheck, Trash2 } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    LogBox,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

// Suppress Expo Go SDK 53+ push token warning
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

// ─── GLOBAL CLICK LISTENER ───────────────────────────────────────────────────
Notifications.addNotificationResponseReceivedListener(response => {
    const { title, body, data } = response.notification.request.content;
    const d = data as any;
    Alert.alert(
        `🔔 ${title}`,
        `${body}\n\n📍 ${d?.room ?? ''}\n⏰ ${d?.time ?? ''}\n🆔 ${d?.id ?? ''}`,
    );
});

// ─── SCHEDULE NOTIFICATION ───────────────────────────────────────────────────
export async function schedulePushNotification(
    title: string,
    body: string,
    data?: Record<string, any>,
) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data: data ?? { source: 'ICI Portal', id: 'ICI-NOTIF-001' },
            sound: true,
            priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 3,
        },
    });
}

// ─── PERMISSIONS + CHANNEL ───────────────────────────────────────────────────
async function setupNotifications(): Promise<boolean> {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('ici-portal', {
            name: 'ICI Portal Alerts',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#0B8B82',
            lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
            sound: 'default',
        });
    }
    if (!Device.isDevice) return true;
    const { status: existing } = await Notifications.getPermissionsAsync();
    let final = existing;
    if (existing !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        final = status;
    }
    if (final !== 'granted') {
        Alert.alert('Permission Required', 'Enable notifications in Settings > Apps > ICI Portal.');
        return false;
    }
    return true;
}

// ─── TYPES ───────────────────────────────────────────────────────────────────
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
    { id: 'ICI-001', icon: '📘', title: 'Upcoming Class', body: 'Advanced Mathematics starts in 15 minutes at Lab 4B.', time: '08:15 AM', room: 'Lab 4B', category: 'Schedule', unread: true },
    { id: 'ICI-002', icon: '💬', title: 'New Message from Prof. Santos', body: 'Please submit your assignment by end of day.', time: '07:50 AM', room: undefined, category: 'Message', unread: true },
    { id: 'ICI-003', icon: '📝', title: 'Grade Released', body: 'Your Physics of Motion midterm grade has been posted.', time: 'Yesterday', room: undefined, category: 'Grades', unread: false },
    { id: 'ICI-004', icon: '✅', title: 'Attendance Recorded', body: 'Your attendance for Computer Science was marked Present.', time: 'Yesterday', room: 'Digital Hub', category: 'Attendance', unread: false },
    { id: 'ICI-005', icon: '💳', title: 'Billing Reminder', body: 'Your tuition fee payment is due on March 31, 2026.', time: 'Mar 15', room: undefined, category: 'Billing', unread: false },
];

const CATEGORY_COLORS: Record<string, string> = {
    Schedule: '#0B8B82',
    Message: '#3B82F6',
    Grades: '#8B5CF6',
    Attendance: '#10B981',
    Billing: '#F59E0B',
};

// ─── SWIPEABLE ROW ───────────────────────────────────────────────────────────
const SwipeableRow = ({
    item,
    onPress,
    onDelete,
    onMarkRead,
}: {
    item: NotifItem;
    onPress: () => void;
    onDelete: () => void;
    onMarkRead: () => void;
}) => {
    const swipeableRef = useRef<Swipeable>(null);
    const color = CATEGORY_COLORS[item.category] ?? '#888';

    // LEFT action: Mark as read (swipe right reveals it)
    const renderLeftActions = (progress: Animated.AnimatedInterpolation<number>) => {
        const translateX = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-80, 0],
        });
        return (
            <Animated.View style={[styles.leftAction, { transform: [{ translateX }] }]}>
                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => {
                        swipeableRef.current?.close();
                        onMarkRead();
                    }}
                >
                    <CheckCheck size={22} color="#fff" strokeWidth={2.5} />
                    <Text style={styles.actionLabel}>Read</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    // RIGHT action: Delete (swipe left reveals it)
    const renderRightActions = (progress: Animated.AnimatedInterpolation<number>) => {
        const translateX = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [80, 0],
        });
        return (
            <Animated.View style={[styles.rightAction, { transform: [{ translateX }] }]}>
                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => {
                        swipeableRef.current?.close();
                        onDelete();
                    }}
                >
                    <Trash2 size={22} color="#fff" strokeWidth={2.5} />
                    <Text style={styles.actionLabel}>Delete</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <Swipeable
            ref={swipeableRef}
            friction={2}
            overshootLeft={false}
            overshootRight={false}
            renderLeftActions={item.unread ? renderLeftActions : undefined}
            renderRightActions={renderRightActions}
            leftThreshold={60}
            rightThreshold={60}
        >
            <TouchableOpacity
                style={[styles.card, item.unread && styles.cardUnread]}
                onPress={onPress}
                activeOpacity={0.75}
            >
                {/* Unread indicator dot */}
                {item.unread && <View style={[styles.unreadDot, { backgroundColor: color }]} />}

                {/* Left color accent */}
                <View style={[styles.accent, { backgroundColor: color }]} />

                {/* Icon */}
                <View style={[styles.iconBox, { backgroundColor: color + '18' }]}>
                    <Text style={styles.iconText}>{item.icon}</Text>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.topRow}>
                        <Text style={[styles.notifTitle, item.unread && styles.notifTitleBold]} numberOfLines={1}>
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
        </Swipeable>
    );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const Notification = () => {
    const foregroundSub = useRef<Notifications.Subscription | null>(null);
    const [notifications, setNotifications] = useState<NotifItem[]>(STATIC_NOTIFICATIONS);

    useEffect(() => {
        const init = async () => {
            const ok = await setupNotifications();
            if (!ok) return;
            const first = STATIC_NOTIFICATIONS[0];
            await schedulePushNotification(first.title, first.body, {
                id: first.id, room: first.room, time: first.time, category: first.category,
            });
        };
        init();

        foregroundSub.current = Notifications.addNotificationReceivedListener(n => {
            console.log('[Notification] Received:', n.request.content.title);
        });

        return () => { foregroundSub.current?.remove(); };
    }, []);

    const handlePress = (item: NotifItem) => {
        setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, unread: false } : n));
        Alert.alert(
            `${item.icon} ${item.title}`,
            `${item.body}${item.room ? `\n\n📍 Room: ${item.room}` : ''}\n⏰ ${item.time}\n🆔 ${item.id}`,
        );
    };

    const handleDelete = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleMarkRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    const handleSendTest = async () => {
        const ok = await setupNotifications();
        if (!ok) return;
        await schedulePushNotification(
            '🔔 ICI Portal Alert!',
            'You have 1 unread message from Prof. Santos. Tap to view.',
            { id: 'ICI-TEST', category: 'Message' },
        );
        Alert.alert('Sent!', 'Minimize the app — notification arrives in 3 seconds. Tap it!');
    };

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <GestureHandlerRootView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F0F9F9" />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    {unreadCount > 0 ? (
                        <Text style={styles.headerSub}>{unreadCount} unread</Text>
                    ) : (
                        <Text style={styles.headerSub}>All caught up ✓</Text>
                    )}
                </View>
                <TouchableOpacity style={styles.testBtn} onPress={handleSendTest} activeOpacity={0.8}>
                    <Text style={styles.testBtnText}>Send Test 🔔</Text>
                </TouchableOpacity>
            </View>

            {/* List */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
                {notifications.length === 0 ? (
                    <View style={styles.empty}>
                        <Text style={styles.emptyIcon}>🔕</Text>
                        <Text style={styles.emptyText}>No notifications</Text>
                    </View>
                ) : (
                    notifications.map(item => (
                        <View key={item.id} style={styles.rowWrapper}>
                            <SwipeableRow
                                item={item}
                                onPress={() => handlePress(item)}
                                onDelete={() => handleDelete(item.id)}
                                onMarkRead={() => handleMarkRead(item.id)}
                            />
                        </View>
                    ))
                )}
            </ScrollView>
        </GestureHandlerRootView>
    );
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F9F9' },
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
    headerTitle: { fontSize: 22, fontWeight: '800', color: '#0B3D3A' },
    headerSub: { fontSize: 12, color: '#0B8B82', fontWeight: '600', marginTop: 2 },
    testBtn: { backgroundColor: '#0B8B82', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
    testBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
    hintBar: {
        backgroundColor: '#E6F7F6',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#C8EBE9',
    },
    hintText: { fontSize: 11, color: '#0B8B82', textAlign: 'center', fontWeight: '500' },
    list: { paddingVertical: 12, paddingBottom: 120 },
    rowWrapper: { marginHorizontal: 14, marginBottom: 10, borderRadius: 16, overflow: 'hidden' },
    // Swipe actions
    leftAction: {
        backgroundColor: '#0B8B82',
        justifyContent: 'center',
        borderRadius: 16,
        marginBottom: 0,
    },
    rightAction: {
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        borderRadius: 16,
    },
    actionBtn: {
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    actionIcon: { fontSize: 22, marginBottom: 2 },
    actionLabel: { fontSize: 11, fontWeight: '700', color: '#fff' },
    // Card
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    cardUnread: { backgroundColor: '#F0FFFE' },
    unreadDot: { position: 'absolute', top: 14, right: 14, width: 8, height: 8, borderRadius: 4 },
    accent: { width: 4, height: '100%', position: 'absolute', left: 0 },
    iconBox: { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginLeft: 16, marginVertical: 14 },
    iconText: { fontSize: 22 },
    content: { flex: 1, paddingLeft: 12, paddingRight: 18, paddingVertical: 14 },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
    notifTitle: { fontSize: 14, fontWeight: '600', color: '#333', flex: 1, marginRight: 8 },
    notifTitleBold: { fontWeight: '800', color: '#0B3D3A' },
    time: { fontSize: 11, color: '#999' },
    body: { fontSize: 12, color: '#666', lineHeight: 17, marginBottom: 8 },
    badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    badgeText: { fontSize: 10, fontWeight: '700' },
    // Empty state
    empty: { alignItems: 'center', paddingTop: 80 },
    emptyIcon: { fontSize: 48, marginBottom: 12 },
    emptyText: { fontSize: 16, color: '#999', fontWeight: '600' },
});

export default Notification;
