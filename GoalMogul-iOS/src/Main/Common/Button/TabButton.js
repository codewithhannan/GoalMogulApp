import React from 'react';
import { View, Text, Animated, Image } from 'react-native';
import { Icon } from 'react-native-elements';

const TabButton = (props) => {
  const color = props.onSelect ? 'white' : '#696969';
  const stat = !props.stat ? '' :
    (
      <View>
        <Icon
          name='dot-single'
          type='entypo'
          color='#818181'
          size={18}
          iconStyle={[styles.dotIconStyle, color]}
          containerStyle={styles.iconContainerStyle}
        />
        <Text style={styles.textStyle}>
          {props.stat}
        </Text>
      </View>
    );

  // Select iconStyle
  const iconStyle = props.onSelect ? { ...styles.iconStyle, ...props.iconStyle }
    : { ...styles.iconStyle, ...props.iconStyle, tintColor: '#696969' };

  const icon = !props.iconSource ? '' :
    (
      <Image
        source={props.iconSource}
        style={iconStyle}
      />
  );

  if (props.onSelect) {
    return (
      <View style={styles.onSelectContainerStyle}>
        {icon}
        <Animated.Text style={styles.onSelectTextStyle}>
          {props.text}
        </Animated.Text>
        {stat}
      </View>
    );
  }
  return (
    <View style={styles.containerStyle}>
      {icon}
      <Animated.Text style={styles.textStyle}>
        {props.text}
      </Animated.Text>
      {stat}
    </View>
  );
};

const styles = {
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  onSelectContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#4dc9f2'
    backgroundColor: '#f8f8f8'
  },
  textStyle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#696969',
  },
  onSelectTextStyle: {
    fontSize: 11,
    fontWeight: '800',
    // color: 'white',
    color: '#1998c9'
  },
  dotIconStyle: {


  },
  iconContainerStyle: {
    width: 18,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconStyle: {
    height: 12,
    width: 12,
    alignSelf: 'center',
    justifyContent: 'center',
    tintColor: '#1998c9',
    marginRight: 7
  }
};

export default TabButton;
