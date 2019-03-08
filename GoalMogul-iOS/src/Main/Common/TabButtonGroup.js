import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';

import Divider from './Divider';
import TabButton from './Button/TabButton';
import SubTabButton from './Button/SubTabButton';

class TabButtonGroup extends Component {

  renderButton() {
    const { buttons, tabIconMap, subTab, buttonStyle } = this.props;
    const { navigationState, jumpTo, jumpToIndex } = buttons;

    const { index, routes } = navigationState;
    return routes.map((b, i) => {
      const selected = i === index;
      const iconSource = tabIconMap ? tabIconMap[b.key].iconSource : undefined;
      const iconStyle = tabIconMap ? tabIconMap[b.key].iconStyle : undefined;
      const button = subTab
        ? (
          <SubTabButton
            text={b.title}
            onSelect={selected}
            stat={b.stat}
            iconSource={iconSource}
            iconStyle={iconStyle}
            buttonStyle={buttonStyle}
          />
        )
        : (
          <TabButton
            text={b.title}
            onSelect={selected}
            stat={b.stat}
            iconSource={iconSource}
            iconStyle={iconStyle}
            buttonStyle={buttonStyle}
          />
        );
      if (i !== 0) {
        // render divider to the left
        return (
          <TouchableOpacity 
            activeOpacity={0.85}
            key={b.key}
            style={styles.dividerContainerStyle}
            onPress={() => {
              if (jumpTo) {
                jumpTo(b.key);
              } else {
                jumpToIndex(i);
              }
            }}
          >
            <Divider />
            {button}
          </TouchableOpacity>
        );
      }

      return (
        <TouchableOpacity 
          activeOpacity={0.85}
          key={b.key}
          style={styles.dividerContainerStyle}
          onPress={() => {
            if (jumpTo) {
              jumpTo(b.key);
            } else {
              jumpToIndex(i);
            }
          }}
        >
          {button}
        </TouchableOpacity>
      );
    });
  }

  render() {
    const containerStyle = this.props.noBorder
      ? {
        ...styles.containerStyle,
        borderWidth: 0
      }
      : styles.containerStyle;
    return (
      <View style={containerStyle}>
        {this.renderButton()}
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    display: 'flex',
    height: 36,
    flexDirection: 'row',
    borderWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 0.5
  },
  dividerContainerStyle: {
    flexDirection: 'row',
    flex: 1
  }
};

export default TabButtonGroup;
