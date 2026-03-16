import { useNavigation } from '@/app/(tabs)/index';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Palette } from '../color/color';

const logoImg = require('../../assets/images/ici_portal_logo.png');

const COURSE_OPTIONS = [
    'BS Computer Science',
    'BS Information Technology',
    'BS Criminology',
    'BS Nursing',
    'BS Education',
    'BS Business Administration',
    'BS Accountancy',
    'BS Engineering',
];

const YEAR_LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const Register = () => {
    const { setScreen } = useNavigation();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [studentId, setStudentId] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [section, setSection] = useState('');
    const [schoolYear, setSchoolYear] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showCourseDropdown, setShowCourseDropdown] = useState(false);
    const [showYearDropdown, setShowYearDropdown] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Brand Section — same as Login */}
                    <View style={styles.brandContainer}>
                        <View style={styles.logoCircle}>
                            <Image source={logoImg} style={styles.logoImage} />
                        </View>
                        <Text style={styles.brandName}>ICI Portal</Text>
                        <Text style={styles.brandTagline}>Your Student Portal Access</Text>
                    </View>

                    {/* Form Heading — same as Login */}
                    <View style={styles.formHeader}>
                        <Text style={styles.loginTitle}>Create Account</Text>
                        <Text style={styles.loginSubtitle}>Fill in your details to register as a student</Text>
                    </View>

                    {/* ── PERSONAL INFORMATION ── */}
                    <Text style={styles.groupLabel}>PERSONAL INFORMATION</Text>

                    <View style={styles.inputWrapper}>
                        <View style={styles.inputIcon}>
                            <Ionicons name="person-outline" size={20} color={Palette.primary} />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="First Name"
                            placeholderTextColor={Palette.gray400}
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <View style={styles.inputIcon}>
                            <Ionicons name="person-outline" size={20} color={Palette.primary} />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Last Name"
                            placeholderTextColor={Palette.gray400}
                            value={lastName}
                            onChangeText={setLastName}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <View style={styles.inputIcon}>
                            <Ionicons name="mail-outline" size={20} color={Palette.primary} />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Student Email"
                            placeholderTextColor={Palette.gray400}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <View style={styles.inputIcon}>
                            <Ionicons name="call-outline" size={20} color={Palette.primary} />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            placeholderTextColor={Palette.gray400}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    {/* ── SCHOOL INFORMATION ── */}
                    <Text style={styles.groupLabel}>SCHOOL INFORMATION</Text>

                    <View style={styles.inputWrapper}>
                        <View style={styles.inputIcon}>
                            <Ionicons name="card-outline" size={20} color={Palette.primary} />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Student ID Number (e.g. 2024-0012)"
                            placeholderTextColor={Palette.gray400}
                            value={studentId}
                            onChangeText={setStudentId}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Course Dropdown */}
                    <TouchableOpacity
                        style={styles.inputWrapper}
                        activeOpacity={0.8}
                        onPress={() => {
                            setShowCourseDropdown(!showCourseDropdown);
                            setShowYearDropdown(false);
                        }}
                    >
                        <View style={styles.inputIcon}>
                            <Ionicons name="book-outline" size={20} color={Palette.primary} />
                        </View>
                        <Text style={[styles.input, { color: selectedCourse ? Palette.gray900 : Palette.gray400 }]}>
                            {selectedCourse || 'Course / Program'}
                        </Text>
                        <Ionicons
                            name={showCourseDropdown ? 'chevron-up' : 'chevron-down'}
                            size={16}
                            color={Palette.primary}
                        />
                    </TouchableOpacity>
                    {showCourseDropdown && (
                        <View style={styles.dropdown}>
                            {COURSE_OPTIONS.map((c) => (
                                <TouchableOpacity
                                    key={c}
                                    style={[styles.dropdownItem, selectedCourse === c && styles.dropdownItemActive]}
                                    onPress={() => {
                                        setSelectedCourse(c);
                                        setShowCourseDropdown(false);
                                    }}
                                >
                                    <Text style={[styles.dropdownText, selectedCourse === c && styles.dropdownTextActive]}>{c}</Text>
                                    {selectedCourse === c && <Ionicons name="checkmark" size={15} color={Palette.primary} />}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Year Level Dropdown */}
                    <TouchableOpacity
                        style={styles.inputWrapper}
                        activeOpacity={0.8}
                        onPress={() => {
                            setShowYearDropdown(!showYearDropdown);
                            setShowCourseDropdown(false);
                        }}
                    >
                        <View style={styles.inputIcon}>
                            <Ionicons name="layers-outline" size={20} color={Palette.primary} />
                        </View>
                        <Text style={[styles.input, { color: selectedYear ? Palette.gray900 : Palette.gray400 }]}>
                            {selectedYear || 'Year Level'}
                        </Text>
                        <Ionicons
                            name={showYearDropdown ? 'chevron-up' : 'chevron-down'}
                            size={16}
                            color={Palette.primary}
                        />
                    </TouchableOpacity>
                    {showYearDropdown && (
                        <View style={styles.dropdown}>
                            {YEAR_LEVELS.map((y) => (
                                <TouchableOpacity
                                    key={y}
                                    style={[styles.dropdownItem, selectedYear === y && styles.dropdownItemActive]}
                                    onPress={() => {
                                        setSelectedYear(y);
                                        setShowYearDropdown(false);
                                    }}
                                >
                                    <Text style={[styles.dropdownText, selectedYear === y && styles.dropdownTextActive]}>{y}</Text>
                                    {selectedYear === y && <Ionicons name="checkmark" size={15} color={Palette.primary} />}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    <View style={styles.inputWrapper}>
                        <View style={styles.inputIcon}>
                            <Ionicons name="people-outline" size={20} color={Palette.primary} />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Section (e.g. A)"
                            placeholderTextColor={Palette.gray400}
                            value={section}
                            onChangeText={setSection}
                            autoCapitalize="characters"
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <View style={styles.inputIcon}>
                            <Ionicons name="calendar-outline" size={20} color={Palette.primary} />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="School Year (e.g. 2024–2025)"
                            placeholderTextColor={Palette.gray400}
                            value={schoolYear}
                            onChangeText={setSchoolYear}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* ── ACCOUNT CREDENTIALS ── */}
                    <Text style={styles.groupLabel}>ACCOUNT CREDENTIALS</Text>

                    <View style={styles.inputWrapper}>
                        <View style={styles.inputIcon}>
                            <Ionicons name="lock-closed-outline" size={20} color={Palette.primary} />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={Palette.gray400}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={Palette.primary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputWrapper}>
                        <View style={styles.inputIcon}>
                            <Ionicons name="lock-closed-outline" size={20} color={Palette.primary} />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            placeholderTextColor={Palette.gray400}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                            <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={Palette.primary} />
                        </TouchableOpacity>
                    </View>

                    {/* Register Button — same style as Login button */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.loginButton,
                            {
                                backgroundColor: pressed ? 'rgba(255,255,255,0.9)' : Palette.white,
                                transform: [{ scale: pressed ? 0.96 : 1 }],
                                elevation: pressed ? 2 : 8,
                                shadowOpacity: pressed ? 0.1 : 0.2,
                            }
                        ]}
                        onPress={() => setScreen('Home')}
                    >
                        <Text style={[styles.loginButtonText, { color: Palette.primary }]}>Create Account</Text>
                        <Ionicons name="arrow-forward" size={20} color={Palette.primary} />
                    </Pressable>

                    {/* Footer — same as Login */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => setScreen('Login')} activeOpacity={0.6}>
                            <Text style={[styles.signUpText, { color: Palette.white }]}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Palette.primary,
    },
    scrollContent: {
        paddingHorizontal: 28,
        paddingTop: Platform.OS === 'android' ? 50 : 20,
        paddingBottom: 40,
    },
    brandContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logoCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Palette.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    logoImage: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
    },
    brandName: {
        fontSize: 24,
        fontWeight: '900',
        color: Palette.white,
        letterSpacing: -0.5,
    },
    brandTagline: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.85)',
        fontWeight: '600',
        marginTop: 3,
    },
    formHeader: {
        marginBottom: 16,
    },
    loginTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: Palette.white,
    },
    loginSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.75)',
        lineHeight: 17,
        marginTop: 3,
    },
    groupLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: 1.2,
        marginBottom: 8,
        marginTop: 6,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Palette.white,
        borderRadius: 14,
        marginBottom: 10,
        paddingHorizontal: 14,
        height: 46,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: Palette.gray900,
        fontSize: 13,
        fontWeight: '600',
    },
    eyeIcon: {
        padding: 5,
    },
    dropdown: {
        backgroundColor: Palette.white,
        borderRadius: 14,
        marginTop: -6,
        marginBottom: 10,
        overflow: 'hidden',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 11,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    dropdownItemActive: {
        backgroundColor: Palette.primary + '10',
    },
    dropdownText: {
        fontSize: 13,
        color: Palette.gray700,
        fontWeight: '500',
    },
    dropdownTextActive: {
        color: Palette.primary,
        fontWeight: '700',
    },
    loginButton: {
        flexDirection: 'row',
        height: 46,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 6,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    loginButtonText: {
        fontSize: 14,
        fontWeight: '900',
        marginRight: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 18,
    },
    footerText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '600',
    },
    signUpText: {
        fontWeight: '800',
        fontSize: 12,
        textDecorationLine: 'underline',
    },
});

export default Register;
