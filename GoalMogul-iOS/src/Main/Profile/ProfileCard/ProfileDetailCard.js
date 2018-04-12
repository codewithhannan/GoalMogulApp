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
import EditButton from '../../Common/Button/EditButton';

// TODO: use redux instead of passed in props
class ProfileDetailCard extends Component {

  renderProfileImage() {
    const { profile } = this.props.data;
    let { image } = profile;

    let profileImage = <Image style={styles.imageStyle} source={profilePic} />;
    if (image) {
      image = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${image}`;
      profileImage = <Image style={styles.imageStyle} source={{ uri: image }} />;
    }
    return profileImage;
  }

  render() {
    const { name, headline } = this.props.data;


    return (
      <Card>
        <View style={styles.containerStyle}>
          <EditButton />
          {this.renderProfileImage()}
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
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15
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
