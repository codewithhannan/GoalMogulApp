/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from "prop-types";
import React from "react";
import {
  StyleSheet,
  View,
  Keyboard,
  ViewPropTypes,
  Dimensions,
} from "react-native";

export default class ChatRoomConversationInputToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.keyboardWillHide = this.keyboardWillHide.bind(this);

    this.state = {
      position: "absolute",
    };
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener(
      "keyboardWillShow",
      this.keyboardWillShow
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      "keyboardWillHide",
      this.keyboardWillHide
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  keyboardWillShow() {
    if (this.state.position !== "relative") {
      this.setState({
        position: "relative",
      });
    }
  }

  keyboardWillHide() {
    if (this.state.position !== "absolute") {
      this.setState({
        position: "absolute",
      });
    }
  }

  renderActions() {
    if (this.props.renderActions) {
      return this.props.renderActions(this.props);
    }
    return null;
  }

  renderSend() {
    if (this.props.renderSend) {
      return this.props.renderSend(this.props);
    }
    return null;
  }

  renderComposer() {
    if (this.props.renderComposer) {
      return this.props.renderComposer(this.props);
    }
    return null;
  }

  renderAccessory(accessoryLocation) {
    if (this.props.renderAccessory) {
      return (
        <View style={[styles.accessory, this.props.accessoryStyle]}>
          {this.props.renderAccessory(this.props, accessoryLocation)}
        </View>
      );
    }
    return null;
  }

  render() {
    return (
      <View
        style={[
          styles.container,
          this.props.containerStyle,
          { position: this.state.position },
        ]}
      >
        {this.renderAccessory("top")}
        <View style={[styles.primary, this.props.primaryStyle]}>
          {this.renderActions()}
          {this.renderComposer()}
          {this.renderSend()}
        </View>
        {this.renderAccessory("bottom")}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#b2b2b2",
    backgroundColor: "white",
    bottom: 0,
    left: 0,
    right: 0,
    width: Dimensions.get("window").width,
  },
  primary: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  accessory: {},
});

ChatRoomConversationInputToolbar.defaultProps = {
  renderAccessory: null,
  renderActions: null,
  renderSend: null,
  renderComposer: null,
  containerStyle: {},
  primaryStyle: {},
  accessoryStyle: {},
  onPressActionButton: () => {},
};

ChatRoomConversationInputToolbar.propTypes = {
  renderAccessory: PropTypes.func,
  renderActions: PropTypes.func,
  renderSend: PropTypes.func,
  renderComposer: PropTypes.func,
  onPressActionButton: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  primaryStyle: ViewPropTypes.style,
  accessoryStyle: ViewPropTypes.style,
};
