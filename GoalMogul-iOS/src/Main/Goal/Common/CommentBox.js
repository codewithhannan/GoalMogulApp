import React, { Component } from 'react';
import {
  View,
  TextInput,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';

// Actions
import {
  newCommentOnTextChange
} from '../../../redux/modules/feed/comment/CommentActions';

// Assets
import PhotoIcon from '../../../asset/utils/photoIcon.png';
import LightBulb from '../../../asset/utils/lightBulb.png';

// Consts
const maxHeight = 120;

class CommentBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newValue: '',
      height: 34
    };
  }

  componentDidMount() {
    if (this.props.onRef !== null) {
      this.props.onRef(this);
    }
  }

  focus() {
    this.refs['textInput'].focus();
  }

  updateSize = (height) => {
    this.setState({
      height: Math.min(height, maxHeight)
    });
  }

  renderSuggestionIcon() {
    return (
      <TouchableOpacity style={styles.iconContainerStyle}>
        <Image
          source={LightBulb}
          style={{
            ...styles.iconStyle,
            tintColor: '#f5d573'
          }}
        />
      </TouchableOpacity>
    );
  }

  renderLeftIcons() {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginLeft: 5,
          marginRight: 5,
          marginBottom: 5
        }}
      >
        {this.renderSuggestionIcon()}
        {this.renderImageIcon()}
      </View>
    );
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
        <Text style={{ color, fontSize: 13, fontWeight: '500', padding: 5, margin: 5 }}>Post</Text>
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
      height: Math.max(36, height + 6)
    };

    const inputStyle = {
      ...styles.inputStyle,
      height: Math.max(30, height)
    };

    return (
      <SafeAreaView
        style={{
          backgroundColor: 'white',
          shadowColor: 'black',
          shadowOffset: { width: 0, height: 1.5 },
          shadowOpacity: 0.5,
          shadowRadius: 1,
          elevation: 0.5
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          {this.renderLeftIcons()}
          <View style={inputContainerStyle}>
            <TextInput
              ref="textInput"
              placeholder="Write a comment..."
              onChangeText={(val) => this.props.newCommentOnTextChange(val)}
              style={inputStyle}
              editable
              maxHeight={maxHeight}
              multiline
              value={this.props.newComment.contentText}
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
    justifyContent: 'center',
    borderRadius: 18,
    marginTop: 5,
    marginBottom: 5,
    borderColor: '#cbd6d8',
    borderWidth: 1,
    flex: 1
  },
  inputStyle: {
    paddingTop: 6,
    paddingBottom: 2,
    padding: 13,
    backgroundColor: 'white',
    borderRadius: 22,
  },
  postContainerStyle: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  iconStyle: {
    height: 24,
    width: 24,
    tintColor: '#cbd6d8',
    margin: 5
  },
  iconContainerStyle: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  }
};

const mapStateToProps = state => {
  const { newComment } = state.comment;

  return {
    newComment
  };
};

export default connect(
  mapStateToProps,
  {
    newCommentOnTextChange
  }
)(CommentBox);
