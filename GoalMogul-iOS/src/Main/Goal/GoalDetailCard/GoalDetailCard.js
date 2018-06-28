import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';

// Component
import SearchBarHeader from '../../../Main/Common/Header/SearchBarHeader';
import SuggestionModal from './SuggestionModal';
import Headline from '../Common/Headline';
import Timestamp from '../Common/Timestamp';
import ActionButton from '../Common/ActionButton';
import ActionButtonGroup from '../Common/ActionButtonGroup';
import SectionCard from '../Common/SectionCard';
import TabButtonGroup from '../Common/TabButtonGroup';
import TabButton from '../Common/TabButton';
import ProgressBar from '../Common/ProgressBar';

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


];

const testStep = [
  {
    text: 'step 1'
  }
];

class GoalDetailCard extends Component {
  state = {
    // tab state stays within each component
    tab: 'comments',
    suggestionModal: true,
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

  renderTabs() {
    return (
      <TabButtonGroup>
        <TabButton
          text='Comments'
          selected={this.state.tab === 'comments'}
          count={25}
          onPress={() => this.setState({ tab: 'comments' })}
        />
        <TabButton
          text='Needs and Steps'
          iconStyle={{ height: 20, width: 20 }}
          selected={this.state.tab === 'steps'}
          count={20}
          onPress={() => this.setState({ tab: 'steps' })}
        />
      </TabButtonGroup>
    );
  }

  renderSections() {
    const needs = this.renderNeeds();
    const steps = this.renderSteps();

    return (
      <ScrollView>
        {needs}
        {steps}
      </ScrollView>
    );
  }

  // Render needs
  renderNeeds() {
    if (!testNeed || testNeed.length === 0) {
      return;
    }
    const title = (
      <SectionTitle
        iconSource={HelpIcon}
        text='Needs'
        count={5}
      />
    );

    const needs = testNeed.map((need, index) => {
      return <SectionCard key={index} />;
    });

    return (
      <View>
        {title}
        {needs}
      </View>
    );
  }

  // Render steps
  renderSteps() {
    if (!testStep || testNeed.length === 0) {
      return;
    }
    const title = (
      <SectionTitle
        iconSource={StepIcon}
        iconStyle={{ height: 20, width: 20 }}
        text='Steps'
        count={7}
      />
    );

    const steps = testStep.map((step, index) => {
      return <SectionCard key={index} />;
    });

    return (
      <View>
        {title}
        {steps}
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
      <View style={{ backgroundColor: '#e5e5e5', flex: 1 }}>
        <SuggestionModal
          visible={this.state.suggestionModal}
          onCancel={() => this.setState({ suggestionModal: false })}
        />
        <SearchBarHeader backButton title='Goal' />
        <View style={{ ...styles.containerStyle, marginTop: 2 }}>
          <View style={{ marginTop: 20, marginBottom: 10, marginRight: 15, marginLeft: 15 }}>
            {this.renderUserDetail()}
            {this.renderCardContent()}
          </View>
        </View>

        <View style={styles.containerStyle}>
          {this.renderActionButtons()}
        </View>

        {this.renderTabs()}
        {this.renderSections()}
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
  },
  sectionTitleStyle: {
    containerStyle: {
      alignItems: 'center',
      flexDirection: 'row',
      height: 38,
      marginLeft: 15
    },
    iconStyle: {
      height: 26,
      width: 26,
      tintColor: '#616161'
    },
    textStyle: {
      fontSize: 11,
      marginLeft: 8,
      color: '#616161'
    },
    countTextStyle: {
      fontSize: 11,
      color: '#616161'
    }
  }
};

const SectionTitle = (props) => {
  const { sectionTitleStyle } = styles;
  const image = props.iconSource ?
    (<Image
      source={props.iconSource}
      style={{ ...sectionTitleStyle.iconStyle, ...props.iconStyle }}
    />)
    : '';

  return (
    <View style={{ ...sectionTitleStyle.containerStyle }}>
      {image}
      <Text style={{ ...sectionTitleStyle.textStyle, ...props.textStyle }}>
        {props.text}
      </Text>
      <Icon name='dot-single' type='entypo' color='#616161' size={20} />
      <Text style={sectionTitleStyle.countTextStyle}>{props.count}</Text>
    </View>
  );
};

export default connect(
  null,
  null
)(GoalDetailCard);
