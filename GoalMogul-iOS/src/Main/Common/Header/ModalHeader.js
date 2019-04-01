import React from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  Image,
  StatusBar,
  Platform
} from 'react-native';
import { Constants } from 'expo';
import {
  APP_BLUE
} from '../../../styles';

import {
  IPHONE_MODELS,
  IMAGE_BASE_URL
} from '../../../Utils/Constants';

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

const paddingTop = (
  Platform.OS === 'ios' &&
  IPHONE_MODELS.includes(Constants.platform.ios.model.toLowerCase())
) ? 25 : 43;

const ModalHeader = (props) => {
  const { title, actionText, onCancel, onAction, actionDisabled, cancelText, back, actionHidden } = props;
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
    <View>
      <StatusBar
        barStyle="dark-content"
      />
      <View style={[styles.containerStyle, { paddingTop }]}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={{ alignItems: 'center', flex: 1 }}
          onPress={onCancel}
        >
          {leftComponent}
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.6} style={{ alignItems: 'center', flex: 3 }}>
          <Text style={styles.titleTextStyle}>{title}</Text>
        </TouchableOpacity>

        {actionHidden ? null :
          <TouchableOpacity
            activeOpacity={0.6}
            style={{ alignItems: 'center', flex: 1 }}
            onPress={onAction}
            disabled={actionDisabled}
          >
            <Text style={actionTextStyle}>{actionText}</Text>
          </TouchableOpacity>
        }

      </View>
    </View>
  );
};

const fontSize = 16;
const padding = 7;

const styles = {
  containerStyle: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingTop: 25,
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
