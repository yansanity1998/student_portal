import { useNavigation } from '@/app/(tabs)/index';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
} from 'react-native';
import { Palette } from '../color/color';

const logoImg = require('../../assets/images/ici_portal_logo.png');

const { width } = Dimensions.get('window');

/**
 * Modern School Portal Biometric Authentication Screen
 */
const Biometric = () => {
    const { setScreen } = useNavigation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Automatically trigger biometric authentication on mount
        handleBiometricAuth();
    }, []);

    const handleBiometricAuth = async () => {
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            if (!hasHardware) {
                Alert.alert('Error', 'Biometric hardware not found on this device.');
                setScreen('Login');
                return;
            }

            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!isEnrolled) {
                Alert.alert('Error', 'No biometrics enrolled. Please check your system settings.');
                setScreen('Login');
                return;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to access ICI Portal',
                fallbackLabel: 'Use student credentials',
                disableDeviceFallback: false,
            });

            if (result.success) {
                setIsAuthenticated(true);
                // Short delay for visual feedback before navigation
                setTimeout(() => {
                    setScreen('SplashScreen', 'Home');
                }, 800);
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred during authentication.');
            console.error(error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => setScreen('Login')}
            >
                <Ionicons name="arrow-back" size={28} color={Palette.white} />
            </TouchableOpacity>

            <View style={styles.content}>
                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.logoCircle}>
                        <Image source={logoImg} style={styles.logoImage} />
                    </View>
                    <Text style={styles.title}>
                        {isAuthenticated ? "Authenticated" : "Biometric Access"}
                    </Text>
                    <Text style={styles.subtitle}>
                        {isAuthenticated
                            ? "Signing you in..."
                            : "Place your finger or use FaceID to continue"
                        }
                    </Text>
                </View>

                {/* Main Instruction */}
                {!isAuthenticated && (
                    <TouchableOpacity
                        style={styles.authTrigger}
                        onPress={handleBiometricAuth}
                    >
                        <View style={styles.pulseContainer}>
                            <Ionicons name="finger-print-outline" size={80} color={Palette.white} />
                        </View>
                        <Text style={styles.tapText}>Tap to Retry</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.switchMethod}
                    onPress={() => setScreen('Login')}
                >
                    <Text style={styles.switchText}>Use Email & Password</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Palette.primary,
    },
    backButton: {
        padding: 20,
        position: 'absolute',
        top: Platform.OS === 'android' ? 40 : 20,
        left: 10,
        zIndex: 10,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    header: {
        alignItems: 'center',
        marginBottom: 80,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Palette.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
    },
    logoImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: Palette.white,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.85)',
        fontWeight: '600',
        marginTop: 10,
        textAlign: 'center',
    },
    authTrigger: {
        alignItems: 'center',
    },
    pulseContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    tapText: {
        color: Palette.white,
        marginTop: 20,
        fontWeight: '700',
        fontSize: 16,
    },
    switchMethod: {
        marginTop: 60,
        padding: 10,
    },
    switchText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 15,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
});

export default Biometric;
