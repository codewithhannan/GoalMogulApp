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
		this.fadeAnim = new Animated.Value(0.001);
	}

	componentDidMount() {
		Animated.timing(this.fadeAnim, {
			duration: 100,
			toValue: 1,
		}).start();
	}

	handleCancel = () => {
		const { onCancel } = this.props;
		Animated.timing(this.fadeAnim, {
			duration: 100,
			toValue: 0,
		}).start(() => {
			if (onCancel) {
				onCancel();
			}
			// this.props.closeCreateOverlay(this.props.tab);
			Actions.pop();
		});
	}

	handleActionSelect = (selectedButtonName) => {
		const { onActionSelect } = this.props;
		Animated.timing(this.fadeAnim, {
			duration: 100,
			toValue: 0,
		}).start(() => {
			if (onActionSelect) {
				onActionSelect(selectedButtonName);
			};
			Actions.pop();
		});
	}

	renderCancelButton() {
		return (
			<TouchableOpacity
				activeOpacity={0.85}
				style={{ ...styles.iconContainerStyle, backgroundColor: 'transparent' }}
				onPress={this.handleCancel}
			>
				<Image style={{ ...styles.iconStyle }} source={cancel} />
			</TouchableOpacity>
		);
	}

	// This function is not being called
	handleCreatePost = () => {
		console.log('User trying to create post');
		Animated.timing(this.fadeAnim, {
			duration: 100,
			toValue: 0,
		}).start(() => {
			this.props.closeCreateOverlay(this.props.tab);
			Actions.pop();
			// pageId is for event or tribe so that we know when we refresh,
			// which tribe / event page to get list of items
			// Currently this is only invoked in tribe and event
			Actions.createPostModal({ 
				pageId: this.props.pageId, 
			});
		});
	}

  // This function is not being called
  handleCreateGoal = () => {
    console.log('User trying to create goal');
    Animated.timing(this.fadeAnim, {
      duration: 100,
      toValue: 0,
    }).start(() => {
      this.props.closeCreateOverlay(this.props.tab);
      Actions.pop();
      // pageId is for event or tribe so that we know when we refresh,
      // which tribe / event page to get list of items
      // Currently this is only invoked in tribe and event
      Actions.createGoalModal({ 
        pageId: this.props.pageId, 
      });
    });
  }

	renderActionButtons() {
		const { buttons } = this.props;
		const actionsButtons = buttons.map((button, index) => {
			const { name, textStyle, iconStyle, iconSource, text, onPress } = button;
			return (
				<ActionButton
					text={text}
					source={iconSource}
					style={{
						iconStyle,
						textStyle
					}}
					onPress={() => {
						onPress();
						this.handleActionSelect(name);
					}}
					key={index}
				/>
			);
		});

		return actionsButtons;
	}

	render() {
		return (
			<Animated.View style={{ ...styles.wrapperStyle, opacity: this.fadeAnim }}>
				<TouchableWithoutFeedback onPress={this.handleCancel}>
					<Animated.View style={[styles.fullscreen, { opacity: this.fadeAnim }]}>
						<View style={[styles.fullscreen, { opacity: 0.3, backgroundColor: '#000' }]} />
					</Animated.View>
				</TouchableWithoutFeedback>
				<View style={styles.containerStyle}>
					{this.renderActionButtons()}
					{this.renderCancelButton()}
				</View>
			</Animated.View>
		);
	}
}

const ActionButton = (props) => {
	const { text, source, style, onPress } = props;
	const { containerStyle, iconStyle, textStyle } = actionButtonStyles;
	return (
		<TouchableOpacity activeOpacity={0.85} style={containerStyle} onPress={onPress}>
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
		bottom: 70,
		right: 30,
		alignItems: 'flex-end'
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
