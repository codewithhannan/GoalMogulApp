import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';

/* Import icons */
import LikeIcon from './asset/utils/like.png';
import BulbIcon from './asset/utils/bulb.png';
import ShareIcon from './asset/utils/share.png';

class PostCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [
        {
          key: 'like',
          title: '',
          icon: LikeIcon
        },
        {
          key: 'bulk',
          title: '',
          icon: BulbIcon
        },
        {
          key: 'like',
          title: '',
          icon: ShareIcon
        },
      ]
    };
  }

  handleButtonPressedRelease(event) {

  }

  renderButtonGroup() {
    this.state.buttons.map((b) => {
      return (
        <View
          onResponderRelease={this.handleButtonPressedRelease.bind(this)}
          nativeID={b.key}
        >
          <Image style={styles.buttonStyle} source={b.icon} />
          <Text>13</Text>
        </View>
      );
    });
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <Text>hi</Text>
        <View style={styles.buttonGroupStyle}>
          {this.renderButtonGroup}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    height: 50
  },

  buttonGroupStyle: {
    borderTopWith: 0.5,

  },

  buttonStyle: {

  }
});

export default PostCard;
