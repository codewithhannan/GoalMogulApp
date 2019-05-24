import React, { Component } from 'react';
import {
  View,
  Text,
  StatusBar
} from 'react-native';
import { connect } from 'react-redux';

/* Actions */
import { back } from '../../../actions';

import DelayedButton from '../Button/DelayedButton';

class FormHeader extends Component {

  onSavePress = () => {
    this.props.onSubmit();
  }

  onCancelPress = () => {
    this.props.back();
  }

  render() {
    const { actionDisabled } = this.props;
    const { cancelTextStyle, saveTextStyle, titleTextStyle } = styles;

    const actionTextStyle = actionDisabled
    ? { ...saveTextStyle, color: 'lightgray' }
    : saveTextStyle;

    return (
      <View>
        <StatusBar
          barStyle="dark-content"
        />
        <View style={styles.headerStyle}>
          <View style={{ flex: 2, alignItems: 'flex-start' }}>
            <DelayedButton activeOpacity={0.6} onPress={this.onCancelPress}>

                <Text style={cancelTextStyle}>Cancel</Text>

            </DelayedButton>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={titleTextStyle}>{this.props.title}</Text>
          </View>
          <View style={{ flex: 2, alignItems: 'flex-end' }}>
            <DelayedButton 
              activeOpacity={0.6} 
              onPress={this.onSavePress}
              disabled={actionDisabled}
            >
              <Text style={actionTextStyle}>Save</Text>
            </DelayedButton>
          </View>
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
    paddingTop: 15,
    paddingLeft: 17,
    paddingRight: 17,
    borderBottomColor: '#e9e9e9',
    borderBottomWidth: 1
  },
  cancelTextStyle: {
    fontSize,
    alignSelf: 'center',
    color: '#17B3EC',
  },
  titleTextStyle: {
    fontSize,
    alignSelf: 'center',
    fontWeight: '600'
  },
  saveTextStyle: {
    color: '#17B3EC',
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
