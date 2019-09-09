import React from 'react';
import {
  View,
  Dimensions,
  ImageBackground,
  TouchableWithoutFeedback
} from 'react-native';
import _ from 'lodash';

import {
  switchCase
} from '../../../redux/middleware/utils';

// Components
import ImageModal from '../../Common/ImageModal';

// Assets
import RefPreview from '../../Common/RefPreview';
// import TestImage from '../../../asset/TestEventImage.png';

// Styles
import { imagePreviewContainerStyle } from '../../../styles';
import { IMAGE_BASE_URL } from '../../../Utils/Constants';

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
      return null;
    }
    const imageUrl = `${IMAGE_BASE_URL}${url}`;
      return (
        <TouchableWithoutFeedback
          onPress={() => this.setState({ mediaModal: true })}
        >
          <View>
            <ImageBackground
              style={{ ...styles.mediaStyle, ...imagePreviewContainerStyle, borderRadius: 8, backgroundColor: 'black' }}
              source={{ uri: imageUrl }}
              imageStyle={{ borderRadius: 8, opacity: 0.8, resizeMode: 'cover' }}
            >
            {/*
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

              <TouchableOpacity activeOpacity={0.6}
                onPress={() => this.setState({ mediaModal: true })}
                style={{ position: 'absolute', top: 10, right: 15 }}
              >
                <Image
                  source={expand}
                  style={{ width: 15, height: 15, tintColor: '#fafafa' }}
                />
              </TouchableOpacity>
            */}
            </ImageBackground>
            {this.renderPostImageModal(imageUrl)}
          </View>
        </TouchableWithoutFeedback>
      );
  }


  renderPostImageModal(imageUrl) {
    return (
      <ImageModal
        mediaRef={imageUrl}
        mediaModal={this.state.mediaModal}
        closeModal={() => this.setState({ mediaModal: false })}
      />
    );
  }

  renderPostBody(item) {
    const { postType } = item;
    if (postType === 'General') {
      return this.renderPostImage(item.mediaRef);
    }

    if (this.props.showRefPreview === false) return null;
    const previewItem = switchItem(item, postType);
    return (
      <View>
        <RefPreview item={previewItem} postType={postType} goalRef={item.goalRef} />
      </View>
    );
  }

  render() {
    const { item } = this.props;
    if (!item) return null;

    return (
      <View style={{ marginTop: 8 }}>
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

const switchItem = (item, postType) => switchCase({
  ShareNeed: getNeedFromRef(item.goalRef, item.needRef),
  ShareGoal: item.goalRef,
  SharePost: item.postRef,
  ShareUser: item.userRef,
  ShareStep: getStepFromGoal(item.goalRef, item.stepRef)
})('ShareGoal')(postType);

const getStepFromGoal = (goal, stepRef) => getItemFromGoal(goal, 'steps', stepRef);

const getNeedFromRef = (goal, needRef) => getItemFromGoal(goal, 'needs', needRef);

const getItemFromGoal = (goal, type, ref) => {
  let ret;
  if (goal) {
    _.get(goal, `${type}`).forEach((item) => {
      if (item._id === ref) {
        ret = item;
      }
    });
  }
  return ret;
};

export default ProfilePostBody;
