import { useNavigation } from '@/app/(tabs)/index';
import { 
    Bell,
    ChevronRight,
    CircleHelp,
    Fingerprint,
    Info,
    Languages,
    LogOut,
    Moon,
    Newspaper,
    ShieldCheck,
    Sun,
    User
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Palette } from '../color/color';
import NavButtons from './NavButtons';

const Settings = () => {
    const { setScreen, showBreakingNews, setShowBreakingNews } = useNavigation();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [biometrics, setBiometrics] = useState(false);

    React.useEffect(() => {
        const loadSettings = async () => {
            const savedBiometrics = await AsyncStorage.getItem('biometrics_enabled');
            if (savedBiometrics !== null) {
                setBiometrics(JSON.parse(savedBiometrics));
            }
        };
        loadSettings();
    }, []);

    const handleBiometricsToggle = async (value: boolean) => {
        setBiometrics(value);
        await AsyncStorage.setItem('biometrics_enabled', JSON.stringify(value));
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    const SettingRow = ({ icon: Icon, label, type, value, onValueChange, iconColor, onPress }: any) => (
        <TouchableOpacity
            style={[styles.row, { backgroundColor: theme.cardBg, borderBottomColor: theme.border }]}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
                <Icon size={20} color={iconColor} strokeWidth={2.5} />
            </View>
            <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>{label}</Text>

            {type === 'switch' ? (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: Palette.gray200, true: Palette.primaryLight }}
                    thumbColor={value ? Palette.primary : Palette.gray100}
                />
            ) : (
                <View style={styles.rowRight}>
                    {value && <Text style={styles.rowValue}>{value}</Text>}
                    <ChevronRight size={20} color={Palette.gray400} strokeWidth={2.5} />
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ScrollView 
                showsVerticalScrollIndicator={false} 
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
            >

                {/* Compact Edge-to-Edge Trendy Banner Section (Matching Home.tsx) */}
                <View style={styles.bannerContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?q=80&w=2069&auto=format&fit=crop' }}
                        style={styles.bannerImage}
                    />

                    {/* Unified Horizontal Content Overlay */}
                    <View style={[styles.bannerContent, { backgroundColor: Palette.primary + 'B3' }]}>
                        <View style={styles.profileSection}>
                            <Image
                                source={{ uri: 'https://i.pravatar.cc/150?u=student123' }}
                                style={styles.profilePic}
                            />
                            <View style={styles.welcomeTextContainer}>
                                <Text style={[styles.studentName, { color: Palette.white }]}>Jesper Ian Barila</Text>
                                <Text style={[styles.greeting, { color: 'rgba(255,255,255,0.9)' }]}>Account Settings</Text>
                            </View>
                        </View>

                        <View style={styles.headerRightActions}>
                            <TouchableOpacity
                                style={[styles.iconButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
                                onPress={() => setIsDarkMode(!isDarkMode)}
                            >
                                {isDarkMode ? <Sun size={20} color={Palette.white} /> : <Moon size={20} color={Palette.white} />}
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.iconButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                                <Bell size={20} color={Palette.white} />
                                <View style={styles.notificationDot} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Main Content with Padding */}
                <View style={styles.mainPadding}>
                    {/* Account Section */}
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ACCOUNT SYSTEM</Text>
                    <View style={[styles.section, { backgroundColor: theme.cardBg }]}>
                        <SettingRow
                            icon={User}
                            label="Personal Information"
                            iconColor={Palette.primary}
                            onPress={() => setScreen('PersonalInformation')}
                        />
                        <SettingRow
                            icon={ShieldCheck}
                            label="Security & Password"
                            iconColor={Palette.success}
                            onPress={() => setScreen('SecurityPassword')}
                        />
                        <SettingRow
                            icon={Fingerprint}
                            label="Biometric Login"
                            type="switch"
                            value={biometrics}
                            onValueChange={handleBiometricsToggle}
                            iconColor={Palette.sky}
                        />
                    </View>

                    {/* Preferences Section */}
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>PREFERENCES</Text>
                    <View style={[styles.section, { backgroundColor: theme.cardBg }]}>
                        <SettingRow
                            icon={Moon}
                            label="Dark Mode"
                            type="switch"
                            value={isDarkMode}
                            onValueChange={setIsDarkMode}
                            iconColor={Palette.violet}
                        />
                        <SettingRow
                            icon={Bell}
                            label="Push Notifications"
                            type="switch"
                            value={notifications}
                            onValueChange={setNotifications}
                            iconColor={Palette.orange}
                        />
                        <SettingRow
                            icon={Newspaper}
                            label="Breaking News"
                            type="switch"
                            value={showBreakingNews}
                            onValueChange={setShowBreakingNews}
                            iconColor={Palette.primary}
                        />
                        <SettingRow icon={Languages} label="Language" iconColor={Palette.brandBlue} />
                    </View>

                    {/* Support Section */}
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>SUPPORT</Text>
                    <View style={[styles.section, { backgroundColor: theme.cardBg }]}>
                        <SettingRow icon={CircleHelp} label="Help Center" iconColor={Palette.gray500} />
                        <SettingRow icon={Info} label="About ICI Portal" iconColor={Palette.gray500} />
                    </View>

                    {/* Sign Out */}
                    <TouchableOpacity
                        style={styles.signOutButton}
                        onPress={() => setScreen('Login')}
                    >
                        <LogOut size={22} color={Palette.error} strokeWidth={2.5} />
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>

                    <Text style={[styles.footerText, { color: Palette.gray400 }]}>Version 1.0.24 (Beta)</Text>
                </View>

            </ScrollView>

            <NavButtons />

        </View>
    );
};

// Theme Definitions
const lightTheme = {
    background: '#F0F9F9', // Subtle teal-tinted background
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 120,
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
        marginBottom: 10,
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
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
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
    sectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        marginTop: 25,
        marginBottom: 10,
        marginLeft: 10,
    },
    section: {
        borderRadius: 24,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    iconContainer: {
        width: 38,
        height: 38,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    rowLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowValue: {
        fontSize: 13,
        color: Palette.gray400,
        marginRight: 4,
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,
        padding: 16,
        borderRadius: 20,
        backgroundColor: Palette.error + '10',
    },
    signOutText: {
        marginLeft: 8,
        fontSize: 15,
        fontWeight: '700',
        color: Palette.error,
    },
    footerText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 11,
        fontWeight: '500',
    },
});

export default Settings;
