/**
 * This component is an abstraction of CreateGoalButtonOverlay. By passing in
 * two sets of icons and texts and corresponding functions, it will render
 * an overlay of selection buttons.
 */
import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Animated
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

/* asset */
import cancel from '../../../asset/utils/cancel_no_background.png';

/* actions */
import {
	closeCreateOverlay
} from '../../../redux/modules/home/mastermind/actions';

class CreateButtonOverlay extends Component {
	constructor(...args) {
		super(...args);
		this.fadeAnim = new Animated.Value(0);
		this.spinAnim = new Animated.Value(0);
	}

	componentDidMount() {
		Animated.parallel([
		  Animated.timing(this.fadeAnim, {
			duration: 400,
			toValue: 1,
			useNativeDriver: true,
		  }),
		  Animated.timing(this.spinAnim, {
			toValue: 0.5,
			duration: 400,
			useNativeDriver: true,
		  })
		]).start();
	}

	handleCancel = () => {
		const { onCancel } = this.props;
		if (onCancel) {
			onCancel();
		};
		Animated.parallel([
		  Animated.timing(this.fadeAnim, {
			duration: 400,
			toValue: 0,
			useNativeDriver: true,
		  }),
		  Animated.timing(this.spinAnim, {
			toValue: 1,
			duration: 400,
			useNativeDriver: true,
		  })
		]).start(() => {
			Actions.pop();
		});
	}

	handleActionSelect = (selectedButtonName) => {
		// remove overlay
		Actions.pop();
		const { onActionSelect } = this.props;
		Animated.parallel([
		  Animated.timing(this.fadeAnim, {
			duration: 400,
			toValue: 0,
			useNativeDriver: true,
		  }),
		  Animated.timing(this.spinAnim, {
			toValue: 1,
			duration: 400,
			useNativeDriver: true,
		  })
		]).start(() => {
			if (onActionSelect) {
				onActionSelect(selectedButtonName);
			};
		});
	}

	renderCancelButton() {
		return (
			<TouchableWithoutFeedback
				activeOpacity={0.85}
				style={{ ...styles.iconContainerStyle,
					backgroundColor: 'transparent'
				}}
				onPress={this.handleCancel}
			>
				<Animated.Image
					style={{ ...styles.iconStyle,
						transform: [{
							rotate: this.spinAnim.interpolate({
								inputRange: [0, 1],
								outputRange: ['0deg', '180deg']
							})
						}],
						opacity: this.fadeAnim,
					}}
					source={cancel}
				/>
			</TouchableWithoutFeedback>
		);
	}

	renderActionButtons() {
		const { buttons } = this.props;
		const actionsButtons = buttons.map((button, index) => {
			let { name, textStyle, iconStyle, iconSource, text, onPress, customContainerStyle } = button;
			if (!customContainerStyle) {
				customContainerStyle = {};
			};
			return (
				<Animated.View
					style={{
						opacity: this.fadeAnim,
						position: 'relative',
						transform: [{translateY: this.fadeAnim.interpolate({
						  inputRange: [0, 1],
						  outputRange: [((buttons.length - index) * 30), 0],
						})}],
						right: 18,
					}}
				>
					<ActionButton
						text={text}
						source={iconSource}
						style={{
							iconStyle,
							textStyle,
							customContainerStyle,
						}}
						onPress={() => {
							this.handleActionSelect(name);
							onPress();
						}}
						key={index}
					/>
				</Animated.View>
			);
		});

		return actionsButtons;
	}

	render() {
		return (
			<View style={{ ...styles.wrapperStyle }}>
				<TouchableWithoutFeedback onPress={this.handleCancel}>
					<Animated.View style={[styles.fullscreen, {
						opacity: this.fadeAnim.interpolate({
							inputRange: [0, 1],
							outputRange: [0, 0.3],
						}),
						backgroundColor: '#000',
					}]}>
					</Animated.View>
				</TouchableWithoutFeedback>
				<View style={styles.containerStyle}>
					{this.renderActionButtons()}
					{this.renderCancelButton()}
				</View>
			</View>
		);
	}
}

const ActionButton = (props) => {
	const { text, source, style, onPress } = props;
	const { containerStyle, iconStyle, textStyle } = actionButtonStyles;
	return (
		<TouchableOpacity activeOpacity={0.6} style={{...containerStyle, ...style.customContainerStyle}} onPress={onPress}>
			<Image style={{ ...iconStyle, ...style.iconStyle }} source={source} />
			<Text style={{ ...textStyle, ...style.textStyle }}>{text}</Text>
		</TouchableOpacity>
	);
};

const actionButtonStyles = {
	containerStyle: {
		// backgroundColor: '#17B3EC',
		backgroundColor: '#0397CB',
		height: 35,
		width: 80,
		borderRadius: 6,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.4,
		shadowRadius: 2,
	},
	iconStyle: {
		height: 20,
		width: 20,
		tintColor: 'white'
	},
	textStyle: {
		fontSize: 12,
		color: 'white',
		marginLeft: 6
	}
};

const styles = {
	wrapperStyle: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
	containerStyle: {
		position: 'absolute',
		bottom: 84,
		right: 15,
		alignItems: 'center'
	},
	iconContainerStyle: {
		height: 40,
		width: 40,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#17B3EC',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.4,
		shadowRadius: 2,
	},
	iconStyle: {
		height: 20,
		width: 20,
		tintColor: 'white'
	},
	fullscreen: {
		opacity: 0,
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
	},
};

export default connect(null, { closeCreateOverlay })(CreateButtonOverlay);
