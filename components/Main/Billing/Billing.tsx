import { useNavigation } from '@/app/(tabs)/index';
import { BlurView } from 'expo-blur';
import { 
    ChevronLeft, 
    CreditCard, 
    Download, 
    History, 
    Info, 
    Receipt, 
    TrendingDown, 
    TrendingUp,
    Wallet 
} from 'lucide-react-native';
import React from 'react';
import {
    Dimensions,
    FlatList,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Palette } from '../../color/color';

const { width } = Dimensions.get('window');

const Billing = () => {
    const { goBack } = useNavigation();
    
    // Theme setup (matching achievements style)
    const isDarkMode = false;
    const theme = isDarkMode ? darkTheme : lightTheme;

    const transactions = [
        { id: '1', title: 'Tuition Fee - Prelims', date: 'Mar 15, 2024', amount: '-₱15,500.00', status: 'Paid', type: 'expense' },
        { id: '2', title: 'Scholarship Grant', date: 'Mar 10, 2024', amount: '+₱5,000.00', status: 'Received', type: 'income' },
        { id: '3', title: 'Library Fine', date: 'Mar 05, 2024', amount: '-₱50.00', status: 'Paid', type: 'expense' },
        { id: '4', title: 'Laboratory Fee', date: 'Feb 28, 2024', amount: '-₱2,400.00', status: 'Paid', type: 'expense' },
        { id: '5', title: 'Bookstore Purchase', date: 'Feb 20, 2024', amount: '-₱1,200.00', status: 'Paid', type: 'expense' },
    ];

    const renderTransaction = ({ item, index }: any) => (
        <Animated.View 
            entering={FadeInDown.delay(index * 100).duration(500)}
            style={[styles.transactionCard, { backgroundColor: theme.cardBg }]}
        >
            <View style={[styles.iconBox, { backgroundColor: item.type === 'income' ? Palette.success + '15' : Palette.error + '15' }]}>
                {item.type === 'income' ? 
                    <TrendingUp size={20} color={Palette.success} /> : 
                    <TrendingDown size={20} color={Palette.error} />
                }
            </View>
            <View style={styles.transactionInfo}>
                <Text style={[styles.transactionTitle, { color: theme.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.transactionDate, { color: theme.textSecondary }]}>{item.date}</Text>
            </View>
            <View style={styles.transactionAmountBox}>
                <Text style={[styles.amountText, { color: item.type === 'income' ? Palette.success : theme.textPrimary }]}>
                    {item.amount}
                </Text>
                <Text style={[styles.statusText, { color: item.type === 'income' ? Palette.success : Palette.gray400 }]}>
                    {item.status}
                </Text>
            </View>
        </Animated.View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
            
            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack} style={styles.backButton}>
                    <ChevronLeft size={24} color={Palette.gray900} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Billing & Student Ledger</Text>
                <TouchableOpacity style={styles.headerIcon}>
                    <Info size={20} color={Palette.gray600} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                renderItem={renderTransaction}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                ListHeaderComponent={() => (
                    <Animated.View entering={FadeInUp.duration(600)}>
                        <View style={styles.balanceCard}>
                            <BlurView intensity={20} tint="light" style={styles.cardBlur}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.walletIcon}>
                                        <Wallet size={20} color={Palette.white} />
                                    </View>
                                    <Text style={styles.cardLabel}>Outstanding Balance</Text>
                                </View>
                                <Text style={styles.balanceAmount}>₱12,450.00</Text>
                                <View style={styles.cardFooter}>
                                    <View>
                                        <Text style={styles.dueDateLabel}>Due Date</Text>
                                        <Text style={styles.dueDateValue}>April 15, 2024</Text>
                                    </View>
                                </View>
                            </BlurView>
                        </View>

                        {/* Quick Actions */}
                        <View style={styles.quickActions}>
                            <ActionItem icon={Receipt} label="Invoices" color={Palette.primary} />
                            <ActionItem icon={CreditCard} label="Methods" color={Palette.violet} />
                            <ActionItem icon={History} label="History" color={Palette.orange} />
                            <ActionItem icon={Download} label="Statement" color={Palette.success} />
                        </View>

                        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Recent Activity</Text>
                    </Animated.View>
                )}
            />
        </View>
    );
};

const ActionItem = ({ icon: Icon, label, color }: any) => (
    <TouchableOpacity style={styles.actionItem}>
        <View style={[styles.actionIcon, { backgroundColor: color + '15' }]}>
            <Icon size={22} color={color} />
        </View>
        <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
);

const lightTheme = {
    background: '#F8FAFC',
    cardBg: Palette.white,
    textPrimary: Palette.gray900,
    textSecondary: Palette.gray500,
    border: Palette.gray100,
};

const darkTheme = {
    background: Palette.black,
    cardBg: '#121212',
    textPrimary: Palette.white,
    textSecondary: Palette.gray400,
    border: Palette.gray800,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight! + 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: Palette.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Palette.gray900,
    },
    headerIcon: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 120, // Space for floating nav
    },
    balanceCard: {
        height: 180,
        borderRadius: 30,
        backgroundColor: Palette.primary,
        overflow: 'hidden',
        marginBottom: 25,
        elevation: 8,
        shadowColor: Palette.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    cardBlur: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    walletIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '600',
    },
    balanceAmount: {
        color: Palette.white,
        fontSize: 34,
        fontWeight: '800',
        letterSpacing: -1,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    dueDateLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    dueDateValue: {
        color: Palette.white,
        fontSize: 14,
        fontWeight: '700',
        marginTop: 2,
    },
    payButton: {
        backgroundColor: Palette.white,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 15,
    },
    payButtonText: {
        color: Palette.primary,
        fontSize: 14,
        fontWeight: '700',
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    actionItem: {
        alignItems: 'center',
    },
    actionIcon: {
        width: 55,
        height: 55,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: Palette.gray600,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 15,
    },
    transactionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 22,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    transactionInfo: {
        flex: 1,
    },
    transactionTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 4,
    },
    transactionDate: {
        fontSize: 12,
        fontWeight: '500',
    },
    transactionAmountBox: {
        alignItems: 'flex-end',
    },
    amountText: {
        fontSize: 15,
        fontWeight: '800',
        marginBottom: 2,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
});

export default Billing;
