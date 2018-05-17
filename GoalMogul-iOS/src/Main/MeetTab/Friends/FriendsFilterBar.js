import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

/* asset */
import dropDown from '../../../asset/utils/dropDown.png';

// Actions
import { meetChangeFilter } from '../../../actions';

class FriendsFilterbar extends Component {
  handleOnMenuSelect(type, value) {
    this.props.meetChangeFilter('friends', type, value);
  }

  render() {
    const {
      containerStyle,
      textStyle,
      detailContainerStyle,
      standardTextStyle,
      caretStyle
    } = styles;
    return (
      <View style={containerStyle}>

        <Menu onSelect={value => this.handleOnMenuSelect('sortBy', value)}>
          <MenuTrigger
            customStyles={{
              TriggerTouchableComponent: TouchableOpacity,
            }}
          >
            <View style={detailContainerStyle}>
              <Text style={textStyle}>Sort by</Text>
              <Image style={caretStyle} source={dropDown} />
            </View>
          </MenuTrigger>
          <MenuOptions>
            <MenuOption
              text='Alphabetical'
              value='alphabetical'
            />
            <MenuOption
              text='Last added'
              vale='lastadded'
            />

          </MenuOptions>
        </Menu>

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
    paddingBottom: 12
  },
  detailContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    marginLeft: 15
  },
  textStyle: {
    fontSize: 9,
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

export default connect(
  null,
  {
    meetChangeFilter
  }
)(FriendsFilterbar);
