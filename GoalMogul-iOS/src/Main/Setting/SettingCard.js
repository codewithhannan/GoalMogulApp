import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';

import DelayedButton from '../Common/Button/DelayedButton';

class SettingCard extends Component {

  renderIcon() {
    const iconStyle = this.props.iconStyle || styles.titleIconStyle;
    if (this.props.icon) {
      return (
        <Image source={this.props.icon} style={iconStyle} />
      );
    }
    return null;
  }

  render() {
    return (
      <DelayedButton activeOpacity={0.6} onPress={this.props.onPress} delay={700}>
        <View style={styles.containerStyle}>
          <View style={styles.titleContainerStyle}>
            {this.renderIcon()}
            <Text style={styles.titleStyle}>
              {this.props.title}
            </Text>
          </View>
          <Text style={styles.explanationTextStyle}>
            {this.props.explanation}
          </Text>
        </View>
      </DelayedButton>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    marginLeft: 15,
    marginRight: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6'
  },
  titleContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleIconStyle: {
    height: 20,
    width: 20,
    marginRight: 5
  },
  titleStyle: {
    fontSize: 17,
    fontWeight: '700'
  },
  explanationTextStyle: {
    fontSize: 12,
    marginTop: 3,
    marginLeft: 3
  }
};

export default SettingCard;
