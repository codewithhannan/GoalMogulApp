import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import {
  APP_BLUE
} from '../../../styles';

import BackButton from '../../../asset/utils/back.png';

/* Icon */
// const renderLeftComponent = (cancelText, back) => {
//   if (cancelText === null) return null;
//   const cancel = cancelText !== undefined ? cancelText : 'Cancel';

//   const leftComponent = back
//     ? (
//       <Image
//         source={BackButton}
//         style={{ height: 25, width: 25, tintColor: APP_BLUE, marginRight: 20 }}
//       />
//     )
//     : (
//       <Text style={styles.cancelTextStyle}>{cancel}</Text>
//     );
  
//   return leftComponent;
// };

const ModalHeader = (props) => {
  const { title, actionText, onCancel, onAction, actionDisabled, cancelText, back } = props;
  const cancel = cancelText !== null && cancelText !== undefined ? cancelText : 'Cancel';

  let leftComponent = back
    ? (
      <Image
        source={BackButton}
        style={{ height: 25, width: 25, tintColor: APP_BLUE, marginRight: 20 }}
      />
    )
    : (
      <Text style={styles.cancelTextStyle}>{cancel}</Text>
    );
  
  if (cancelText === null) {
    leftComponent = null;
  }

  const actionTextStyle = actionDisabled
    ? { ...styles.actionTextStyle, color: 'lightgray' }
    : styles.actionTextStyle;

  return (
    <View style={styles.containerStyle}>
      <TouchableOpacity
        activeOpacity={0.85}
        style={{ alignItems: 'center', flex: 1 }}
        onPress={onCancel}
      >
        {leftComponent}
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.85} style={{ alignItems: 'center', flex: 3 }}>
        <Text style={styles.titleTextStyle}>{title}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        style={{ alignItems: 'center', flex: 1 }}
        onPress={onAction}
        disabled={actionDisabled}
      >
        <Text style={actionTextStyle}>{actionText}</Text>
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
    // color: '#17B3EC',
    color: APP_BLUE,
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
    // color: '#17B3EC'
    color: APP_BLUE,
  }
};

export default ModalHeader;
