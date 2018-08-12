import React, { Component } from 'react';
import {
  View,
  MaskedViewIOS,
  Text
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

  renderSections() {
    const sections = testStep.map((section, index) => {
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
    if (testStep.length < 3) {
      sections.push(
        <View
          style={{ height: 40, backgroundColor: 'white', marginTop: 0.5 }} key={testStep.length}
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
          bottom: 10,
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

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderSections()}
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
};

export default StepTab;
