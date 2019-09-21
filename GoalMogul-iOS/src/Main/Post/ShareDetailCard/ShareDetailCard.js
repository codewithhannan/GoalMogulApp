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
import { getBottomSpace } from 'react-native-iphone-x-helper';

// Actions
import {
  closeShareDetail
} from '../../../redux/modules/feed/post/ShareActions';

import {
  fetchPostDetail,
  markUserViewPost
} from '../../../redux/modules/feed/post/PostActions';

import {
  refreshComments
} from '../../../redux/modules/feed/comment/CommentActions';

// Selectors
import { 
  // getCommentByTab,
  makeGetCommentByEntityId
} from '../../../redux/modules/feed/comment/CommentSelector';

import {
  // getShareDetailByTab,
  makeGetPostById
} from '../../../redux/modules/feed/post/PostSelector';

// Component
import SearchBarHeader from '../../Common/Header/SearchBarHeader';
import CommentBox from '../../Goal/Common/CommentBoxV2';
import CommentCard from '../../Goal/GoalDetailCard/Comment/CommentCard';

import ShareDetailSection from './ShareDetailSection';

// Utils
import { switchCase } from '../../../redux/middleware/utils';

// Styles
import {
  BACKGROUND_COLOR
} from '../../../styles';
import { Logger } from '../../../redux/middleware/utils/Logger';
import { getParentCommentId } from '../../../redux/middleware/utils';
import LikeListModal from '../../Common/Modal/LikeListModal';

const DEBUG_KEY = '[ UI ShareDetailCard ]';
const TABBAR_HEIGHT = 48.5;
const TOTAL_HEIGHT = TABBAR_HEIGHT;

class ShareDetailCard extends Component {
  constructor(props) {
    super(props);
    this.commentBox = undefined;
    this.state = {
      position: 'absolute',
      commentBoxPadding: new Animated.Value(0),
      keyboardDidShow: false
    };
    this.handleScrollToCommentItem = this.handleScrollToCommentItem.bind(this);
  }

  componentDidMount() {
    // Add listeners for keyboard
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide', this.keyboardWillHide);

    const { initialProps, postId, pageId, tab, shareDetail, userId } = this.props;
    console.log(`${DEBUG_KEY}: [ componentDidMount ]: initialProps:`, initialProps);

    // Send tracking event to mark this share as viewed
    if (shareDetail && shareDetail.owner && shareDetail.owner._id && shareDetail.owner._id !== userId) {
      this.props.markUserViewPost(postId);
    }

    // Check if needed to scroll to comment after loading
    const refreshCommentsCallback = initialProps && initialProps.initialScrollToComment && initialProps.commentId
      ? () => this.handleScrollToCommentItem(initialProps.commentId)
      : undefined;

    this.props.refreshComments('Post', postId, tab, pageId, refreshCommentsCallback);

    // Check if there is any initial operations
    if (initialProps) {
      const { initialFocusCommentBox } = initialProps;

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
          toValue: e.endCoordinates.height - TOTAL_HEIGHT - getBottomSpace(),
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

  /**
   * Open comment like list
   */
  openCommentLikeList = (likeListParentType, likeListParentId) => {
    console.log(`${DEBUG_KEY}: show comment like list: ${likeListParentType}, ${likeListParentId}`);
    this.setState({
      ...this.state,
      showCommentLikeList: true,
      likeListParentType,
      likeListParentId
    });
  }

  /**
   * Close comment like list
   */
  closeCommentLikeList = () => {
    console.log(`${DEBUG_KEY}: close comment like list`);
    this.setState({
      ...this.state,
      showCommentLikeList: false,
      likeListParentId: undefined,
      likeListParentType: undefined
    });
  }

  /**
   * Scroll to comment item
   */
  handleScrollToCommentItem = (commentId) => {
    const { originalComments, comments } = this.props;

    Logger.log(`${DEBUG_KEY}: [ handleScrollToCommentItem ]: originalComments`, originalComments, 2);
    const parentCommentId = getParentCommentId(commentId, originalComments);

    Logger.log(`${DEBUG_KEY}: [ handleScrollToCommentItem ]: commentId`, commentId, 2);
    if (!parentCommentId) return; // Do nothing since it's no loaded. Defensive coding
    
    Logger.log(`${DEBUG_KEY}: [ handleScrollToCommentItem ]: parentCommentId`, parentCommentId, 2);
    const parentCommentIndex = comments.findIndex(c => c._id === parentCommentId);
    Logger.log(`${DEBUG_KEY}: [ handleScrollToCommentItem ]: parentCommentIndex`, parentCommentIndex, 2);
    if (this.refs['flatList'] === undefined || parentCommentIndex === -1) return;

    setTimeout(() => {
      this.refs['flatList'].scrollToIndex({
        index: parentCommentIndex,
        animated: true
      });
    }, 200);
  }

  handleRefresh = () => {
    // const { routes, index } = this.state.navigationState;
    const { tab, shareDetail, pageId } = this.props;
    // if (routes[index].key === 'comments') {
      this.props.refreshComments('Post', shareDetail._id, tab, pageId);
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
    // const { routes, index } = this.state.navigationState;
    const { shareDetail, pageId, postId } = this.props;
    const parentRef = shareDetail ? shareDetail._id : undefined;
    return (
      <CommentCard
        key={props.index}
        item={props.item}
        index={props.index}
        scrollToIndex={(i, viewOffset) => this.scrollToIndex(i, viewOffset)}
        commentDetail={{ parentType: 'Post', parentRef }}
        onCommentClicked={this.dialogOnFocus}
        onReportPressed={() => console.log('share detail report clicked')}
        reportType='shareDetail'
        pageId={pageId}
        entityId={postId}
        openCommentLikeList={this.openCommentLikeList}
      />
    );
  }

  renderShareDetailSection(shareDetail) {
    return (
      <View style={{ marginBottom: 1 }}>
        <ShareDetailSection
          item={shareDetail}
          onSuggestion={() => this.dialogOnFocus()}
          pageId={this.props.pageId}
        />
      </View>
    );
  }

  render() {
    const { comments, shareDetail, pageId, postId } = this.props;
    const data = comments;
    if (!shareDetail || !shareDetail.created) return null;
    const title = switchCaseTitle(shareDetail.postType);

    return (
      <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
        <View style={styles.containerStyle}>
          <LikeListModal 
            isVisible={this.state.showCommentLikeList} 
            closeModal={this.closeCommentLikeList}
            parentId={this.state.likeListParentId}
            parentType={this.state.likeListParentType}
            clearDataOnHide
          />
          <SearchBarHeader
            backButton
            title={title}
            onBackPress={() => this.props.closeShareDetail(postId, pageId)}
          />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
              <FlatList
                ref="flatList"
                data={data}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                ListHeaderComponent={() => this.renderShareDetailSection(shareDetail)}
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
    // const getShareDetail = getShareDetailByTab();
    // const shareDetail = getShareDetail(state);
    // const { pageId } = shareDetail;
    // const comments = getCommentByTab(state, props.pageId);

    const { userId } = state.user;
    const { pageId, postId } = props;
    const { post } = getPostById(state, postId);
    const shareDetail = post;

    const comments = getCommentByEntityId(state, postId, pageId);    
    const { transformedComments, loading, data } = comments || {
      transformedComments: [],
      loading: false,
      data: []
    };
  
    return {
      commentLoading: loading,
      comments: transformedComments,
      shareDetail,
      pageId,
      userId,
      originalComments: data, // All comments in raw form,
      tab: state.navigation.tab,
    };
  };
  return mapStateToProps;
};

const switchCaseTitle = (postType) => switchCase({
  ShareUser: 'Shared User',
  SharePost: 'Shared Post',
  ShareGoal: 'Shared Goal',
  ShareNeed: 'Shared Need',
  ShareStep: 'Shared Step'
})('SharePost')(postType);

export default connect(
  makeMapStateToProps,
  {
    closeShareDetail,
    refreshComments,
    fetchPostDetail,
    markUserViewPost
  }
)(ShareDetailCard);
