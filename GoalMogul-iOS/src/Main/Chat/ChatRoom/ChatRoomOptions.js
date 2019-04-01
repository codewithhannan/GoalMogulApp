/*
    On load we need to:
    - subscribe to messages service for new message info
    - connect to live chat service for typing indicator
    - fetch the full chat document with members populated
*/
import React from 'react';
import {
	View,
    Clipboard,
} from 'react-native';
import { connect } from 'react-redux';


// Actions
import {
    
} from '../../../redux/modules/chat/ChatRoomActions';
import ModalHeader from '../../Common/Header/ModalHeader';

import { Actions } from 'react-native-router-flux';
import ProfileImage from '../../Common/ProfileImage';
import { openProfile, openCamera, openCameraRoll } from '../../../actions';
import { MenuProvider } from 'react-native-popup-menu';
import { APP_DEEP_BLUE } from '../../../styles';

const DEBUG_KEY = '[ UI ChatRoomOptions ]';
const LISTENER_KEY = 'ChatRoomOptions';
class ChatRoomOptions extends React.Component {

	_keyExtractor = (item) => item._id;

	componentDidMount() {
        //const {  } = this.props;
        
    }

    closeOptions() {
        Actions.pop();
    }
    openUserProfile(user) {
        const userId = user._id;
        this.props.openProfile(userId);
    }

	render() {
		return (
			<MenuProvider customStyles={{ backdrop: styles.backdrop }}>
				<View style={styles.homeContainerStyle}>
					<ModalHeader
                        title={this.props.chatRoomName}
                        actionHidden={true}
                        back={true}
                        onCancel={this.closeOptions}
                    />
                    
				</View>
			</MenuProvider>
		);
	}
}

const mapStateToProps = (state, props) => {
    const { userId } = state.user;
    const {
        initializing,
        chatRoomsMap, activeChatRoomId,
        messages, limit, skip, hasNextPage, loading,
        currentlyTypingUserIds, messageMediaRef,
    } = state.chatRoom;

	return {
        
	};
};

export default connect(
	mapStateToProps,
	{
        
	}
)(ChatRoomOptions);

const styles = {
	homeContainerStyle: {
		backgroundColor: '#f8f8f8',
		flex: 1
	},
	textStyle: {
		fontSize: 12,
		fontWeight: '600',
		color: '#696969',

	},
	onSelectTextStyle: {
		fontSize: 12,
		fontWeight: '600',
		color: 'white',
	},
	backdrop: {
		backgroundColor: 'gray',
		opacity: 0.5,
    },
    imageContainerStyle: {
        height: 60,
        width: 60,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#f4f4f4',
        padding: 2
    },

	// Styles for plus icon
	iconContainerStyle: {
		position: 'absolute',
		bottom: 20,
		right: 15,
		height: 54,
		width: 54,
		borderRadius: 27,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: APP_DEEP_BLUE,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.4,
		shadowRadius: 2,
	},
	iconStyle: {
		height: 26,
		width: 26,
		tintColor: 'white',
    },
    mediaContainerStyle: {
        flexDirection: 'row',
        height: 50,
        marginBottom: 8,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 1,
        elevation: 1
      },
      headingTextStyle: {
        fontSize: 10,
        flexWrap: 'wrap',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 3
      },
};