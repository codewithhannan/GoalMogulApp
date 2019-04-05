import { Alert } from 'react-native';
import { api as API } from "../../middleware/api";
import { fetchUserProfile } from '../../../actions';

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
}