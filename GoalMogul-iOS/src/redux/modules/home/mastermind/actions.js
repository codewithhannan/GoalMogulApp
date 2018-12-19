import { Actions } from 'react-native-router-flux';
import {
  HOME_CLOSE_CREATE_OVERLAY,
  HOME_MASTERMIND_OPEN_CREATE_OVERLAY,
  HOME_REFRESH_GOAL,
  HOME_REFRESH_GOAL_DONE,
  HOME_LOAD_GOAL,
  HOME_LOAD_GOAL_DONE,
  HOME_SET_GOAL_INDEX,
  HOME_UPDATE_FILTER
} from '../../../../reducers/Home';

import {
  GOAL_DETAIL_OPEN
} from '../../../../reducers/GoalDetailReducers';

// Actions
import {
  refreshComments
} from '../../feed/comment/CommentActions';

import {
  refreshGoalDetailById
} from '../../goal/GoalDetailActions';

import { api as API } from '../../../middleware/api';
import { queryBuilder } from '../../../middleware/utils';

const DEBUG_KEY = '[ Action Home Mastermind ]';
const BASE_ROUTE = 'secure/goal/';

export const openCreateOverlay = () => ({
  type: HOME_MASTERMIND_OPEN_CREATE_OVERLAY
});

export const closeCreateOverlay = (tab) => ({
  type: HOME_CLOSE_CREATE_OVERLAY,
  payload: tab
});

// Open goal detail
export const openGoalDetail = goal => (dispatch, getState) => {
  const { tab } = getState().navigation;
  const { _id } = goal;
  dispatch({
    type: GOAL_DETAIL_OPEN,
    payload: {
      goal,
      tab
    }
  });

  refreshGoalDetailById(_id)(dispatch, getState);
  refreshComments('Goal', _id, tab, undefined)(dispatch, getState);
  // TODO: create new stack using Actions.create(React.Element) if needed
  Actions.goal();
};

// set currentIndex to the prev one
export const getPrevGoal = () => (dispatch, getState) => {
  const { currentIndex } = getState().home.mastermind;
  if (currentIndex <= 0) {
    return false;
  }
  dispatch({
    type: HOME_SET_GOAL_INDEX,
    payload: currentIndex - 1
  });
  return true;
};

// set currentIndex to the next one
export const getNextGoal = () => (dispatch, getState) => {
  const { currentIndex, goals } = getState().home.mastermind;
  if (currentIndex >= goals.length) {
    return false;
  }
  dispatch({
    type: HOME_SET_GOAL_INDEX,
    payload: currentIndex + 1
  });
  return true;
};

// User update filter for specific tab in Mastermind
export const changeFilter = (tab, filterType, value) => (dispatch) => {
  dispatch({
    type: HOME_UPDATE_FILTER,
    payload: {
      tab,
      type: filterType,
      value
    }
  });
};

/**
 * For the next three functions, we could abstract a pattern since
 * It's shared across mastermind/actions, feed/actions, MeetActions, ProfileActions
 */

//Refresh goal for mastermind tab
export const refreshGoals = () => (dispatch, getState) => {
  const { token } = getState().user;
  const { limit, filter } = getState().home.mastermind;
  const { categories, priorities, sortBy } = filter;
  dispatch({
    type: HOME_REFRESH_GOAL,
    payload: {
      type: 'mastermind'
    }
  });
  loadGoals(0, limit, token, { priorities, categories, sortBy }, (data) => {
    console.log(`${DEBUG_KEY}: refreshed goals with length: ${data.length}`);
    // console.log(`${DEBUG_KEY}: refreshed goals are: `, data);
    dispatch({
      type: HOME_REFRESH_GOAL_DONE,
      payload: {
        type: 'mastermind',
        // TOOD: fix to remove testData
        // data: [...data, ...testData],
        data,
        skip: data.length,
        limit: 20,
        hasNextPage: !(data === undefined || data.length === 0)
      }
    });
  }, () => {
    // TODO: implement for onError
  });
};

// Load more goal for mastermind tab
export const loadMoreGoals = () => (dispatch, getState) => {
  const { token } = getState().user;
  const { skip, limit, filter, hasNextPage, refreshing, loadingMore } = getState().home.mastermind;
  if (hasNextPage === false || refreshing || loadingMore) {
    return;
  }

  dispatch({
    type: HOME_LOAD_GOAL,
    payload: {
      type: 'mastermind'
    }
  });
  const { categories, priorities, sortBy } = filter;
  loadGoals(skip, limit, token, { priorities, categories, sortBy }, (data) => {
    console.log(`${DEBUG_KEY}: load more goals with data length: `, data.length);
    // console.log(`${DEBUG_KEY}: load more goals with data: `, data);
    dispatch({
      type: HOME_LOAD_GOAL_DONE,
      payload: {
        type: 'mastermind',
        // TOOD: fix to remove testData
        // data: [...data, ...testData],
        data,
        skip: skip + (data === undefined ? 0 : data.length),
        limit: 20,
        hasNextPage: !(data === undefined || data.length === 0)
      }
    });
  }, () => {
    // TODO: implement for onError
  });
};

/**
 * Basic API to load goals based on skip and limit
 * @param isRefresh:
 * @param skip:
 * @param limit:
 * @param token:
 */
const loadGoals = (skip, limit, token, params, callback, onError) => {
  const route = 'feed';
  const { priorities, categories, sortBy } = params;
  let priority;
  if (priorities && priorities !== '') {
    priority = priorities;
  }

  API
    .get(
      `${BASE_ROUTE}${route}?${
        queryBuilder(skip, limit, {
          priority,
          categories: categories === 'All' ? undefined : categories
        })
      }`,
      token
    )
    .then((res) => {
      // console.log('loading goals in mastermind with res: ', res);
      if (res.status === 200 || (res && res.data)) {
        // Right now return test data
        callback(res.data);
        return;
      }
      callback([]); // TODO: delete this line
      console.log(`${DEBUG_KEY}: Loading goal with no res`);
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY} load goal error: ${err}`);
      onError(err);
      callback([]);
    });
};

// TODO: delete this test data
const testData = [
  {
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
      _id: '1',
      created: '2018-07-19T05:30:57.531Z',
      description: 'introduction to someone from the Bill and Melinda Gates Foundation',
      isCompleted: false,
      order: 0,
    },
    {
      _id: '2',
      created: '2018-07-19T05:30:57.531Z',
      description: 'Get in contact with Nuclear experts',
      isCompleted: false,
      order: 1,
    },
    {
      _id: '3',
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
    steps: [
      {
        _id: '100',
        created: new Date(),
        description: 'Talk to 10 neighbourhood around the area for the scene',
        isCompleted: true,
        order: 0
      },
      {
        _id: '101',
        created: new Date(),
        description: 'Gather crime report for 301 tribe ave.',
        isCompleted: false,
        order: 1
      },

    ],
    title: 'Establish a LMFBR near Westport, Connecticut by 2020',
  },
  {
    __v: 0,
    _id: '5b502211e500e300119827sdadf',
    category: 'General',
    created: '2018-07-19T05:30:57.531Z',
    details: {
      tags: [],
      text: 'This is detail'
    },
    feedInfo: {
      _id: '5b502211e500e3001afd1123123',
      publishDate: '2018-08-19T05:30:57.531Z',
    },
    lastUpdated: '2018-08-19T05:30:57.531Z',
    needs: [{
      created: '2018-07-19T05:30:57.531Z',
      description: 'Get to know a good local wine tasting course',
      isCompleted: false,
      order: 0
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
    steps: [
      {
        created: '2018-07-19T05:30:57.531Z',
        description: 'This is the first step. I need to take the course.',
        isCompleted: true,
        order: 0
      },
      {
        created: '2018-07-19T05:30:57.531Z',
        description: 'This is the second step. Take the exam.',
        isCompleted: false,
        order: 1
      },

    ],
    title: 'Get a license in wine tasting',
  }
];
