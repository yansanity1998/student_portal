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
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Palette } from '../color/color';

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
    // Store the measured absolute positions and sizes of each item relative to the BlurView
    const itemLayouts = useRef<{x: number, y: number, w: number, h: number}[]>([]);
    const translateX = useSharedValue(-100);
    const translateY = useSharedValue(0);
    const widthVal = useSharedValue(0);
    const heightVal = useSharedValue(0);
    const opacity = useSharedValue(0);

    const CIRCLE_SIZE = 52;

    const handleLayout = (index: number, x: number, y: number, w: number, h: number) => {
        const centerX = x + w / 2;
        const centerY = y + h / 2;
        
        itemLayouts.current[index] = { 
            x: centerX - CIRCLE_SIZE / 2, 
            y: centerY - CIRCLE_SIZE / 2 - 14,
            w: CIRCLE_SIZE, 
            h: CIRCLE_SIZE 
        };
        // If this is the active one, snap the indicator to it immediately
        if (index === activeIndex) {
            translateX.value = itemLayouts.current[index].x;
            translateY.value = itemLayouts.current[index].y;
            widthVal.value = itemLayouts.current[index].w;
            heightVal.value = itemLayouts.current[index].h;
            opacity.value = withTiming(1, { duration: 100 });
        }
    };

    React.useEffect(() => {
        const layout = itemLayouts.current[activeIndex];
        if (activeIndex >= 0 && layout) {
            translateX.value = withSpring(layout.x, {
                damping: 20,
                stiffness: 260,
                mass: 0.6,
            });
            translateY.value = withSpring(layout.y, {
                damping: 20,
                stiffness: 260,
                mass: 0.6,
            });
            widthVal.value = withSpring(layout.w, {
                damping: 20,
                stiffness: 260,
            });
            heightVal.value = withSpring(layout.h, {
                damping: 20,
                stiffness: 260,
            });
            opacity.value = withTiming(1, { duration: 150 });
        } else if (activeIndex < 0) {
            opacity.value = withTiming(0, { duration: 150 });
        }
    }, [activeIndex]);

    const indicatorStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value }
        ],
        width: widthVal.value,
        height: heightVal.value,
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
                        onLayout={(x, y, w, h) => handleLayout(index, x, y, w, h)}
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
    onLayout: (x: number, y: number, w: number, h: number) => void,
}) => {
    const isActive = currentScreen === item.target;
    const displayColor = isActive ? Palette.primary : Palette.gray400;
    const buttonPos = useRef({ x: 0, y: 0 });

    return (
        <TouchableOpacity
            style={styles.navButton}
            activeOpacity={0.7}
            onPress={() => setScreen(item.target as any)}
            onLayout={(e) => {
                buttonPos.current = { x: e.nativeEvent.layout.x, y: e.nativeEvent.layout.y };
            }}
        >
            <View 
                style={styles.contentWrapper}
                onLayout={(e) => {
                    // Report position and size relative to BlurView
                    onLayout(
                        buttonPos.current.x + e.nativeEvent.layout.x,
                        buttonPos.current.y + e.nativeEvent.layout.y,
                        e.nativeEvent.layout.width,
                        e.nativeEvent.layout.height
                    );
                }}
            >
                <View style={styles.iconWrapper}>
                    <item.icon size={20} color={displayColor} strokeWidth={isActive ? 2.5 : 2} />
                </View>
                <Text style={[styles.navText, { color: displayColor, fontWeight: isActive ? '700' : '500' }]}>
                    {item.name}
                </Text>
            </View>
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
        paddingTop: 22,
        paddingBottom: 8,
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
        borderRadius: 26, // Exactly half of 52 for a perfect circle
        backgroundColor: Palette.primary + '15', 
        // Top, Left, Width, Height controlled by reanimated
    },
    navButton: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-start',
    },
    contentWrapper: {
        alignItems: 'center',
        paddingHorizontal: 16, // More horizontal space for a better capsule look
        paddingVertical: 10,  // More vertical space to comfortably fit icon + text
        borderRadius: 25,
    },
    iconWrapper: {
        width: 32,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 0,
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
