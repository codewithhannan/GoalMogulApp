import React, { Component } from 'react';
import {
  View,
  MaskedViewIOS,
  Text,
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo';
import { Icon } from 'react-native-elements';

import SectionCard from '../Common/SectionCard';

const testStep = [
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

class StepTab extends Component {

  renderSections(steps) {
    const { goalRef, onPress } = this.props;
    const sections = steps.map((section, index) => {
      if (index < 2) {
        return (
          <SectionCard
            key={index}
            item={section}
            goalRef={goalRef}
            onPress={onPress}
            type='step'
          />
        );
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
              <SectionCard
                key={index}
                item={section}
                goalRef={goalRef}
                onPress={onPress}
                type='step'
              />
            </MaskedViewIOS>
          </View>
        );
      }
      return '';
    });
    if (steps.length === 0) {
      sections.push(
        <SectionCard
          type='Step'
          key='empty-step'
        />
      );
    }
    if (steps.length < 3) {
      sections.push(
        <View
          style={{ height: 40, backgroundColor: 'white', marginTop: 0.5 }} key={steps.length}
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
      <TouchableOpacity activeOpacity={0.85}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 10,
          position: 'absolute',
          bottom: 10,
          left: 0,
          right: 0
        }}
        onPress={() => this.props.onPress()}
      >
        <Text style={styles.viewGoalTextStyle}>View Goal</Text>
        <View style={{ alignSelf: 'center', alignItems: 'center' }}>
          <Icon
            name='ios-arrow-round-forward'
            type='ionicon'
            color='#17B3EC'
            iconStyle={styles.iconStyle}
          />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const steps = this.props.item ? this.props.item : testStep;

    return (
      <View style={{ flex: 1 }}>
        {this.renderSections(steps)}
        <View style={{ backgroundColor: 'white' }}>
          {this.renderViewGoal()}
        </View>
      </View>
    );
  }
}

const styles = {
  viewGoalTextStyle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#17B3EC',
    alignSelf: 'center'
  },
  iconStyle: {
    alignSelf: 'center',
    fontSize: 20,
    marginLeft: 5,
    marginTop: 2
  },
};

export default StepTab;
