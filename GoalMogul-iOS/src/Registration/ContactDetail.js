import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Avatar, Icon } from 'react-native-elements';

// Assets
import badge from '../asset/utils/badge.png';
import addUser from '../asset/utils/addUser.png';
import check from '../asset/utils/check.png';

// Actions
import { updateFriendship } from '../actions';

const checkIconColor = '#2dca4a';

class ContactDetail extends Component {

  state = {
    requested: false
  }

  onFriendRequest = () => {
    this.props.updateFriendship(0, 'requestFriend', this.updateState);
  }

  updateState = () => {
    console.log('requested');
    this.setState({
      requested: true
    });
  }

  renderButton() {
    if (this.state.requested) {
      return (
        <View style={styles.checkIconContainerStyle}>
          <Image source={check} style={{ ...styles.iconStyle, tintColor: checkIconColor }} />
        </View>
      );
    }
    return (
      <View style={styles.addUserIconContainerStyle}>
        <Image source={addUser} style={{ ...styles.iconStyle, tintColor: 'white' }} />
      </View>
    );
  }

  render() {
    const { name, headline, _id } = this.props.item.item;
    return (
      <View style={styles.containerStyle}>
        <View
          style={{
            ...styles.addUserIconContainerStyle,
            backgroundColor: '#d8d8d8',
            borderWidth: 0
          }}
        />
      <View style={styles.bodyContainerStyle}>
          <Text
            style={styles.nameTextStyle}
            numberOfLines={1}
            ellipsizeMode='tail'
          >
            {name}
          </Text>
          <Image style={styles.imageStyle} source={badge} />
          <Text
            style={styles.titleTextStyle}
            numberOfLines={1}
            ellipsizeMode='tail'
          >
            {headline}
          </Text>
        </View>
        <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
          <TouchableOpacity onPress={this.onFriendRequest.bind(this, _id)}>
            {this.renderButton()}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10
  },
  bodyContainerStyle: {
     flexDirection: 'row',
     justifyContent: 'flex-start',
     alignItems: 'center',
     width: 290,
     marginLeft: 5,
     marginRight: 5
  },
  nameTextStyle: {
    marginLeft: 8,
    marginRight: 4,
    fontSize: 15,
    fontWeight: '700',
    maxWidth: 200
  },
  titleTextStyle: {
    flex: 1,
    flexWrap: 'wrap'
  },
  imageStyle: {
    marginRight: 3
  },
  addUserIconContainerStyle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 0,
    backgroundColor: '#45C9F6',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkIconContainerStyle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: checkIconColor,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconStyle: {
    height: 16,
    width: 16
  }
};

export default connect(
  null,
  {
    updateFriendship
  }
)(ContactDetail);
