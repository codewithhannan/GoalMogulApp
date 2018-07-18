import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  MaskedViewIOS
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { LinearGradient } from 'expo';

// Component
import Headline from '../Common/Headline';
import Timestamp from '../Common/Timestamp';
import ActionButton from '../Common/ActionButton';
import ActionButtonGroup from '../Common/ActionButtonGroup';
import SectionCard from '../Common/SectionCard';
import TabButtonGroup from '../Common/TabButtonGroup';
import TabButton from '../Common/TabButton';
import ProgressBar from '../Common/ProgressBar';
import NextButton from '../Common/NextButton';

// Asset
import defaultProfilePic from '../../../asset/utils/defaultUserProfile.png';
import LoveIcon from '../../../asset/utils/love.png';
import BulbIcon from '../../../asset/utils/bulb.png';
import ShareIcon from '../../../asset/utils/forward.png';
import HelpIcon from '../../../asset/utils/help.png';
import StepIcon from '../../../asset/utils/steps.png';

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

class GoalCard extends Component {
  state = {
    // tab state stays within each component
    tab: 'needs'
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
    const { title } = this.props.item;
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
              {title}
            </Text>
          </View>

        </View>
      </View>
    );
  }

  renderTabs() {
    return (
      <TabButtonGroup>
        <TabButton
          text='Needs'
          iconSource={HelpIcon}
          selected={this.state.tab === 'needs'}
          count={20}
          onPress={() => this.setState({ tab: 'needs' })}
        />
        <TabButton
          text='Steps'
          iconSource={StepIcon}
          iconStyle={{ height: 20, width: 20 }}
          selected={this.state.tab === 'steps'}
          count={20}
          onPress={() => this.setState({ tab: 'steps' })}
        />
      </TabButtonGroup>
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

  renderViewGoal() {
    return (
      <View
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
      </View>
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

            {this.renderTabs()}
            {this.renderSections()}

            <View style={styles.containerStyle}>
              {this.renderViewGoal()}
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

export default connect(
  null,
  null
)(GoalCard);
