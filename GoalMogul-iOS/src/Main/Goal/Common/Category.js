import React from 'react';
import { Text, View } from 'react-native';

const Category = (props) => {
  // TODO: format time
  return (
    <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
      <Text style={styles.containerStyle} ellipsizeMode='tail' numberOfLines={1}>
        in {props.text}
      </Text>
    </View>
    
  );
};

{/* <Text style={styles.containerStyle} ellipsizeMode='tail' numberOfLines={1}>
      in {props.text}
    </Text> */}

const styles = {
  containerStyle: {
    fontSize: 11,
    color: '#6d6d6d',
    fontWeight: '600',
    alignSelf: 'center'
  }
};

export default Category;
