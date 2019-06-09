import React, { Component } from 'react';
import {
  TouchableWithoutFeedback,
  Animated,
  TouchableOpacity,
  View
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/* asset */
import plus from '../../../asset/utils/plus.png';
import { APP_BLUE, APP_DEEP_BLUE } from '../../../styles';

const DEBUG_KEY = '[ UI PlusButton ]';

class PlusButton extends Component {
  constructor(...args) {
    super(...args);
    this.animations = {
        plusFade: new Animated.Value(1),
        plusShrink: new Animated.Value(styles.iconContainerStyle.height),
        plusBottomShift: new Animated.Value(styles.iconContainerStyle.bottom),
        plusRightShift: new Animated.Value(styles.iconContainerStyle.right),
        spinAnim: new Animated.Value(0),
      };
  }

  componentDidMount() {
      
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.plusActivated && !prevProps.plusActivated) {
      Animated.parallel([
        Animated.timing(this.animations.plusFade, {
          toValue: 1,
          duration: 400,
        }),
        Animated.timing(this.animations.plusShrink, {
          toValue: styles.iconContainerStyle.height,
          duration: 400,
        }),
        Animated.timing(this.animations.plusBottomShift, {
          toValue: styles.iconContainerStyle.bottom,
          duration: 400,
        }),
        Animated.timing(this.animations.plusRightShift, {
          toValue: styles.iconContainerStyle.right,
          duration: 400,
        }),
        Animated.timing(this.animations.spinAnim, {
          toValue: 1,
          duration: 400,
        })
      ]).start(() => {
        this.animations.spinAnim.setValue(0);
      });
    }
  }

  onPress = () => {
    if (!this.props.plusActivated) return;
    Animated.parallel([
      Animated.timing(this.animations.plusFade, {
        toValue: 0,
        duration: 400,
      }),
      Animated.timing(this.animations.plusShrink, {
        toValue: 0,
        duration: 400,
      }),
      Animated.timing(this.animations.plusBottomShift, {
        toValue: styles.iconContainerStyle.bottom + (styles.iconContainerStyle.height / 2),
        duration: 400,
      }),
      Animated.timing(this.animations.plusRightShift, {
        toValue: styles.iconContainerStyle.right + (styles.iconContainerStyle.height / 2),
        duration: 400,
      }),
      Animated.timing(this.animations.spinAnim, {
        toValue: 0.5,
        duration: 400,
      })
    ]).start();
    if (this.props.onPress) {
        this.props.onPress();
    };
  }

  render() {
      return (
        <TouchableWithoutFeedback
            onPress={this.onPress}
        >
          <Animated.View
              style={[styles.iconContainerStyle, {
                  opacity: this.animations.plusFade,
                  height: this.animations.plusShrink,
                  width: this.animations.plusShrink,
                  bottom: this.animations.plusBottomShift,
                  right: this.animations.plusRightShift,
              }]}
          >
                <Animated.Image
                    style={[styles.iconStyle, {
                        transform: [{rotate: this.animations.spinAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '180deg']
                        })}],
                    }]}
                    source={plus}
                />
            </Animated.View>
          </TouchableWithoutFeedback>
      );
  }
}

const styles = {
    iconContainerStyle: {
      position: 'absolute',
      bottom: 20,
      right: 29,
      height: 54,
      width: 54,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3,
      // backgroundColor: '#17B3EC',
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

export default connect(null, {

})(PlusButton);

PlusButton.prototypes = {
  plusActivated: PropTypes.bool,
  onPress: PropTypes.func
}
