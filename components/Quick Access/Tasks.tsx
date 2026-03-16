import { useNavigation } from '@/app/(tabs)/index';
import { 
    ArrowLeft, 
    Calendar, 
    CheckCircle2, 
    Circle, 
    Clock, 
    Filter, 
    ListTodo, 
    MessageSquare, 
    MoreVertical, 
    Plus, 
    Search, 
    Tag 
} from 'lucide-react-native';
import React, { useState } from 'react';
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
} from 'react-native';
import Animated, { FadeInLeft, Layout, SlideInRight, SlideOutRight } from 'react-native-reanimated';
import { Palette } from '../color/color';

const { width } = Dimensions.get('window');

// --- Mock Data ---
const TASK_DATA = [
    {
        id: '1',
        title: 'Submit Math Assignment 4',
        subject: 'Advanced Mathematics',
        dueDate: 'Today, 11:59 PM',
        status: 'To Do',
        priority: 'High',
        category: 'Assignment',
        color: Palette.error,
    },
    {
        id: '2',
        title: 'Prepare Presentation Slides',
        subject: 'Computer Science',
        dueDate: 'Tomorrow, 10:00 AM',
        status: 'In Progress',
        priority: 'Medium',
        category: 'Project',
        color: Palette.warning,
    },
    {
        id: '3',
        title: 'Review Physics Chapter 5',
        subject: 'Physics of Motion',
        dueDate: 'Mar 15, 2026',
        status: 'To Do',
        priority: 'Low',
        category: 'Self Study',
        color: Palette.success,
    },
    {
        id: '4',
        title: 'Weekly Quiz - Networking',
        subject: 'Networking 2',
        dueDate: 'Mar 16, 2026',
        status: 'Done',
        priority: 'High',
        category: 'Quiz',
        color: Palette.primary,
    },
];

const Tasks = () => {
    const { setScreen } = useNavigation();
    const [filter, setFilter] = useState('All');

    const renderTaskItem = ({ item, index }: any) => {
        const isDone = item.status === 'Done';

        return (
            <Animated.View 
                entering={FadeInLeft.delay(index * 100)}
                layout={Layout.springify()}
                style={[styles.taskCard, isDone && styles.taskCardDone]}
            >
                <TouchableOpacity style={styles.checkButton}>
                    {isDone ? (
                        <CheckCircle2 size={24} color={Palette.success} />
                    ) : (
                        <Circle size={24} color={Palette.gray400} />
                    )}
                </TouchableOpacity>

                <View style={styles.taskInfo}>
                    <View style={styles.taskHeader}>
                        <Text style={[styles.subjectText, { color: item.color }]}>{item.subject}</Text>
                        <TouchableOpacity>
                            <MoreVertical size={16} color={Palette.gray400} />
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.taskTitle, isDone && styles.taskTitleDone]}>
                        {item.title}
                    </Text>

                    <View style={styles.taskFooter}>
                        <View style={styles.footerDetail}>
                            <Clock size={12} color={isDone ? Palette.gray400 : Palette.gray500} />
                            <Text style={[styles.footerText, isDone && styles.footerTextDone]}>
                                {item.dueDate}
                            </Text>
                        </View>
                        <View style={[styles.priorityBadge, { backgroundColor: item.color + '10' }]}>
                            <Tag size={10} color={item.color} />
                            <Text style={[styles.priorityText, { color: item.color }]}>{item.priority}</Text>
                        </View>
                    </View>
                </View>
            </Animated.View>
        );
    };

    return (
        <Animated.View entering={SlideInRight.duration(180)} exiting={SlideOutRight.duration(180)} style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setScreen('Home')} style={styles.iconBtn}>
                    <ArrowLeft size={24} color={Palette.gray900} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Academic Tasks</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <Search size={22} color={Palette.gray900} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {/* Status Tabs */}
                <View style={styles.tabContainer}>
                    {['All', 'To Do', 'In Progress', 'Done'].map((tab) => (
                        <TouchableOpacity 
                            key={tab} 
                            style={[styles.tab, filter === tab && styles.tabActive]}
                            onPress={() => setFilter(tab)}
                        >
                            <Text style={[styles.tabText, filter === tab && styles.tabTextActive]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Task List */}
                <FlatList
                    data={filter === 'All' ? TASK_DATA : TASK_DATA.filter(t => t.status === filter)}
                    renderItem={renderTaskItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listPadding}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <ListTodo size={60} color={Palette.gray200} strokeWidth={1} />
                            <Text style={styles.emptyText}>All caught up! No tasks here.</Text>
                        </View>
                    )}
                />
            </View>

            {/* Floating Action Button */}
            <TouchableOpacity style={styles.fab}>
                <Plus size={30} color={Palette.white} />
            </TouchableOpacity>
        </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F4F5F7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: Palette.gray900,
    },
    content: {
        flex: 1,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
        marginRight: 10,
    },
    tabActive: {
        backgroundColor: Palette.primary + '15',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '700',
        color: Palette.gray400,
    },
    tabTextActive: {
        color: Palette.primary,
    },
    listPadding: {
        padding: 20,
        paddingBottom: 100,
    },
    taskCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 18,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: '#F0F2F5',
    },
    taskCardDone: {
        opacity: 0.7,
        backgroundColor: '#F8F9FA',
    },
    checkButton: {
        marginRight: 15,
        marginTop: 2,
    },
    taskInfo: {
        flex: 1,
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    subjectText: {
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Palette.gray900,
        marginBottom: 12,
    },
    taskTitleDone: {
        textDecorationLine: 'line-through',
        color: Palette.gray500,
    },
    taskFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerDetail: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        fontWeight: '600',
        color: Palette.gray500,
        marginLeft: 6,
    },
    footerTextDone: {
        color: Palette.gray400,
    },
    priorityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    priorityText: {
        fontSize: 10,
        fontWeight: '800',
        marginLeft: 4,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 25,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Palette.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: Palette.primary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 15,
        fontSize: 15,
        color: Palette.gray400,
        fontWeight: '600',
    },
});

export default Tasks;
