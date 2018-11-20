import {
  HOME_REFRESH_GOAL,
  HOME_REFRESH_GOAL_DONE,
  HOME_LOAD_GOAL_DONE,
} from '../../../../reducers/Home';

import { api as API } from '../../../middleware/api';
import { queryBuilder } from '../../../middleware/utils';

const DEBUG_KEY = '[ Action Home Activity ]';
const BASE_ROUTE = 'secure/feed/activity';

/**
 * For the next three functions, we could abstract a pattern since
 * It's shared across mastermind/actions, feed/actions, MeetActions, ProfileActions
 * NOTE: goal feed and activity feed share the same constants with different
 * input on type field
 */

//Refresh feed for activity tab
export const refreshFeed = () => (dispatch, getState) => {
  const { token } = getState().user;
  const { limit, filter } = getState().home.mastermind;
  const { categories, priority } = filter;
  dispatch({
    type: HOME_REFRESH_GOAL,
    payload: {
      type: 'activityfeed'
    }
  });
  loadFeed(0, limit, token, priority, categories, (data) => {
    dispatch({
      type: HOME_REFRESH_GOAL_DONE,
      payload: {
        type: 'activityfeed',
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
export const loadMoreFeed = () => (dispatch, getState) => {
  const { token } = getState().user;
  const { skip, limit, filter, hasNextPage } = getState().home.mastermind;
  if (hasNextPage === false) {
    return;
  }
  const { categories, priority } = filter;
  loadFeed(skip, limit, token, priority, categories, (data) => {
    dispatch({
      type: HOME_LOAD_GOAL_DONE,
      payload: {
        type: 'activityfeed',
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

/**
 * Basic API to load goals based on skip and limit
 */
const loadFeed = (skip, limit, token, priority, categories, callback, onError) => {
  API
    .get(
      `${BASE_ROUTE}?${queryBuilder(skip, limit, { priority, categories })}`,
      token
    )
    .then((res) => {
      // console.log('loading feed with res: ', res);
      if (res && res.data) {
        // return callback([...res.data, ...testData]);
        return callback([...res.data]);
      }
      console.log(`${DEBUG_KEY}: Loading activity feed with no data: `, res);
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY} load activity feed with error: ${err}`);
      // if (skip === 0) {
      //   callback(testData);
      // } else {
      //   callback([]);
      // }
      callback([]);
    });
};

// TODO: delete this test data
const testData = [
  {
    _id: '5b5677e2e2f7ceccddb56069',
    created: '2018-07-24T00:50:42.632Z',
    actor: {
      _id: '5b172a82e64f7e001a2ade23',
      name: 'John Doe',
      headline: 'Your friendly boi',
      profile: {
        views: 0,
        pointsEarned: 0,
        image: 'ProfileImage/5e339201-31bf-4a00-b0e9-1c5cc1d20236'
      }
    },
    action: 'Create',
    actedWith: 'Post',
    actedUponEntityOwnerId: '5b172a82e64f7e001a2ade23',
    actedUponEntityType: 'Post',
    actedUponEntityId: '5b5677e2e2f7ceccddb56068',
    postRef: {
      _id: '5b5677e2e2f7ceccddb56068',
      created: '2018-07-24T00:50:42.534Z',
      lastUpdated: '2018-07-24T00:50:42.534Z',
      owner: {
          _id: '5b17781ebec96d001a409960',
          name: 'jia zeng',
          profile: {
              views: 0,
              pointsEarned: 0,
              elevatorPitch: '',
              occupation: 'test'
          }
      },
      postType: 'General',
      privacy: 'friends',
      __v: 0,
      content: {
        text: 'test 4!',
        links: [],
        tags: []
      }
    },
    __v: 0
  }
];
