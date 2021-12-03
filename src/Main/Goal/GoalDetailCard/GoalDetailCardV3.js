/** @format */
import _ from 'lodash'
import React from 'react'
import {
    Animated,
    Keyboard,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
} from 'react-native'
import { copilot } from 'react-native-copilot-gm'
import { DotIndicator } from 'react-native-indicators'
import { MenuProvider } from 'react-native-popup-menu'
import { connect } from 'react-redux'
import { SCREENS, wrapAnalytics } from '../../../monitoring/segment'

import {
    constructMenuName,
    getParentCommentId,
    switchCase,
} from '../../../redux/middleware/utils'
import {
    attachSuggestion,
    cancelSuggestion,
    createCommentForSuggestion,
    createCommentFromSuggestion,
    createSuggestion,
    openSuggestionModal,
    refreshComments,
    removeSuggestion,
    resetCommentType,
    updateNewComment,
} from '../../../redux/modules/feed/comment/CommentActions'

import { getUserData } from '../../../redux/modules/User/Selector'

import {
    getNewCommentByTab,
    makeGetCommentByEntityId,
} from '../../../redux/modules/feed/comment/CommentSelector'
import { svgMaskPath } from '../../Tutorial/Utils'
import { Icon } from '@ui-kitten/components'
// Actions
import {
    closeGoalDetail,
    closeGoalDetailWithoutPoping,
    editGoal,
    goalDetailSwitchTabV2,
    goalDetailSwitchTabV2ByKey,
    markGoalAsComplete,
    markUserViewGoal,
    refreshGoalDetailById,
    updateGoalItemsOrder,
} from '../../../redux/modules/goal/GoalDetailActions'
// selector
import {
    makeGetGoalPageDetailByPageId,
    makeGetGoalStepsAndNeedsV2,
} from '../../../redux/modules/goal/selector'
import {
    pauseTutorial,
    saveTutorialState,
    showNextTutorialPage,
    startTutorial,
    updateNextStepNumber,
} from '../../../redux/modules/User/TutorialActions'

// Styles
import { default_style, color } from '../../../styles/basic'
import { TABBAR_HEIGHT } from '../../../styles/Goal'

// Component
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import LoadingModal from '../../Common/Modal/LoadingModal'
import Tooltip from '../../Tutorial/Tooltip'
import CommentBox from '../Common/CommentBoxV2'
import SectionCardV2 from '../Common/SectionCardV2'
import GoalDetailSection from './GoalDetailSection'
import SuggestionModal from './SuggestionModal4'
import CommentCard from './Comment/CommentCard'
import LikeListModal from '../../Common/Modal/LikeListModal'
import EmptyResult from '../../Common/Text/EmptyResult'
import DraggableFlatList from 'react-native-draggable-flatlist'
import StepAndNeedCardV3 from './V3/StepAndNeedCardV3'
import NoCommentsToast from '../../../components/NoCommentsToast'
import NoStepsToast from '../../../components/NoStepsToast'
import { ScrollView } from 'react-native-gesture-handler'
import NoStepNeedToast from '../../Common/Toasts/NoStepNeedToast'

const DEBUG_KEY = '[ UI GoalDetailCardV3 ]'
const COMPONENT_NAME = 'goalDetail'

export class GoalDetailCardV3 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // Following are state for CommentBox
            bottomPadding: new Animated.Value(0),
            keyboardDidShow: false,
            goalCardzIndex: 2,
            // For initial state reset
            initialScrollToCommentReset: undefined, // Set to true after initial comment scroll is completed
            // TODO: merge LikeListModal for comment with the one for goal
            showCommentLikeList: false,
            likeListParentType: undefined,
            likeListParentId: undefined,
        }
        this._handleIndexChange = this._handleIndexChange.bind(this)
        this.onViewCommentPress = this.onViewCommentPress.bind(this)
        this.handleReplyTo = this.handleReplyTo.bind(this)
        this.keyboardWillShow = this.keyboardWillShow.bind(this)
        this.keyboardWillHide = this.keyboardWillHide.bind(this)
        this.handleScrollToCommentItem = this.handleScrollToCommentItem.bind(
            this
        )
        this.scrollToIndex = this.scrollToIndex.bind(this)
        this.handleHeadlineOnPressed = this.handleHeadlineOnPressed.bind(this)
        this.getFocusedItem = this.getFocusedItem.bind(this)
        this._renderItem = this._renderItem.bind(this)
        this._renderTabBar = this._renderTabBar.bind(this)

        this.commentBoxHeight = 100
        this.initialHandleReplayToTimeout = undefined // Initial timeout for handleReplayTo in componentDidMount
        this.initialCreateSuggestionTimeout = undefined // Initial timeout for showing suggestion modal
    }

    componentDidMount() {
        // Send request to mark user viewed this goal
        if (!this.props.isSelf) {
            this.props.markUserViewGoal(this.props.goalId)
        }
        this.keyboardWillShowListener = Keyboard.addListener(
            'keyboardWillShow',
            this.keyboardWillShow
        )
        this.keyboardWillHideListener = Keyboard.addListener(
            'keyboardWillHide',
            this.keyboardWillHide
        )

        // Listeners for tutorial
        this.props.copilotEvents.on('stop', () => {
            this.props.showNextTutorialPage('goal_detail', 'goal_detail_page')
            // Right now we don't need to have conditions here
            // this.props.saveTutorialState();
        })

        this.props.copilotEvents.on('stepChange', (step) => {
            const { name, order, visible, target, wrapper } = step
            // We showing current order. SO the next step should be order + 1
            this.props.updateNextStepNumber(
                'goal_detail',
                'goal_detail_page',
                order + 1
            )
        })

        // Start tutorial if not previously shown
        const willStartTutorial = !this.props.hasShown && this.props.isSelf
        if (willStartTutorial) {
            // TODO: @Jia Tutorial to uncomment
            setTimeout(() => {
                this.props.startTutorial('goal_detail', 'goal_detail_page')
            }, 400)
        }

        const { initial, goalDetail, goalId, pageId, tab } = this.props

        // On comment loaded, scroll to corresponding comment item if needed
        const refreshCommentsCallback =
            initial && initial.initialScrollToComment && initial.commentId
                ? () => this.handleScrollToCommentItem(initial.commentId)
                : undefined
        this.props.refreshComments(
            'Goal',
            goalId,
            tab,
            pageId,
            refreshCommentsCallback
        )

        if (initial && initial.refreshGoal !== false) {
            const onRefreshError = () => {
                if (this.initialHandleReplayToTimeout !== undefined) {
                    clearTimeout(this.initialHandleReplayToTimeout)
                }

                if (this.initialCreateSuggestionTimeout !== undefined) {
                    clearTimeout(this.initialCreateSuggestionTimeout)
                }
            }
            this.props.refreshGoalDetailById(
                goalId,
                pageId,
                onRefreshError.bind(this)
            )
        }
        if (
            initial &&
            !_.isEmpty(initial)
            // && !willStartTutorial
        ) {
            const {
                focusType,
                focusRef,
                initialShowSuggestionModal, // Boolean to determine if we show suggestion modal on open
                initialFocusCommentBox, // Boolean to determine if we focus on comment box initially
                initialShowGoalModal, // Boolean to determine if we open goal edition modal
                initialUnMarkGoalAsComplete, // Boolean to determine if we unmark a goal as complete
                initialMarkGoalAsComplete, // Boolean to determine if we mark a goal as complete
                showCaret, // Boolean to determine if we open caret on the top right for goal
            } = initial
            let newCommentParams = {
                commentDetail: {
                    parentType: 'Goal',
                    parentRef: goalDetail._id, // Goal ref
                    commentType: 'Comment',
                },
                suggestionForRef: focusRef, // Need or Step ref
                suggestionFor: focusType === 'need' ? 'Need' : 'Step',
            }
            // Open Create Goal Modal for edition
            if (initialShowGoalModal) {
                setTimeout(() => {
                    this.props.editGoal(goalDetail, pageId)
                }, 500)
                return
            }

            if (initialMarkGoalAsComplete) {
                this.props.markGoalAsComplete(goalId, true, pageId)
                return
            }

            if (initialUnMarkGoalAsComplete) {
                this.props.markGoalAsComplete(goalId, false, pageId)
                return
            }

            // Add needRef and stepRef for item
            if (focusType === 'need') {
                newCommentParams = _.set(
                    newCommentParams,
                    'commentDetail.needRef',
                    focusRef
                )
            }
            if (focusType === 'step') {
                newCommentParams = _.set(
                    newCommentParams,
                    'commentDetail.stepRef',
                    focusRef
                )
            }

            if (showCaret) {
                if (this.goalDetailSection !== undefined) {
                    setTimeout(() => {
                        this.goalDetailSection.openHeadlineMenu()
                    }, 300)
                }
            }

            // Timeout is required for tab view to finish transition
            setTimeout(() => {
                this.props.goalDetailSwitchTabV2ByKey(
                    'focusTab',
                    focusRef,
                    focusType,
                    goalId,
                    pageId
                )
                this.props.createCommentForSuggestion(newCommentParams, pageId)
                if (initialShowSuggestionModal) {
                    // Show suggestion modal if initialShowSuggestionModal is true
                    // Current source is NotificationNeedCard on suggestion pressed
                    console.log(`${DEBUG_KEY}: i am opening suggestion modal`)
                    this.initialCreateSuggestionTimeout = setTimeout(() => {
                        this.props.createSuggestion(goalId, pageId)
                    }, 500)
                }

                console.log(`${DEBUG_KEY}: initial is: `, initial)
                if (initialFocusCommentBox) {
                    // Focus on comment box if initialFocusCommentBox is true
                    // To reduce taps to enable comment functions
                    this.initialHandleReplayToTimeout = setTimeout(() => {
                        console.log(`${DEBUG_KEY}: calling handleReplyTo`)
                        this.handleReplyTo()
                    }, 500)
                }
            }, 100)
        }
        this.handleOnCommentSubmitEditing = this.handleOnCommentSubmitEditing.bind(
            this
        )
    }

    shouldComponentUpdate(nextProps) {
        return !_.isEqual(this.props, nextProps)
    }

    componentWillUnmount() {
        const { goalId, pageId } = this.props
        console.log(`${DEBUG_KEY}: unmounting goal: ${goalId}, page: ${pageId}`)
        this.keyboardWillShowListener.remove()
        this.keyboardWillHideListener.remove()
        this.props.closeGoalDetailWithoutPoping(goalId, pageId)

        // Remove tutorial listener
        this.props.copilotEvents.off('stop')
        this.props.copilotEvents.off('stepChange')

        // Reset the states for tutorial
        this.props.pauseTutorial('goal_detail', 'goal_detail_page', 0)
    }

    // Switch tab to FocusTab and display all the comments
    onViewCommentPress = () => {
        const { goalId, pageId } = this.props

        this.props.goalDetailSwitchTabV2ByKey(
            'focusTab',
            undefined,
            'comment',
            goalId,
            pageId
        )
    }

    // Can be replaced by memorized selector
    getFocusedItem(focusType, focusRef, goalDetail) {
        const type = focusType === 'step' ? 'steps' : 'needs'
        let focusedItem = { description: '', isCompleted: false }
        if (_.has(goalDetail, `${type}`)) {
            _.get(goalDetail, `${type}`).forEach((item) => {
                if (item._id === focusRef) {
                    focusedItem = _.cloneDeep(item)
                }
            })
        }
        return focusedItem
    }

    keyboardWillShow = (e) => {
        this.setState({
            goalCardzIndex: 0, // set the zIndex to enable scroll on the goal card
        })

        this.forceUpdate() // Force update to re-render

        Animated.parallel([
            Animated.timing(this.state.bottomPadding, {
                useNativeDriver: false,
                toValue: e.endCoordinates.height,
                duration: e.duration,
            }),
        ]).start()
    }

    keyboardWillHide = (e) => {
        this.setState({
            keyboardDidShow: false,
            goalCardzIndex: 2, // reset the zIndex to enable buttons on the goal card
        })

        // Force update to re-render
        // We should find a better way to solve this triggering reupdate
        this.forceUpdate()

        Animated.parallel([
            Animated.timing(this.state.bottomPadding, {
                useNativeDriver: false,
                toValue: 0,
                duration: e.duration,
            }),
        ]).start()
    }

    /**
     * Scroll to a comment item from wherever
     */
    handleScrollToCommentItem = (commentId) => {
        this._handleIndexChange(1, 'comment', undefined)
        const { originalComments, data, tab, pageId, goalId } = this.props

        const parentCommentId = getParentCommentId(
            commentId,
            originalComments,
            { navigationTab: tab, pageId, entityId: goalId }
        )
        if (!parentCommentId) return // Do nothing since it's no loaded. Defensive coding

        const parentCommentIndex = data.findIndex(
            (c) => c._id === parentCommentId
        )

        setTimeout(() => {
            this.scrollToIndex(parentCommentIndex)
            this.setState({
                // Initial scrollToComment has completed. Reset all related params including
                // initialNumberToRender for focus tab
                initialScrollToCommentReset: true,
            })
        }, 300)
    }

    handleReplyTo = (type) => {
        this.setState({
            keyboardDidShow: true,
        })
        if (this.commentBox !== undefined) {
            // TODO scroll to bottom of comments
            this.commentBox.focus(type)
        }
    }

    handleOnCommentSubmitEditing = () => {
        const { focusType } = this.props.navigationState
        const { newComment } = this.props
        if (
            newComment &&
            newComment.contentText &&
            !_.isEmpty(newComment.contentText)
        )
            return

        // Since the contentText is empty, reset the replyToRef and commentType
        // Update new comment
        const newCommentType =
            focusType === 'comment' ? 'Comment' : 'Suggestion'
        let commentToReturn = _.cloneDeep(newComment)
        commentToReturn = _.set(commentToReturn, 'replyToRef', undefined)
        commentToReturn = _.set(commentToReturn, 'commentType', newCommentType)
        this.props.updateNewComment(commentToReturn, this.props.pageId)
    }

    /**
     * Tab related handlers
     * focusType: ['comment', 'need', 'step']
     */
    _handleIndexChange = (index, focusType, focusRef) => {
        // TODO: change to v2
        const { navigationState, pageId, goalId } = this.props
        if (navigationState.routes[index].key === 'centralTab') {
            // Remove suggestion for the previous focused item
            this.props.removeSuggestion(pageId)
            this.props.goalDetailSwitchTabV2ByKey(
                'centralTab',
                undefined,
                undefined,
                goalId,
                pageId
            )
            return
        } else {
            this.props.goalDetailSwitchTabV2ByKey(
                'focusTab',
                focusRef,
                focusType,
                goalId,
                pageId
            )
        }
    }

    scrollToIndex = (index, viewOffset = 0, animated = true) => {
        if (this.flatList)
            this.flatList.scrollToIndex({
                index,
                animated,
                viewPosition: 1,
                viewOffset,
            })
    }

    handleHeadlineOnPressed = (focusType, focusRef) => {
        // Scroll to top without animation
        this.scrollToIndex(0, 0, false)
        // Switch to the focused item
        this._handleIndexChange(1, focusType, focusRef)
    }

    openCommentLikeList = (likeListParentType, likeListParentId) => {
        this.setState({
            showCommentLikeList: true,
            likeListParentType,
            likeListParentId,
        })
    }

    closeCommentLikeList = () => {
        this.setState({
            showCommentLikeList: false,
            likeListParentId: undefined,
            likeListParentType: undefined,
        })
    }

    _renderItem(props) {
        const {
            goalDetail,
            navigationState,
            pageId,
            isSelf,
            goalId,
        } = this.props

        const { routes, index } = navigationState
        switch (routes[index].key) {
            case 'centralTab': {
                const { item, index } = props

                let newCommentParams = {
                    commentDetail: {
                        parentType: 'Goal',
                        parentRef: goalDetail._id, // Goal ref
                        commentType: 'Comment',
                    },
                    suggestionForRef: item._id, // Need or Step ref
                    suggestionFor: item.type === 'need' ? 'Need' : 'Step',
                }

                if (item.type === 'need') {
                    newCommentParams = _.set(
                        newCommentParams,
                        'commentDetail.needRef',
                        item._id
                    )
                } else if (item.type === 'step') {
                    newCommentParams = _.set(
                        newCommentParams,
                        'commentDetail.stepRef',
                        item._id
                    )
                }
                return (
                    <>
                        <StepAndNeedCardV3
                            key={`mastermind-${index}`}
                            item={item}
                            // goalRef={goalDetail}
                            onCardPress={() => {
                                // Use passed in function to handle tab switch with animation
                                this._handleIndexChange(1, item.type, item._id)
                                this.props.createCommentForSuggestion(
                                    newCommentParams,
                                    pageId
                                )
                            }}
                            isSelf={this.props.isSelf}
                            count={item.count}
                            pageId={pageId}
                            goalId={goalId}
                            drag={isSelf ? props.drag : null}
                            isActive={props.isActive}
                            onEdit={() => {
                                this.scrollToIndex(index)
                            }}
                        />
                    </>
                )
            }
            case 'focusTab':
                return (
                    <CommentCard
                        key={`comment-${props.index}`}
                        item={props.item}
                        index={props.index}
                        commentDetail={{
                            parentType: 'Goal',
                            parentRef: goalDetail._id,
                        }}
                        goalRef={goalDetail}
                        scrollToIndex={this.scrollToIndex}
                        onCommentClicked={this.handleReplyTo}
                        reportType="detail"
                        pageId={this.props.pageId}
                        entityId={this.props.goalId}
                        goalId={this.props.goalId}
                        onHeadlinePressed={this.handleHeadlineOnPressed}
                        openCommentLikeList={this.openCommentLikeList}
                    />
                )
            default:
                return null
        }
    }

    _renderTabBar() {
        const { goalDetail, goalId, pageId } = this.props
        return (
            <>
                <Animated.View
                    style={{
                        zIndex: this.state.goalCardzIndex,
                        backgroundColor: 'white',
                    }}
                >
                    <GoalDetailSection
                        onRef={(ref) => {
                            this.goalDetailSection = ref
                        }}
                        item={goalDetail}
                        onSuggestion={() => {
                            const {
                                navigationState,
                                pageId,
                                goalId,
                            } = this.props
                            const { routes, index } = navigationState
                            if (routes[index].key === 'centralTab') {
                                // Goes to central tab by opening all comments
                                this.props.goalDetailSwitchTabV2ByKey(
                                    'focusTab',
                                    undefined,
                                    'comment',
                                    goalId,
                                    pageId
                                )
                            }
                            setTimeout(() => this.handleReplyTo(), 200)
                        }}
                        onViewAllComments={this.onViewCommentPress}
                        isSelf={this.props.isSelf}
                        pageId={pageId}
                        goalId={goalId}
                        menuName={constructMenuName(
                            COMPONENT_NAME,
                            this.props.pageId
                        )}
                    />

                    {this.renderFocusedItem()}

                    {this.renderCommentCTR()}
                </Animated.View>
            </>
        )
    }

    _keyExtractor = (item) => item._id

    handleRefresh = () => {
        const { goalId, pageId, tab, goalDetail, displayGoals } = this.props

        if (displayGoals) {
            this.props.refreshGoalDetailById(goalDetail._id, pageId)
        } else {
            this.props.refreshComments('Goal', goalId, tab, pageId)
        }
    }

    /**
     * Render focused item.
     */
    renderFocusedItem() {
        const { goalDetail, navigationState } = this.props
        const { focusType, focusRef } = navigationState
        if (!focusType) return null
        const focusedItem = this.getFocusedItem(focusType, focusRef, goalDetail)

        return (
            <View style={{ zIndex: 2, flex: 1 }}>
                <SectionCardV2
                    type={focusType}
                    goalRef={goalDetail}
                    item={focusedItem}
                    isFocusedItem
                    isSelf={this.props.isSelf}
                    onBackPress={() => this._handleIndexChange(0)}
                    count={this.props.focusedItemCount}
                    pageId={this.props.pageId}
                    goalId={this.props.goalId}
                />
            </View>
        )
    }

    // Entry points to open comment subcomponent
    renderCommentCTR() {
        const { goalDetail, navigationState } = this.props
        const { commentCount } = goalDetail
        const { focusType } = navigationState
        if (focusType) return null
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={{
                    backgroundColor: color.GM_CARD_BACKGROUND,
                    borderBottomWidth: 0.5,
                    borderColor: '#e5e5e5',
                    minHeight: TABBAR_HEIGHT,
                }}
                onPress={this.onViewCommentPress}
                testID="button-view-all-comments"
            >
                <View
                    style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        backgroundColor: 'white',
                        flex: 1,
                        paddingLeft: 16,
                    }}
                >
                    <Text
                        style={{
                            ...default_style.smallTitle_1,
                            flex: 1,
                            color: 'black',
                            marginTop: 4,
                        }}
                    >
                        View{commentCount > 2 ? ' all' : ''}
                        {commentCount > 0 && ` ${commentCount}`}
                        {commentCount == 1 ? ' reply' : ' replies'}
                    </Text>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={this.onViewCommentPress}
                        style={{
                            marginRight: 16,
                            backgroundColor: color.GM_BLUE,
                            borderRadius: 100,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Icon
                            name="chevron-right"
                            pack="material-community"
                            style={{
                                ...default_style.buttonIcon_1,
                                tintColor: 'white',
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    renderCommentBox(focusType, pageId) {
        if (!focusType) return null
        const resetCommentTypeFunc =
            focusType === 'comment'
                ? () => this.props.resetCommentType('Comment', pageId)
                : () => this.props.resetCommentType('Suggestion', pageId)

        return (
            <Animated.View
                style={[
                    styles.composerContainer,
                    {
                        paddingBottom: this.state.bottomPadding,
                    },
                ]}
            >
                <View
                    onLayout={({ nativeEvent }) =>
                        (this.commentBoxHeight = nativeEvent.layout.height + 10)
                    }
                >
                    <CommentBox
                        onRef={(ref) => {
                            this.commentBox = ref
                        }}
                        hasSuggestion
                        onSubmitEditing={this.handleOnCommentSubmitEditing}
                        resetCommentType={resetCommentTypeFunc}
                        initial={this.props.initial}
                        pageId={this.props.pageId}
                        goalId={this.props.goalId}
                    />
                </View>
            </Animated.View>
        )
    }

    renderEmptyListComponent = (focus) => {
        if (!this.props.isSelf && focus === 'comment') {
            return <NoCommentsToast name={this.props.name} />
        } else if (this.props.self && focus == undefined) {
            return <NoStepsToast />
        } else if (!this.props.self && focus == undefined) {
            return <NoStepNeedToast />
        } else {
            return (
                <EmptyResult
                    testID="focus-tab-empty-result"
                    text={switchCaseEmptyText(focus)}
                    textStyle={{ paddingTop: 70 }}
                />
            )
        }
    }

    renderFlatList() {
        const {
            goalDetail,
            navigationState,
            data,
            initial,
            displayGoals,
        } = this.props
        console.log('GOlaDetailcard data', data)

        const { focusType } = navigationState

        const initialScrollToComment =
            initial &&
            initial.initialScrollToComment &&
            initial.commentId &&
            !this.state.initialScrollToCommentReset
        const totalCommentCount =
            goalDetail && goalDetail.commentCount
                ? goalDetail.commentCount
                : 100

        return (
            <DraggableFlatList
                ref={(ref) => {
                    if (ref && ref.containerRef)
                        this.flatList = ref.flatlistRef.current
                }}
                ListHeaderComponent={this._renderTabBar()}
                data={data}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                refreshing={this.props.loading}
                onRefresh={this.handleRefresh}
                ListEmptyComponent={
                    this.props.loading
                        ? null
                        : this.renderEmptyListComponent(focusType)
                }
                initialNumToRender={
                    displayGoals
                        ? undefined
                        : initialScrollToComment
                        ? totalCommentCount
                        : 5
                }
                onDragEnd={(e) => {
                    // This function is tightly coupled with implementation of makeGetGoalStepsAndNeedsV2 selector function
                    let type = 'needs'
                    let to = e.to
                    let from = e.from

                    // Find the type of item to be swapped and it's index
                    if (e.from <= goalDetail.steps.length) {
                        to -= 1
                        from -= 1
                        type = 'steps'
                    } else {
                        to -= 3 + goalDetail.steps.length
                        from -= 3 + goalDetail.steps.length
                    }

                    // Return if user is trying move steps/needs in wrong place
                    if (
                        e.to === e.from ||
                        e.to === 0 ||
                        (type === 'steps' && e.to > goalDetail.steps.length) ||
                        (type === 'needs' &&
                            e.to <= goalDetail.steps.length + 1)
                    )
                        return

                    const item = this.props.data.splice(e.from, 1)
                    this.props.data.splice(e.to, 0, item)
                    this.props.updateGoalItemsOrder(
                        type,
                        from,
                        to,
                        goalDetail,
                        this.props.pageId
                    )
                }}
            />
        )
    }

    render() {
        const {
            goalDetail,
            navigationState,
            pageId,
            goalId,
            displayGoals,
        } = this.props
        if (!goalDetail || _.isEmpty(goalDetail)) return null

        const { focusType, focusRef } = navigationState

        return (
            <>
                <MenuProvider
                    customStyles={{ backdrop: styles.backdrop }}
                    skipInstanceCheck={true}
                >
                    <LikeListModal
                        isVisible={this.state.showCommentLikeList}
                        closeModal={this.closeCommentLikeList}
                        parentId={this.state.likeListParentId}
                        parentType={this.state.likeListParentType}
                        clearDataOnHide
                    />
                    <View style={styles.containerStyle}>
                        <LoadingModal
                            visible={this.props.updating}
                            customIndicator={
                                <DotIndicator size={12} color="white" />
                            }
                        />
                        <SearchBarHeader
                            backButton
                            title="Goal"
                            onBackPress={() =>
                                this.props.closeGoalDetail(goalId, pageId)
                            }
                        />

                        <KeyboardAvoidingView
                            style={[
                                styles.containerStyle,
                                {
                                    paddingBottom: displayGoals
                                        ? 0
                                        : this.commentBoxHeight,
                                },
                            ]}
                            behavior={'height'}
                        >
                            {this.renderFlatList()}
                        </KeyboardAvoidingView>

                        <SuggestionModal
                            visible={this.props.showSuggestionModal}
                            onCancel={() => {
                                // Programmatically focus textinput to avoid floating input bug
                                this.handleReplyTo()
                                this.props.cancelSuggestion(pageId)
                            }}
                            onAttach={() => {
                                // Programmatically focus textinput to avoid floating input bug
                                this.handleReplyTo()
                                this.props.attachSuggestion(
                                    goalDetail,
                                    focusType,
                                    focusRef,
                                    pageId
                                )
                            }}
                            pageId={this.props.pageId}
                            goalId={this.props.goalId}
                            item={goalDetail}
                        />
                        {this.renderCommentBox(focusType, pageId)}

                        {/** <Report showing={this.props.showingModalInDetail} /> */}
                    </View>
                </MenuProvider>
            </>
        )
    }
}

const styles = StyleSheet.create({
    composerContainer: {
        backgroundColor: 'white',
        zIndex: 3,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    containerStyle: {
        backgroundColor: color.GM_CARD_BACKGROUND,
        flex: 1,
    },
    nextIconContainer: {},
    nextIcon: {},
    iconStyle: {
        alignSelf: 'center',
        fontSize: 20,
        marginLeft: 5,
        marginTop: 2,
    },
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.5,
    },
})

const makeMapStateToProps = () => {
    const getGoalPageDetailByPageId = makeGetGoalPageDetailByPageId()
    const getGoalStepsAndNeedsV2 = makeGetGoalStepsAndNeedsV2()
    const getCommentByEntityId = makeGetCommentByEntityId()

    const mapStateToProps = (state, props) => {
        const { pageId, goalId } = props
        const newComment = getNewCommentByTab(state, pageId)

        const goalDetail = getGoalPageDetailByPageId(state, goalId, pageId)

        const { goal, goalPage } = goalDetail
        const { owner } = goal
        const name = owner?.name
        const { navigationStateV2, updating } = goalPage
        const { showingModalInDetail } = state.report
        const { userId, user } = state.user

        const userObject = getUserData(state, userId, '')
        const { mutualFriends, friendship } = userObject

        const isSelf = userId === _.get(goal, 'owner._id', '')

        const comments = getCommentByEntityId(state, goalId, pageId)

        const { data, transformedComments, loading } = comments || {
            transformedComments: [],
            loading: false,
            data: [],
        }
        const { focusType, focusRef } = navigationStateV2
        const focusedItemCount = getFocusedItemCount(
            transformedComments,
            focusType,
            focusRef
        )

        let items = [{}]
        let itemsLoading = false
        const { routes, index } = navigationStateV2
        switch (routes[index].key) {
            case 'centralTab': {
                items = getGoalStepsAndNeedsV2(state, goalId, pageId, {
                    isSelf,
                })
                if (goalPage) itemsLoading = goalPage.loading
                break
            }
            case 'focusTab': {
                items = transformedComments
                itemsLoading = !!loading
                if (focusType === 'step' || focusType === 'need') {
                    items = items.filter((comment) => {
                        const isSuggestionForFocusRef =
                            comment.suggestion &&
                            comment.suggestion.suggestionForRef &&
                            comment.suggestion.suggestionForRef === focusRef
                        const isCommentForFocusRef =
                            _.get(comment, `${focusType}Ref`) === focusRef

                        if (isSuggestionForFocusRef || isCommentForFocusRef) {
                            return true
                        }
                        return false
                    })
                }
                break
            }
        }
        const displayGoals = routes[index].key === 'centralTab'

        // Tutorial related
        const {
            tutorialText,
            hasShown,
            showTutorial,
        } = state.tutorials.goal_detail.goal_detail_page

        return {
            displayGoals,
            loading: itemsLoading,
            data: items,
            name, // Focused Goal User Name
            originalComments: data, // All comments in raw form
            goalDetail: goal,
            navigationState: navigationStateV2,
            showingModalInDetail,
            showSuggestionModal: newComment
                ? newComment.showSuggestionModal
                : false,
            isSelf,
            tab: state.navigation.tab,
            // When on focusTab, show the count for focusedItem
            focusedItemCount,
            updating,
            newComment,
            focusType,
            focusRef,
            // Tutorial related
            tutorialText,
            hasShown,
            showTutorial,
            user,
            friendship,
        }
    }

    return mapStateToProps
}

const getFocusedItemCount = (comments, focusType, focusRef) => {
    // Initialize data by all comments
    const refPath = focusType === 'need' ? 'needRef' : 'stepRef'
    let rawComments = comments
    let focusedItemCount = 0
    if (focusType === 'step' || focusType === 'need') {
        // TODO: grab comments by step, filter by typeRef
        rawComments = rawComments.filter((comment) => {
            // Check if a comment is a suggestion for a step or a need
            const isSuggestionForFocusRef =
                comment.suggestion &&
                comment.suggestion.suggestionForRef &&
                comment.suggestion.suggestionForRef === focusRef

            // Check if a comment is a comment for a step or a need
            const isCommentForFocusRef =
                _.get(comment, `${refPath}`) === focusRef
            if (isCommentForFocusRef || isSuggestionForFocusRef) {
                return true
            }
            return false
        })

        rawComments.forEach((c) => {
            if (c.childComments && c.childComments.length > 0) {
                // Count all the childComments
                focusedItemCount += c.childComments.length
            }
            // Count the current comment
            focusedItemCount += 1
        })
    }

    if (focusType === 'comment') {
        focusedItemCount = rawComments.length
    }

    return focusedItemCount
}

const switchCaseEmptyText = (type) =>
    switchCase({
        comment: 'No Comments',
        step: 'No suggestions for this step',
        need: 'No suggestions for this need',
    })('No Steps or Needs')(type)

// Analytics must be the inner most wrapper
GoalDetailCardV3 = wrapAnalytics(GoalDetailCardV3, SCREENS.GOAL_DETAIL)

const GoalDetailCardV3Explained = copilot({
    overlay: 'svg', // or 'view'
    animated: true, // or false
    stepNumberComponent: () => <View />,
    tooltipComponent: Tooltip,
    svgMaskPath: svgMaskPath,
})(GoalDetailCardV3)

export default connect(makeMapStateToProps, {
    closeGoalDetail,
    closeGoalDetailWithoutPoping,
    attachSuggestion,
    cancelSuggestion,
    openSuggestionModal,
    goalDetailSwitchTabV2,
    goalDetailSwitchTabV2ByKey,
    removeSuggestion,
    createCommentFromSuggestion,
    resetCommentType,
    updateNewComment,
    createCommentForSuggestion,
    createSuggestion,
    editGoal,
    markGoalAsComplete,
    refreshGoalDetailById,
    refreshComments,
    markUserViewGoal,
    updateGoalItemsOrder,
    // Tutorial related
    showNextTutorialPage,
    startTutorial,
    updateNextStepNumber,
    pauseTutorial,
    saveTutorialState,
})(GoalDetailCardV3Explained)
