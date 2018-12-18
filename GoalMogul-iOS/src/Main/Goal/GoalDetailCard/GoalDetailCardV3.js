import React, { Component } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  MenuProvider
} from 'react-native-popup-menu';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { Constants } from 'expo';

// Actions
import {
  closeGoalDetail,
  goalDetailSwitchTabV2,
  goalDetailSwitchTabV2ByKey
} from '../../../redux/modules/goal/GoalDetailActions';

import {
  attachSuggestion,
  cancelSuggestion,
  openSuggestionModal,
  removeSuggestion,
  createCommentFromSuggestion
} from '../../../redux/modules/feed/comment/CommentActions';

// selector
import {
  getGoalStepsAndNeeds,
  getGoalDetailByTab
} from '../../../redux/modules/goal/selector';
import {
  getCommentByTab,
  getNewCommentByTab
} from '../../../redux/modules/feed/comment/CommentSelector';

// Component
import SearchBarHeader from '../../../Main/Common/Header/SearchBarHeader';
import SuggestionModal from './SuggestionModal3';
import Report from '../../../Main/Report/Report';
import CentralTab from './V3/CentralTab';
import FocusTab from './V3/FocusTab';
import SectionCardV2 from '../Common/SectionCardV2';

import GoalDetailSection from './GoalDetailSection';

// Assets
import next from '../../../asset/utils/next.png';
import allComments from '../../../asset/utils/allComments.png';

// Styles
import {
  BACKGROUND_COLOR
} from '../../../styles';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width
};

const HEADER_HEIGHT = 240; // Need to be calculated in the state later based on content length
const COLLAPSED_HEIGHT = 30 + Constants.statusBarHeight;
const SCROLLABLE_HEIGHT = HEADER_HEIGHT - COLLAPSED_HEIGHT;
const DEBUG_KEY = '[ UI GoalDetailCardV3 ]';

class GoalDetailCardV3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scroll: new Animated.Value(0)
    };
  }

  componentDidMount() {
    this.state.scroll.addListener(({ value }) => { this._value = value; });
  }

  componentWillUnmount() {
    this.state.scroll.removeAllListeners();
  }

  // Switch tab to FocusTab and display all the comments
  onViewCommentPress = () => {
    console.log(`${DEBUG_KEY}: User opens all comments.`);
    this.props.goalDetailSwitchTabV2ByKey('focusTab', undefined, 'comment');
  }

  // Can be replaced by memorized selector
  getFocusedItem(focusType, focusRef) {
    const { goalDetail } = this.props;
    const type = focusType === 'step' ? 'steps' : 'needs';
    let focusedItem = { description: '', isCompleted: false };
    _.get(goalDetail, `${type}`).forEach((item) => {
      if (item._id === focusRef) {
        focusedItem = _.cloneDeep(item);
      }
    });
    return focusedItem;
  }

  // Tab related handlers
  _handleIndexChange = index => {
    // TODO: change to v2
    const { navigationState, pageId } = this.props;
    if (navigationState.routes[index].key === 'centralTab') {
      this.props.removeSuggestion(pageId);
      this.props.goalDetailSwitchTabV2ByKey('centralTab', undefined, undefined);
      return;
    }

    this.props.goalDetailSwitchTabV2(index);
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
      case 'centralTab':
        return (
          <CentralTab
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scroll } } }],
              { useNativeDriver: true }
            )}
            contentContainerStyle={{ paddingTop: HEADER_HEIGHT + 20, flexGrow: 1 }}
            contentOffset={{ y:
              this.state.scroll._value > SCROLLABLE_HEIGHT
                ? SCROLLABLE_HEIGHT
                : this.state.scroll._value
            }}
          />
        );

      case 'focusTab':
        return (
          <FocusTab
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scroll } } }],
              { useNativeDriver: true }
            )}
            contentContainerStyle={{ paddingTop: HEADER_HEIGHT + 30, flexGrow: 1 }}
            contentOffset={{ y:
              this.state.scroll._value > SCROLLABLE_HEIGHT
                ? SCROLLABLE_HEIGHT
                : this.state.scroll._value
            }}
            pageId={this.props.pageId}
          />
        );

      default: return null;
    }
  }

  // _renderScene = SceneMap({
  //   centralTab: CentralTab,
  //   focusTab: FocusTab
  // })
  _renderTabBar = (props) => {
    const translateY = this.state.scroll.interpolate({
      inputRange: [0, SCROLLABLE_HEIGHT],
      outputRange: [0, -SCROLLABLE_HEIGHT],
      extrapolate: 'clamp',
    });

    const { goalDetail } = this.props;

    return (
      <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
        <View style={{ height: HEADER_HEIGHT, backgroundColor: 'white' }}>
          <GoalDetailSection
            item={goalDetail}
            onSuggestion={() => {
              // Goes to central tab by opening all comments
              this.props.goalDetailSwitchTabV2ByKey('focusTab', undefined, 'comment');
            }}
            isSelf={this.props.isSelf}
          />
          <View style={{ borderBottomWidth: 0.5, borderColor: '#e5e5e5' }} />
          {this.renderFocusedItem()}
          {this.renderCommentCTR()}
        </View>
      </Animated.View>
    );
  }

  /**
   * Render focused item.
   */
  renderFocusedItem() {
    const { focusType, focusRef } = this.props.navigationState;
    if (!focusType) return '';
    const focusedItem = this.getFocusedItem(focusType, focusRef);

    return (
      <SectionCardV2
        type={focusType}
        item={focusedItem}
        isFocusedItem
        isSelf={this.props.isSelf}
        onBackPress={() => this._handleIndexChange(0)}
        onContentSizeChange={this.props.onContentSizeChange}
        count={this.props.focusedItemCount}
      />
    );
  }

  // Entry points to open comment subcomponent
  renderCommentCTR() {
    const { goalDetail, navigationState } = this.props;
    const { commentCount } = goalDetail;
    const { focusType } = navigationState;
    if (focusType) return '';
    return (
      <TouchableOpacity
        style={{ paddingTop: 10, backgroundColor: BACKGROUND_COLOR }}
        onPress={this.onViewCommentPress}
      >
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: 'white',
          }}
        >
          <View style={styles.iconContainerStyle}>
            <Image style={styles.commentIconStyle} source={allComments} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, color: '#616161' }}>
              All comments {commentCount}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={this.onViewCommentPress}
            style={styles.iconContainerStyle}
          >
            <Image source={next} style={[styles.nextIconStyle, { opacity: 0.8 }]} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { goalDetail, navigationState } = this.props;
    // console.log('transformed comments to render are: ', comments);
    if (!goalDetail || _.isEmpty(goalDetail)) return '';
    const { focusType, focusRef } = navigationState;

    return (
      <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
        <View style={{ backgroundColor: BACKGROUND_COLOR, flex: 1 }}>
          <SearchBarHeader
            backButton
            title='Goal'
            onBackPress={() => this.props.closeGoalDetail()}
          />
          <TabView
            style={{ flex: 1 }}
            navigationState={this.props.navigationState}
            renderScene={this._renderScene}
            renderTabBar={this._renderTabBar}
            initialLayout={initialLayout}
            onIndexChange={index => this._handleIndexChange(index)}
            swipeEnabled={navigationState.focusType !== undefined}
          />
          <SuggestionModal
            visible={this.props.showSuggestionModal}
            onCancel={() => this.props.cancelSuggestion()}
            onAttach={() => {
              this.props.attachSuggestion(goalDetail, focusType, focusRef);
            }}
            pageId={undefined}
            item={goalDetail}
          />
          <Report showing={this.props.showingModalInDetail} />
        </View>
      </MenuProvider>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
  },
  iconContainerStyle: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20
  },
  commentIconStyle: {
    width: 28,
    height: 20,
    tintColor: '#616161'
  },
  nextIconStyle: {
    height: 25,
    width: 26,
    transform: [{ rotateY: '180deg' }],
    tintColor: '#17B3EC'
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1
  }
});

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
  const { goal, navigationStateV2 } = goalDetail;

  const { showingModalInDetail } = state.report;
  const { userId } = state.user;
  const comments = getCommentByTab(state, props.pageId);
  const { transformedComments, loading } = comments || {
    transformedComments: [],
    loading: false
  };

  const { focusType, focusRef } = navigationStateV2;
  const focusedItemCount = getFocusedItemCount(transformedComments, focusType, focusRef);
  // console.log('focusedItemCount is: ', focusedItemCount);
  const isSelf = userId === (!goal || _.isEmpty(goal) ? '' : goal.owner._id);

  return {
    commentLoading: loading,
    stepsAndNeeds: getGoalStepsAndNeeds(state),
    // stepsAndNeeds: testStepsAndNeeds,
    // comments: [...transformedComments, ...testTransformedComments],
    comments: transformedComments,
    goalDetail: goal,
    navigationState: navigationStateV2,
    showingModalInDetail,
    showSuggestionModal: newComment ? newComment.showSuggestionModal : false,
    isSelf,
    // TODO: delete
    // isSelf: true,
    tab: state.navigation.tab,
    // When on focusTab, show the count for focusedItem
    focusedItemCount
  };
};

const getFocusedItemCount = (comments, focusType, focusRef) => {
  // Initialize data by all comments
  // console.log(`type is: ${focusType}, ref is: ${focusRef}, count is: ${comments.length}`);
  let rawComments = comments;
  let focusedItemCount = 0;
  // console.log(`${DEBUG_KEY}: focusType is: ${focusType}, ref is: ${focusRef}`);
  if (focusType === 'step' || focusType === 'need') {
    // TODO: grab comments by step, filter by typeRef
    rawComments = rawComments.filter((comment) => {
      if (comment.suggestion &&
          comment.suggestion.suggestionForRef &&
          comment.suggestion.suggestionForRef === focusRef) {
            return true;
      }
      return false;
    });
    focusedItemCount = rawComments.length;
  }

  if (focusType === 'comment') {
    focusedItemCount = rawComments.length;
  }

  return focusedItemCount;
};

export default connect(
  mapStateToProps,
  {
    closeGoalDetail,
    attachSuggestion,
    cancelSuggestion,
    openSuggestionModal,
    goalDetailSwitchTabV2,
    goalDetailSwitchTabV2ByKey,
    removeSuggestion,
    createCommentFromSuggestion
  }
)(GoalDetailCardV3);
