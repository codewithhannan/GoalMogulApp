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
const { width, height } = Dimensions.get('window');

class ImageModal extends React.PureComponent {
  render() {
    if (!this.props.mediaRef) return '';
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
            onPress={() => this.props.closeModal()}
            style={{ position: 'absolute', top: 5, left: 5, padding: 10 }}
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
            source={{ uri: this.props.mediaRef }}
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
