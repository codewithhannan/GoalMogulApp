import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';

import { Avatar } from 'react-native-elements';
import badge from '../asset/utils/badge.png';

class ContactDetail extends Component {
  render() {
    return (
      <View style={styles.containerStyle}>
        <Avatar
          rounded
          icon={{ name: 'user' }}
          activeOpacity={0.7}
          width={25}
        />
        <Text style={styles.nameTextStyle}>Peter Kushner</Text>
        <Image style={styles.imageStyle} source={badge} />
        <Text>CEO at stark industries</Text>
        <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
          <Avatar
            rounded
            icon={{ name: 'user' }}
            activeOpacity={0.7}
            width={25}
          />
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
  nameTextStyle: {
    marginLeft: 8,
    marginRight: 4,
    fontSize: 15,
    fontWeight: '700'
  },
  imageStyle: {
    marginRight: 3
  }
};

export default ContactDetail;
