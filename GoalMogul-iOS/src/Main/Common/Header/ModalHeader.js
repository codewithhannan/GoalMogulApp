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
import { walkthroughable, CopilotStep } from 'react-native-copilot-gm';

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

const WalkableView = walkthroughable(View);

const paddingTop = (
  Platform.OS === 'ios' &&
  IPHONE_MODELS.includes(Constants.platform.ios.model.toLowerCase())
) ? 25 : 43;

const ModalHeader = (props) => {
  const { 
    title, 
    actionText, 
    onCancel, 
    onAction, 
    actionDisabled, 
    cancelText, 
    back, 
    actionHidden, 
    titleIcon, containerStyles, actionTextStyle, backButtonStyle, titleTextStyle, tutorialOn } = props;
  const cancel = cancelText !== null && cancelText !== undefined ? cancelText : 'Cancel';

  const extraBackButtonStyle = backButtonStyle || {};
  let leftComponent = back
    ? (
      <Image
        source={BackButton}
        style={{ height: 25, width: 25, tintColor: APP_BLUE, marginRight: 20, ...extraBackButtonStyle }}
      />
    )
    : (
      <Text style={styles.cancelTextStyle}>{cancel}</Text>
    );
  
  if (cancelText === null) {
    leftComponent = null;
  }

  const extraContainerStyles = containerStyles || {};
  const extraActionTextStyle = actionTextStyle || {};
  const extraTitleTextStyle = titleTextStyle || {};

  const primaryActionTextStyle = actionDisabled
    ? { ...styles.actionTextStyle, color: 'lightgray' }
    : styles.actionTextStyle;

  let actionComponent = (
    <TouchableOpacity
      activeOpacity={0.6}
      style={{ alignItems: 'center', flex: 1, opacity: actionHidden ? 0 : 1 }}
      onPress={onAction}
      disabled={actionDisabled}
    >
      <Text style={[primaryActionTextStyle, extraActionTextStyle]}>{actionText}</Text>
    </TouchableOpacity>
  );

  if (tutorialOn && tutorialOn.actionText) {
    const { tutorialText, name, order } = tutorialOn.actionText;
    actionComponent = (
      <CopilotStep text={tutorialText} order={order} name={name}>
        <WalkableView>
            {actionComponent}
        </WalkableView>
      </CopilotStep>
    );
  }

  return (
    <View
      style={{
        zIndex: 1000,
      }}
    >
      <StatusBar
        barStyle="dark-content"
      />
      <View style={[styles.containerStyle, { paddingTop, ...extraContainerStyles  }]}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={{ alignItems: 'center', flex: 1 }}
          onPress={onCancel}
        >
          {leftComponent}
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.6} style={{ alignItems: 'center', flex: 3 }}>
          <View style={styles.titleTextContainerStyle}>
            {titleIcon && <Image
              style={styles.titleTextIconStyle}
              source={titleIcon}
            />}
            <Text style={[styles.titleTextStyle, extraTitleTextStyle]} numberOfLines={1}>{title}</Text>
          </View>
        </TouchableOpacity>
            
        {actionComponent}
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
    paddingTop: padding,
    paddingBottom: padding,
    textAlign: 'center',
    fontWeight: '600'
  },
  titleTextIconStyle: {
    borderRadius: 5,
    height: 24,
    width: 24,
    marginTop: 4,
    marginRight: 6,
    padding: 1,
    border: '1px solid #F1F1F1',
    backgroundColor: '#fff',
  },
  titleTextContainerStyle: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
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
