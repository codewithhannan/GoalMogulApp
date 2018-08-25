import React, { Component } from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import { TabViewAnimated, SceneMap } from 'react-native-tab-view';

// selector
import { getGoalStepsAndNeeds } from '../../../redux/modules/goal/selector';

// Component
import SearchBarHeader from '../../../Main/Common/Header/SearchBarHeader';
import SuggestionModal from './SuggestionModal';
import TabButtonGroup from '../Common/TabButtonGroup';
import CommentBox from '../Common/CommentBox';
import CommentTab from './CommentTab';
import MastermindTab from './MastermindTab';
import StepAndNeedCard from './StepAndNeedCard';
import CommentCard from './Comment/CommentCard';

import GoalDetailSection from './GoalDetailSection';

class GoalDetailCard2 extends Component {
  constructor(props) {
    super(props);
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

  // Tab related handlers
  _handleIndexChange = index => {
    this.setState({
      ...this.state,
      navigationState: {
        ...this.state.navigationState,
        index,
      }
    });
  };

  _renderHeader = props => {
    return (
      <TabButtonGroup buttons={props} />
    );
  };

  _renderScene = SceneMap({
    comments: () =>
      <CommentTab />,
    mastermind: () =>
      <MastermindTab item={{ needs: testData.needs, steps: testData.steps }} />,
  });

  keyExtractor = ({ item, index }) => index;

  scrollToIndex = (index, viewOffset = 0) =>
    this.refs['flatList'].scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
      viewOffset 
    });

  renderItem = (props) => {
    const { routes, index } = this.state.navigationState;
    switch (routes[index].key) {
      case 'comments': {
        return (
          <CommentCard
            item={props.item}
            scrollToIndex={(i) => this.scrollToIndex(i)}
          />
      );
      }

      case 'mastermind': {
        return <StepAndNeedCard item={props.item} />;
      }

      default:
        return <View />;
    }
  }

  renderGoalDetailSection() {
    return (
      <View>
        <GoalDetailSection />
        {
          this._renderHeader({
            jumpToIndex: (i) => this._handleIndexChange(i),
            navigationState: this.state.navigationState
          })
        }
      </View>
    );
  }

  render() {
    const { comments, stepsAndNeeds } = this.props;
    const { routes, index } = this.state.navigationState;
    const data = routes[index].key === 'comments' ? comments : stepsAndNeeds;

    return (
      <View style={{ backgroundColor: '#e5e5e5', flex: 1 }}>
        <SuggestionModal
          visible={this.state.suggestionModal}
          onCancel={() => this.setState({ suggestionModal: false })}
        />
        <SearchBarHeader backButton title='Goal' />
          <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
            <FlatList
              ref="flatList"
              data={data}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              ListHeaderComponent={() => this.renderGoalDetailSection()}
            />

            <CommentBox />

          </KeyboardAvoidingView>
      </View>
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
  }
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

const mapStateToProps = state => {

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

  // const { transformedComments } = state.comment;

  return {
    // stepsAndNeeds: getGoalStepsAndNeeds(state),
    stepsAndNeeds: testStepsAndNeeds,
    comments: testTransformedComments
  };
};

export default connect(
  mapStateToProps,
  null
)(GoalDetailCard2);
