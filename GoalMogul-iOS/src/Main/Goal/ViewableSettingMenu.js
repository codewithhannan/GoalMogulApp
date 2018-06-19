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
        this.props.callback('Friends');
        // TODO: update reducer state
      }],
      [R.equals(1), () => {
        // User choose Public
        console.log(`${DEBUG_KEY} User choose setting: Public `);
        this.props.callback('Public');
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
    const containerStyle = this.props.shareToMastermind ?
      {
        ...styles.containerStyle,
        backgroundColor: '#45C9F6',
        borderWidth: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      } : {
        ...styles.containerStyle,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      };

    const color = this.props.shareToMastermind ?
      'white' : '#a1a1a1';

    return (
      <View style={{ ...styles.containerStyle, backgroundColor: 'transparent', borderWidth: 0 }}>
        <TouchableOpacity
          style={{ ...containerStyle }}
          onPress={() => this.props.shareToMastermindCallback(!this.props.shareToMastermind)}
        >
          <Image style={styles.profileIconStyle} source={profilePeople} />
          <Text style={{ fontSize: 10, marginLeft: 3, marginRight: 5, color }}>
            Share to Mastermind
          </Text>
          {/*<Image style={styles.caretStyle} source={dropDown} />*/}
        </TouchableOpacity>
        <View style={{ margin: 10, borderLeftWidth: 1, borderColor: '#e9e9e9' }} />
      </View>
    );
  }

  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={{ ...styles.containerStyle, width: 80 }}
          onPress={this.handleOnClick}
        >
          <Image style={styles.profileIconStyle} source={profilePeople} />
          <Text style={{ fontSize: 10, marginLeft: 3, flex: 1 }}>
            {this.props.viewableSetting}
          </Text>
          <Image style={styles.caretStyle} source={dropDown} />
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
    marginLeft: 5,
    marginRight: 3
  },
  profileIconStyle: {
    height: 13,
    width: 13,
    margin: 3,
    marginLeft: 6
  }
};

export default connect(
  null,
  null
)(ViewableSettingMenu);
