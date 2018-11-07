import React from 'react';
import {
  View
} from 'react-native';

const ActionButtonGroup = (props) => {
  const { containerStyle } = props;
  return (
    <View style={{ ...styles.containerStyle, ...containerStyle }}>
      {props.children}
    </View>
  );
};

const styles = {
  containerStyle: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20
  }
};

export default ActionButtonGroup;
