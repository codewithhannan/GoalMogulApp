import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import R from 'ramda';

// Component
import { actionSheet, switchByButtonIndex } from '../Common/ActionSheetFactory';

// Asset
import dropDown from '../../asset/utils/dropDown.png';
import profilePeople from '../../asset/utils/profile_people.png';

// Actions
import { } from '../../actions';

const VIEWABLE_SETTING_MENU_OPTTIONS = ['Friends', 'Public', 'Cancel'];
const CANCEL_INDEX = 2;
const DEBUG_KEY = '[ ViewableSettingMenu Component ]';

class ViewableSettingMenu extends Component {

  handleOnClick = () => {
    const viewableSettingSwitchCases = switchByButtonIndex([
      [R.equals(0), () => {
        // User choose Friends
        console.log(`${DEBUG_KEY} User choose setting: Friends `);
        // TODO: update reducer state
      }],
      [R.equals(1), () => {
        // User choose Public
        console.log(`${DEBUG_KEY} User choose setting: Public `);
      }]
    ]);

    const viewableSettingActionSheet = actionSheet(
      VIEWABLE_SETTING_MENU_OPTTIONS,
      CANCEL_INDEX,
      viewableSettingSwitchCases
    );
    return viewableSettingActionSheet();
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <Image style={styles.caretStyle} source={dropDown} />
        <Text>Friends</Text>
        <Image style={styles.profileIconStyle} source={profilePeople} />
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#e9e9e9',
    borderWidth: 1,
    borderRadius: 5
  },
  caretStyle: {
    tintColor: '#20485f',
    marginLeft: 5
  },
  profileIconStyle: {

  }
};

export default connect(
  null,
  null
)(ViewableSettingMenu);
