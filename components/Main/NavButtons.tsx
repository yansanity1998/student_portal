import { useNavigation } from '@/app/(tabs)/index';
import { BlurView } from 'expo-blur';
import { Home, Scan, Settings } from 'lucide-react-native';
import React from 'react';
import {
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Palette } from '../color/color';

const { width } = Dimensions.get('window');

/**
 * Premium Floating Glassmorphism Navigation Buttons
 */
const NavButtons = () => {
    const { currentScreen, setScreen } = useNavigation();
    const navItems = [
        { name: 'Home', icon: Home, color: Palette.primary, target: 'Home' },
        { name: 'Scan', icon: Scan, color: Palette.primary, target: 'Scan' },
        { name: 'Settings', icon: Settings, color: Palette.primary, target: 'Settings' },
    ];

    return (
        <View style={styles.container} pointerEvents="box-none">
            <BlurView
                intensity={Platform.OS === 'ios' ? 40 : 120}
                tint="extraLight"
                style={styles.glassContainer}
            >
                {navItems.map((item, index) => {
                    const isActive = currentScreen === item.target;
                    const activeColor = item.color;
                    const inactiveColor = Palette.gray400;
                    const displayColor = isActive ? activeColor : inactiveColor;

                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.navButton}
                            activeOpacity={0.7}
                            onPress={() => setScreen(item.target as any)}
                        >
                            <View style={[styles.iconWrapper, { backgroundColor: isActive ? activeColor + '20' : 'transparent' }]}>
                                <item.icon size={22} color={displayColor} strokeWidth={isActive ? 2.5 : 2} />
                            </View>
                            <Text style={[styles.navText, { color: displayColor, fontWeight: isActive ? '700' : '500' }]}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30,
        width: width,
        alignItems: 'center',
        zIndex: 999,
    },
    glassContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: width * 0.88, // Slightly wider for better spacing
        paddingVertical: 14,
        borderRadius: 35,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.7)', // Sharper edge
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
            },
            android: {
                elevation: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.35)', // Much more transparent on Android
            },
        }),
    },
    navButton: {
        alignItems: 'center',
        flex: 1,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    navText: {
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});

export default NavButtons;
