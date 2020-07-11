import _ from "lodash";
import R from "ramda";
import React from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { connect } from "react-redux";
// Actions
import { openProfile } from "../../actions";
import { openPostDetail } from "../../redux/modules/feed/post/PostActions";
import { chooseShareDest } from "../../redux/modules/feed/post/ShareActions";
import { refreshFeed } from "../../redux/modules/home/feed/actions";
import { openGoalDetail } from "../../redux/modules/home/mastermind/actions";
import { likeGoal, unLikeGoal } from "../../redux/modules/like/LikeActions";
// Assets
import { ConfettiFadedBackgroundTopHalf } from "../../asset/background";
import CommentIcon from "../../asset/utils/comment.png";
import ShareIcon from "../../asset/utils/forward.png";
import LoveIcon from "../../asset/utils/love.png";
import LoveOutlineIcon from "../../asset/utils/love-outline.png";
// Styles
import { imagePreviewContainerStyle, DEFAULT_STYLE } from "../../styles";
// Constants
import { IMAGE_BASE_URL } from "../../Utils/Constants";
import { actionSheet, switchByButtonIndex } from "../Common/ActionSheetFactory";
import ImageModal from "../Common/ImageModal";
import ProfileImage from "../Common/ProfileImage";
import RichText from "../Common/Text/RichText";
// Components
import ActionButton from "../Goal/Common/ActionButton";
import ActionButtonGroup from "../Goal/Common/ActionButtonGroup";
import Headline from "../Goal/Common/Headline";
import CommentRef from "../Goal/GoalDetailCard/Comment/CommentRef";
import ActivityBody from "./ActivityBody";
import ActivityHeader from "./ActivityHeader";
import ActivitySummary from "./ActivitySummary";
import DelayedButton from "../Common/Button/DelayedButton";

const DEBUG_KEY = "[ UI ActivityCard ]";
const SHARE_TO_MENU_OPTTIONS = [
  "Share to Feed",
  "Share to an Event",
  "Share to a Tribe",
  "Cancel",
];
const CANCEL_INDEX = 3;
const { width } = Dimensions.get("window");
const WINDOW_WIDTH = width;

class ActivityCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mediaModal: false,
    };
    this.renderCommentRef = this.renderCommentRef.bind(this);
    this.renderMedia = this.renderMedia.bind(this);
  }

  handleCardOnPress = (item, props) => {
    const { goalRef, postRef, actedUponEntityType } = item;
    const propsToPass = props ? props : {};
    if (actedUponEntityType === "Post") {
      return this.props.openPostDetail({ ...postRef });
    }

    if (actedUponEntityType === "Goal") {
      return this.props.openGoalDetail({ ...goalRef }, propsToPass);
    }
  };

  handleShareOnClick = (actedUponEntityType) => {
    const { item } = this.props;
    const { goalRef, postRef } = item;
    const shareType = `Share${actedUponEntityType}`;

    const itemToShare = actedUponEntityType === "Post" ? postRef : goalRef;
    if (itemToShare === null) {
      console.warn(`${DEBUG_KEY}: invalid shared item: `, item);
      return;
    }

    const callback = () => {
      this.props.refreshFeed();
    };

    const shareToFeedCallback = () => {
      this.props.onShareCallback();
      this.props.refreshFeed();
    };
    // Share ref is the id of the item to share
    const { _id } = itemToShare;
    const shareToSwitchCases = switchByButtonIndex([
      [
        R.equals(0),
        () => {
          // User choose to share to feed
          console.log(`${DEBUG_KEY} User choose destination: Feed `);
          this.props.chooseShareDest(
            shareType,
            _id,
            "feed",
            itemToShare,
            undefined,
            shareToFeedCallback
          );
          // TODO: update reducer state
        },
      ],
      [
        R.equals(1),
        () => {
          // User choose to share to an event
          console.log(`${DEBUG_KEY} User choose destination: Event `);
          this.props.chooseShareDest(
            shareType,
            _id,
            "event",
            itemToShare,
            undefined,
            callback
          );
        },
      ],
      [
        R.equals(2),
        () => {
          // User choose to share to a tribe
          console.log(`${DEBUG_KEY} User choose destination: Tribe `);
          this.props.chooseShareDest(
            shareType,
            _id,
            "tribe",
            itemToShare,
            undefined,
            callback
          );
        },
      ],
    ]);

    const shareToActionSheet = actionSheet(
      SHARE_TO_MENU_OPTTIONS,
      CANCEL_INDEX,
      shareToSwitchCases
    );
    return shareToActionSheet();
  };

  renderActionButtons({ postRef, goalRef, actedUponEntityType, actedWith }) {
    const isPost = actedUponEntityType === "Post";
    const item = isPost ? postRef : goalRef;
    // Sanity check if ref exists
    if (!item) return null;

    const { maybeLikeRef, _id } = item;

    const likeCount = item.likeCount ? item.likeCount : 0;
    const commentCount = item.commentCount ? item.commentCount : 0;
    const shareCount = item.shareCount ? item.shareCount : 0;

    const selfLiked = maybeLikeRef && maybeLikeRef.length > 0;

    // User shouldn't share a share. When Activity on a post which is a share,
    // We disable the share button.
    const isShare = isPost && postRef.postType !== "General";

    return (
      <View style={{ marginTop: 1 }}>
        <ActionButtonGroup>
          <ActionButton
            iconSource={selfLiked ? LoveIcon : LoveOutlineIcon}
            count={likeCount}
            unitText="Like"
            textStyle={{ color: selfLiked ? "#000" : "#828282" }}
            iconStyle={{ tintColor: selfLiked ? "#EB5757" : "#828282" }}
            onPress={() => {
              console.log(`${DEBUG_KEY}: user clicks Like Icon.`);
              if (selfLiked) {
                return this.props.unLikeGoal(
                  isPost ? "post" : "goal",
                  _id,
                  maybeLikeRef
                );
              }
              this.props.likeGoal(isPost ? "post" : "goal", _id);
            }}
          />
          <ActionButton
            iconSource={ShareIcon}
            count={shareCount}
            unitText="Share"
            textStyle={{ color: "#828282" }}
            iconStyle={{ tintColor: "#828282" }}
            onPress={() => this.handleShareOnClick(actedUponEntityType)}
            disabled={isShare}
          />
          <ActionButton
            iconSource={CommentIcon}
            count={commentCount}
            unitText="Comment"
            textStyle={{ color: "#828282" }}
            iconStyle={{ tintColor: "#828282" }}
            onPress={() => {
              console.log(
                `${DEBUG_KEY}: user clicks suggest icon actedWith: ${actedWith}`
              );
              this.props.onPress(
                item,
                (actedWith === "Comment" ||
                  actedWith === "Like" ||
                  actedWith === "Goal") &&
                  actedUponEntityType === "Goal"
              );
            }}
          />
        </ActionButtonGroup>
      </View>
    );
  }

  // If this is a comment activity, render comment summary
  renderComment(item) {
    // CommentRef shouldn't be null as we already sanity check the activity card
    const { actedWith, commentRef, actor } = item;
    if (actedWith !== "Comment") return null;

    // console.log(`${DEBUG_KEY}: commentRef: `, commentRef);
    const { content, mediaRef, suggestion } = commentRef;
    const { text, tags, links } = content;

    const { profile, _id, name } = actor;
    return (
      <View
        style={{
          flexDirection: "row",
          padding: 16,
          marginTop: 1,
          backgroundColor: "white",
        }}
      >
        <ProfileImage
          imageStyle={{
            height: 35 * DEFAULT_STYLE.uiScale,
            width: 35 * DEFAULT_STYLE.uiScale,
            borderRadius: 100,
          }}
          imageUrl={profile ? profile.image : undefined}
          imageContainerStyle={{ ...styles.imageContainerStyle, marginTop: 6 }}
          userId={_id}
        />
        <DelayedButton
          activeOpacity={0.6}
          style={{
            padding: 8,
            backgroundColor: "#F9F9F9",
            marginLeft: 10,
            flex: 1,
          }}
          onPress={() => this.handleCardOnPress(item, { focusType: "comment" })}
        >
          <Headline
            name={name || ""}
            user={actor}
            hasCaret={false}
            isSelf={this.props.userId === _id}
            textStyle={DEFAULT_STYLE.titleText_2}
          />
          <RichText
            contentText={text}
            contentTags={tags}
            contentLinks={links}
            textStyle={{
              ...DEFAULT_STYLE.normalText_1,
              flex: 1,
              flexWrap: "wrap",
            }}
            textContainerStyle={{ flexDirection: "row", marginTop: 5 }}
            numberOfLines={3}
            ellipsizeMode="tail"
            onUserTagPressed={(user) => {
              console.log(`${DEBUG_KEY}: user tag press for user: `, user);
              this.props.openProfile(user);
            }}
          />
          {this.renderMedia(mediaRef)}
          {this.renderCommentRef(suggestion)}
        </DelayedButton>
      </View>
    );
  }

  /**
   * Render commentRef
   * @param {object} item
   */
  renderCommentRef(item) {
    return <CommentRef item={item} />;
  }

  renderMedia(url) {
    if (!url) {
      return null;
    }
    const imageUrl = `${IMAGE_BASE_URL}${url}`;
    return (
      <TouchableWithoutFeedback
        onPress={() => this.setState({ mediaModal: true })}
      >
        <View style={{ marginTop: 5 }}>
          <ImageBackground
            style={{
              ...styles.mediaStyle,
              ...imagePreviewContainerStyle,
              borderRadius: 8,
              backgroundColor: "black",
            }}
            source={{ uri: imageUrl }}
            imageStyle={{ borderRadius: 8, resizeMode: "cover" }}
          ></ImageBackground>
          {this.renderPostImageModal(imageUrl)}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderPostImageModal(imageUrl) {
    return (
      <ImageModal
        mediaRef={imageUrl}
        mediaModal={this.state.mediaModal}
        closeModal={() => this.setState({ mediaModal: false })}
      />
    );
  }

  render() {
    const { item } = this.props;
    if (!item || _.isEmpty(item) || !isValidActivity(item)) return null;

    return (
      <View style={{ marginTop: 10 }}>
        <View style={{ backgroundColor: "white" }}>
          {item.goalRef && item.goalRef.isCompleted ? (
            <Image
              source={ConfettiFadedBackgroundTopHalf}
              style={{
                height: WINDOW_WIDTH * 0.6,
                width: WINDOW_WIDTH,
                position: "absolute",
                resizeMode: "cover",
                opacity: 0.55,
              }}
            />
          ) : null}
          <ActivitySummary item={item} />
          <View style={{ marginTop: 1 }}>
            <View
              style={{
                marginTop: 12,
                marginBottom: 15,
                marginRight: 15,
                marginLeft: 15,
              }}
            >
              <DelayedButton
                activeOpacity={0.6}
                onPress={() => this.handleCardOnPress(item)}
              >
                <ActivityHeader item={item} />
              </DelayedButton>
              <ActivityBody
                item={item}
                openCardContent={() => this.handleCardOnPress(item)}
              />
            </View>
          </View>
          <View
            style={{
              marginTop: 1,
              borderBottomColor: "#f8f8f8",
              borderBottomWidth: 1,
            }}
          >
            {this.renderActionButtons(item)}
          </View>
        </View>
        {this.renderComment(item)}
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    backgroundColor: "white",
  },
  imageContainerStyle: {
    borderWidth: 0.5,
    padding: 0.5,
    borderColor: "lightgray",
    alignItems: "center",
    borderRadius: 100,
    alignSelf: "flex-start",
    backgroundColor: "white",
  },
  mediaStyle: {
    height: width / 3,
    width: width / 3,
    alignItems: "center",
    justifyContent: "center",
  },
  iconStyle: {
    alignSelf: "center",
    fontSize: 20,
    marginLeft: 5,
    marginTop: 2,
  },
};

const isValidActivity = (item) => {
  if (!item || _.isEmpty(item)) return false;
  const {
    actedUponEntityType,
    goalRef,
    postRef,
    actedWith,
    commentRef,
    actor,
  } = item;
  if (actedUponEntityType === "Goal" && (!goalRef || goalRef === null)) {
    return false;
  }

  if (actedUponEntityType === "Post" && (!postRef || postRef === null)) {
    return false;
  }

  if (actedWith === "Comment" && commentRef === null) {
    return false;
  }

  if (actor === null) return false;
  return true;
};

const mapStateToProps = (state) => {
  const { userId } = state.user;

  return {
    userId,
  };
};

export default connect(mapStateToProps, {
  likeGoal,
  unLikeGoal,
  chooseShareDest,
  openPostDetail,
  openGoalDetail,
  refreshFeed,
  openProfile,
})(ActivityCard);
