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
import TribeIcon from '../../assets/tutorial/Tribe.png';

const { width } = Dimensions.get('window');

class Tribe extends React.PureComponent {
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
          <Image source={TribeIcon} style={styles.imageStyle} resizeMode='contain' />
        </View>
        <Text style={[subTitleTextStyle, { marginTop: 30 }]}>
          Find your tribe
        </Text>
        <Text style={[textStyle, { marginTop: 12 }]}>
          Meet users who mesh with you
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
    width: (width * 5) / 7,
    flex: 1,
    alignSelf: 'stretch',
  }
};

export default Tribe;
