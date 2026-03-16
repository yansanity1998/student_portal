import { useNavigation } from '@/app/(tabs)/index';
import { 
    ArrowLeft, 
    MoreHorizontal, 
    Plus,
    Search,
    Send,
    Circle,
    ChevronRight
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Palette } from '../color/color';

const { width } = Dimensions.get('window');

// --- Mock Data ---
const CONTACTS = [
    {
        id: '1',
        name: 'Dr. Sarah Wilson',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        lastMessage: 'Your math assignment was excellent!',
        time: '9:41 AM',
        unread: 2,
        online: true,
        role: 'Professor'
    },
    {
        id: '2',
        name: 'Michael Chen',
        avatar: 'https://i.pravatar.cc/150?u=michael',
        lastMessage: 'Are we still meeting for the study group?',
        time: 'Yesterday',
        unread: 0,
        online: false,
        role: 'Student'
    },
    {
        id: '3',
        name: 'Registrar Office',
        avatar: 'https://i.pravatar.cc/150?u=registrar',
        lastMessage: 'Enrollment for next semester is now open.',
        time: 'Monday',
        unread: 0,
        online: true,
        role: 'Admin'
    },
];

const MOCK_MESSAGES = [
    { id: '1', text: 'Hello Jesper! How is your research going?', sender: 'them', time: '10:00 AM' },
    { id: '2', text: 'Hi Professor! It is going great, just finished the first draft.', sender: 'me', time: '10:05 AM' },
    { id: '3', text: 'That is great to hear. Send it over when you can!', sender: 'them', time: '10:06 AM' },
    { id: '4', text: 'Will do! Thanks for the guidance.', sender: 'me', time: '10:10 AM' },
];

const Message = () => {
    const { setScreen } = useNavigation();
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [messageText, setMessageText] = useState('');

    const renderContactItem = ({ item }: any) => (
        <TouchableOpacity 
            style={styles.contactCard} 
            activeOpacity={0.7}
            onPress={() => setSelectedChat(item)}
        >
            <View style={styles.avatarContainer}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                {item.online && <View style={styles.onlineBadge} />}
            </View>
            <View style={styles.contactInfo}>
                <View style={styles.contactHeader}>
                    <Text style={styles.contactName}>{item.name}</Text>
                    <Text style={styles.contactTime}>{item.time}</Text>
                </View>
                <View style={styles.contactFooter}>
                    <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
                    {item.unread > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{item.unread}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderChatMessage = ({ item }: any) => (
        <View style={[
            styles.messageWrapper, 
            item.sender === 'me' ? styles.myMessageWrapper : styles.theirMessageWrapper
        ]}>
            <View style={[
                styles.messageBubble,
                item.sender === 'me' ? styles.myBubble : styles.theirBubble
            ]}>
                <Text style={[
                    styles.messageText,
                    item.sender === 'me' ? styles.myMessageText : styles.theirMessageText
                ]}>
                    {item.text}
                </Text>
            </View>
            <Text style={styles.messageTime}>{item.time}</Text>
        </View>
    );

    if (selectedChat) {
        return (
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
                    style={{ flex: 1 }}
                >
                    {/* Chat Header */}
                    <View style={styles.chatHeader}>
                        <TouchableOpacity onPress={() => setSelectedChat(null)} style={styles.iconButton}>
                            <ArrowLeft size={24} color={Palette.gray900} />
                        </TouchableOpacity>
                        <View style={styles.chatHeaderInfo}>
                            <Image source={{ uri: selectedChat.avatar }} style={styles.smallAvatar} />
                            <View>
                                <Text style={styles.headerName}>{selectedChat.name}</Text>
                                <Text style={styles.headerStatus}>{selectedChat.online ? 'Online' : 'Offline'}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.iconButton}>
                            <MoreHorizontal size={24} color={Palette.gray900} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={MOCK_MESSAGES}
                        renderItem={renderChatMessage}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.chatListContent}
                        showsVerticalScrollIndicator={false}
                    />

                    {/* Input Area */}
                    <View style={styles.inputContainer}>
                        <TouchableOpacity style={styles.attachButton}>
                            <Plus size={24} color={Palette.gray500} />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Type a message..."
                            value={messageText}
                            onChangeText={setMessageText}
                            multiline
                        />
                        <TouchableOpacity 
                            style={[styles.sendButton, { backgroundColor: messageText.trim() ? Palette.primary : Palette.gray200 }]}
                            disabled={!messageText.trim()}
                        >
                            <Send size={20} color={Palette.white} />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            {/* Main Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => setScreen('Home')}
                >
                    <ArrowLeft size={24} color={Palette.gray900} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Messages</Text>
                <TouchableOpacity style={styles.headerAction}>
                    <Plus size={24} color={Palette.primary} />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Search size={20} color={Palette.gray400} />
                    <TextInput 
                        placeholder="Search conversations..." 
                        style={styles.searchInput}
                        placeholderTextColor={Palette.gray400}
                    />
                </View>
            </View>

            <FlatList
                data={CONTACTS}
                renderItem={renderContactItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                    <Text style={styles.listSectionTitle}>Recent Conversations</Text>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F9F9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 40 : 10,
        paddingBottom: 20,
    },
    backButton: {
        width: 45,
        height: 45,
        borderRadius: 15,
        backgroundColor: Palette.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: Palette.gray900,
    },
    headerAction: {
        width: 45,
        height: 45,
        borderRadius: 15,
        backgroundColor: Palette.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Palette.white,
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 50,
        borderWidth: 1,
        borderColor: Palette.gray100,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        fontWeight: '500',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    listSectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Palette.gray500,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 15,
    },
    contactCard: {
        flexDirection: 'row',
        backgroundColor: Palette.white,
        padding: 15,
        borderRadius: 20,
        marginBottom: 12,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 20,
        backgroundColor: Palette.gray100,
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: Palette.success,
        borderWidth: 2,
        borderColor: Palette.white,
    },
    contactInfo: {
        flex: 1,
        marginLeft: 15,
    },
    contactHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    contactName: {
        fontSize: 16,
        fontWeight: '700',
        color: Palette.gray900,
    },
    contactTime: {
        fontSize: 12,
        color: Palette.gray400,
    },
    contactFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lastMessage: {
        fontSize: 13,
        color: Palette.gray500,
        flex: 1,
        marginRight: 10,
    },
    unreadBadge: {
        backgroundColor: Palette.primary,
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    unreadText: {
        color: Palette.white,
        fontSize: 10,
        fontWeight: '800',
    },

    // --- Chat Room Styles ---
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 40 : 10,
        paddingBottom: 20,
        backgroundColor: Palette.white,
        borderBottomWidth: 1,
        borderBottomColor: Palette.gray100,
    },
    chatHeaderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginLeft: 5,
    },
    smallAvatar: {
        width: 40,
        height: 40,
        borderRadius: 15,
        marginRight: 12,
    },
    headerName: {
        fontSize: 16,
        fontWeight: '700',
        color: Palette.gray900,
    },
    headerStatus: {
        fontSize: 11,
        color: Palette.success,
        fontWeight: '600',
    },
    iconButton: {
        padding: 5,
    },
    chatListContent: {
        padding: 20,
    },
    messageWrapper: {
        marginBottom: 20,
        maxWidth: '80%',
    },
    myMessageWrapper: {
        alignSelf: 'flex-end',
    },
    theirMessageWrapper: {
        alignSelf: 'flex-start',
    },
    messageBubble: {
        padding: 14,
        borderRadius: 20,
    },
    myBubble: {
        backgroundColor: Palette.primary,
        borderBottomRightRadius: 4,
    },
    theirBubble: {
        backgroundColor: Palette.white,
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    myMessageText: {
        color: Palette.white,
        fontWeight: '500',
    },
    theirMessageText: {
        color: Palette.gray800,
        fontWeight: '500',
    },
    messageTime: {
        fontSize: 10,
        color: Palette.gray400,
        marginTop: 5,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: Palette.white,
        borderTopWidth: 1,
        borderTopColor: Palette.gray100,
    },
    attachButton: {
        padding: 8,
    },
    textInput: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginHorizontal: 10,
        fontSize: 15,
        maxHeight: 100,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Message;
