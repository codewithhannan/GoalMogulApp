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
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default ActionButtonGroup;
