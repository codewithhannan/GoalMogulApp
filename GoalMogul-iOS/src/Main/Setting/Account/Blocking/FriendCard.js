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
  onUnBlocked = (userId) => {
    console.log('[ Unblock user ]: ', userId);
    this.props.unblockUser(userId);
  };

  renderProfileImage = (url) => {
    if (url) {
      return <Image style={Styles.imageStyle} source={url} />;
    }
    return <Image style={Styles.imageStyle} source={profilePic} />;
  };

  renderButton = (item) => {
    return (
      <Button
        title='Unblock'
        titleStyle={Styles.buttonTextStyle}
        clear
        buttonStyle={Styles.buttonStyle}
        onPress={() => this.onUnBlocked(item._id)}
      />
    );
  };

  render() {
    const { item } = this.props;
    console.log('item is: ', item);
    if (item) {
      const { name } = item;
      return (
        <View style={{ height: 60, flex: 1 }}>
          <View style={{ flexDirection: 'row', padding: 10 }}>
            {this.renderProfileImage()}
            <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
              <Text
                ellipsizeMode='tail'
                numberOfLines={1}
              >
                {name}
              </Text>
            </View>

            {this.renderButton(item)}
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
