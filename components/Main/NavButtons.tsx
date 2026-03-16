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
import { Palette } from '../color/color';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width * 0.9) / 3;

const NavButtons = () => {
    const { currentScreen, setScreen } = useNavigation();

    const navItems = [
        { name: 'Home', icon: Home, target: 'Home' },
        { name: 'Billing', icon: ReceiptText, target: 'Billing' },
        { name: 'Settings', icon: Settings, target: 'Settings' },
    ];

    const activeIndex = navItems.findIndex(i => i.target === currentScreen);
    // Store the measured x-center of each nav item's iconWrapper
    const itemCenters = useRef<number[]>([]);
    const translateX = useSharedValue(-100); // off-screen initially
    const opacity = useSharedValue(0);

    const handleLayout = (index: number, x: number, itemWidth: number) => {
        // calculate center of icon (40px wide) within the nav item
        itemCenters.current[index] = x + (itemWidth - 40) / 2;
        // If this is the active one, snap the indicator to it immediately
        if (index === activeIndex) {
            translateX.value = itemCenters.current[index];
            opacity.value = withTiming(1, { duration: 150 });
        }
    };

    React.useEffect(() => {
        const center = itemCenters.current[activeIndex];
        if (activeIndex >= 0 && center !== undefined) {
            translateX.value = withSpring(center, {
                damping: 20,
                stiffness: 260,
                mass: 0.6,
            });
            opacity.value = withTiming(1, { duration: 150 });
        } else if (activeIndex < 0) {
            opacity.value = withTiming(0, { duration: 150 });
        }
    }, [activeIndex]);

    const indicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        opacity: opacity.value,
    }));

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
                <Animated.View style={[styles.slidingIndicator, indicatorStyle]} />
                {navItems.map((item, index) => (
                    <NavItem 
                        key={index} 
                        item={item} 
                        currentScreen={currentScreen} 
                        setScreen={setScreen}
                        onLayout={(x, w) => handleLayout(index, x, w)}
                    />
                ))}
            </BlurView>
        </View>
    );
};

const NavItem = ({ item, currentScreen, setScreen, onLayout }: { 
    item: any, 
    currentScreen: string, 
    setScreen: (s: any) => void,
    onLayout: (x: number, w: number) => void,
}) => {
    const isActive = currentScreen === item.target;
    const displayColor = isActive ? Palette.primary : Palette.gray400;

    return (
        <TouchableOpacity
            style={styles.navButton}
            activeOpacity={0.7}
            onPress={() => setScreen(item.target as any)}
            onLayout={(e) => {
                onLayout(e.nativeEvent.layout.x, e.nativeEvent.layout.width);
            }}
        >
            <View style={styles.iconWrapper}>
                <item.icon size={20} color={displayColor} strokeWidth={isActive ? 2.5 : 2} />
            </View>
            <Text style={[styles.navText, { color: displayColor, fontWeight: isActive ? '700' : '500' }]}>
                {item.name}
            </Text>
        </TouchableOpacity>
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
    slidingIndicator: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Palette.primary + '25',
        top: 14, // Matches paddingVertical of glassContainer
        left: 0,
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
