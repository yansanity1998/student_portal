import { useNavigation } from '@/app/(tabs)/index';
import { BlurView } from 'expo-blur';
import * as ExpoLocation from 'expo-location';
import { ChevronLeft, LocateFixed, Search } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Animated, {
    Easing,
    SlideInDown
} from 'react-native-reanimated';
import { Palette } from '../../color/color';

const { width, height } = Dimensions.get('window');

// Fake coordinates will be computed relative to live location
const Location = () => {
    const { setScreen } = useNavigation();
    const mapRef = useRef<MapView>(null);
    const [mapReady, setMapReady] = useState(false);

    const [originCoors, setOriginCoors] = useState<{ latitude: number, longitude: number } | null>(null);
    const [destinationCoors, setDestinationCoors] = useState<{ latitude: number, longitude: number } | null>(null);
    const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number, longitude: number }[]>([]);
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);

    const fetchRoute = async (origin: { latitude: number, longitude: number }, destination: { latitude: number, longitude: number }) => {
        try {
            // Free public OSRM API for walking/driving directions mapped to roads
            const url = `https://router.project-osrm.org/route/v1/foot/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`;
            const response = await fetch(url);
            const json = await response.json();

            if (json.routes && json.routes.length > 0) {
                const coordinates = json.routes[0].geometry.coordinates.map((coord: number[]) => ({
                    latitude: coord[1],
                    longitude: coord[0],
                }));
                setRouteCoordinates(coordinates);
            }
        } catch (error) {
            console.error("Failed to fetch route:", error);
        }
    };

    useEffect(() => {
        (async () => {
            let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                setIsLoadingLocation(false);
                return;
            }

            let location = await ExpoLocation.getCurrentPositionAsync({});
            const liveOrigin = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };
            const demoDestination = {
                latitude: location.coords.latitude + 0.0035,
                longitude: location.coords.longitude + 0.0025,
            };

            setOriginCoors(liveOrigin);
            setDestinationCoors(demoDestination);
            setIsLoadingLocation(false);

            // Fetch actual road route connecting the two
            fetchRoute(liveOrigin, demoDestination);
        })();
    }, []);

    const handleMapReady = () => {
        setMapReady(true);
        if (mapRef.current && originCoors && destinationCoors) {
            mapRef.current.fitToCoordinates([originCoors, destinationCoors], {
                edgePadding: { top: 120, right: 60, bottom: 250, left: 60 },
                animated: true,
            });
        }
    };

    const handleCurrentLocation = () => {
        if (mapRef.current && originCoors) {
            mapRef.current.animateCamera({
                center: originCoors,
                zoom: 16.5,
            }, { duration: 800 });
        }
    };

    if (isLoadingLocation) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Palette.primary} />
                <Text style={{ marginTop: 16, color: Palette.gray500, fontWeight: '600' }}>Acquiring Live GPS...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {(originCoors && destinationCoors) && (
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={{
                        latitude: (originCoors.latitude + destinationCoors.latitude) / 2,
                        longitude: (originCoors.longitude + destinationCoors.longitude) / 2,
                        latitudeDelta: 0.006,
                        longitudeDelta: 0.006,
                    }}
                    showsUserLocation={false}
                    showsCompass={false}
                    onMapReady={handleMapReady}
                    onPress={handleCurrentLocation}
                    mapPadding={{ top: 100, right: 20, bottom: 380, left: 20 }}
                >
                    {/* Simulated Route Line */}
                    {mapReady && routeCoordinates.length > 0 && (
                        <Polyline
                            coordinates={routeCoordinates}
                            strokeColor={Palette.primary}
                            strokeWidth={10}
                        />
                    )}

                    {/* Origin Marker (Your Current Location) */}
                    <Marker coordinate={originCoors} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
                        <View style={styles.originMarkerWithLabel}>
                            <View style={styles.currentLocationLabel}>
                                <Text style={styles.currentLocationText}>Your Location</Text>
                            </View>
                            <View style={styles.originStaticContainer}>
                                <View style={styles.originStaticOuter}>
                                    <View style={styles.originStaticInner} />
                                </View>
                            </View>
                        </View>
                    </Marker>

                    {/* Destination Marker (School Room) */}
                    <Marker coordinate={destinationCoors} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
                        <View style={styles.destinationMarkerContainer}>
                            <View style={styles.destPinLabel}>
                                <Text style={styles.destPinText} numberOfLines={1}>Heading to: <Text style={{ color: Palette.primaryLight, fontWeight: '900' }}>Hall A</Text></Text>
                            </View>
                            <View style={styles.destPinCircle}>
                                <View style={styles.destPinInnerCircle} />
                            </View>
                            <View style={styles.destPinStick} />
                        </View>
                    </Marker>
                </MapView>
            )}

            {/* Floating Top Header with Search */}
            <View style={styles.topHeader}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setScreen('Home')}
                    activeOpacity={0.8}
                >
                    <ChevronLeft size={26} color={Palette.gray900} />
                </TouchableOpacity>

                <View style={styles.searchContainer}>
                    <Search size={20} color={Palette.gray500} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search location..."
                        placeholderTextColor={Palette.gray400}
                    />
                </View>
            </View>

            {/* Current Location FAB */}
            <TouchableOpacity
                style={styles.locateFab}
                activeOpacity={0.8}
                onPress={handleCurrentLocation}
            >
                <LocateFixed size={24} color={Palette.primary} />
            </TouchableOpacity>

            {/* Compact Bottom Floating Card */}
            <Animated.View
                entering={SlideInDown.duration(350).delay(150).easing(Easing.out(Easing.cubic))}
                style={styles.bottomCardContainer}
            >
                <BlurView intensity={Platform.OS === 'ios' ? 70 : 100} tint="light" style={styles.bottomCardBlur}>
                    <View style={styles.cardContentWrapped}>
                        <View style={styles.rowBetween}>
                            <View>
                                <Text style={styles.statusText}>Arrive in <Text style={{ color: Palette.primary, fontWeight: '800' }}>15m</Text></Text>
                                <Text style={styles.distanceText}>1.2 km away</Text>
                            </View>

                            <TouchableOpacity style={styles.actionButton} activeOpacity={0.85}>
                                <Text style={styles.actionButtonText}>Start</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BlurView>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Palette.white,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    topHeader: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 40,
        left: 20,
        right: 20,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Palette.white,
        height: 48,
        borderRadius: 24,
        marginLeft: 12,
        paddingHorizontal: 16,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
            android: { elevation: 4 },
        }),
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: Palette.gray900,
        fontWeight: '500',
    },
    locateFab: {
        position: 'absolute',
        bottom: 110,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Palette.white,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
            android: { elevation: 5 },
        }),
    },
    backButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Palette.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 },
            android: { elevation: 6 },
        }),
    },
    originMarkerWithLabel: {
        alignItems: 'center',
    },
    currentLocationLabel: {
        backgroundColor: Palette.primaryDark,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 16,
        marginBottom: 4,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 4 },
            android: { elevation: 4 },
        })
    },
    currentLocationText: {
        color: Palette.white,
        fontSize: 12,
        fontWeight: '800',
        textAlign: 'center',
    },
    originStaticContainer: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    originStaticOuter: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Palette.primary + '35', // Translucent pulse look
        justifyContent: 'center',
        alignItems: 'center',
    },
    originStaticInner: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: Palette.primary,
        borderWidth: 2,
        borderColor: Palette.white,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3 },
            android: { elevation: 3 },
        })
    },
    destinationMarkerContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: 80,
    },
    destPinLabel: {
        backgroundColor: Palette.gray900,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 2,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 4 },
            android: { elevation: 4 },
        })
    },
    destPinText: {
        color: Palette.white,
        fontSize: 12,
        fontWeight: '800',
        textAlign: 'center',
    },
    destPinCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: Palette.gray900,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    destPinInnerCircle: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Palette.white,
    },
    destPinStick: {
        width: 3,
        height: 10,
        backgroundColor: Palette.gray900,
        marginTop: -3,
        zIndex: 1,
    },
    bottomCardContainer: {
        position: 'absolute',
        bottom: 25,
        left: 20,
        right: 20,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.8)',
        ...Platform.select({
            ios: { shadowColor: Palette.primaryDark, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 16 },
            android: { elevation: 10 },
        }),
    },
    bottomCardBlur: {
        backgroundColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.65)',
    },
    cardContentWrapped: {
        padding: 16,
        paddingHorizontal: 20,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 18,
        fontWeight: '900',
        color: Palette.gray900,
        letterSpacing: -0.3,
        marginBottom: 2,
    },
    distanceText: {
        color: Palette.gray500,
        fontSize: 13,
        fontWeight: '600',
    },
    actionButton: {
        backgroundColor: Palette.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtonText: {
        color: Palette.white,
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
});

export default Location;
