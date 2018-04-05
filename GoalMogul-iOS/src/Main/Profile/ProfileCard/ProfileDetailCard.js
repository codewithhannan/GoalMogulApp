import React, { Component } from 'react';
import {
  View,
  Image,
  Text
} from 'react-native';

/* Asset to delete */
import profilePic from '../../../asset/test-profile-pic.png';

/* Components */
import Card from './Card';

// TODO: use redux instead of passed in props
class ProfileDetailCard extends Component {

  ComponentWillMount() {
    // TODO: prefetch profile image
  }

  render() {
    const { image, name, headline } = this.props.data;
    return (
      <Card>
        <View style={styles.containerStyle}>
          <Image style={styles.imageStyle} source={profilePic} />
          <Text style={styles.nameTextStyle}>
            {name}
          </Text>
          <Text style={styles.headlineTextStyle}>
            {headline}
          </Text>

        </View>
      </Card>
    );
  }
}

const styles = {
  containerStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10
  },
  imageStyle: {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  nameTextStyle: {
    marginTop: 10,
    fontSize: 23
  },
  headlineTextStyle: {
    fontSize: 15
  }
};

export default ProfileDetailCard;
