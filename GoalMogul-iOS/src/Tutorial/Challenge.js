import React from 'react';
import {
  View,
  Animated,
  Text,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native';

// Styles
import {
  tutorial
} from '../styles';

// Assets
import SetGoals from '../../assets/tutorial/SetGoals.png';

const { width } = Dimensions.get('window');

class Challenge extends React.PureComponent {
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
        <Text style={[subTitleTextStyle]}>
          Set Challenging Goals
        </Text>
        <Text style={[textStyle, { marginTop: 12 }]}>
          Friends can help you achieve them
        </Text>

        <View style={[imageShadow, { paddingTop: 30, flex: 1 }]}>
          <Image source={SetGoals} style={styles.imageStyle} resizeMode='contain' />
        </View>
      </Animated.View>
    );
  }
}

const styles = {
  containerStyle: {
    paddingTop: 40,
    paddingBottom: 60
  },
  imageStyle: {
    width: (width * 2) / 3,
    flex: 1,
    alignSelf: 'stretch',
  }
};

export default Challenge;
