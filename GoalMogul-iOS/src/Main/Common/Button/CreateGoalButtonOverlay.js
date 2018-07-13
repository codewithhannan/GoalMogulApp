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
import post from '../../../asset/utils/post.png';
import goal from '../../../asset/header/home-logo.png';

/* actions */
import {
  closeCreateOverlay
} from '../../../redux/modules/home/mastermind/actions';

class CreateGoalButtonOverlay extends Component {
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
    Animated.timing(this.fadeAnim, {
      duration: 100,
      toValue: 0,
    }).start(() => {
      this.props.closeCreateOverlay(this.props.tab);
      Actions.pop();
    });
  }

  handleCreatePost = () => {
    console.log('User trying to create post');
    Animated.timing(this.fadeAnim, {
      duration: 100,
      toValue: 0,
    }).start(() => {
      this.props.closeCreateOverlay(this.props.tab);
      Actions.pop();
      Actions.createPostModal();
    });
  }

  handleCreateGoal = () => {
    console.log('User trying to create goal');
    Animated.timing(this.fadeAnim, {
      duration: 100,
      toValue: 0,
    }).start(() => {
      this.props.closeCreateOverlay(this.props.tab);
      Actions.pop();
      Actions.createGoalModal();
    });
  }

  renderCancelButton() {
    return (
      <TouchableOpacity
        style={{ ...styles.iconContainerStyle, backgroundColor: 'transparent' }}
        onPress={this.handleCancel}
      >
        <Image style={{ ...styles.iconStyle }} source={cancel} />
      </TouchableOpacity>
    );
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
          <ActionButton
            text='Post'
            source={post}
            style={{
              iconStyle: { height: 18, width: 18, marginLeft: 3 },
              textStyle: { marginLeft: 5 }
            }}
            onPress={this.handleCreatePost}
            key={0}
          />
          <ActionButton
            text='Goal'
            source={goal}
            style={{
              iconStyle: { height: 25, width: 25 },
              textStyle: { marginLeft: 5, marginRight: 3 }
            }}
            onPress={this.handleCreateGoal}
            key={1}
          />
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
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <Image style={{ ...iconStyle, ...style.iconStyle }} source={source} />
      <Text style={{ ...textStyle, ...style.textStyle }}>{text}</Text>
    </TouchableOpacity>
  );
};

const actionButtonStyles = {
  containerStyle: {
    backgroundColor: '#45C9F6',
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
    backgroundColor: '#45C9F6',
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

export default connect(null, { closeCreateOverlay })(CreateGoalButtonOverlay);
