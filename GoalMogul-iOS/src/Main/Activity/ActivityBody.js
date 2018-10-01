import React from 'react';
import {
  View,
  Modal,
  Image,
  Dimensions,
  TouchableOpacity,
  ImageBackground
} from 'react-native';

// Components
import ProgressBar from '../Goal/Common/ProgressBar';

// Assets
import cancel from '../../asset/utils/cancel_no_background.png';
import photoIcon from '../../asset/utils/photoIcon.png';
import expand from '../../asset/utils/expand.png';
import RefPreview from '../Common/RefPreview';

import TestImage from '../../asset/TestEventImage.png';


// Constants
const DEBUG_KEY = '[ UI ActivityCard.ActivityBody ]';
const { width } = Dimensions.get('window');

class ActivityBody extends React.Component {
  state = {
    mediaModal: false
  }

  renderGoalBody(goalRef) {
    const { start, end } = goalRef;

    const startDate = start || new Date();

    // const endDate = `${months[(end !== undefined ? end : new Date()).getMonth() - 1]} ` +
    //   `${(end || new Date()).getFullYear()}`;
    const endDate = end || new Date();

    return (
      <ProgressBar startTime={startDate} endTime={endDate} />
    );
  }

  // Current media type is only picture
  renderPostImage(url) {
    // TODO: update this to be able to load image
    if (!url) {
      return '';
    }
      return (
        <View>
          <ImageBackground
            style={styles.mediaStyle}
            source={TestImage}
            imageStyle={{ borderRadius: 8, opacity: 0.7, resizeMode: 'stretch' }}
          >
            <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
              <Image
                source={photoIcon}
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  height: 40,
                  width: 50,
                  tintColor: '#fafafa'
                }}
              />
            </View>

            <TouchableOpacity
              onPress={() => this.setState({ mediaModal: true })}
              style={{ position: 'absolute', top: 10, right: 15 }}
            >
              <Image
                source={expand}
                style={{ width: 15, height: 15, tintColor: '#fafafa' }}
              />
            </TouchableOpacity>
          </ImageBackground>
          {this.renderPostImageModal(url)}
        </View>
      );
  }


  renderPostImageModal(uri) {
    if (!uri) {
      return '';
    }
    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={this.state.mediaModal}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black'
          }}
        >
          <TouchableOpacity
            onPress={() => { this.setState({ mediaModal: false }); }}
            style={{ position: 'absolute', top: 30, left: 15, padding: 10 }}
          >
            <Image
              source={cancel}
              style={{
                ...styles.cancelIconStyle,
                tintColor: 'white'
              }}
            />
          </TouchableOpacity>
          <Image
            source={TestImage}
            style={{ width, height: 200 }}
            resizeMode='cover'
          />
        </View>
      </Modal>
    );
  }

  renderPostBody(postRef) {
    if (!postRef) return '';
    const { postType } = postRef;
    if (postType === 'General') {
      return this.renderPostImage(postRef.mediaRef);
    }

    return (
      <View>
        <RefPreview item={postRef} postType={postType} />
      </View>
    );
  }

  // Render Activity Card body
  renderCardContent(item) {
    const { postRef, goalRef, actedUponEntityType } = item;

    if (actedUponEntityType === 'Post') {
      return this.renderPostBody(postRef);
    }

    if (actedUponEntityType === 'Goal') {
      return this.renderGoalBody(goalRef);
    }

    // Incorrect acteduponEntityType
    console.warn(`${DEBUG_KEY}: incorrect actedUponEntityType: ${actedUponEntityType}`);
    return '';
  }

  render() {
    const { item } = this.props;
    if (!item) return '';

    return (
      <View style={{ marginTop: 10 }}>
        {this.renderCardContent(item)}
      </View>
    );
  }
}

const styles = {
  // Post image and modal style
  postImageStyle: {
    width,
    height: width
  },
  cancelIconStyle: {
    height: 20,
    width: 20,
    justifyContent: 'flex-end'
  },
  mediaStyle: {
    height: width / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
};

export default ActivityBody;
