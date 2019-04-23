import React, { Component } from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Animated,
  Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import {
  MenuProvider
} from 'react-native-popup-menu';

// Actions
import {
  closePostDetail,
  editPost
} from '../../../redux/modules/feed/post/PostActions';

import {
  refreshComments
} from '../../../redux/modules/feed/comment/CommentActions';

// Selectors
import { 
  getCommentByTab,
  makeGetCommentByEntityId
} from '../../../redux/modules/feed/comment/CommentSelector';

import {
  getPostDetailByTab,
  makeGetPostById
} from '../../../redux/modules/feed/post/PostSelector';

// Component
import SearchBarHeader from '../../Common/Header/SearchBarHeader';
import CommentBox from '../../Goal/Common/CommentBoxV2';
import CommentCard from '../../Goal/GoalDetailCard/Comment/CommentCard';

import PostDetailSection from './PostDetailSection';

// Styles
import {
  BACKGROUND_COLOR
} from '../../../styles';

const DEBUG_KEY = '[ UI PostDetailCard ]';
const TABBAR_HEIGHT = 48.5;
const TOTAL_HEIGHT = TABBAR_HEIGHT;

class PostDetailCard extends Component {
  constructor(props) {
    super(props);
    this.commentBox = undefined;
    this.state = {
      position: 'absolute',
      commentBoxPadding: new Animated.Value(0),
      keyboardDidShow: false
    };
  }

  componentDidMount() {
    // Add listeners for keyboard
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide', this.keyboardWillHide);

    const { initialProps, postDetail } = this.props;
    console.log(`${DEBUG_KEY}: [ componentDidMount ]: initialProps is:`, initialProps);

    // Check if there is any initial operations
    if (initialProps) {
      const { initialShowPostModal, initialFocusCommentBox } = initialProps;

      // Display CreatePostModal
      if (initialShowPostModal) { 
        setTimeout(() => {
          this.props.editPost(postDetail);  
        }, 750);
        return;
      }

      // Focus comment box
      if (initialFocusCommentBox) {
        setTimeout(() => {
          this.dialogOnFocus();
        }, 700);
        return;
      }
    }
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  keyboardWillShow = (e) => {
    console.log(`${DEBUG_KEY}: [ keyboardWillShow ]`);
    if (!this.state.keyboardDidShow) {
      this.dialogOnFocus();
    }
    const timeout = ((TOTAL_HEIGHT * 210) / e.endCoordinates.height);
    Animated.sequence([
      Animated.delay(timeout),
      Animated.parallel([
        Animated.timing(this.state.commentBoxPadding, {
          toValue: e.endCoordinates.height - TOTAL_HEIGHT,
          duration: (210 - timeout)
        }),
      ])
    ]).start();
  }

  keyboardWillHide = () => {
    console.log(`${DEBUG_KEY}: [ keyboardWillHide ]`);
    Animated.parallel([
      Animated.timing(this.state.commentBoxPadding, {
        toValue: 0,
        duration: 210
      }),
    ]).start();
    this.setState({
      ...this.state,
      keyboardDidShow: false
    });
  }

  handleRefresh = () => {
    // const { routes, index } = this.state.navigationState;
    const { tab, postDetail, pageId } = this.props;
    // if (routes[index].key === 'comments') {
      this.props.refreshComments('Post', postDetail._id, tab, pageId);
    // }
  }

  keyExtractor = (item) => item._id;

  scrollToIndex = (index, viewOffset = 0) => {
    this.refs['flatList'].scrollToIndex({
      index,
      animated: true,
      viewPosition: 1,
      viewOffset
    });
  }

  /**
   * Only pass in 'Reply' as type if it's a reply
   */
  dialogOnFocus = (type) => {
    if (!this.commentBox) {
      console.warn(`${DEBUG_KEY}: [ dialogOnFocus ]: this.commentBox is undefined`);
      return;
    }
    this.setState({
      ...this.state,
      keyboardDidShow: true
    });
    this.commentBox.focusForReply(type);
  }

  renderItem = (props) => {
    const { postDetail, pageId, postId } = this.props;
    const parentRef = postDetail ? postDetail._id : undefined;
    return (
      <CommentCard
        key={props.index}
        item={props.item}
        index={props.index}
        commentDetail={{ parentType: 'Post', parentRef }}
        scrollToIndex={(i, viewOffset) => this.scrollToIndex(i, viewOffset)}
        onCommentClicked={this.dialogOnFocus}
        onReportPressed={() => console.log('post detail report clicked')}
        reportType='postDetail'
        pageId={pageId}
        entityId={postId}
      />
    );
  }

  renderPostDetailSection(postDetail) {
    return (
      <View style={{ marginBottom: 1 }}>
        <PostDetailSection
          item={postDetail}
          onSuggestion={() => this.dialogOnFocus()}
          pageId={this.props.pageId}
          postId={this.props.postId}
        />
      </View>
    );
  }

  render() {
    const { comments, postDetail, pageId, postId } = this.props;
    const data = comments;

    return (
      <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
        <View style={styles.containerStyle}>
          <SearchBarHeader
            backButton
            title='Post'
            onBackPress={() => this.props.closePostDetail(postId, pageId)}
          />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
              <FlatList
                ref="flatList"
                data={data}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                ListHeaderComponent={() => this.renderPostDetailSection(postDetail)}
                refreshing={this.props.commentLoading}
                onRefresh={this.handleRefresh}
                ListFooterComponent={<View style={{ height: 43, backgroundColor: 'transparent' }} />}
              />

              <Animated.View
                style={[
                  styles.composerContainer, {
                    position: this.state.position,
                    paddingBottom: this.state.commentBoxPadding,
                    backgroundColor: 'white',
                    zIndex: 3
                  }
                ]}
              >
                <CommentBox
                  onRef={(ref) => { this.commentBox = ref; }}
                  hasSuggestion={false}
                  pageId={pageId}
                  entityId={postId}
                />
              </Animated.View>

            </KeyboardAvoidingView>
        </View>
      </MenuProvider>
    );
  }
}

// onRefresh={this.handleRefresh.bind()}
// refreshing={this.props.refreshing}

const styles = {
  containerStyle: {
    backgroundColor: BACKGROUND_COLOR, 
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  iconStyle: {
    alignSelf: 'center',
    fontSize: 20,
    marginLeft: 5,
    marginTop: 2
  },
  backdrop: {
    backgroundColor: 'gray',
    opacity: 0.5
  },
  composerContainer: {
    left: 0,
    right: 0,
    bottom: 0
  },
};

const makeMapStateToProps = () => {
  const getPostById = makeGetPostById();
  const getCommentByEntityId = makeGetCommentByEntityId();

  const mapStateToProps = (state, props) => {
    // TODO: uncomment
    // const comments = getCommentByTab(state, props.pageId);
    // const getPostDetail = getPostDetailByTab();
    // const postDetail = getPostDetail(state);
    // const { pageId } = postDetail;

    const { pageId, postId } = props;
    const { post } = getPostById(state, postId);
    const postDetail = post;

    const comments = getCommentByEntityId(state, postId, pageId);
    
    const { transformedComments, loading } = comments || {
      transformedComments: [],
      loading: false
    };
  
    return {
      commentLoading: loading,
      comments: transformedComments,
      postDetail,
      pageId
    };
  };

  return mapStateToProps;
};

export default connect(
  makeMapStateToProps,
  {
    closePostDetail,
    refreshComments,
    editPost
  }
)(PostDetailCard);
