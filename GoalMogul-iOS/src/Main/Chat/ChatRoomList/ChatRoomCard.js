import React from 'react';
import {
	View,
	Text,
	TouchableOpacity
} from 'react-native';
import timeago from 'timeago.js';
import { connect } from 'react-redux';

// Components
import ProfileImage from '../../Common/ProfileImage';
import Timestamp from '../../Goal/Common/Timestamp';

import profilePic from '../../../asset/utils/defaultUserProfile.png';
import { GROUP_CHAT_DEFAULT_ICON_URL } from '../../../Utils/Constants';

class ChatRoomCard extends React.Component {
	handleCardOnPress = (item) => {
		this.props.onItemSelect(item);
	}

	renderCardImage(imageUrl) {
		if (!imageUrl) {
			return null;
		}
		return (
			<ProfileImage
				imageStyle={{ height: 55, width: 55, borderRadius: 5 }}
				imageUrl={imageUrl}
				rounded
				imageContainerStyle={styles.imageContainerStyle}
			/>
		);
	}

	renderTitle(item) {
		let title = item.name;
		if (!title && item.isChatRoom) {
			title = item.roomType == 'Direct' ?
				item.members.find(memDoc => memDoc.memberRef._id.toString() != this.props.currentUserId)
				: item.name;
			title = typeof title == "object" ? title.memberRef.name : title;
		};
		const lastUpdated = item.lastActive || new Date();

		return (
			<View style={{ flexDirection: 'row', marginTop: 2, alignItems: 'center' }}>
				<Text
					style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 18, fontWeight: '600' }}
					numberOfLines={1}
					ellipsizeMode='tail'
				>
					{title}
				</Text>
				{item.isChatRoom &&
					<View>
						<Timestamp time={timeago().format(lastUpdated)} />
					</View>
				}
			</View>
		);
	}

	/**
	 * Render category and member information
	 */
	renderChatInformation(item) {
		if (!item.isChatRoom) {
			return null;
		};
		let count = item.memberCount;
		if (count > 999) {
			count = '1k+'
		}
		const defaultTextStyle = { color: '#abb1b0', fontSize: 10 };

		return (
			<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
				{/*<Text style={defaultTextStyle}>{category}</Text>
				<Dot />*/}
				{(count && item.roomType == 'Group') ? 
					<Text style={defaultTextStyle}>
						<Text style={{ color: '#15aad6' }}>
							{count}
						</Text>
						&nbsp;members
					</Text>
				: null}
			</View>
		);
	}

	renderCardContent(item) {
		const content = item.isFriend ? 'Tap to start a conversation...' : (
			item.latestMessage && item.latestMessage.content.message ? item.latestMessage.content.message : 'No messages in this conversation...'
		);
		// TODO(Jay): automatically populate latest message from local async storage

		return (
			<View style={{ justifyContent: 'flex-start', flex: 1, marginLeft: 10 }}>
				{this.renderTitle(item)}
				<View style={{ marginTop: (item.roomType == 'Group' && item.memberCount ? 3 : 6) }}>
					<Text
						style={{ flex: 1, flexWrap: 'wrap', color: '#838f97', fontSize: 15 }}
						numberOfLines={1}
						ellipsizeMode='tail'
					>
						{content}
					</Text>
				</View>
				{this.renderChatInformation(item)}
			</View>
		);
	}

	render() {
		const { item } = this.props;
		if (!item) return null;

		// extract profile
		let cardImage;
		if (item.isFriend || item.roomType == 'Direct') {
			cardImage = item.isFriend ?
				item :
				item.members && item.members.find(memDoc => memDoc.memberRef._id.toString() != this.props.currentUserId);
			if (cardImage) {
				cardImage = cardImage.profile || cardImage.memberRef.profile;
			};
			cardImage = (cardImage && cardImage.image) || profilePic;
		} else {
			cardImage = (item && item.picture) || GROUP_CHAT_DEFAULT_ICON_URL;

		};

		const maybeUnreadHighlight = item.unreadMessageCount > 0 ? {
			backgroundColor: '#E0F0FF',
		} : { };

		return (
			<TouchableOpacity activeOpacity={0.85}
				style={{...styles.cardContainerStyle, ...maybeUnreadHighlight }}
				onPress={() => this.handleCardOnPress(item)}
			>
				{this.renderCardImage(cardImage)}
				{this.renderCardContent(item)}
			</TouchableOpacity>
		);
	}
}

const styles = {
	cardContainerStyle: {
		backgroundColor: 'white',
		flexDirection: 'row',
		paddingTop: 8,
		paddingBottom: 8,
		paddingLeft: 12,
		paddingRight: 12,
		marginTop: 1
	},
	imageContainerStyle: {
		borderWidth: 0.5,
		padding: 1.5,
		borderColor: 'lightgray',
		alignItems: 'center',
		borderRadius: 6,
		alignSelf: 'center',
		backgroundColor: 'white'
	},
};

export default connect(
	(state) => ({
		currentUserId: state.user.userId,
	}),
	null
)(ChatRoomCard);
