import React from 'react';
import {
  View,
  Animated,
  Text,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';

// Styles
import {
  tutorial,
  APP_BLUE
} from '../styles';

// Assets
import MoreIcon from '../../assets/tutorial/More.png';

const { width } = Dimensions.get('window');

class Host extends React.PureComponent {
  render() {
    const {
      subTitleTextStyle,
      textStyle,
      imageShadow,
      containerStyle
    } = tutorial;

    return (
      <Animated.View
        style={[
          containerStyle,
          { ...styles.containerStyle, opacity: this.props.opacity, flex: 1 }
        ]}
      >
        <View style={[imageShadow, { flex: 1 }]}>
          <Image source={MoreIcon} style={styles.imageStyle} resizeMode='contain' />
        </View>
        <Text style={[subTitleTextStyle, { marginTop: 30 }]}>
          Host Events, and more
        </Text>
        <Text style={[textStyle, { marginTop: 12 }]}>
          Form mastermind groups to accomplish
        </Text>
        <Text style={[textStyle, { marginTop: 3 }]}>
          your goals
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.buttonContainerStyle}
          onPress={this.props.continue}
        >
          <Text style={[textStyle, { fontSize: 21 }]}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.replayIconContainerStyle}
          onPress={this.props.replay}
        >
          <Text style={[textStyle]}>
            replay
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

const styles = {
  containerStyle: {
    paddingTop: 30,
    paddingBottom: 50
  },
  buttonContainerStyle: {
    backgroundColor: APP_BLUE,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20
  },
  replayIconContainerStyle: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: (width * 4) / 7,
    flex: 1,
    alignSelf: 'stretch',
  }
};

export default Host;
