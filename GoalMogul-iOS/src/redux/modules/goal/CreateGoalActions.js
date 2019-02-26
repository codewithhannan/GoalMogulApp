import { reset, SubmissionError, change } from 'redux-form';
import { Alert } from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import { api as API } from '../../middleware/api';
import { clearTags, queryBuilderBasicBuilder } from '../../middleware/utils';

import {
  GOAL_CREATE_SUBMIT,
  GOAL_CREATE_SUBMIT_SUCCESS,
  GOAL_CREATE_SUBMIT_FAIL,
  GOAL_CREATE_EDIT_SUCCESS,
  GOAL_CREATE_TRENDING_REFRESH,
  GOAL_CREATE_TRENDING_REFRESH_DONE,
  GOAL_CREATE_TRENDING_LOADING_MORE,
  GOAL_CREATE_TRENDING_LOADING_MORE_DONE,
  GOAL_CREATE_SWITCH_TAB_BY_INDEX,
  GOAL_CREATE_TRENDING_SELECT_CATEGORY,
  GOAL_CREATE_SWITCH_TAB_BY_KEY
} from './CreateGoal';

import {
  openProfile,
  handleTabRefresh,
  selectProfileTab
} from '../../../actions';

const DEBUG_KEY = '[ Action CreateGoal ]';

// Validate goal form
export const validate = values => {
  const errors = {};
  if (!values.title) {
    errors.title = 'Required';
  }
  if (!values.privacy) {
    errors.privacy = 'Required';
  }
  return errors;
};

// Submit values
export const submitGoal = (
  values, 
  userId, 
  isEdit, 
  callback, 
  goalId, 
  {
    needOpenProfile,
    needRefreshProfile
  },
  pageId // TODO: profile reducer redesign to change here
) => (dispatch, getState) => {
  const { token, user } = getState().user;
  const { tab } = getState().navigation;
  let goal = {};
  try {
    goal = formToGoalAdapter(values, userId);
  } catch (error) {
    console.log(`${DEBUG_KEY}: transform goal error: `, error);
    return;
  }
  
  console.log('Transformed goal is: ', goal);

  dispatch({
    type: GOAL_CREATE_SUBMIT
  });

  // If user is editing the goal, then call another endpoint
  if (isEdit) {
    return submitEditGoal(goal, goalId, token, callback, dispatch, tab, user);
  }

  const onError = () => {
    dispatch({
      type: GOAL_CREATE_SUBMIT_FAIL
    });
    Alert.alert(
      'Creating new goal failed',
      'Please try again later'
    );
  };

  const onSuccess = () => {
    dispatch({
      type: GOAL_CREATE_SUBMIT_SUCCESS
    });
    // Alert.alert(
    //   'Success',
    //   'You have successfully created a goal.'
    // );
    if (needOpenProfile === false) {
      if (needRefreshProfile) {
        // User is already on profile page thus there should be pageId
        selectProfileTab(0, userId, pageId)(dispatch, getState);
        handleTabRefresh('goals', userId, pageId)(dispatch, getState);
      }
      return;
    }

    openProfile(userId, 'goals')(dispatch, getState);
  };

  // Creating new goal
  API
    .post(
      'secure/goal/',
      {
        goal: JSON.stringify({ ...goal })
      },
      token
    )
    .then((res) => {
      if (res.status === 200 || (res.data && !_.isEmpty(res.data))) {
        console.log(`${DEBUG_KEY}: creating goal success`);
        // console.log(`${DEBUG_KEY}: result is`, res);
        // TODO: dispatch changes to feed and clear CreateGoalForm state
        callback();
        onSuccess();
        // dispatch(reset('createGoalModal'));
        return;
      }
      console.log(`${DEBUG_KEY}: creating goal success without returning data, res is: `, res);
      onError();
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY}: Error in submitting new goal ${err}`);
      onError();
    });
};

// Submit editting a goal
const submitEditGoal = (goal, goalId, token, callback, dispatch, tab, owner) => {
  const onError = () => {
    dispatch({
      type: GOAL_CREATE_SUBMIT_FAIL
    });
    Alert.alert(
      'Edit goal failed',
      'Please try again later'
    );
  };

  const onSuccess = (data) => {
    Alert.alert(
      'Success',
      'You have successfully edited a goal.'
    );
    dispatch({
      type: GOAL_CREATE_SUBMIT_SUCCESS
    });

    const goalToReturn = {
      ...data,
      owner
    };

    // console.log(`${DEBUG_KEY}: goal to return is: `, goalToReturn);

    dispatch({
      type: GOAL_CREATE_EDIT_SUCCESS,
      payload: {
        goal: goalToReturn,
        tab
      }
    });
  };

  API
    .put(
      'secure/goal/',
      {
        goalId,
        updates: JSON.stringify({ ...goal })
      },
      token
    )
    .then((res) => {
      if (res.status === 200 || (res.data && res.data !== null)) {
        console.log(`${DEBUG_KEY}: editing goal success`);
        console.log(`${DEBUG_KEY}: result is`, res);
        // TODO: dispatch changes to feed and clear CreateGoalForm state
        callback();
        onSuccess(res.data);
        dispatch(reset('createGoalModal'));
        return;
      }
      console.log(`${DEBUG_KEY}: editing goal success without returning data, res is: `, res);
      onError();
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY}: Error in editing new goal ${err}`);
      onError();
    });
};

// Transform values from Goal form to server accepted format
const formToGoalAdapter = (values, userId) => {
  const {
    title,
    category,
    privacy,
    // Following are not required
    shareToMastermind,
    needs,
    steps,
    details,
    tags,
    priority,
    startTime,
    endTime
  } = values;

  if (!title || !startTime.date || !endTime.date || !category) {
    Alert.alert(
      'Missing field',
      'Please check all the fields are filled in.'
    );
    throw new SubmissionError({
      _error: 'Missing field'
    });
  }

  const startMoment = moment(startTime.date);
  const endMoment = moment(endTime.date);
  const duration = moment.duration(endMoment.diff(startMoment));

  if (duration <= 0) {
    Alert.alert(
      'Incorrect format',
      'Start time should be early than the end time.'
    );
    throw new SubmissionError({
      _error: 'Incorrect start time'
    });
  }

  return {
    owner: userId,
    title,
    category,
    privacy: privacy === 'Private' ? 'self' : privacy.toLowerCase(),
    shareToGoalFeed: shareToMastermind,
    needs: stepsNeedsAdapter(needs),
    steps: stepsNeedsAdapter(steps),
    details: detailsAdapter(details, tags),
    priority,
    start: startTime.date,
    end: endTime.date
  };
};

/**
 * Transform a goal object to form format
 * Note: currently, if a goal is updated, then all its needs' and steps'
 * created will be updated to the current date
 */
export const goalToFormAdaptor = (values) => {
  const {
    title,
    category,
    privacy,
    feedInfo,
    priority,
    details,
    needs,
    steps,
    start,
    end
  } = values;

  // console.log('values are: ', values);
  const { tags, text } = details;
  return {
    title,
    category,
    privacy: privacy === 'self' ? 'Private' : capitalizeWord(privacy),
    // Following are not required
    shareToMastermind: feedInfo && !_.isEmpty(feedInfo),
    // needs: stepsNeedsReverseAdapter(needs),
    needs: (needs.length === 0 || _.isEmpty(needs)) ? [{}] : stepsNeedsReverseAdapter(needs),
    steps: (steps.length === 0 || _.isEmpty(steps)) ? [{}] : stepsNeedsReverseAdapter(steps),
    // steps: stepsNeedsReverseAdapter(steps),
    // TODO: TAG:
    details: details ? [details.text] : [''],
    tags: details ? constructTags(tags, text) : [],
    priority,
    startTime: {
      date: start ? new Date(`${start}`) : undefined,
      picker: false
    },
    endTime: {
      date: end ? new Date(`${end}`) : undefined,
      picker: false
    }
  };
};

const constructTags = (tags, content) => {
  return tags.map((t) => {
    const { startIndex, endIndex, user } = t;
    const tagText = content.slice(startIndex, endIndex);
    const tagReg = `\\B@${tagText}`;
    return {
      tagText,
      tagReg,
      startIndex,
      endIndex,
      user
    };
  });
};

// Function to capitalize the first character
const capitalizeWord = (word) => {
  if (!word) return '';
  return word.replace(/^\w/, c => c.toUpperCase());
};

/**
 * Transform an array of Strings to an array of acceptable Step
 * Step: { isCompleted, description, created, [order]}
 * Note:
 * 1. Things in [] is optional
 * 2. Right now, steps and needs share the same format
 */
const stepsNeedsAdapter = values => {
  if (!values && values.length < 0) {
    return undefined;
  }
  return values.map((val, index) => {
    if (!_.isEmpty(val) && val.description && val.description.trim() !== '') {
      return {
        isCompleted: false,
        description: val.description.trim(),
        order: index + 1,
        created: new Date()
      };
    }
    return '';
  }).filter((val) => val !== '');
};

const detailsAdapter = (value, tags) => {
  if (!value || value.length === 0 || _.isEmpty(value[0])) return undefined;

  const tagsToUse = clearTags(value[0], {}, tags);
  return {
    text: value[0],
    tags: tagsToUse
  };
};

/**
 * Transform an array of needs object to a list of Strings for the form
 * in the order of order params
 * Note: currently, if a goal is updated, then all its needs' and steps'
 * created will be updated to the current date
 */
const stepsNeedsReverseAdapter = values => {
  if (!values || values.length <= 0) return undefined;

  return (
    values
      .sort((a, b) => {
        if (!a.order && !b.order) return a.description - b.description;
        if (!a.order && b.order) return 1;
        if (a.order && !b.order) return -1;
        return (a.order - b.order);
      })
      .map((item) => item)
  );
};

/** Following are Trending goal related actions **/
export const createGoalSwitchTab = (index) => (dispatch) => dispatch({
  type: GOAL_CREATE_SWITCH_TAB_BY_INDEX,
  payload: {
    index
  }
});

/**
 * User select a trending Goal and title is populated to New Goal
 * @param {*} title 
 */
export const selectTrendingGoals = (title) => (dispatch) => {
  dispatch(change('createGoalModal', 'title', title));
  createGoalSwitchTab(0)(dispatch);
};

export const selectTrendingGoalsCategory = (category) => (dispatch, getState) => {
  dispatch({
    type: GOAL_CREATE_TRENDING_SELECT_CATEGORY,
    payload: {
      category
    }
  });
  refreshTrendingGoals()(dispatch, getState);
};

// Refresh trending goals
export const refreshTrendingGoals = () => (dispatch, getState) => {
  console.log(`${DEBUG_KEY}: refresh trending goal`);
  const { limit, category } = getState().createGoal.trendingGoals;
  dispatch({
    type: GOAL_CREATE_TRENDING_REFRESH
  });

  const onSuccess = (res) => {
    console.log(`${DEBUG_KEY}: refresh trending goal success with res: `, res);
    const { data } = res;
    dispatch({
      type: GOAL_CREATE_TRENDING_REFRESH_DONE,
      payload: {
        data,
        skip: data ? data.length : 0,
        hasNextPage: !(data === undefined || data.length === 0),
      }
    });
  };

  const onError = (res) => {
    console.log(`${DEBUG_KEY}: refresh trending goal failed with Error: `, res);
    dispatch({
      type: GOAL_CREATE_TRENDING_REFRESH_DONE,
      payload: {
        data: [],
        skip: 0,
        hasNextPage: false,
      }
    });
  };

  fetchTrendingGoals(0, limit, category, onSuccess, onError)(dispatch, getState);
};

export const loadMoreTrendingGoals = () => (dispatch, getState) => {
  const { skip, limit, category, hasNextPage, refreshing, loading } = getState().createGoal.trendingGoals;
  if (hasNextPage === false || refreshing || loading) return;
  
  dispatch({
    type: GOAL_CREATE_TRENDING_LOADING_MORE
  });

  const onSuccess = (res) => {
    console.log(`${DEBUG_KEY}: loading more trending goal success with res: `, res);
    const { data } = res;
    dispatch({
      type: GOAL_CREATE_TRENDING_LOADING_MORE_DONE,
      payload: {
        data,
        skip: skip + (data ? data.length : 0),
        hasNextPage: !(data === undefined || data.length === 0),
      }
    });
  };

  const onError = (res) => {
    console.log(`${DEBUG_KEY}: loading more trending goal failed with Error: `, res);
    dispatch({
      type: GOAL_CREATE_TRENDING_LOADING_MORE_DONE,
      payload: {
        data: [],
        skip,
        hasNextPage: false,
      }
    });
  };

  fetchTrendingGoals(skip, limit, category, onSuccess, onError)(dispatch, getState);
};

const fetchTrendingGoals = (skip, limit, category, onSuccess, onError) => (dispatch, getState) => {
  const { token } = getState().user;
  API
    .get(`secure/goal/trending?${queryBuilderBasicBuilder({ skip, limit, category })}`, token)
    .then((res) => {
      if (res.status === 200) {
        return onSuccess(res);
      }
      return onError(res);
    })
    .catch(err => {
      onError(err);
    });
};
