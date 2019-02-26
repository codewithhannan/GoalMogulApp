import React from 'react';
import { View, Text, Animated, Image } from 'react-native';

const SubTabButton = (props) => {
  const color = props.onSelect ? '#1aa0dd' : 'white';
  const stat = !props.stat ? '' :
    (
      <View>
        <DotIcon 
          iconStyle={{ tintColor: color, width: 3, height: 3, marginLeft: 4, marginRight: 4 }}
        />
        {/* <Icon
          name='dot-single'
          type='entypo'
          color='#818181'
          size={18}
          iconStyle={[styles.dotIconStyle, color]}
          containerStyle={styles.iconContainerStyle}
        /> */}
        <Text style={styles.textStyle}>
          {props.stat}
        </Text>
      </View>
    );

  // Select iconStyle
  const iconStyle = props.onSelect
    ? { ...styles.iconStyle, ...props.iconStyle, tintColor: '#1aa0dd' }
    : { ...styles.iconStyle, ...props.iconStyle, tintColor: 'white' };

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
    backgroundColor: '#1aa0dd',
  },
  textStyle: {
    fontSize: 10,
    color: '#696969',
  },
  onSelectTextStyle: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white'
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

export default SubTabButton;
