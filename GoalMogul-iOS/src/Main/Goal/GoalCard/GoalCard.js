import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  MaskedViewIOS,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { LinearGradient } from 'expo';
import { TabViewAnimated, SceneMap } from 'react-native-tab-view';
import timeago from 'timeago.js';

// Actions
import {
  createReport
} from '../../../redux/modules/report/ReportActions';

// Components
import Headline from '../Common/Headline';
import Timestamp from '../Common/Timestamp';
import ActionButton from '../Common/ActionButton';
import ActionButtonGroup from '../Common/ActionButtonGroup';
import SectionCard from '../Common/SectionCard';
import TabButtonGroup from '../Common/TabButtonGroup';
import ProgressBar from '../Common/ProgressBar';
import NextButton from '../Common/NextButton';
import NeedTab from './NeedTab';
import StepTab from './StepTab';

// Asset
import defaultProfilePic from '../../../asset/utils/defaultUserProfile.png';
import LoveIcon from '../../../asset/utils/love.png';
import BulbIcon from '../../../asset/utils/bulb.png';
import ShareIcon from '../../../asset/utils/forward.png';
import HelpIcon from '../../../asset/utils/help.png';
import StepIcon from '../../../asset/utils/steps.png';

const { height } = Dimensions.get('window');
const CardHeight = height * 0.7;

const testNeed = [
  {
    text: 'Get in contact with Nuclear expert'
  },
  {
    text: 'Introduction to someone from Bill and Melinda Gates foundation'
  },
  {
    text: 'Introduction to someone from Bill and Melinda Gates foundation'
  },
];

const TabIconMap = {
  steps: {
    iconSource: StepIcon,
    iconStyle: { height: 20, width: 20 }
  },
  needs: {
    iconSource: HelpIcon,
    iconStyle: { height: 20, width: 20 }
  }
};

class GoalCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigationState: {
        index: 0,
        routes: [
          { key: 'needs', title: 'Needs' },
          { key: 'steps', title: 'Steps' },
        ],
      }
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
      <TabButtonGroup buttons={props} tabIconMap={TabIconMap} />
    );
  };

  _renderScene = SceneMap({
    needs: () => <NeedTab item={this.props.item.needs} onPress={this.props.onPress} />,
    steps: () => <StepTab item={this.props.item.steps} onPress={this.props.onPress} />,
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
    const { title, owner, category, _id, created } = this.props.item;
    const timeStamp = (created === undefined || created.length === 0)
      ? new Date() : created;
    // TODO: verify all the fields have data

    return (
      <View style={{ flexDirection: 'row' }}>
        <Image source={defaultProfilePic} resizeMode='contain' style={{ height: 60, width: 60 }} />
        <View style={{ marginLeft: 15, flex: 1 }}>
          <Headline
            name={owner.name}
            category={category}
            caretOnPress={() => this.props.createReport(_id, 'goal', 'User')}
          />
          <Timestamp time={timeago().format(timeStamp)} />
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Text
              style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 13 }}
              numberOfLines={3}
              ellipsizeMode='tail'
            >
              {title}
            </Text>
          </View>

        </View>
      </View>
    );
  }

  renderSections() {
    const sections = testNeed.map((section, index) => {
      if (index < 2) {
        return <SectionCard key={index} />;
      }
      if (index === 2) {
        return (
          <View style={{ backgroundColor: 'white', marginTop: 0.5 }} key={index}>
            <MaskedViewIOS
              style={{ maxHeight: 300 }}
              maskElement={
                <LinearGradient
                  colors={['white', 'transparent']}
                  style={{ flex: 1 }}
                  start={[0, 0.40]}
                  end={[0, 0.7]}
                />
              }
            >
              <SectionCard />
            </MaskedViewIOS>
          </View>
        );
      }
      return '';
    });
    if (testNeed.length < 3) {
      sections.push(
        <View
          style={{ height: 40, backgroundColor: 'white', marginTop: 0.5 }} key={testNeed.length}
        />
      );
    }
    return (
      <View>
        {sections}
      </View>
    );
  }

  // Note: deprecated
  renderViewGoal() {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 10,
          position: 'absolute',
          bottom: 70,
          left: 0,
          right: 0
        }}
        onPress={() => this.props.onPress}
      >
        <Text style={styles.viewGoalTextStyle}>View Goal</Text>
        <View style={{ alignSelf: 'center', alignItems: 'center' }}>
          <Icon
            name='ios-arrow-round-forward'
            type='ionicon'
            color='#45C9F6'
            iconStyle={styles.iconStyle}
          />
        </View>
      </TouchableOpacity>
    );
  }

  renderActionButtons() {
    return (
      <ActionButtonGroup>
        <ActionButton
          iconSource={LoveIcon}
          count={22}
          iconContainerStyle={{ backgroundColor: '#f9d6c9' }}
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
          iconStyle={{ tintColor: '#f5eb6f', height: 26, width: 26 }}
          onPress={() => console.log('suggest')}
        />
      </ActionButtonGroup>
    );
  }

  render() {
    return (
      <View>
        <View style={{ backgroundColor: '#f8f8f8', ...styles.borderShadow }}>
          <View style={{ backgroundColor: '#e5e5e5' }}>
            <View style={styles.containerStyle}>
              <View style={{ marginTop: 20, marginBottom: 20, marginRight: 15, marginLeft: 15 }}>
                {this.renderUserDetail()}
                {this.renderCardContent()}
              </View>
            </View>

            <View style={{ height: CardHeight * 0.51 }}>
              {this.renderTabs()}
            </View>

            <View style={styles.containerStyle}>
              {this.renderActionButtons()}
            </View>
          </View>
        </View>
        <NextButton onPress={() => console.log('next item')} />
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    backgroundColor: 'white'
  },
  viewGoalTextStyle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#45C9F6',
    alignSelf: 'center'
  },
  iconStyle: {
    alignSelf: 'center',
    fontSize: 20,
    marginLeft: 5,
    marginTop: 2
  },
  borderShadow: {
    shadowColor: 'lightgray',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 1,
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
  steps: [],
  title: 'Establish a LMFBR near Westport, Connecticut by 2020',
};

export default connect(
  null,
  {
    createReport
  }
)(GoalCard);
