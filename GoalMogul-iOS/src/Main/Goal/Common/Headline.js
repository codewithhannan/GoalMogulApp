import React from 'react';
import { TouchableOpacity, View, Image } from 'react-native';

/* Components */
import Name from './Name';
import Category from './Category';

/* Asset */
import badge from '../../../asset/utils/badge.png';
import dropDown from '../../../asset/utils/dropDown.png';

const Headline = (props) => {
  const { category, name, caretOnPress } = props;
  // TODO: format time
  return (
    <View style={styles.containerStyle}>
      <Name text={name} />
      <Image style={styles.imageStyle} source={badge} />
      <Category text={category} />
      <TouchableOpacity
        style={styles.caretContainer}
        onPress={() => caretOnPress()}
      >
        <Image source={dropDown} />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  containerStyle: {
    display: 'flex',
    flexDirection: 'row'
  },
  caretContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  imageStyle: {
    alignSelf: 'center',
    marginLeft: 3,
    marginRight: 3
  }
};

export default Headline;
