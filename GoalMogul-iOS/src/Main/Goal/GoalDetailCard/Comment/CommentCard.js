import React from "react";
import { View, Image, Text, Keyboard } from "react-native";
import { connect } from "react-redux";

// Components
import CommentUserDetail from "./CommentUserDetail";
import ChildCommentCard from "./ChildCommentCard";

// Assets
import ReplyIcon from "../../../../asset/utils/reply.png";

// Styles
import { cardBoxBorder } from "../../../../styles";
import DelayedButton from "../../../Common/Button/DelayedButton";

const DEBUG_KEY = "[ UI CommentCard ]";

class CommentCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      childCommentLayouts: {},
      totalViewHeight: 0,
      keyboardHeight: 216,
      commentLength: 0,
      numberOfChildrenShowing: 3,
      showMoreCount: 3,
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
    const { childComments } = this.props.item;

    if (!childComments) return;

    const { commentLength } = this.state;

    // Update child comment length if new child comment is added
    if (commentLength !== childComments.length) {
      this.setState({
        ...this.state,
        commentLength: childComments.length,
      });
    }
  }

  onLayout = (e, index) => {
    const childCommentLayouts = this.state.childCommentLayouts;
    childCommentLayouts[index] = {
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
      x: e.nativeEvent.layout.x,
      y: e.nativeEvent.layout.y,
    };
    this.setState({
      childCommentLayouts,
      totalViewHeight: getTotalViewHeight(this.state),
    });
  };

  showMoreChildComments = () => {
    const { numberOfChildrenShowing, showMoreCount } = this.state;
    const { item } = this.props;
    const currentChildCommentLength = item.childComments
      ? item.childComments.length
      : 0;

    let newNumberOfChildrenShowing = numberOfChildrenShowing;
    if (numberOfChildrenShowing >= currentChildCommentLength - showMoreCount) {
      newNumberOfChildrenShowing = currentChildCommentLength;
    } else {
      newNumberOfChildrenShowing += showMoreCount;
    }
    this.setState({
      ...this.state,
      commentLength: currentChildCommentLength,
      numberOfChildrenShowing: newNumberOfChildrenShowing,
    });
  };

  showLessChildComments = () => {
    const { numberOfChildrenShowing, showMoreCount } = this.state;
    let newNumberOfChildrenShowing = numberOfChildrenShowing;
    if (numberOfChildrenShowing - showMoreCount <= showMoreCount) {
      newNumberOfChildrenShowing = showMoreCount;
    } else {
      newNumberOfChildrenShowing -= showMoreCount;
    }
    this.setState({
      ...this.state,
      numberOfChildrenShowing: newNumberOfChildrenShowing,
    });
  };

  componentWillUnMount() {
    this.keyboardDidHideListener.remove();
    this.keyboardDidShowListener.remove();
  }

  _keyboardDidShow = (e) => {
    this.setState({
      keyboardHeight: e.endCoordinates.height,
    });
  };

  _keyboardDidHide = (e) => {
    this.setState({
      keyboardHeight: e.endCoordinates.height,
    });
  };

  // update user detail layout for childcomments computing
  updateUserDetailLayout = (layout) => {
    this.setState({
      userDetailLayout: layout,
      totalViewHeight: getTotalViewHeight(this.state),
    });
  };

  // Render child comments if there are some.
  renderChildComments() {
    const { item } = this.props;
    const { childComments } = item;
    if (!childComments || childComments.length === 0) return null;

    const { numberOfChildrenShowing } = this.state;

    // For child comments, only load the first three
    const childCommentCards = childComments.map((comment, index) => {
      if (index < numberOfChildrenShowing) {
        const viewOffset =
          getTotalPrevHeight(this.state, index) - this.state.keyboardHeight;
        return (
          <View
            key={index}
            style={{ flexDirection: "row", marginTop: 0.5 }}
            onLayout={(e) => this.onLayout(e, `${index}`)}
          >
            <ChildCommentIcon />
            <View style={{ flex: 1 }}>
              <ChildCommentCard
                {...this.props}
                item={comment}
                parentCommentId={item._id}
                viewOffset={viewOffset}
                userId={this.props.userId}
              />
            </View>
          </View>
        );
      }
    });

    if (childComments.length > numberOfChildrenShowing) {
      childCommentCards.push(
        <DelayedButton
          activeOpacity={0.6}
          key={childComments.length}
          onPress={this.showMoreChildComments}
          style={{ margin: 3, padding: 5 }}
        >
          <Text
            style={{
              alignSelf: "center",
              color: "#4ec9f3",
              padding: 2,
            }}
          >
            Load more replies ({childComments.length - numberOfChildrenShowing})
          </Text>
        </DelayedButton>
      );
    }

    return <View>{childCommentCards}</View>;
  }

  render() {
    const viewOffset =
      getTotalPrevHeight(this.state) - this.state.keyboardHeight;
    // console.log(`${DEBUG_KEY} item is: `, this.props.item);
    return (
      <View style={styles.cardContainerStyle}>
        <CommentUserDetail
          {...this.props}
          ref="userDetail"
          onLayout={(layout) => this.updateUserDetailLayout(layout)}
          viewOffset={viewOffset}
          userId={this.props.userId}
        />
        {this.renderChildComments()}
      </View>
    );
  }
}
// <CommentRef item={item.}/>

const getTotalPrevHeight = (state, index) => {
  const { childCommentLayouts } = state;
  const i = index === undefined ? -1 : index;

  const totalHeights = Object.entries(childCommentLayouts).reduce(
    (total, [key, value]) => {
      if (parseInt(key, 10) > i) {
        return total + parseInt(value.height, 10);
      }
      return total;
    },
    0
  );

  return totalHeights;
};

const getTotalViewHeight = (state) => {
  const { userDetailLayout, childCommentLayouts } = state;

  let totalHeights = Object.entries(childCommentLayouts).reduce(
    (total, [key, value]) => {
      return total + parseInt(value.height, 10);
    },
    0
  );
  if (userDetailLayout && userDetailLayout.height) {
    totalHeights -= userDetailLayout.height;
  }

  return totalHeights;
};

const ChildCommentIcon = () => {
  return (
    <View style={styles.replyIconContainerStyle}>
      <Image source={ReplyIcon} style={styles.replyIconStyle} />
    </View>
  );
};

const styles = {
  cardContainerStyle: {
    marginBottom: 0.5,
    ...cardBoxBorder,
  },

  // Styles related to child comments
  replyIconStyle: {
    height: 20,
    width: 20,
    tintColor: "#d2d2d2",
  },
  replyIconContainerStyle: {
    backgroundColor: "#fafafa",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
  },
};

const mapStateToProps = (state) => {
  const { userId } = state.user;

  return {
    userId,
  };
};

export default connect(mapStateToProps, null)(CommentCard);
