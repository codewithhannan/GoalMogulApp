import React, { Component } from 'react';
import { View } from 'react-native';

class KeyboardSpacer extends Component {
  render() {
    console.log('height is :', this.props.height);
    return (
      <View style={{height: this.props.height}}/>
    );
  }
};

export default KeyboardSpacer;
