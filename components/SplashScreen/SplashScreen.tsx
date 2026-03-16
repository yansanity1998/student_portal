import { Palette } from '@/components/color/color';
import React, { useEffect } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const logoImg = require('../../assets/images/ici_portal_logo.png');

interface SplashScreenProps {
    onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    const logoScale = useSharedValue(0.3);
    const logoOpacity = useSharedValue(0);
    const textOpacity = useSharedValue(0);
    const textSlide = useSharedValue(20);

    useEffect(() => {
        // Logo animation
        logoScale.value = withSpring(1, { damping: 10, stiffness: 100 });
        logoOpacity.value = withTiming(1, { duration: 1000 });

        // Text animation
        textOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
        textSlide.value = withDelay(500, withSpring(0, { damping: 12 }));

        // Finish splash screen
        const timer = setTimeout(() => {
            onFinish();
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const logoStyle = useAnimatedStyle(() => ({
        transform: [{ scale: logoScale.value }],
        opacity: logoOpacity.value,
    }));

    const textStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ translateY: textSlide.value }],
    }));

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Animated.View style={[styles.logoContainer, logoStyle]}>
                    <View style={styles.logoCircle}>
                        <Image source={logoImg} style={styles.logo} />
                    </View>
                </Animated.View>

                <Animated.View style={[styles.textContainer, textStyle]}>
                    <Text style={styles.brandName}>ICI Portal</Text>
                    <View style={styles.separator} />
                    <Text style={styles.tagline}>Excellence in Technology</Text>
                </Animated.View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.version}>Version 1.0.24</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Palette.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: 30,
    },
    logoCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: Palette.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    logo: {
        width: 110,
        height: 110,
        borderRadius: 55,
    },
    textContainer: {
        alignItems: 'center',
    },
    brandName: {
        fontSize: 36,
        fontWeight: '900',
        color: Palette.white,
        letterSpacing: 1,
    },
    separator: {
        width: 40,
        height: 3,
        backgroundColor: Palette.white,
        marginVertical: 12,
        borderRadius: 2,
        opacity: 0.6,
    },
    tagline: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    footer: {
        position: 'absolute',
        bottom: 50,
    },
    version: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        fontWeight: '600',
    },
});

export default SplashScreen;
