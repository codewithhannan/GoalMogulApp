import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import { Linking, Constants, WebBrowser } from 'expo';
import { Actions } from 'react-native-router-flux';

// Components
import DelayedButton from '../Common/Button/DelayedButton';

// Actions
import {
  openMyEventTab
} from '../../redux/modules/event/MyEventTabActions';

import {
  openMyTribeTab
} from '../../redux/modules/tribe/MyTribeTabActions';

import {
  logout
} from '../../actions';

// Assets
import TribeIcon from '../../asset/explore/tribe.png';
import EventIcon from '../../asset/suggestion/event.png';
import TutorialIcon from '../../asset/utils/tutorial.png';
import BugReportIcon from '../../asset/utils/bug_report.png';
import LogoutIcon from '../../asset/utils/logout.png';

import {
  IPHONE_MODELS,
  BUG_REPORT_URL
} from '../../Utils/Constants';

const DEBUG_KEY = '[ UI Menu ]';

class Menu extends React.PureComponent {

  handleBugReportOnPress = async () => {
    const url = BUG_REPORT_URL;
    const returnUrl = Linking.makeUrl('/');
    Linking.addEventListener('url', this.handleSuggestionLinkOnClose);
    const result = await WebBrowser.openBrowserAsync(url);
    Linking.removeEventListener('url', this.handleSuggestionLinkOnClose);
    console.log(`${DEBUG_KEY}: close bug report link with res: `, result);
  } 

  render() {
    const paddingTop = (
      Platform.OS === 'ios' &&
      IPHONE_MODELS.includes(Constants.platform.ios.model.toLowerCase())
    ) ? 30 : 40;

    const { name } = this.props.user;

    return (
      <View style={{ flex: 1 }}>
        <View style={{ ...styles.headerStyle, paddingTop }}>
          <View style={{ flex: 1, height: 30, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16 }}>{name}</Text>
          </View>
        </View>
        <DelayedButton
          activeOpacity={0.85}
          onPress={() => this.props.openMyTribeTab()}
          style={styles.buttonStyle}
        >
          <Image source={TribeIcon} style={styles.iconStyle} />
          <Text style={styles.titleTextStyle}>My Tribes</Text>
        </DelayedButton>
        <DelayedButton
          activeOpacity={0.85}
          onPress={() => this.props.openMyEventTab()}
          style={styles.buttonStyle}
        >
          <Image source={EventIcon} style={styles.iconStyle} />
          <Text style={styles.titleTextStyle}>My Events</Text>
        </DelayedButton>
        <DelayedButton
          activeOpacity={0.85}
          onPress={() => Actions.push('myTutorial', { initial: false })}
          style={styles.buttonStyle}
        >
          <Image source={TutorialIcon} style={styles.iconStyle} />
          <Text style={styles.titleTextStyle}>Tutorial</Text>
        </DelayedButton>
        <DelayedButton
          activeOpacity={0.85}
          onPress={() => this.handleBugReportOnPress()}
          style={styles.buttonStyle}
        >
          <Image source={BugReportIcon} style={styles.iconStyle} />
          <Text style={styles.titleTextStyle}>Report bug</Text>
        </DelayedButton>
        <DelayedButton
          activeOpacity={0.85}
          onPress={() => {
            Alert.alert('Log out', 'Are you sure to log out?', [
                { text: 'Cancel', onPress: () => console.log('user cancel logout') },
                { text: 'Confirm', onPress: () => this.props.logout() }
              ]
            );
          }}
          style={styles.buttonStyle}
        >
          <View style={{ padding: 2.5 }}>
            <Image source={LogoutIcon} style={{ ...styles.iconStyle, height: 20, width: 20 }} />
          </View>
          <Text style={styles.titleTextStyle}>Log out</Text>
        </DelayedButton>
      </View>
    );
  }
}

const Button = (props) => {
  const { onPress, title, iconSource } = props;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.buttonStyle}
    >
      <Image source={iconSource} style={styles.iconStyle} />
      <Text style={styles.titleTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  headerStyle: {
    flexDirection: 'row',
    paddingTop: 40,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgray'
  },
  buttonStyle: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  iconStyle: {
    marginLeft: 15,
    marginRight: 15,
    height: 25,
    width: 25
  },
  titleTextStyle: {
    fontSize: 16
  }
};

const mapStateToProps = state => {
  const { user } = state.user;

  return {
    user
  };
};

export default connect(
  mapStateToProps,
  {
    openMyEventTab,
    openMyTribeTab,
    logout

  }
)(Menu);
