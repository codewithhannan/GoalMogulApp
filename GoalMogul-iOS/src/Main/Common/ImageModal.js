import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import Modal from 'react-native-modal';

// Assets
import cancel from '../../asset/utils/cancel_no_background.png';

// Constants
// Constants
import {
  IMAGE_BASE_URL
} from '../../Utils/Constants';

const { width, height } = Dimensions.get('window');

const DEBUG_KEY = '[ UI ImageModal ]';

class ImageModal extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.mediaRef !== nextProps.mediaRef) {
      return true;
    }
    // No need to re-render if mediaRef is the same
    return false;
  }

  render() {
    if (!this.props.mediaRef) return null;

    let urlToRender = this.props.mediaRef;
    if (!urlToRender.includes(IMAGE_BASE_URL)) {
      urlToRender = `${IMAGE_BASE_URL}${urlToRender}`;
    }

    return (
      <Modal
        backdropColor={'black'}
        isVisible={this.props.mediaModal}
        backdropOpacity={1}
        onSwipe={() => this.props.closeModal()}
        swipeDirection='down'
        style={{ flex: 1 }}
        deviceWidth={width}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              this.props.closeModal();
            }}
            style={{ position: 'absolute', top: 5, left: 5, padding: 10, zIndex: 2 }}
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
            source={{ uri: urlToRender }}
            style={{ width, height }}
            resizeMode='contain'
          />
        </View>
      </Modal>
    );
  }
}

ImageModal.defaultPros = {

};

const styles = {
  cancelIconStyle: {
    height: 20,
    width: 20,
    justifyContent: 'flex-end'
  },
  imageContainerStyle: {
    borderWidth: 0.5,
    padding: 1.5,
    borderColor: 'lightgray',
    alignItems: 'center',
    borderRadius: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'white'
  },
};

export default ImageModal;
