import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';

/* asset */
import dropDown from '../../asset/utils/dropDown.png';

const { Popover } = renderers;
const { width } = Dimensions.get('window');

class GoalFilterBar extends Component {

  handleOnMenuSelect = (type, value) => {
    console.log('selecting value is: ', value);
    console.log('selecting type is: ', type)
    // TODO: alter reducer state
  }

  render() {
    const { containerStyle, textStyle, detailContainerStyle, standardTextStyle, caretStyle } = styles;
    return (
      <View style={containerStyle}>

        <Menu
          onSelect={value => this.handleOnMenuSelect('sortBy', value)}
          rendererProps={{ placement: 'bottom', anchorStyle: styles.anchorStyle }}
          renderer={Popover}
        >
          <MenuTrigger
            customStyles={{
              TriggerTouchableComponent: TouchableOpacity,
            }}
          >
            <View style={styles.detailContainerStyle}>
              <Text style={styles.textStyle}>Sort by</Text>
              <Image style={styles.caretStyle} source={dropDown} />
            </View>
          </MenuTrigger>
          <MenuOptions customStyles={styles.menuOptionsStyles}>
            <MenuOption
              text='Important'
              value='important'
            />
            <MenuOption
              text='Recent'
              vale='recent'
            />
            <MenuOption
              text='Popular'
              value='popular'
            />

          </MenuOptions>
        </Menu>

        <Menu
          onSelect={value => console.log('selecting value is: ', value)}
          rendererProps={{ placement: 'bottom' }}
          renderer={Popover}
        >
          <MenuTrigger
            customStyles={{
              TriggerTouchableComponent: TouchableOpacity,
            }}
          >
            <View style={detailContainerStyle}>
              <Text style={textStyle}>Order by
                {/* <Text style={standardTextStyle}> (ALL)</Text> */}
              </Text>
              <Image style={caretStyle} source={dropDown} />
            </View>
          </MenuTrigger>
          <MenuOptions customStyles={styles.menuOptionsStyles}>
            <MenuOption
              text='Ascending'
              value='ascending'
            />
            <MenuOption
              text='Descending'
              vale='descending'
            />
          </MenuOptions>
        </Menu>

        <Menu
          onSelect={value => this.handleOnMenuSelect('categories', value)}
          rendererProps={{ placement: 'bottom' }}
          renderer={Popover}
        >
          <MenuTrigger
            customStyles={{
              TriggerTouchableComponent: TouchableOpacity,
            }}
          >
            <View style={detailContainerStyle}>
              <Text style={textStyle}>Category
                {/* <Text style={standardTextStyle}> (ALL)</Text> */}
              </Text>
              <Image style={caretStyle} source={dropDown} />
            </View>
          </MenuTrigger>
          <MenuOptions customStyles={styles.menuOptionsStyles}>
            <MenuOption
              text='General'
              value='General'
            />
            <MenuOption
              text='Learning/Education'
              value='Learning/Education'
            />
            <MenuOption
              text='Career/Business'
              value='Career/Business'
            />
            <MenuOption
              text='Financial'
              value='Financial'
            />
            <MenuOption
              text='Spiritual'
              value='Spiritual'
            />
            <MenuOption
              text='Family/Personal'
              value='Family/Personal'
            />
          </MenuOptions>
        </Menu>

      </View>
    );
  }
}

const touchableOpacityProps = {
  activeOpacity: 0.6,
};

const styles = {
  containerStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    marginLeft: 15,
    paddingTop: 12,
    paddingBottom: 12
  },
  textStyle: {
    fontSize: 10,
    // color: '#1fb6dd',
    color: '#696969',
    fontWeight: '600',
  },
  standardTextStyle: {
    fontSize: 9,
    color: 'black'
  },
  caretStyle: {
    // tintColor: '#20485f',
    tintColor: '#696969',
    marginLeft: 5
  },
  anchorStyle: {
    backgroundColor: 'white'
  },
  menuOptionsStyles: {
    optionsContainer: {
      width: width - 14,
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

export default GoalFilterBar;
