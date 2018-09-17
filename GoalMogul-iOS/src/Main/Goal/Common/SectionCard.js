import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import R from 'ramda';
import { connect } from 'react-redux';

// Asset
import bulb from '../../../asset/utils/bulb.png';
import forward from '../../../asset/utils/forward.png';
import checkIcon from '../../../asset/utils/check.png';

// Components
import { actionSheet, switchByButtonIndex } from '../../Common/ActionSheetFactory';

// Actions
import {
  chooseShareDest
} from '../../../redux/modules/feed/post/ShareActions';

// Constants
const DEBUG_KEY = '[ UI GoalCard.Need/Step SectionCard ]';
const SHARE_TO_MENU_OPTTIONS = ['Share to feed', 'Share to an event', 'Share to a tribe', 'Cancel'];
const CANCEL_INDEX = 3;

class SectionCard extends Component {

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

  render() {
    // console.log('item for props is: ', this.props.item);
    const item = this.props.item
      ? this.props.item
      : { description: 'No content', isCompleted: false };
    const { description, isCompleted } = item;
    const sectionText = description === undefined ? 'No content' : description;

    const check = isCompleted ? (
      <View style={styles.checkIconContainerStyle}>
        <Image source={checkIcon} style={styles.checkIconStyle} />
      </View>
    ) : '';

    return (
      <View style={styles.sectionContainerStyle}>
        <View
          style={{
            margin: 12,
            marginTop: 15,
            marginBottom: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {check}
          <View style={styles.textContainerStyle}>
            <Text
              style={styles.sectionTextStyle}
              numberOfLines={2}
              ellipsizeMode='tail'
            >
              {sectionText}
            </Text>
          </View>
          <View style={{ flex: 9, flexDirection: 'row' }}>
            <TouchableOpacity
              style={styles.iconContainerStyle}
              onPress={() => this.props.onPress()}
            >
              <Image style={styles.iconStyle} source={bulb} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconContainerStyle}
              onPress={() => this.handleShareOnClick()}
            >
              <Image style={styles.iconStyle} source={forward} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  sectionContainerStyle: {
    marginTop: 0.5,
    marginBottom: 0.5,
    backgroundColor: '#fcfcfc'
  },
  sectionTextStyle: {
    color: '#909090',
    fontSize: 13,
  },
  textContainerStyle: {
    flexDirection: 'row',
    borderRightWidth: 0.5,
    borderColor: '#e5e5e5',
    paddingRight: 10,
    flexShrink: 1,
    flex: 20
  },
  iconContainerStyle: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: '#efefef',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15
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
  }
};

export default connect(
  null,
  {
    chooseShareDest
  }
)(SectionCard);
