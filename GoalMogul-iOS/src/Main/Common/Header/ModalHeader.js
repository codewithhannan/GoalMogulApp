import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

/* Icon */

const ModalHeader = (props) => {
  const { title, actionText } = props;
  return (
    <View style={styles.containerStyle}>
      <TouchableOpacity style={{ alignItems: 'center', flex: 1 }}>
          <Text style={styles.cancelTextStyle}>Cancel</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ alignItems: 'center', flex: 3 }}>
        <Text style={styles.titleTextStyle}>{title}</Text>

      </TouchableOpacity>

      <TouchableOpacity style={{ alignItems: 'center', flex: 1 }}>

        <Text style={styles.actionTextStyle}>{actionText}</Text>

      </TouchableOpacity>

    </View>
  );
};

const fontSize = 16;
const padding = 7;

const styles = {
  containerStyle: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingTop: 30,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionTextStyle: {
    fontSize,
    color: '#45C9F6',
    fontWeight: '800',
    paddingTop: padding,
    paddingBottom: padding,
  },
  titleTextStyle: {
    fontSize,
    alignSelf: 'center',
    paddingTop: padding,
    paddingBottom: padding,
  },
  cancelTextStyle: {
    paddingTop: padding,
    paddingBottom: padding,
    fontSize,
    color: '#45C9F6'
  }
};

export default ModalHeader;
