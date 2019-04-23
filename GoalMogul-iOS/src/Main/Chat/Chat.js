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
import { Alert } from 'react-native';

/* Components */
import TabButtonGroup from '../Common/TabButtonGroup';
import SearchBarHeader from '../Common/Header/SearchBarHeader';
import ChatRoomTab from './ChatRoomList/ChatRoomTab';

// Actions
import {
	selectChatTab,
	plusPressed,
	plusUnpressed,
	createOrGetDirectMessage,
	refreshUnreadCountForTabs,
} from '../../redux/modules/chat/ChatActions';

import plus_image from '../../asset/utils/plus.png';
import direct_message_image from '../../asset/utils/direct_message.png';
import profile_people_image from '../../asset/utils/profile_people.png';
import { APP_DEEP_BLUE, APP_BLUE_BRIGHT } from '../../styles';
import next from '../../asset/utils/next.png';

const UNREAD_BADGE_COUNT_REFRESH_INTERVAL_MS = 3000;

class ChatTab extends React.Component {
	componentDidMount() {
		// refresh badge count
		this._refreshUnreadBadgeCount();
		this.unreadBadgeRefreshInterval = setInterval(this._refreshUnreadBadgeCount, UNREAD_BADGE_COUNT_REFRESH_INTERVAL_MS);
	}
	componentWillUnmount() {
		clearInterval(this.unreadBadgeRefreshInterval);
	}

	_refreshUnreadBadgeCount = () => {
		this.props.refreshUnreadCountForTabs();
	}
	_renderHeader = props => {
		const tabNotificationMap = {
			'directMessages': {
				hasNotification: this.props.directMessagesUnread,
				style: {
					backgroundColor: '#fa5052',
					height: 8,
					width: 8,
					borderRadius: 4
				},
				selectedStyle: {
					backgroundColor: '#fff',
				},
				containerStyle: {
					marginLeft: 5
				},
				selectedContainerStyle: {

				},
			},
			'chatRooms': {
				hasNotification: this.props.chatRoomsUnread,
				style: {
					backgroundColor: '#fa5052',
					height: 8,
					width: 8,
					borderRadius: 4
				},
				selectedStyle: {
					backgroundColor: '#fff',
				},
				containerStyle: {
					marginLeft: 5
				},
				selectedContainerStyle: {

				},
			}
		};

		return (
			<TabButtonGroup 
				buttons={props} 
				noBorder
				buttonStyle={{
					selected: {
						backgroundColor: APP_DEEP_BLUE,
						tintColor: 'white',
						color: 'white',
						fontWeight: '700'
					},
					unselected: {
						backgroundColor: '#FCFCFC',
						tintColor: '#616161',
						color: '#616161',
						fontWeight: '600'
					}
				}}
				tabNotificationMap={tabNotificationMap}
			/>
		);
	};

	_renderScene = ({ route }) => {
		switch (route.key) {
			case 'directMessages': {
				return (
					<ChatRoomTab tabKey='directMessages' />
				);
			}

			case 'chatRooms': {
				return (
					<ChatRoomTab tabKey='chatRooms' />
				);
			}
			
			default: 
				return null;
		}
	}

	openCreateChatMenu() {
		this.props.plusPressed();
		Actions.push('createButtonOverlay', {
			onCancel: () => this.props.plusUnpressed(),
			onActionSelect: () => this.props.plusUnpressed(),
			buttons: [
				{
					name: 'createDirectMessage',
					iconStyle: { height: 18, width: 18, marginLeft: 3 },
					textStyle: { marginLeft: 5 },
					customContainerStyle: {
						width: 90,
					},
					iconSource: direct_message_image,
					text: 'Direct',
					onPress: () => {
						const searchFor = {
						  type: 'directChat',
						};
						const cardIconStyle = { tintColor: APP_BLUE_BRIGHT };
						const cardIconSource = next;
						const callback = (selectedUserId) => {
							this.props.createOrGetDirectMessage(selectedUserId);
						};
						Actions.push('searchPeopleLightBox', { searchFor, cardIconSource, cardIconStyle, callback });
					},
				},
				{
					name: 'createChatRoom',
					iconStyle: { height: 18, width: 18, marginLeft: 3 },
					textStyle: { marginLeft: 5 },
					customContainerStyle: {
						width: 90,
					},
					iconSource: profile_people_image,
					text: 'Group',
					onPress: () => {
						Actions.push('createChatRoomStack');
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
		return null;
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
	const { navigationState, showPlus, directMessages, chatRooms } = state.chat;

	return {
		navigationState,
		showPlus,
		directMessagesUnread: directMessages.unreadCount,
		chatRoomsUnread: chatRooms.unreadCount,
	};
};

const styles = {
	homeContainerStyle: {
		backgroundColor: '#f8f8f8',
		flex: 1,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
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
};

export default connect(
	mapStateToProps,
	{
		selectChatTab,
		plusPressed,
		plusUnpressed,
		createOrGetDirectMessage,
		refreshUnreadCountForTabs,
	}
)(ChatTab);