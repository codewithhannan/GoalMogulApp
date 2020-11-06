/** @format */

import _ from 'lodash'
import R from 'ramda'
import * as Haptics from 'expo-haptics'
import React from 'react'
import { Dimensions, Image, Text, View } from 'react-native'
import { connect } from 'react-redux'
import timeago from 'timeago.js'
import { deleteGoal } from '../../../actions'
// Asset
import { ConfettiFadedBackgroundTopHalf } from '../../../asset/background'
import {
    makeCaretOptions,
    PAGE_TYPE_MAP,
    decode,
    getProfileImageOrDefaultFromUser,
    sharingPrivacyAlert,
    SHAREING_PRIVACY_ALERT_TYPE,
} from '../../../redux/middleware/utils'
import { chooseShareDest } from '../../../redux/modules/feed/post/ShareActions'
import { shareGoalToMastermind } from '../../../redux/modules/goal/GoalDetailActions'
// Actions
import { openGoalDetail } from '../../../redux/modules/home/mastermind/actions'
import { likeGoal, unLikeGoal } from '../../../redux/modules/like/LikeActions'
import {
    subscribeEntityNotification,
    unsubscribeEntityNotification,
} from '../../../redux/modules/notification/NotificationActions'
// Actions
import { createReport } from '../../../redux/modules/report/ReportActions'
// Constants
import {
    CARET_OPTION_NOTIFICATION_SUBSCRIBE,
    CARET_OPTION_NOTIFICATION_UNSUBSCRIBE,
    DEVICE_PLATFORM,
} from '../../../Utils/Constants'
// Components
import DelayedButton from '../../Common/Button/DelayedButton'
import ProfileImage from '../../Common/ProfileImage'
import GoalCardHeader from '../Common/GoalCardHeader'
import Headline from '../Common/Headline'
import GoalCardBody from '../Common/GoalCardBody'
import Timestamp from '../Common/Timestamp'
import { default_style, color } from '../../../styles/basic'
import ActionBar from '../../Common/ContentCards/ActionBar'
import FloatingHearts from '../../Common/FloatingHearts/FloatingHearts'

const { width } = Dimensions.get('window')
const WINDOW_WIDTH = width

const DEBUG_KEY = '[ UI GoalCard ]'
const SHARE_TO_MENU_OPTTIONS = [
    'Publish to Home Feed',
    'Share to a Tribe',
    'Cancel',
]
const CANCEL_INDEX = 2

/**
 * @param isSharedItem: when true, component renders a concise view of GoalCard
 *                      that is meant just view and link to the Goal that has been shared
 */
class GoalCard extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            navigationState: {
                index: 0,
                routes: [
                    { key: 'steps', title: 'Steps' },
                    { key: 'needs', title: 'Needs' },
                ],
            },
            floatingHeartCount: 0,
            likeButtonLeftOffset: 0,
        }
        this.updateRoutes = this.updateRoutes.bind(this)
        this.handleOnPress = this.handleOnPress.bind(this)
    }

    componentDidMount() {
        const { item } = this.props
        this.updateRoutes(item)
    }

    updateRoutes(item) {
        if (item && !_.isEmpty(item)) {
            const { steps, needs } = item
            if (_.isEmpty(steps) && _.isEmpty(needs)) return
            let newRoutes = []
            let newNavigationState = {
                index: 0,
            }
            if (steps && steps.length > 0 && !_.isEmpty(steps)) {
                newRoutes = [...newRoutes, { key: 'steps', title: 'Steps' }]
            }

            if (needs && needs.length > 0 && !_.isEmpty(needs)) {
                newRoutes = [...newRoutes, { key: 'needs', title: 'Needs' }]
            }
            newNavigationState = _.set(newNavigationState, 'routes', newRoutes)
            this.setState({
                navigationState: newNavigationState,
            })
        }
    }

    incrementFloatingHeartCount = () => {
        // only iOS has a clean haptic system at the moment
        if (DEVICE_PLATFORM === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
        this.setState({
            floatingHeartCount: this.state.floatingHeartCount + 1,
        })
    }

    handleOnPress() {
        this.props.onPress
            ? this.props.onPress(this.props.item)
            : this.props.openGoalDetail(this.props.item)
    }

    // Card central content. Progressbar for goal card
    renderCardContent(item) {
        const { start, end, needs, steps } = item

        return (
            <GoalCardBody
                containerStyle={{ marginTop: 12 }}
                startTime={start}
                endTime={end}
                steps={steps}
                needs={needs}
                goalRef={item}
            />
        )
    }

    // user basic information
    renderUserDetail(item) {
        const {
            title,
            owner,
            category,
            _id,
            created,
            maybeIsSubscribed,
            viewCount,
            priority,
            isCompleted,
        } = item
        const timeStamp =
            created === undefined || created.length === 0 ? new Date() : created

        const pageId = _.get(PAGE_TYPE_MAP, 'goalFeed')

        const selfOptions = makeCaretOptions('Goal', item)

        const caret = {
            self: {
                options: selfOptions,
                onPress: (key) => {
                    if (key === 'Delete') {
                        return this.props.deleteGoal(_id, pageId)
                    }

                    let initialProps = {}
                    if (key === 'Edit Goal') {
                        initialProps = { initialShowGoalModal: true }
                        this.props.openGoalDetail(item, initialProps)
                        return
                    }
                    if (key === 'Mark as Complete') {
                        initialProps = {
                            initialMarkGoalAsComplete: true,
                            refreshGoal: false,
                        }
                        this.props.openGoalDetail(item, initialProps)
                        return
                    }

                    if (key === 'Unmark as Complete') {
                        initialProps = {
                            initialUnMarkGoalAsComplete: true,
                            refreshGoal: false,
                        }
                        this.props.openGoalDetail(item, initialProps)
                        return
                    }
                },
                shouldExtendOptionLength:
                    owner && owner._id === this.props.userId,
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
                        return this.props.createReport(_id, 'goal', 'Goal')
                    }
                    if (key === CARET_OPTION_NOTIFICATION_UNSUBSCRIBE) {
                        return this.props.unsubscribeEntityNotification(
                            _id,
                            'Goal'
                        )
                    }
                    if (key === CARET_OPTION_NOTIFICATION_SUBSCRIBE) {
                        return this.props.subscribeEntityNotification(
                            _id,
                            'Goal'
                        )
                    }
                },
                shouldExtendOptionLength: false,
            },
        }

        return (
            <View>
                <View style={{ flexDirection: 'row' }}>
                    <ProfileImage
                        imageUrl={getProfileImageOrDefaultFromUser(owner)}
                    />
                    <View style={{ marginLeft: 12, marginTop: 2, flex: 1 }}>
                        <Headline
                            name={owner ? owner.name : ''}
                            category={category}
                            user={owner}
                            isSelf={owner && owner._id === this.props.userId}
                            hasCaret={!this.props.isSharedItem}
                            caret={caret}
                            textStyle={default_style.titleText_2}
                        />
                        <View style={{ marginTop: 2 }} />
                        <Timestamp
                            time={timeago().format(timeStamp)}
                            viewCount={viewCount}
                            priority={priority}
                            isCompleted={isCompleted}
                        />
                    </View>
                </View>
                <Text
                    style={{
                        ...default_style.goalTitleText_1,
                        marginTop: 16,
                        flex: 1,
                        flexWrap: 'wrap',
                        color: 'black',
                    }}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    selectable
                >
                    {decode(title)}
                </Text>
            </View>
        )
    }

    renderActionButtons(item) {
        const { maybeLikeRef, _id, privacy } = item
        const likeCount = item.likeCount ? item.likeCount : 0
        const commentCount = item.commentCount ? item.commentCount : 0
        const shareCount = item.shareCount ? item.shareCount : 0

        const selfLiked = maybeLikeRef && maybeLikeRef.length > 0

        const onSharePressOptions = [
            {
                text: 'Publish to Home Feed',
                onPress: () => {
                    this.props.shareGoalToMastermind(_id)
                },
            },
            {
                text: 'Share to a Tribe',
                onPress: () => {
                    if (privacy !== 'public') {
                        return sharingPrivacyAlert(
                            SHAREING_PRIVACY_ALERT_TYPE.goal
                        )
                    }
                    this.props.chooseShareDest('ShareGoal', _id, 'tribe', item)
                },
            },
        ]

        return (
            <ActionBar
                isContentLiked={selfLiked}
                actionSummaries={{
                    likeCount,
                    shareCount,
                    commentCount,
                }}
                onLikeSummaryPress={() =>
                    this.setState({ showlikeListModal: true })
                }
                onLikeButtonPress={() => {
                    if (selfLiked) {
                        return this.props.unLikeGoal('goal', _id, maybeLikeRef)
                    }
                    this.incrementFloatingHeartCount()
                    this.props.likeGoal('goal', _id)
                }}
                onLikeButtonLayout={({ nativeEvent }) =>
                    this.setState({
                        likeButtonLeftOffset: nativeEvent.layout.x,
                    })
                }
                onShareSummaryPress={() =>
                    this.setState({ showShareListModal: true })
                }
                onShareButtonOptions={onSharePressOptions}
                onCommentSummaryPress={() => {
                    // TODO scroll down to comments section
                }}
                onCommentButtonPress={() => {
                    this.props.onPress(this.props.item, {
                        type: 'comment',
                        _id: undefined,
                        initialShowSuggestionModal: false,
                        initialFocusCommentBox: true,
                    })
                }}
            />
        )
    }

    render() {
        const { item, isSharedItem } = this.props
        if (!item) return null

        return (
            <View style={styles.containerStyle}>
                <FloatingHearts
                    count={this.state.floatingHeartCount}
                    color={'#EB5757'}
                    style={{
                        zIndex: 5,
                    }}
                    leftOffset={this.state.likeButtonLeftOffset}
                />
                {item.isCompleted && (
                    <Image
                        source={ConfettiFadedBackgroundTopHalf}
                        style={{
                            height: WINDOW_WIDTH * 0.6,
                            width: WINDOW_WIDTH,
                            position: 'absolute',
                            resizeMode: 'cover',
                            opacity: 0.55,
                        }}
                    />
                )}
                {!isSharedItem && <GoalCardHeader item={item} />}
                <View>
                    <DelayedButton
                        activeOpacity={1}
                        onPress={this.handleOnPress}
                    >
                        <View
                            style={{
                                marginTop: 14,
                                marginBottom: 12,
                                marginRight: 12,
                                marginLeft: 12,
                            }}
                        >
                            {this.renderUserDetail(item)}
                            {this.renderCardContent(item)}
                        </View>
                    </DelayedButton>
                    {!isSharedItem && this.renderActionButtons(item)}
                </View>
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        backgroundColor: color.GM_CARD_BACKGROUND,
        marginTop: 8,
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
    chooseShareDest,
    deleteGoal,
    subscribeEntityNotification,
    unsubscribeEntityNotification,
    openGoalDetail,
    shareGoalToMastermind,
})(GoalCard)
