import { useNavigation } from '@/app/(tabs)/index';
import { Home, ReceiptText, ScanLine, Settings } from 'lucide-react-native';
import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { Palette } from '../color/color';

// ─── NAV ITEM ─────────────────────────────────────────────────────────────────
const NavItem = ({ item, currentScreen, setScreen }: any) => {
    const isActive = currentScreen === item.target;

    const indicatorScale = useSharedValue(isActive ? 1 : 0);
    const iconScale = useSharedValue(isActive ? 1.1 : 1);

    React.useEffect(() => {
        const cfg = { duration: 220, easing: Easing.out(Easing.cubic) };
        indicatorScale.value = withTiming(isActive ? 1 : 0, cfg);
        iconScale.value = withTiming(isActive ? 1.1 : 1, cfg);
    }, [isActive]);

    const indicatorStyle = useAnimatedStyle(() => ({
        transform: [{ scaleX: indicatorScale.value }],
        opacity: indicatorScale.value,
    }));

    const iconAnimStyle = useAnimatedStyle(() => ({
        transform: [{ scale: iconScale.value }],
    }));

    // On teal bg: active = white, inactive = white at 55% opacity
    const iconColor = 'rgba(255,255,255,1)';
    const iconOpacity = isActive ? 1 : 0.55;

    return (
        <TouchableOpacity
            style={styles.tab}
            onPress={() => setScreen(item.target as any)}
            activeOpacity={0.7}
        >
            {/* Active top-line indicator (white) */}
            <Animated.View style={[styles.indicator, indicatorStyle]} />

            {/* Icon with subtle active background pill */}
            <Animated.View
                style={[
                    styles.iconWrapper,
                    isActive && styles.iconWrapperActive,
                    iconAnimStyle,
                    { opacity: iconOpacity },
                ]}
            >
                <item.icon
                    size={22}
                    color={iconColor}
                    strokeWidth={isActive ? 2.5 : 2}
                />
            </Animated.View>

            <Text
                style={[
                    styles.label,
                    {
                        color: 'rgba(255,255,255,1)',
                        opacity: iconOpacity,
                        fontWeight: isActive ? '700' : '400',
                    },
                ]}
            >
                {item.name}
            </Text>
        </TouchableOpacity>
    );
};

// ─── NAV BUTTONS ──────────────────────────────────────────────────────────────
const NavButtons = () => {
    const { currentScreen, setScreen } = useNavigation();

    const navItems = [
        { name: 'Home',     icon: Home,        target: 'Home' },
        { name: 'Billing',  icon: ReceiptText,  target: 'Billing' },
        { name: 'Scan',     icon: ScanLine,     target: 'Scan' },
        { name: 'Settings', icon: Settings,     target: 'Settings' },
    ];

    return (
        <View style={styles.container}>
            {navItems.map((item, index) => (
                <NavItem
                    key={`nav-${index}`}
                    item={item}
                    currentScreen={currentScreen}
                    setScreen={setScreen}
                />
            ))}
        </View>
    );
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: Palette.primary,   // Teal background
        paddingBottom: Platform.OS === 'ios' ? 24 : 10,
        paddingTop: 6,
        zIndex: 999,
        ...Platform.select({
            ios: {
                shadowColor: Palette.primaryDark,
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.25,
                shadowRadius: 12,
            },
            android: {
                elevation: 12,
            },
        }),
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingTop: 10,
        paddingBottom: 4,
    },
    indicator: {
        position: 'absolute',
        top: 0,
        width: 28,
        height: 3,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    iconWrapper: {
        width: 44,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
    iconWrapperActive: {
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    label: {
        fontSize: 10,
        marginTop: 3,
        letterSpacing: 0.2,
    },
});

export default NavButtons;
