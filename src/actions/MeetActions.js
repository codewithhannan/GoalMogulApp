/** @format */

import { Actions } from 'react-native-router-flux'
import _ from 'lodash'
import * as Contacts from 'expo-contacts'
import { api as API, singleFetch } from '../redux/middleware/api'
import {
    MEET_SELECT_TAB,
    MEET_LOADING,
    MEET_LOADING_DONE,
    MEET_UPDATE_FRIENDSHIP,
    MEET_UPDATE_FRIENDSHIP_DONE,
    MEET_TAB_REFRESH,
    MEET_TAB_REFRESH_DONE,
    MEET_TAB_ONBOARDING_REFRESH,
    MEET_TAB_ONBOARDING_REFRESH_DONE,
    MEET_CHANGE_FILTER,
    MEET_REQUESTS_CHANGE_TAB,
} from './types'

import {
    MEET_CONTACT_SYNC_FETCH_DONE,
    MEET_CONTACT_SYNC,
    MEET_CONTACT_SYNC_REFRESH_DONE,
    MEET_CONTACT_SYNC_LOAD_REMOTE_MATCH,
} from '../reducers/MeetReducers'

import {
    handleUploadContacts,
    fetchMatchedContacts,
} from '../Utils/ContactUtils'
import { Logger } from '../redux/middleware/utils/Logger'
import { DropDownHolder } from '../Main/Common/Modal/DropDownModal'
import { CONTACT_SYNC_LOAD_CONTACT_DONE } from '../redux/modules/User/ContactSync/ContactSyncReducers'

// Utils
import { componentKeyByTab } from '../redux/middleware/utils'
import { setRequestsSent } from '../reducers/FriendsRequestReducer'

const BASE_ROUTE = 'secure/user/'
// const BASE_ROUTE = 'dummy/user/';

const requestMap = {
    suggested: 'friendship/recommendations',
    suggestedOnBoarding: 'friendship/inviter-friends',
    requests: {
        outgoing: 'friendship/invitations/outgoing',
        incoming: 'friendship/invitations/incoming',
    },
    friends: 'friendship',
    contacts: 'ContactSync/stored-matches',
}

const tabs = [
    'suggested',
    'requests.outgoing',
    'requests.incoming',
    'friends',
    'contacts',
]

const DEBUG_KEY = '[ MeetAction ]'

export const openMeet = () => (dispatch, getState) => {
    const { tab } = getState().navigation
    const componentKeyToOpen = componentKeyByTab(tab, 'meet')

    console.log(`${DEBUG_KEY}: componentKeyToOpen: ${componentKeyToOpen}`)
    Actions.push(`${componentKeyToOpen}`)
}

export const selectTab = (index) => (dispatch) => {
    dispatch({
        type: MEET_SELECT_TAB,
        payload: index,
    })
}

// Preload meet tab
// TODO: abstract this method to accomodate four types of requests
export const preloadMeet = () => (dispatch, getState) => {
    const { token } = getState().user
    // loadOneTab('suggested', 0, 20, token, dispatch);
    // tabs.map((key) => loadOneTab(key, 0, 20, token, dispatch, (data) => {
    //   dispatch({
    //     type: MEET_LOADING_DONE,
    //     payload: {
    //       type: key,
    //       data, // TODO: replace this with actual data
    //       skip: 0,
    //       limit: 20
    //     }
    //   });
    // }));
}

/**
 * Load friends based on previous result
 * @param {array} lastRes
 * @param {string} limit
 * @param {func} callback
 */
export const loadFriends = (lastRes, limit, callback) => (
    dispatch,
    getState
) => {
    const { token } = getState().user

    loadOneTab(
        'friends',
        lastRes ? lastRes.length : 0,
        limit,
        token,
        dispatch,
        (data) => {
            // Invoke callback to pass data and hasNextPage back
            Logger.log(
                `${DEBUG_KEY}: [loadFriends] success with length:`,
                data.length,
                2
            )
            callback(data, data.length > 0)
        },
        (err) => {
            // Invoke callback to pass data and hasNextPage back
            console.warn(`${DEBUG_KEY}: [loadFriends] failed with err:`, err)
            callback([], false)
        }
    )
}

const decorateRouteWithForceRefresh = (route) => route + '&refresh=true'

/*
@param type (string): current tab key
@param skip (number): number to skip for data
@param limit (number): number of cards to fetch
@param token:
@param dispatch:
@param callback:
*/
const loadOneTab = (
    type,
    skip,
    limit,
    token,
    dispatch,
    callback,
    onError,
    forceRefresh
) => {
    const route = _.get(requestMap, type)
    let url = `${BASE_ROUTE}${route}?limit=${limit}&skip=${skip}`
    if (forceRefresh) {
        url = decorateRouteWithForceRefresh(url)
    }

    API.get(url, token)
        .then((res) => {
            console.log(
                `loading type: ${type} with res length: `,
                res.data ? res.data.length : 0
            )

            // TODO: update failure condition
            if (res.data) {
                if (callback) {
                    return callback(res.data)
                }
            }

            // fetch data failure
            dispatch({
                type: MEET_LOADING_DONE,
                payload: {
                    type,
                    data: [],
                },
            })
            if (onError) {
                onError(res)
            }
        })
        .catch((err) => {
            console.log(
                `fetching friendship for type: ${type}, fails with error: ${err}`
            )
            dispatch({
                type: MEET_LOADING_DONE,
                payload: {
                    type,
                    data: [],
                },
            })
            if (onError) {
                onError(err)
            }
        })

    // const url = `https://goalmogul-api-dev.herokuapp.com/api/secure/user/${route}?limit=${limit}&skip=${skip}`;
    // // const url = 'http://192.168.0.3:8081/api/secure/user/friendship?limit=100&skip=0';
    // const headers = {
    //   method: 'GET',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     'x-access-token': token
    //   }
    // };
    // fetchData(url, headers, null)
    //   .then((res) => {
    //     console.log(`loading type: ${type} with res: `, res);
    //
    //     // TODO: update failure condition
    //     if (res.data) {
    //       if (callback) {
    //         return callback(res.data);
    //       }
    //     }
    //
    //     // fetch data failure
    //     dispatch({
    //       type: MEET_LOADING_DONE,
    //       payload: {
    //         type,
    //         data: []
    //       }
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(`fetching friendship for type: ${type}, fails with error: ${err}`);
    //     dispatch({
    //       type: MEET_LOADING_DONE,
    //       payload: {
    //         type,
    //         data: []
    //       }
    //     });
    //   });
}

const loadOneTabOnBoarding = (
    type,
    skip,
    limit,
    token,
    dispatch,
    callback,
    onError,
    forceRefresh
) => {
    const route = _.get(requestMap, type)

    let url = `${BASE_ROUTE}${route}`
    if (forceRefresh) {
        url = decorateRouteWithForceRefresh(url)
    }

    API.get(url, token)
        .then((res) => {
            console.log(
                `loading type: ${type} with res length: `,
                res.data ? res.data.length : 0
            )

            // TODO: update failure condition
            if (res.data) {
                if (callback) {
                    return callback(res.data)
                }
            }

            // fetch data failure
            dispatch({
                type: MEET_LOADING_DONE,
                payload: {
                    type,
                    data: [],
                },
            })
            if (onError) {
                onError(res)
            }
        })
        .catch((err) => {
            console.log(
                `fetching friendship for type: ${type}, fails with error: ${err}`
            )
            dispatch({
                type: MEET_LOADING_DONE,
                payload: {
                    type,
                    data: [],
                },
            })
            if (onError) {
                onError(err)
            }
        })
}

/**
 * Refresh current tab based on selected id
 * @param {String} key type of the meet to refresh for. See requestMap for defined routes.
 * @param {Boolean} forceRefresh boolean indicator if this is a force refresh. This is used for recommendation force refresh
 */
export const handleRefresh = (key, forceRefresh) => (dispatch, getState) => {
    const { token } = getState().user
    const { limit } = _.get(getState().meet, key)
    dispatch({
        type: MEET_TAB_REFRESH,
        payload: {
            type: key,
        },
    })

    const onError = (err) => {
        dispatch({
            type: MEET_TAB_REFRESH_DONE,
            payload: {
                type: key,
                data: [],
                skip: 0,
                limit: 20,
                hasNextPage: undefined,
            },
        })
    }

    loadOneTab(
        key,
        0,
        limit,
        token,
        dispatch,
        (data) => {
            dispatch({
                type: MEET_TAB_REFRESH_DONE,
                payload: {
                    type: key,
                    data,
                    skip: data.length,
                    limit: 20,
                    hasNextPage: !(data === undefined || data.length === 0),
                },
            })
        },
        onError,
        forceRefresh
    )
}

export const handleRefreshOnBoarding = (key, forceRefresh) => (
    dispatch,
    getState
) => {
    const { token } = getState().user
    const { limit } = _.get(getState().meet, key)
    dispatch({
        type: MEET_TAB_ONBOARDING_REFRESH,
        payload: {
            type: key,
        },
    })

    const onError = (err) => {
        dispatch({
            type: MEET_TAB_ONBOARDING_REFRESH_DONE,
            payload: {
                type: key,
                data: [],
                skip: 0,
                limit: 20,
                hasNextPage: undefined,
            },
        })
    }

    loadOneTabOnBoarding(
        key,
        0,
        limit,
        token,
        dispatch,
        (data) => {
            dispatch({
                type: MEET_TAB_ONBOARDING_REFRESH_DONE,
                payload: {
                    type: key,
                    data,
                    skip: data.length,
                    limit: 20,
                    hasNextPage: !(data === undefined || data.length === 0),
                },
            })
        },
        onError,
        forceRefresh
    )
}

export const meetOnLoadMoreOnboarding = (key) => (dispatch, getState) => {
    // TODO: dispatch onLoadMore start
    console.log(`${DEBUG_KEY} Loading more for ${key}`)
    const tabState = _.get(getState().meet, key)
    const { skip, limit, hasNextPage, refreshing } = tabState
    if (hasNextPage || hasNextPage === undefined) {
        const { token } = getState().user
        loadOneTabOnBoarding(key, skip, limit, token, dispatch, (data) => {
            const newSkip = data.length === 0 ? skip : skip + data.length
            dispatch({
                type: MEET_LOADING_DONE,
                payload: {
                    type: key,
                    data,
                    skip: newSkip,
                    limit,
                    hasNextPage: !(data === undefined || data.length === 0),
                },
            })
        })
    }
}

// Load more data
export const meetOnLoadMore = (key) => (dispatch, getState) => {
    // TODO: dispatch onLoadMore start
    console.log(`${DEBUG_KEY} Loading more for ${key}`)
    const tabState = _.get(getState().meet, key)
    const { skip, limit, hasNextPage, refreshing } = tabState
    if (hasNextPage || hasNextPage === undefined) {
        const { token } = getState().user
        loadOneTab(key, skip, limit, token, dispatch, (data) => {
            const newSkip = data.length === 0 ? skip : skip + data.length
            dispatch({
                type: MEET_LOADING_DONE,
                payload: {
                    type: key,
                    data,
                    skip: newSkip,
                    limit,
                    hasNextPage: !(data === undefined || data.length === 0),
                },
            })
        })
    }

    // TODO: dispatch no new data
}

/**
  Update friendship between two users
  1. requestFriend
  2. acceptFriend
  3. deleteFriend
*/
export const updateFriendship = (userId, friendshipId, type, tab, callback) => (
    dispatch,
    getState
) => {
    // TODO: update type to MEET_UPDATE_FRIENDSHIP
    dispatch({
        type: MEET_UPDATE_FRIENDSHIP,
    })

    const baseUrl = 'secure/user/friendship'

    const requestType = ((request) => {
        switch (request) {
            case 'requestFriend':
                return {
                    type: 'POST',
                    data: {
                        userId,
                    },
                    url: baseUrl,
                }
            case 'addAsFriend': {
                // console.log('\nupdate friendship is called for addAsFriend')
                return {
                    type: 'PUT',
                    data: {
                        friendshipId,
                        closenessWithFriend: 'Friends',
                    },
                    url: baseUrl,
                }
            }
            case 'acceptFriend':
                return {
                    type: 'PUT',
                    data: {
                        friendshipId,
                        acceptFriendshipRequest: true,
                    },
                    url: baseUrl,
                }
            case 'addAsCloseFriend': {
                // console.log('\nupdate friendship is called for addAsCloseFriend')
                return {
                    type: 'PUT',
                    data: {
                        friendshipId,
                        closenessWithFriend: 'CloseFriends',
                    },
                    url: baseUrl,
                }
            }
            case 'deleteFriend':
                return {
                    type: 'DELETE',
                    data: {
                        friendshipId,
                    },
                    url: `${baseUrl}?friendshipId=${friendshipId}`,
                }
            default:
                return 'POST'
        }
    })(type)

    const { token } = getState().user
    if (type === 'requestFriend' && requestType.data === undefined) {
        console.warn(
            '[ Meet Actions ] sending friend request with userId: ',
            userId
        )
    }

    singleFetch(
        requestType.url,
        _.cloneDeep(requestType.data),
        requestType.type,
        token
    )
        .then((res) => {
            console.log(`${DEBUG_KEY}: response for ${type}: `, res)

            console.log('RESSSSS', res)

            if (
                res.status !== 200 ||
                (res.message &&
                    !res.message.toLowerCase().trim().includes('success'))
            ) {
                console.log(
                    `${DEBUG_KEY}: update friendship failed for request type: with res: `,
                    res
                )
                // TODO: error handling
                return
            }

            if (callback !== null && callback !== undefined) {
                console.log(`${DEBUG_KEY} calling callback`)
                callback()
            }

            dispatch({
                type: MEET_UPDATE_FRIENDSHIP_DONE,
                payload: {
                    type,
                    tab,
                    data: {
                        friendshipId,
                        userId,
                        data: res.data,
                    },
                },
            })
        })
        .catch((err) => {
            console.log(`update friendship ${type} fails: `, err)
            // dispatch({
            //   type: MEET_LOADING_DONE,
            //   payload: {
            //     type,
            //     tab,
            //     data: id
            //   }
            // });
            //TODO: show toaster for updating failure
            dispatch({
                type: MEET_UPDATE_FRIENDSHIP_DONE,
                payload: {
                    type,
                    tab,
                    data: {
                        friendshipId,
                        userId,
                    },
                    message: 'updating friendship fails',
                },
            })
        })
}

// Update meet tabs filter criteria
export const meetChangeFilter = (tab, type, value) => (dispatch) => {
    dispatch({
        type: MEET_CHANGE_FILTER,
        payload: {
            tab,
            type,
            value,
        },
    })
}

// Requesets tab actions
export const requestsSelectTab = (key) => (dispatch) => {
    dispatch({
        type: MEET_REQUESTS_CHANGE_TAB,
        payload: {
            key,
        },
    })
}

// Contact sync
export const meetContactSync = (callback, componentKey) => async (
    dispatch,
    getState
) => {
    const permission = await Contacts.requestPermissionsAsync()
    if (permission.status !== 'granted') {
        // Permission was denied and dispatch an action
        alert('Please grant access to sync contact')
        return
    }
    const { token } = getState().user
    // Skip and limit for fetching matched contacts
    const { matchedContacts } = getState().meet
    const { limit, data } = matchedContacts

    dispatch({
        type: MEET_CONTACT_SYNC,
        payload: {
            uploading: true,
        },
    })

    const componentKeyToUse = componentKey ? componentKey : 'meetContactSync'
    Actions.push(`${componentKeyToUse}`, {
        type: 'meet',
        actionCallback: callback,
    })

    const loadContactCallback = (contacts) => {
        dispatch({
            type: CONTACT_SYNC_LOAD_CONTACT_DONE,
            payload: {
                data: contacts,
            },
        })
    }

    handleUploadContacts(token, loadContactCallback)
        .then((res) => {
            console.log(
                `${DEBUG_KEY}: response for uploading contacts is: `,
                res
            )

            // Finished uploading. Set uploading to false and refresh to true
            dispatch({
                type: MEET_CONTACT_SYNC,
                payload: {
                    uploading: false,
                    refresh: true,
                },
            })
            /* TODO: load matched contacts */
            return fetchMatchedContacts(token, 0, limit)
        })
        .then((res) => {
            // console.log(`${DEBUG_KEY}: [ meetContactSync ]: [ fetchMatchedContacts ]: res is:`, res);
            console.log(
                `${DEBUG_KEY}: [ meetContactSync ]: [ fetchMatchedContacts ]: matched ` +
                    `contacts with res data length`,
                res && res.data ? res.data.length : 0
            )
            const { data } = res
            if (data) {
                // User finish fetching
                return dispatch({
                    type: MEET_CONTACT_SYNC_FETCH_DONE,
                    payload: {
                        data: data, // TODO: replaced with res
                        skip: data.length,
                        hasNextPage: data.length && data.length === limit,
                        refresh: true,
                    },
                })
            }
            // TODO: error handling for fail to fetch contact cards
            // TODO: show toast for user to refresh
            console.warn('[ Action ContactSync ]: failed with res', res)
            dispatch({
                type: MEET_CONTACT_SYNC_FETCH_DONE,
                payload: {
                    data: [], // TODO: replaced with res
                    skip: 0,
                    limit,
                    hasNextPage: false,
                    refresh: true,
                },
            })
        })
        .catch((err) => {
            console.warn('[ Action ContactSync Fail ]: ', err)
            // Error to reset uploading overlay
            dispatch({
                type: MEET_CONTACT_SYNC,
                payload: {
                    uploading: false,
                    refresh: true,
                },
            })

            // Error to reset refresh result
            dispatch({
                type: MEET_CONTACT_SYNC_FETCH_DONE,
                payload: {
                    data: [], // TODO: replaced with res
                    skip: 0,
                    limit,
                    hasNextPage: false,
                    refresh: true,
                },
            })

            DropDownHolder.alert(
                'error',
                'Error',
                "We're sorry that some error happened. Please try again later."
            )
        })
}

/**
 * Load remote matches from async storage on log in
 */
export const loadRemoteMatches = (userId) => async (dispatch, getState) => {
    const matchedContactsKey = `${REMOTE_MATCHES_KEY}_${userId}`

    // Disabled for now
    // const matchedContacts = await SecureStore.getItemAsync(matchedContactsKey, {});

    // // Deserialize the json serialized object
    // const parsedMatchedContacts = JSON.parse(matchedContacts);
    // Logger.log(`${DEBUG_KEY}: [loadRemoteMatches] pased json with res:`, parsedMatchedContacts ? parsedMatchedContacts.length : 0, 2);

    // if (!parsedMatchedContacts || _.isEmpty(parsedMatchedContacts)) {
    //   Logger.log(`${DEBUG_KEY}: [loadRemoteMatches] abort as empty:`, parsedMatchedContacts, 1);
    //   return;
    // }

    // dispatch({
    //   type: MEET_CONTACT_SYNC_LOAD_REMOTE_MATCH,
    //   payload: {
    //       data: parsedMatchedContacts
    //   }
    // });
    // return;
}

/**
 * Save remote matches on closing app / log out
 */
const REMOTE_MATCHES_KEY = 'remove_matches'
export const saveRemoteMatches = () => async (dispatch, getState) => {
    const { userId } = getState().user
    let matchedContactsToSave = _.cloneDeep(
        getState().meet.matchedContacts.data
    )

    // Disabled for now
    // Construct key
    // const matchedContactsKey = `${REMOTE_MATCHES_KEY}_${userId}`;
    // Logger.log(`${DEBUG_KEY}: [saveRemoteMatches] matchedContactsToSave to store is:`, matchedContactsToSave, 3);

    // const dataToStore = JSON.stringify(matchedContactsToSave);
    // Logger.log(`${DEBUG_KEY}: [saveRemoteMatches] data to store is:`, dataToStore, 2);
    // const res = await SecureStore.setItemAsync(
    //   matchedContactsKey, dataToStore, {}
    // );
    // Logger.log(`${DEBUG_KEY}: [saveRemoteMatches] done with res: `, res, 1);
    // return;
}

// Load more matched contacts for contact sync
export const meetContactSyncLoadMore = (refresh) => (dispatch, getState) => {
    dispatch({
        type: MEET_CONTACT_SYNC,
        payload: {
            refresh,
        },
    })

    const { token } = getState().user
    // Skip and limit for fetching matched contacts
    const { skip, limit, hasNextPage } = getState().registration.matchedContacts
    const newSkip = refresh ? 0 : skip
    const type = refresh
        ? MEET_CONTACT_SYNC_REFRESH_DONE
        : MEET_CONTACT_SYNC_FETCH_DONE

    if (hasNextPage === undefined || hasNextPage) {
        // newSkip and limit is not needed since it will fetch all at once
        fetchMatchedContacts(token, newSkip, limit)
            .then((res) => {
                if (res.data) {
                    dispatch({
                        type,
                        payload: {
                            data: res.data, // TODO: replaced with res
                            skip: newSkip + res.data.length,
                            limit,
                            hasNextPage:
                                res.data !== undefined && res.data.length !== 0,
                            refresh,
                        },
                    })
                } else {
                    dispatch({
                        type,
                        payload: {
                            data: [], // TODO: replaced with res
                            skip: newSkip,
                            limit,
                            hasNextPage:
                                res.data !== undefined && res.data.length !== 0,
                            refresh,
                        },
                    })
                }
            })
            .catch((err) => {
                console.warn('[ Action ContactSync Loadmore Fail ]: ', err)
            })
    }
}

/* Contact Sync actions */
export const meetContactSyncDone = () => {
    // Passed in a list of contacts that user wants to add as friends

    return (dispatch) => {
        // dispatch({
        //   type: MEET_CONTACT_SYNC_DONE
        // });
        Actions.mainTabs()
    }
}
