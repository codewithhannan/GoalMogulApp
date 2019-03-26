import React from 'react';
import {
  View,
  Dimensions,
  ImageBackground,
  TouchableWithoutFeedback
} from 'react-native';
import _ from 'lodash';
import Modal from 'react-native-modal';

// Components
import ProgressBar from '../Goal/Common/ProgressBar';
import ImageModal from '../Common/ImageModal';

// Assets
import cancel from '../../asset/utils/cancel_no_background.png';
import photoIcon from '../../asset/utils/photoIcon.png';
import expand from '../../asset/utils/expand.png';
import RefPreview from '../Common/RefPreview';

// Styles
import { imagePreviewContainerStyle } from '../../styles';

// Constants
import {
  IMAGE_BASE_URL
} from '../../Utils/Constants';

const DEBUG_KEY = '[ UI ActivityCard.ActivityBody ]';
const { width } = Dimensions.get('window');

class ActivityBody extends React.Component {
  state = {
    mediaModal: false
  }

  renderGoalBody(goalRef) {
    const { start, end, steps, needs } = goalRef;

    const startDate = start || new Date();

    // const endDate = `${months[(end !== undefined ? end : new Date()).getMonth() - 1]} ` +
    //   `${(end || new Date()).getFullYear()}`;
    const endDate = end || new Date();

    return (
      <ProgressBar
        startTime={startDate}
        endTime={endDate}
        steps={steps}
        needs={needs}
        goalRef={goalRef}
      />
    );
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
              style={{ ...styles.mediaStyle, ...imagePreviewContainerStyle }}
              source={{ uri: imageUrl }}
              imageStyle={{ borderRadius: 8, resizeMode: 'cover' }}
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
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 15,
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  padding: 2,
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Image
                  source={expand}
                  style={{
                    width: 16,
                    height: 16,
                    tintColor: '#fafafa',
                    borderRadius: 4,
                  }}
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

  renderPostBody(postRef) {
    if (!postRef) return null;
    const { postType, goalRef, needRef, stepRef, userRef } = postRef;
    if (postType === 'General') {
      return this.renderPostImage(postRef.mediaRef);
    }

    let item = goalRef;
    if (postType === 'ShareNeed') {
      item = getNeedFromRef(goalRef, needRef);
    }

    if (postType === 'ShareStep') {
      item = getStepFromGoal(goalRef, stepRef);
    }

    if (postType === 'ShareUser') {
      item = userRef;
    }

    if (postType === 'SharePost') {
      item = postRef.postRef;
    }

    return (
      <View>
        <RefPreview item={item} postType={postType} goalRef={goalRef} />
      </View>
    );
  }

  // Render Activity Card body
  renderCardContent(item) {
    const { postRef, goalRef, actedUponEntityType } = item;
    if (goalRef === null) {
      console.log(`${DEBUG_KEY}: rendering card content: `, item);
    }

    if (actedUponEntityType === 'Post') {
      return this.renderPostBody(postRef);
    }

    if (actedUponEntityType === 'Goal') {
      return this.renderGoalBody(goalRef);
    }

    // Incorrect acteduponEntityType
    console.warn(`${DEBUG_KEY}: incorrect actedUponEntityType: ${actedUponEntityType}`);
    return null;
  }

  render() {
    const { item } = this.props;
    if (!item) return null;

    return (
      <View style={{ marginTop: 10 }}>
        {this.renderCardContent(item)}
      </View>
    );
  }
}

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
  }
};

export default ActivityBody;
