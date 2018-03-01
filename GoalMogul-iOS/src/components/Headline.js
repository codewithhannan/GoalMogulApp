import React from 'react';
import { View } from 'react-native';
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
      <View style={styles.caretStyle}>
        <Icon
          name='triangle'
          color='#bec1c5'
          size='12'
        />
      </View>
    </View>
  );
};

const styles = {
  containerStyle: {
    display: 'flex',
    flexDirection: 'row'
  },
  caretStyle: {
    alignItems: 'flex-end'
  }
};

export default Headline;
