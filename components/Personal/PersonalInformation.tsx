import { useNavigation } from '@/app/(tabs)/index';
import { Ionicons } from '@expo/vector-icons';
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
import { Palette } from '../color/color';

const { width } = Dimensions.get('window');

/**
 * Modern Personal Information Screen
 * Displays student profile details in a clean, professional layout
 */
const PersonalInformation = () => {
    const { setScreen } = useNavigation();

    const InfoRow = ({ label, value, icon, color }: any) => (
        <View style={styles.infoRow}>
            <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={20} color={color} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
        </View>
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
                <Text style={styles.headerTitle}>Personal Profile</Text>
                <TouchableOpacity style={styles.editButton}>
                    <Ionicons name="create-outline" size={24} color={Palette.white} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?u=student123' }}
                            style={styles.avatar}
                        />
                        <View style={styles.statusBadge} />
                    </View>
                    <Text style={styles.profileName}>Jesper Ian Barila</Text>
                    <Text style={styles.studentId}>ID: 2024-0012</Text>

                    <View style={styles.tagRow}>
                        <View style={[styles.tag, { backgroundColor: Palette.primary + '15' }]}>
                            <Text style={[styles.tagText, { color: Palette.primary }]}>Undergraduate</Text>
                        </View>
                        <View style={[styles.tag, { backgroundColor: Palette.success + '15' }]}>
                            <Text style={[styles.tagText, { color: Palette.success }]}>Regular</Text>
                        </View>
                    </View>
                </View>

                {/* Academic Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ACADEMIC RECORDS</Text>
                    <View style={styles.infoBox}>
                        <InfoRow
                            label="Course / Major"
                            value="BS in Computer Science"
                            icon="school-outline"
                            color={Palette.primary}
                        />
                        <InfoRow
                            label="Year Level"
                            value="3rd Year (Junior)"
                            icon="trending-up-outline"
                            color={Palette.sky}
                        />
                        <InfoRow
                            label="Current Semester"
                            value="2nd Semester, 2025-2026"
                            icon="calendar-outline"
                            color={Palette.violet}
                        />
                    </View>
                </View>

                {/* Contact Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>CONTACT INFORMATION</Text>
                    <View style={styles.infoBox}>
                        <InfoRow
                            label="Institutional Email"
                            value="j.barila@campus.edu.ph"
                            icon="mail-outline"
                            color={Palette.orange}
                        />
                        <InfoRow
                            label="Phone Number"
                            value="+63 912 345 6789"
                            icon="call-outline"
                            color={Palette.success}
                        />
                        <InfoRow
                            label="Home Address"
                            value="123 Academic St, Knowledge City"
                            icon="location-outline"
                            color={Palette.info}
                        />
                    </View>
                </View>

                {/* Verification Notice */}
                <View style={styles.footerNotice}>
                    <Ionicons name="shield-checkmark" size={16} color={Palette.gray400} />
                    <Text style={styles.footerNoticeText}>
                        Your identity has been verified by the Registrar's Office.
                    </Text>
                </View>
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
    editButton: {
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
    profileCard: {
        backgroundColor: Palette.white,
        borderRadius: 24,
        padding: 25,
        alignItems: 'center',
        marginTop: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: Palette.gray50,
    },
    statusBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: Palette.success,
        borderWidth: 3,
        borderColor: Palette.white,
    },
    profileName: {
        fontSize: 22,
        fontWeight: '900',
        color: Palette.gray900,
        letterSpacing: -0.5,
    },
    studentId: {
        fontSize: 14,
        color: Palette.gray500,
        fontWeight: '600',
        marginTop: 4,
    },
    tagRow: {
        flexDirection: 'row',
        marginTop: 15,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginHorizontal: 5,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '800',
    },
    section: {
        marginTop: 25,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: Palette.gray400,
        letterSpacing: 1.2,
        marginLeft: 10,
        marginBottom: 10,
    },
    infoBox: {
        backgroundColor: Palette.white,
        borderRadius: 24,
        paddingVertical: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: Palette.gray400,
        fontWeight: '600',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 15,
        color: Palette.gray900,
        fontWeight: '700',
    },
    footerNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        opacity: 0.6,
    },
    footerNoticeText: {
        fontSize: 11,
        color: Palette.gray500,
        marginLeft: 6,
        fontWeight: '500',
    },
});

export default PersonalInformation;
