// This file is created to move the original test data from application file to here
const testTransformedComments = [
  {
    _id: '1',
    owner: {
      name: 'Jia Zeng'
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
        description: 'Find good books tes testset adfasdf'
      },
      suggestionText:
        'You should connect with Sharon! She\'s an avid reader and an incredible writer.',
      userRef: {

      }
    },
    parentRef: {

    },
    childComments: [{
      _id: 'child1',
      owner: {
        name: 'Mike Zeng'
      },
      parentType: 'Goal',
      commentType: 'Reply',
      replyToRef: '',
      content: {
        text: 'There are a total of four children. This should be a child component 1'
      },
      parentRef: {

      },
    }, {
      _id: 'child2',
      owner: {
        name: 'Super Andy'
      },
      parentType: 'Goal',
      commentType: 'Reply',
      replyToRef: '',
      content: {
        text: 'this should be a child component 2'
      },
      parentRef: {

      },
    }, {
      _id: 'child3',
      owner: {
        name: 'This is super long nameeeeeee nameeeeee nameee'
      },
      parentType: 'Goal',
      commentType: 'Reply',
      replyToRef: '',
      content: {
        text: 'this should be a child component 3'
      },
      parentRef: {

      },
    }, {
      owner: {
        name: 'Wait a minute'
      },
      parentType: 'Goal',
      commentType: 'Reply',
      replyToRef: '',
      content: {
        text: 'this should be a child component 4'
      },
      parentRef: {

      },
    }]
  },
  {
    _id: '2',
    owner: {
      name: 'Jay Patel'
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
        description: 'Find good books tes testset adfasdf'
      },
      suggestionText: 'This is a test comment with' +
       'a lot of lines so that we can test if that function works out of box. ' +
       'With this length, we can really tell it. ' +
       'Need more lines to test this feature',
      userRef: {

      }
    },
    content: {

    },
    parentRef: {

    },
    childComments: []
  },
  {
    _id: '3',
    owner: {
      name: 'Lydia'
    },
    numberOfChildrenShowing: 0,
    hasMoreToShow: false,
    content: {
      text: 'This is a very simple comment by Lydia'
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
    parentRef: {

    }
  }
];

const testGoal = {
  __v: 0,
  _id: '5b502211e500e3001afd1e20',
  category: 'General',
  created: '2018-07-19T05:30:57.531Z',
  details: {
    tags: [],
    text: 'This is detail'
  },
  feedInfo: {
    _id: '5b502211e500e3001afd1e18',
    publishDate: '2018-07-19T05:30:57.531Z',
  },
  lastUpdated: '2018-07-19T05:30:57.531Z',
  needs: [{
    created: '2018-07-19T05:30:57.531Z',
    description: 'introduction to someone from the Bill and Melinda Gates Foundation',
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
    description: 'Legal & Safety experts who have worked with the United States',
    isCompleted: false,
    order: 2,
  }],
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
  steps: [{
    created: '2018-07-19T05:30:57.531Z',
    description: 'This is my first step to complete the goal',
    isCompleted: false,
    order: 0,
  }],
  title: 'Establish a LMFBR near Westport, Connecticut by 2020',
};

export const incomingRequests = [
  {
    type: 'incoming',
    user: {
      name: 'Frank Wang',
      headline: 'Strive to be the best photographer !~',
      profile: {
        about: 'This is about',
        pointsEarned: 10,
        image: undefined
      }
    },
    friendshipId: 'friend1',
    _id: 'friend1'
  },
  {
    type: 'incoming',
    user: {
      name: 'Scott Miller',
      headline: 'Discover the beauty of the world',
      profile: {
        about: 'This is about',
        pointsEarned: 10,
        image: undefined
      }
    },
    friendshipId: 'friend2',
    _id: 'friend2'
  }
];

export const outgoingRequests = [
  {
    type: 'outgoing',
    user: {
      name: 'Jason Chen',
      headline: 'Sing with heart',
      profile: {
        about: 'This is about',
        pointsEarned: 10,
        image: undefined
      }
    },
    friendshipId: 'friend3',
    _id: 'friend3'
  },
  {
    type: 'outgoing',
    user: {
      name: 'Jing Zhang',
      headline: 'Let\'s get it done!',
      profile: {
        about: 'This is about',
        pointsEarned: 10,
        image: undefined
      }
    },
    friendshipId: 'friend4',
    _id: 'friend4'
  }
];

export const testFriendRequests = [...incomingRequests, ...outgoingRequests];

export const profileTestData = {
  name: 'Jia Zeng',
  email: 'jz145@duke.edu',
  phone: '9194912504',
  headline: 'I predict market with mathematical models',
  privacy: {
    friends: 'Public'
  },
  profile: {
    pointsEarned: 10,
    about: 'This is a test page.',
    elevatorPitch: 'This is a profile elevator pitch',
    image: '',
    occupation: 'Quantative Analyst at Jane Street'
  }
};
