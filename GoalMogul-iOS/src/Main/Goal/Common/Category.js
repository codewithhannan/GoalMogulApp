import React from "react";
import { Text, View } from "react-native";
import { GM_FONT_FAMILY_2, DEFAULT_STYLE } from "../../../styles";

const Category = (props) => {
  // TODO: format time
  return (
    <View style={{ flexDirection: "row", flex: 1, flexWrap: "wrap" }}>
      <Text
        style={[DEFAULT_STYLE.smallText_1, styles.containerStyle]}
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {props.text}
      </Text>
    </View>
  );
};

const styles = {
  containerStyle: {
    alignSelf: "center",
  },
};

export default Category;
