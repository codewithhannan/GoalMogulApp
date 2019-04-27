/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from 'prop-types';
import React from 'react';
import { Animated, Text, Clipboard, StyleSheet, TouchableOpacity, View, ViewPropTypes } from 'react-native';

import { MessageText, MessageVideo } from 'react-native-gifted-chat';
import ChatMessageImage from '../Modals/ChatMessageImage';
import moment from 'moment';

function isSameDay(currentMessage = {}, diffMessage = {}) {
	if (!diffMessage.createdAt) {
		return false;
	}

	const currentCreatedAt = moment(currentMessage.createdAt);
	const diffCreatedAt = moment(diffMessage.createdAt);

	if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid()) {
		return false;
	}

	return currentCreatedAt.isSame(diffCreatedAt, 'day');
}

function isSameUser(currentMessage = {}, diffMessage = {}) {
	return !!(diffMessage.user && currentMessage.user && diffMessage.user._id === currentMessage.user._id);
}

export default class ChatRoomConversationBubble extends React.Component {
	constructor(props) {
		super(props)
		this.state = ({
			isExpanded: false,
			wrapperOpacityAnim: new Animated.Value(1),
			wrapperPaddingAnim: new Animated.Value(0),
			timeHeightAnim: new Animated.Value(0),
		});
	}

	onLongPress = () => {
		if (this.props.onLongPress) {
			this.props.onLongPress(this.context, this.props.currentMessage);
		} else if (this.props.currentMessage.text) {
			const options =
				this.props.optionTitles.length > 0
					? this.props.optionTitles.slice(0, 2)
					: ['Copy Text', 'Cancel'];
			const cancelButtonIndex = options.length - 1;
			this.context.actionSheet().showActionSheetWithOptions(
				{
					options,
					cancelButtonIndex,
				},
				(buttonIndex) => {
					switch (buttonIndex) {
						case 0:
							Clipboard.setString(this.props.currentMessage.text);
							break;
						default:
							break;
					}
				},
			);
		}
	};

	handleBubbleToNext() {
		if (
			isSameUser(this.props.currentMessage, this.props.nextMessage) &&
			isSameDay(this.props.currentMessage, this.props.nextMessage)
		) {
			return StyleSheet.flatten([
				styles[this.props.position].containerToNext,
				this.props.containerToNextStyle[this.props.position],
			]);
		}
		return null;
	}

	handleBubbleToPrevious() {
		if (
			isSameUser(this.props.currentMessage, this.props.previousMessage) &&
			isSameDay(this.props.currentMessage, this.props.previousMessage)
		) {
			return StyleSheet.flatten([
				styles[this.props.position].containerToPrevious,
				this.props.containerToPreviousStyle[this.props.position],
			]);
		}
		return null;
	}

	renderMessageText() {
		if (this.props.currentMessage.text) {
			const { containerStyle, wrapperStyle, ...messageTextProps } = this.props;
			if (this.props.renderMessageText) {
				return this.props.renderMessageText(messageTextProps);
			}
			return <MessageText
				{...messageTextProps}
				linkStyle={{
					right: {
						color: '#46C8F5',
					},
					left: {
						color: '#46C8F5',
					},
				}}
				textStyle={{
					right: {
						color: '#262626',
					},
					left: {
						color: '#262626',
					},
				}}
			/>
		}
		return null;
	}

	renderMessageImage() {
		if (this.props.currentMessage.image) {
			const { containerStyle, wrapperStyle, ...messageImageProps } = this.props;
			if (this.props.renderMessageImage) {
				return this.props.renderMessageImage(messageImageProps);
			}
			return <ChatMessageImage {...messageImageProps} />;
		}
		return null;
	}

	renderMessageVideo() {
		if (this.props.currentMessage.video) {
			const { containerStyle, wrapperStyle, ...messageVideoProps } = this.props;
			if (this.props.renderMessageVideo) {
				return this.props.renderMessageVideo(messageVideoProps);
			}
			return <MessageVideo
				{...messageVideoProps}
				videoStyle={{
					borderRadius: 9,
					width: 'auto',
					minWidth: 150,
				}}
			/>;
		}
		return null;
	}

	renderTicks() {
		const { currentMessage } = this.props;
		if (this.props.renderTicks) {
			return this.props.renderTicks(currentMessage);
		}
		if (currentMessage.user._id !== this.props.user._id) {
			return null;
		}
		if (currentMessage.sent || currentMessage.received || currentMessage.pending) {
			return (
				<View style={styles.tickView}>
					{currentMessage.sent && <Text style={[styles.tick, this.props.tickStyle]}>✓</Text>}
					{currentMessage.received && <Text style={[styles.tick, this.props.tickStyle]}>✓</Text>}
					{currentMessage.pending && <Text style={[styles.tick, this.props.tickStyle]}>🕓</Text>}
				</View>
			);
		}
		return null;
	}

	renderTime() {
		const { currentMessage, position } = this.props;
		if (currentMessage.createdAt) {
			const containerStyle = {
				left: {
					height: this.state.timeHeightAnim,
					marginLeft: 10,
					marginRight: 10,
					marginBottom: 5,
				},
				right: {
					height: this.state.timeHeightAnim,
					marginLeft: 10,
					marginRight: 10,
					marginBottom: 5,
				}
			};
			return (<Animated.View style={{
				...containerStyle[position],
				height: this.state.timeHeightAnim,
			}}>
				<Text style={{
					fontSize: 10,
					backgroundColor: 'transparent',
					textAlign: 'right',
					color: '#aaa',
				}}>
					{moment(currentMessage.createdAt).locale(this.context.getLocale()).format('LT')}
				</Text>
			</Animated.View>);
		}
		return null;
	}

	renderUsername() {
		const { currentMessage } = this.props;
		if (this.props.renderUsernameOnMessage) {
			if (currentMessage.user._id === this.props.user._id) {
				return null;
			}
			return (
				<View style={styles.usernameView}>
					<Text style={[styles.username, this.props.usernameStyle]}>~ {currentMessage.user.name}</Text>
				</View>
			);
		}
		return null;
	}

	renderCustomView() {
		if (this.props.renderCustomView) {
			return this.props.renderCustomView(this.props);
		}
		return null;
	}

	toggleContainerStyle() {
		const isExpanded = !this.state.isExpanded;
		if (isExpanded) {
			Animated.timing(this.state.wrapperOpacityAnim, {
				toValue: 0.6,
				duration: 300,
			}).start();
			Animated.timing(this.state.timeHeightAnim, {
				toValue: 15,
				duration: 300,
			}).start();
		} else {
			Animated.timing(this.state.wrapperOpacityAnim, {
				toValue: 1,
				duration: 300,
			}).start();
			Animated.timing(this.state.timeHeightAnim, {
				toValue: 0,
				duration: 300,
			}).start();
		};
		this.setState({ isExpanded });
	}

	render() {
		return (
			<View style={[
				styles[this.props.position].container,
				this.props.containerStyle[this.props.position]
			]}>
				<TouchableOpacity
					activeOpacity={0.6}
					onLongPress={this.onLongPress}
					onPress={this.toggleContainerStyle.bind(this)}
					{...this.props.touchableProps}
				>
					<Animated.View
						style={[
							styles[this.props.position].wrapper,
							this.props.wrapperStyle[this.props.position],
							{
								opacity: this.state.wrapperOpacityAnim,
								paddingTop: this.state.wrapperPaddingAnim,
								paddingBottom: this.state.wrapperPaddingAnim,
							},
							this.handleBubbleToNext(),
							this.handleBubbleToPrevious(),
						]}
					>
						<View>
							{this.renderCustomView()}
							{this.renderMessageImage()}
							{this.renderMessageVideo()}
							{this.renderMessageText()}
							<View style={[styles[this.props.position].bottom, this.props.bottomContainerStyle[this.props.position]]}>
								{this.renderUsername()}
								{this.renderTime()}
								{this.renderTicks()}
							</View>
						</View>
					</Animated.View>
				</TouchableOpacity>
			</View>
		);
	}

}

const styles = {
	left: StyleSheet.create({
		container: {
			flex: 1,
			alignItems: 'flex-start',
		},
		wrapper: {
			borderRadius: 15,
			marginRight: 60,
			minHeight: 20,
			justifyContent: 'flex-end',

			// overrides
			backgroundColor: '#FCFCFC',
			elevation: 1,
			shadowColor: '#999',
			shadowOffset: { width: 0, height: 1, },
			shadowOpacity: 0.1,
			shadowRadius: 3,
			borderRadius: 9,
			borderColor: '#EDEDED',
			borderWidth: 1,
		},
		containerToNext: {
			borderBottomLeftRadius: 3,
		},
		containerToPrevious: {
			borderTopLeftRadius: 3,
		},
		bottom: {
			flexDirection: 'row',
			justifyContent: 'flex-start',
		},
	}),
	right: StyleSheet.create({
		container: {
			flex: 1,
			alignItems: 'flex-end',
		},
		wrapper: {
			borderRadius: 15,
			marginLeft: 60,
			minHeight: 20,
			justifyContent: 'flex-end',

			// overrides
			backgroundColor: '#F5F9FA',
			elevation: 1,
			shadowColor: '#999',
			shadowOffset: { width: 0, height: 1, },
			shadowOpacity: 0.1,
			shadowRadius: 3,
			borderRadius: 9,
			borderColor: '#D1ECF6',
			borderWidth: 1,
		},
		containerToNext: {
			borderBottomRightRadius: 3,
		},
		containerToPrevious: {
			borderTopRightRadius: 3,
		},
		bottom: {
			flexDirection: 'row',
			justifyContent: 'flex-end',
		},
	}),
	tick: {
		fontSize: 10,
		backgroundColor: 'transparent',
		color: 'white',
	},
	tickView: {
		flexDirection: 'row',
		marginRight: 10,
	},
	username: {
		top: -3,
		left: 0,
		fontSize: 12,
		backgroundColor: 'transparent',
		color: '#aaa',
	},
	usernameView: {
		flexDirection: 'row',
		marginHorizontal: 10,
	},
};

ChatRoomConversationBubble.contextTypes = {
	actionSheet: PropTypes.func,
	getLocale: PropTypes.func,
};

ChatRoomConversationBubble.defaultProps = {
	touchableProps: {},
	onLongPress: null,
	renderMessageImage: null,
	renderMessageVideo: null,
	renderMessageText: null,
	renderCustomView: null,
	renderUsername: null,
	renderTicks: null,
	renderTime: null,
	position: 'left',
	optionTitles: ['Copy Text', 'Cancel'],
	currentMessage: {
		text: null,
		createdAt: null,
		image: null,
	},
	nextMessage: {},
	previousMessage: {},
	containerStyle: {},
	wrapperStyle: {},
	bottomContainerStyle: {},
	tickStyle: {},
	usernameStyle: {},
	containerToNextStyle: {},
	containerToPreviousStyle: {},
};

ChatRoomConversationBubble.propTypes = {
	user: PropTypes.object.isRequired,
	touchableProps: PropTypes.object,
	onLongPress: PropTypes.func,
	renderMessageImage: PropTypes.func,
	renderMessageVideo: PropTypes.func,
	renderMessageText: PropTypes.func,
	renderCustomView: PropTypes.func,
	renderUsernameOnMessage: PropTypes.bool,
	renderUsername: PropTypes.func,
	renderTime: PropTypes.func,
	renderTicks: PropTypes.func,
	position: PropTypes.oneOf(['left', 'right']),
	optionTitles: PropTypes.arrayOf(PropTypes.string),
	currentMessage: PropTypes.object,
	nextMessage: PropTypes.object,
	previousMessage: PropTypes.object,
	containerStyle: PropTypes.shape({
		left: ViewPropTypes.style,
		right: ViewPropTypes.style,
	}),
	wrapperStyle: PropTypes.shape({
		left: ViewPropTypes.style,
		right: ViewPropTypes.style,
	}),
	bottomContainerStyle: PropTypes.shape({
		left: ViewPropTypes.style,
		right: ViewPropTypes.style,
	}),
	tickStyle: Text.propTypes.style,
	usernameStyle: Text.propTypes.style,
	containerToNextStyle: PropTypes.shape({
		left: ViewPropTypes.style,
		right: ViewPropTypes.style,
	}),
	containerToPreviousStyle: PropTypes.shape({
		left: ViewPropTypes.style,
		right: ViewPropTypes.style,
	}),
};