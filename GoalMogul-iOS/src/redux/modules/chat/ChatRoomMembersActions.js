import { CHAT_MEMBERS_SWITCH_TAB, CHAT_MEMBERS_RESET_STATE, CHAT_MEMBERS_REFRESH_COMPLETE, CHAT_MEMBERS_REFRESH_BEGIN } from "./ChatRoomMembersReducers";
import { refreshChatRoom } from "./ChatRoomActions";
import { Alert } from 'react-native';
import { api as API } from '../../middleware/api';


const DEBUG_KEY = '[ UI ChatRoomMembersActions ]';

export const resetChatMembersTab = () => (dispatch) => {
    dispatch({
        type: CHAT_MEMBERS_RESET_STATE,
        payload: {},
    });
};

export const selectChatMembersTab = (index) => (dispatch) => {
	dispatch({
		type: CHAT_MEMBERS_SWITCH_TAB,
		payload: {
			index
		}
	});
};

export const refreshChatMembersTab = (currentChatRoomId) => (dispatch, getState) => {
    dispatch({
        type: CHAT_MEMBERS_REFRESH_BEGIN,
        payload: {},
    });
    const callback = (err, updatedChatRoom) => {
        /** We don't handle the error at the moment since the {@link refreshChatRoom} method already displays an alert. */
        // if (err) {
        //     Alert.alert('Error', 'Could not refresh members list.');
        // };
        dispatch({
            type: CHAT_MEMBERS_REFRESH_COMPLETE,
            payload: {},
        });
    };
    refreshChatRoom(currentChatRoomId, callback)(dispatch, getState);
};

export const promoteChatMember = (memberId, chatRoomId) => (dispatch, getState) => {
    const { token } = getState().user;
    API.post('secure/chat/room/members/admin', {
        chatRoomId,
        promoteeId: memberId,
    }, token).then(resp => {
        if (resp.status != 200) {
            Alert.alert('Error', 'Could not promote member. Please try again later.');
            console.log(`${ChatRoomMembersActions} error promoting member`, res.message);
        } else {
            refreshChatMembersTab(chatRoomId)(dispatch, getState);
        };
    }).catch(err => {
        Alert.alert('Error', 'Could not promote member. Please try again later.');
        console.log(`${ChatRoomMembersActions} error promoting member`, err);
    });
}
export const demoteChatMember = (memberId, chatRoomId) => (dispatch, getState) => {
    const { token } = getState().user;
    API.delete(`secure/chat/room/members/admin?chatRoomId=${chatRoomId}&demoteeId=${memberId}` , {}, token).then(resp => {
        if (resp.status != 200) {
            Alert.alert('Error', 'Could not demote member. Please try again later.');
            console.log(`${ChatRoomMembersActions} error demoting member`, res.message);
        } else {
            refreshChatMembersTab(chatRoomId)(dispatch, getState);
        };
    }).catch(err => {
        Alert.alert('Error', 'Could not demote member. Please try again later.');
        console.log(`${ChatRoomMembersActions} error demoting member`, err);
    });
}
export const acceptChatMemberJoinRequest = (memberId, chatRoomId) => (dispatch, getState) => {
    const { token } = getState().user;
    API.post('secure/chat/room/members/request/accept', {
        chatRoomId,
        requesterId: memberId,
    }, token).then(resp => {
        if (resp.status != 200) {
            Alert.alert('Error', 'Could not accept request. Please try again later.');
            console.log(`${ChatRoomMembersActions} error accepting member request`, res.message);
        } else {
            refreshChatMembersTab(chatRoomId)(dispatch, getState);
        };
    }).catch(err => {
        Alert.alert('Error', 'Could not accept request. Please try again later.');
        console.log(`${ChatRoomMembersActions} error accepting member request`, err);
    });
}
export const removeChatMember = (memberId, chatRoomId) => (dispatch, getState) => {
    const { token } = getState().user;
    API.delete(`secure/chat/room/members?chatRoomId=${chatRoomId}&removeeId=${memberId}` , {}, token).then(resp => {
        if (resp.status != 200) {
            Alert.alert('Error', 'Could not remove member. Please try again later.');
            console.log(`${ChatRoomMembersActions} error removing member`, res.message);
        } else {
            refreshChatMembersTab(chatRoomId)(dispatch, getState);
        };
    }).catch(err => {
        Alert.alert('Error', 'Could not remove member. Please try again later.');
        console.log(`${ChatRoomMembersActions} error removing member`, err);
    });
}