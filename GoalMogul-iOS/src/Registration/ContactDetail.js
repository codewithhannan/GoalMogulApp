import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Avatar } from 'react-native-elements';

import badge from '../asset/utils/badge.png';

// Actions
import { updateFriendship } from '../actions';

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
        <Avatar
          rounded
          icon={{ name: 'check', type: 'font-awesome', size: 15 }}
          activeOpacity={0.7}
          width={25}
          overlayContainerStyle={{ backgroundColor: '#2ec25e', alignSelf: 'center' }}
        />
      );
    }
    return (
      <Avatar
        rounded
        icon={{ name: 'user', type: 'font-awesome', size: 15 }}
        overlayContainerStyle={{ alignSelf: 'center' }}
        activeOpacity={0.7}
        width={25}
      />
    );
  }

  render() {
    const { name, headline } = this.props.item.item;
    return (
      <View style={styles.containerStyle}>
        <Avatar
          rounded
          icon={{ name: 'user', type: 'font-awesome', size: 15 }}
          activeOpacity={0.7}
          width={25}
          overlayContainerStyle={{ alignSelf: 'center' }}
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
          <TouchableOpacity onPress={this.onFriendRequest}>
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
  }
};

export default connect(
  null,
  {
    updateFriendship
  }
)(ContactDetail);
