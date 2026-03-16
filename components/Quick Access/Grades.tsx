import { useNavigation } from '@/app/(tabs)/index';
import { 
    ArrowLeft, 
    BarChart2,
    ChevronDown, 
    GraduationCap, 
    TrendingUp, 
    Award,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Dimensions,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
} from 'react-native';
import Animated, { FadeInUp, Layout, SlideInRight, SlideOutRight } from 'react-native-reanimated';
import Svg, { Polyline, Circle as SvgCircle, Text as SvgText, Rect } from 'react-native-svg';
import { Palette } from '../color/color';

const { width } = Dimensions.get('window');

// --- Mock Data ---
const GRADE_DATA: Record<string, Record<string, any[]>> = {
    '2024-2025': {
        '1st Semester': [
            { id: '1', code: 'CS301', title: 'Data Structures', units: 3, grade: '1.25', status: 'Passed' },
            { id: '2', code: 'CS302', title: 'Web Development', units: 3, grade: '1.50', status: 'Passed' },
            { id: '3', code: 'MATH201', title: 'Discrete Math', units: 3, grade: '1.75', status: 'Passed' },
            { id: '4', code: 'GE401', title: 'Art Appreciation', units: 3, grade: '1.25', status: 'Passed' },
            { id: '5', code: 'GE402', title: 'Ethics', units: 3, grade: '1.00', status: 'Passed' },
            { id: '6', code: 'ENG301', title: 'Technical Writing', units: 3, grade: '1.50', status: 'Passed' },
            { id: '7', code: 'IT301', title: 'Networking 1', units: 3, grade: '2.00', status: 'Passed' },
            { id: '8', code: 'IT302', title: 'Database Systems', units: 3, grade: '1.75', status: 'Passed' },
        ],
        '2nd Semester': [
            { id: '9', code: 'CS303', title: 'Software Engineering', units: 3, grade: '1.50', status: 'Passed' },
            { id: '10', code: 'CS304', title: 'Automata Theory', units: 3, grade: '2.25', status: 'Passed' },
            { id: '11', code: 'MATH202', title: 'Logic Design', units: 3, grade: '1.75', status: 'Passed' },
            { id: '12', code: 'GE403', title: 'Philippine History', units: 3, grade: '1.00', status: 'Passed' },
            { id: '13', code: 'GE404', title: 'Rizal', units: 3, grade: '1.25', status: 'Passed' },
            { id: '14', code: 'ENG302', title: 'Speech Comms', units: 3, grade: '1.50', status: 'Passed' },
            { id: '15', code: 'IT303', title: 'Networking 2', units: 3, grade: '1.75', status: 'Passed' },
            { id: '16', code: 'IT304', title: 'Systems Admin', units: 3, grade: '2.00', status: 'Passed' },
        ]
    },
    '2023-2024': {
        '1st Semester': [
            { id: '17', code: 'CS201', title: 'Programming 1', units: 3, grade: '1.50', status: 'Passed' },
            { id: '18', code: 'MATH101', title: 'Calculus 1', units: 3, grade: '2.00', status: 'Passed' },
        ],
        '2nd Semester': [
            { id: '19', code: 'CS202', title: 'Programming 2', units: 3, grade: '1.50', status: 'Passed' },
            { id: '20', code: 'MATH102', title: 'Calculus 2', units: 3, grade: '2.00', status: 'Passed' },
        ]
    }
};

const GPA_TREND = [
    { term: '1-1', gpa: 1.75 },
    { term: '1-2', gpa: 1.50 },
    { term: '2-1', gpa: 1.65 },
    { term: '2-2', gpa: 1.45 },
];

const Grades = () => {
    const { setScreen } = useNavigation();
    const [selectedYear, setSelectedYear] = useState('2024-2025');

    const yearData = GRADE_DATA[selectedYear] || {};
    const semesters = Object.keys(yearData);
    
    // Calculate Yearly Average
    let totalGrades = 0;
    let totalSubjects = 0;
    semesters.forEach(sem => {
        yearData[sem].forEach((subject: any) => {
            totalGrades += parseFloat(subject.grade);
            totalSubjects++;
        });
    });
    const yearlyAverage = totalSubjects > 0 ? (totalGrades / totalSubjects).toFixed(2) : '0.00';

    const renderBarChart = () => {
        const chartHeight = 130;
        const chartWidth = width - 80;
        const padding = 20;
        const barWidth = 36;
        const gap = (chartWidth - padding * 2 - barWidth * GPA_TREND.length) / (GPA_TREND.length - 1);

        return (
            <View style={styles.chartContainer}>
                <View style={styles.chartHeader}>
                    <BarChart2 size={20} color={Palette.primary} />
                    <Text style={styles.chartTitle}>GPA Per Semester</Text>
                </View>
                <View style={styles.graphAreaWrapper}>
                    <Svg height={chartHeight} width="100%">
                        {GPA_TREND.map((item, index) => {
                            const barHeight = Math.max(((2.5 - item.gpa) / 1.5) * (chartHeight - 40), 10);
                            const x = padding + index * (barWidth + gap);
                            const y = chartHeight - 20 - barHeight;
                            const isLast = index === GPA_TREND.length - 1;
                            return (
                                <React.Fragment key={index}>
                                    <Rect
                                        x={x}
                                        y={y}
                                        width={barWidth}
                                        height={barHeight}
                                        rx={8}
                                        fill={isLast ? Palette.primary : Palette.primary + '60'}
                                    />
                                    <SvgText
                                        x={x + barWidth / 2}
                                        y={y - 6}
                                        fontSize="11"
                                        fill={Palette.primary}
                                        fontWeight="bold"
                                        textAnchor="middle"
                                    >
                                        {item.gpa.toFixed(2)}
                                    </SvgText>
                                    <SvgText
                                        x={x + barWidth / 2}
                                        y={chartHeight - 4}
                                        fontSize="10"
                                        fill={Palette.gray400}
                                        fontWeight="bold"
                                        textAnchor="middle"
                                    >
                                        {item.term}
                                    </SvgText>
                                </React.Fragment>
                            );
                        })}
                    </Svg>
                </View>
            </View>
        );
    };

    const renderGraph = () => {
        const chartHeight = 120;
        const chartWidth = width - 80; // approximate width inside card
        const padding = 20;

        const points = GPA_TREND.map((item, index) => {
            const x = padding + (index * (chartWidth - padding * 2)) / Math.max(GPA_TREND.length - 1, 1);
            // PH Grade: 1.0 is highest (top). Map 1.0 -> padding, 3.0 -> chartHeight - padding
            const y = padding + ((item.gpa - 1.0) / 2.0) * (chartHeight - padding * 2);
            return { x, y, gpa: item.gpa, term: item.term };
        });

        const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');

        return (
            <View style={styles.chartContainer}>
                <View style={styles.chartHeader}>
                    <TrendingUp size={20} color={Palette.primary} />
                    <Text style={styles.chartTitle}>GPA Analysis</Text>
                </View>
                <View style={styles.graphAreaWrapper}>
                    <Svg height={chartHeight} width="100%">
                        <Polyline
                            points={pointsString}
                            fill="none"
                            stroke={Palette.primary}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {points.map((p, index) => (
                            <React.Fragment key={index}>
                                <SvgCircle
                                    cx={p.x}
                                    cy={p.y}
                                    r="5"
                                    fill={Palette.white}
                                    stroke={Palette.primary}
                                    strokeWidth="2"
                                />
                                <SvgText
                                    x={p.x}
                                    y={p.y - 12}
                                    fontSize="11"
                                    fill={Palette.primary}
                                    fontWeight="bold"
                                    textAnchor="middle"
                                >
                                    {p.gpa.toFixed(2)}
                                </SvgText>
                                <SvgText
                                    x={p.x}
                                    y={chartHeight - 2}
                                    fontSize="10"
                                    fill={Palette.gray400}
                                    fontWeight="bold"
                                    textAnchor="middle"
                                >
                                    {p.term}
                                </SvgText>
                            </React.Fragment>
                        ))}
                    </Svg>
                </View>
            </View>
        );
    };

    const renderTermTable = (semester: string, index: number) => {
        const subjects = yearData[semester];
        const termAverage = (subjects.reduce((acc: any, curr: any) => acc + parseFloat(curr.grade), 0) / subjects.length).toFixed(2);
        
        return (
            <Animated.View 
                key={semester}
                layout={Layout.springify()} 
                entering={FadeInUp.delay(100 * index)}
                style={styles.tableContainer}
            >
                <View style={styles.tableHeaderSection}>
                    <Text style={styles.tableTitle}>{semester}</Text>
                    <View style={styles.termGPABadge}>
                        <Text style={styles.termGPAText}>Term GPA: {termAverage}</Text>
                    </View>
                </View>

                {/* Table Header */}
                <View style={styles.tableRowHeader}>
                    <Text style={[styles.tableColHeader, { flex: 1.5 }]}>Code</Text>
                    <Text style={[styles.tableColHeader, { flex: 3 }]}>Subject</Text>
                    <Text style={[styles.tableColHeader, { flex: 1, textAlign: 'center' }]}>Units</Text>
                    <Text style={[styles.tableColHeader, { flex: 1, textAlign: 'center' }]}>Grade</Text>
                </View>

                {/* Table Rows */}
                {subjects.map((item: any, idx: number) => (
                    <View key={item.id} style={[styles.tableRow, idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
                        <Text style={[styles.tableCellCode, { flex: 1.5 }]}>{item.code}</Text>
                        <Text style={[styles.tableCell, { flex: 3 }]} numberOfLines={2}>{item.title}</Text>
                        <Text style={[styles.tableCellCenter, { flex: 1 }]}>{item.units}</Text>
                        <Text style={[styles.tableCellGrade, { flex: 1 }]}>{item.grade}</Text>
                    </View>
                ))}
            </Animated.View>
        );
    };

    return (
        <Animated.View entering={SlideInRight.duration(180)} exiting={SlideOutRight.duration(180)} style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setScreen('Home')} style={styles.backButton}>
                    <ArrowLeft size={24} color={Palette.gray900} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Academic Grades</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* GPA Summary Card */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryInfo}>
                        <Text style={styles.summaryLabel}>Yearly GPA</Text>
                        <Text style={styles.summaryGPA}>{yearlyAverage}</Text>
                        <View style={styles.rankingBadge}>
                            <Award size={14} color={Palette.white} />
                            <Text style={styles.rankingText}>Dean's Lister</Text>
                        </View>
                    </View>
                    <View style={styles.summaryVisual}>
                        <GraduationCap size={60} color={Palette.white} opacity={0.2} />
                    </View>
                </View>

                {/* Term Tables */}
                {semesters.map((sem, idx) => renderTermTable(sem, idx))}

                {/* Analysis Graphs (Below grades) */}
                {renderGraph()}
                {renderBarChart()}
                
            </ScrollView>
        </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#F8F9FA',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: Palette.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: Palette.gray900,
    },
    placeholder: {
        width: 44,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    summaryCard: {
        height: 140,
        backgroundColor: Palette.primary,
        borderRadius: 28,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        elevation: 8,
    },
    summaryInfo: {
        flex: 1,
    },
    summaryLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '600',
    },
    summaryGPA: {
        color: Palette.white,
        fontSize: 38,
        fontWeight: '900',
        marginVertical: 4,
    },
    rankingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    rankingText: {
        color: Palette.white,
        fontSize: 11,
        fontWeight: '700',
        marginLeft: 4,
    },
    summaryVisual: {
        padding: 10,
    },
    chartContainer: {
        backgroundColor: Palette.white,
        borderRadius: 24,
        padding: 20,
        marginTop: 20,
        elevation: 2,
    },
    chartHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    chartTitle: {
        marginLeft: 10,
        fontSize: 15,
        fontWeight: '700',
        color: Palette.gray900,
    },
    graphAreaWrapper: {
        height: 120,
        width: '100%',
        marginTop: 5,
    },
    filterSection: {
        marginTop: 20,
        marginBottom: 10,
    },
    pickerBtnFull: {
        backgroundColor: Palette.white,
        padding: 18,
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    pickerLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: Palette.gray400,
        marginBottom: 5,
    },
    pickerValueRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pickerValue: {
        fontSize: 16,
        fontWeight: '800',
        color: Palette.gray900,
    },
    tableContainer: {
        backgroundColor: Palette.white,
        borderRadius: 24,
        marginTop: 20,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    tableHeaderSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 18,
        backgroundColor: Palette.primary + '10',
        borderBottomWidth: 1,
        borderBottomColor: Palette.primary + '20',
    },
    tableTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: Palette.primary,
    },
    termGPABadge: {
        backgroundColor: Palette.white,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Palette.primary + '30',
    },
    termGPAText: {
        fontSize: 12,
        fontWeight: '800',
        color: Palette.primary,
    },
    tableRowHeader: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: '#FAFAFA',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    tableColHeader: {
        fontSize: 11,
        fontWeight: '800',
        color: Palette.gray500,
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 14,
        alignItems: 'center',
    },
    tableRowEven: {
        backgroundColor: Palette.white,
    },
    tableRowOdd: {
        backgroundColor: '#FCFCFC',
    },
    tableCell: {
        fontSize: 13,
        fontWeight: '600',
        color: Palette.gray800,
        paddingRight: 10,
    },
    tableCellCode: {
        fontSize: 12,
        fontWeight: '800',
        color: Palette.gray600,
    },
    tableCellCenter: {
        fontSize: 13,
        fontWeight: '600',
        color: Palette.gray600,
        textAlign: 'center',
    },
    tableCellGrade: {
        fontSize: 14,
        fontWeight: '800',
        color: Palette.primary,
        textAlign: 'center',
    },
});

export default Grades;
