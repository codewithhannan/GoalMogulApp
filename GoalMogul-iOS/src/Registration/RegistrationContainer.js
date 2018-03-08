import React from 'react';
import { View } from 'react-native';

const RegistrationContainer = (props) => {
 return (
   <View style={styles.containerStyle}>
     {props.children}
   </View>
 );
};

const styles = {
  containerStyle: {
    flex: 1,
    display: 'flex'
  }
};

export default RegistrationContainer;
