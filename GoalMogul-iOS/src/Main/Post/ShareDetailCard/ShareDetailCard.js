import React, { Component } from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import {
  MenuProvider
} from 'react-native-popup-menu';

// Actions
import {
  closeShareDetail
} from '../../../redux/modules/feed/post/ShareActions';

import {
  createCommentFromSuggestion,
  refreshComments
} from '../../../redux/modules/feed/comment/CommentActions';

// Selectors
import { getCommentByTab } from '../../../redux/modules/feed/comment/CommentSelector';
import {
  getShareDetailByTab
} from '../../../redux/modules/feed/post/PostSelector';

// Component
import SearchBarHeader from '../../Common/Header/SearchBarHeader';
import CommentBox from '../../Goal/Common/CommentBox';
import CommentCard from '../../Goal/GoalDetailCard/Comment/CommentCard';
import Report from '../../Report/Report';

import ShareDetailSection from './ShareDetailSection';

class ShareDetailCard extends Component {
  constructor(props) {
    super(props);
    this.commentBox = {};
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

  dialogOnFocus = () => this.commentBox.focus();

  renderItem = (props) => {
    // const { routes, index } = this.state.navigationState;
    return (
      <CommentCard
        key={props.index}
        item={props.item}
        index={props.index}
        scrollToIndex={(i, viewOffset) => this.scrollToIndex(i, viewOffset)}
        onCommentClicked={() => this.dialogOnFocus()}
        onReportPressed={() => console.log('share detail report clicked')}
        reportType='shareDetail'
        pageId={this.props.pageId}
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
    const { comments, shareDetail, pageId } = this.props;
    const data = comments;
    if (!shareDetail || !shareDetail.created) return '';

    return (
      <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
        <View style={{ backgroundColor: '#e5e5e5', flex: 1 }}>
          <SearchBarHeader
            backButton
            title='Share'
            onBackPress={() => this.props.closeShareDetail()}
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
              />

              <CommentBox
                onRef={(ref) => { this.commentBox = ref; }}
                pageId={pageId}
              />

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

const mapStateToProps = state => {
  const testTransformedComments = [
    {
      _id: '1',
      owner: {
        name: 'Jia Zeng'
      },
      numberOfChildrenShowing: 1,
      hasMoreToShow: true,
      parentType: 'Goal',
      commentType: 'Suggestion',
      suggestion: {
        suggestionType: 'User',
        suggestionFor: 'Step',
        suggestionForRef: {
          order: 1,
          description: 'Find good books tes testset adfasdf'
        },
        suggestionText:
          'You should connect with Sharon! She\'s an avid reader and an incredible writer.',
        userRef: {

        }
      },
      parentRef: {

      },
      childComments: [{
        _id: 'child1',
        owner: {
          name: 'Mike Zeng'
        },
        parentType: 'Goal',
        commentType: 'Reply',
        replyToRef: '',
        content: {
          text: 'There are a total of four children. This should be a child component 1'
        },
        parentRef: {

        },
      }, {
        _id: 'child2',
        owner: {
          name: 'Super Andy'
        },
        parentType: 'Goal',
        commentType: 'Reply',
        replyToRef: '',
        content: {
          text: 'this should be a child component 2'
        },
        parentRef: {

        },
      }, {
        _id: 'child3',
        owner: {
          name: 'This is super long nameeeeeee nameeeeee nameee'
        },
        parentType: 'Goal',
        commentType: 'Reply',
        replyToRef: '',
        content: {
          text: 'this should be a child component 3'
        },
        parentRef: {

        },
      }, {
        owner: {
          name: 'Wait a minute'
        },
        parentType: 'Goal',
        commentType: 'Reply',
        replyToRef: '',
        content: {
          text: 'this should be a child component 4'
        },
        parentRef: {

        },
      }]
    },
    {
      _id: '2',
      owner: {
        name: 'Jay Patel'
      },
      numberOfChildrenShowing: 0,
      hasMoreToShow: false,
      parentType: 'Goal',
      commentType: 'Suggestion',
      suggestion: {
        suggestionType: 'User',
        suggestionFor: 'Step',
        suggestionForRef: {
          order: 2,
          description: 'Find good books tes testset adfasdf'
        },
        suggestionText: 'This is a test comment with' +
         'a lot of lines so that we can test if that function works out of box. ' +
         'With this length, we can really tell it. ' +
         'Need more lines to test this feature',
        userRef: {

        }
      },
      content: {

      },
      parentRef: {

      },
      childComments: []
    },
    {
      _id: '3',
      owner: {
        name: 'Lydia'
      },
      numberOfChildrenShowing: 0,
      hasMoreToShow: false,
      content: {
        text: 'This is a very simple comment by Lydia'
      },
      parentType: 'Goal',
      commentType: 'Comment',
      // suggestion: {
      //   suggestionType: 'User',
      //   suggestionFor: 'Step',
      //   suggestionForRef: {
      //     order: 2,
      //     description: 'Find good books tes testset adfasdf'
      //   },
      //   suggestionText:
      //     'You should connect with Sharon! She\'s an avid reader and an incredible writer.',
      //   userRef: {
      //
      //   }
      // },
      parentRef: {

      }
    }
  ];

  const getShareDetail = getShareDetailByTab();
  const shareDetail = getShareDetail(state);
  const { pageId } = shareDetail;
  // TODO: uncomment
  // const { transformedComments, loading } = getCommentByTab(state, pageId);

  return {
    commentLoading: false,
    comments: testTransformedComments,
    shareDetail,
    pageId
  };
};

export default connect(
  mapStateToProps,
  {
    closeShareDetail,
    createCommentFromSuggestion,
    refreshComments
  }
)(ShareDetailCard);