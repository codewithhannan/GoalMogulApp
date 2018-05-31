import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';

/* Asset to delete */
import profilePic from '../../../asset/test-profile-pic.png';

/* Actions */
import { openProfileDetailEditForm } from '../../../actions/';

/* Components */
import Card from './Card';
import EditButton from '../../Common/Button/EditButton';

const { width } = Dimensions.get('window');

const testData = {
  name: 'Jia Zeng',
  email: 'jz145@duke.edu',
  phone: '9194912504',
  headline: 'I am a student at Duke.',
  privacy: {
    friends: 'Public'
  },
  profile: {
    pointsEarned: 10,
    about: 'This is a test page.',
    elevatorPitch: 'This is a profile elevator pitch',
    image: '',
    occupation: 'Student a;ljsdl;fajls;dkfjal;sdkjfl;sajkdl;f'
  }
};

// TODO: use redux instead of passed in props
class ProfileDetailCard extends Component {
  componentWillMount() {
    const { image } = this.props.user.profile;
    if (image) {
      this.prefetchImage(image);
    }
  }

  prefetchImage(image) {
    const fullImageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${image}`;
    Image.prefetch(fullImageUrl);
  }

  handleEditOnPressed() {
    this.props.openProfileDetailEditForm();
  }

  renderEditButton() {
    if (this.props.canEdit) {
      return (
        <View style={{ padding: 10 }}>
          <EditButton onPress={() => this.handleEditOnPressed()} />
        </View>
      );
    }
  }

  renderProfileImage(profile) {
    let { image } = profile;

    let profileImage = (
      <View style={styles.imageContainerStyle}>
        <Image style={styles.imageStyle} source={profilePic} />
      </View>
    );
    if (image) {
      image = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${image}`;
      profileImage = (
        <View
          style={styles.imageContainerStyle}
        >
          <Image style={styles.imageStyle} source={{ uri: image }} />
        </View>
      );
    }
    return profileImage;
  }

  render() {
    // const { name, headline, profile } = this.props.user;
    const { name, headline, profile } = testData;

    return (
      <Card>
        <View style={{ height: 90, backgroundColor: 'transparent' }} />
        <View style={styles.imageWrapperStyle}>
          {this.renderProfileImage(profile)}
          {this.renderEditButton()}
        </View>
        <View style={styles.containerStyle}>
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
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15
  },
  imageWrapperStyle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    height: 60,
    backgroundColor: 'white'
  },
  imageContainerStyle: {
    borderWidth: 1,
    borderColor: '#646464',
    alignItems: 'center',
    borderRadius: 14,
    position: 'absolute',
    bottom: 5,
    alignSelf: 'center'
  },
  imageStyle: {
    width: width / 3,
    height: width / 3,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'white'
  },
  nameTextStyle: {
    fontSize: 25,
    marginBottom: 5
  },
  headlineTextStyle: {
    fontSize: 13,
    color: '#646464'
  }
};

const mapStateToProps = state => {
  const canEdit = state.profile.userId.toString() === state.user.userId.toString();
  const { user } = state.profile;

  return {
    canEdit,
    user
  };
};

export default connect(mapStateToProps, { openProfileDetailEditForm })(ProfileDetailCard);
