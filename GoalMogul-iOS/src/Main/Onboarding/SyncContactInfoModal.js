import React from "react";
import _ from "ramda";
import { View, Text } from "react-native";
import Modal from "react-native-modal";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import DelayedButton from "../Common/Button/DelayedButton";
import EmptyResult from "../Common/Text/EmptyResult";
import {
  GM_BLUE,
  GM_FONT_SIZE,
  GM_FONT_FAMILY,
  GM_FONT_LINE_HEIGHT,
  BUTTON_STYLE as buttonStyle,
} from "../../styles";
import { DotIndicator } from "react-native-indicators";
import { Actions } from "react-native-router-flux";

class SyncContactInfoModal extends React.Component {
  onNotNow = () => {
    // Close modal and go to welcome page
    if (this.props.onNotNow) {
      this.props.onNotNow();
    }
  };

  onInvite = () => {
    if (this.props.onInvite) {
      this.props.onInvite();
    }
  };

  renderUploading() {
    return (
      <View
        style={{
          zIndex: 1,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: this.props.loading ? 1 : 0,
          alignItems: "center",
          padding: 35,
        }}
      >
        <Text
          style={{
            fontSize: GM_FONT_SIZE.FONT_3_5,
            fontFamily: GM_FONT_FAMILY.GOTHAM_BOLD,
          }}
        >
          Uploading Contacts
        </Text>
        <DotIndicator size={10} color={GM_BLUE} />
      </View>
    );
  }

  renderFailureResult() {
    return (
      <View style={{ zIndex: 2, opacity: this.props.loading ? 0 : 1 }}>
        <Text
          style={{
            fontSize: GM_FONT_SIZE.FONT_3_5,
            fontFamily: GM_FONT_FAMILY.GOTHAM_BOLD,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          We couldn't find any contact that is on GoalMogul.
        </Text>
        <DelayedButton
          onPress={this.onInvite}
          style={buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.containerStyle}
        >
          <Text style={buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.textStyle}>
            Invite
          </Text>
        </DelayedButton>
        <DelayedButton
          onPress={this.onNotNow}
          style={[
            buttonStyle.GM_WHITE_BG_BLUE_TEXT.containerStyle,
            { marginTop: 10 },
          ]}
        >
          <Text style={buttonStyle.GM_WHITE_BG_BLUE_TEXT.textStyle}>
            Not Now
          </Text>
        </DelayedButton>
      </View>
    );
  }

  render() {
    return (
      <Modal
        swipeToClose={false}
        isVisible={this.props.isOpen}
        backdropOpacity={0.5}
        onClosed={() => this.onClosed()}
        hideModalContentWhileAnimating={true}
        useNativeDriver
        avoidKeyboard
      >
        <View
          style={{
            borderRadius: 14,
            padding: 23,
            backgroundColor: "white",
          }}
        >
          {this.renderFailureResult()}
          {this.renderUploading()}
        </View>
      </Modal>
    );
  }
}

export default SyncContactInfoModal;
