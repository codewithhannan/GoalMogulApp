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

class NeedTab extends Component {
  renderSections(needs) {
    const { goalRef, onPress, itemCount } = this.props;
    const sections = needs.map((section, index) => {
      if (index < itemCount - 1) {
        return (
          <SectionCard
            key={index}
            item={section}
            goalRef={goalRef}
            onPress={onPress}
            type='Need'
          />
        );
      }
      if (index === itemCount - 1) {
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
                item={section}
                goalRef={goalRef}
                onPress={onPress}
                type='Need'
              />
            </MaskedViewIOS>
          </View>
        );
      }
      return '';
    });
    if (needs.length === 0) {
      sections.push(
        <SectionCard
          type='Need'
          key='empty-need'
        />
      );
    }
    if (needs.length < itemCount) {
      sections.push(
        <View
          style={{ height: 40, backgroundColor: 'white', marginTop: 0.5 }} key={needs.length}
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
      <TouchableOpacity
        activeOpacity={0.85}
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
    const needs = this.props.item ? this.props.item : testNeed;
    return (
      <View style={{ flex: 1 }}>
        {this.renderSections(needs)}
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

export default NeedTab;
