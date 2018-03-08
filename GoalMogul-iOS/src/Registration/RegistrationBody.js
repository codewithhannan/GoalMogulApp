import React from 'react';
import { View } from 'react-native';

const RegistrationBody = (props) => {
 return (
   <View style={styles.containerStyle}>
     {props.children}
   </View>
 );
};

const styles = {
  containerStyle: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
  }
};

export default RegistrationBody;
