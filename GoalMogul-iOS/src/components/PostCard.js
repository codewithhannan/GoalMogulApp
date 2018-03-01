import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';

/* Import icons */
import LikeIcon from '../asset/utils/like.png';
import BulbIcon from '../asset/utils/bulb.png';
import ShareIcon from '../asset/utils/share.png';

import profilePic from '../asset/test-profile-pic.png';

/* Component */
import Card from './Card'
import ContentContainer from './ContentContainer'

class PostCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [
        {
          key: 'like',
          title: '',
          icon: LikeIcon,
          data: 13
        },
        {
          key: 'bulk',
          title: '',
          icon: BulbIcon,
          data: 128
        },
        {
          key: 'share',
          title: '',
          icon: ShareIcon,
          data: 1000
        },
      ]
    };
  }

  handleButtonPressedRelease(event) {

  }


  renderButtonGroup() {
    return this.state.buttons.map((b) => {
      console.log(b.key);
      return (
        <View
          style={styles.buttonContainerStyle}
          onResponderRelease={this.handleButtonPressedRelease.bind(this)}
          nativeID={b.key}
        >
          <Image style={styles.buttonStyle} source={LikeIcon} />
          <Text style={styles.buttonCountStyle}>{b.data}</Text>
        </View>
      );
    });
  }

  render() {
    return (
      <Card>
        <View style={styles.bodyContainerStyle}>
          <Image style={styles.imageContainerStyle} source={profilePic} />
          <ContentContainer />
        </View>

        <View style={styles.progressBarContainerStyle}>
          <Text>Progress Bar</Text>
        </View>

        <View style={styles.buttonGroupStyle}>
          {this.renderButtonGroup()}
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    height: 50
  },

  buttonGroupStyle: {
    borderTopWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 8,
    paddingBottom: 8

  },
  buttonContainerStyle: {
    flexDirection: 'row'
  },
  buttonStyle: {
    marginRight: 8
  },
  buttonCountStyle: {
    paddingTop: 3
  },
  bodyContainerStyle: {
    margin: 14,
    flexDirection: 'row'
  },
  progressBarContainerStyle: {
    marginLeft: 14,
    marginRight: 14,
    marginBottom: 14
  },
  imageContainerStyle: {
    height: 55,
    width: 55
  }
});

export default PostCard;
