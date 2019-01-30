import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import { Constants } from 'expo';
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

// Assets
import TribeIcon from '../../asset/explore/tribe.png';
import EventIcon from '../../asset/suggestion/event.png';
import TutorialIcon from '../../asset/utils/tutorial.png';

import {
  IPHONE_MODELS
} from '../../Utils/Constants';

class Menu extends React.PureComponent {

  render() {
    const paddingTop = (
      Platform.OS === 'ios' &&
      IPHONE_MODELS.includes(Constants.platform.ios.model.toLowerCase())
    ) ? 40 : 30;

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
          <Text style={styles.titleTextStyle}>My Tutorials</Text>
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
    openMyTribeTab
  }
)(Menu);
