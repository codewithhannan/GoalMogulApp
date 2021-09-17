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
import expand from '../../../asset/utils/expand.png'
// Actions
import {
    switchCase,
    getProfileImageOrDefaultFromUser,
    isSharedPost,
    sharingPrivacyAlert,
    SHAREING_PRIVACY_ALERT_TYPE,
    countWords,
} from '../../../redux/middleware/utils'
import Tooltip from 'react-native-walkthrough-tooltip'
import LottieView from 'lottie-react-native'
import * as Animatable from 'react-native-animatable'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import {
    LOTTIE_DATA,
    renderUnitText,
} from '../../Common/ContentCards/LikeSheetData'

import { likeGoal, unLikeGoal } from '../../../redux/modules/like/LikeActions'
import { createCommentFromSuggestion } from '../../../redux/modules/feed/comment/CommentActions'
import { openPostDetail } from '../../../redux/modules/feed/post/PostActions'
import { chooseShareDest } from '../../../redux/modules/feed/post/ShareActions'
import { openGoalDetail } from '../../../redux/modules/home/mastermind/actions'

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
    CONTENT_PREVIEW_MAX_NUMBER_OF_LINES,
} from '../../../Utils/Constants'
import FloatingHearts from '../../Common/FloatingHearts/FloatingHearts'
import ImageModal from '../../Common/ImageModal'
import LikeListModal from '../../Common/Modal/LikeListModal'
import ShareListModal from '../../Common/Modal/ShareListModal'
import ProfileImage from '../../Common/ProfileImage'
import RefPreview from '../../Common/RefPreview'
import RichText from '../../Common/Text/RichText'
import SparkleBadgeView from '../../Gamification/Badge/SparkleBadgeView'
// Components
import Headline from '../../Goal/Common/Headline'
import Timestamp from '../../Goal/Common/Timestamp'
import CreatePostModal from '../CreatePostModal'
import ActionBar from '../../Common/ContentCards/ActionBar'
import ShareCard from '../../Common/Card/ShareCard'

const DEBUG_KEY = '[ UI PostDetailCard.PostDetailSection ]'
const SHARE_TO_MENU_OPTTIONS = ['Share to a Tribe', 'Cancel']
const TOOLTIP_WIDTH = Dimensions.get('screen').width
const CANCEL_INDEX = 1
const { width } = Dimensions.get('window')

class PostDetailSection extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            mediaModal: false,
            numberOfLines: undefined,
            hasLongText: false,
            seeMore: true,
            showShareListModal: false,
            showlikeListModal: false,
            floatingHeartCount: 0,
            likeButtonLeftOffset: 0,
            toolTipVisible: false,
            unitText: '',
        }
        this.onTextLayout = this.onTextLayout.bind(this)
    }

    componentDidMount() {
        const { initialProps } = this.props
        if (initialProps) {
            if (initialProps.initialShowPostModal) {
                this.createPostModal && this.createPostModal.open()
            }
        }
    }

    onTextLayout(e) {
        const firstLine = e.nativeEvent.lines[0]
        const lastLine = e.nativeEvent.lines[e.nativeEvent.lines.length - 1]
        const { text } = this.props.item.content || { text: '' }
        const numberOfRenderedLines = e.nativeEvent.lines.length
        this.setState({
            hasLongText:
                lastLine.text.length > firstLine.text.length ||
                countWords(e.nativeEvent.lines) < countWords(text) ||
                numberOfRenderedLines > CONTENT_PREVIEW_MAX_NUMBER_OF_LINES,
        })
    }

    getOnSharePressOptions = () => {
        const { item } = this.props
        const { _id, privacy } = item
        const shareType = 'SharePost'

        return [
            {
                text: 'Share to a Tribe',
                onPress: () => {
                    if (privacy !== 'public') {
                        return sharingPrivacyAlert(
                            SHAREING_PRIVACY_ALERT_TYPE.update
                        )
                    }
                    this.props.chooseShareDest(shareType, _id, 'tribe', item)
                },
            },
        ]
    }

    handleSeeMore = () => {
        if (this.state.seeMore) {
            // See less
            this.setState({
                numberOfLines: CONTENT_PREVIEW_MAX_NUMBER_OF_LINES,
                seeMore: false,
            })
            return
        }
        // See more
        this.setState({
            numberOfLines: undefined,
            seeMore: true,
        })
    }

    renderSeeMore(text) {
        if (text && this.state.hasLongText) {
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
            privacy,
            belongsToTribe,
        } = item

        const timeStamp =
            created === undefined || created.length === 0 ? new Date() : created

        const caret = {
            self: {
                options: [{ option: 'Edit Update' }, { option: 'Delete' }],
                onPress: (key) => {
                    if (key === 'Delete') {
                        this.props.deletePost(_id)
                        Actions.pop()
                        return
                    }
                    if (key === 'Edit Update') {
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
                            privacy={privacy}
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
                    textContainerStyle={{ flexDirection: 'row', marginTop: 16 }}
                    ellipsizeMode="tail"
                    onUserTagPressed={(user) => {
                        console.log(
                            `${DEBUG_KEY}: user tag press for user: `,
                            user
                        )
                        this.props.openProfile(user)
                    }}
                    onTextLayout={this.onTextLayout}
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
                <View style={{ marginTop: 8 }}>
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
                                padding: 3,
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Image
                                source={expand}
                                style={{
                                    width: 15,
                                    height: 15,
                                    tintColor: '#fafafa',
                                    borderRadius: 3,
                                    resizeMode: 'contain',
                                }}
                            />
                        </TouchableOpacity>
                    </ImageBackground>
                    {this.renderPostImageModal(imageUrl)}
                </View>
            </TouchableWithoutFeedback>
        )
    }

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

    renderUpdateAttachments(item) {
        const { belongsToGoalStoryline, mediaRef } = item
        const showGoalRefCard = _.get(belongsToGoalStoryline, 'goalRef', false)
        return (
            <View style={{ marginBottom: 16 }}>
                {this.renderPostImage(mediaRef)}
                {showGoalRefCard && [
                    <Text
                        style={[
                            default_style.normalText_2,
                            { marginTop: 12, marginBottom: 4 },
                        ]}
                    >
                        Attached
                    </Text>,
                    <ShareCard
                        goalRef={
                            belongsToGoalStoryline.goalRef._id ||
                            belongsToGoalStoryline.goalRef
                        }
                        containerStyle={{ width: '100%' }}
                    />,
                ]}
            </View>
        )
    }

    // TODO: Switch to decide amoung renderImage, RefPreview and etc.
    renderCardContent(item) {
        const { postType, goalRef } = item
        if (!isSharedPost(postType)) {
            const milestoneIdentifier = _.get(
                item,
                'milestoneCelebration.milestoneIdentifier'
            )
            if (milestoneIdentifier !== undefined) {
                return this.renderBadgeEarnImage(milestoneIdentifier)
            }
            return this.renderUpdateAttachments(item)
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
        const { item, userId: currentUserId } = this.props
        const { maybeLikeRef, _id, owner, likeType } = item

        const likeCount = item.likeCount ? item.likeCount : 0
        const commentCount = item.commentCount ? item.commentCount : 0
        const shareCount = item.shareCount ? item.shareCount : 0

        const selfLiked = maybeLikeRef && maybeLikeRef.length > 0
        const selfOwned = owner && owner._id === currentUserId

        // Disable share for certain condition
        // 1. User shouldn't share a share. When Activity on a post which is a share,
        //    We disable the share button.
        // 2. It's not self owned
        const isShare = isSharedPost(item.postType) || !selfOwned

        return (
            <Tooltip
                isVisible={this.state.toolTipVisible}
                arrowSize={{
                    height: 2,
                    width: 2,
                }}
                contentStyle={{
                    // backgroundColor: '#F9F9F9',
                    borderRadius: 40,
                    width: TOOLTIP_WIDTH * 0.85,
                    flex: 1,
                }}
                content={
                    <Animatable.View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: TOOLTIP_WIDTH * 0.8,
                        }}
                        animation="fadeInLeft"
                        delay={150}
                        duration={500}
                        easing="ease-in-out-expo"
                    >
                        {LOTTIE_DATA.map((lottie, i) => {
                            return (
                                <TouchableOpacity
                                    key={lottie.name + i}
                                    onPress={() => {
                                        if (
                                            maybeLikeRef &&
                                            maybeLikeRef.length > 0
                                        ) {
                                            return (
                                                this.props.unLikeGoal(
                                                    'post',
                                                    _id,
                                                    maybeLikeRef
                                                ),
                                                setTimeout(() => {
                                                    this.props.likeGoal(
                                                        'post',
                                                        _id,
                                                        '',
                                                        '',
                                                        lottie.value
                                                    )
                                                }, 1000),
                                                this.setState({
                                                    unitText: lottie.title,
                                                    toolTipVisible: false,
                                                })
                                            )
                                        }
                                        this.incrementFloatingHeartCount()
                                        this.props.likeGoal(
                                            'post',
                                            _id,
                                            '',
                                            '',
                                            lottie.value
                                        )
                                        this.setState({
                                            unitText: lottie.title,
                                            toolTipVisible: false,
                                        })
                                    }}
                                >
                                    <LottieView
                                        style={{
                                            height: hp(5),
                                        }}
                                        source={lottie.lottieSource}
                                        autoPlay
                                        loop
                                    />
                                    <Text
                                        style={{
                                            fontSize: 8,
                                            color: '#818181',
                                            alignSelf: 'center',
                                        }}
                                    >
                                        {lottie.name}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </Animatable.View>
                }
                disableShadow={false}
                topAdjustment={2}
                placement="top"
                showChildInTooltip={false}
                backgroundColor="transparent"
                onClose={() => this.setState({ toolTipVisible: false })}
            >
                <ActionBar
                    isContentLiked={selfLiked}
                    actionSummaries={{
                        likeCount,
                        shareCount,
                        commentCount,
                    }}
                    // Use this flag to hide share button
                    // if not own goal, then hide the button

                    unitText={
                        this.state.unitText == ''
                            ? renderUnitText(likeType)
                            : this.state.unitText
                    }
                    onLikeLongPress={() => {
                        this.setState({ toolTipVisible: true })
                    }}
                    onLikeSummaryPress={() =>
                        this.setState({ showlikeListModal: true })
                    }
                    onLikeButtonPress={() => {
                        if (maybeLikeRef && maybeLikeRef.length > 0) {
                            return (
                                this.props.unLikeGoal(
                                    'post',
                                    _id,
                                    maybeLikeRef
                                ),
                                this.setState({ unitText: 'Like' })
                            )
                        }

                        this.incrementFloatingHeartCount()
                        this.props.likeGoal('post', _id, '', '', 'Thumbsup')
                        this.setState({ unitText: 'Like' })
                    }}
                    onLikeButtonLayout={({ nativeEvent }) =>
                        this.setState({
                            likeButtonLeftOffset: nativeEvent.layout.x,
                        })
                    }
                    onShareSummaryPress={() =>
                        this.setState({ showShareListModal: true })
                    }
                    onShareButtonOptions={this.getOnSharePressOptions()}
                    onCommentSummaryPress={() => {
                        // TODO scroll down to comments section
                    }}
                    onCommentButtonPress={() => {
                        this.props.onSuggestion()
                    }}
                />
            </Tooltip>

            // <ActionBar
            //     isContentLiked={selfLiked}
            //     isShareContent={isShare}
            //     actionSummaries={{
            //         likeCount,
            //         shareCount,
            //         commentCount,
            //     }}
            //     onLikeSummaryPress={() =>
            //         this.setState({ showlikeListModal: true })
            //     }
            //     onLikeButtonPress={() => {
            //         if (maybeLikeRef && maybeLikeRef.length > 0) {
            //             return this.props.unLikeGoal('post', _id, maybeLikeRef)
            //         }
            //         this.incrementFloatingHeartCount()
            //         this.props.likeGoal('post', _id)
            //     }}
            //     onLikeButtonLayout={({ nativeEvent }) =>
            //         this.setState({
            //             likeButtonLeftOffset: nativeEvent.layout.x,
            //         })
            //     }
            //     onShareSummaryPress={() =>
            //         this.setState({ showShareListModal: true })
            //     }
            //     onShareButtonOptions={this.getOnSharePressOptions()}
            //     onCommentSummaryPress={() => {
            //         // TODO scroll down to comments section
            //     }}
            //     onCommentButtonPress={() => {
            //         this.props.onSuggestion()
            //     }}
            // />
        )
    }

    render() {
        const { item, pageId } = this.props
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
                    initialPost={{
                        ...item,
                        belongsToGoalStoryline: {
                            goalRef: _.get(
                                item,
                                'belongsToGoalStoryline.goalRef._id'
                            ),
                            title: _.get(
                                item,
                                'belongsToGoalStoryline.goalRef.title'
                            ),
                            owner: item.owner,
                            category: item.category,
                            priority: item.priority,
                        },
                        privacy: item.privacy,
                    }}
                    pageId={pageId}
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
                    <View style={{ marginTop: 16 }}>
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
        color: color.GM_MID_GREY,
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
