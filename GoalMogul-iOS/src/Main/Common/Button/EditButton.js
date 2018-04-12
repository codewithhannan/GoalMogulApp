import React from 'react';
import {
  View,
  Image,
  TouchableWithoutFeedback
} from 'react-native';

/* Asset */
import editImage from '../../../asset/utils/edit.png';

const EditButton = (props) => {
  return (
    <TouchableWithoutFeedback
      onPress={props.onPress}
    >
      <View style={styles.buttonContainerStyle}>
        <Image
          source={editImage}
          style={styles.editButtonStyle}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = {
  buttonContainerStyle: {
    display: 'flex',
    flex: 1,
    alignSelf: 'flex-end',
    paddingBottom: 2
  },
  editButtonStyle: {
    height: 23,
    width: 23,
    padding: 3,
    alignSelf: 'flex-end',
  }
};

export default EditButton;
