/** @format */

import { getFollowStatus } from '../reducers/FollowReducers'
import { api as API } from '../redux/middleware/api'

export const shouldFollowUser = (userId) => {
    return async (dispatch) => {
        let res
        try {
            res = await API.post(`secure/user/follower`, {
                userId: userId,
                isFollowing: true,
            })
            if (res.status == 200) {
                dispatch(getFollowStatus(res.data.isFollowing))
            }

            console.log('\n Response from follow API to check follow', res)
        } catch (err) {
            console.log('\n This is the error while follow data: ', err)
        }
    }
}

export const getFollowedStatus = (visitedId) => {
    return async (dispatch) => {
        try {
            let res
            res = await API.get(`secure/user/follower?followeeId=${visitedId}`)
            if (res.status == 200) {
                dispatch(getFollowStatus(res.isFollowing))
            }

            console.log(
                '\n Response from getting follow API to check follow',
                res
            )
        } catch (err) {
            console.log(
                ` This is the error of getting follow status`,
                err.message
            )
        }
    }
}

export const shouldUnfollowUser = (userId) => {
    return async (dispatch) => {
        let res
        try {
            res = await API.put(`secure/user/follower`, {
                userId: userId,
                isFollowing: false,
            })

            if (res.status == 200) {
                dispatch(getFollowStatus(res.data.isFollowing))
            }

            console.log('\n Response from unfollow user', res)
        } catch (err) {
            console.log('\n This is the error while unfollow user: ', err)
        }
    }
}
