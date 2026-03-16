import { useNavigation } from '@/app/(tabs)/index';
import { BlurView } from 'expo-blur';
import { Home, ReceiptText, Scan, Settings } from 'lucide-react-native';
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
 * Scan button is elevated GCash-style in the center
 */
const NavButtons = () => {
    const { currentScreen, setScreen } = useNavigation();

    const navItems = [
        { name: 'Home', icon: Home, target: 'Home' },
        { name: 'Billing', icon: ReceiptText, target: 'Billing' },
        { name: 'Settings', icon: Settings, target: 'Settings' },
    ];

    const NavItem = ({ item }: { item: any }) => {
        const isActive = currentScreen === item.target;
        const isBilling = item.name === 'Billing';
        const displayColor = isActive ? Palette.primary : Palette.gray400;

        return (
            <TouchableOpacity
                style={styles.navButton}
                activeOpacity={0.7}
                onPress={() => setScreen(item.target as any)}
            >
                <View style={[
                    styles.iconWrapper,
                    { backgroundColor: isActive ? Palette.primary + '20' : 'transparent' }
                ]}>
                    <item.icon size={20} color={displayColor} strokeWidth={isActive ? 2.5 : 2} />
                </View>
                <Text style={[styles.navText, { color: displayColor, fontWeight: isActive ? '700' : '500' }]}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        );
    };

    const isScanActive = currentScreen === 'Scan';

    return (
        <View style={styles.container} pointerEvents="box-none">
            <TouchableOpacity
                style={[styles.scanButton, isScanActive && styles.scanButtonActive]}
                activeOpacity={0.85}
                onPress={() => setScreen('Scan')}
            >
                <Scan size={26} color={Palette.white} strokeWidth={2.5} />
            </TouchableOpacity>

            <BlurView
                intensity={Platform.OS === 'ios' ? 40 : 120}
                tint="extraLight"
                style={styles.glassContainer}
            >
                {navItems.map((item, index) => (
                    <NavItem key={index} item={item} />
                ))}
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
        justifyContent: 'space-between',
        width: width * 0.9,
        paddingVertical: 14,
        borderRadius: 35,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.7)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.12,
                shadowRadius: 25,
            },
            android: {
                elevation: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.45)', 
            },
        }),
    },
    navButton: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
    },
    navText: {
        fontSize: 9,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    scanButton: {
        position: 'absolute',
        top: -42,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Palette.primary,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        borderWidth: 4,
        borderColor: Palette.primary,
    },
    scanButtonActive: {
        backgroundColor: Palette.primaryDark ?? Palette.primary,
        transform: [{ scale: 1.1 }],
    },
});

export default NavButtons;
