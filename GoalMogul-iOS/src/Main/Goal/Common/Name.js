import React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { DEFAULT_STYLE } from "../../../styles";

const styles = {
  containerStyle: {
    ...DEFAULT_STYLE.titleText_1,
    maxWidth: 200 * DEFAULT_STYLE.uiScale,
  },
};

const Name = (props) => {
  const style = props.textStyle
    ? { ...styles.containerStyle, ...props.textStyle }
    : { ...styles.containerStyle };
  const { onPress } = props;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View>
        <Text style={style} numberOfLines={1} ellipsizeMode="tail">
          {props.text}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Name;
