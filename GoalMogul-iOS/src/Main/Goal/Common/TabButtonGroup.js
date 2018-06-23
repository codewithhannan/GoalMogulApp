import React from 'react';
import {
  View
} from 'react-native';

const TabButtonGroup = (props) => {
  return (
    <View style={styles.containerStyle}>
      {props.children}
    </View>
  );
};

const styles = {
  containerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 0.5,
    marginBottom: 0.5,
    backgroundColor: 'white'
  }
};

export default TabButtonGroup;
