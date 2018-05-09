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
    const style = {
      tintColor,
      height: 25,
      width: 25
    };

    switch (navigation.state.key) {
      case 'homeTab':
        return (
          <Image source={IconHome} style={style} />
        );
      case 'meetTab':
        return (
          <Image source={IconMeet} style={style} />
        );
      case 'notificationTab':
        return (
          <Image source={IconBell} style={style} />
        );
      case 'chatTab':
        return (
          <Image source={IconChat} style={style} />
        );
      case 'exploreTab':
        return (
          <Image source={IconStar} style={style} />
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
    width: 10,
    height: 10
  }
};

export default TabIcon;
