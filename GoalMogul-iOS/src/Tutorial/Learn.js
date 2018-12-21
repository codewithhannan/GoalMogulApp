import React from 'react';
import {
  View,
  Animated,
  Text,
  Image,
  Dimensions
} from 'react-native';

// Styles
import {
  tutorial
} from '../styles';

// Assets
import LearnFeed from '../../assets/tutorial/Learn.png';

const { width } = Dimensions.get('window');

class Learn extends React.PureComponent {
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
          <Image source={LearnFeed} style={styles.imageStyle} resizeMode='contain' />
        </View>
        <Text style={[subTitleTextStyle, { marginTop: 30 }]}>
          Learn what really matters.
        </Text>
        <Text style={[textStyle, { marginTop: 12 }]}>
          The feed shows all your friends' goals.
        </Text>
        <Text style={[textStyle, { marginTop: 2 }]}>
          Now you know what's important to them
        </Text>
      </Animated.View>
    );
  }
}

const styles = {
  containerStyle: {
    paddingTop: 30,
    paddingBottom: 50
  },
  imageStyle: {
    width: (width * 2) / 3,
    flex: 1,
    alignSelf: 'stretch',
  }
};

export default Learn;
