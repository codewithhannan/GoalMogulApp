import React from 'react';
import {
  View,
  Text,
  Image
} from 'react-native';
import { Button } from 'react-native-elements';
import Styles from './Styles';

// Asset to delete
import profilePic from '../../../../asset/test-profile-pic.png';

const onUnBlocked = (userId) => {
  console.log('[ Unblock user ]: ', userId);
};

const renderProfileImage = (url) => {
  if (url) {
    return <Image style={Styles.imageStyle} source={url} />;
  }
  return <Image style={Styles.imageStyle} source={profilePic} />;
};

const renderButton = (status) => {
  return (
    <Button
      title='Unblock'
      titleStyle={Styles.buttonTextStyle}
      clear
      buttonStyle={Styles.buttonStyle}
      onPress={onUnBlocked}
    />
  );
};

const FriendCard = (props) => {
  const { item } = props.item;
  console.log('item is: ', item);
  if (item) {
    const { name, status } = item;
    return (
      <View style={{ height: 60, flex: 1 }}>
        <View style={{ flexDirection: 'row', padding: 10 }}>
          {renderProfileImage()}
          <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
            <Text
              ellipsizeMode='tail'
              numberOfLines={1}
            >
              {name}
            </Text>
          </View>

          {renderButton(status)}
        </View>

      </View>
    );
  }
  return '';
};

export default FriendCard;
