import React from 'react';
import {
  View,
  Modal,
  Image,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  TouchableWithoutFeedback
} from 'react-native';
import _ from 'lodash';

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
      return '';
    }
    const imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${url}`;
      return (
        <TouchableWithoutFeedback
          onPress={() => this.setState({ mediaModal: true })}
        >
          <View>
            <ImageBackground
              style={styles.mediaStyle}
              source={{ uri: imageUrl }}
              imageStyle={{ borderRadius: 8, resizeMode: 'stretch' }}
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

              <TouchableOpacity activeOpacity={0.85}
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
          <TouchableOpacity activeOpacity={0.85}
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
            source={{ uri: imageUrl }}
            style={{ width, height: 200 }}
            resizeMode='cover'
          />
        </View>
      </Modal>
    );
  }

  renderPostBody(postRef) {
    if (!postRef) return '';
    const { postType, goalRef, needRef, stepRef, userRef } = postRef;
    if (postType === 'General') {
      return this.renderPostImage(postRef.mediaRef);
    }

    let item;
    if (postType === 'ShareNeed') {
      item = getNeedFromRef(goalRef, needRef);
    }

    if (postType === 'ShareStep') {
      item = getStepFromGoal(goalRef, stepRef);
    }

    if (postType === 'ShareUser') {
      item = userRef;
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
  },
};

export default ActivityBody;
