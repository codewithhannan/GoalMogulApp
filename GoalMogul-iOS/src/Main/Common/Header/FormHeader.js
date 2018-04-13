import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';

/* Actions */
import { back } from '../../../actions';

class FormHeader extends Component {

  onSavePress = () => {
    this.props.onSubmit();
  }

  onCancelPress = () => {
    this.props.back();
  }

  render() {
    const { textStyle } = styles;
    return (
      <View style={styles.headerStyle}>
        <TouchableOpacity onPress={this.onCancelPress}>
          <View style={{ flex: 1 }}>
            <Text style={textStyle}>Cancel</Text>
          </View>
        </TouchableOpacity>
        <View style={{ flex: 4 }}>
          <Text style={textStyle}>{this.props.title}</Text>
        </View>
        <TouchableOpacity onPress={this.onSavePress}>
          <View style={{ flex: 1 }}>
            <Text style={textStyle}>Save</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  headerStyle: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    height: 70,
    paddingTop: 30,
    paddingLeft: 12,
    paddingRight: 12
  },
  textStyle: {
    fontSize: 18,
    color: '#000000',
    alignSelf: 'center'
  }
};

export default connect(
  null,
  {
    back
  }
)(FormHeader);
