import React, { Component } from 'react';
import {
  View,
  Image,
  Text
} from 'react-native';

// Assets
import badge from '../../../../asset/utils/badge.png';
import profilePic from '../../../../asset/test-profile-pic.png';

class CommentRef extends Component {

  // Currently this is a dummy component
  render() {
    return (
      <View style={styles.containerStyle}>
        <Image source={profilePic} style={{ width: 50, height: 50 }} />
        <View style={{ flex: 1, marginLeft: 12, marginRight: 12, justifyContent: 'center' }}>
          <Text style={styles.titleTextStyle}>Sharon Warren</Text>
          <Text style={styles.headingTextStyle}>Editor at The Atlantic</Text>
        </View>
        <View style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={badge} style={{ height: 23, width: 23 }} />
        </View>
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flexDirection: 'row',
    height: 50,
    marginTop: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1
  },
  titleTextStyle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2
  },
  headingTextStyle: {
    fontSize: 9
  }
};

export default CommentRef;
