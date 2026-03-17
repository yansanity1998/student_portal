import { useNavigation } from '@/app/(tabs)/index';
import { BlurView } from 'expo-blur';
import { Home, ReceiptText, Scan, Settings } from 'lucide-react-native';
import React, { useRef } from 'react';
import {
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Palette } from '../color/color';

const { width } = Dimensions.get('window');

const NavButtons = () => {
    const { currentScreen, setScreen } = useNavigation();

    // Unified 4-item layout replacing the disconnected float
    const navItems = [
        { name: 'Home', icon: Home, target: 'Home' },
        { name: 'Billing', icon: ReceiptText, target: 'Billing' },
        { name: 'Scan', icon: Scan, target: 'Scan', isAction: true },
        { name: 'Settings', icon: Settings, target: 'Settings' },
    ];


    return (
        <View style={styles.container} pointerEvents="box-none">
            <BlurView
                intensity={Platform.OS === 'ios' ? 50 : 120}
                tint="extraLight"
                style={styles.glassContainer}
            >
                {navItems.map((item, index) => {
                    if (item.isAction) {
                        return (
                            <ActionItem
                                key={`nav-${index}`}
                                item={item}
                                currentScreen={currentScreen}
                                setScreen={setScreen}
                            />
                        );
                    }
                    return (
                        <NavItem
                            key={`nav-${index}`}
                            item={item}
                            currentScreen={currentScreen}
                            setScreen={setScreen}
                        />
                    );
                })}
            </BlurView>
        </View>
    );
};

const NavItem = ({ item, currentScreen, setScreen }: any) => {
    const isActive = currentScreen === item.target;
    const displayColor = isActive ? Palette.primaryDark : Palette.gray500;
    
    // Animation specific to this item
    const translateY = useSharedValue(isActive ? -10 : 0);
    const progress = useSharedValue(isActive ? 1 : 0);

    React.useEffect(() => {
        const config = { duration: 250, easing: Easing.out(Easing.cubic) };
        translateY.value = withTiming(isActive ? -10 : 0, config);
        progress.value = withTiming(isActive ? 1 : 0, config);
    }, [isActive]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const bgStyle = useAnimatedStyle(() => ({
        opacity: progress.value,
    }));

    return (
        <TouchableOpacity
            style={styles.navButton}
            activeOpacity={0.7}
            onPress={() => setScreen(item.target as any)}
        >
            <Animated.View style={[styles.contentWrapper, animatedStyle]}>
                <Animated.View style={[styles.activeBackground, bgStyle]} />
                <item.icon size={22} color={displayColor} strokeWidth={isActive ? 2.5 : 2} />
                <Text style={[styles.navText, { color: displayColor, fontWeight: isActive ? '700' : '500' }]}>
                    {item.name}
                </Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

const ActionItem = ({ item, currentScreen, setScreen }: any) => {
    const isActive = currentScreen === item.target;
    const displayColor = isActive ? Palette.primaryDark : Palette.gray500;
    
    // Animation specific to this item
    const translateY = useSharedValue(isActive ? -10 : 0);
    const progress = useSharedValue(isActive ? 1 : 0);

    React.useEffect(() => {
        const config = { duration: 250, easing: Easing.out(Easing.cubic) };
        translateY.value = withTiming(isActive ? -10 : 0, config);
        progress.value = withTiming(isActive ? 1 : 0, config);
    }, [isActive]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const bgStyle = useAnimatedStyle(() => ({
        opacity: progress.value,
    }));

    return (
        <TouchableOpacity
            style={styles.navButton}
            activeOpacity={0.85}
            onPress={() => setScreen(item.target as any)}
        >
            <Animated.View style={[styles.contentWrapper, animatedStyle]}>
                <Animated.View style={[styles.activeBackground, bgStyle]} />
                <item.icon size={22} color={displayColor} strokeWidth={isActive ? 2.5 : 2} />
                <Text style={[styles.navText, { color: displayColor, fontWeight: isActive ? '700' : '500' }]}>
                    {item.name}
                </Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 25,
        width: width,
        alignItems: 'center',
        zIndex: 999,
    },
    glassContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: width * 0.92,
        paddingVertical: 10,
        paddingHorizontal: 6,
        borderRadius: 40,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.7)',
        ...Platform.select({
            ios: {
                shadowColor: Palette.primaryDark,
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
            },
            android: {
                elevation: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
            },
        }),
    },

    navButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        paddingVertical: 8,
    },
    activeBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Palette.primary + '18',
        borderRadius: 16,
    },

    navText: {
        fontSize: 10,
        marginTop: 4,
        letterSpacing: 0.2,
    },
});

export default NavButtons;
