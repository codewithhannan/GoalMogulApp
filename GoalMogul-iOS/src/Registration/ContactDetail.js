import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import { Avatar } from 'react-native-elements';
import badge from '../asset/utils/badge.png';

class ContactDetail extends Component {

  onFriendRequest = () => {

  }

  render() {
    const { name, headline } = this.props.item.item;
    return (
      <View style={styles.containerStyle}>
        <Avatar
          rounded
          icon={{ name: 'user' }}
          activeOpacity={0.7}
          width={25}
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
            <Avatar
              rounded
              icon={{ name: 'user' }}
              activeOpacity={0.7}
              width={25}
            />
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

export default ContactDetail;
