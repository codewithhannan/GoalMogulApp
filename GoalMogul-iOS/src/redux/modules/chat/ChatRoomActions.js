import { CHAT_ROOM_SWITCH_TAB } from "./ChatRoomReducers";

export const selectChatTab = (index) => (dispatch) => {
	dispatch({
		type: CHAT_ROOM_SWITCH_TAB,
		payload: {
			index
		}
	});
};

