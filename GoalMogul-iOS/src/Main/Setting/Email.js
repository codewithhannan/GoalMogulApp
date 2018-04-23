import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

/* Components */
import SearchBarHeader from '../Common/SearchBarHeader';

/* Styles */
import Styles from './Styles';

/* Actions */
import { onResendEmailPress } from '../../actions';

class Email extends Component {

  handleOnResendPress() {
    console.log('user tries to resend email');
    this.props.onResendEmailPress();
  }

  renderEmailDetailText() {
    // if (this.props.email.isVerified) {
    //   return (
    //     <Text style={Styles.statusTextStyle}>
    //       Primary email
    //     </Text>
    //   );
    // }
    return (
      <View>
        <Text style={Styles.statusTextStyle}>
          Unverified
        </Text>
        <TouchableOpacity onPress={this.handleOnResendPress.bind(this)}>
          <Text style={Styles.actionTextStyle}>
            Resend verification link
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <SearchBarHeader backButton rightIcon='empty' title="Email Addresses" />
        <View style={Styles.titleSectionStyle}>
          <Text style={Styles.titleTextStyle}>
            Emails you've added
          </Text>
        </View>
        <View style={Styles.detailCardSection}>
          <Text style={Styles.detailTextStyle}>andyzeng96@gmail.com</Text>
          {this.renderEmailDetailText()}
        </View>
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

export default connect(mapStateToProps, { onResendEmailPress })(Email);
