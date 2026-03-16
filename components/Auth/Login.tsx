import { useNavigation } from '@/app/(tabs)/index';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Palette } from '../color/color';

const logoImg = require('../../assets/images/ici_portal_logo.png');

const { width } = Dimensions.get('window');

const Login = () => {
    const { setScreen, currentScreen } = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

    React.useEffect(() => {
        const checkBiometrics = async () => {
            const enabled = await AsyncStorage.getItem('biometrics_enabled');
            if (enabled === 'true') {
                setIsBiometricEnabled(true);
            } else {
                setIsBiometricEnabled(false);
            }
        };
        checkBiometrics();
    }, [currentScreen]);

    const handleLogin = () => {
        setScreen('Home');
    };

    const handleBiometricLogin = async () => {
        setScreen('Biometric');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.mainContainer}
            >
                {/* Brand Section */}
                <View style={styles.brandContainer}>
                    <View style={styles.logoCircle}>
                        <Image source={logoImg} style={styles.logoImage} />
                    </View>
                    <Text style={styles.brandName}>ICI Portal</Text>
                    <Text style={styles.brandTagline}>Your Student Portal Access</Text>
                </View>

                {/* Form Heading */}
                <View style={styles.formHeader}>
                    <Text style={styles.loginTitle}>Welcome Back</Text>
                    <Text style={styles.loginSubtitle}>Sign in to your account with your student credentials</Text>
                </View>

                {/* Input Fields (Solid White, No Glass) */}
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
                        <Ionicons name="lock-closed-outline" size={20} color={Palette.primary} />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={Palette.gray400}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                    >
                        <Ionicons
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color={Palette.primary}
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                {/* Action Buttons (White Button, Teal Text with Active Feedback) */}
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
                    onPress={handleLogin}
                >
                    <Text style={[styles.loginButtonText, { color: Palette.primary }]}>Sign In</Text>
                    <Ionicons name="arrow-forward" size={20} color={Palette.primary} />
                </Pressable>

                {isBiometricEnabled && (
                    <TouchableOpacity
                        style={styles.biometricOption}
                        onPress={handleBiometricLogin}
                    >
                        <Ionicons name="finger-print-outline" size={20} color={Palette.white} />
                        <Text style={styles.biometricText}>Log in with Biometrics</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.footer}>
                    <Text style={styles.footerText}>New to ICI Portal? </Text>
                    <TouchableOpacity
                        onPress={() => setScreen('Register' as any)}
                        activeOpacity={0.6}
                    >
                        <Text style={[styles.signUpText, { color: Palette.white }]}>Create Account</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: Palette.primary,
    },
    mainContainer: {
        flex: 1,
        paddingHorizontal: 28,
        justifyContent: 'center',
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 16,
    },
    forgotPasswordText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 11,
        fontWeight: '700',
    },
    loginButton: {
        flexDirection: 'row',
        height: 46,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
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
    biometricOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        padding: 6,
    },
    biometricText: {
        color: Palette.white,
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 6,
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

export default Login;
