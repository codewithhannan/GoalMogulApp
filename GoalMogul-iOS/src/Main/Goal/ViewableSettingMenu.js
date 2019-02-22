import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import R from 'ramda';

// Component
import { actionSheet, switchByButtonIndex } from '../Common/ActionSheetFactory';

// Asset
import dropDown from '../../asset/utils/dropDown.png';
import profilePeople from '../../asset/utils/profile_people.png';
import shareIcon from '../../asset/utils/share.png';
import informationIcon from '../../asset/utils/info_white.png';
import informationIconBlack from '../../asset/utils/info.png';


// Actions
import { } from '../../actions';

const VIEWABLE_SETTING_MENU_OPTTIONS = ['Friends', 'Public', 'Private', 'Cancel'];
const CANCEL_INDEX = 3;
const DEBUG_KEY = '[ ViewableSettingMenu Component ]';

class ViewableSettingMenu extends Component {

  handleInfoIcon = () => {
    Alert.alert(
      'Share to goals feed',
      'Choosing this will make your goal appear on your friends’ home feed'
    );
  }

  handleOnClick = () => {
    const viewableSettingSwitchCases = switchByButtonIndex([
      [R.equals(0), () => {
        // User choose Friends
        console.log(`${DEBUG_KEY} User choose setting: Friends `);
        this.props.callback('Friends');
        // TODO: update reducer state
      }],
      [R.equals(1), () => {
        // User choose Public
        console.log(`${DEBUG_KEY} User choose setting: Public `);
        this.props.callback('Public');
      }],
      [R.equals(2), () => {
        // User choose Public
        console.log(`${DEBUG_KEY} User choose setting: Self `);
        this.props.callback('Private');
      }]
    ]);

    const viewableSettingActionSheet = actionSheet(
      VIEWABLE_SETTING_MENU_OPTTIONS,
      CANCEL_INDEX,
      viewableSettingSwitchCases
    );
    return viewableSettingActionSheet();
  }

  renderShareToMSButton() {
    if (this.props.shareToMastermind === null) {
      return '';
    }
    const containerStyle = this.props.shareToMastermind ?
      {
        ...styles.containerStyle,
        backgroundColor: '#17B3EC',
        borderWidth: 0,
        // borderTopRightRadius: 0,
        // borderBottomRightRadius: 0,
      } : {
        ...styles.containerStyle,
        // borderTopRightRadius: 0,
        // borderBottomRightRadius: 0,
      };

    const color = this.props.shareToMastermind ?
      'white' : '#a1a1a1';

    const icon = this.props.shareToMastermind
      ? (<Image style={styles.informationIconStyle} source={informationIcon} />)
      : (<Image style={styles.informationIconStyle} source={informationIconBlack} />);

    const shareIconTintColor = this.props.shareToMastermind ? 'white' : '#9b9b9b';

    return (
      <View style={{ ...styles.containerStyle, backgroundColor: 'transparent', borderWidth: 0 }}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={{ ...containerStyle }}
          onPress={() => this.props.shareToMastermindCallback(!this.props.shareToMastermind)}
        >
          <Image
            style={{ ...styles.profileIconStyle, tintColor: shareIconTintColor }}
            source={shareIcon}
          />
          <Text style={{ fontSize: 10, marginLeft: 3, marginRight: 2, color }}>
            Share to Goals feed
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={{ padding: 5 }}
            onPress={this.handleInfoIcon}
          >
            {icon}
          </TouchableOpacity>
        </TouchableOpacity>
        <View style={{ margin: 10, borderLeftWidth: 1, borderColor: '#e9e9e9' }} />
      </View>
    );
  }

  render() {
    const { belongsToTribe, belongsToEvent } = this.props;

    const settingDisabled = belongsToTribe !== undefined || belongsToEvent !== undefined;

    // Don't show caret if belongs to event or tribe
    const caret = settingDisabled
      ? ''
      : (
          <View style={{ padding: 5 }}>
            <Image style={styles.caretStyle} source={dropDown} />
          </View>
      );
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={{ ...styles.containerStyle, width: 80, opacity: settingDisabled ? 0 : 95 }}
          onPress={this.handleOnClick}
          disabled={settingDisabled}
        >
          <View style={{ padding: 5 }}>
            <Image
              style={{
                height: 13,
                width: 13,
                tintColor: 'rgb(155,155,155)'
              }}
              source={profilePeople}
            />
          </View>
          <Text style={{ fontSize: 10, flex: 1 }}>
            {this.props.viewableSetting}
          </Text>
          {caret}
        </TouchableOpacity>
        {this.renderShareToMSButton()}
      </View>

    );
  }
}

const styles = {
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    borderColor: '#e9e9e9',
    borderWidth: 1,
    borderRadius: 4,
    height: 25,
  },
  caretStyle: {
    tintColor: '#20485f',
    // marginLeft: 5,
    // marginRight: 3
  },
  informationIconStyle: {
    width: 13,
    height: 13,
  },
  profileIconStyle: {
    height: 13,
    width: 13,
    margin: 3,
    marginLeft: 6,
    tintColor: 'rgb(155,155,155)'
  }
};

export default connect(
  null,
  null
)(ViewableSettingMenu);
