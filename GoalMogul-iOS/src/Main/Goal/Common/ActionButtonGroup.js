import React from 'react';
import {
  View
} from 'react-native';

const ActionButtonGroup = (props) => {
  return (
    <View style={styles.containerStyle}>
      {props.children}
    </View>
  );
};

const styles = {
  containerStyle: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20
  }
};

export default ActionButtonGroup;
