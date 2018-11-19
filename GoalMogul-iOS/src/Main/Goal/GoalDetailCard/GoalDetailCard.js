import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import { TabViewAnimated, SceneMap } from 'react-native-tab-view';

// Component
import SearchBarHeader from '../../../Main/Common/Header/SearchBarHeader';
import SuggestionModal from './SuggestionModal';
import Headline from '../Common/Headline';
import Timestamp from '../Common/Timestamp';
import ActionButton from '../Common/ActionButton';
import ActionButtonGroup from '../Common/ActionButtonGroup';
import TabButtonGroup from '../Common/TabButtonGroup';
import ProgressBar from '../Common/ProgressBar';
import CommentBox from '../Common/CommentBox';
import CommentTab from './CommentTab';
import MastermindTab from './MastermindTab';


// Asset
import defaultProfilePic from '../../../asset/utils/defaultUserProfile.png';
import LoveIcon from '../../../asset/utils/love.png';
import BulbIcon from '../../../asset/utils/bulb.png';
import ShareIcon from '../../../asset/utils/forward.png';

class GoalDetailCard extends Component {
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

  renderTabs() {
    return (
      <TabViewAnimated
        navigationState={this.state.navigationState}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
        useNativeDriver
      />
    );
  }
  //
  // renderTabs() {
  //   return (
  //     <TabButtonGroup>
  //       <TabButton
  //         text='Comments'
  //         selected={this.state.tab === 'comments'}
  //         count={25}
  //         onPress={() => this.setState({ tab: 'comments' })}
  //       />
  //       <TabButton
  //         text='Needs and Steps'
  //         iconStyle={{ height: 20, width: 20 }}
  //         selected={this.state.tab === 'steps'}
  //         count={20}
  //         onPress={() => this.setState({ tab: 'steps' })}
  //       />
  //     </TabButtonGroup>
  //   );
  // }

  // Card central content. Progressbar for goal card
  renderCardContent() {
    return (
      <View style={{ marginTop: 20 }}>
        <ProgressBar startTime='Mar 2013' endTime='Nov 2011' />
      </View>
    );
  }

  // user basic information
  renderUserDetail() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Image source={defaultProfilePic} resizeMode='contain' style={{ height: 60, width: 60 }} />
        <View style={{ marginLeft: 15, flex: 1 }}>
          <Headline name='John Doe' category='Personal Development' />
          <Timestamp time='5 mins ago' />
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Text
              style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 13 }}
              numberOfLines={3}
              ellipsizeMode='tail'
            >
              Establish a LMFBR near Westport, Connecticut by the year 2020
            </Text>
          </View>

        </View>
      </View>
    );
  }

  renderActionButtons() {
    return (
      <ActionButtonGroup>
        <ActionButton
          iconSource={LoveIcon}
          count={22}
          iconContainerStyle={{ backgroundColor: '#FAD6C8' }}
          iconStyle={{ tintColor: '#f15860' }}
          onPress={() => console.log('like')}
        />
        <ActionButton
          iconSource={ShareIcon}
          count={5}
          iconStyle={{ tintColor: '#a8e1a0', height: 32, width: 32 }}
          onPress={() => console.log('share')}
        />
        <ActionButton
          iconSource={BulbIcon}
          count={45}
          iconStyle={{ tintColor: '#FBDD0D', height: 26, width: 26 }}
          onPress={() => console.log('suggest')}
        />
      </ActionButtonGroup>
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
            <View style={{ ...styles.containerStyle }}>
              <View style={{ marginTop: 20, marginBottom: 10, marginRight: 15, marginLeft: 15 }}>
                {this.renderUserDetail()}
                {this.renderCardContent()}
              </View>
            </View>

            <View style={styles.containerStyle}>
              {this.renderActionButtons()}
            </View>

            {this.renderTabs()}

            <CommentBox />

          </KeyboardAvoidingView>
      </View>
    );
  }
}

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

export default connect(
  null,
  null
)(GoalDetailCard);
