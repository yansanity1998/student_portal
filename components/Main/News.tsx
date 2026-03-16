import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    Modal,
} from 'react-native';
import { Palette } from '../color/color';
import { useNavigation } from '@/app/(tabs)/index';
import { X } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CAROUSEL_WIDTH = width - 40;
const CAROUSEL_HEIGHT = 180;

const newsData = [
    {
        id: '1',
        title: 'ICI Campus Expansion',
        description: 'New high-tech laboratories coming soon to the north wing.',
        image: require('../../assets/images/ici1.jpg'),
        date: 'Oct 24, 2026',
        status: 'HOT',
        statusColor: Palette.error,
    },
    {
        id: '2',
        title: 'Academic Excellence',
        description: 'Celebrating our top performers in the recent semester.',
        image: require('../../assets/images/ici 2.jpg'),
        date: 'Oct 22, 2026',
        status: 'NEW',
        statusColor: Palette.success,
    },
    {
        id: '3',
        title: 'Sports Festival 2026',
        description: 'Join the annual sports meet this coming weekend!',
        image: require('../../assets/images/ici 3.jpg'),
        date: 'Oct 20, 2026',
        status: 'TRENDING',
        statusColor: Palette.sky,
    },
    {
        id: '4',
        title: 'Tech Innovation Summit',
        description: 'Showcasing the latest student projects and research.',
        image: require('../../assets/images/ici 4.jpg'),
        date: 'Oct 18, 2026',
        status: 'NEW',
        statusColor: Palette.orange,
    },
];

const News = ({ theme }: any) => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [selectedNews, setSelectedNews] = React.useState<any>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % newsData.length;
            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
            setCurrentIndex(nextIndex);
        }, 2500);

        return () => clearInterval(interval);
    }, [currentIndex]);

    // Marquee Animation for Breaking News
    const marqueeAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
        const startMarquee = () => {
            marqueeAnim.setValue(1);
            Animated.loop(
                Animated.timing(marqueeAnim, {
                    toValue: 0,
                    duration: 35000, // Slower speed for better readability
                    useNativeDriver: true,
                    easing: (t) => t, // Linear movement
                })
            ).start();
        };
        startMarquee();
    }, []);

    const marqueeTranslateX = marqueeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-(width * 5), width], // Wider range to ensure all 4 news items pass through
    });

    // Combine all 4 titles and repeat the set 3 times for a seamless infinite loop
    const combinedTitles = newsData.map(item => `      •   ${item.title.toUpperCase()}`).join(' ');
    const marqueeText = `${combinedTitles} ${combinedTitles} ${combinedTitles}`;

    const renderItem = ({ item, index }: any) => {
        const inputRange = [
            (index - 1) * CAROUSEL_WIDTH,
            index * CAROUSEL_WIDTH,
            (index + 1) * CAROUSEL_WIDTH,
        ];

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.95, 1, 0.95],
            extrapolate: 'clamp',
        });

        const handlePress = () => {
            setSelectedNews(item);
        };

        return (
            <Animated.View style={[styles.cardContainer, { transform: [{ scale }] }]}>
                <TouchableOpacity 
                    activeOpacity={0.9} 
                    onPress={handlePress}
                    style={styles.touchable}
                >
                    <Image source={item.image} style={styles.image} />
                    
                    {/* Modern Status Badge */}
                    <View style={styles.badgeWrapper}>
                        <View style={[styles.statusBadge, { backgroundColor: item.statusColor }]}>
                            <Text style={styles.statusText}>{item.status}</Text>
                        </View>
                    </View>

                    <BlurView 
                        intensity={Platform.OS === 'ios' ? 60 : 80} 
                        tint="dark" 
                        style={styles.blurOverlay}
                    >
                        <View style={styles.textContainer}>
                            <View style={styles.titleRow}>
                                <Text style={styles.newsTitle} numberOfLines={1}>{item.title}</Text>
                                <Text style={styles.dateText}>{item.date}</Text>
                            </View>
                            <Text style={styles.newsDesc} numberOfLines={2}>
                                {item.description}
                            </Text>
                        </View>
                    </BlurView>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Latest News</Text>
            </View>

            <Animated.FlatList
                ref={flatListRef}
                data={newsData}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                snapToInterval={CAROUSEL_WIDTH}
                snapToAlignment="center"
                decelerationRate="fast"
            />

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {newsData.map((_, i) => {
                    const opacity = scrollX.interpolate({
                        inputRange: [(i - 1) * CAROUSEL_WIDTH, i * CAROUSEL_WIDTH, (i + 1) * CAROUSEL_WIDTH],
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp',
                    });
                    const dotWidth = scrollX.interpolate({
                        inputRange: [(i - 1) * CAROUSEL_WIDTH, i * CAROUSEL_WIDTH, (i + 1) * CAROUSEL_WIDTH],
                        outputRange: [6, 16, 6],
                        extrapolate: 'clamp',
                    });
                    return (
                        <Animated.View 
                            key={i} 
                            style={[styles.dot, { opacity, width: dotWidth, backgroundColor: Palette.primary }]} 
                        />
                    );
                })}
            </View>

            {/* Horizontal Marquee Breaking News - Conditional Rendering */}
            {useNavigation().showBreakingNews && (
                <TouchableOpacity 
                    style={[styles.breakingSection, { backgroundColor: theme.cardBg }]}
                    activeOpacity={0.8}
                >
                    <View style={styles.breakingHeader}>
                        <View style={styles.breakingBadge}>
                            <Text style={styles.breakingTag}>BREAKING</Text>
                        </View>
                        <View style={styles.divider} />
                    </View>
                    
                    <View style={styles.marqueeContainer}>
                        <Animated.View style={[styles.marqueeInner, { 
                            transform: [{ translateX: marqueeTranslateX }],
                        }]}>
                            <Text style={[styles.breakingTitle, { color: theme.textPrimary }]}>
                                {marqueeText}
                            </Text>
                        </Animated.View>

                        {/* Entrance Fade Effect */}
                        <LinearGradient
                            colors={['transparent', theme.cardBg]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.entranceFade}
                        />
                    </View>
                </TouchableOpacity>
            )}

            {/* Full-Screen Image Modal */}
            <Modal
                visible={!!selectedNews}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedNews(null)}
            >
                <BlurView intensity={90} tint="dark" style={styles.modalContainer}>
                    <TouchableOpacity 
                        style={styles.modalCloseArea} 
                        activeOpacity={1} 
                        onPress={() => setSelectedNews(null)}
                    >
                        {selectedNews && (
                            <View style={styles.modalContent}>
                                <Image source={selectedNews.image} style={styles.modalImage} />
                                
                                <TouchableOpacity 
                                    style={styles.closeButton} 
                                    onPress={() => setSelectedNews(null)}
                                >
                                    <X size={20} color={Palette.white} />
                                </TouchableOpacity>

                                <View style={styles.modalTextContainer}>
                                    <Text style={styles.modalTitle}>{selectedNews.title}</Text>
                                    <Text style={styles.modalDescription}>{selectedNews.description}</Text>
                                    <Text style={styles.modalDate}>{selectedNews.date}</Text>
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                </BlurView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingHorizontal: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    cardContainer: {
        width: CAROUSEL_WIDTH,
        height: CAROUSEL_HEIGHT,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: Palette.gray200,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    touchable: {
        width: '100%',
        height: '100%',
    },
    blurOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 75,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    newsTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '800',
        flex: 1,
        marginRight: 10,
    },
    newsDesc: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 11,
        fontWeight: '500',
        marginTop: 2,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    dateText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        fontWeight: '700',
    },
    badgeWrapper: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 10,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    statusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 20,
    },
    dot: {
        height: 6,
        borderRadius: 3,
        marginHorizontal: 3,
    },
    breakingSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 16,
        marginHorizontal: -10, // Wider to close in on corners
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        overflow: 'hidden', // Clips the marquee
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8 },
            android: { elevation: 3 },
        }),
    },
    breakingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        backgroundColor: 'inherit', // Match parent
        zIndex: 2, // Stay above text
    },
    breakingBadge: {
        backgroundColor: Palette.error + '15',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    divider: {
        width: 1,
        height: 18,
        backgroundColor: Palette.gray200,
        marginHorizontal: 12,
    },
    breakingTag: {
        color: Palette.error,
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    marqueeContainer: {
        flex: 1,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    marqueeInner: {
        flexDirection: 'row',
        width: width * 10, 
    },
    breakingTitle: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 0.2,
    },
    entranceFade: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 60,
        zIndex: 3,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseArea: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    modalContent: {
        width: width * 0.9,
        backgroundColor: Palette.white,
        borderRadius: 24,
        overflow: 'hidden',
    },
    modalImage: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    modalTextContainer: {
        padding: 24,
        backgroundColor: Palette.white,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: Palette.gray900,
        marginBottom: 8,
    },
    modalDescription: {
        fontSize: 14,
        lineHeight: 22,
        color: Palette.gray600,
        marginBottom: 16,
    },
    modalDate: {
        fontSize: 12,
        color: Palette.gray400,
        fontWeight: '700',
    },
});

export default News;
