import React from "react";
import { View } from "react-native";

const ActionButtonGroup = (props) => {
  const { containerStyle } = props;
  return (
    <View style={{ ...styles.containerStyle, ...containerStyle }}>
      {props.children}
    </View>
  );
};

const styles = {
  containerStyle: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    // marginLeft: 15,
    // marginRight: 15,
    paddingLeft: 5,
    paddingRight: 5,
    borderTopWidth: 0.5,
    borderTopColor: "#f1f1f1",
  },
};

export default ActionButtonGroup;
