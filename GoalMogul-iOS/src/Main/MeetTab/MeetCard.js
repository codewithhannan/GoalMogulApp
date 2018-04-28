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
              color='#34c0dd'
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
        <View style={{ flexDirection: 'column' }}>
          <Name text='Heather Mayor' />
          <Text>SR. ACCOUNTANT</Text>
        </View>
        {this.renderButton()}
      </View>
    );
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        {this.renderProfileImage()}

        <View style={styles.bodyContainerStyle}>
          {this.renderInfo()}
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
    alignItems: 'center'
  },
  bodyContainerStyle: {
    marginLeft: 8
  },
  infoContainerStyle: {
    flexDirection: 'row'
  },
  imageStyle: {
    height: 54,
    width: 54,
    borderRadius: 27,
  },
  buttonContainerStyle: {
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  buttonStyle: {
    width: 80,
    height: 25,
    borderWidth: 1,
    borderColor: '#34c0dd',
    borderRadius: 20,
  },
  buttonTextStyle: {
    color: '#34c0dd',
    fontSize: 15,
    fontWeight: '700',
    paddingLeft: 1
  },
  buttonIconStyle: {
    paddingTop: 1
  }
};

export default MeetCard;
