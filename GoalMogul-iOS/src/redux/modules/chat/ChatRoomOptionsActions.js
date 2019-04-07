import { Alert } from 'react-native';
import { api as API } from "../../middleware/api";
import { fetchUserProfile } from '../../../actions';
import { refreshChatRoom } from './ChatRoomActions';

const DEBUG_KEY = '[ChatRoomOptionsActions]';

export const changeChatRoomMute = (chatRoomId, isMutedTargetState) => (dispatch, getState) => {
    const { token, userId } = getState().user;
    if (isMutedTargetState) { // if we want to mute
        API.put('secure/user/settings/muted-chatrooms', {
            chatRoomRef: chatRoomId,
        }, token).then(resp => {
            if (resp.status == 200) {
                fetchUserProfile(userId)(dispatch, getState);
            } else {
                Alert.alert('Error', 'Could not mute this chat room. Please try again later');
                console.log(`${DEBUG_KEY} error muting chat room`, resp.message);
            };
        }).catch(err => {
            Alert.alert('Error', 'Could not mute this chat room. Please try again later');
            console.log(`${DEBUG_KEY} error muting chat room`, err);
        });
    } else { // if we want to unmute
        API.delete(`secure/user/settings/muted-chatrooms?chatRoomRef=${chatRoomId}`, {}, token).then(resp => {
            if (resp.status == 200) {
                fetchUserProfile(userId)(dispatch, getState);
            } else {
                Alert.alert('Error', 'Could not unmute this chat room. Please try again later');
                console.log(`${DEBUG_KEY} error unmuting chat room`, resp.message);
            };
        }).catch(err => {
            Alert.alert('Error', 'Could not unmute this chat room. Please try again later');
            console.log(`${DEBUG_KEY} error unmuting chat room`, err);
        });
    };
};

export const addMemberToChatRoom = (chatRoomId, addeeId) => (dispatch, getState) => {
    const { token } = getState().user;
    API.post('secure/chat/room/members', {
        chatRoomId, addeeId,
    }, token).then(resp => {
        if (resp.status == 200) {
            refreshChatRoom(chatRoomId)(dispatch, getState);
        } else {
            Alert.alert('Error', 'Could not add selected member. Please try again later');
            console.log(`${DEBUG_KEY} error adding member to chat room`, resp.message);
        };
    }).catch(err => {
        Alert.alert('Error', 'Could not add selected member. Please try again later');
        console.log(`${DEBUG_KEY} error adding member to chat room`, err);
    });
};