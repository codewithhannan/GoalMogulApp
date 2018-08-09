import React, { Component } from 'react';
import {
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  SafeAreaView,
  Image
} from 'react-native';

// Assets
import PhotoIcon from '../../../asset/utils/photoIcon.png';

class CommentBox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      newValue: '',
      height: 40
    };
  }

  updateSize = (height) => {
    this.setState({
      height
    });
  }

  renderSuggestionIcon() {

  }

  renderImageIcon() {
    return (
      <View style={styles.iconContainerStyle}>
        <Image source={PhotoIcon} style={styles.iconStyle} />
      </View>
    );
  }

  renderPost() {
    const color = '#45C9F6';
    return (
      <View style={styles.postContainerStyle}>
        <Text style={{ color, fontSize: 13, fontWeight: '500' }}>Post</Text>
      </View>
    );
  }

  render() {
    const { value, height } = this.state;

    let newStyle = {
      height
    }

    const inputContainerStyle = {
      ...styles.inputContainerStyle,
      height: height + 4
    };

    const inputStyle = {
      ...styles.inputStyle,
      height
    }

    return (
      <SafeAreaView style={{ backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row' }}>
          {this.renderImageIcon()}
          <View style={inputContainerStyle}>
            <TextInput
              placeholder="Your Placeholder"
              onChangeText={(value) => this.setState({value})}
              style={inputStyle}
              editable
              multiline
              value={value}
              onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
            />
          </View>
          {this.renderPost()}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = {
  inputContainerStyle: {
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'black',
    flex: 1
  },
  inputStyle: {
    minHeight: 30,
    width: '60%',
    backgroundColor: 'white',
    maxHeight: 100
  },
  postContainerStyle: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  iconStyle: {
    height: 20,
    width: 20,
    padding: 4
  },
  iconContainerStyle: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  }
};

export default CommentBox;
