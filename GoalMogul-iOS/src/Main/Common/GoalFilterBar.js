import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
import { CheckBox } from 'react-native-elements';

/* asset */
import dropDown from '../../asset/utils/dropDown.png';

const { Popover } = renderers;
const { width } = Dimensions.get('window');

/**
 * Update the filter based on parents functions
 * @param onMenuChange(type, value)
 * @param filter
 */
class GoalFilterBar extends Component {

  /**
   * @param type: ['sortBy', 'sortOrder', 'categories', 'priorities']
   */
  handleOnMenuSelect = (type, value) => {
    this.props.onMenuChange(type, value);
  }

  render() {
    const {
      containerStyle,
      textStyle,
      detailContainerStyle,
      standardTextStyle,
      caretStyle
    } = styles;

    const {
      sortBy,
      orderBy,
      categories,
      priorities
    } = this.props.filter;

    const prioritiesArray = priorities === '' ? [] : priorities.split(',');

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
              text='Created'
              value='created'
            />
            <MenuOption
              text='Updated'
              vale='updated'
            />
            <MenuOption
              text='Shared'
              value='shared'
            />
            <MenuOption
              text='Priority'
              value='priority'
            />

          </MenuOptions>
        </Menu>

        <Menu
          onSelect={value => this.handleOnMenuSelect('orderBy', value)}
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
              value='descending'
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
              text='All'
              value='All'
            />
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

        <Menu
          onSelect={value => this.handleOnMenuSelect('priorities', value)}
          rendererProps={{ placement: 'bottom' }}
          renderer={Popover}
        >
          <MenuTrigger
            customStyles={{
              TriggerTouchableComponent: TouchableOpacity,
            }}
          >
            <View style={detailContainerStyle}>
              <Text style={textStyle}>Priorities
                {/* <Text style={standardTextStyle}> (ALL)</Text> */}
              </Text>
              <Image style={caretStyle} source={dropDown} />
            </View>
          </MenuTrigger>
          <MenuOptions customStyles={styles.menuOptionsStyles}>
            <MenuOption
              text='All'
              value='All'
            />
            <ScrollView style={{ height: 250 }}>
              <CheckBox
                title='1'
                checked={prioritiesArray.indexOf('1') > -1}
                onPress={() =>
                  this.handleOnMenuSelect('priorities', '1')
                }
              />
              <CheckBox
                title='2'
                checked={prioritiesArray.indexOf('2') > -1}
                onPress={() =>
                  this.handleOnMenuSelect('priorities', '2')
                }
              />
              <CheckBox
                title='3'
                checked={prioritiesArray.indexOf('3') > -1}
                onPress={() =>
                  this.handleOnMenuSelect('priorities', '3')
                }
              />
              <CheckBox
                title='4'
                checked={prioritiesArray.indexOf('4') > -1}
                onPress={() =>
                  this.handleOnMenuSelect('priorities', '4')
                }
              />
              <CheckBox
                title='5'
                checked={prioritiesArray.indexOf('5') > -1}
                onPress={() =>
                  this.handleOnMenuSelect('priorities', '5')
                }
              />
              <CheckBox
                title='6'
                checked={prioritiesArray.indexOf('6') > -1}
                onPress={() =>
                  this.handleOnMenuSelect('priorities', '6')
                }
              />
              <CheckBox
                title='7'
                checked={prioritiesArray.indexOf('7') > -1}
                onPress={() =>
                  this.handleOnMenuSelect('priorities', '7')
                }
              />
              <CheckBox
                title='8'
                checked={prioritiesArray.indexOf('8') > -1}
                onPress={() =>
                  this.handleOnMenuSelect('priorities', '8')
                }
              />
              <CheckBox
                title='9'
                checked={prioritiesArray.indexOf('9') > -1}
                onPress={() =>
                  this.handleOnMenuSelect('priorities', '9')
                }
              />
            </ScrollView>
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
