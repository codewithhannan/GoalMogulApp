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
import RightArrow from '../../assets/tutorial/RightArrow.png';
import Replay from '../../assets/tutorial/Replay.png';

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
        <View style={[{ flex: 1 }]}>
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
          <Text style={[textStyle, { fontSize: 21, marginTop: 2 }]}>Continue</Text>
          <Image source={RightArrow} style={{ height: 13, width: 20, marginLeft: 17 }} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.replayIconContainerStyle}
          onPress={this.props.replay}
        >
          <Image source={Replay} style={{ height: 15, width: 15, marginRight: 6 }} />
          <Text style={[textStyle, { marginTop: 1 }]}>
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
    paddingLeft: 28,
    paddingRight: 20,
    flexDirection: 'row'
  },
  replayIconContainerStyle: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    opacity: 0.8
  },
  imageStyle: {
    width: (width * 4) / 7,
    flex: 1,
    alignSelf: 'stretch',
  }
};

export default Host;
