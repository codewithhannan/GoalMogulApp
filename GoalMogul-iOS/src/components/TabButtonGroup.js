import React, { Component } from 'react';
import { View, Text } from 'react-native';

import Divider from './Divider'

class TabButtonGroup extends Component {

  constructor(props) {
    super(props);
  }

  renderButton() {
    return this.props.children.map((b, index) => {
      if (index !== 0) {
        return (
          <View>
            <Divider />
            {b}
          </View>
        );
      }
      return b
    })
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        {this.props.children}
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    display: 'flex',
    height: 22,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  }
};

export default TabButtonGroup;
