import { useNavigation } from '@/app/(tabs)/index';
import { 
    ArrowLeft, 
    Calendar, 
    Clock, 
    MapPin, 
    MoreHorizontal,
    User,
    ChevronLeft,
    ChevronRight,
    Search
} from 'lucide-react-native';
import React, { useState, useRef } from 'react';
import {
    Dimensions,
    FlatList,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
} from 'react-native';
import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated';
import { Palette } from '../color/color';

const { width } = Dimensions.get('window');

// --- Mock Data ---
const DAYS = [
    { id: 1, day: 'Mon', date: '13', full: 'Monday' },
    { id: 2, day: 'Tue', date: '14', full: 'Tuesday' },
    { id: 3, day: 'Wed', date: '15', full: 'Wednesday' },
    { id: 4, day: 'Thu', date: '16', full: 'Thursday' },
    { id: 5, day: 'Fri', date: '17', full: 'Friday' },
    { id: 6, day: 'Sat', date: '18', full: 'Saturday' },
    { id: 7, day: 'Sun', date: '19', full: 'Sunday' },
];

const SCHEDULE_DATA = {
    '13': [
        {
            id: '1',
            time: '08:30 AM',
            endTime: '10:00 AM',
            subject: 'Advanced Mathematics',
            code: 'MATH402',
            room: 'Lab 4B',
            instructor: 'Dr. Sarah Wilson',
            color: Palette.primary,
            type: 'Lecture'
        },
        {
            id: '2',
            time: '10:45 AM',
            endTime: '12:15 PM',
            subject: 'Physics of Motion',
            code: 'PHYS201',
            room: 'Hall A',
            instructor: 'Prof. Michael Chen',
            color: Palette.brandBlue,
            type: 'Lab'
        },
        {
            id: '3',
            time: '01:30 PM',
            endTime: '03:00 PM',
            subject: 'Computer Science',
            code: 'CS305',
            room: 'Digital Hub',
            instructor: 'Engr. David Miller',
            color: Palette.violet,
            type: 'Seminar'
        },
    ],
    '14': [
        {
            id: '4',
            time: '09:00 AM',
            endTime: '11:00 AM',
            subject: 'Data Structures',
            code: 'CS202',
            room: 'Lab 3C',
            instructor: 'Dr. Emily Rose',
            color: Palette.orange,
            type: 'Lecture'
        },
    ],
    // Add more as needed
};

const Schedule = () => {
    const { setScreen } = useNavigation();
    const [selectedDate, setSelectedDate] = useState('13');
    const flatListRef = useRef<FlatList>(null);

    const renderDayItem = (item: any) => {
        const isSelected = selectedDate === item.date;
        return (
            <TouchableOpacity 
                key={item.id}
                onPress={() => setSelectedDate(item.date)}
                style={[
                    styles.dayItem,
                    isSelected && styles.dayItemActive
                ]}
            >
                <Text style={[styles.dayText, isSelected && styles.dayTextActive]}>{item.day}</Text>
                <Text style={[styles.dateText, isSelected && styles.dateTextActive]}>{item.date}</Text>
                {isSelected && <View style={styles.activeDot} />}
            </TouchableOpacity>
        );
    };

    const renderScheduleItem = ({ item, index }: any) => {
        return (
            <View style={styles.timelineRow}>
                {/* Time Column */}
                <View style={styles.timeColumn}>
                    <Text style={styles.timeText}>{item.time}</Text>
                    <View style={styles.timeLineContainer}>
                        <View style={styles.verticalLine} />
                    </View>
                </View>

                {/* Content Card */}
                <TouchableOpacity activeOpacity={0.8} style={styles.classCard}>
                    <View style={[styles.cardTypeBadge, { backgroundColor: item.color + '20' }]}>
                        <Text style={[styles.cardTypeText, { color: item.color }]}>{item.type}</Text>
                    </View>
                    
                    <Text style={styles.classTitle}>{item.subject}</Text>
                    
                    <View style={styles.classDetails}>
                        <View style={styles.detailRow}>
                            <Clock size={14} color={Palette.gray400} />
                            <Text style={styles.detailText}>{item.time} - {item.endTime}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <MapPin size={14} color={Palette.gray400} />
                            <Text style={styles.detailText}>{item.room}</Text>
                        </View>
                    </View>

                    <View style={styles.instructorRow}>
                        <View style={styles.instructorAvatar}>
                            <User size={16} color={Palette.gray500} />
                        </View>
                        <Text style={styles.instructorName}>{item.instructor}</Text>
                        <View style={[styles.colorStrip, { backgroundColor: item.color }]} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <Animated.View entering={SlideInRight.duration(180)} exiting={SlideOutRight.duration(180)} style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            {/* Modern Header */}
            <View style={styles.header}>
                <View style={styles.watermarkContainer}>
                    <Calendar size={120} color={Palette.primary} opacity={0.1} />
                </View>
                <TouchableOpacity onPress={() => setScreen('Home')} style={styles.iconBtn}>
                    <ArrowLeft size={24} color={Palette.gray900} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>My Schedule</Text>
                    <Text style={styles.headerSubtitle}>March 2026</Text>
                </View>
                <TouchableOpacity style={styles.iconBtn}>
                    <Search size={22} color={Palette.gray900} />
                </TouchableOpacity>
            </View>

            {/* Horizontal Day Picker */}
            <View style={styles.calendarStrip}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.dayScrollContent}
                >
                    {DAYS.map(renderDayItem)}
                </ScrollView>
            </View>

            {/* Schedule List */}
            <View style={styles.scheduleContainer}>
                <View style={styles.scheduleHeader}>
                    <Text style={styles.listTitle}>
                        {DAYS.find(d => d.date === selectedDate)?.full}
                    </Text>
                    <TouchableOpacity style={styles.viewToggle}>
                        <Calendar size={18} color={Palette.primary} />
                        <Text style={styles.viewToggleText}>Month View</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={SCHEDULE_DATA[selectedDate as keyof typeof SCHEDULE_DATA] || []}
                    renderItem={renderScheduleItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listPadding}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Calendar size={60} color={Palette.gray200} strokeWidth={1} />
                            <Text style={styles.emptyText}>No classes scheduled for this day</Text>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 40 : 10,
        paddingBottom: 20,
        overflow: 'hidden',
    },
    watermarkContainer: {
        position: 'absolute',
        right: -30,
        top: -20,
        transform: [{ rotate: '15deg' }],
    },
    iconBtn: {
        width: 45,
        height: 45,
        borderRadius: 15,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: Palette.gray900,
    },
    headerSubtitle: {
        fontSize: 12,
        color: Palette.gray500,
        fontWeight: '600',
    },
    calendarStrip: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    dayScrollContent: {
        paddingHorizontal: 15,
    },
    dayItem: {
        width: 60,
        height: 85,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        borderRadius: 20,
        backgroundColor: '#F8F9FA',
    },
    dayItemActive: {
        backgroundColor: Palette.primary,
        elevation: 8,
        shadowColor: Palette.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    dayText: {
        fontSize: 12,
        fontWeight: '600',
        color: Palette.gray500,
        marginBottom: 8,
    },
    dayTextActive: {
        color: 'rgba(255,255,255,0.8)',
    },
    dateText: {
        fontSize: 18,
        fontWeight: '800',
        color: Palette.gray900,
    },
    dateTextActive: {
        color: Palette.white,
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Palette.white,
        marginTop: 6,
    },
    scheduleContainer: {
        flex: 1,
        backgroundColor: '#FDFDFD',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        marginTop: 10,
    },
    scheduleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingTop: 25,
        paddingBottom: 15,
    },
    listTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: Palette.gray900,
    },
    viewToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F9F9',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    viewToggleText: {
        fontSize: 12,
        fontWeight: '700',
        color: Palette.primary,
        marginLeft: 6,
    },
    listPadding: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    timelineRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    timeColumn: {
        width: 70,
        alignItems: 'center',
        paddingTop: 10,
    },
    timeText: {
        fontSize: 12,
        fontWeight: '700',
        color: Palette.gray400,
    },
    timeLineContainer: {
        flex: 1,
        width: 2,
        alignItems: 'center',
        marginTop: 10,
    },
    verticalLine: {
        flex: 1,
        width: 2,
        backgroundColor: '#F0F0F0',
        borderRadius: 1,
    },
    classCard: {
        flex: 1,
        backgroundColor: Palette.white,
        borderRadius: 24,
        padding: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: '#F5F5F5',
    },
    cardTypeBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 12,
    },
    cardTypeText: {
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    classTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: Palette.gray900,
        marginBottom: 12,
    },
    classDetails: {
        gap: 8,
        marginBottom: 15,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        fontSize: 13,
        fontWeight: '600',
        color: Palette.gray500,
        marginLeft: 8,
    },
    instructorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#F8F9FA',
    },
    instructorAvatar: {
        width: 30,
        height: 30,
        borderRadius: 10,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    instructorName: {
        fontSize: 13,
        fontWeight: '700',
        color: Palette.gray700,
        flex: 1,
    },
    colorStrip: {
        width: 20,
        height: 4,
        borderRadius: 2,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyText: {
        marginTop: 15,
        fontSize: 14,
        color: Palette.gray400,
        fontWeight: '500',
    },
});

export default Schedule;
