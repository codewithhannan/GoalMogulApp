import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';

const renderStats = (props) => {
  return props.data.map((c) => {
    return (
      <View style={{ flex: 1, flexDirection: 'row', marginRight: 5, alignItems: 'center' }}>
        <Text style={styles.titleStyle}>
          {c.name}
        </Text>
        <View>
          <Icon
            name='dot-single'
            type='entypo'
            color='#818181'
            size={18}
            iconStyle={styles.iconStyle}
            containerStyle={styles.iconContainerStyle}
          />
        </View>
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
    fontSize: 12,
    fontWeight: 'bold',
    color: '#45C9F6'
  },
  iconStyle: {


  },
  iconContainerStyle: {
    width: 15,
    marginRight: 2
  }
};

export default Stats;
