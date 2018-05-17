import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';

import Divider from './Divider';
import TabButton from './Button/TabButton';

class TabButtonGroup extends Component {

  renderButton() {
    const { navigationState, jumpTo } = this.props.buttons;
    const { index, routes } = navigationState;
    return routes.map((b, i) => {
      const selected = i === index;
      if (i !== 0) {
        // render divider to the left
        return (
          <TouchableOpacity
            key={b.key}
            style={styles.dividerContainerStyle}
            onPress={jumpTo.bind(this, b.key)}
          >
            <Divider />
            <TabButton text={b.title} onSelect={selected} stat={b.stat} />
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity
          key={b.key}
          style={styles.dividerContainerStyle}
          onPress={jumpTo.bind(this, b.key)}
        >
          <TabButton text={b.title} onSelect={selected} stat={b.stat} />
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
    height: 32,
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
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
