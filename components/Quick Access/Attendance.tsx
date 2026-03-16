import { useNavigation } from '@/app/(tabs)/index';
import { 
    ArrowLeft, 
    Calendar, 
    CheckCircle2, 
    ChevronLeft, 
    ChevronRight, 
    Clock, 
    Filter, 
    Info, 
    TriangleAlert, 
    XCircle 
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, SlideInRight, SlideOutRight } from 'react-native-reanimated';
import { Palette } from '../color/color';

const { width } = Dimensions.get('window');

// --- Mock Data ---
const ATTENDANCE_STATS = [
    { label: 'Present', value: '88', color: Palette.success, icon: CheckCircle2 },
    { label: 'Late', value: '4', color: Palette.warning, icon: Clock },
    { label: 'Absent', value: '2', color: Palette.error, icon: XCircle },
];

const ATTENDANCE_LOG = [
    { id: '1', date: 'March 13, 2026', subject: 'Advanced Math', status: 'Present', time: '08:32 AM', color: Palette.success },
    { id: '2', date: 'March 12, 2026', subject: 'Web Development', status: 'Present', time: '10:46 AM', color: Palette.success },
    { id: '3', date: 'March 11, 2026', subject: 'Physics', status: 'Late', time: '01:45 PM', color: Palette.warning },
    { id: '4', date: 'March 10, 2026', subject: 'Discrete Math', status: 'Present', time: '09:05 AM', color: Palette.success },
    { id: '5', date: 'March 09, 2026', subject: 'Art Appreciation', status: 'Absent', time: '-', color: Palette.error },
    { id: '6', date: 'March 06, 2026', subject: 'Technical Writing', status: 'Present', time: '08:25 AM', color: Palette.success },
];

const Attendance = () => {
    const { setScreen } = useNavigation();
    const [selectedMonth, setSelectedMonth] = useState('March 2026');

    const renderStatCard = (item: any, index: number) => {
        const Icon = item.icon;
        return (
            <Animated.View 
                entering={FadeInUp.delay(index * 100)}
                key={item.label} 
                style={[styles.statCard, { borderLeftColor: item.color }]}
            >
                <View style={[styles.statIconContainer, { backgroundColor: item.color + '15' }]}>
                    <Icon size={20} color={item.color} />
                </View>
                <View>
                    <Text style={styles.statValue}>{item.value}</Text>
                    <Text style={styles.statLabel}>{item.label}</Text>
                </View>
            </Animated.View>
        );
    };

    const renderLogItem = ({ item, index }: any) => (
        <Animated.View 
            entering={FadeInDown.delay(index * 100)}
            style={styles.logCard}
        >
            <View style={[styles.statusIndicator, { backgroundColor: item.color }]} />
            <View style={styles.logContent}>
                <View style={styles.logHeader}>
                    <Text style={styles.logSubject}>{item.subject}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: item.color + '15' }]}>
                        <Text style={[styles.statusText, { color: item.color }]}>{item.status}</Text>
                    </View>
                </View>
                <View style={styles.logFooter}>
                    <View style={styles.logDetail}>
                        <Calendar size={12} color={Palette.gray400} />
                        <Text style={styles.logDetailText}>{item.date}</Text>
                    </View>
                    {item.time !== '-' && (
                        <View style={styles.logDetail}>
                            <Clock size={12} color={Palette.gray400} />
                            <Text style={styles.logDetailText}>{item.time}</Text>
                        </View>
                    )}
                </View>
            </View>
        </Animated.View>
    );

    return (
        <Animated.View entering={SlideInRight.duration(180)} exiting={SlideOutRight.duration(180)} style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setScreen('Home')} style={styles.backButton}>
                    <ArrowLeft size={24} color={Palette.gray900} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Attendance Tracking</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Filter size={20} color={Palette.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Attendance Score Card */}
                <View style={styles.scoreCard}>
                    <View style={styles.scoreInfo}>
                        <Text style={styles.scoreLabel}>Overall Attendance</Text>
                        <Text style={styles.scorePercentage}>94.5%</Text>
                        <View style={styles.scoreTrend}>
                            <CheckCircle2 size={12} color={Palette.white} />
                            <Text style={styles.scoreTrendText}>Excellent Standing</Text>
                        </View>
                    </View>
                    <View style={styles.progressCircleContainer}>
                        {/* Placeholder for Ring Progress */}
                        <View style={styles.ringOuter}>
                            <View style={styles.ringInner}>
                                <Text style={styles.ringText}>94%</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {ATTENDANCE_STATS.map((item, index) => renderStatCard(item, index))}
                </View>

                {/* Monthly Navigator */}
                <View style={styles.monthNavigator}>
                    <TouchableOpacity style={styles.navBtn}>
                        <ChevronLeft size={20} color={Palette.gray600} />
                    </TouchableOpacity>
                    <Text style={styles.selectedMonth}>{selectedMonth}</Text>
                    <TouchableOpacity style={styles.navBtn}>
                        <ChevronRight size={20} color={Palette.gray600} />
                    </TouchableOpacity>
                </View>

                {/* Info Tip */}
                <View style={styles.infoTip}>
                    <Info size={16} color={Palette.primary} />
                    <Text style={styles.infoTipText}>Maintain above 80% to avoid academic warning.</Text>
                </View>

                {/* Recent Logs List */}
                <View style={styles.listHeader}>
                    <Text style={styles.listTitle}>Recent Activity</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAllText}>View History</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    scrollEnabled={false}
                    data={ATTENDANCE_LOG}
                    renderItem={renderLogItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listPadding}
                />
                
            </ScrollView>
        </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FBFA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: Palette.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: Palette.gray900,
    },
    filterButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: Palette.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    scoreCard: {
        backgroundColor: Palette.primary,
        borderRadius: 28,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        elevation: 8,
        shadowColor: Palette.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    scoreInfo: {
        flex: 1,
    },
    scoreLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '600',
    },
    scorePercentage: {
        color: Palette.white,
        fontSize: 34,
        fontWeight: '900',
        marginVertical: 4,
    },
    scoreTrend: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    scoreTrendText: {
        color: Palette.white,
        fontSize: 11,
        fontWeight: '700',
        marginLeft: 6,
    },
    progressCircleContainer: {
        marginLeft: 15,
    },
    ringOuter: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 6,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    ringInner: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ringText: {
        color: Palette.white,
        fontSize: 16,
        fontWeight: '800',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    statCard: {
        width: (width - 60) / 3,
        backgroundColor: Palette.white,
        padding: 12,
        borderRadius: 16,
        borderLeftWidth: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
    },
    statIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '800',
        color: Palette.gray900,
    },
    statLabel: {
        fontSize: 11,
        color: Palette.gray500,
        fontWeight: '600',
    },
    monthNavigator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        marginBottom: 10,
    },
    navBtn: {
        padding: 8,
    },
    selectedMonth: {
        fontSize: 16,
        fontWeight: '700',
        color: Palette.gray800,
        marginHorizontal: 15,
    },
    infoTip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Palette.primary + '10',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Palette.primary + '20',
        marginBottom: 20,
    },
    infoTipText: {
        fontSize: 12,
        color: Palette.primary,
        fontWeight: '600',
        marginLeft: 10,
        flex: 1,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: Palette.gray900,
    },
    viewAllText: {
        fontSize: 13,
        fontWeight: '700',
        color: Palette.primary,
    },
    logCard: {
        flexDirection: 'row',
        backgroundColor: Palette.white,
        borderRadius: 18,
        marginBottom: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
    },
    statusIndicator: {
        width: 6,
    },
    logContent: {
        flex: 1,
        padding: 15,
    },
    logHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    logSubject: {
        fontSize: 15,
        fontWeight: '700',
        color: Palette.gray900,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    logFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    logDetailText: {
        fontSize: 12,
        color: Palette.gray500,
        fontWeight: '500',
        marginLeft: 6,
    },
    listPadding: {
        paddingBottom: 20,
    },
});

export default Attendance;
