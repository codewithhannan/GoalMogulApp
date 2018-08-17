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
    console.log('props are: ', props);
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

  renderItem = ({ item }) => {
    return (
      <View />
    )
  }

  renderGoalDetailSectoin() {
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
    return (
      <View style={{ backgroundColor: '#e5e5e5', flex: 1 }}>
        <SuggestionModal
          visible={this.state.suggestionModal}
          onCancel={() => this.setState({ suggestionModal: false })}
        />
        <SearchBarHeader backButton title='Goal' />
          <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
            <FlatList
              data={[]}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              ListHeaderComponent={() => this.renderGoalDetailSectoin()}
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

  return {
    data: getGoalStepsAndNeeds(state),
  };
};

export default connect(
  mapStateToProps,
  null
)(GoalDetailCard2);
