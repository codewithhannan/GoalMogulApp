import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

class SettingCard extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={styles.containerStyle}>
          <Text style={styles.titleStyle}>
            {this.props.title}
          </Text>
          <Text style={styles.explanationTextStyle}>
            {this.props.explanation}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    marginLeft: 15,
    marginRight: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#b8bec6'
  },
  titleStyle: {
    fontSize: 15,
    fontWeight: '700'
  },
  explanationTextStyle: {
    fontSize: 12,
  }
};

export default SettingCard;
