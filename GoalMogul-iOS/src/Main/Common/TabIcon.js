import React, { Component } from 'react';
import { Image } from 'react-native';

/* Assets */
import IconHome from '../../asset/footer/navigation/home.png';
import IconBell from '../../asset/footer/navigation/bell.png';
import IconGoal from '../../asset/footer/navigation/goal.png';
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
          <Image source={IconHome} style={{tintColor: tintColor}} />
        );
      case 'goalTab':
        return (
          <Image source={IconGoal} style={{tintColor: tintColor}} />
        );
      case 'notificationTab':
        return (
          <Image source={IconBell} style={{tintColor: tintColor}} />
        );
      case 'chatTab':
        return (
          <Image source={IconChat} style={{tintColor: tintColor}} />
        );
      case 'exploreTab':
        return (
          <Image source={IconStar} style={{tintColor: tintColor}} />
        );
      default:
        return (
          <Image source={IconHome} style={{tintColor: tintColor}} />
        );
    }
  }
}

export default TabIcon;