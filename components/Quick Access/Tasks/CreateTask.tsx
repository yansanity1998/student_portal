import { 
    Calendar, 
    ChevronDown, 
    Clock, 
    ListTodo, 
    Tag, 
    X 
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { 
    FadeIn, 
    FadeOut, 
    SlideInDown, 
    SlideOutDown 
} from 'react-native-reanimated';
import { Palette } from '../../color/color';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CreateTaskProps {
    isVisible: boolean;
    onClose: () => void;
    onSave: (task: any) => void;
}

const CATEGORIES = ['Assignment', 'Project', 'Quiz', 'Exam', 'Self Study'];
const PRIORITIES = [
    { label: 'High', color: Palette.error },
    { label: 'Medium', color: Palette.warning },
    { label: 'Low', color: Palette.success }
];

const CreateTask = ({ isVisible, onClose, onSave }: CreateTaskProps) => {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('Assignment');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState('Mar 18, 2026'); // Mock default

    const handleSave = () => {
        if (!title || !subject) return;
        
        const priorityData = PRIORITIES.find(p => p.label === priority);
        
        onSave({
            id: Math.random().toString(),
            title,
            subject,
            category,
            priority,
            dueDate,
            status: 'To Do',
            color: priorityData?.color || Palette.primary
        });
        
        // Reset and close
        setTitle('');
        setSubject('');
        onClose();
    };

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Animated.View 
                    entering={FadeIn} 
                    exiting={FadeOut}
                    style={StyleSheet.absoluteFill}
                >
                    <Pressable style={styles.backdrop} onPress={onClose} />
                </Animated.View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <Animated.View 
                        entering={SlideInDown.duration(200)}
                        exiting={SlideOutDown.duration(200)}
                        style={styles.sheetContainer}
                    >
                        {/* Handle */}
                        <View style={styles.handle} />

                        {/* Top Bar */}
                        <View style={styles.header}>
                            <View style={styles.headerTitleContainer}>
                                <View style={styles.iconCircle}>
                                    <ListTodo size={20} color={Palette.primary} />
                                </View>
                                <Text style={styles.headerTitle}>Create New Task</Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                <X size={20} color={Palette.gray500} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView 
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            {/* Task Title */}
                            <View style={styles.inputSection}>
                                <Text style={styles.inputLabel}>TASK TITLE</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="What needs to be done?"
                                        placeholderTextColor={Palette.gray400}
                                        value={title}
                                        onChangeText={setTitle}
                                    />
                                </View>
                            </View>

                            {/* Subject */}
                            <View style={styles.inputSection}>
                                <Text style={styles.inputLabel}>COURSE / SUBJECT</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. Computer Science"
                                        placeholderTextColor={Palette.gray400}
                                        value={subject}
                                        onChangeText={setSubject}
                                    />
                                </View>
                            </View>

                            {/* Category Selector */}
                            <View style={styles.inputSection}>
                                <Text style={styles.inputLabel}>CATEGORY</Text>
                                <View style={styles.pillContainer}>
                                    {CATEGORIES.map((cat) => (
                                        <TouchableOpacity 
                                            key={cat}
                                            onPress={() => setCategory(cat)}
                                            style={[
                                                styles.pill, 
                                                category === cat && styles.pillActive
                                            ]}
                                        >
                                            <Text style={[
                                                styles.pillText, 
                                                category === cat && styles.pillTextActive
                                            ]}>{cat}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Priority Selection */}
                            <View style={styles.inputSection}>
                                <Text style={styles.inputLabel}>PRIORITY</Text>
                                <View style={styles.priorityContainer}>
                                    {PRIORITIES.map((p) => (
                                        <TouchableOpacity 
                                            key={p.label}
                                            onPress={() => setPriority(p.label)}
                                            style={[
                                                styles.priorityBtn,
                                                priority === p.label && { backgroundColor: p.color + '15', borderColor: p.color }
                                            ]}
                                        >
                                            <View style={[styles.dot, { backgroundColor: p.color }]} />
                                            <Text style={[
                                                styles.priorityLabel,
                                                priority === p.label && { color: p.color }
                                            ]}>{p.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Date & Time Mock Ups */}
                            <View style={styles.row}>
                                <View style={[styles.inputSection, { flex: 1, marginRight: 10 }]}>
                                    <Text style={styles.inputLabel}>DUE DATE</Text>
                                    <TouchableOpacity style={styles.dateSelector}>
                                        <Calendar size={16} color={Palette.gray500} />
                                        <Text style={styles.dateText}>{dueDate}</Text>
                                        <ChevronDown size={14} color={Palette.gray400} />
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.inputSection, { flex: 1 }]}>
                                    <Text style={styles.inputLabel}>TIME</Text>
                                    <TouchableOpacity style={styles.dateSelector}>
                                        <Clock size={16} color={Palette.gray500} />
                                        <Text style={styles.dateText}>11:59 PM</Text>
                                        <ChevronDown size={14} color={Palette.gray400} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                            {/* Submit Button */}
                            <TouchableOpacity 
                                style={[styles.createBtn, (!title || !subject) && styles.createBtnDisabled]}
                                onPress={handleSave}
                                disabled={!title || !subject}
                            >
                                <Text style={styles.createBtnText}>Add To Schedule</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </Animated.View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    keyboardView: {
        width: '100%',
    },
    sheetContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingBottom: Platform.OS === 'ios' ? 40 : 25,
        maxHeight: SCREEN_HEIGHT * 0.85,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#E5E7EB',
        borderRadius: 5,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: Palette.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: Palette.gray900,
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    inputSection: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: Palette.gray400,
        letterSpacing: 1,
        marginBottom: 10,
    },
    inputWrapper: {
        backgroundColor: '#F9FAFB',
        borderRadius: 15,
        paddingHorizontal: 16,
        height: 54,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    input: {
        fontSize: 15,
        fontWeight: '600',
        color: Palette.gray900,
    },
    pillContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    pill: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
        marginBottom: 8,
    },
    pillActive: {
        backgroundColor: Palette.primary,
    },
    pillText: {
        fontSize: 12,
        fontWeight: '700',
        color: Palette.gray500,
    },
    pillTextActive: {
        color: '#FFFFFF',
    },
    priorityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    priorityBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginHorizontal: 3,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 8,
    },
    priorityLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: Palette.gray500,
    },
    row: {
        flexDirection: 'row',
    },
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        height: 50,
        borderRadius: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    dateText: {
        flex: 1,
        fontSize: 13,
        fontWeight: '600',
        color: Palette.gray700,
        marginLeft: 10,
    },
    createBtn: {
        backgroundColor: Palette.primary,
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        elevation: 4,
        shadowColor: Palette.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    createBtnDisabled: {
        backgroundColor: Palette.gray400,
        shadowOpacity: 0.1,
    },
    createBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
});

export default CreateTask;
