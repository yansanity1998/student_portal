import { useNavigation } from '@/app/(tabs)/index';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Bell,
    BookOpen,
    CalendarClock,
    CalendarDays,
    CheckSquare,
    ChevronRight,
    ClipboardCheck,
    Clock,
    GraduationCap,
    MapPin,
    Medal,
    MessageSquare,
    Moon,
    Star,
    Sun,
    Trophy
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { SlideInRight, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Palette } from '../color/color';
import News from './News';

const { width } = Dimensions.get('window');

const QuickActionCard = ({ action, theme, onPress }: any) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.92, { damping: 10, stiffness: 300 });
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    return (
        <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            style={({ hovered, pressed }) => [
                styles.gridItem,
                { backgroundColor: theme.cardBg, overflow: 'hidden' },
                hovered && {
                    backgroundColor: theme.cardBg,
                    transform: [{ translateY: -2 }],
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    borderColor: action.color + '40',
                    borderWidth: 1,
                },
                pressed && { opacity: 0.8 }
            ]}
        >
            <View style={styles.watermarkContainer}>
                <action.icon size={80} color={action.color} opacity={0.18} strokeWidth={1.5} />
            </View>
            <Animated.View style={[styles.gridItemContent, animatedStyle]}>
                <View style={[styles.gridIcon, { backgroundColor: action.color + '15' }]}>
                    <action.icon size={24} color={action.color} strokeWidth={2.5} />
                </View>
                <Text style={[styles.gridLabel, { color: theme.textPrimary }]}>{action.name}</Text>
            </Animated.View>
        </Pressable>
    );
};

const Home = () => {
    const { setScreen } = useNavigation();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isParentMode, setIsParentMode] = useState(false);

    // Theme-aware styles
    const theme = isDarkMode ? darkTheme : lightTheme;

    const timetable = [
        { time: '08:30 AM', subject: 'Advanced Mathematics', room: 'Lab 4B', color: Palette.primary, active: true },
        { time: '10:45 AM', subject: 'Physics of Motion', room: 'Hall A', color: Palette.sky, active: false },
        { time: '01:30 PM', subject: 'Computer Science', room: 'Digital Hub', color: Palette.violet, active: false },
    ];

    const quickActions = [
        { name: 'Schedule', icon: CalendarDays, color: Palette.primary, target: 'Schedule' },
        { name: 'Grades', icon: GraduationCap, color: Palette.brandBlue, target: 'Grades' },
        { name: 'Attendance', icon: ClipboardCheck, color: Palette.success, target: 'Attendance' },
        { name: 'Courses', icon: BookOpen, color: Palette.violet, target: 'Courses' },
        { name: 'Tasks', icon: CheckSquare, color: Palette.orange, target: 'Tasks' },
        { name: 'Messages', icon: MessageSquare, color: Palette.sky, target: 'Messages' },
    ];

    const StatCard = ({ label, value, icon: Icon, color }: any) => (
        <View style={[styles.statCard, { backgroundColor: theme.cardBg }]}>
            <View style={[styles.statIconContainer, { backgroundColor: color + '15' }]}>
                <Icon size={18} color={color} strokeWidth={2.5} />
            </View>
            <View>
                <Text style={[styles.statValue, { color: theme.textPrimary }]}>{value}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{label}</Text>
            </View>
        </View>
    );

    return (
        <Animated.View entering={SlideInRight.duration(180)} style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Compact Edge-to-Edge Trendy Banner Section (Sticky/Fixed) */}
            <View style={styles.bannerContainer} pointerEvents="box-none">
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?q=80&w=2069&auto=format&fit=crop' }}
                    style={styles.bannerImage}
                />

                {/* Unified Horizontal Content Overlay */}
                <View style={[styles.bannerContent, { backgroundColor: Palette.primary + 'B3' }]} pointerEvents="box-none">
                    <Text style={[styles.systemTitle, { color: Palette.white }]} numberOfLines={1}>Welcome to ICI Student Portal!</Text>

                    <View style={styles.headerMainRow}>
                        <View style={styles.profileRow}>
                            <Image
                                source={{ uri: 'https://i.pravatar.cc/150?u=student123' }}
                                style={styles.profilePic}
                            />
                            <View style={styles.welcomeTextContainer}>
                                <Text style={[styles.studentName, { color: Palette.white }]} numberOfLines={1}>Jesper Ian</Text>
                                <Text style={[styles.greeting, { color: 'rgba(255,255,255,0.9)' }]} numberOfLines={1}>ID: 2024-0012</Text>
                            </View>
                        </View>

                        <View style={styles.headerRightActions}>
                            <TouchableOpacity
                                style={[styles.iconButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
                                onPress={() => setIsDarkMode(!isDarkMode)}
                            >
                                {isDarkMode ? <Sun size={20} color={Palette.white} /> : <Moon size={20} color={Palette.white} />}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.iconButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
                                onPress={() => setScreen('Notification' as any)}
                            >
                                <Bell size={20} color={Palette.white} />
                                <View style={styles.notificationDot} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
            >

                {/* Main Content with Padding */}
                <View style={styles.mainPadding}>

                    {/* Quick Access Grid (Moved to Upper) */}
                    <Text style={[styles.sectionTitle, styles.labelMargin, { color: theme.textPrimary }]}>Quick Access</Text>
                    <View style={styles.grid}>
                        {quickActions.map((action, idx) => (
                            <QuickActionCard
                                key={idx}
                                action={action}
                                theme={theme}
                                onPress={() => action.target && setScreen(action.target as any)}
                            />
                        ))}
                    </View>

                    {/* News Carousel Section (Now upper, since stats removed) */}
                    <News theme={theme} />
                    {/* 
                    <TouchableOpacity
                        style={[styles.parentToggle, { backgroundColor: isParentMode ? Palette.primary : theme.cardBg }]}
                        onPress={() => setIsParentMode(!isParentMode)}
                    >
                        <Users
                            size={22}
                            color={isParentMode ? Palette.white : Palette.primary}
                        />
                        <Text style={[styles.parentToggleText, { color: isParentMode ? Palette.white : theme.textPrimary }]}>
                            {isParentMode ? 'Parent Monitoring Active' : 'Switch to Parent Access'}
                        </Text>
                        <ChevronRight
                            size={18}
                            color={isParentMode ? Palette.white : theme.textSecondary}
                        />
                    </TouchableOpacity> */}

                    {/* Modern Gamified Learning Journey Tracker */}
                    <View style={[styles.learningCard, { backgroundColor: theme.cardBg }]}>
                        <View style={styles.learningHeader}>
                            <View>
                                <Text style={[styles.levelLabel, { color: Palette.primary }]}>LEVEL 12</Text>
                                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Learning Journey</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.allBadgesBtn}
                                onPress={() => setScreen('Achievements')}
                            >
                                <Text style={styles.allBadgesText}>View All</Text>
                                <ChevronRight size={14} color={Palette.primary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.progressContainer}>
                            <View style={styles.progressInfoRow}>
                                <Text style={[styles.xpText, { color: theme.textPrimary }]}>
                                    750 <Text style={{ color: theme.textSecondary, fontWeight: '500' }}>/ 1000 XP</Text>
                                </Text>
                                <Text style={[styles.milestoneText, { color: Palette.success }]}>75% to Level 13</Text>
                            </View>
                            <View style={[styles.progressBarBg, { backgroundColor: isDarkMode ? '#222' : '#F0F0F0' }]}>
                                <LinearGradient
                                    colors={[Palette.primary, Palette.sky]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[styles.progressBarFill, { width: '75%' }]}
                                />
                            </View>
                        </View>

                        <View style={styles.badgeRow}>
                            {[
                                { Icon: Trophy, color: Palette.warning, bg: Palette.warning + '15' },
                                { Icon: Star, color: Palette.success, bg: Palette.success + '15' },
                                { Icon: Medal, color: Palette.brandBlue, bg: Palette.brandBlue + '15' },
                            ].map((badge, idx) => (
                                <View key={idx} style={[styles.badgePill, { backgroundColor: badge.bg }]}>
                                    <badge.Icon size={16} color={badge.color} strokeWidth={2.5} />
                                </View>
                            ))}
                            <View style={styles.nextMilestone}>
                                <Clock size={12} color={theme.textSecondary} />
                                <Text style={[styles.nextText, { color: theme.textSecondary }]}>Next: 250 XP</Text>
                            </View>
                        </View>
                    </View>

                    {/* Upcoming Schedule Modern Alert */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.upcomingAlertWrapper}
                        onPress={() => setScreen('Location' as any)}
                    >
                        <LinearGradient
                            colors={[Platform.select({ ios: Palette.primary + '1A', android: Palette.primary + '25' }) as string, Platform.select({ ios: Palette.sky + '08', android: Palette.sky + '12' }) as string]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[styles.upcomingAlertContainer, { borderColor: Palette.primary + '30' }]}
                        >
                            <View style={styles.upcomingAlertIconOuter}>
                                <View style={[styles.upcomingAlertIconInner, { backgroundColor: Palette.white }]}>
                                    <CalendarClock size={22} color={Palette.primary} strokeWidth={2.5} />
                                    <View style={styles.pulseDot} />
                                </View>
                            </View>

                            <View style={styles.upcomingAlertContent}>
                                <Text style={[styles.upcomingAlertHeader, { color: Palette.primaryDark }]}>
                                    UPCOMING IN 15 MINS
                                </Text>
                                <Text style={[styles.upcomingAlertTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                                    Physics of Motion
                                </Text>
                                <View style={styles.upcomingAlertRow}>
                                    <MapPin size={12} color={theme.textSecondary} />
                                    <Text style={[styles.upcomingAlertDesc, { color: theme.textSecondary }]}>Hall A</Text>
                                </View>
                            </View>

                            <View style={[styles.upcomingAlertAction, { backgroundColor: Palette.white }]}>
                                <ChevronRight size={18} color={Palette.primary} strokeWidth={3} />
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Timetable Section */}
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Today's Timetable</Text>
                        <Text style={{ color: theme.textSecondary }}>Monday, Mar 10</Text>
                    </View>
                    {timetable.map((item, idx) => (
                        <View key={idx} style={[styles.timetableCard, { backgroundColor: theme.cardBg }]}>
                            <View style={[styles.timeStrip, { backgroundColor: item.color }]} />
                            <View style={styles.timetableInfo}>
                                <Text style={[styles.subjectText, { color: theme.textPrimary }]}>{item.subject}</Text>
                                <View style={styles.row}>
                                    <MapPin size={14} color={theme.textSecondary} />
                                    <Text style={[styles.detailText, { color: theme.textSecondary }]}>{item.room}</Text>
                                    <Clock size={14} color={theme.textSecondary} style={{ marginLeft: 15 }} />
                                    <Text style={[styles.detailText, { color: theme.textSecondary }]}>{item.time}</Text>
                                </View>
                            </View>
                            {item.active && (
                                <View style={styles.activeTag}>
                                    <Text style={styles.activeTagText}>NOW</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>

            </ScrollView>
        </Animated.View>
    );
};

// Themes
const lightTheme = {
    background: '#F0F9F9',
    cardBg: Palette.white,
    textPrimary: Palette.gray900,
    textSecondary: Palette.gray500,
    border: Palette.gray200,
};

const darkTheme = {
    background: Palette.black,
    cardBg: '#121212',
    textPrimary: Palette.white,
    textSecondary: Palette.gray400,
    border: Palette.gray800,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 195,
        paddingBottom: 90,
    },
    mainPadding: {
        paddingHorizontal: 20,
    },
    bannerContainer: {
        height: 180,
        width: '100%',
        backgroundColor: Palette.primary,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        elevation: 10,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        opacity: 0.7,
    },
    bannerContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 25,
        flexDirection: 'column',
    },
    headerMainRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    headerRightActions: {
        flexDirection: 'row',
    },
    profilePic: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: Palette.white,
        backgroundColor: Palette.gray200,
    },
    welcomeTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    greeting: {
        fontSize: 11,
        fontWeight: '500',
    },
    studentName: {
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    systemTitle: {
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: -0.8,
        marginBottom: 2,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    notificationDot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Palette.error,
        borderWidth: 1.5,
        borderColor: Palette.white,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    statCard: {
        flex: 0.48,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 16,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8 },
            android: { elevation: 2 },
        }),
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 12,
    },
    parentToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 16,
        marginTop: 20,
    },
    parentToggleText: {
        flex: 1,
        marginLeft: 12,
        fontWeight: '600',
    },
    section: {
        marginTop: 20,
        padding: 20,
        borderRadius: 20,
    },
    labelMargin: {
        marginTop: 30,
        marginBottom: 15,
    },
    learningCard: {
        marginTop: 25,
        padding: 20,
        borderRadius: 24,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 12 },
            android: { elevation: 4 },
        }),
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    learningHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    levelLabel: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginBottom: 4,
    },
    allBadgesBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: Palette.primary + '10',
    },
    allBadgesText: {
        color: Palette.primary,
        fontSize: 12,
        fontWeight: '700',
        marginRight: 4,
    },
    progressContainer: {
        marginBottom: 20,
    },
    progressInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    xpText: {
        fontSize: 18,
        fontWeight: '800',
    },
    milestoneText: {
        fontSize: 11,
        fontWeight: '700',
    },
    progressBarBg: {
        height: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 5,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgePill: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    nextMilestone: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.03)',
    },
    nextText: {
        fontSize: 10,
        fontWeight: '700',
        marginLeft: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: (width - 60) / 3, // Changed to 3 columns for 6 items
        borderRadius: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'transparent',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8 },
            android: { elevation: 3 },
            web: { transition: 'all 0.3s ease' }
        }),
    },
    watermarkContainer: {
        position: 'absolute',
        right: -15,
        bottom: -20,
        transform: [{ rotate: '-15deg' }],
    },
    gridItemContent: {
        padding: 12, // Reduced padding for 3-column layout
        alignItems: 'center',
        width: '100%',
    },
    gridIcon: {
        width: 44, // Slightly smaller icons for 3-column
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    gridLabel: {
        fontSize: 11, // Adjusted font size for 3-column
        fontWeight: '700',
        marginTop: 4,
    },
    timetableCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 18,
        marginBottom: 12,
        overflow: 'hidden',
    },
    timeStrip: {
        width: 4,
        height: '100%',
        borderRadius: 2,
        position: 'absolute',
        left: 0,
    },
    timetableInfo: {
        marginLeft: 10,
        flex: 1,
    },
    subjectText: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        fontSize: 12,
        marginLeft: 4,
    },
    activeTag: {
        backgroundColor: Palette.success,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    activeTagText: {
        color: Palette.white,
        fontSize: 10,
        fontWeight: '800',
    },
    upcomingAlertWrapper: {
        marginTop: 25,
        ...Platform.select({
            ios: { shadowColor: Palette.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 12 },
            android: { elevation: 3, shadowColor: Palette.primary },
        }),
    },
    upcomingAlertContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 22,
        borderWidth: 1,
    },
    upcomingAlertIconOuter: {
        marginRight: 14,
    },
    upcomingAlertIconInner: {
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 6 },
            android: { elevation: 2 },
        }),
    },
    pulseDot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Palette.error,
        borderWidth: 2,
        borderColor: Palette.white,
    },
    upcomingAlertContent: {
        flex: 1,
        justifyContent: 'center',
    },
    upcomingAlertHeader: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.8,
        marginBottom: 4,
    },
    upcomingAlertTitle: {
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: -0.3,
        marginBottom: 2,
    },
    upcomingAlertRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    upcomingAlertDesc: {
        fontSize: 13,
        marginLeft: 4,
        fontWeight: '500',
    },
    upcomingAlertAction: {
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 },
            android: { elevation: 1 },
        }),
    },
});

export default Home;
