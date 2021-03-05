/** @format */

export const DEFAULT_TRANSFORMED_COMMENTS = [
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
