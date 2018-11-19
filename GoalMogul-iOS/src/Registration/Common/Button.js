import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';

const Button = (props) => {
  const containerStyle = { ...styles.containerStyle };
  const textStyle = { ...styles.textStyle };

  if (props.arrow) {
    containerStyle.backgroundColor = '#ffffff';
    textStyle.color = '#46C8F5';
    textStyle.fontWeight = '600';

    return (
      <View style={containerStyle}>
        <Text style={textStyle}>{props.text}</Text>
        <View style={{ alignSelf: 'center', alignItems: 'center' }}>
          <Icon
            name='ios-arrow-round-forward'
            type='ionicon'
            color='#34c0dd'
            iconStyle={styles.iconStyle}
          />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.containerStyle}>
      <Text style={styles.textStyle}>{props.text}</Text>
    </View>
  );
};

const styles = {
  containerStyle: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 8,
    marginLeft: 18,
    marginRight: 18,
    height: 41,
    justifyContent: 'center',
    backgroundColor: '#46C8F5'
  },
  textStyle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
    alignSelf: 'center'
  },
  iconStyle: {
    alignSelf: 'center',
    fontSize: 26,
    marginLeft: 5
  }
};

export default Button;
