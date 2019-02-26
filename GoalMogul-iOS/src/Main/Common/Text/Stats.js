import React from 'react';
import { Text, View } from 'react-native';

import {
  DotIcon
} from '../../../Utils/Icons';

const renderStats = (props) => props.data.map((c, index) => {
  if (c.stat === undefined || c.stat === null || c.stat === 0) {
    return '';
  }
  return (
    <View
      style={{ flex: 1, flexDirection: 'row', marginRight: 5, alignItems: 'center' }}
      key={index}
    >
      <Text style={styles.titleStyle}>
        {c.name}
      </Text>

      <DotIcon 
        iconContainerStyle={{ ...styles.iconContainerStyle }}
        iconStyle={{ tintColor: '#CCCCC', ...styles.iconStyle, height: 3, width: 3 }}
      />
      {/* <View>
        <Icon
          name='dot-single'
          type='entypo'
          color='#CCCCCC'
          size={13}
          iconStyle={styles.iconStyle}
          containerStyle={styles.iconContainerStyle}
        />
      </View> */}
      <Text style={styles.numberStyle}>
        {c.stat}
      </Text>
    </View>
  );
});

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
    color: '#17B3EC',
    maxWidth: 50
  },
  iconStyle: {

  },
  iconContainerStyle: {
    width: 10,
    // paddingTop: 2,
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export default Stats;
