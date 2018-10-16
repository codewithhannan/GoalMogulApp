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

// Components
import SuggestionPreview from '../GoalDetailCard/SuggestionPreview';

// Actions
import {
  newCommentOnTextChange,
  openCurrentSuggestion,
  removeSuggestion,
  createSuggestion
} from '../../../redux/modules/feed/comment/CommentActions';

// Selectors
import {
  getNewCommentByTab
} from '../../../redux/modules/feed/comment/CommentSelector';

// Assets
import PhotoIcon from '../../../asset/utils/photoIcon.png';
import LightBulb from '../../../asset/utils/makeSuggestion.png';

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

  //tintColor: '#f5d573'
  renderSuggestionIcon() {
    return (
      <TouchableOpacity
        style={styles.iconContainerStyle}
        onPress={() => {
          console.log('suggestion on click in comment box');
          this.props.createSuggestion();
        }}
      >
        <Image
          source={LightBulb}
          style={{
            height: 28,
            width: 28,
            margin: 4
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
        <Image
          source={PhotoIcon}
          style={{
            ...styles.iconStyle,
            tintColor: '#cbd6d8'
          }}
        />
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

  renderSuggestionPreview() {
    const { pageId, newComment } = this.props;
    const { showAttachedSuggestion, suggestion } = newComment;

    if (showAttachedSuggestion) {
      return (
        <SuggestionPreview
          item={suggestion}
          onRemove={() => {
            this.props.removeSuggestion(pageId);
          }}
          onPress={() => {
            this.props.openCurrentSuggestion(pageId);
          }}
        />
      );
    }

    return '';
  }

  render() {
    const { pageId, newComment } = this.props;
    if (!newComment) return '';

    const inputContainerStyle = {
      ...styles.inputContainerStyle,
      // height: Math.max(36, height + 6)
    };

    const inputStyle = {
      ...styles.inputStyle,
      // height: Math.max(30, height)
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
        {this.renderSuggestionPreview()}
        <View style={{ flexDirection: 'row' }}>
          {this.renderLeftIcons()}
          <View style={inputContainerStyle}>
            <TextInput
              ref="textInput"
              placeholder="Write a comment..."
              onChangeText={(val) => this.props.newCommentOnTextChange(val, pageId)}
              style={inputStyle}
              editable
              maxHeight={maxHeight}
              multiline
              value={this.props.newComment.contentText}
            />
          </View>
          {this.renderPost()}
        </View>
      </SafeAreaView>
    );
  }
}
// onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}

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
    margin: 5
  },
  iconContainerStyle: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  }
};

const mapStateToProps = (state, props) => {

  return {
    newComment: getNewCommentByTab(state, props.pageId)
  };
};

export default connect(
  mapStateToProps,
  {
    newCommentOnTextChange,
    openCurrentSuggestion,
    removeSuggestion,
    createSuggestion
  }
)(CommentBox);
