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
    }
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

  dialogOnFocus = () => {
    if (!this.commentBox) {
      console.warn(`${DEBUG_KEY}: [ dialogOnFocus ]: this.commentBox is undefined`);
      return;
    }
    this.setState({
      ...this.state,
      keyboardDidShow: true
    });
    this.commentBox.focus();
  }

  renderItem = (props) => {
    const { postDetail } = this.props;
    const parentRef = postDetail ? postDetail._id : undefined;
    return (
      <CommentCard
        key={props.index}
        item={props.item}
        index={props.index}
        commentDetail={{ parentType: 'Post', parentRef }}
        scrollToIndex={(i, viewOffset) => this.scrollToIndex(i, viewOffset)}
        onCommentClicked={() => this.dialogOnFocus()}
        onReportPressed={() => console.log('post detail report clicked')}
        reportType='postDetail'
        pageId={this.props.pageId}
        entityId={this.props.postId}
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
        <View style={{ backgroundColor: BACKGROUND_COLOR, flex: 1 }}>
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
// onSubmitEditing={this.handleOnCommentSubmitEditing}
// resetCommentType={resetCommentTypeFunc}


// onRefresh={this.handleRefresh.bind()}
// refreshing={this.props.refreshing}

const styles = {
  containerStyle: {
    backgroundColor: 'white',
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

const testData = [
  {
    created: new Date(),
    lastUpdated: new Date(),
    owner: {
      _id: '1028673901874',
      name: 'Jia Zeng',
      profile: {

      }
    },
    privacy: 'public',
    content: {
      text: 'this is content for the post',
      tags: [],
      links: []
    },
    postType: 'General',
    mediaRef: '',
    userRef: undefined,
    postRef: undefined,
    goalRef: undefined,
    needRef: undefined, // pairs with goalRef
    belongsToTribe: undefined,
    belongsToEvent: undefined,
  }
];

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

// const testTransformedComments = [
//   {
//     _id: '1',
//     owner: {
//       name: 'Jia Zeng'
//     },
//     numberOfChildrenShowing: 1,
//     hasMoreToShow: true,
//     parentType: 'Goal',
//     commentType: 'Suggestion',
//     suggestion: {
//       suggestionType: 'User',
//       suggestionFor: 'Step',
//       suggestionForRef: {
//         order: 1,
//         description: 'Find good books tes testset adfasdf'
//       },
//       suggestionText:
//         'You should connect with Sharon! She\'s an avid reader and an incredible writer.',
//       userRef: {
//
//       }
//     },
//     parentRef: {
//
//     },
//     childComments: [{
//       _id: 'child1',
//       owner: {
//         name: 'Mike Zeng'
//       },
//       parentType: 'Goal',
//       commentType: 'Reply',
//       replyToRef: '',
//       content: {
//         text: 'There are a total of four children. This should be a child component 1'
//       },
//       parentRef: {
//
//       },
//     }, {
//       _id: 'child2',
//       owner: {
//         name: 'Super Andy'
//       },
//       parentType: 'Goal',
//       commentType: 'Reply',
//       replyToRef: '',
//       content: {
//         text: 'this should be a child component 2'
//       },
//       parentRef: {
//
//       },
//     }, {
//       _id: 'child3',
//       owner: {
//         name: 'This is super long nameeeeeee nameeeeee nameee'
//       },
//       parentType: 'Goal',
//       commentType: 'Reply',
//       replyToRef: '',
//       content: {
//         text: 'this should be a child component 3'
//       },
//       parentRef: {
//
//       },
//     }, {
//       owner: {
//         name: 'Wait a minute'
//       },
//       parentType: 'Goal',
//       commentType: 'Reply',
//       replyToRef: '',
//       content: {
//         text: 'this should be a child component 4'
//       },
//       parentRef: {
//
//       },
//     }]
//   },
//   {
//     _id: '2',
//     owner: {
//       name: 'Jay Patel'
//     },
//     numberOfChildrenShowing: 0,
//     hasMoreToShow: false,
//     parentType: 'Goal',
//     commentType: 'Suggestion',
//     suggestion: {
//       suggestionType: 'User',
//       suggestionFor: 'Step',
//       suggestionForRef: {
//         order: 2,
//         description: 'Find good books tes testset adfasdf'
//       },
//       suggestionText: 'This is a test comment with' +
//        'a lot of lines so that we can test if that function works out of box. ' +
//        'With this length, we can really tell it. ' +
//        'Need more lines to test this feature',
//       userRef: {
//
//       }
//     },
//     content: {
//
//     },
//     parentRef: {
//
//     },
//     childComments: []
//   },
//   {
//     _id: '3',
//     owner: {
//       name: 'Lydia'
//     },
//     numberOfChildrenShowing: 0,
//     hasMoreToShow: false,
//     content: {
//       text: 'This is a very simple comment by Lydia'
//     },
//     parentType: 'Goal',
//     commentType: 'Comment',
//     // suggestion: {
//     //   suggestionType: 'User',
//     //   suggestionFor: 'Step',
//     //   suggestionForRef: {
//     //     order: 2,
//     //     description: 'Find good books tes testset adfasdf'
//     //   },
//     //   suggestionText:
//     //     'You should connect with Sharon! She\'s an avid reader and an incredible writer.',
//     //   userRef: {
//     //
//     //   }
//     // },
//     parentRef: {
//
//     }
//   }
// ];
