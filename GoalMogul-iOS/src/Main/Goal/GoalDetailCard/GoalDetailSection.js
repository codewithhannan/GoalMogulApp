/** @format */

import * as Haptics from 'expo-haptics'
import _ from 'lodash'
import moment from 'moment'
import R from 'ramda'
import React from 'react'
import {
    Alert,
    Dimensions,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import timeago from 'timeago.js'
import { deleteGoal, openProfile } from '../../../actions'
import { ConfettiFadedBackgroundTopHalf } from '../../../asset/background'
import Icons from '../../../asset/base64/Icons'
import EditIcon from '../../../asset/utils/edit.png'
import ShareIcon from '../../../asset/utils/forward.png'
// Assets
import TrashIcon from '../../../asset/utils/trash.png'
import UndoIcon from '../../../asset/utils/undo.png'
import {
    decode,
    getProfileImageOrDefaultFromUser,
} from '../../../redux/middleware/utils'
import { createCommentFromSuggestion } from '../../../redux/modules/feed/comment/CommentActions'
import { chooseShareDest } from '../../../redux/modules/feed/post/ShareActions'
import {
    editGoal,
    markGoalAsComplete,
    scheduleNotification,
    shareGoalToMastermind,
} from '../../../redux/modules/goal/GoalDetailActions'
import { likeGoal, unLikeGoal } from '../../../redux/modules/like/LikeActions'
import {
    subscribeEntityNotification,
    unsubscribeEntityNotification,
} from '../../../redux/modules/notification/NotificationActions'
// Actions
import { createReport } from '../../../redux/modules/report/ReportActions'
import { color, default_style } from '../../../styles/basic'
// Constants
import {
    CARET_OPTION_NOTIFICATION_SUBSCRIBE,
    CARET_OPTION_NOTIFICATION_UNSUBSCRIBE,
    DEVICE_PLATFORM,
    CONTENT_PREVIEW_MAX_NUMBER_OF_LINES,
} from '../../../Utils/Constants'
import {
    actionSheet,
    switchByButtonIndex,
} from '../../Common/ActionSheetFactory'
import FloatingHearts from '../../Common/FloatingHearts/FloatingHearts'
import LikeListModal from '../../Common/Modal/LikeListModal'
import ShareListModal from '../../Common/Modal/ShareListModal'
import ProfileImage from '../../Common/ProfileImage'
import RichText from '../../Common/Text/RichText'
import Headline from '../Common/Headline'
import IndividualActionButton from '../Common/IndividualActionButton'
// Components
import GoalCardBody from '../Common/GoalCardBody'
import Timestamp from '../Common/Timestamp'
import ActionBar from '../../Common/ContentCards/ActionBar'

const { width } = Dimensions.get('window')
const WINDOW_WIDTH = width

const { CheckIcon, BellIcon } = Icons
const DEBUG_KEY = '[ UI GoalDetailCardV3.GoalDetailSection ]'
const SHARE_TO_MENU_OPTTIONS = [
    'Share to Feed',
    'Share to an Event',
    'Share to a Tribe',
    'Cancel',
]
const CANCEL_INDEX = 3

class GoalDetailSection extends React.PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            numberOfLines: CONTENT_PREVIEW_MAX_NUMBER_OF_LINES,
            hasLongText: false,
            seeMore: false,
            goalReminderDatePicker: false,
            showShareListModa: false,
            showlikeListModal: false,
            floatingHeartCount: 0,
            likeButtonLeftOffset: 0,
        }
        this.handleGoalReminder = this.handleGoalReminder.bind(this)
    }

    componentDidMount() {
        if (this.props.onRef !== null) {
            this.props.onRef(this)
        }
    }

    onTextLayout(e) {
        const firstLine = e.nativeEvent.lines[0]
        const lastLine = e.nativeEvent.lines[e.nativeEvent.lines.length - 1]
        const numberOfRenderedLines = e.nativeEvent.lines.length
        this.setState({
            hasLongText:
                lastLine.text.length > firstLine.text.length ||
                numberOfRenderedLines > CONTENT_PREVIEW_MAX_NUMBER_OF_LINES,
        })
    }

    openHeadlineMenu() {
        if (this.headline !== undefined) {
            console.log(`${DEBUG_KEY}: [ openHeadlineMenu ]`)
            this.headline.openMenu()
        }
    }

    // Handle user clicks on option "Remind me about this"
    handleGoalReminder = () => {
        const goal = this.props.item
        const goalReminderSwitch = switchByButtonIndex([
            [
                R.equals(0),
                () => {
                    // Add 24 hours to current time
                    const reminderTime = moment(new Date())
                        .add(24, 'hours')
                        .toDate()
                    this.props.scheduleNotification(reminderTime, goal)
                },
            ],
            [
                R.equals(1),
                () => {
                    // Add 7 days to current time
                    const reminderTime = moment(new Date())
                        .add(7, 'days')
                        .toDate()
                    this.props.scheduleNotification(reminderTime, goal)
                },
            ],
            [
                R.equals(2),
                () => {
                    // Add 1 months
                    const reminderTime = moment(new Date())
                        .add(1, 'month')
                        .toDate()
                    this.props.scheduleNotification(reminderTime, goal)
                },
            ],
            [
                R.equals(3),
                () => {
                    // Show customized time picker
                    this.setState({
                        ...this.state,
                        goalReminderDatePicker: true,
                    })
                },
            ],
        ])

        const shareToActionSheet = actionSheet(
            ['Tomorrow', 'Next Week', 'Next Month', 'Custom', 'Cancel'],
            4,
            goalReminderSwitch
        )
        return shareToActionSheet()
    }

    handleOnLayout = (event) => {
        if (this.props.onContentSizeChange)
            this.props.onContentSizeChange('goalDetailSectionCard', event)
    }

    handleShareOnClick = () => {
        const { item } = this.props
        const { _id } = item
        const shareType = 'ShareGoal'

        const shareToSwitchCases = switchByButtonIndex([
            [
                R.equals(0),
                () => {
                    // User choose to share to feed
                    console.log(`${DEBUG_KEY} User choose destination: Feed `)
                    this.props.chooseShareDest(shareType, _id, 'feed', item)
                    // TODO: update reducer state
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
        const {
            _id,
            created,
            title,
            owner,
            category,
            details,
            isCompleted,
            maybeIsSubscribed,
            viewCount,
        } = item
        const timeStamp =
            created === undefined || created.length === 0 ? new Date() : created

        const caret = {
            self: {
                options: [
                    {
                        option: 'Remind me about this',
                        iconSource: BellIcon,
                        iconStyle: {
                            width: 14,
                            height: 16,
                            marginLeft: 1,
                            marginRight: 1,
                        },
                        tutorialText: this.props.tutorialText[0],
                        order: 0,
                        name: 'goal_detail_goal_detail_page_0',
                    },
                    {
                        option: 'Share to Goal Feed',
                        iconSource: ShareIcon,
                        tutorialText: this.props.tutorialText[1],
                        order: 1,
                        name: 'goal_detail_goal_detail_page_1',
                    },
                    {
                        option: isCompleted
                            ? 'Unmark as Complete'
                            : 'Mark as Complete',
                        iconSource: isCompleted ? UndoIcon : CheckIcon,
                        tutorialText: this.props.tutorialText[2],
                        order: 2,
                        name: 'goal_detail_goal_detail_page_2',
                    },
                    {
                        option: 'Edit Goal',
                        iconSource: EditIcon,
                        tutorialText: this.props.tutorialText[3],
                        order: 3,
                        name: 'goal_detail_goal_detail_page_3',
                    },
                    {
                        option: 'Delete',
                        iconSource: TrashIcon,
                        tutorialText: this.props.tutorialText[4],
                        order: 4,
                        name: 'goal_detail_goal_detail_page_4',
                    },
                ],
                onPress: (val) => {
                    const markCompleteOnPress = isCompleted
                        ? () => {
                              Alert.alert(
                                  'Confirmation',
                                  'Are you sure to mark this goal as incomplete?',
                                  [
                                      {
                                          text: 'Cancel',
                                          onPress: () =>
                                              console.log('user cancel unmark'),
                                      },
                                      {
                                          text: 'Confirm',
                                          onPress: () =>
                                              this.props.markGoalAsComplete(
                                                  _id,
                                                  false,
                                                  this.props.pageId
                                              ),
                                      },
                                  ]
                              )
                          }
                        : () =>
                              this.props.markGoalAsComplete(
                                  _id,
                                  true,
                                  this.props.pageId
                              )

                    if (val === 'Delete') {
                        this.props.deleteGoal(_id, this.props.pageId) // TODO: profile reducer redesign to change here.
                        Actions.pop()
                        return
                    }
                    if (val === 'Edit Goal')
                        return this.props.editGoal(item, this.props.pageId)
                    if (val === 'Share to Goal Feed')
                        return this.props.shareGoalToMastermind(
                            _id,
                            this.props.pageId
                        )
                    if (
                        val === 'Unmark as Complete' ||
                        val === 'Mark as Complete'
                    ) {
                        return markCompleteOnPress()
                    }
                    if (val === 'Remind me about this') {
                        this.handleGoalReminder()
                    }
                },
                shouldExtendOptionLength: true,
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

        const { text, tags } = details || { text: '', tags: [] }
        return (
            <View>
                <View style={{ flexDirection: 'row' }}>
                    <ProfileImage
                        imageUrl={getProfileImageOrDefaultFromUser(owner)}
                        userId={owner._id}
                    />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                        <Headline
                            onRef={(ref) => {
                                this.headline = ref
                            }}
                            name={owner.name || ''}
                            category={category}
                            isSelf={this.props.userId === owner._id}
                            caret={caret}
                            item={item}
                            user={owner}
                            pageId={this.props.pageId}
                            goalId={this.props.goalId}
                            menuName={this.props.menuName}
                            textStyle={default_style.titleText_2}
                        />
                        <Timestamp
                            time={timeago().format(timeStamp)}
                            viewCount={viewCount}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 16 }}>
                    <Text
                        style={{
                            ...default_style.goalTitleText_1,
                            flexWrap: 'wrap',
                            color: 'black',
                        }}
                        numberOfLines={3}
                        ellipsizeMode="tail"
                        selectable
                    >
                        {decode(title)}
                    </Text>
                </View>
                <RichText
                    contentText={text}
                    contentTags={tags}
                    textContainerStyle={{ flexDirection: 'row' }}
                    textStyle={{
                        ...default_style.normalText_1,
                        flexWrap: 'wrap',
                        marginTop: 12,
                    }}
                    multiline
                    onUserTagPressed={(user) => {
                        console.log(
                            `${DEBUG_KEY}: user tag press for user: `,
                            user
                        )
                        this.props.openProfile(user)
                    }}
                    onTextLayout={this.onTextLayout.bind(this)}
                    numberOfLines={this.state.numberOfLines}
                />
                {this.renderSeeMore(text)}
            </View>
        )
    }

    renderGoalReminderDatePicker() {
        const goal = this.props.item
        return (
            <DateTimePicker
                isVisible={this.state.goalReminderDatePicker}
                mode="datetime"
                titleIOS="Pick a time"
                minimumDate={new Date()}
                onConfirm={(date) => {
                    this.setState(
                        {
                            ...this.state,
                            goalReminderDatePicker: false,
                        },
                        () => {
                            this.props.scheduleNotification(date, goal)
                        }
                    )
                }}
                onCancel={() => {
                    this.setState({
                        ...this.state,
                        goalReminderDatePicker: false,
                    })
                }}
            />
        )
    }

    renderCardContent(item) {
        const { start, end, steps, needs } = item

        return (
            <GoalCardBody
                containerStyle={{ marginVertical: 12 }}
                startTime={start}
                endTime={end}
                steps={steps}
                needs={needs}
                goalRef={item}
                pageId={this.props.pageId}
            />
        )
    }

    // If this goal belongs to current user, display Edit goal, Share to Mastermind, Mark complete
    renderSelfActionButtons(item) {
        const { _id, isCompleted, feedInfo } = item
        const hasShareToMastermind = feedInfo && !_.isEmpty(feedInfo)
        const markCompleteStyle = isCompleted
            ? {
                  containerStyle: { backgroundColor: '#ecf9e9' },
                  textStyle: { color: '#9fcd8d' },
              }
            : {
                  // containerStyle: { backgroundColor: '#eafcee' }
              }

        const markCompleteOnPress = isCompleted
            ? () => {
                  Alert.alert(
                      'Confirmation',
                      'Are you sure to mark this goal as incomplete?',
                      [
                          {
                              text: 'Cancel',
                              onPress: () => console.log('user cancel unmark'),
                          },
                          {
                              text: 'Confirm',
                              onPress: () =>
                                  this.props.markGoalAsComplete(
                                      _id,
                                      false,
                                      this.props.pageId
                                  ),
                          },
                      ]
                  )
              }
            : () => this.props.markGoalAsComplete(_id, true, this.props.pageId)

        return (
            <View style={styles.selfActionButtonsContainerStyle}>
                <IndividualActionButton
                    buttonName="Edit goal"
                    iconSource={EditIcon}
                    iconStyle={{ tintColor: '#3f3f3f' }}
                    onPress={() => this.props.editGoal(item)}
                />
                <IndividualActionButton
                    buttonName="Mastermind"
                    iconSource={ShareIcon}
                    iconStyle={{ tintColor: '#3f3f3f' }}
                    onPress={() => this.props.shareGoalToMastermind(_id)}
                />
                <IndividualActionButton
                    buttonName="Mark Complete"
                    iconSource={CheckIcon}
                    iconStyle={{ tintColor: '#3f3f3f', height: 13 }}
                    textStyle={markCompleteStyle.textStyle}
                    containerStyle={markCompleteStyle.containerStyle}
                    onPress={markCompleteOnPress}
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

    renderActionButtons(item) {
        const { maybeLikeRef, _id } = item
        const likeCount = item.likeCount ? item.likeCount : 0
        const commentCount = item.commentCount ? item.commentCount : 0
        const shareCount = item.shareCount ? item.shareCount : 0

        const selfLiked = maybeLikeRef && maybeLikeRef.length > 0

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
                onShareButtonPress={() => this.handleShareOnClick(item)}
                onCommentSummaryPress={() => {
                    // TODO scroll down to comments section
                }}
                onCommentButtonPress={() => {
                    this.props.onSuggestion()
                }}
            />
        )
    }

    render() {
        const { item } = this.props
        if (!item || _.isEmpty(item)) return null

        return (
            <View onLayout={this.handleOnLayout}>
                <View style={{ paddingHorizontal: 16 }}>
                    <LikeListModal
                        testID="like-list-modal"
                        isVisible={this.state.showlikeListModal}
                        closeModal={() => {
                            this.setState({
                                ...this.state,
                                showlikeListModal: false,
                            })
                        }}
                        parentId={item._id}
                        parentType="Goal"
                    />
                    <ShareListModal
                        testID="share-list-modal"
                        isVisible={this.state.showShareListModal}
                        closeModal={() => {
                            this.setState({
                                ...this.state,
                                showShareListModal: false,
                            })
                        }}
                        entityId={item._id}
                        entityType="Goal"
                    />
                    <View style={styles.containerStyle}>
                        {item.isCompleted ? (
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
                        ) : null}
                        <View style={{ marginTop: 16 }}>
                            {this.renderUserDetail(item)}
                            {this.renderCardContent(item)}
                        </View>
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
                {this.renderActionButtons(item)}
                {this.renderGoalReminderDatePicker()}
            </View>
        )
    }
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
    selfActionButtonsContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        margin: 20,
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
}

const mapStateToProps = (state) => {
    const { userId } = state.user
    const { tutorialText } = state.tutorials.goal_detail.goal_detail_page

    return {
        userId,
        tutorialText,
    }
}

export default connect(mapStateToProps, {
    createReport,
    likeGoal,
    unLikeGoal,
    createCommentFromSuggestion,
    chooseShareDest,
    editGoal,
    scheduleNotification,
    shareGoalToMastermind,
    markGoalAsComplete,
    deleteGoal,
    openProfile,
    subscribeEntityNotification,
    unsubscribeEntityNotification,
})(GoalDetailSection)
