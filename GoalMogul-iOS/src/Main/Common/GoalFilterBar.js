import React, {Component} from 'react';
import { View, Text, Image, TouchableOpacity, Button } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

/* asset */
import dropDown from '../../asset/utils/dropDown.png';

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

        <Menu onSelect={value => this.handleOnMenuSelect('sortBy', value)}>
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
          <MenuOptions>
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

        <Menu onSelect={value => console.log('selecting value is: ', value)}>
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
          <MenuOptions>
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

        <Menu onSelect={value => console.log('selecting value is: ', value)}>
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
          <MenuOptions>
            <MenuOption
              text='All'
              value='all'
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
    color: '#1fb6dd',
    fontWeight: '600',
  },
  standardTextStyle: {
    fontSize: 9,
    color: 'black'
  },
  caretStyle: {
    tintColor: '#20485f',
    marginLeft: 5
  }
};

export default GoalFilterBar;
