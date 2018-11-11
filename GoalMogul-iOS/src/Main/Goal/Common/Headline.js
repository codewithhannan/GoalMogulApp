import React from 'react';
import { TouchableOpacity, View, Image, Text, FlatList, Dimensions } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';

/* Components */
import Name from './Name';
import Category from './Category';

/* Asset */
import badge from '../../../asset/utils/badge.png';
import dropDown from '../../../asset/utils/dropDown.png';

const { width } = Dimensions.get('window');

/**
 * category:
 * name:
 * caretOnPress:
 * caretOnDelete:
 * isSelf:
 * hasCaret: if null, show no caret
 */
const Headline = (props) => {
  const {
    category,
    name,
    caretOnPress,
    isSelf,
    caretOnDelete,
    hasCaret
  } = props;

  // If item belongs to self, then caret displays delete
  const menu = isSelf === undefined || !isSelf
    ? MenuFactory(
        [
          'Report',
        ],
        () => caretOnPress(),
        '',
        { ...styles.caretContainer },
        () => console.log('Report Modal is opened')
      )
    : MenuFactory(
        [
          'Delete',
        ],
        () => caretOnDelete(),
        '',
        { ...styles.caretContainer },
        () => console.log('Report Modal is opened')
      );

  const categoryComponent = category ? <Category text={category} /> : '';
  // TODO: format time
  return (
    <View style={styles.containerStyle}>
      <Name text={name} />
      <Image style={styles.imageStyle} source={badge} />
      {categoryComponent}
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
        {hasCaret === null ? '' : menu}
      </View>

    </View>
  );
};
// <TouchableOpacity
//   style={styles.caretContainer}
//   onPress={() => caretOnPress()}
// >
//   <Image source={dropDown} />
// </TouchableOpacity>


// Following is a duplicated code and it should be abstracted out
const { Popover } = renderers;
export const MenuFactory =
(options, callback, triggerText, triggerContainerStyle, animationCallback) => {
  const triggerTextView = triggerText
    ? (
        <Text
          style={{ fontSize: 15, margin: 10, marginLeft: 15, flex: 1 }}
        >
          {triggerText}
        </Text>
      )
    : '';
  return (
    <Menu
      onSelect={value => callback(value)}
      rendererProps={{ placement: 'bottom', anchorStyle: styles.anchorStyle }}
      renderer={Popover}
      onOpen={animationCallback}
    >
      <MenuTrigger
        customStyles={{
          TriggerTouchableComponent: TouchableOpacity,
        }}
      >
        <View style={triggerContainerStyle}>
          {triggerTextView}
          <Image source={dropDown} style={{ height: 12, width: 12 }} />
        </View>
      </MenuTrigger>
      <MenuOptions customStyles={styles.menuOptionsStyles}>
        <FlatList
          data={options}
          renderItem={({ item }) => (
            <MenuOption value={item} text={item} />
          )}
          keyExtractor={(item, index) => index.toString()}
          style={{ height: 40 }}
        />
      </MenuOptions>
    </Menu>
  );
};


const styles = {
  containerStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  caretContainer: {
    paddingBottom: 10,
    paddingRight: 8,
    paddingLeft: 10,
    paddingTop: 5
  },
  imageStyle: {
    alignSelf: 'center',
    marginLeft: 3,
    marginRight: 3
  },
  // Menu related style
  triggerContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#e9e9e9',
    shadowColor: '#ddd',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 1,
  },
  anchorStyle: {
    backgroundColor: 'white'
  },
  menuOptionsStyles: {
    optionsContainer: {
      width: width / 3,
    },
    optionsWrapper: {

    },
    optionWrapper: {
      flex: 1,
    },
    optionTouchable: {
      underlayColor: 'lightgray',
      activeOpacity: 10,
    },
    optionText: {
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 10,
      paddingRight: 10,
      color: 'black',
    },
  }
};

export default Headline;
