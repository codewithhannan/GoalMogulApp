/** @format */

import _ from 'lodash'
import { getRandomId } from './Utils'

// Obtain one mock goal
const mockAGoal = () => {
    let goal = _.cloneDeep(DEFAULT_GOAL)
    goal = _.set(goal, '_id', getRandomId())
    return goal
}

// Obtain an array of goals
const mockGoals = () => {}

export { mockAGoal, mockGoals }

export const DEFAULT_GOAL = {
    __v: 0,
    _id: '5b502211e500e3001afd1e20',
    category: 'General',
    likeCount: 1,
    shareCount: 2,
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
            _id: 'need-0',
            created: '2018-07-19T05:30:57.531Z',
            description:
                'introduction to someone from the Bill and Melinda Gates Foundation',
            isCompleted: false,
            order: 0,
        },
        {
            _id: 'need-1',
            created: '2018-07-19T05:30:57.531Z',
            description: 'Get in contact with Nuclear experts',
            isCompleted: false,
            order: 1,
        },
        {
            _id: 'neeed-2',
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
            _id: 'step-0',
            created: '2018-07-19T05:30:57.531Z',
            description: 'This is my first step to complete the goal',
            isCompleted: false,
            order: 0,
        },
    ],
    title: 'Establish a LMFBR near Westport, Connecticut by 2020',
}
