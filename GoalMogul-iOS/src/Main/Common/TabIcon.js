import React, { Component } from 'react';
import { Image } from 'react-native';

/* Assets */
import IconHome from '../../asset/footer/navigation/home.png';
import IconBell from '../../asset/footer/navigation/bell.png';
import IconMeet from '../../asset/footer/navigation/meet.png';
import IconChat from '../../asset/footer/navigation/chat.png';
import IconStar from '../../asset/footer/navigation/star.png';

class TabIcon extends React.Component {
  render() {
    // console.log('key is: ', this.props)
    // console.log('title is: ', this.props.title)
    const { activeTintColor, inactiveTintColor, navigation, focused } = this.props;
    const tintColor = focused ? activeTintColor : inactiveTintColor;
    switch (navigation.state.key) {
      case 'homeTab':
        return (
          <Image source={IconHome} style={{ tintColor }} />
        );
      case 'meetTab':
        return (
          <Image style={styles.iconStyle} source={IconMeet} style={{ tintColor }} />
        );
      case 'notificationTab':
        return (
          <Image source={IconBell} style={{ tintColor }} />
        );
      case 'chatTab':
        return (
          <Image source={IconChat} style={{ tintColor }} />
        );
      case 'exploreTab':
        return (
          <Image source={IconStar} style={{ tintColor }} />
        );
      default:
        return (
          <Image source={IconHome} style={{ tintColor }} />
        );
    }
  }
}

const styles = {
  iconStyle: {
    width: 30,
    height: 30
  }
};

export default TabIcon;
