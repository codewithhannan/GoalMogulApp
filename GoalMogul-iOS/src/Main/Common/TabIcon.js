import React from 'react';
import { Image, View, Text } from 'react-native';
import { connect } from 'react-redux';

/* Assets */
import IconHome from '../../asset/footer/navigation/home.png';
import IconBell from '../../asset/footer/navigation/bell.png';
import IconMeet from '../../asset/footer/navigation/meet.png';
import IconChat from '../../asset/footer/navigation/chat.png';
import IconStar from '../../asset/footer/navigation/star.png';

class TabIcon extends React.PureComponent {
  render() {
    // console.log('key is: ', this.props)
    // console.log('title is: ', this.props.title)
    const { 
      activeTintColor, 
      inactiveTintColor, 
      navigation, 
      focused,
      notificationCount
    } = this.props;
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
          <View style={styles.iconContainerStyle}>
            {
              (notificationCount && notificationCount > 0)
              ? (
                <View style={styles.notificationCountContainerStyle} zIndex={2}>
                  <Text style={styles.notificationCountTextStyle}>{notificationCount}</Text>
                </View>
              ) : null
            }
            <Image source={IconBell} style={style} zIndex={1} />
          </View>
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
  },
  containerStyle: {
    height: 25,
    width: 25,
    alignSelf: 'center'
  },
  iconContainerStyle: {
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notificationCountContainerStyle: {
    backgroundColor: '#fa5052',
    height: 16,
    minWidth: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 2,
    right: 1
  },
  notificationCountTextStyle: {
    fontSize: 10,
    color: 'white',
    marginLeft: 4,
    marginRight: 3,
    alignSelf: 'center'
  }
};

const mapStateToProps = state => {
  const { unreadCount } = state.notification.unread;
  return {
    notificationCount: unreadCount
  };
};

export default connect(
  mapStateToProps,
  null
)(TabIcon);
