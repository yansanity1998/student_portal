import { useNavigation } from '@/app/(tabs)/index';
import { 
    Trophy, 
    Star, 
    Medal, 
    ChevronLeft,
    ChevronRight,
    Award,
    Target,
    Zap,
    Flame,
    BookOpen,
    GraduationCap,
    Users
} from 'lucide-react-native';
import React from 'react';
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Palette } from '../../color/color';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const AchievementCard = ({ item, theme }: any) => (
    <Animated.View 
        entering={FadeInDown.delay(item.index * 100).duration(500)}
        style={[styles.card, { backgroundColor: theme.cardBg }]}
    >
        <View style={[styles.cardIconBox, { backgroundColor: item.color + '15' }]}>
            <item.icon size={24} color={item.color} strokeWidth={2.5} />
        </View>
        <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.cardPoints, { color: item.color }]}>+{item.points} XP</Text>
            </View>
            <Text style={[styles.cardDesc, { color: theme.textSecondary }]} numberOfLines={2}>
                {item.description}
            </Text>
            
            <View style={styles.progressContainer}>
                <View style={[styles.progressBg, { backgroundColor: theme.border }]}>
                    <View style={[styles.progressFill, { width: `${item.progress}%`, backgroundColor: item.color }]} />
                </View>
                <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                    {item.progress === 100 ? 'Unlocked' : `${item.progress}%`}
                </Text>
            </View>
        </View>
    </Animated.View>
);

const Achievements = () => {
    const { goBack, currentScreen } = useNavigation();
    
    // In a real app, this would be passed or fetched via context
    const isDarkMode = false; 
    const theme = isDarkMode ? darkTheme : lightTheme;

    const achievements = [
        { 
            index: 0,
            title: 'Top Performer', 
            description: 'Maintain a GPA of 3.8 or higher for the current semester.', 
            icon: Trophy, 
            color: Palette.warning, 
            points: 500, 
            progress: 100 
        },
        { 
            index: 1,
            title: 'Early Bird', 
            description: 'Attend 5 consecutive classes 10 minutes before the start time.', 
            icon: Clock, 
            color: Palette.sky, 
            points: 150, 
            progress: 80 
        },
        { 
            index: 2,
            title: 'Tech Savvy', 
            description: 'Complete all digital workshop modules in the Student Portal.', 
            icon: Zap, 
            color: Palette.violet, 
            points: 300, 
            progress: 45 
        },
        { 
            index: 3,
            title: 'Social Butterfly', 
            description: 'Participate in 3 or more campus organization events.', 
            icon: Users, 
            color: Palette.success, 
            points: 200, 
            progress: 100 
        },
        { 
            index: 4,
            title: 'Research Pro', 
            description: 'Submit an approved research proposal to the department.', 
            icon: BookOpen, 
            color: Palette.brandBlue, 
            points: 400, 
            progress: 20 
        },
    ];

    const stats = [
        { label: 'Total XP', value: '12,450', icon: Target, color: Palette.primary },
        { label: 'Rank', value: '#42', icon: Award, color: Palette.orange },
        { label: 'Streak', value: '15 Days', icon: Flame, color: Palette.error },
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header Banner */}
                <View style={styles.bannerContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop' }}
                        style={styles.bannerImage}
                    />
                    <BlurView intensity={20} tint="dark" style={styles.bannerOverlay}>
                        <View style={styles.headerTop}>
                            <TouchableOpacity onPress={goBack} style={styles.backButton}>
                                <ChevronLeft size={24} color={Palette.white} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Achievements</Text>
                            <View style={{ width: 40 }} />
                        </View>

                        <View style={styles.statContainer}>
                            {stats.map((stat, idx) => (
                                <Animated.View 
                                    entering={FadeInRight.delay(idx * 150)}
                                    key={idx} 
                                    style={styles.statBox}
                                >
                                    <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                                        <stat.icon size={18} color={Palette.white} />
                                    </View>
                                    <Text style={styles.statValue}>{stat.value}</Text>
                                    <Text style={styles.statLabel}>{stat.label}</Text>
                                </Animated.View>
                            ))}
                        </View>
                    </BlurView>
                </View>

                {/* Achievements List */}
                <View style={styles.mainContent}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>My Collection</Text>
                        <TouchableOpacity>
                            <Text style={{ color: Palette.primary, fontWeight: '600' }}>Filter</Text>
                        </TouchableOpacity>
                    </View>

                    {achievements.map((item) => (
                        <AchievementCard key={item.index} item={item} theme={theme} />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const lightTheme = {
    background: '#F0F9F9',
    cardBg: Palette.white,
    textPrimary: Palette.gray900,
    textSecondary: Palette.gray500,
    border: Palette.gray100,
};

const darkTheme = {
    background: Palette.black,
    cardBg: '#121212',
    textPrimary: Palette.white,
    textSecondary: Palette.gray400,
    border: Palette.gray800,
};

// Re-using Clock icon from Lucide since I only imported trophies etc.
const Clock = (props: any) => (
    <View {...props}>
        <Zap {...props} /> 
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    bannerContainer: {
        height: 280,
        width: '100%',
        backgroundColor: Palette.primary,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    bannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 50,
        paddingHorizontal: 20,
        backgroundColor: Palette.primary + '80',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: Palette.white,
        letterSpacing: -0.5,
    },
    statContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    statBox: {
        alignItems: 'center',
        flex: 1,
    },
    statIcon: {
        width: 44,
        height: 44,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '800',
        color: Palette.white,
    },
    statLabel: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
        marginTop: 2,
    },
    mainContent: {
        paddingHorizontal: 20,
        marginTop: -30,
        zIndex: 5,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingHorizontal: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    card: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 24,
        marginBottom: 12,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
            android: { elevation: 3 },
        }),
    },
    cardIconBox: {
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    cardContent: {
        flex: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    cardPoints: {
        fontSize: 13,
        fontWeight: '800',
    },
    cardDesc: {
        fontSize: 12,
        lineHeight: 18,
        marginBottom: 12,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBg: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        marginRight: 10,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 11,
        fontWeight: '700',
        width: 50,
        textAlign: 'right',
    },
});

export default Achievements;
