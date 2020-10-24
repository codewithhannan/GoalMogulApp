/**
 * This is the object selector for user object.
 *
 * @format
 */

import { createSelector } from 'reselect'
import _ from 'lodash'

const getReducer = (state, chatRoomId, path) => _.get(state, path)
const getChatRoomId = (state, chatRoomId, path) => chatRoomId

export const makeGetChatRoom = () => {
    return createSelector([getReducer, getChatRoomId], (data, chatRoomId) =>
        data.find((chatRoom) => chatRoom._id === chatRoomId)
    )
}

const getSharedEntity = (state, props, pageId) => {
    const { userRef, goalRef, tribeRef } = props
    const { goals, users, tribes } = state

    if (userRef) {
        return _.cloneDeep(_.get(users, `${userRef}.user`, undefined))
    }

    if (goalRef) {
        const loading = _.cloneDeep(
            _.get(goals, `${goalRef}.${pageId}.loading`)
        )
        return { ..._.cloneDeep(_.get(goals, `${goalRef}.goal`)), loading }
    }

    if (tribeRef) {
        return _.cloneDeep(_.get(tribes, `${tribeRef}.tribe`, undefined))
    }
    return undefined
}

/**
 * Get shared entity from ref
 * @returns undefined if none of the entity is found in the redux. Otherwise the first available entity
 */
export const getChatroomSharedEntity = createSelector(
    [getSharedEntity],
    (entity) => {
        return entity
    }
)
