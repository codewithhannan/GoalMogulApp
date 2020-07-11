/** 
 * This is the object selector for user object.
 */

import { createSelector } from 'reselect';
import _ from 'lodash';

const getReducer = (state, chatRoomId, path) => _.get(state, path);
const getChatRoomId = (state, chatRoomId, path) => chatRoomId;

export const makeGetChatRoom = () => {
    return createSelector(
        [getReducer, getChatRoomId],
        (data, chatRoomId) => data.find(chatRoom => chatRoom._id === chatRoomId)
    );
};
