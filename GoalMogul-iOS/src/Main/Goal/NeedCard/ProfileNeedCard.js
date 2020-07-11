// This component is used to display need on a user's profile page
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import timeago from "timeago.js";
import { connect } from "react-redux";

// Components
import Headline from "../Common/Headline";
import Timestamp from "../Common/Timestamp";
import SectionCard from "../Common/SectionCard";

// Actions
import { openGoalDetail } from "../../../redux/modules/home/mastermind/actions";

import { deleteGoal } from "../../../actions";

import {
  subscribeEntityNotification,
  unsubscribeEntityNotification,
} from "../../../redux/modules/notification/NotificationActions";

// Constants
import {
  CARET_OPTION_NOTIFICATION_SUBSCRIBE,
  CARET_OPTION_NOTIFICATION_UNSUBSCRIBE,
} from "../../../Utils/Constants";
import { DEFAULT_STYLE } from "../../../styles";

class ProfileNeedCard extends React.Component {
  handleCardOnPress(item) {
    this.props.openGoalDetail(item);
  }

  renderCardContent(item) {
    const { needs, owner } = item;
    const needsComponent = needs.map((need, index) => {
      return (
        <SectionCard
          key={index}
          item={need}
          goalRef={item}
          onPress={() => this.props.openGoalDetail(item)}
          isSelf={this.props.userId === owner._id}
          type="need"
        />
      );
    });
    return <View>{needsComponent}</View>;
  }

  // user basic information
  renderUserDetail(item) {
    const { title, owner, category, _id, created, maybeIsSubscribed } = item;
    const timeStamp =
      created === undefined || created.length === 0 ? new Date() : created;

    const caret = {
      self: {
        options: [{ option: "Delete" }],
        onPress: () => {
          this.props.deleteGoal(_id);
        },
      },
      others: {
        options: [
          { option: "Report" },
          {
            option: maybeIsSubscribed
              ? CARET_OPTION_NOTIFICATION_UNSUBSCRIBE
              : CARET_OPTION_NOTIFICATION_SUBSCRIBE,
          },
        ],
        onPress: (key) => {
          if (key === "Report") {
            return this.props.createReport(_id, "goal", "Goal");
          }
          if (key === CARET_OPTION_NOTIFICATION_UNSUBSCRIBE) {
            return this.props.unsubscribeEntityNotification(_id, "Goal");
          }
          if (key === CARET_OPTION_NOTIFICATION_SUBSCRIBE) {
            return this.props.subscribeEntityNotification(_id, "Goal");
          }
        },
      },
    };
    // TODO: verify all the fields have data
    return (
      <View style={{ flexDirection: "row" }}>
        <View style={{ marginLeft: 15, flex: 1 }}>
          <Headline
            name={owner.name}
            category={category}
            isSelf={this.props.userId === owner._id}
            caret={caret}
            user={owner}
            textStyle={DEFAULT_STYLE.titleText_2}
          />
          <Timestamp time={timeago().format(timeStamp)} />
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text
              style={[DEFAULT_STYLE.normalText_1, styles.textStyle]}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { item } = this.props;
    if (!item) return null;

    return (
      <View>
        <View style={{ backgroundColor: "#e5e5e5" }}>
          <View style={styles.containerStyle}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.handleCardOnPress(item)}
            >
              {this.renderUserDetail(item)}
            </TouchableOpacity>
          </View>
          {this.renderCardContent(item)}
        </View>
        <View style={DEFAULT_STYLE.shadow} />
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    backgroundColor: "white",
    padding: 20,
    paddingRight: 15,
    paddingLeft: 15,
  },
  textStyle: {
    flex: 1,
    flexWrap: "wrap",
  },
};

const mapStateToProps = (state) => {
  const { userId } = state.user;

  return {
    userId,
  };
};

export default connect(mapStateToProps, {
  openGoalDetail,
  deleteGoal,
  subscribeEntityNotification,
  unsubscribeEntityNotification,
})(ProfileNeedCard);
