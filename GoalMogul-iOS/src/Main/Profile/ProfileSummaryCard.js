import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableWithoutFeedback
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';

/* Asset To Delete */
import profilePic from '../../asset/test-profile-pic.png';

/* Actions */
import { openProfileDetail } from '../../actions';

/* Components */
import Name from '../Common/Name';
import Position from '../Common/Position';
import Stats from '../Common/Text/Stats';

const data = [
  {
    name: 'Friends',
    stat: '100K'
  }
];

class ProfileSummaryCard extends Component {

  handleOpenProfileDetail() {
    this.props.openProfileDetail();
  }

  render() {
    const name = this.props.user.name;
    let imageUrl = this.props.user.profile.image;
    let profileImage = <Image style={styles.imageStyle} source={profilePic} />;
    if (imageUrl) {
      imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${imageUrl}`;
      profileImage = <Image style={styles.imageStyle} source={{ uri: imageUrl }} />;
    }

    return (
      <TouchableWithoutFeedback onPress={this.handleOpenProfileDetail.bind(this)}>
        <View style={styles.containerStyle}>
          <View style={{ flex: 5, flexDirection: 'row' }}>
            {profileImage}

            <View style={styles.bodyStyle}>
              <Name text={name} />
              <Position text='Sr. UI/UX designer & developer' />
              <Stats data={data} />
            </View>
          </View>
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
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = {
  containerStyle: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
    maxHeight: 70
  },
  bodyStyle: {
    flex: 3,
    display: 'flex',
    marginLeft: 5,
    marginRight: 5,
    justifyContent: 'space-between'
  },
  buttonContainerStyle: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  imageStyle: {
    height: 54,
    width: 54,
    borderRadius: 5,
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

const mapStateToProps = state => {
  const { userId, user } = state.profile;

  return {
    userId,
    user
  };
};

export default connect(mapStateToProps, { openProfileDetail })(ProfileSummaryCard);
