/** @format */

// This file is created to move the original test data from application file to here
const testTransformedComments = [
    {
        _id: '1',
        owner: {
            name: 'Jia Zeng',
        },
        numberOfChildrenShowing: 1,
        hasMoreToShow: true,
        parentType: 'Goal',
        commentType: 'Suggestion',
        suggestion: {
            suggestionType: 'User',
            suggestionFor: 'Step',
            suggestionForRef: {
                order: 1,
                description: 'Find good books tes testset adfasdf',
            },
            suggestionText:
                "You should connect with Sharon! She's an avid reader and an incredible writer.",
            userRef: {},
        },
        parentRef: {},
        childComments: [
            {
                _id: 'child1',
                owner: {
                    name: 'Mike Zeng',
                },
                parentType: 'Goal',
                commentType: 'Reply',
                replyToRef: '',
                content: {
                    text:
                        'There are a total of four children. This should be a child component 1',
                },
                parentRef: {},
            },
            {
                _id: 'child2',
                owner: {
                    name: 'Super Andy',
                },
                parentType: 'Goal',
                commentType: 'Reply',
                replyToRef: '',
                content: {
                    text: 'this should be a child component 2',
                },
                parentRef: {},
            },
            {
                _id: 'child3',
                owner: {
                    name: 'This is super long nameeeeeee nameeeeee nameee',
                },
                parentType: 'Goal',
                commentType: 'Reply',
                replyToRef: '',
                content: {
                    text: 'this should be a child component 3',
                },
                parentRef: {},
            },
            {
                owner: {
                    name: 'Wait a minute',
                },
                parentType: 'Goal',
                commentType: 'Reply',
                replyToRef: '',
                content: {
                    text: 'this should be a child component 4',
                },
                parentRef: {},
            },
        ],
    },
    {
        _id: '2',
        owner: {
            name: 'Jay Patel',
        },
        numberOfChildrenShowing: 0,
        hasMoreToShow: false,
        parentType: 'Goal',
        commentType: 'Suggestion',
        suggestion: {
            suggestionType: 'User',
            suggestionFor: 'Step',
            suggestionForRef: {
                order: 2,
                description: 'Find good books tes testset adfasdf',
            },
            suggestionText:
                'This is a test comment with' +
                'a lot of lines so that we can test if that function works out of box. ' +
                'With this length, we can really tell it. ' +
                'Need more lines to test this feature',
            userRef: {},
        },
        content: {},
        parentRef: {},
        childComments: [],
    },
    {
        _id: '3',
        owner: {
            name: 'Lydia',
        },
        numberOfChildrenShowing: 0,
        hasMoreToShow: false,
        content: {
            text: 'This is a very simple comment by Lydia',
        },
        parentType: 'Goal',
        commentType: 'Comment',
        // suggestion: {
        //   suggestionType: 'User',
        //   suggestionFor: 'Step',
        //   suggestionForRef: {
        //     order: 2,
        //     description: 'Find good books tes testset adfasdf'
        //   },
        //   suggestionText:
        //     'You should connect with Sharon! She\'s an avid reader and an incredible writer.',
        //   userRef: {
        //
        //   }
        // },
        parentRef: {},
    },
]

const testGoal = {
    __v: 0,
    _id: '5b502211e500e3001afd1e20',
    category: 'General',
    created: '2018-07-19T05:30:57.531Z',
    details: {
        tags: [],
        text: 'This is detail',
    },
    feedInfo: {
        _id: '5b502211e500e3001afd1e18',
        publishDate: '2018-07-19T05:30:57.531Z',
    },
    lastUpdated: '2018-07-19T05:30:57.531Z',
    needs: [
        {
            created: '2018-07-19T05:30:57.531Z',
            description:
                'introduction to someone from the Bill and Melinda Gates Foundation',
            isCompleted: false,
            order: 0,
        },
        {
            created: '2018-07-19T05:30:57.531Z',
            description: 'Get in contact with Nuclear experts',
            isCompleted: false,
            order: 1,
        },
        {
            created: '2018-07-19T05:30:57.531Z',
            description:
                'Legal & Safety experts who have worked with the United States',
            isCompleted: false,
            order: 2,
        },
    ],
    owner: {
        _id: '5b17781ebec96d001a409960',
        name: 'jia zeng',
        profile: {
            elevatorPitch: 'This is my elevatorPitch',
            occupation: 'Software Engineer',
            pointsEarned: 10,
            views: 0,
        },
    },
    priority: 3,
    privacy: 'friends',
    steps: [
        {
            created: '2018-07-19T05:30:57.531Z',
            description: 'This is my first step to complete the goal',
            isCompleted: false,
            order: 0,
        },
    ],
    title: 'Establish a LMFBR near Westport, Connecticut by 2020',
}

export const incomingRequests = [
    {
        type: 'incoming',
        user: {
            name: 'Frank Wang',
            headline: 'Strive to be the best photographer !~',
            profile: {
                about: 'This is about',
                pointsEarned: 10,
                image: undefined,
            },
        },
        friendshipId: 'friend1',
        _id: 'friend1',
    },
    {
        type: 'incoming',
        user: {
            name: 'Scott Miller',
            headline: 'Discover the beauty of the world',
            profile: {
                about: 'This is about',
                pointsEarned: 10,
                image: undefined,
            },
        },
        friendshipId: 'friend2',
        _id: 'friend2',
    },
]

export const outgoingRequests = [
    {
        type: 'outgoing',
        user: {
            name: 'Jason Chen',
            headline: 'Sing with heart',
            profile: {
                about: 'This is about',
                pointsEarned: 10,
                image: undefined,
            },
        },
        friendshipId: 'friend3',
        _id: 'friend3',
    },
    {
        type: 'outgoing',
        user: {
            name: 'Jing Zhang',
            headline: "Let's get it done!",
            profile: {
                about: 'This is about',
                pointsEarned: 10,
                image: undefined,
            },
        },
        friendshipId: 'friend4',
        _id: 'friend4',
    },
]

export const testFriendRequests = [...incomingRequests, ...outgoingRequests]

export const profileTestData = {
    name: 'Jia Zeng',
    email: 'jz145@duke.edu',
    phone: '9194912504',
    headline: 'I predict market with mathematical models',
    privacy: {
        friends: 'Public',
    },
    profile: {
        pointsEarned: 10,
        about: 'This is a test page.',
        elevatorPitch: 'This is a profile elevator pitch',
        image: '',
        occupation: 'Quantative Analyst at Jane Street',
    },
}

export const SuggestionSearchTestData = {
    User: [
        {
            name: 'Jia Zeng',
            headline: 'Students at Duke University',
            request: false,
            _id: '120937109287091',
            profile: {
                about: 'this is about for jia zeng',
            },
        },
        {
            name: 'Peter Kushner',
            headline: 'CEO at start industries',
            request: false,
            _id: '019280980248303',
            profile: {
                about: 'this is about for jia zeng',
            },
        },
    ],
    Friend: [
        {
            name: 'Jia Zeng',
            headline: 'Students at Duke University',
            request: false,
            _id: '120937109287091',
            profile: {
                about: 'this is about for jia zeng',
            },
        },
        {
            name: 'Peter Kushner',
            headline: 'CEO at start industries',
            request: false,
            _id: '019280980248303',
            profile: {
                about: 'this is about for jia zeng',
            },
        },
    ],
    Tribe: [
        {
            _id: '123170293817024',
            created: '',
            name: 'SoHo Artists',
            membersCanInvite: true,
            isPubliclyVisible: true,
            membershipLimit: 100,
            description:
                'This group is for all artists currently living in or working out of ' +
                'SoHo, NY. We exchange ideas, get feedback from each other and help each other ' +
                'organize exhiits for our work!',
            picture: '',
            members: [
                {
                    _id: '1203798700',
                    name: 'Jia Zeng',
                    profile: {
                        image: undefined,
                    },
                },
            ],
            memberCount: 10,
        },
        {
            _id: '123170293817023',
            created: '',
            name: 'Comic fans',
            membersCanInvite: true,
            isPubliclyVisible: true,
            membershipLimit: 20,
            description: 'This group is dedicated to the fan of comics in LA!',
            picture: '',
            members: [
                {
                    _id: '1203798705',
                    name: 'Super Andy',
                    profile: {
                        image: undefined,
                    },
                },
            ],
            memberCount: 19,
        },
    ],
    Event: [
        {
            _id: '980987230941',
            created: '2018-09-03T05:46:44.038Z',
            creator: {
                // User ref
                name: 'Jia Zeng',
            },
            title: "Jay's end of internship party",
            start: '2018-09-05T05:46:44.038Z',
            durationHours: 2,
            participantsCanInvite: true,
            isInviteOnly: true,
            participantLimit: 100,
            location: '100 event ave, NY',
            description: "Let's get together to celebrate Jay's birthday",
            picture: '',
            participants: [
                {
                    _id: '123698172691',
                    name: 'Super Andy',
                    profile: {
                        image: undefined,
                    },
                },
                {
                    _id: '123698172692',
                    name: 'Mike Gai',
                    profile: {
                        image: undefined,
                    },
                },
            ],
            participantCount: 2,
        },
        {
            _id: '980987230942',
            created: '2018-6-03T05:46:44.038Z',
            creator: {
                // User ref
                name: 'David Bogger',
            },
            title: 'Back to school party',
            start: '2018-09-10T05:46:44.038Z',
            durationHours: 3,
            participantsCanInvite: false,
            isInviteOnly: true,
            participantLimit: 30,
            location: 'TBD',
            description: 'We do nothing and simple enjoy life',
            picture: '',
            participants: [
                {
                    _id: '123698172693',
                    name: 'Batman',
                    profile: {
                        image: undefined,
                    },
                },
                {
                    _id: '123698172694',
                    name: 'Captain America',
                    profile: {
                        image: undefined,
                    },
                },
            ],
            participantCount: 2,
        },
    ],
    ChatConvoRoom: [],
}

const EventTestData = [
    {
        _id: '980987230941',
        created: '2018-09-03T05:46:44.038Z',
        creator: {
            // User ref
            name: 'Jia Zeng',
        },
        title: "Jay's end of internship party",
        start: '2018-09-05T05:46:44.038Z',
        durationHours: 2,
        participantsCanInvite: true,
        isInviteOnly: true,
        participantLimit: 100,
        location: '100 event ave, NY',
        description: "Let's get together to celebrate Jay's birthday",
        picture: '',
        participants: [
            {
                _id: '123698172691',
                name: 'Super Andy',
                profile: {
                    image: undefined,
                },
            },
            {
                _id: '123698172692',
                name: 'Mike Gai',
                profile: {
                    image: undefined,
                },
            },
        ],
        participantCount: 2,
    },
    {
        _id: '980987230942',
        created: '2018-6-03T05:46:44.038Z',
        creator: {
            // User ref
            name: 'David Bogger',
        },
        title: 'Back to school party',
        start: '2018-09-10T05:46:44.038Z',
        durationHours: 3,
        participantsCanInvite: false,
        isInviteOnly: true,
        participantLimit: 30,
        location: 'TBD',
        description: 'We do nothing and simple enjoy life',
        picture: '',
        participants: [
            {
                participantRef: {
                    _id: '123698172693',
                    name: 'Batman',
                    profile: {
                        image: undefined,
                    },
                },
                rsvp: 'Invited',
            },
            {
                participantRef: {
                    _id: '123698172694',
                    name: 'Captain America',
                    profile: {
                        image: undefined,
                    },
                },
                rsvp: 'Interested',
            },
        ],
        participantCount: 2,
    },
]

const TribeTestData = [
    {
        _id: '123170293817024',
        created: '',
        name: 'SoHo Artists',
        membersCanInvite: true,
        isPubliclyVisible: true,
        membershipLimit: 100,
        description:
            'This group is for all artists currently living in or working out of ' +
            'SoHo, NY. We exchange ideas, get feedback from each other and help each other ' +
            'organize exhiits for our work!',
        picture: '',
        members: [
            {
                memberRef: {
                    _id: '1203798700',
                    name: 'Jia Zeng',
                    profile: {
                        image: undefined,
                    },
                },
                category: 'Member',
            },
            {
                memberRef: {
                    _id: '1203798701',
                    name: 'Aditya Zheng',
                    profile: {
                        image: undefined,
                    },
                },
                category: 'Admin',
            },
            {
                memberRef: {
                    _id: '1203798703',
                    name: 'Requester',
                    profile: {
                        image: undefined,
                    },
                },
                category: 'JoinRequester',
            },
        ],
        memberCount: 3,
    },
    {
        _id: '123170293817023',
        created: '',
        name: 'Comic fans',
        membersCanInvite: true,
        isPubliclyVisible: true,
        membershipLimit: 20,
        description: 'This group is dedicated to the fan of comics in LA!',
        picture: '',
        members: [
            {
                memberRef: {
                    _id: '1203798705',
                    name: 'Super Andy',
                    profile: {
                        image: undefined,
                    },
                },
                category: 'Member',
            },
        ],
        memberCount: 19,
    },
]

export const TestNotificationData = [
    {
        _id: 'notification1',
        created: new Date(),
        read: false,
        parsedNoti: {
            notificationMessage: 'Hi There',
            path: 'path',
        },
    },
    {
        _id: 'notification2',
        created: new Date(),
        read: false,
        parsedNoti: {
            notificationMessage: 'Hi There 2',
            path: 'path',
        },
    },
    {
        _id: 'notification3',
        created: new Date(),
        read: false,
        parsedNoti: {
            notificationMessage: 'Hi There 3',
            path: 'path',
        },
    },
]
