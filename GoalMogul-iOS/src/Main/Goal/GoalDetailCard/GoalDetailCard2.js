import React, { Component } from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  MenuProvider
} from 'react-native-popup-menu';

// Actions
import {
  closeGoalDetail,
  goalDetailSwitchTab
} from '../../../redux/modules/goal/GoalDetailActions';

import {
  createCommentFromSuggestion,
  attachSuggestion,
  cancelSuggestion,
  openSuggestionModal,
  refreshComments
} from '../../../redux/modules/feed/comment/CommentActions';

// selector
import { getGoalStepsAndNeeds, getGoalDetailByTab } from '../../../redux/modules/goal/selector';
import {
  getCommentByTab,
  getNewCommentByTab
} from '../../../redux/modules/feed/comment/CommentSelector';

// Component
import SearchBarHeader from '../../../Main/Common/Header/SearchBarHeader';
import SuggestionModal from './SuggestionModal3';
import TabButtonGroup from '../Common/TabButtonGroup';
import CommentBox from '../Common/CommentBox';
import StepAndNeedCard from './StepAndNeedCard';
import CommentCard from './Comment/CommentCard';
import Report from '../../../Main/Report/Report';

import GoalDetailSection from './GoalDetailSection';

class GoalDetailCard2 extends Component {
  constructor(props) {
    super(props);
    this.commentBox = {};
    this.state = {
      navigationState: {
        index: 0,
        routes: [
          { key: 'comments', title: 'Comments' },
          { key: 'mastermind', title: 'Mastermind' },
        ],
      },
      suggestionModal: false,
    };
  }

  handleRefresh = () => {
    // const { routes, index } = this.state.navigationState;
    const { tab, goalDetail, navigationState } = this.props;
    const { routes, index } = navigationState;
    if (routes[index].key === 'comments') {
      this.props.refreshComments('Goal', goalDetail._id, tab);
    }
  }

  // Tab related handlers
  _handleIndexChange = index => {
    this.props.goalDetailSwitchTab(index);
    // this.setState({
    //   ...this.state,
    //   navigationState: {
    //     ...this.state.navigationState,
    //     index,
    //   }
    // });
  };

  _renderHeader = props => {
    return (
      <TabButtonGroup buttons={props} />
    );
  };

  keyExtractor = (item) => {
    const { _id } = item;
    return _id;
  };

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
    const { goalDetail, navigationState } = this.props;
    const { routes, index } = navigationState;

    switch (routes[index].key) {
      case 'comments': {
        return (
          <CommentCard
            key={props.index}
            item={props.item}
            index={props.index}
            commentDetail={{ parentType: 'Goal', parentRef: goalDetail._id }}
            goalRef={goalDetail}
            scrollToIndex={(i, viewOffset) => this.scrollToIndex(i, viewOffset)}
            onCommentClicked={() => this.dialogOnFocus()}
            reportType='detail'
          />
        );
      }

      case 'mastermind': {
        const newCommentParams = {
          commentDetail: {
            parentType: 'Goal',
            parentRef: goalDetail._id, // Goal ref
            commentType: 'Suggestion'
          },
          suggestionForRef: props.item._id, // Need or Step ref
          suggestionFor: props.item.type === 'need' ? 'Need' : 'Step'
        };
        return (
          <StepAndNeedCard
            key={props.index}
            item={props.item}
            goalRef={goalDetail}
            onPress={() => {
              this.props.createCommentFromSuggestion(newCommentParams);
              this.props.openSuggestionModal();
            }}
            isSelf={this.props.isSelf}
          />
        );
      }

      default:
        return <View key={props.index} />;
    }
  }

  renderGoalDetailSection() {
    const { goalDetail } = this.props;

    // Tab stats
    const { commentCount, steps, needs } = goalDetail ||
      { commentCount: 0, steps: [], needs: [] };
    const mastermindCount = (steps ? steps.length : 0) + (needs ? needs.length : 0);
    const statsState = {
      comments: commentCount,
      mastermind: mastermindCount
    };

    return (
      <View>
        <GoalDetailSection
          item={goalDetail}
          onSuggestion={() => this.dialogOnFocus()}
          isSelf={this.props.isSelf}
        />
        {
          this._renderHeader({
            jumpToIndex: (i) => this._handleIndexChange(i),
            navigationState: this.props.navigationState,
            statsState
          })
        }
      </View>
    );
  }

  render() {
    const { comments, stepsAndNeeds, navigationState, goalDetail } = this.props;
    const { routes, index } = navigationState;
    const data = routes[index].key === 'comments' ? comments : stepsAndNeeds;
    // console.log('transformed comments to render are: ', comments);

    return (
      <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
        <View style={{ backgroundColor: '#e5e5e5', flex: 1 }}>
          <SuggestionModal
            visible={this.props.showSuggestionModal}
            onCancel={() => this.props.cancelSuggestion()}
            onAttach={() => {
              this.props.attachSuggestion();
            }}
            pageId={undefined}
            item={goalDetail}
          />
          <Report showing={this.props.showingModalInDetail} />
          <SearchBarHeader
            backButton
            title='Goal'
            onBackPress={() => this.props.closeGoalDetail()}
          />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
              <FlatList
                ref="flatList"
                data={data}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                ListHeaderComponent={() => this.renderGoalDetailSection()}
                refreshing={this.props.commentLoading}
                onRefresh={this.handleRefresh}
              />

              <CommentBox
                onRef={(ref) => { this.commentBox = ref; }}
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

const testData = {
  __v: 0,
  _id: '5b502211e500e3001afd1e20',
  category: 'General',
  created: '2018-07-19T05:30:57.531Z',
  details: {
    tags: [],
    text: 'This is detail'
  },
  feedInfo: {
    _id: '5b502211e500e3001afd1e18',
    publishDate: '2018-07-19T05:30:57.531Z',
  },
  lastUpdated: '2018-07-19T05:30:57.531Z',
  needs: [{
    created: '2018-07-19T05:30:57.531Z',
    description: 'introduction to someone from the Bill and Melinda Gates Foundation',
    isCompleted: false,
    order: 0,
  },
  {
    created: '2018-07-19T05:30:57.531Z',
    description: 'Get in contact with Nuclear experts',
    isCompleted: false,
    order: 1,
  },
  {
    created: '2018-07-19T05:30:57.531Z',
    description: 'Legal & Safety experts who have worked with the United States',
    isCompleted: false,
    order: 2,
  }],
  owner: {
    _id: '5b17781ebec96d001a409960',
    name: 'jia zeng',
    profile: {
      elevatorPitch: 'This is my elevatorPitch',
      occupation: 'Software Engineer',
      pointsEarned: 10,
      views: 0,
    },
  },
  priority: 3,
  privacy: 'friends',
  steps: [{
    created: '2018-07-19T05:30:57.531Z',
    description: 'This is my first step to complete the goal',
    isCompleted: false,
    order: 0,
  }],
  title: 'Establish a LMFBR near Westport, Connecticut by 2020',
};

const mapStateToProps = (state, props) => {
  const testStepsAndNeeds = [
    {
      _id: '1',
      sectionTitle: 'needs',
      count: 3
    },
    {
      _id: '2',
      description: 'testneed1',
      completed: 'false',
      order: 1
    },
    {
      _id: '3',
      sectionTitle: 'steps',
      count: 4
    },
    {
      _id: '4',
      description: 'testStep 1',
      completed: 'false',
      order: 1
    }
  ];

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

  const newComment = getNewCommentByTab(state, props.pageId);
  const goalDetail = getGoalDetailByTab(state);
  const { goal, navigationState } = goalDetail;

  const { showingModalInDetail } = state.report;
  const { userId } = state.user;
  const comments = getCommentByTab(state, props.pageId);
  const { transformedComments, loading } = comments || {
    transformedComments: [],
    loading: false
  };

  const isSelf = userId === (!goal || _.isEmpty(goal) ? '' : goal.owner._id);

  return {
    commentLoading: loading,
    stepsAndNeeds: getGoalStepsAndNeeds(state),
    // stepsAndNeeds: testStepsAndNeeds,
    // comments: [...transformedComments, ...testTransformedComments],
    comments: transformedComments,
    goalDetail: goal,
    navigationState,
    showingModalInDetail,
    showSuggestionModal: newComment ? newComment.showSuggestionModal : false,
    isSelf,
    // TODO: delete
    // isSelf: true,
    tab: state.navigation.tab
  };
};

export default connect(
  mapStateToProps,
  {
    closeGoalDetail,
    createCommentFromSuggestion,
    attachSuggestion,
    cancelSuggestion,
    openSuggestionModal,
    refreshComments,
    goalDetailSwitchTab
  }
)(GoalDetailCard2);
