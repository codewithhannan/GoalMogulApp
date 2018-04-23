import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

/* Components */
import SearchBarHeader from '../../Common/SearchBarHeader';
import Button from '../Button';

/* Styles */
import Styles from '../Styles';

/* Actions */
import { onResendEmailPress } from '../../../actions';

class Phone extends Component {

  handleOnAddPhoneNumberPress() {
    console.log('user tries to verify');
    Actions.addPhoneNumberForm();
  }

  renderPhoneDetailText() {
    return (
      <View>
        <Text style={Styles.statusTextStyle}>
          Confirmed
        </Text>
        <TouchableOpacity>
          <Text style={Styles.actionTextStyle}>
            Make primary
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <SearchBarHeader backButton rightIcon='empty' title="Phone numbers" />
        <View style={Styles.titleSectionStyle}>
          <Text style={Styles.titleTextStyle}>
            Phone numbers you've added
          </Text>
        </View>
        <View style={Styles.detailCardSection}>
          <Text style={Styles.detailTextStyle}>9194912504</Text>
          {this.renderPhoneDetailText()}
        </View>
        <TouchableOpacity onPress={this.handleOnAddPhoneNumberPress.bind(this)}>
          <Button text="Add phone number" />
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { user } = state.profile;
  const { email } = user;

  return {
    email
  };
};

export default connect(mapStateToProps, { onResendEmailPress })(Phone);
