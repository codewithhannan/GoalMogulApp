/** @format */

import * as Haptics from 'expo-haptics'
import _ from 'lodash'
import R from 'ramda'
import React from 'react'
import {
    Dimensions,
    Image,
    ImageBackground,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import timeago from 'timeago.js'
import { deletePost, openProfile } from '../../../actions'
import CommentIcon from '../../../asset/utils/comment.png'
import expand from '../../../asset/utils/expand.png'
import ShareIcon from '../../../asset/utils/forward.png'
import LoveOutlineIcon from '../../../asset/utils/love-outline.png'
// Assets
import LoveIcon from '../../../asset/utils/love.png'
// Actions
import {
    switchCase,
    getProfileImageOrDefaultFromUser,
} from '../../../redux/middleware/utils'
import { createCommentFromSuggestion } from '../../../redux/modules/feed/comment/CommentActions'
import { openPostDetail } from '../../../redux/modules/feed/post/PostActions'
import { chooseShareDest } from '../../../redux/modules/feed/post/ShareActions'
import { openGoalDetail } from '../../../redux/modules/home/mastermind/actions'
import { likeGoal, unLikeGoal } from '../../../redux/modules/like/LikeActions'
import {
    subscribeEntityNotification,
    unsubscribeEntityNotification,
} from '../../../redux/modules/notification/NotificationActions'
import { createReport } from '../../../redux/modules/report/ReportActions'
// Styles
import { imagePreviewContainerStyle } from '../../../styles'
import { default_style, color } from '../../../styles/basic'
// Constants
import {
    CARET_OPTION_NOTIFICATION_SUBSCRIBE,
    CARET_OPTION_NOTIFICATION_UNSUBSCRIBE,
    IMAGE_BASE_URL,
    DEVICE_PLATFORM,
} from '../../../Utils/Constants'
import {
    actionSheet,
    switchByButtonIndex,
} from '../../Common/ActionSheetFactory'
import FloatingHearts from '../../Common/FloatingHearts/FloatingHearts'
import ImageModal from '../../Common/ImageModal'
import LikeListModal from '../../Common/Modal/LikeListModal'
import ShareListModal from '../../Common/Modal/ShareListModal'
import ProfileImage from '../../Common/ProfileImage'
import RefPreview from '../../Common/RefPreview'
import RichText from '../../Common/Text/RichText'
import SparkleBadgeView from '../../Gamification/Badge/SparkleBadgeView'
// Components
import ActionButton from '../../Goal/Common/ActionButton'
import ActionButtonGroup from '../../Goal/Common/ActionButtonGroup'
import Headline from '../../Goal/Common/Headline'
import Timestamp from '../../Goal/Common/Timestamp'
import CreatePostModal from '../CreatePostModal'
import ActionBar from '../../Common/ContentCards/ActionBar'

const DEBUG_KEY = '[ UI PostDetailCard.PostDetailSection ]'
const SHARE_TO_MENU_OPTTIONS = [
    'Share to Feed',
    'Share to an Event',
    'Share to a Tribe',
    'Cancel',
]
const CANCEL_INDEX = 3
const { width } = Dimensions.get('window')

class PostDetailSection extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            mediaModal: false,
            numberOfLines: undefined,
            seeMore: true,
            showShareListModal: false,
            showlikeListModal: false,
            floatingHeartCount: 0,
            likeButtonLeftOffset: 0,
        }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //   const seeMoreChanged = nextState.seeMore !== this.state.seeMore;
    //   const itemChanged = _.isEqual(nextProps.item, this.props.item);
    //   console.log(`${DEBUG_KEY}: [ shouldComponentUpdate ]: seeMoreChanged: ${seeMoreChanged || itemChanged}, ${seeMoreChanged}, itemChanged: ${itemChanged}`);
    //   return seeMoreChanged || itemChanged;
    // }

    handleShareOnClick = () => {
        const { item } = this.props
        const { _id } = item
        const shareType = 'SharePost'

        const shareToSwitchCases = switchByButtonIndex([
            [
                R.equals(0),
                () => {
                    // User choose to share to feed
                    console.log(`${DEBUG_KEY} User choose destination: Feed `)
                    this.props.chooseShareDest(shareType, _id, 'feed', item)
                },
            ],
            [
                R.equals(1),
                () => {
                    // User choose to share to an event
                    console.log(`${DEBUG_KEY} User choose destination: Event `)
                    this.props.chooseShareDest(shareType, _id, 'event', item)
                },
            ],
            [
                R.equals(2),
                () => {
                    // User choose to share to a tribe
                    console.log(`${DEBUG_KEY} User choose destination: Tribe `)
                    this.props.chooseShareDest(shareType, _id, 'tribe', item)
                },
            ],
        ])

        const shareToActionSheet = actionSheet(
            SHARE_TO_MENU_OPTTIONS,
            CANCEL_INDEX,
            shareToSwitchCases
        )
        return shareToActionSheet()
    }

    handleSeeMore = () => {
        if (this.state.seeMore) {
            // See less
            this.setState({
                ...this.state,
                numberOfLines: 2,
                seeMore: false,
            })
            return
        }
        // See more
        this.setState({
            ...this.state,
            numberOfLines: undefined,
            seeMore: true,
        })
    }

    renderSeeMore(text) {
        if (text && text.length > 120) {
            return (
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.seeMoreTextContainerStyle}
                    onPress={this.handleSeeMore}
                >
                    <Text style={styles.seeMoreTextStyle}>
                        {this.state.seeMore ? 'See less' : 'See more'}
                    </Text>
                </TouchableOpacity>
            )
        }
        return null
    }

    // user basic information
    renderUserDetail(item) {
        // TODO: TAG: for content
        const {
            _id,
            created,
            content,
            owner,
            category,
            maybeIsSubscribed,
            viewCount,
            belongsToTribe,
        } = item
        const timeStamp =
            created === undefined || created.length === 0 ? new Date() : created

        const caret = {
            self: {
                options: [{ option: 'Edit Post' }, { option: 'Delete' }],
                onPress: (key) => {
                    if (key === 'Delete') {
                        this.props.deletePost(_id)
                        Actions.pop()
                        return
                    }
                    if (key === 'Edit Post') {
                        // TODO: open edit modal
                        this.createPostModal && this.createPostModal.open()
                        return
                    }
                },
                shouldExtendOptionLength: false,
            },
            others: {
                options: [
                    { option: 'Report' },
                    {
                        option: maybeIsSubscribed
                            ? CARET_OPTION_NOTIFICATION_UNSUBSCRIBE
                            : CARET_OPTION_NOTIFICATION_SUBSCRIBE,
                    },
                ],
                onPress: (key) => {
                    if (key === 'Report') {
                        return this.props.createReport(
                            _id,
                            'postDetail',
                            'Post'
                        )
                    }
                    if (key === CARET_OPTION_NOTIFICATION_UNSUBSCRIBE) {
                        return this.props.unsubscribeEntityNotification(
                            _id,
                            'Post'
                        )
                    }
                    if (key === CARET_OPTION_NOTIFICATION_SUBSCRIBE) {
                        return this.props.subscribeEntityNotification(
                            _id,
                            'Post'
                        )
                    }
                },
            },
        }
        // console.log('item is: ', item);
        return (
            <View>
                <View
                    style={{ flexDirection: 'row', alignItems: 'flex-start' }}
                >
                    <ProfileImage
                        imageUrl={getProfileImageOrDefaultFromUser(owner)}
                        userId={owner._id}
                    />
                    <View style={{ marginLeft: 12, marginTop: 2, flex: 1 }}>
                        <Headline
                            name={owner.name || ''}
                            category={category}
                            isSelf={this.props.userId === owner._id}
                            caret={caret}
                            user={owner}
                            pageId={this.props.pageId}
                            textStyle={default_style.titleText_2}
                            belongsToTribe={belongsToTribe}
                        />
                        <View style={{ marginTop: 2 }} />
                        <Timestamp
                            time={timeago().format(timeStamp)}
                            viewCount={viewCount}
                        />
                    </View>
                </View>
                <RichText
                    contentText={content ? content.text : ''}
                    contentTags={content ? content.tags : []}
                    contentLinks={content ? content.links : []}
                    textStyle={{
                        ...default_style.normalText_1,
                        flex: 1,
                        flexWrap: 'wrap',
                        color: 'black',
                    }}
                    textContainerStyle={{ flexDirection: 'row', marginTop: 10 }}
                    ellipsizeMode="tail"
                    onUserTagPressed={(user) => {
                        console.log(
                            `${DEBUG_KEY}: user tag press for user: `,
                            user
                        )
                        this.props.openProfile(user)
                    }}
                    numberOfLines={this.state.numberOfLines}
                />
                {this.renderSeeMore(content.text)}
            </View>
        )
    }

    // Current media type is only picture
    renderPostImage(url) {
        // TODO: update this to be able to load image
        if (!url) {
            return null
        }
        const imageUrl = `${IMAGE_BASE_URL}${url}`
        return (
            <TouchableWithoutFeedback
                onPress={() => this.setState({ mediaModal: true })}
            >
                <View style={{ marginTop: 10 }}>
                    <ImageBackground
                        style={{
                            ...styles.mediaStyle,
                            ...imagePreviewContainerStyle,
                            borderRadius: 8,
                            backgroundColor: 'black',
                        }}
                        source={{ uri: imageUrl }}
                        imageStyle={{
                            borderRadius: 8,
                            opacity: 0.8,
                            resizeMode: 'cover',
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => this.setState({ mediaModal: true })}
                            style={{
                                position: 'absolute',
                                top: 10,
                                right: 15,
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                                padding: 2,
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Image
                                source={expand}
                                style={{
                                    width: 16,
                                    height: 16,
                                    tintColor: '#fafafa',
                                    borderRadius: 4,
                                }}
                            />
                        </TouchableOpacity>
                    </ImageBackground>
                    {this.renderPostImageModal(imageUrl)}
                </View>
            </TouchableWithoutFeedback>
        )
    }

    // <Modal
    //   animationType="fade"
    //   transparent={false}
    //   visible={this.state.mediaModal}
    // >
    renderPostImageModal(imageUrl) {
        return (
            <ImageModal
                mediaRef={imageUrl}
                mediaModal={this.state.mediaModal}
                closeModal={() => this.setState({ mediaModal: false })}
            />
        )
    }

    renderBadgeEarnImage(milestoneIdentifier) {
        return <SparkleBadgeView milestoneIdentifier={milestoneIdentifier} />
    }

    // TODO: Switch to decide amoung renderImage, RefPreview and etc.
    renderCardContent(item) {
        const { postType, mediaRef, goalRef } = item
        if (postType === 'General') {
            const milestoneIdentifier = _.get(
                item,
                'milestoneCelebration.milestoneIdentifier'
            )
            if (milestoneIdentifier !== undefined) {
                return this.renderBadgeEarnImage(milestoneIdentifier)
            }
            return this.renderPostImage(mediaRef)
        }
        const refPreview = switchItem(item, postType)
        let onPress
        if (refPreview !== null && !_.isEmpty(refPreview)) {
            onPress = switchCase({
                SharePost: () => this.props.openPostDetail(refPreview),
                ShareUser: () => this.props.openProfile(refPreview._id),
                ShareGoal: () => this.props.openGoalDetail(goalRef),
                ShareNeed: () => this.props.openGoalDetail(goalRef),
                ShareStep: () => this.props.openGoalDetail(goalRef),
            })(() => console.warn(`${DEBUG_KEY}: invalid item:`, item))(
                postType
            )
        }

        return (
            <View style={{ marginTop: 20 }}>
                <RefPreview
                    item={refPreview}
                    postType={postType}
                    onPress={onPress}
                    goalRef={goalRef}
                />
            </View>
        )
    }

    incrementFloatingHeartCount = () => {
        // only iOS has a clean haptic system at the moment
        if (DEVICE_PLATFORM == 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
        this.setState({
            floatingHeartCount: this.state.floatingHeartCount + 1,
        })
    }

    renderActionButtons = () => {
        const { item } = this.props
        const { maybeLikeRef, _id } = item

        const likeCount = item.likeCount ? item.likeCount : 0
        const commentCount = item.commentCount ? item.commentCount : 0
        const shareCount = item.shareCount ? item.shareCount : 0

        const selfLiked = maybeLikeRef && maybeLikeRef.length > 0

        // User shouldn't share a share. When Activity on a post which is a share,
        // We disable the share button.
        const isShare = item.postType !== 'General'

        return (
            <ActionBar
                isContentLiked={selfLiked}
                isShareContent={isShare}
                actionSummaries={{
                    likeCount,
                    shareCount,
                    commentCount,
                }}
                onLikeSummaryPress={() =>
                    this.setState({ showlikeListModal: true })
                }
                onLikeButtonPress={() => {
                    if (maybeLikeRef && maybeLikeRef.length > 0) {
                        return this.props.unLikeGoal('post', _id, maybeLikeRef)
                    }
                    this.incrementFloatingHeartCount()
                    this.props.likeGoal('post', _id)
                }}
                onLikeButtonLayout={({ nativeEvent }) =>
                    this.setState({
                        likeButtonLeftOffset: nativeEvent.layout.x,
                    })
                }
                onShareSummaryPress={() =>
                    this.setState({ showShareListModal: true })
                }
                onShareButtonPress={() => this.handleShareOnClick(item)}
                onCommentSummaryPress={() => {
                    // TODO scroll down to comments section
                }}
                onCommentButtonPress={() => {
                    this.props.createCommentFromSuggestion(
                        {
                            commentDetail: {
                                parentType: 'Goal',
                                parentRef: _id,
                                commentType: 'Suggestion',
                                replyToRef: undefined,
                            },
                            suggestionForRef: _id,
                            suggestionFor: 'Goal',
                        },
                        this.props.pageId
                    )
                    this.props.onSuggestion()
                }}
            />
        )
    }

    render() {
        const { item } = this.props
        // Note: currently item won't be empty since there will be pageId and pageIdCount.
        // TODO: refactor how we store PostDetail to have a separate object. For example:
        // { postExploreTab: { pageId, pageIdCount, post-pageId: { //Here is the real object }}}
        // Currently, it's the following structure
        // { postExploreTab: { pageId, pageIdCount, // all the fileds for the real object }}
        if (!item || _.isEmpty(item) || !item.created) return null

        return (
            <View style={styles.containerStyle}>
                <CreatePostModal
                    onRef={(r) => (this.createPostModal = r)}
                    initializeFromState
                    initialPost={item}
                />
                <LikeListModal
                    isVisible={this.state.showlikeListModal}
                    closeModal={() => {
                        this.setState({
                            showlikeListModal: false,
                        })
                    }}
                    parentId={item._id}
                    parentType="Post"
                />
                <ShareListModal
                    isVisible={this.state.showShareListModal}
                    closeModal={() => {
                        this.setState({
                            showShareListModal: false,
                        })
                    }}
                    entityId={item._id}
                    entityType="Post"
                />
                <View style={{ paddingHorizontal: 16 }}>
                    <View style={{ marginTop: 16, marginBottom: 10 }}>
                        {this.renderUserDetail(item)}
                        {this.renderCardContent(item)}
                    </View>
                </View>
                <FloatingHearts
                    count={this.state.floatingHeartCount}
                    color={'#EB5757'}
                    style={{
                        zIndex: 5,
                    }}
                    leftOffset={this.state.likeButtonLeftOffset}
                />
                {this.renderActionButtons()}
            </View>
        )
    }
}

const switchItem = (item, postType) =>
    switchCase({
        SharePost: item.postRef,
        ShareUser: item.userRef,
        ShareNeed: getNeedFromRef(item.goalRef, item.needRef),
        ShareStep: getStepFromGoal(item.goalRef, item.stepRef),
    })('SharePost')(postType)

const getStepFromGoal = (goal, stepRef) =>
    getItemFromGoal(goal, 'steps', stepRef)

const getNeedFromRef = (goal, needRef) =>
    getItemFromGoal(goal, 'needs', needRef)

const getItemFromGoal = (goal, type, ref) => {
    let ret
    if (goal && typeof goal === 'object') {
        _.get(goal, `${type}`).forEach((item) => {
            if (item._id === ref) {
                ret = item
            }
        })
    }
    return ret
}

const styles = {
    containerStyle: {
        backgroundColor: 'white',
    },
    iconStyle: {
        alignSelf: 'center',
        fontSize: 20,
        marginLeft: 5,
        marginTop: 2,
    },
    mediaStyle: {
        height: width / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelIconStyle: {
        height: 20,
        width: 20,
        justifyContent: 'flex-end',
    },
    imageContainerStyle: {
        borderWidth: 0.5,
        padding: 1.5,
        borderColor: 'lightgray',
        alignItems: 'center',
        borderRadius: 6,
        alignSelf: 'flex-start',
        backgroundColor: 'white',
    },
    seeMoreTextContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 2,
    },
    seeMoreTextStyle: {
        ...default_style.normalText_1,
        color: color.GM_BLUE,
    },
    statsContainerStyle: {
        borderTopWidth: 0.5,
        borderTopColor: '#f1f1f1',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 3,
    },
    likeCountContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 3,
        paddingVertical: 7,
    },
    statsBaseTextStyle: {
        fontSize: 9,
    },
}

const mapStateToProps = (state) => {
    const { userId } = state.user
    return {
        userId,
    }
}

export default connect(mapStateToProps, {
    createReport,
    likeGoal,
    unLikeGoal,
    createCommentFromSuggestion,
    chooseShareDest,
    openPostDetail,
    openProfile,
    openGoalDetail,
    deletePost,
    subscribeEntityNotification,
    unsubscribeEntityNotification,
})(PostDetailSection)
