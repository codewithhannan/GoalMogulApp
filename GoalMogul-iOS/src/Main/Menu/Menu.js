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

import {
  IPHONE_MODELS
} from '../../Utils/Constants';

class Menu extends React.PureComponent {

  render() {
    const paddingTop = (
      Platform.OS === 'ios' &&
      IPHONE_MODELS.includes(Constants.platform.ios.model.toLowerCase())
    ) ? 40 : 30;

    return (
      <View style={{ flex: 1 }}>
        <View style={{ ...styles.headerStyle, paddingTop }}>
          <View style={{ flex: 1, height: 30, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16 }}>Jia Zeng</Text>
          </View>
        </View>
        <Button
          iconSource={TribeIcon}
          onPress={() => this.props.openMyTribeTab()}
          title='My Tribes'
        />
        <Button
          iconSource={EventIcon}
          onPress={() => this.props.openMyEventTab()}
          title='My Events'
        />
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

export default connect(
  null,
  {
    openMyEventTab,
    openMyTribeTab
  }
)(Menu);
