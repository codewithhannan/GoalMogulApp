import React from 'react';
import { Text, View } from 'react-native';

const renderStats = (props) => {
  return props.data.map((c) => {
    return (
      <View style={{ display: 'flex', flexDirection: 'row', marginRight: 5 }}>
        <Text style={styles.titleStyle}>
          {c.name}
        </Text>
        <Text style={styles.numberStyle}>
          ({c.stat})
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
    fontSize: 10,
    fontWeight: 'bold',
    color: '#818181'
  },
  numberStyle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#34c0dd'
  }
};

export default Stats;
