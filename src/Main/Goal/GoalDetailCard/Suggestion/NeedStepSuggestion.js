/** @format */

import React from 'react'
import {
    View,
    TextInput,
    SafeAreaView,
    Text,
    Animated,
    Alert,
    Dimensions,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native'
import { connect } from 'react-redux'
import { CheckBox } from 'react-native-elements'
import * as Haptics from 'expo-haptics'
import _ from 'lodash'
import moment from 'moment'
import R from 'ramda'
import RNModal from 'react-native-modalbox'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// Actions
import {
    onSuggestionTextChange,
    updateSuggestionType,
} from '../../../../redux/modules/feed/comment/CommentActions'

import { getNewCommentByTab } from '../../../../redux/modules/feed/comment/CommentSelector'

import DateTimePicker from 'react-native-modal-datetime-picker'
import { Actions } from 'react-native-router-flux'
import timeago from 'timeago.js'
import { deleteGoal, openProfile } from '../../../../actions'
import { ConfettiFadedBackgroundTopHalf } from '../../../../asset/background'
import Icons from '../../../../asset/base64/Icons'
import EditIcon from '../../../../asset/utils/edit.png'
import ShareIcon from '../../../../asset/utils/forward.png'
// Assets
import TrashIcon from '../../../../asset/utils/trash.png'
import UndoIcon from '../../../../asset/utils/undo.png'
import {
    decode,
    getProfileImageOrDefaultFromUser,
    sharingPrivacyAlert,
    SHAREING_PRIVACY_ALERT_TYPE,
    countWords,
} from '../../../../redux/middleware/utils'
import { createCommentFromSuggestion } from '../../../../redux/modules/feed/comment/CommentActions'
import { chooseShareDest } from '../../../../redux/modules/feed/post/ShareActions'
import {
    editGoal,
    markGoalAsComplete,
    scheduleNotification,
    shareGoalToMastermind,
} from '../../../../redux/modules/goal/GoalDetailActions'
import Tooltip from 'react-native-walkthrough-tooltip'
import LottieView from 'lottie-react-native'
import * as Animatable from 'react-native-animatable'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

import {
    likeGoal,
    unLikeGoal,
} from '../../../../redux/modules/like/LikeActions'
import {
    subscribeEntityNotification,
    unsubscribeEntityNotification,
} from '../../../../redux/modules/notification/NotificationActions'
// Actions
import { createReport } from '../../../../redux/modules/report/ReportActions'
import { color, default_style } from '../../../../styles/basic'
// Constants
import {
    CARET_OPTION_NOTIFICATION_SUBSCRIBE,
    CARET_OPTION_NOTIFICATION_UNSUBSCRIBE,
    DEVICE_PLATFORM,
    CONTENT_PREVIEW_MAX_NUMBER_OF_LINES,
} from '../../../../Utils/Constants'
import FloatingHearts from '../../../Common/FloatingHearts/FloatingHearts'
import LikeListModal from '../../../Common/Modal/LikeListModal'
import ShareListModal from '../../../Common/Modal/ShareListModal'
import ProfileImage from '../../../Common/ProfileImage'
import RichText from '../../../Common/Text/RichText'
import Headline from '../../Common/Headline'
import IndividualActionButton from '../../Common/IndividualActionButton'
// Components
import GoalCardBody from '../../Common/GoalCardBody'
import Timestamp from '../../Common/Timestamp'
import ActionBar from '../../../Common/ContentCards/ActionBar'
import BottomButtonsSheet from '../../../Common/Modal/BottomButtonsSheet'
import SuggestionPopup from '../../../Journey/SuggestionPopup'
import NudgePopup from '../../../Journey/NudgePopup'
import { createSuggestion } from '../../../../redux/modules/feed/comment/CommentActions'
import { getButtonBottomSheetHeight } from '../../../../styles'

import {
    makeGetGoalPageDetailByPageId,
    makeGetGoalStepsAndNeedsV2,
} from '../../../../redux/modules/goal/selector'
import {
    LOTTIE_DATA,
    renderUnitText,
} from '../../../Common/ContentCards/LikeSheetData'
import ClarifyModal from '../../../Common/Modal/ClarifyModal'

const { width } = Dimensions.get('window')
const TOOLTIP_WIDTH = Dimensions.get('screen').width
const WINDOW_WIDTH = width

const { CheckIcon, BellIcon } = Icons
const DEBUG_KEY = '[ UI GoalDetailCardV3.GoalDetailSection ]'

const CANCEL_INDEX = 2

class NeedStepSuggestion extends React.Component {
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
            showSuggestionPopup: false,
            showClarifyPopup: false,
            showNudgePopup: false,
            toolTipVisible: false,
            unitText: '',
        }
        this.handleGoalReminder = this.handleGoalReminder.bind(this)
        this.onTextLayout = this.onTextLayout.bind(this)
    }

    componentDidMount() {
        // if (this.props.onRef !== null) {
        //     this.props.onRef(this)
        // }

        const { goalDetail } = this.props
        const { steps, needs, isOwnGoal } = goalDetail
        if (steps.length === 0 && needs.length === 0 && !isOwnGoal) {
            setTimeout(() => {
                this.setState({ showSuggestionPopup: true })
            }, 2000)
        }

        if (this.props.initialProps) {
            const { initialShowPostModal } = this.props.initialProps

            // Display CreatePostModal
            if (initialShowPostModal) {
                setTimeout(() => {
                    this.props.editGoal(this.props.item)
                }, 750)
                return
            }
        }
    }

    renderInputField() {
        const { suggestionText, suggestionType } = this.props
        const suggestion = suggestionType === 'NewNeed' ? 'Need' : 'Step'
        const titleText = (
            <Text style={styles.titleTextStyle}>Suggest a {suggestion}:</Text>
        )

        return (
            <View
                style={{
                    backgroundColor: 'white',
                    // borderBottomWidth: 0.5,
                    // marginTop: 10,
                    marginVertical: 15,
                    // borderColor: 'lightgray',
                }}
            >
                <View style={{ marginHorizontal: 15 }}>{titleText}</View>
                <TextInput
                    placeholder={`What ${suggestion} do you want to suggest?`}
                    onChangeText={(val) =>
                        this.props.onSuggestionTextChange(
                            val,
                            this.props.pageId
                        )
                    }
                    style={styles.inputStyle}
                    maxHeight={100}
                    keyboardType={'default'}
                    autoCorrect
                    multiline
                    value={suggestionText}
                />
            </View>
        )
    }

    onTextLayout(e) {
        const firstLine = e.nativeEvent.lines[0]
        const lastLine = e.nativeEvent.lines[e.nativeEvent.lines.length - 1]
        const { text } = this.props.item.details || { text: '' }
        const numberOfRenderedLines = e.nativeEvent.lines.length
        this.setState({
            hasLongText:
                lastLine.text.length > firstLine.text.length ||
                countWords(e.nativeEvent.lines) < countWords(text) ||
                numberOfRenderedLines > CONTENT_PREVIEW_MAX_NUMBER_OF_LINES,
        })
    }

    openHeadlineMenu() {
        if (this.headline !== undefined) {
            console.log(`${DEBUG_KEY}: [ openHeadlineMenu ]`)
            this.headline.openMenu()
        }
    }

    handleGoalReminder = () => {
        this.bottomSheetRef && this.bottomSheetRef.open()
    }

    // Handle user clicks on option "Remind me about this"
    getOnGoalReminderOptions = () => {
        const goal = this.props.item
        return [
            {
                text: 'Tomorrow',
                onPress: () => {
                    const reminderTime = moment(new Date())
                        .add(24, 'hours')
                        .toDate()
                    this.props.scheduleNotification(reminderTime, goal)
                },
            },
            {
                text: 'Next Week',
                onPress: () => {
                    const reminderTime = moment(new Date())
                        .add(7, 'days')
                        .toDate()
                    this.props.scheduleNotification(reminderTime, goal)
                },
            },
            {
                text: 'Next Month',
                onPress: () => {
                    // Add 1 months
                    const reminderTime = moment(new Date())
                        .add(1, 'month')
                        .toDate()
                    this.props.scheduleNotification(reminderTime, goal)
                },
            },
            {
                text: 'Custom',
                onPress: () => {
                    // Show customized time picker
                    this.setState({
                        goalReminderDatePicker: true,
                    })
                },
            },
        ]
    }

    handleOnLayout = (event) => {
        if (this.props.onContentSizeChange)
            this.props.onContentSizeChange('goalDetailSectionCard', event)
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
            privacy,
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
                                  'Are you sure you want to mark this goal as incomplete?',
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
                            hasCaret={false}
                            // caret={caret}
                            item={item}
                            user={owner}
                            pageId={this.props.pageId}
                            goalId={this.props.goalId}
                            menuName={this.props.menuName}
                            textStyle={default_style.titleText_2}
                        />
                        <Timestamp
                            time={timeago().format(timeStamp)}
                            privacy={privacy}
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
                    onTextLayout={this.onTextLayout}
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
                            goalReminderDatePicker: false,
                        },
                        () => {
                            this.props.scheduleNotification(date, goal)
                        }
                    )
                }}
                onCancel={() => {
                    this.setState({
                        goalReminderDatePicker: false,
                    })
                }}
                isDarkModeEnabled={false}
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
                      'Are you sure you want to mark this goal as incomplete?',
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

    renderActionButtons(item, isOwnGoal) {
        // console.log('This is item from renderActionButtons:', item)
        const { maybeLikeRef, _id, privacy, steps, needs, likeType } = item
        const likeCount = item.likeCount ? item.likeCount : 0
        const commentCount = item.commentCount ? item.commentCount : 0
        const shareCount = item.shareCount ? item.shareCount : 0

        const selfLiked = maybeLikeRef && maybeLikeRef.length > 0

        const noStepsAndNeeds = needs.length === 0 && steps.length === 0

        const shareType = 'ShareGoal'
        const options = [
            {
                text: 'Publish to Home Feed',
                onPress: () => {
                    this.props.shareGoalToMastermind(_id, this.props.pageId)
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
                    this.props.chooseShareDest(shareType, _id, 'tribe', item)
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
                actionButtonVisible
            />
        )
    }

    closeSuggestionPopup = () => {
        this.setState({ showSuggestionPopup: false }, () => {
            setTimeout(() => {
                this.setState({ showNudgePopup: true })
            }, 500)
        })
    }

    closeClarifyPopup = () => {
        this.setState({ showClarifyPopup: false })
    }

    showSuggestionModal = () => {
        const { goalId, pageId } = this.props
        this.setState({ showSuggestionPopup: false }, () => {
            setTimeout(() => {
                this.props.createSuggestion(goalId, pageId)
            }, 500)
        })
    }

    render() {
        const { opacity, suggestionType } = this.props
        const { item, isOwnGoal, goalDetail } = this.props
        if (!item || _.isEmpty(item)) return null

        const goalReminderOptions = this.getOnGoalReminderOptions()

        return (
            <View style={{ flex: 1 }}>
                <KeyboardAwareScrollView bounces={false}>
                    {/* <SuggestionPopup
                        isVisible={this.state.showSuggestionPopup}
                        name={goalDetail.owner.name}
                        closeModal={this.closeSuggestionPopup}
                        showSuggestion={this.showSuggestionModal}
                    />
                    <ClarifyModal
                        isVisible={this.state.showClarifyPopup}
                        name={goalDetail.owner.name}
                        closeModal={this.closeClarifyPopup}
                    />
                    <NudgePopup
                        isVisible={this.state.showNudgePopup}
                        name={goalDetail.owner.name}
                        closeModal={() => {
                            this.setState({ showNudgePopup: false })
                        }}
                    /> */}
                    <View onLayout={this.handleOnLayout}>
                        <View style={{ paddingHorizontal: 16 }}>
                            <LikeListModal
                                testID="like-list-modal"
                                isVisible={this.state.showlikeListModal}
                                closeModal={() => {
                                    this.setState({
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
                                        showShareListModal: false,
                                    })
                                }}
                                entityId={item._id}
                                entityType="Goal"
                            />
                            <BottomButtonsSheet
                                ref={(r) => (this.bottomSheetRef = r)}
                                buttons={goalReminderOptions}
                                height={getButtonBottomSheetHeight(
                                    goalReminderOptions.length
                                )}
                                closeSheetOnOptionPress
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
                        {this.renderActionButtons(item, isOwnGoal)}
                        {this.renderGoalReminderDatePicker()}
                        {this.renderInputField()}
                    </View>
                </KeyboardAwareScrollView>
            </View>
        )
    }
}

const styles = {
    inputStyle: {
        marginVertical: 10,
        width: '90%',
        height: 100,
        fontSize: 15,
        padding: 8,
        paddingRight: 15,
        paddingLeft: 15,
        borderWidth: 1,
        alignSelf: 'center',
        borderColor: 'lightgray',
    },
    titleTextStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
        padding: 2,
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
    },
}

const mapStateToProps = (state, props) => {
    const {
        suggestionLink,
        suggestionText,
        suggestionType,
    } = getNewCommentByTab(state, props.pageId).tmpSuggestion
    const getGoalPageDetailByPageId = makeGetGoalPageDetailByPageId()
    const { pageId, goalId } = props
    const goalDetail = getGoalPageDetailByPageId(state, goalId, pageId)
    const { goal, goalPage } = goalDetail
    const { userId } = state.user
    const { tutorialText } = state.tutorials.goal_detail.goal_detail_page
    const ownerId = _.get(props, 'item.owner._id')
    const isOwnGoal =
        userId && ownerId && userId.toString() === ownerId.toString()

    return {
        suggestionLink,
        suggestionText,
        suggestionType,
        pageId,
        goalId,
        userId,
        tutorialText,
        isOwnGoal,
        goalDetail: goal,
    }
}

export default connect(mapStateToProps, {
    onSuggestionTextChange,
    updateSuggestionType,
    createSuggestion,
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
})(NeedStepSuggestion)
