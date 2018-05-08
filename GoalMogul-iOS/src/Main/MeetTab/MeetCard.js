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

class MeetCard extends Component {

  renderProfileImage() {
    return <Image style={styles.imageStyle} source={profilePic} />;
  }

  renderButton() {
    return (
      <View style={styles.buttonContainerStyle}>
        <Button
          text='Friend'
          textStyle={styles.buttonTextStyle}
          clear
          icon={
            <Icon
              type='octicon'
              name='plus-small'
              width={10}
              color='#45C9F6'
              iconStyle={styles.buttonIconStyle}
            />
          }
          iconLeft
          buttonStyle={styles.buttonStyle}
        />
      </View>
    );
  }

  renderInfo() {
    return (
      <View style={styles.infoContainerStyle}>
        <View style={{ flex: 1, flexDirection: 'column', marginRight: 6 }}>
          <Name text='Heather Mayor' />
          <Text style={styles.jobTitleTextStyle}>SR. ACCOUNTANT</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={styles.friendTextStyle}>38 MUTUAL FRIENDS</Text>
        </View>
        {this.renderButton()}
      </View>
    );
  }

  renderNeed() {
    return (
      <View style={{ flex: 1 }}>
        <Text
          style={styles.titleTextStyle}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          NEEDS: {' '}
          <Text style={styles.detailTextStyle}>
            ACCOUNTANT, PAYROLL ASSISTANT, TAX GUIDE
          </Text>
        </Text>
      </View>
    );
  }

  renderGoal() {
    return (
      <View style={{ flex: 1 }}>
        <Text
          style={styles.titleTextStyle}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          GOALS: {' '}
          <Text style={styles.detailTextStyle}>
            BUY A HOME, NYC MARATHON, SKY-DIVING
          </Text>
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
          {this.renderGoal()}
          {this.renderNeed()}
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
    flex: 1
  },
  infoContainerStyle: {
    flexDirection: 'row',
    flex: 1
  },
  imageStyle: {
    height: 48,
    width: 48,
    borderRadius: 24,
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
    paddingLeft: 1
  },
  buttonIconStyle: {
    paddingTop: 1
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
    color: '#45C9F6',
    fontSize: 9,
    fontWeight: '800',
  }
};

export default MeetCard;
