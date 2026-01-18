export const datingProfiles = [
    {
        id: "user_1",
        name: "Sophea",
        age: 23,
        bio: "Love coffee and traveling ☕️✈️. Looking for someone to explore new cafes with!",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
        distance: "2 km away"
    },
    {
        id: "user_2",
        name: "Dara",
        age: 25,
        bio: "Full-stack developer 💻. I speak JavaScript and sarcasm.",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
        distance: "5 km away"
    },
    {
        id: "user_3",
        name: "Kanika",
        age: 21,
        bio: "Artist 🎨. Living life in colors.",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
        distance: "10 km away"
    },
    {
        id: "user_4",
        name: "Visal",
        age: 26,
        bio: "Gym rat 🏋️‍♂️. Let's get fit together.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
        distance: "12 km away"
    },
    {
        id: "user_5",
        name: "Bopha",
        age: 22,
        bio: "Foodie 🍕. I know the best pizza place in town.",
        image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80",
        distance: "3 km away"
    }
];

export const mockConversations = [
    {
        id: "conv_1",
        user: {
            id: "user_2",
            name: "Dara",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80",
            isOnline: true
        },
        lastMessage: "Hey! Are you free this weekend?",
        unread: 2,
        timestamp: "10:30 AM"
    },
    {
        id: "conv_2",
        user: {
            id: "user_1",
            name: "Sophea",
            avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80",
            isOnline: false
        },
        lastMessage: "Sent you a photo 📷",
        unread: 0,
        timestamp: "Yesterday"
    },
    {
        id: "conv_3",
        user: {
            id: "user_5",
            name: "Bopha",
            avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&q=80",
            isOnline: true
        },
        lastMessage: "Haha that's so funny! 😂",
        unread: 0,
        timestamp: "Mon"
    }
];

export const mockMessages = {
    "conv_1": [
        { id: 1, sender: "them", text: "Hi there! 👋", time: "10:00 AM" },
        { id: 2, sender: "me", text: "Hello! How are you?", time: "10:05 AM" },
        { id: 3, sender: "them", text: "I'm doing great, thanks! Just coding some React.", time: "10:15 AM" },
        { id: 4, sender: "them", text: "Hey! Are you free this weekend?", time: "10:30 AM" }
    ],
    "conv_2": [
        { id: 1, sender: "me", text: "Did you visit that cafe?", time: "Yesterday" },
        { id: 2, sender: "them", text: "Yes! It was amazing.", time: "Yesterday" },
        { id: 3, sender: "them", text: "Sent you a photo 📷", type: "image", image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&q=80", time: "Yesterday" }
    ],
    "conv_3": [
        { id: 1, sender: "me", text: "Look at this cat video!", time: "Mon" },
        { id: 2, sender: "them", text: "Haha that's so funny! 😂", time: "Mon" }
    ]
};
