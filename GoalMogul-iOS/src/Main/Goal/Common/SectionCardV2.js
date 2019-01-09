import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import R from 'ramda';
import { connect } from 'react-redux';
import Decode from 'unescape';

// Asset
import bulb from '../../../asset/utils/bulb.png';
import forward from '../../../asset/utils/forward.png';
import checkIcon from '../../../asset/utils/check.png';
import next from '../../../asset/utils/next.png';

// Components
import { actionSheet, switchByButtonIndex } from '../../Common/ActionSheetFactory';

// Actions
import {
  chooseShareDest
} from '../../../redux/modules/feed/post/ShareActions';

import {
  markStepAsComplete,
  markNeedAsComplete
} from '../../../redux/modules/goal/GoalDetailActions';

// Constants
const DEBUG_KEY = '[ UI GoalCard.Need/Step SectionCardV2 ]';
const SHARE_TO_MENU_OPTTIONS = ['Share to Feed', 'Share to an Event', 'Share to a Tribe', 'Cancel'];
const CANCEL_INDEX = 3;

// SectionCardV2.defaultPros = {
//   item,
//   goalRef,
//   type,
//   isSelf,
//   onCardPress
// };

class SectionCardV2 extends Component {

  handleShareOnClick = () => {
    const { item, goalRef, type } = this.props;
    const { _id } = item;
    const shareType = (type === 'need' || type === 'Need') ? 'ShareNeed' : 'ShareStep';

    const shareToSwitchCases = switchByButtonIndex([
      [R.equals(0), () => {
        // User choose to share to feed
        console.log(`${DEBUG_KEY} User choose destination: Feed `);
        this.props.chooseShareDest(shareType, _id, 'feed', item, goalRef._id);
        // TODO: update reducer state
      }],
      [R.equals(1), () => {
        // User choose to share to an event
        console.log(`${DEBUG_KEY} User choose destination: Event `);
        this.props.chooseShareDest(shareType, _id, 'event', item, goalRef._id);
      }],
      [R.equals(2), () => {
        // User choose to share to a tribe
        console.log(`${DEBUG_KEY} User choose destination: Tribe `);
        this.props.chooseShareDest(shareType, _id, 'tribe', item, goalRef._id);
      }],
    ]);

    const shareToActionSheet = actionSheet(
      SHARE_TO_MENU_OPTTIONS,
      CANCEL_INDEX,
      shareToSwitchCases
    );
    return shareToActionSheet();
  };

  renderActionIcons(type) {
    if (type === 'comment') return '';
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.iconContainerStyle}
          onPress={() => this.handleShareOnClick()}
        >
          <Image style={styles.iconStyle} source={forward} />
        </TouchableOpacity>
      </View>
    );
  }

  // If owner is self, user can click to mark a step / need as complete
  renderSelfCheckBox(isCompleted) {
    const { type, item, goalRef } = this.props;
    const { _id } = item;
    const onPress = type === 'need' || type === 'Need'
      ? () => this.props.markNeedAsComplete(_id, goalRef)
      : () => this.props.markStepAsComplete(_id, goalRef);

    const iconContainerStyle = isCompleted
      ? { ...styles.checkIconContainerStyle }
      : { ...styles.checkIconContainerStyle, backgroundColor: '#efefef' };

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={iconContainerStyle}
        onPress={onPress}
      >
        <Image style={styles.checkIconStyle} source={checkIcon} />
      </TouchableOpacity>
    );
  }

  // Render Suggestion icon and number of comments
  renderStats(type) {
    if (type === 'comment') return '';
    const commentCount = this.props.count === undefined ? 15 : this.props.count;
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, paddingBottom: 4 }}>
        <Image
          source={bulb}
          style={{ tintColor: '#FBDD0D', height: 10, width: 10, marginRight: 5 }}
        />
        <Text style={styles.statsTextStyle}>{commentCount} comments</Text>
      </View>
    );
  }

  renderCheckBox(isCompleted, type) {
    // console.log(`${DEBUG_KEY}: rendering checkbox: isSelf ${this.props.isSelf}, type: ${type}`);
    if (this.props.isSelf && type !== 'comment') {
      return this.renderSelfCheckBox(isCompleted);
    }

    if (!isCompleted) return '';
    return (
      <View style={styles.checkIconContainerStyle}>
        <Image source={checkIcon} style={styles.checkIconStyle} />
      </View>
    );
  }

  renderBackIcon() {
    const { isFocusedItem } = this.props;
    if (!isFocusedItem) return '';

    return (
      <TouchableOpacity
        onPress={this.props.onBackPress}
        activeOpacity={0.85}
        style={{ paddingRight: 17 }}
      >
        <Image source={next} style={styles.nextIconStyle} />
      </TouchableOpacity>
    );
  }

  render() {
    // console.log('item for props is: ', this.props.item);
    const { type, item } = this.props;
    let itemToRender = item;

    // Render empty state
    if (!item && type !== 'comment') {
      const emptyText = (type === 'need' || type === 'Need') ? 'No needs' : 'No steps';
      itemToRender = { description: `${emptyText}`, isCompleted: false };
      return renderEmptyState(emptyText);
    }

    const { description, isCompleted } = itemToRender;
    const isCommentFocused = type === 'comment';
    const sectionText = isCommentFocused ? 'Back to mastermind' : description;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={{
          ...styles.sectionContainerStyle,
          backgroundColor: isCompleted ? '#fcfcfc' : 'white',
          opacity: isCompleted ? 0.8 : 1,
          minHeight: 54
        }}
        onPress={this.props.onCardPress || this.props.onBackPress}
      >
        {this.renderBackIcon()}
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              flexWrap: 'wrap'
            }}
          >
            {this.renderCheckBox(isCompleted, type)}
            <Text
              style={{ ...styles.sectionTextStyle, paddingTop: isCommentFocused ? 0 : 4 }}
              numberOfLines={2}
              ellipsizeMode='tail'
            >
              {Decode(sectionText === undefined ? 'No content' : sectionText)}
            </Text>
          </View>
          {this.renderStats(type)}
        </View>
        {this.renderActionIcons(type)}
      </TouchableOpacity>
    );
  }
}

const renderEmptyState = (text) => {
  return (
    <View
      style={{
        ...styles.sectionContainerStyle,
        height: 66,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text
        style={{
          fontSize: 16,
          justifyContent: 'center',
          fontWeight: '700',
          color: '#909090',
        }}
        numberOfLines={1}
        ellipsizeMode='tail'
      >
        {text}
      </Text>
    </View>
  );
};

const styles = {
  sectionContainerStyle: {
    padding: 9,
    paddingLeft: 17,
    paddingRight: 17,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderTopColor: '#eaeaea',
    borderBottomColor: '#eaeaea'
  },
  sectionTextStyle: {
    color: 'black',
    fontSize: 13,
    paddingTop: 4
  },
  statsTextStyle: {
    color: '#909090',
    fontSize: 11,
  },
  textContainerStyle: {
    flexDirection: 'row',
    borderRightWidth: 0.5,
    borderColor: '#e5e5e5',
    paddingRight: 10,
    flexShrink: 1,
    flex: 1
  },
  iconContainerStyle: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: '#efefef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    height: 16,
    width: 16,
    borderRadius: 8,
    tintColor: '#a4a7a7'
  },
  checkIconContainerStyle: {
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor: '#eafcee',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  checkIconStyle: {
    height: 14,
    width: 16,
    borderRadius: 6,
    tintColor: 'black'
  },
  nextIconStyle: {
    height: 25,
    width: 26,
    tintColor: '#bfc3c3'
  }
};

export default connect(
  null,
  {
    chooseShareDest,
    markStepAsComplete,
    markNeedAsComplete
  }
)(SectionCardV2);
