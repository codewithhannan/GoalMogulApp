import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';

import Divider from './Divider';
import TabButton from './Button/TabButton';

class TabButtonGroup extends Component {

  renderButton() {
    const { buttons, tabIconMap } = this.props;
    const { navigationState, jumpTo, jumpToIndex } = buttons;

    const { index, routes } = navigationState;
    return routes.map((b, i) => {
      const selected = i === index;
      const iconSource = tabIconMap ? tabIconMap[b.key].iconSource : undefined;
      const iconStyle = tabIconMap ? tabIconMap[b.key].iconStyle : undefined;
      if (i !== 0) {
        // render divider to the left
        return (
          <TouchableOpacity
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
            <TabButton
              text={b.title}
              onSelect={selected}
              stat={b.stat}
              iconSource={iconSource}
              iconStyle={iconStyle}
            />
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity
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
          <TabButton
            text={b.title}
            onSelect={selected}
            stat={b.stat}
            iconSource={iconSource}
            iconStyle={iconStyle}
          />
        </TouchableOpacity>
      );
    });
  }

  render() {
    return (
      <View style={styles.containerStyle}>
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
