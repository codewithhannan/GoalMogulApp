import React from 'react';
import {
	View,
	TouchableOpacity,
	Image
} from 'react-native';
import { connect } from 'react-redux';
import { TabView, SceneMap } from 'react-native-tab-view';
import { MenuProvider } from 'react-native-popup-menu';
import { Actions } from 'react-native-router-flux';

/* Components */
import TabButtonGroup from '../Common/TabButtonGroup';
import SearchBarHeader from '../Common/Header/SearchBarHeader';
import ChatRoomTabBody from './ChatRoomList/ChatRoomTabBody';

// Actions
import {
	selectChatTab,
	plusPressed,
	plusUnpressed
} from '../../redux/modules/chat/ChatActions';

import plus_image from '../../asset/utils/plus.png';
import direct_message_image from '../../asset/utils/direct_message.png';
import profile_people_image from '../../asset/utils/profile_people.png';

class ChatTab extends React.Component {

	_renderHeader = props => {
		return (
			<TabButtonGroup buttons={props} />
		);
	};

	_renderScene = SceneMap({
		directMessages: ChatRoomTabBody,
		chatrooms: ChatRoomTabBody,
	});

	openCreateChatMenu() {
		this.props.plusPressed();
		Actions.createButtonOverlay({
			onCancel: () => this.props.plusUnpressed(),
			onActionSelect: () => this.props.plusUnpressed(),
			buttons: [
				{
					name: 'createDirectMessage',
					textStyle: {},
					iconStyle: {},
					iconSource: direct_message_image,
					text: 'Direct Message',
					onPress: () => {
						Actions.pop(); // remove the overlay from the stack
						Actions.createDirectMessageModal();
					},
				},
				{
					name: 'createChatroom',
					textStyle: {},
					iconStyle: {},
					iconSource: profile_people_image,
					text: 'Group Chatroom',
					onPress: () => {
						Actions.pop(); // remove the overlay from the stack
						Actions.createChatroomModal();
					},
				}
			],
		});
	}

	renderPlus() {
		if (this.props.showPlus) {
			return (
				<TouchableOpacity
					activeOpacity={0.85}
					style={styles.iconContainerStyle}
					onPress={this.openCreateChatMenu.bind(this)}
				>
					<Image style={styles.iconStyle} source={plus_image} />
				</TouchableOpacity>
			);
		};
		return '';
	}

	render() {
		return (
			<MenuProvider customStyles={{ backdrop: styles.backdrop }}>
				<View style={styles.homeContainerStyle}>
					<SearchBarHeader rightIcon='menu' />
					<TabView
						navigationState={this.props.navigationState}
						renderScene={this._renderScene}
						renderTabBar={this._renderHeader}
						onIndexChange={this.props.selectChatTab}
						useNativeDriver
					/>
					{this.renderPlus()}
				</View>
			</MenuProvider>
		);
	}
}

const mapStateToProps = state => {
	const { navigationState, showPlus } = state.chat;

	return {
		navigationState,
		showPlus,
	};
};

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
	}
};

export default connect(
	mapStateToProps,
	{
		selectChatTab,
		plusPressed,
		plusUnpressed
	}
)(ChatTab);
