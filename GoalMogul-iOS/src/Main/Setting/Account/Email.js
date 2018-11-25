import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

/* Components */
import SearchBarHeader from '../../Common/Header/SearchBarHeader';

/* Assets */
import editImage from '../../../asset/utils/edit.png';

/* Styles */
import Styles from '../Styles';

/* Actions */
import { onResendEmailPress } from '../../../actions';

class Email extends Component {

  handleOnResendPress() {
    console.log('user tries to resend email');
    this.props.onResendEmailPress((message) => alert(message));
  }

  handleOnEditEmailPress() {
    Actions.editEmailForm();
  }

  renderEmailDetailText() {
    if (this.props.email.isVerified) {
      return (
        <Text style={Styles.statusTextStyle}>
          Primary email
        </Text>
      );
    }
    return (
      <View>
        <Text style={Styles.statusTextStyle}>
          Unverified
        </Text>
        <TouchableOpacity activeOpacity={0.85} onPress={this.handleOnResendPress.bind(this)}>
          <Text style={Styles.actionTextStyle}>
            Resend verification link
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderEmail() {
    if (this.props.email.address) {
      return (
        <Text style={Styles.detailTextStyle}>
          {this.props.email.address}
        </Text>
      );
    }
    return (
      <Text style={Styles.detailTextStyle}>
        andyzeng96@gmail.com
      </Text>
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
          <TouchableWithoutFeedback onPress={this.handleOnEditEmailPress.bind(this)}>
            <View style={Styles.iconContainerStyle}>
              <Image style={Styles.editIconStyle} source={editImage} />
            </View>
          </TouchableWithoutFeedback>

          {this.renderEmail()}
          {this.renderEmailDetailText()}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { email } = state.setting;

  return {
    email
  };
};

export default connect(mapStateToProps, { onResendEmailPress })(Email);
