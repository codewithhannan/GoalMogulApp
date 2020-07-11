import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import timeago from "timeago.js";
import _ from "lodash";
import { connect } from "react-redux";

// Components
import ProfileImage from "../../Common/ProfileImage";
import Timestamp from "../../Goal/Common/Timestamp";
import DelayedButton from "../../Common/Button/DelayedButton";

// Assets
import bulb from "../../../asset/utils/bulb.png";
import forward from "../../../asset/utils/right_arrow.png";

// Actions
import {
  openGoalDetail,
  openGoalDetailById,
} from "../../../redux/modules/home/mastermind/actions";

// Constants
const DEBUG_KEY = "[ UI NotificationNeedCard ]";

class NotificationCard extends React.Component {
  /**
   * When light bulb icon is clicked, it opens goal details and then
   * Opens suggestion modal
   */
  handleOnSuggestion = (item) => {
    if (
      item !== null &&
      !_.isEmpty(item) &&
      item.goalRef !== null &&
      !_.isEmpty(item.goalRef)
    ) {
      const initialProps = {
        focusType: "need",
        focusRef: item._id,
        // commentBox is passed in to GoalDetailCardV3 as initial
        // commentBox: true,
        initialShowSuggestionModal: true,
      };
      return this.props.openGoalDetailById(item.goalRef._id, initialProps);
    }
    console.warn(`${DEBUG_KEY}: invalid item: `, item);
  };

  /**
   * When light bulb icon is clicked, it opens goal details
   */
  handleOnOpen = (item) => {
    if (
      item !== null &&
      !_.isEmpty(item) &&
      item.goalRef !== null &&
      !_.isEmpty(item.goalRef)
    ) {
      const { _id } = item;
      // console.log(`${DEBUG_KEY}: i am here with item:`, item);
      return this.props.openGoalDetail(item.goalRef, {
        focusType: "need",
        focusRef: _id,
        initialShowSuggestionModal: false,
      });
    }
    console.warn(`${DEBUG_KEY}: invalid item: `, item);
  };

  renderProfileImage(item) {
    const { goalRef } = item;

    // TODO: user object (owner) sanity check
    let imageUrl;
    if (goalRef && goalRef.owner && goalRef.owner.profile) {
      imageUrl = goalRef.owner.profile.image;
    }

    return (
      <ProfileImage
        imageStyle={{ height: 50, width: 50, borderRadius: 5 }}
        defaultImageStyle={styles.defaultImageStyle}
        imageUrl={imageUrl}
        rounded
        imageContainerStyle={styles.imageContainerStyle}
      />
    );
  }

  renderNeed(item) {
    const { created, description, goalRef } = item;

    // TODO: use the actual content
    const text = description;
    const name = goalRef.owner.name;

    return (
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text
          style={{
            flexWrap: "wrap",
            color: "black",
            fontSize: 13,
            marginTop: 2,
          }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          <Text style={{ fontWeight: "700" }}>
            {name}
            {": "}
          </Text>
          {text}
        </Text>
        <View style={{ marginBottom: 3, marginTop: 1 }}>
          <Timestamp time={timeago().format(created)} />
        </View>
      </View>
    );
  }

  renderActionIcons(item) {
    return (
      <View
        style={{
          flexDirection: "row",
          borderLeftWidth: 0.5,
          borderColor: "#dbdbdb",
          marginLeft: 2,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          style={{ ...styles.iconContainerStyle, backgroundColor: "#fdf9e5" }}
          onPress={() => this.handleOnSuggestion(item)}
        >
          <Image
            style={{ ...styles.iconStyle, tintColor: "#f6c44f" }}
            source={bulb}
          />
        </TouchableOpacity>
        {/* 
          // Removed for version 0.3.4
          <TouchableOpacity 
            activeOpacity={0.6}
            style={{ ...styles.iconContainerStyle, backgroundColor: '#ebf9fe' }}
            onPress={() => this.handleOnOpen(item)}
          >
            <Image
              style={{ ...styles.iconStyle, tintColor: '#3aa5ce' }}
              source={forward}
            />
          </TouchableOpacity> 
        */}
      </View>
    );
  }

  render() {
    const { item } = this.props;
    if (!item) return null;
    const { description, goalRef } = item;
    if (!description || !goalRef) {
      console.warn(
        `${DEBUG_KEY}: no description or goalRef for need feed: `,
        item
      );
    }

    return (
      <DelayedButton
        activeOpacity={0.6}
        style={styles.cardContainerStyle}
        onPress={() => this.handleOnOpen(item)}
        delay={600}
      >
        {this.renderProfileImage(item)}
        {this.renderNeed(item)}
        {this.renderActionIcons(item)}
      </DelayedButton>
    );
  }
}

const styles = {
  cardContainerStyle: {
    flexDirection: "row",
    padding: 12,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: "center",
  },
  imageContainerStyle: {
    borderWidth: 0.5,
    padding: 0.5,
    borderColor: "lightgray",
    alignItems: "center",
    borderRadius: 6,
    alignSelf: "center",
    backgroundColor: "white",
  },
  iconContainerStyle: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  iconStyle: {
    height: 16,
    width: 18,
    borderRadius: 8,
  },
  defaultImageStyle: {
    width: 44,
    height: 48,
    borderRadius: 5,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 1,
    marginBottom: 1,
  },
};

export default connect(null, {
  openGoalDetail,
  openGoalDetailById,
})(NotificationCard);
