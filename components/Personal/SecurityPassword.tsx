import { useNavigation } from '@/app/(tabs)/index';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
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

/**
 * Modern Security & Password Screen
 * Features: Password updates, Two-factor Auth, Biometrics, Login activity
 */
const SecurityPassword = () => {
    const { setScreen } = useNavigation();
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [loginAlerts, setLoginAlerts] = useState(true);

    const SecurityOption = ({ icon, label, subLabel, onPress, type, value, onValueChange, color }: any) => (
        <TouchableOpacity
            style={styles.optionRow}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={type === 'switch'}
        >
            <View style={[styles.optionIconContainer, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <View style={styles.optionTextContainer}>
                <Text style={styles.optionLabel}>{label}</Text>
                {subLabel && <Text style={styles.optionSubLabel}>{subLabel}</Text>}
            </View>
            {type === 'switch' ? (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: Palette.gray200, true: Palette.primaryLight }}
                    thumbColor={value ? Palette.primary : Palette.gray100}
                />
            ) : (
                <Ionicons name="chevron-forward" size={20} color={Palette.gray400} />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setScreen('Settings')}
                >
                    <Ionicons name="arrow-back" size={26} color={Palette.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Security Settings</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Security Score Section */}
                <View style={styles.scoreCard}>
                    <View style={styles.scoreInfo}>
                        <Text style={styles.scoreTitle}>Security Score</Text>
                        <Text style={styles.scoreSubtitle}>Your account is 85% secure</Text>
                    </View>
                    <View style={styles.scoreCircle}>
                        <Text style={styles.scoreValue}>85%</Text>
                    </View>
                </View>

                {/* Login & Password Section */}
                <Text style={styles.sectionHeading}>LOGIN & PASSWORD</Text>
                <View style={styles.sectionBox}>
                    <SecurityOption
                        icon="key-outline"
                        label="Change Password"
                        subLabel="Update your student portal password"
                        color={Palette.primary}
                        onPress={() => Alert.alert('Change Password', 'Password update flow starting...')}
                    />
                    <View style={styles.divider} />
                    <SecurityOption
                        icon="finger-print-outline"
                        label="Biometric Settings"
                        subLabel="Manage FaceID/TouchID access"
                        color={Palette.sky}
                        onPress={() => setScreen('Biometric')}
                    />
                </View>

                {/* Advanced Security Section */}
                <Text style={styles.sectionHeading}>ADVANCED SECURITY</Text>
                <View style={styles.sectionBox}>
                    <SecurityOption
                        icon="shield-checkmark-outline"
                        label="Two-Factor Authentication"
                        subLabel="Add an extra layer of security"
                        type="switch"
                        value={twoFactorEnabled}
                        onValueChange={setTwoFactorEnabled}
                        color={Palette.success}
                    />
                    <View style={styles.divider} />
                    <SecurityOption
                        icon="notifications-outline"
                        label="Login Alerts"
                        subLabel="Get notified of new logins"
                        type="switch"
                        value={loginAlerts}
                        onValueChange={setLoginAlerts}
                        color={Palette.orange}
                    />
                </View>

                {/* Device Activity */}
                <Text style={styles.sectionHeading}>WHERE YOU'RE LOGGED IN</Text>
                <View style={styles.sectionBox}>
                    <View style={styles.deviceRow}>
                        <MaterialCommunityIcons name="cellphone" size={24} color={Palette.primary} />
                        <View style={styles.deviceInfo}>
                            <Text style={styles.deviceName}>iPhone 15 Pro (This Device)</Text>
                            <Text style={styles.deviceStatus}>Active Now • Knowledge City</Text>
                        </View>
                        <View style={styles.activePulse} />
                    </View>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.viewDevicesButton}>
                        <Text style={styles.viewDevicesText}>View All Logged-in Devices</Text>
                    </TouchableOpacity>
                </View>

                {/* Account Actions */}
                <TouchableOpacity style={styles.criticalAction}>
                    <Ionicons name="trash-outline" size={20} color={Palette.error} />
                    <Text style={styles.criticalActionText}>Delete Account Permanently</Text>
                </TouchableOpacity>

                <Text style={styles.footerNote}>
                    Last security check: March 10, 2026, 04:30 PM
                </Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Palette.gray50,
    },
    header: {
        height: 110,
        backgroundColor: Palette.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 45,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: Palette.white,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    scoreCard: {
        backgroundColor: Palette.primary,
        borderRadius: 24,
        padding: 20,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 10,
        shadowColor: Palette.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    scoreInfo: {
        flex: 1,
    },
    scoreTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: Palette.white,
    },
    scoreSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    scoreCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 6,
        borderColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    scoreValue: {
        fontSize: 14,
        fontWeight: '800',
        color: Palette.white,
    },
    sectionHeading: {
        fontSize: 12,
        fontWeight: '800',
        color: Palette.gray400,
        letterSpacing: 1.2,
        marginTop: 30,
        marginBottom: 12,
        marginLeft: 10,
    },
    sectionBox: {
        backgroundColor: Palette.white,
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 18,
    },
    optionIconContainer: {
        width: 42,
        height: 42,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: Palette.gray900,
    },
    optionSubLabel: {
        fontSize: 12,
        color: Palette.gray400,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: Palette.gray50,
        marginHorizontal: 16,
    },
    deviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    deviceInfo: {
        flex: 1,
        marginLeft: 15,
    },
    deviceName: {
        fontSize: 14,
        fontWeight: '700',
        color: Palette.gray900,
    },
    deviceStatus: {
        fontSize: 12,
        color: Palette.success,
        marginTop: 2,
        fontWeight: '600',
    },
    activePulse: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Palette.success,
    },
    viewDevicesButton: {
        paddingVertical: 15,
        alignItems: 'center',
        backgroundColor: Palette.gray50 + '80',
    },
    viewDevicesText: {
        fontSize: 13,
        color: Palette.primary,
        fontWeight: '700',
    },
    criticalAction: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        padding: 16,
        borderRadius: 20,
        backgroundColor: Palette.error + '10',
    },
    criticalActionText: {
        color: Palette.error,
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 10,
    },
    footerNote: {
        textAlign: 'center',
        fontSize: 11,
        color: Palette.gray400,
        marginTop: 30,
        marginBottom: 20,
    },
});

export default SecurityPassword;
