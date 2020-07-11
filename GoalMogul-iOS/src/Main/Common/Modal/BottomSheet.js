import React from "react";
import { View, Image, Text } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { DEFAULT_STYLE } from "../../../styles";
import DelayedButton from "../Button/DelayedButton";

/**
 * This bottom sheet uses https://github.com/nysamnang/react-native-raw-bottom-sheet#readme
 * and follows the pattern https://developer.apple.com/design/human-interface-guidelines/ios/app-architecture/modality/
 */
class BottomSheet extends React.PureComponent {
  open = () => {
    this.RBSheet.open();
  };

  close = () => {
    this.RBSheet.close();
  };

  renderContent = () => {
    let items = this.props.buttons.map((item) => {
      const {
        image,
        text,
        onPress,
        textStyle,
        imageStyle,
        ...otherProps
      } = item;

      // context is passed into the onPress tot let it handle itself
      return (
        <DelayedButton
          onPress={onPress}
          key={text}
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            padding: 10,
            alignItems: "center",
          }}
          {...otherProps}
        >
          {image ? (
            <Image
              source={image}
              style={[styles.defaultImageStyle, imageStyle]}
            />
          ) : null}
          {/* <Image /> */}
          <Text style={[DEFAULT_STYLE.goalTitleText_1, textStyle]}>{text}</Text>
        </DelayedButton>
      );
    });
    return items;
  };

  renderHeader = () => {
    return <View style={styles.header} />;
  };

  render() {
    const { buttons } = this.props;
    if (!buttons || buttons.length == 0) return null;

    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheet = ref;
        }}
        height={150}
        openDuration={250}
        closeOnDragDown
        customStyles={{
          container: {
            borderTopRightRadius: 5,
            borderTopLeftRadius: 5,
            paddingHorizontal: 16,
          },
        }}
      >
        <View style={{ flex: 1, justifyContent: "flex-start" }}>
          {this.renderContent()}
        </View>
      </RBSheet>
    );
  }
}

const styles = {
  defaultImageStyle: {
    height: 22,
    width: 22,
    marginRight: 10,
  },
};

export default BottomSheet;
