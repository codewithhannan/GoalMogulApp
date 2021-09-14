/** @format */

// This component is used to display post on a user's profile page
import React from 'react'
import { View, TouchableOpacity, Text, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import R from 'ramda'
import timeago from 'timeago.js'
import * as Haptics from 'expo-haptics'

// Actions
import { likeGoal, unLikeGoal } from '../../../redux/modules/like/LikeActions'
import { chooseShareDest } from '../../../redux/modules/feed/post/ShareActions'
import { openPostDetail } from '../../../redux/modules/feed/post/PostActions'
import { deletePost, openProfile } from '../../../actions'

import {
    subscribeEntityNotification,
    unsubscribeEntityNotification,
} from '../../../redux/modules/notification/NotificationActions'
import * as Animatable from 'react-native-animatable'

// Components
import PostPreviewBody from './PostPreviewBody'
import ProfileImage from '../../Common/ProfileImage'
import RichText from '../../Common/Text/RichText'
import Headline from '../../Goal/Common/Headline'
import Timestamp from '../../Goal/Common/Timestamp'
import DelayedButton from '../../Common/Button/DelayedButton'

// Constants
import {
    CARET_OPTION_NOTIFICATION_SUBSCRIBE,
    CARET_OPTION_NOTIFICATION_UNSUBSCRIBE,
    DEVICE_PLATFORM,
    CONTENT_PREVIEW_MAX_NUMBER_OF_LINES,
} from '../../../Utils/Constants'

import { default_style, color } from '../../../styles/basic'
import { wrapAnalytics, SCREENS } from '../../../monitoring/segment'
import {
    getProfileImageOrDefaultFromUser,
    isSharedPost,
    sharingPrivacyAlert,
    SHAREING_PRIVACY_ALERT_TYPE,
    countWords,
} from '../../../redux/middleware/utils'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import Tooltip from 'react-native-walkthrough-tooltip'
import LottieView from 'lottie-react-native'
import FloatingHearts from '../../Common/FloatingHearts/FloatingHearts'
import ActionBar from '../../Common/ContentCards/ActionBar'
import { createReport } from '../../../redux/modules/report/ReportActions'
import {
    LOTTIE_DATA,
    renderUnitText,
    updateLikeIcon,
} from '../../Common/ContentCards/LikeSheetData'

const DEBUG_KEY = '[ UI GoalDetailCard2.GoalDetailSection ]'
const SHARE_TO_MENU_OPTTIONS = ['Share to a Tribe', 'Cancel']
const CANCEL_INDEX = 1
const TOOLTIP_WIDTH = Dimensions.get('screen').width

class PostPreviewCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            floatingHeartCount: 0,
            likeButtonLeftOffset: 0,
            hasLongText: false,
            toolTipVisible: false,
            unitText: '',
            updateReaction: '',
        }
        this.onTextLayout = this.onTextLayout.bind(this)
    }

    onTextLayout(e) {
        const firstLine = e.nativeEvent.lines[0]
        const lastLine = e.nativeEvent.lines[e.nativeEvent.lines.length - 1]
        const { text } = this.props.item.content
        this.setState({
            hasLongText:
                lastLine.text.length > firstLine.text.length ||
                countWords(e.nativeEvent.lines) < countWords(text),
        })
    }

    /**
     * Only update when needed
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(nextState, this.state) ||
            !_.isEqual(nextProps.item, this.props.item)
        )
    }

    handleCardOnPress = (item) => {
        const action = () => this.props.openPostDetail(item)
        if (item) {
            if (this.props.actionDecorator) {
                this.props.actionDecorator(action)
            } else {
                action()
            }
        }
    }

    getOnSharePressOptions = (item) => {
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

    incrementFloatingHeartCount = () => {
        // only iOS has a clean haptic system at the moment
        if (DEVICE_PLATFORM == 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
        this.setState({
            floatingHeartCount: this.state.floatingHeartCount + 1,
        })
    }

    renderActionButtons = (item, hasActionButton) => {
        // Sanity check if ref exists
        if (!item || !hasActionButton) return null

        const { userId: currentUserId } = this.props
        const { maybeLikeRef, _id, owner, reactions, likeType } = item

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
        let filteredReaction = []

        reactions?.map((reaction) => {
            if (reaction.count > 0) {
                return filteredReaction.push(reaction)
            }
        })

        return (
            <>
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
                        <>
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
                                {LOTTIE_DATA.map((lottie, index) => {
                                    return (
                                        <>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    if (selfLiked) {
                                                        return (
                                                            this.props.unLikeGoal(
                                                                isPost
                                                                    ? 'post'
                                                                    : 'goal',
                                                                _id,
                                                                maybeLikeRef
                                                            ),
                                                            setTimeout(() => {
                                                                this.props.likeGoal(
                                                                    isPost
                                                                        ? 'post'
                                                                        : 'goal',
                                                                    _id,
                                                                    '',
                                                                    '',
                                                                    lottie.value
                                                                ),
                                                                    updateLikeIcon(
                                                                        reactions,
                                                                        lottie.value
                                                                    )
                                                                // this.props.refreshActivityFeed()
                                                            }, 1000),
                                                            this.setState({
                                                                unitText:
                                                                    lottie.title,
                                                                toolTipVisible: false,
                                                                updateReaction: reactions,
                                                            })
                                                        )
                                                    }
                                                    this.incrementFloatingHeartCount()
                                                    this.props.likeGoal(
                                                        isPost
                                                            ? 'post'
                                                            : 'goal',
                                                        _id,
                                                        '',
                                                        '',
                                                        lottie.value
                                                    )

                                                    this.setState({
                                                        unitText: lottie.title,
                                                        toolTipVisible: false,
                                                        updateReaction: '',
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
                                        </>
                                    )
                                })}
                            </Animatable.View>
                        </>
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
                        isShareContent={isShare}
                        actionSummaries={{
                            likeCount,
                            shareCount,
                            commentCount,
                        }}
                        updateReaction={this.state.updateReaction}
                        onLikeSummaryPress={() => {
                            // TODO show list of likers
                        }}
                        onLikeLongPress={() => {
                            this.setState({ toolTipVisible: true })
                        }}
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
                            this.props.likeGoal(
                                'post',
                                _id,
                                '',
                                '',
                                'Thumbsup'
                            ),
                                this.setState({ unitText: 'Like' })
                        }}
                        unitText={
                            this.state.unitText == ''
                                ? renderUnitText(likeType)
                                : this.state.unitText
                        }
                        onLikeButtonLayout={({ nativeEvent }) =>
                            this.setState({
                                likeButtonLeftOffset: nativeEvent.layout.x,
                            })
                        }
                        onShareSummaryPress={() => {
                            // TODO show list of shares
                        }}
                        onShareButtonOptions={this.getOnSharePressOptions(item)}
                        onCommentSummaryPress={() => {
                            this.props.openPostDetail(item, {
                                initialFocusCommentBox: false,
                            })
                        }}
                        onCommentButtonPress={() => {
                            this.props.openPostDetail(item, {
                                initialFocusCommentBox: true,
                            })
                        }}
                    />
                </Tooltip>
            </>
        )
    }

    renderSeeMore(item) {
        const showSeeMore = this.state.hasLongText

        if (!showSeeMore) return null
        return (
            <DelayedButton
                onPress={() => this.props.openPostDetail(item)}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    marginTop: 2,
                }}
            >
                <Text
                    style={{
                        ...default_style.normalText_1,
                        color: color.GM_MID_GREY,
                    }}
                >
                    See more
                </Text>
            </DelayedButton>
        )
    }

    renderHeader(item) {
        const {
            owner,
            _id,
            created,
            maybeIsSubscribed,
            belongsToTribe,
            privacy,
        } = item
        const timeStamp = created || new Date()

        const caret = {
            self: {
                options: [{ option: 'Edit Update' }, { option: 'Delete' }],
                onPress: (key) => {
                    if (key === 'Delete') {
                        return this.props.deletePost(_id)
                    }
                    if (key === 'Edit Update') {
                        // Open post detail with a callback to open post edition
                        const initial = {
                            initialShowPostModal: true,
                        }
                        return this.props.openPostDetail(item, initial)
                    }
                },
                shouldExtendOptionLength: false,
            },
            admin: {
                options: [
                    { option: 'Delete' },
                    { option: 'Report' },
                    {
                        option: maybeIsSubscribed
                            ? CARET_OPTION_NOTIFICATION_UNSUBSCRIBE
                            : CARET_OPTION_NOTIFICATION_SUBSCRIBE,
                    },
                ],
                onPress: (key) => {
                    if (key === 'Delete') {
                        return this.props.deletePost(_id)
                    }
                    if (key === 'Report') {
                        return this.props.createReport(_id, 'profile', 'Post')
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
                        return this.props.createReport(_id, 'profile', 'Post')
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

        // TODO: TAG:
        const { text, tags, links } = item.content

        return (
            <View>
                <View
                    style={{ flexDirection: 'row', alignItems: 'flex-start' }}
                >
                    <ProfileImage
                        imageUrl={getProfileImageOrDefaultFromUser(owner)}
                        actionDecorator={this.props.actionDecorator}
                    />
                    <View style={{ marginLeft: 12, marginTop: 2, flex: 1 }}>
                        <Headline
                            name={owner ? owner.name : ''}
                            isSelf={owner && this.props.userId === owner._id}
                            caret={caret}
                            user={owner}
                            actionDecorator={this.props.actionDecorator}
                            hasCaret={this.props.hasCaret}
                            textStyle={default_style.titleText_2}
                            belongsToTribe={
                                this.props.tribeDetailPostData
                                    ? undefined
                                    : belongsToTribe
                            }
                            userTribeStatus={
                                this.props.tribeDetailPostData
                                    ? this.props.tribeDetailPostData
                                          .userTribeStatus
                                    : undefined
                            }
                        />
                        <View style={{ marginTop: 2 }} />
                        <Timestamp
                            time={timeago().format(timeStamp)}
                            privacy={privacy}
                        />
                    </View>
                </View>
                <RichText
                    contentText={text}
                    contentTags={tags}
                    contentLinks={links || []}
                    textStyle={default_style.normalText_1}
                    textContainerStyle={{ flexDirection: 'row', marginTop: 16 }}
                    numberOfLines={CONTENT_PREVIEW_MAX_NUMBER_OF_LINES}
                    ellipsizeMode="tail"
                    onTextLayout={this.onTextLayout}
                    onUserTagPressed={(user) => {
                        console.log(
                            `${DEBUG_KEY}: user tag press for user: `,
                            user
                        )
                        if (this.props.actionDecorator) {
                            this.props.actionDecorator(() =>
                                this.props.openProfile(user)
                            )
                        } else {
                            this.props.openProfile(user)
                        }
                    }}
                />
                {this.renderSeeMore(item)}
            </View>
        )
    }

    render() {
        const { item, hasActionButton, isSharedItem } = this.props
        if (!item || _.isEmpty(item)) return null
        return (
            <View
                style={[
                    styles.containerStyle,
                    { marginBottom: isSharedItem ? 0 : 8 },
                ]}
            >
                <View
                    style={{
                        marginTop: 12,
                        marginBottom: 10,
                        marginRight: 12,
                        marginLeft: 12,
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => this.handleCardOnPress(item)}
                    >
                        {this.renderHeader(item)}
                    </TouchableOpacity>
                    <PostPreviewBody
                        item={item}
                        showRefPreview={this.props.showRefPreview}
                        openCardContent={() => this.handleCardOnPress(item)}
                    />
                </View>
                <FloatingHearts
                    count={this.state.floatingHeartCount}
                    color={'#EB5757'}
                    style={{
                        zIndex: 5,
                    }}
                    leftOffset={this.state.likeButtonLeftOffset}
                />
                {this.renderActionButtons(item, hasActionButton)}
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        backgroundColor: color.GM_CARD_BACKGROUND,
    },
    textStyle: {
        flex: 1,
        flexWrap: 'wrap',
        fontWeight: 'bold',
    },
}

const mapStateToProps = (state) => {
    const { userId } = state.user
    return {
        userId,
    }
}

export default connect(mapStateToProps, {
    likeGoal,
    unLikeGoal,
    chooseShareDest,
    openPostDetail,
    deletePost,
    openProfile,
    subscribeEntityNotification,
    unsubscribeEntityNotification,
    createReport,
})(wrapAnalytics(PostPreviewCard, SCREENS.PROFILE_POST_TAB))
