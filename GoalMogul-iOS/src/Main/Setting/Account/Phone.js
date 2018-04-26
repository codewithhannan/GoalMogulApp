import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  // Linking
} from 'react-native';
import Expo, { Linking, WebBrowser } from 'expo';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

/* Components */
import SearchBarHeader from '../../Common/SearchBarHeader';
import Button from '../Button';

/* Styles */
import Styles from '../Styles';

/* Actions */
import { onVerifyPhoneNumber } from '../../../actions';

/* Assets */
import editImage from '../../../asset/utils/edit.png';

class Phone extends Component {

  // componentDidMount() {
  //   Linking.addEventListener('url', this.handleOpenURL);
  // }
  //
  // componentWillUnmount() { // C
  //   Linking.removeEventListener('url', this.handleOpenURL);
  // }
  //
  // handleOpenURL = (event) => { // D
  //   console.log('event is: ', event);
  // }

  handleOnAddPhoneNumberPress() {
    console.log('user tries to verify');
    Actions.addPhoneNumberForm();
  }

  handleOnEditPhonePress() {
    console.log('user tries to edit phone number');
    Actions.editPhoneNumberForm();
  }

  handleOnVerifyPress() {
    console.log('user trying to verify phone number');
    this.props.onVerifyPhoneNumber();
  }

  handleRedirect = event => {
    WebBrowser.dismissBrowser();

    let data = Linking.parse(event.url);
    console.log('data is: ', data);
    // this.setState({ redirectData: data });
  };

  openWebBrowserAsync = async () => {
    // Linking.openURL('https://goalmogul-web.herokuapp.com/phone-verification?returnURL=goalmogul');
    this.addLinkingListener();
    let result = await WebBrowser.openBrowserAsync(
      `https://goalmogul-web.herokuapp.com/phone-verification/`
    );
    this.removeLinkingListener();
    // this.setState({ result });
  };

  addLinkingListener = () => {
    Linking.addEventListener('url', this.handleRedirect);
  };

  removeLinkingListener = () => {
    Linking.removeEventListener('url', this.handleRedirect);
  };

  /* Rendering */
  renderPhoneDetailText() {
    return (
      <View>
        <Text style={Styles.statusTextStyle}>
          Unverified
        </Text>
        <TouchableOpacity onPress={this.handleOnVerifyPress.bind(this)}>
          <Text style={Styles.actionTextStyle}>
            Verify phone number
          </Text>
        </TouchableOpacity>
      </View>
    );
    // if (!this.props.needAddPhone) {
    //   if (this.props.phone.isVerified) {
    //     return (
    //       <View>
    //         <Text style={Styles.statusTextStyle}>
    //           Confirmed
    //         </Text>
    //       </View>
    //     );
    //   }
    //   return (
    //     <View>
    //       <Text style={Styles.statusTextStyle}>
    //         Unverified
    //       </Text>
    //       <TouchableOpacity onPress={this.handleOnVerifyPress.bind(this)}>
    //         <Text style={Styles.actionTextStyle}>
    //           Verify phone number
    //         </Text>
    //       </TouchableOpacity>
    //     </View>
    //   );
    // }
    // return (
    //   <View>
    //     <Text style={Styles.statusTextStyle}>
    //       Confirmed
    //     </Text>
    //     <TouchableOpacity>
    //       <Text style={Styles.actionTextStyle}>
    //         Make primary
    //       </Text>
    //     </TouchableOpacity>
    //   </View>
    // );
  }

  renderBody() {
    // if (this.props.needAddPhone) {
    //   return (
    //     <TouchableOpacity onPress={this.handleOnAddPhoneNumberPress.bind(this)}>
    //       <Button text="Add phone number" />
    //     </TouchableOpacity>
    //   );
    // }

    return (
      <View style={Styles.detailCardSection}>
        <TouchableWithoutFeedback onPress={this.handleOnEditPhonePress.bind(this)}>
          <View style={Styles.iconContainerStyle}>
            <Image style={Styles.editIconStyle} source={editImage} />
          </View>
        </TouchableWithoutFeedback>
        <Text style={Styles.detailTextStyle}>{this.props.phone.number}</Text>
        {this.renderPhoneDetailText()}
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
        {this.renderBody()}

      </View>
    );
  }
}

const mapStateToProps = state => {
  const { phone } = state.setting;
  const needAddPhone = (Object.keys(phone).length === 0 && phone.constructor === Object);

  return {
    phone,
    needAddPhone
  };
};

export default connect(mapStateToProps, { onVerifyPhoneNumber })(Phone);
