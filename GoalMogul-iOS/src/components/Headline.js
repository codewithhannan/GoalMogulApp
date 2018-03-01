import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements'

/* Components */
import Name from './Name';
import Category from './Category';

const Headline = (props) => {
  // TODO: format time
  return (
    <View style={styles.containerStyle}>
      <Name text={props.name} />
      <Category text={props.category} />
      <View>
        <Icon
          reverse
          name='triangle-down'
          color='#bec1c5'
          size=10
        />
      </View>
    </View>
  );
};

const styles = {
  containerStyle: {
    flex: 1,
    flexDirection: 'row'
  }
};

export default Headline;
