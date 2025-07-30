import type { User, Chat, CommunityEvent } from '@/lib/types';

// This is now a template for new users, not the logged-in user.
export const defaultUser: User = {
    id: 'user-0',
    name: 'Youssef (Admin)',
    avatar: 'https://placehold.co/100x100/3CB371/FFFFFF?text=Y',
    isOnline: true,
    role: 'admin',
    status: 'active',
    storage: { used: 25, total: 100 },
    language: 'English',
    // studentId: 'NQC-001', // Example for existing user
    // quranClass: 'advanced-tafsir' // Example for existing user
};

export const users: User[] = [
    { id: 'user-1', name: 'Fatima Ahmed', avatar: 'https://placehold.co/100x100/D4AF37/000000?text=FA', isOnline: true, role: 'user', status: 'active', storage: { used: 40, total: 100 }, studentId: 'NQC-101', quranClass: 'hifz-al-quran', language: 'Urdu' },
    { id: 'user-2', name: 'Omar Khan', avatar: 'https://placehold.co/100x100/D4AF37/000000?text=OK', isOnline: false, role: 'user', status: 'active', storage: { used: 15, total: 100 }, studentId: 'NQC-102', quranClass: 'tajweed-basics', language: 'French' },
    { id: 'user-3', name: 'Aisha Dubois', avatar: 'https://placehold.co/100x100/D4AF37/000000?text=AD', isOnline: true, role: 'user', status: 'suspended', storage: { used: 60, total: 100 }, studentId: 'NQC-103', quranClass: 'quranic-arabic', language: 'French' },
    { id: 'user-4', name: 'Mustafa Schmidt', avatar: 'https://placehold.co/100x100/D4AF37/000000?text=MS', isOnline: false, role: 'user', status: 'active', storage: { used: 5, total: 100 }, studentId: 'NQC-104', quranClass: 'hifz-al-quran', language: 'English' },
    { id: 'user-5', name: 'Layla Olsen', avatar: 'https://placehold.co/100x100/D4AF37/000000?text=LO', isOnline: true, role: 'user', status: 'active', storage: { used: 80, total: 100 }, studentId: 'NQC-105', quranClass: 'advanced-tafsir', language: 'Norwegian' },
];

export const allUsers = [defaultUser, ...users];

export const chats: Chat[] = [
    {
        id: 'chat-1',
        type: 'private',
        name: 'Fatima Ahmed',
        avatar: 'https://placehold.co/100x100/D4AF37/000000?text=FA',
        unreadCount: 2,
        participants: [defaultUser, users[0]],
        messages: [
            { id: 'msg-1', senderId: 'user-1', text: 'السلام عليكم! How are you?', timestamp: new Date(Date.now() - 1000 * 60 * 10), language: 'Arabic' },
            { id: 'msg-2', senderId: 'user-0', text: 'Wa alaikum assalam! I am fine, shukran. And you?', timestamp: new Date(Date.now() - 1000 * 60 * 8) },
            { id: 'msg-3', senderId: 'user-1', text: 'الحمد لله. I wanted to ask about the community Iftar this weekend.', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
            { id: 'msg-4', senderId: 'user-1', text: 'کیا آپ آ رہے ہیں؟', timestamp: new Date(Date.now() - 1000 * 60 * 4), language: 'Urdu' },
        ],
    },
    {
        id: 'chat-2',
        type: 'group',
        name: 'Family Group',
        avatar: 'https://placehold.co/100x100/3CB371/FFFFFF?text=FG',
        unreadCount: 5,
        participants: [defaultUser, users[0], users[1], users[2]],
        messages: [
            { id: 'msg-5', senderId: 'user-2', text: 'Bonjour tout le monde!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), language: 'French' },
            { id: 'msg-6', senderId: 'user-3', text: 'Bonjour Omar! Wie geht es Ihnen?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), language: 'German' },
            { id: 'msg-7', senderId: 'user-0', text: 'Hey everyone! Good to see you all. I wanted to share a link to a great article I read about the history of our local mosque, it was very enlightening. We should all try to read it before the next community meeting. Also, reminder that the potluck is this Friday, please sign up for a dish if you have not already.', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
        ],
    },
    {
        id: 'chat-3',
        type: 'private',
        name: 'Layla Olsen',
        avatar: 'https://placehold.co/100x100/D4AF37/000000?text=LO',
        unreadCount: 0,
        participants: [defaultUser, users[4]],
        messages: [
             { id: 'msg-8', senderId: 'user-5', text: 'Hei! Hvordan går det?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), language: 'Norwegian'},
             { id: 'msg-9', senderId: 'user-0', text: 'Hey Layla! It\'s going well, thanks!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23) },
        ]
    },
];

export const events: CommunityEvent[] = [
    {
        id: 'event-1',
        title: 'Community Iftar',
        date: 'Saturday, 7:30 PM',
        description: 'Join us for a community Iftar to break bread together during Ramadan.',
        location: 'Main Mosque Community Hall'
    },
    {
        id: 'event-2',
        title: 'Eid al-Fitr Celebration',
        date: 'Next Wednesday, 10:00 AM',
        description: 'Celebrate Eid with prayers, food, and activities for the whole family.',
        location: 'City Park'
    },
    {
        id: 'event-3',
        title: 'Islamic Art Workshop',
        date: '2 weeks from now, 2:00 PM',
        description: 'Learn the beautiful art of Islamic calligraphy with guest artist Noureddine Mustapha.',
        location: 'Islamic Cultural Center'
    }
];
