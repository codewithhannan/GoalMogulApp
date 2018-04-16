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
        <View style={{ flex: 2, alignItems: 'flex-start' }}>
        <TouchableOpacity onPress={this.onCancelPress}>

            <Text style={textStyle}>Cancel</Text>

        </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={textStyle}>{this.props.title}</Text>
        </View>
        <View style={{ flex: 2, alignItems: 'flex-end' }}>
        <TouchableOpacity onPress={this.onSavePress}>

            <Text style={textStyle}>Save</Text>

        </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = {
  headerStyle: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingBottom: 12,
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
