import { useNavigation } from '@/app/(tabs)/index';
import { 
    ArrowLeft, 
    Book, 
    BookOpen, 
    ChevronRight, 
    Clock, 
    GraduationCap, 
    Layout, 
    MoreVertical, 
    Search, 
    User 
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInRight, SlideInRight, SlideOutRight } from 'react-native-reanimated';
import { Palette } from '../color/color';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const { width } = Dimensions.get('window');

// --- Mock Data ---
const COURSES_DATA = [
    {
        id: '1',
        code: 'MATH402',
        title: 'Advanced Mathematics',
        instructor: 'Dr. Sarah Wilson',
        progress: 0.75,
        color: Palette.primary,
        units: 3,
        image: 'https://images.unsplash.com/photo-1509228468518-180dd482180c?q=80&w=400&auto=format&fit=crop',
    },
    {
        id: '2',
        code: 'CS305',
        title: 'Computer Science & AI',
        instructor: 'Engr. David Miller',
        progress: 0.45,
        color: Palette.violet,
        units: 3,
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop',
    },
    {
        id: '3',
        code: 'PHYS201',
        title: 'Physics of Motion',
        instructor: 'Prof. Michael Chen',
        progress: 0.90,
        color: Palette.sky,
        units: 4,
        image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=400&auto=format&fit=crop',
    },
    {
        id: '4',
        code: 'WEB202',
        title: 'Fullstack Development',
        instructor: 'Ms. Joanna Lee',
        progress: 0.30,
        color: Palette.orange,
        units: 3,
        image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=400&auto=format&fit=crop',
    },
];

const Courses = () => {
    const { setScreen } = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');

    const renderCourseCard = ({ item, index }: any) => {
        return (
            <AnimatedTouchableOpacity 
                entering={FadeInRight.delay(index * 150)}
                style={styles.courseCard}
                onPress={() => {}} // Could lead to course details
            >
                <Image source={{ uri: item.image }} style={styles.courseImage} />
                <View style={styles.courseOverlay}>
                    <View style={styles.badgeContainer}>
                        <View style={[styles.unitBadge, { backgroundColor: item.color }]}>
                            <Text style={styles.unitText}>{item.units} Units</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.courseContent}>
                    <View style={styles.courseHeader}>
                        <Text style={styles.courseCode}>{item.code}</Text>
                        <TouchableOpacity>
                            <MoreVertical size={18} color={Palette.gray400} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.courseTitle} numberOfLines={1}>{item.title}</Text>
                    
                    <View style={styles.instructorInfo}>
                        <User size={14} color={Palette.gray400} />
                        <Text style={styles.instructorName}>{item.instructor}</Text>
                    </View>

                    <View style={styles.progressSection}>
                        <View style={styles.progressTextRow}>
                            <Text style={styles.progressLabel}>Completion</Text>
                            <Text style={[styles.progressValue, { color: item.color }]}>
                                {Math.round(item.progress * 100)}%
                            </Text>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View 
                                style={[
                                    styles.progressBarFill, 
                                    { width: `${item.progress * 100}%`, backgroundColor: item.color }
                                ]} 
                            />
                        </View>
                    </View>
                </View>
            </AnimatedTouchableOpacity>
        );
    };

    return (
        <Animated.View entering={SlideInRight.duration(180)} exiting={SlideOutRight.duration(180)} style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            {/* Nav Header */}
            <View style={styles.navHeader}>
                <TouchableOpacity onPress={() => setScreen('Home')} style={styles.roundBtn}>
                    <ArrowLeft size={22} color={Palette.gray900} />
                </TouchableOpacity>
                <Text style={styles.navTitle}>Active Courses</Text>
                <TouchableOpacity style={styles.roundBtn}>
                    <Layout size={22} color={Palette.gray900} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {/* Search Bar */}
                <View style={styles.searchBarContainer}>
                    <Search size={20} color={Palette.gray400} style={styles.searchIcon} />
                    <TextInput 
                        placeholder="Search your courses..."
                        placeholderTextColor={Palette.gray400}
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Categories */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    style={styles.categoryScroll}
                    contentContainerStyle={styles.categoryContent}
                >
                    {['All Courses', 'Science', 'Math', 'Engineering', 'History'].map((cat, idx) => (
                        <TouchableOpacity 
                            key={cat} 
                            style={[styles.categoryBtn, idx === 0 && styles.categoryBtnActive]}
                        >
                            <Text style={[styles.categoryText, idx === 0 && styles.categoryTextActive]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Course List */}
                <FlatList
                    data={COURSES_DATA}
                    renderItem={renderCourseCard}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listPadding}
                    numColumns={1}
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
    navHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    roundBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F7F8FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: Palette.gray900,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F4F6F8',
        borderRadius: 16,
        paddingHorizontal: 15,
        height: 54,
        marginTop: 10,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: Palette.gray900,
    },
    categoryScroll: {
        height: 55,
        marginTop: 15,
        marginBottom: 5,
    },
    categoryContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingRight: 20,
    },
    categoryBtn: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: '#F0F2F5',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryBtnActive: {
        backgroundColor: Palette.primary,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '700',
        color: Palette.gray500,
    },
    categoryTextActive: {
        color: Palette.white,
    },
    listPadding: {
        paddingTop: 10,
        paddingBottom: 40,
    },
    courseCard: {
        backgroundColor: Palette.white,
        borderRadius: 24,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F0F2F5',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    courseImage: {
        width: '100%',
        height: 140,
    },
    courseOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 140,
        backgroundColor: 'rgba(0,0,0,0.1)',
        padding: 15,
    },
    badgeContainer: {
        flexDirection: 'row',
    },
    unitBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    unitText: {
        color: Palette.white,
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    courseContent: {
        padding: 20,
    },
    courseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    courseCode: {
        fontSize: 12,
        fontWeight: '800',
        color: Palette.primary,
    },
    courseTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: Palette.gray900,
        marginBottom: 12,
    },
    instructorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    instructorName: {
        fontSize: 13,
        fontWeight: '600',
        color: Palette.gray500,
        marginLeft: 8,
    },
    progressSection: {
        width: '100%',
    },
    progressTextRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: Palette.gray400,
    },
    progressValue: {
        fontSize: 12,
        fontWeight: '800',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#F0F2F5',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
});

export default Courses;
