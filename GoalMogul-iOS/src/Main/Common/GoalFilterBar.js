import React, {Component} from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

/* asset */
import dropDown from '../../asset/utils/dropDown.png';


class GoalFilterBar extends Component {

  render() {
    const { containerStyle, textStyle, detailContainerStyle, standardTextStyle, caretStyle } = styles;
    return (
      <View style={containerStyle}>

        <Menu onSelect={value => console.log('selecting value is: ', value)}>
          <MenuTrigger
            children={
              <TouchableOpacity style={detailContainerStyle}>
              <Text style={textStyle}>Sort by</Text>
              <Image style={caretStyle} source={dropDown} />
              </TouchableOpacity>
            }
          />
          <MenuOptions>
            <MenuOption
              text='Important'
            />
            <MenuOption
              text='Recent'
            />
            <MenuOption
              text='Popular'
            />

          </MenuOptions>
        </Menu>


        <TouchableOpacity style={detailContainerStyle}>
          <Text style={textStyle}>Order by
            {/*<Text style={standardTextStyle}> (ALL)</Text>*/}
          </Text>
          <Image style={caretStyle} source={dropDown} />
        </TouchableOpacity>

        <TouchableOpacity style={detailContainerStyle}>
          <Text style={textStyle}>Category
            {/*<Text style={standardTextStyle}> (ALL)</Text>*/}
          </Text>
          <Image style={caretStyle} source={dropDown} />
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = {
  containerStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 5,
    backgroundColor: '#ffffff'
  },
  detailContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    marginLeft: 15
  },
  textStyle: {
    fontSize: 10,
    color: '#1fb6dd',
    fontWeight: '600'
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
