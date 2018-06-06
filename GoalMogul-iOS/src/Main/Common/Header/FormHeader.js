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
    const { cancelTextStyle, saveTextStyle, titleTextStyle } = styles;
    return (
      <View style={styles.headerStyle}>
        <View style={{ flex: 2, alignItems: 'flex-start' }}>
        <TouchableOpacity onPress={this.onCancelPress}>

            <Text style={cancelTextStyle}>Cancel</Text>

        </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={titleTextStyle}>{this.props.title}</Text>
        </View>
        <View style={{ flex: 2, alignItems: 'flex-end' }}>
        <TouchableOpacity onPress={this.onSavePress}>

            <Text style={saveTextStyle}>Save</Text>

        </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const fontSize = 16;

const styles = {
  headerStyle: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingBottom: 18,
    paddingTop: 35,
    paddingLeft: 17,
    paddingRight: 17,
    borderBottomColor: '#e9e9e9',
    borderBottomWidth: 1
  },
  cancelTextStyle: {
    fontSize,
    alignSelf: 'center',
    color: '#45C9F6',
  },
  titleTextStyle: {
    fontSize,
    alignSelf: 'center',
    fontWeight: '600'
  },
  saveTextStyle: {
    color: '#45C9F6',
    fontSize,
    alignSelf: 'center',
    fontWeight: '700'
  }
};

export default connect(
  null,
  {
    back
  }
)(FormHeader);
