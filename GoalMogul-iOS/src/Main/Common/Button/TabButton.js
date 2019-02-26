import React from 'react';
import { View, Text, Animated, Image } from 'react-native';
import { DotIcon } from '../../../Utils/Icons';

// Default button style
const defaultButtonStyle = {
  selected: {
    backgroundColor: '#f8f8f8', // container background style
    tintColor: '#1998c9', // icon tintColor
    color: '#1998c9', // text color
    fontWeight: '700', // text fontWeight
    statColor: 'white' // stat icon color
  },
  unselected: {
    backgroundColor: 'white',
    tintColor: '#696969',
    color: '#696969',
    fontWeight: '600',
    statColor: '#696969'
  }
};

const TabButton = (props) => {
  const buttonStyle = props.buttonStyle || defaultButtonStyle;
  const {
    color,
    backgroundColor,
    tintColor,
    fontWeight,
    statColor
  } = props.onSelect ? buttonStyle.selected : buttonStyle.unselected;
  const stat = !props.stat ? '' :
    (
      <View>
        <DotIcon 
          iconStyle={{ tintColor: '#818181', width: 3, height: 3, marginLeft: 4, marginRight: 4 }}
        />
        {/* <Icon
          name='dot-single'
          type='entypo'
          color='#818181'
          size={18}
          iconStyle={[styles.dotIconStyle, ...{ color: statColor }]}
          containerStyle={styles.iconContainerStyle}
        /> */}
        <Text style={styles.textStyle}>
          {props.stat}
        </Text>
      </View>
    );

  // Select iconStyle
  const iconStyle = props.onSelect ? { ...styles.iconStyle, ...props.iconStyle, tintColor }
    : { ...styles.iconStyle, ...props.iconStyle, tintColor };

  const icon = !props.iconSource ? '' :
    (
      <Image
        source={props.iconSource}
        style={iconStyle}
      />
  );

  if (props.onSelect) {
    return (
      <View style={{ ...styles.onSelectContainerStyle, backgroundColor }}>
        {icon}
        <Animated.Text 
          style={{
            ...styles.onSelectTextStyle,
            color,
            fontWeight
          }}
        >
          {props.text}
        </Animated.Text>
        {stat}
      </View>
    );
  }
  return (
    <View style={{ ...styles.containerStyle, backgroundColor }}>
      {icon}
      <Animated.Text 
        style={{ 
          ...styles.textStyle,
          color,
          fontWeight
        }}
      >
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
    fontSize: 10,
    color: '#696969',
  },
  onSelectTextStyle: {
    fontSize: 10,
    fontWeight: '700',
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
