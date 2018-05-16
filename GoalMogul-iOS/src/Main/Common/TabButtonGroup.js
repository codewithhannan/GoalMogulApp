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
        // console.log('hi I am number 1');
        return (
          <TouchableOpacity
            key={b.key}
            style={styles.dividerContainerStyle}
            onPress={jumpTo.bind(this, b.key)}
          >
            <Divider />
            <TabButton text={b.title} onSelect={selected} />
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity
          key={b.key}
          style={styles.dividerContainerStyle}
          onPress={jumpTo.bind(this, b.key)}
        >
          <TabButton text={b.title} onSelect={selected} />
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
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1
  },
  dividerContainerStyle: {
    flexDirection: 'row',
    flex: 1
  }
};

export default TabButtonGroup;
