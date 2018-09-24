import React from 'react';
import {
  View,
  Modal,
  Image,
  Dimensions,
  TouchableOpacity,
  ImageBackground
} from 'react-native';

import {
  switchCase
} from '../../../redux/middleware/utils';

// Assets
import cancel from '../../../asset/utils/cancel_no_background.png';
import photoIcon from '../../../asset/utils/photoIcon.png';
import expand from '../../../asset/utils/expand.png';
import RefPreview from '../../Common/RefPreview';

import TestImage from '../../../asset/TestEventImage.png';


// Constants
const DEBUG_KEY = '[ UI ProfilePostCard.ProfilePostBody ]';
const { width } = Dimensions.get('window');

class ProfilePostBody extends React.Component {
  state = {
    mediaModal: false
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

  renderPostBody(item) {
    if (!item) return '';
    const { postType } = item;
    if (postType === 'General') {
      return this.renderPostImage(item.mediaRef);
    }

    const previewItem = switchItem(item, postType);
    return (
      <View>
        <RefPreview item={previewItem} postType={postType} />
      </View>
    );
  }

  render() {
    const { item } = this.props;
    if (!item) return '';

    return (
      <View style={{ marginTop: 10 }}>
        {this.renderPostBody(item)}
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
    height: 13,
    width: 13,
    justifyContent: 'flex-end'
  },
  mediaStyle: {
    height: width / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
};

const switchItem = (item, postType) => switchCase({
  ShareNeed: item.goalRef,
  ShareGoal: item.goalRef,
  SharePost: item.postRef,
  ShareUser: item.userRef
})('ShareGoal')(postType);

export default ProfilePostBody;
