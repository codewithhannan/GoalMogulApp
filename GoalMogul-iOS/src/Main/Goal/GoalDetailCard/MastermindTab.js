// Note: This is the old implementation where Goal Detail is pinned and Mastermind is scrollable
import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  ScrollView
} from 'react-native';
import { Icon } from 'react-native-elements';

// Components
import SectionCard from '../Common/SectionCard';

// Assets
import HelpIcon from '../../../asset/utils/help.png';
import StepIcon from '../../../asset/utils/steps.png';

class MastermindTab extends Component {

  renderMastermind() {
    const { needs, steps } = this.props.item;
    const needCards = this.renderNeeds(needs);
    const stepCards = this.renderSteps(steps);

    return (
      <ScrollView>
        {needCards}
        {stepCards}
      </ScrollView>
    );
  }

  // Render needs
  renderNeeds(needs) {
    if (!needs || needs.length === 0) {
      return;
    }
    const title = (
      <SectionTitle
        iconSource={HelpIcon}
        text='Needs'
        count={needs.length}
        key='need-title'
      />
    );

    const needCards = needs.map((need, index) =>
      (
        <SectionCard key={`need-${index}`} item={need} />
      )
    );

    return (
      <View>
        {title}
        {needCards}
      </View>
    );
  }

  // Render steps
  renderSteps(steps) {
    if (!steps || steps.length === 0) {
      return;
    }
    const title = (
      <SectionTitle
        iconSource={StepIcon}
        iconStyle={{ height: 20, width: 20 }}
        text='Steps'
        count={steps.length}
        key='step-title'
      />
    );

    const stepCards = steps.map((step, index) =>
      (<SectionCard key={`step-${index}`} item={step} />)
    );

    return (
      <View>
        {title}
        {stepCards}
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderMastermind()}
      </View>
    );
  }
}

const styles = {
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

export default MastermindTab;
