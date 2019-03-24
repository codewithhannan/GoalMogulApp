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
import Dot from '../../Common/Dot';

class ChatRoomCard extends React.Component {
	handleCardOnPress = () => {
		
	}

	renderProfileImage(item) {
		// TODO: change to the real path
		const imageUrl = item && item.image ? item.image : undefined;

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
			title = item.members.find(memDoc => memDoc.memberRef._id.toString() != this.props.currentUser._id.toString());
			title = title && title.memberRef.name;
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
		let count = item.members.length;
		if (count > 999) {
			count = '1k+'
		}
		const defaultTextStyle = { color: '#abb1b0', fontSize: 10 };

		return (
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				{/*<Text style={defaultTextStyle}>{category}</Text>
				<Dot />*/}
				<Text style={defaultTextStyle}>
					<Text style={{ color: '#15aad6' }}>
						{count}
					</Text>
					Members
				</Text>
			</View>
		);
	}

	renderCardContent(item) {
		const content = item.isFriend ? 'Tap to start a conversation...' : 'Latest message will appear here';
		// TODO(Jay): automatically populate latest message from local async storage

		return (
			<View style={{ justifyContent: 'flex-start', flex: 1, marginLeft: 10 }}>
				{this.renderTitle(item)}
				<View style={{ marginTop: 3 }}>
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

		// extract user profile
		let userProfile = item.isFriend ?
			item :
			item.members.find(memDoc => memDoc.memberRef._id.toString() != this.props.currentUser._id.toString());
		if (userProfile) {
			userProfile = userProfile.profile || userProfile.memberRef.profile;
		};

		return (
			<TouchableOpacity activeOpacity={0.85}
				style={styles.cardContainerStyle}
				onPress={this.handleCardOnPress}
			>
				{this.renderProfileImage(userProfile)}
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
		currentUser: state.user
	}),
	null
)(ChatRoomCard);
