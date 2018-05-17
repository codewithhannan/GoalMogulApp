import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import { Button, Icon } from 'react-native-elements';

import Name from '../Common/Name';

/* Asset To Delete */
import profilePic from '../../asset/test-profile-pic.png';

// Actions
import { updateFriendship } from '../../actions';

class MeetCard extends Component {

  state = {
    requested: false
  }

  onButtonClicked = () => {
    this.props.updateFriendship();
  }

  renderProfileImage() {
    return <Image style={styles.imageStyle} source={profilePic} />;
  }

  renderButton() {
    if (this.state.requested) {
      return (
        <Button
          text='Sent'
          textStyle={styles.buttonTextStyle}
          clear
          buttonStyle={styles.buttonStyle}
        />
      );
    }
    return (
      <Button
        text='Friend'
        textStyle={styles.buttonTextStyle}
        clear
        icon={
          <Icon
            type='octicon'
            name='plus-small'
            width={10}
            size={20}
            color='#45C9F6'
            iconStyle={styles.buttonIconStyle}
          />
        }
        iconLeft
        buttonStyle={styles.buttonStyle}
      />
    );
  }

  renderInfo() {
    const { name } = this.props.item;
    return (
      <View style={styles.infoContainerStyle}>
        <View style={{ flex: 1, flexDirection: 'row', marginRight: 6, alignItems: 'center' }}>
          <Name text={name} />
          <Text
            style={styles.friendTextStyle}
            numberOfLines={1}
            ellipsizeMode='tail'
          >
            380 MUTUAL FRIENDS
          </Text>
        </View>

        <View style={styles.buttonContainerStyle}>
          {this.renderButton()}
        </View>
      </View>
    );
  }

  renderAdditionalInfo() {
    const { profile } = this.props.item;
    let title = '';
    let content = '';
    if (profile.elevatorPitch) {
      title = 'Elevator Pitch:';
      content = profile.elevatorPitch;
    } else if (profile.about) {
      title = 'About:';
      content = profile.about;
    }
    return (
      <View style={{ flex: 1 }}>
        <Text
          style={styles.titleTextStyle}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          {title} {' '}
          <Text style={styles.detailTextStyle}>
            {content}
          </Text>
        </Text>
      </View>
    );
  }

  renderOccupation() {
    const { profile } = this.props.item;
    let title = '';
    if (profile.occupation) {
      title = 'Occupation: ';
    }
    return (
      <View style={{ flex: 1, marginTop: 5 }}>
        <Text
          style={styles.titleTextStyle}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          {title}
          <Text style={styles.detailTextStyle}>{profile.occupation}</Text>
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        {this.renderProfileImage()}

        <View style={styles.bodyContainerStyle}>
          {this.renderInfo()}
          {this.renderOccupation()}
          {this.renderAdditionalInfo()}
        </View>
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  bodyContainerStyle: {
    marginLeft: 8,
    flex: 1,
  },
  infoContainerStyle: {
    flexDirection: 'row',
    flex: 1
  },
  imageStyle: {
    height: 48,
    width: 48,
    borderRadius: 5,
  },
  buttonContainerStyle: {
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  buttonStyle: {
    width: 70,
    height: 23,
    borderWidth: 1,
    borderColor: '#45C9F6',
    borderRadius: 20,
  },
  buttonTextStyle: {
    color: '#45C9F6',
    fontSize: 11,
    fontWeight: '700',
    paddingLeft: 1,
    padding: 0,
    paddingTop: 1,
    alignSelf: 'center'
  },
  buttonIconStyle: {
    marginTop: 1
  },
  needContainerStyle: {

  },
  titleTextStyle: {
    color: '#45C9F6',
    fontSize: 11,
    paddingTop: 1,
    paddingBottom: 1
  },
  detailTextStyle: {
    color: '#000000',
    paddingLeft: 3
  },
  jobTitleTextStyle: {
    color: '#45C9F6',
    fontSize: 11,
    fontWeight: '800',
    paddingTop: 5,
    paddingBottom: 3
  },
  friendTextStyle: {
    paddingLeft: 10,
    color: '#45C9F6',
    fontSize: 9,
    fontWeight: '800',
    maxWidth: 120
  }
};

export default connect(null, {
  updateFriendship
})(MeetCard);
