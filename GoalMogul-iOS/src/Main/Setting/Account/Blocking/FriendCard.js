import React, { Component } from 'react';
import {
  View,
  Text,
  Image
} from 'react-native';
import { connect } from 'react-redux';

// Components
import { Button } from 'react-native-elements';

// Styles
import Styles from './Styles';

// Actions
import { unblockUser } from '../../../../actions';

// Assets
import profilePic from '../../../../asset/utils/defaultUserProfile.png';

class FriendCard extends Component {
  onUnBlocked = (blockId) => {
    console.log('[ Unblock user ]: ', blockId);
    this.props.unblockUser(
      blockId,
      () => alert(
        `You have successfully unblock ${this.props.item.user.name}. Please pull to refresh.`
      )
    );
  };

  renderProfileImage = (url) => {
    if (url) {
      const imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${url}`
      return <Image style={Styles.imageStyle} source={{ uri: imageUrl }} />;
    }
    return <Image style={Styles.imageStyle} source={profilePic} />;
  };

  renderButton = (blockId) => {
    return (
      <Button
        title='Unblock'
        titleStyle={Styles.buttonTextStyle}
        clear
        buttonStyle={Styles.buttonStyle}
        onPress={() => this.onUnBlocked(blockId)}
      />
    );
  };

  render() {
    const { item } = this.props;
    const { user, blockId } = item;
    console.log('item is: ', item);
    if (user) {
      const { name, profile } = user;
      return (
        <View style={{ height: 60, flex: 1 }}>
          <View style={{ flexDirection: 'row', padding: 10 }}>
            {this.renderProfileImage(profile.image)}
            <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
              <Text
                ellipsizeMode='tail'
                numberOfLines={1}
              >
                {name}
              </Text>
            </View>

            {this.renderButton(blockId)}
          </View>

        </View>
      );
    }
    return '';
  }
}

export default connect(null, {
  unblockUser
})(FriendCard);
