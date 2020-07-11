// This is the view for a TrendingGoalCard
import React from "react";
import { View, TouchableOpacity, Image, Text, Dimensions } from "react-native";
import { connect } from "react-redux";

// Actions
import { selectTrendingGoals } from "../../../redux/modules/goal/CreateGoalActions";

// Assets
import plus from "../../../asset/utils/plus.png";

// Utils
import { nFormatter } from "../../../redux/middleware/utils";

// Styles
import { GM_BLUE, DEFAULT_STYLE, BACKGROUND_COLOR } from "../../../styles";

class TrendingGoalCard extends React.PureComponent {
  onPress = (title) => {
    this.props.selectTrendingGoals(title);
  };

  renderStats(item) {
    const { title } = item;
    return (
      <TouchableOpacity
        style={styles.plusIconContainerStyle}
        onPress={() => this.onPress(title)}
      >
        <Image
          source={plus}
          style={{ ...DEFAULT_STYLE.smallIcon_1, tintColor: "white" }}
        />
      </TouchableOpacity>
    );
  }

  renderTitle(item) {
    const { width } = Dimensions.get("window");
    const { frequency, title } = item;
    return (
      <View
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          paddingRight: 5,
          width: (236 * width) / 375,
        }}
      >
        <Text
          style={DEFAULT_STYLE.titleText_2}
          ellipsizeMode="tail"
          numberOfLines={3}
        >
          {title}
        </Text>
        <Text style={{ ...DEFAULT_STYLE.smallText_1, color: "#9B9B9B" }}>
          {nFormatter(frequency) + " "}users have this goal in common
        </Text>
      </View>
    );
  }

  renderRank(item, index) {
    return (
      <View style={{ padding: 15, paddingRight: 4 }}>
        <Text style={DEFAULT_STYLE.titleText_2}>#{index}</Text>
      </View>
    );
  }

  render() {
    const { item, index } = this.props;
    if (!item) return;
    return (
      <View style={styles.containerStyle}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {this.renderRank(item, index)}
          <View
            style={{
              height: 40 * DEFAULT_STYLE.uiScale,
              width: 1,
              margin: 8,
              backgroundColor: "#DADADA",
            }}
          />
          {this.renderTitle(item)}
        </View>
        {this.renderStats(item)}
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#e9e9e9",

    marginLeft: 16,
    marginRight: 16,
    marginBottom: 5,
  },
  plusIconContainerStyle: {
    backgroundColor: GM_BLUE,
    margin: 12,
    borderRadius: 15 * DEFAULT_STYLE.uiScale,
    height: 30 * DEFAULT_STYLE.uiScale,
    width: 30 * DEFAULT_STYLE.uiScale,
    alignItems: "center",
    justifyContent: "center",
  },
};

export default connect(null, {
  selectTrendingGoals,
})(TrendingGoalCard);
