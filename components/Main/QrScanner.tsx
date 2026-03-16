import { useNavigation } from '@/app/(tabs)/index';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Palette } from '../color/color';
import NavButtons from './NavButtons';

const { width, height } = Dimensions.get('window');

/**
 * Premium Modern QR Scanner
 * Features: High-end UI Overlays, Camera Integration, Glassmorphism Controls, Unified Brand Styling
 */
const QrScanner = () => {
    const { setScreen } = useNavigation();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        requestPermission();
    }, []);

    if (!permission) {
        return <View style={styles.centered}><Text>Requesting for camera permission...</Text></View>;
    }

    if (!permission.granted) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>No access to camera</Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>Allow Camera</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleBarCodeScanned = ({ type, data }: any) => {
        setScanned(true);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        // Logic to reset after 2 seconds
        setTimeout(() => setScanned(false), 2000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <CameraView
                style={StyleSheet.absoluteFillObject}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
            >
                {/* Modern UI Overlay */}
                <View style={styles.overlay}>
                    <View style={styles.topSection}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => setScreen('Home')}
                        >
                            <BlurView intensity={30} tint="dark" style={styles.glassIcon}>
                                <Ionicons name="chevron-back" size={24} color={Palette.white} />
                            </BlurView>
                        </TouchableOpacity>
                        <Text style={styles.title}>Scan Student QR</Text>
                        <View style={{ width: 44 }} />
                    </View>

                    <View style={styles.midSection}>
                        <View style={styles.scanTarget}>
                            {/* Corner Accents */}
                            <View style={[styles.corner, styles.topLeft, { borderColor: Palette.primary }]} />
                            <View style={[styles.corner, styles.topRight, { borderColor: Palette.primary }]} />
                            <View style={[styles.corner, styles.bottomLeft, { borderColor: Palette.primary }]} />
                            <View style={[styles.corner, styles.bottomRight, { borderColor: Palette.primary }]} />

                            {!scanned && (
                                <View style={[styles.scanLine, { backgroundColor: Palette.primary }]} />
                            )}
                        </View>
                        <Text style={styles.hintText}>Place QR code inside the frame</Text>
                    </View>

                    <View style={styles.bottomSection}>
                        <BlurView intensity={40} tint="dark" style={styles.toolsContainer}>
                            <TouchableOpacity style={styles.toolItem}>
                                <Ionicons name="flashlight" size={24} color={Palette.white} />
                                <Text style={styles.toolLabel}>Flash</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.toolItem}>
                                <Ionicons name="images-outline" size={24} color={Palette.white} />
                                <Text style={styles.toolLabel}>Gallery</Text>
                            </TouchableOpacity>
                        </BlurView>
                    </View>
                </View>
            </CameraView>

            {/* Floating System Navigation */}
            <NavButtons />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'space-between',
        paddingBottom: 120, // Space for NavButtons
    },
    topSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 20,
    },
    backButton: {
        borderRadius: 22,
        overflow: 'hidden',
    },
    glassIcon: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: Palette.white,
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    midSection: {
        alignItems: 'center',
    },
    scanTarget: {
        width: width * 0.7,
        height: width * 0.7,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderWidth: 4,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0,
        borderTopLeftRadius: 20,
    },
    topRight: {
        top: 0,
        right: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderTopRightRadius: 20,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomLeftRadius: 20,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderBottomRightRadius: 20,
    },
    scanLine: {
        width: '90%',
        height: 2,
        position: 'absolute',
        borderRadius: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
    },
    hintText: {
        color: 'rgba(255,255,255,0.7)',
        marginTop: 30,
        fontSize: 14,
        fontWeight: '500',
    },
    bottomSection: {
        alignItems: 'center',
        paddingBottom: 50,
    },
    toolsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 30,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    toolItem: {
        alignItems: 'center',
        marginHorizontal: 20,
    },
    toolLabel: {
        color: Palette.white,
        fontSize: 10,
        marginTop: 4,
        fontWeight: '600',
    },
    errorText: {
        color: Palette.white,
        fontSize: 16,
        marginBottom: 20,
    },
    permissionButton: {
        backgroundColor: Palette.primary,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 12,
    },
    permissionButtonText: {
        color: Palette.white,
        fontWeight: 'bold',
    },
});

export default QrScanner;
