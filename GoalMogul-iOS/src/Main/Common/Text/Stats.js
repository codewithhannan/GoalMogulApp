import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';

const renderStats = (props) => {
  return props.data.map((c) => {
    return (
      <View style={{ flex: 1, flexDirection: 'row', marginRight: 5 }}>
        <Text style={styles.titleStyle}>
          {c.name}
        </Text>
          <Icon
            name='dot-single'
            type='entypo'
            color='#818181'
            size={18}
            iconStyle={styles.iconStyle}
            containerStyle={styles.iconContainerStyle}
          />

        <Text style={styles.numberStyle}>
          {c.stat}
        </Text>
      </View>
    );
  });
};

const Stats = (props) => {
  return (
    <View style={styles.containerStyle}>
      {renderStats(props)}
    </View>
  );
};

const styles = {
  containerStyle: {
    display: 'flex',
    flexDirection: 'row'
  },
  titleStyle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#818181'
  },
  numberStyle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#45C9F6'
  },
  iconStyle: {


  },
  iconContainerStyle: {
    width: 18,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export default Stats;
