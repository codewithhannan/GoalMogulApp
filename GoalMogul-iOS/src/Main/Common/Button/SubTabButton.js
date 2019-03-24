import React from 'react';
import { View, Text, Animated, Image } from 'react-native';

// Default button style
const defaultButtonStyle = {
  selected: {
    backgroundColor: '#1aa0dd', // container background style
    tintColor: '#1aa0dd', // icon tintColor
    color: 'white', // text color
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

const SubTabButton = (props) => {
  const buttonStyle = props.buttonStyle || defaultButtonStyle;
  const {
    color,
    backgroundColor,
    tintColor,
    fontWeight,
    statColor
  } = props.onSelect ? buttonStyle.selected : buttonStyle.unselected;

  // const color = props.onSelect ? '#1aa0dd' : 'white';
  const stat = !props.stat ? null :
    (
      <View>
        <DotIcon 
          iconStyle={{ tintColor: tintColor, width: 3, height: 3, marginLeft: 4, marginRight: 4 }}
        />
        <Text style={styles.textStyle}>
          {props.stat}
        </Text>
      </View>
    );

  // Select iconStyle
  const iconStyle = props.onSelect
    ? { ...styles.iconStyle, ...props.iconStyle, tintColor }
    : { ...styles.iconStyle, ...props.iconStyle, tintColor };

  const icon = !props.iconSource ? null :
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
