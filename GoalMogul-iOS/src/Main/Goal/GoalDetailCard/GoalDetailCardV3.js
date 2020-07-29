/** @format */

import Constants from 'expo-constants'
import _ from 'lodash'
import React, { Component } from 'react'
import {
    Animated,
    Dimensions,
    Image,
    Keyboard,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { copilot } from 'react-native-copilot-gm'
import { DotIndicator } from 'react-native-indicators'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { MenuProvider } from 'react-native-popup-menu'
import { TabView } from 'react-native-tab-view'
import { connect } from 'react-redux'

import {
    constructMenuName,
    getParentCommentId,
} from '../../../redux/middleware/utils'
import { Logger } from '../../../redux/middleware/utils/Logger'
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
import {
    getNewCommentByTab,
    makeGetCommentByEntityId,
} from '../../../redux/modules/feed/comment/CommentSelector'
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
import { svgMaskPath } from '../../Tutorial/Utils'
import CommentBox from '../Common/CommentBoxV2'
import SectionCardV2 from '../Common/SectionCardV2'
import GoalDetailSection from './GoalDetailSection'
import SuggestionModal from './SuggestionModal3'
import CentralTab from './V3/CentralTab'
import FocusTab from './V3/FocusTab'
import { SCREENS, wrapAnalytics } from '../../../monitoring/segment'
import { Icon } from '@ui-kitten/components'

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
}

const HEADER_HEIGHT = 240 // Need to be calculated in the state later based on content length
const COLLAPSED_HEIGHT = TABBAR_HEIGHT + Constants.statusBarHeight
const DEBUG_KEY = '[ UI GoalDetailCardV3 ]'

// const COMMENTBOX_HEIGHT = 43;
const TOTAL_HEIGHT = TABBAR_HEIGHT
const COMPONENT_NAME = 'goalDetail'

export class GoalDetailCardV3 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            scroll: new Animated.Value(0),
            // Following are state for CommentBox
            position: 'absolute',
            commentBoxPadding: new Animated.Value(0),
            contentBottomPadding: new Animated.Value(0),
            keyboardDidShow: false,
            cardHeight: HEADER_HEIGHT,
            centralTabContentOffset: 0,
            goalCardzIndex: 2,
            // For card width
            goalDetailSectionHeight: HEADER_HEIGHT, // TODO: Update to the bareminimum height
            focusedItemHeight: 48, // Default height we use right now
            // For initial state reset
            initialScrollToCommentReset: undefined, // Set to true after initial comment scroll is completed
        }
        this.onContentSizeChange = this.onContentSizeChange.bind(this)
        this._renderScene = this._renderScene.bind(this)
        this._renderTabBar = this._renderTabBar.bind(this)
        this._handleIndexChange = this._handleIndexChange.bind(this)
        this.onViewCommentPress = this.onViewCommentPress.bind(this)
        this.handleReplyTo = this.handleReplyTo.bind(this)
        this.getFocusedItem = this.getFocusedItem.bind(this)
        this.keyboardWillShow = this.keyboardWillShow.bind(this)
        this.keyboardWillHide = this.keyboardWillHide.bind(this)
        this.handleScrollToCommentItem = this.handleScrollToCommentItem.bind(
            this
        )
        this.focusTab = undefined
        this.initialHandleReplayToTimeout = undefined // Initial timeout for handleReplayTo in componentDidMount
        this.initialCreateSuggestionTimeout = undefined // Initial timeout for showing suggestion modal
    }

    componentDidUpdate(prevProps) {
        // if (!this.props.hasShown && !prevProps.showTutorial && this.props.showTutorial === true) {
        //     console.log(`${DEBUG_KEY}: [ componentDidUpdate ]: tutorial start: `, this.props.nextStepNumber);
        //     this.goalDetailSection.openHeadlineMenu();
        //     setTimeout(() => {
        //         this.props.start();
        //     }, 500);
        // }
    }

    componentDidMount() {
        // Send request to mark user viewed this goal
        if (!this.props.isSelf) {
            this.props.markUserViewGoal(this.props.goalId)
        }

        this.state.scroll.addListener(({ value }) => {
            this._value = value
        })
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
            console.log(
                `${DEBUG_KEY}: [ componentDidMount ]: [ copilotEvents ] 
        tutorial stop. show next page. Next step number is: `,
                this.props.nextStepNumber
            )

            this.props.showNextTutorialPage('goal_detail', 'goal_detail_page')

            // Right now we don't need to have conditions here
            // this.props.saveTutorialState();
        })

        this.props.copilotEvents.on('stepChange', (step) => {
            const { name, order, visible, target, wrapper } = step
            console.log(
                `${DEBUG_KEY}: [ onStepChange ]: step order: ${order}, step visible: ${name} `
            )

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

        console.log(
            `${DEBUG_KEY}: did mount with goalId: ${goalId}, pageId: ${pageId}`
        )
        if (initial && !_.isEmpty(initial) && !willStartTutorial) {
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

    shouldComponentUpdate(nextProps, nextState) {
        // console.log(`${DEBUG_KEY}: next props are: `, nextProps);
        return !_.isEqual(this.props, nextProps)
    }

    componentWillUnmount() {
        const { goalId, pageId } = this.props
        console.log(`${DEBUG_KEY}: unmounting goal: ${goalId}, page: ${pageId}`)
        this.keyboardWillShowListener.remove()
        this.keyboardWillHideListener.remove()
        this.state.scroll.removeAllListeners()
        this.props.closeGoalDetailWithoutPoping(goalId, pageId)

        // Remove tutorial listener
        this.props.copilotEvents.off('stop')
        this.props.copilotEvents.off('stepChange')

        // Reset the states for tutorial
        this.props.pauseTutorial('goal_detail', 'goal_detail_page', 0)
    }

    // Switch tab to FocusTab and display all the comments
    onViewCommentPress = () => {
        console.log(`${DEBUG_KEY}: User opens all comments.`)
        const { goalId, pageId } = this.props
        this.setState({
            ...this.state,
            centralTabContentOffset: this.state.scroll._value,
        })

        this.props.goalDetailSwitchTabV2ByKey(
            'focusTab',
            undefined,
            'comment',
            goalId,
            pageId
        )
        Animated.timing(this.state.scroll, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start()
    }

    /**
     * Handle on GoalDetailSection content size change to update the height
     * @param {*} type: ['goalDetailSectionCard', 'focusedItem', 'allCommentItem']
     * @param {*} cardHeight
     */
    onContentSizeChange(type, event) {
        // console.log('new card height: ', cardHeight);
        const { height } = event.nativeEvent.layout
        const { focusType } = this.props.navigationState

        let {
            goalDetailSectionHeight,
            focusedItemHeight,
            cardHeight,
        } = this.state

        if (type === 'goalDetailSectionCard') {
            if (height === goalDetailSectionHeight) return
            goalDetailSectionHeight = height
        }

        // Don't update if it's currently not on focused tab
        if (type === 'focusedItem' && focusType !== undefined) {
            if (height === focusedItemHeight) return
            focusedItemHeight = height
        }

        // Don't update if it's currently not on all comment item
        if (type === 'allCommentItem' && focusType === undefined) {
            if (height === focusedItemHeight) return
            focusedItemHeight = height
        }

        const newCardHeight = goalDetailSectionHeight + focusedItemHeight
        Logger.log(
            `${DEBUG_KEY}: [onContentSizeChange]: height: ${height}, type: ${type}`,
            {},
            2
        )

        this.setState(
            {
                ...this.state,
                cardHeight: newCardHeight,
                goalDetailSectionHeight,
                focusedItemHeight,
            },
            () => {
                Logger.log(
                    `${DEBUG_KEY}: [onContentSizeChange]: total new height: ${newCardHeight}, old height: ${cardHeight}`,
                    {},
                    2
                )
                if (cardHeight !== newCardHeight) {
                    this.forceUpdate()
                }
            }
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
        // console.log(`${DEBUG_KEY}: [ ${this.props.pageId} ]: keyboard will show`);
        // console.log(`${DEBUG_KEY}: [ ${this.props.pageId} ]: ${Actions.currentScene}`);

        this.setState({
            ...this.state,
            goalCardzIndex: 0, // set the zIndex to enable scroll on the goal card
        })

        this.forceUpdate() // Force update to re-render

        const timeout = (TOTAL_HEIGHT * 210) / e.endCoordinates.height
        Animated.sequence([
            Animated.delay(timeout),
            Animated.parallel([
                Animated.timing(this.state.commentBoxPadding, {
                    toValue:
                        e.endCoordinates.height -
                        TOTAL_HEIGHT -
                        getBottomSpace(),
                    duration: 210 - timeout,
                }),
                Animated.timing(this.state.contentBottomPadding, {
                    toValue:
                        e.endCoordinates.height -
                        TOTAL_HEIGHT -
                        getBottomSpace(),
                    duration: 210 - timeout,
                }),
            ]),
        ]).start()
    }

    keyboardWillHide = () => {
        // console.log(`${DEBUG_KEY}: [ ${this.props.pageId} ]: keyboard will hide`);
        this.setState({
            ...this.state,
            keyboardDidShow: false,
            goalCardzIndex: 2, // reset the zIndex to enable buttons on the goal card
        })

        // Force update to re-render
        // We should find a better way to solve this triggering reupdate
        this.forceUpdate()

        Animated.parallel([
            Animated.timing(this.state.commentBoxPadding, {
                toValue: 0,
                duration: 210,
            }),
            Animated.timing(this.state.contentBottomPadding, {
                toValue: 0,
                duration: 210,
            }),
        ]).start()
    }

    /**
     * Scroll to a comment item from wherever
     */
    handleScrollToCommentItem = (commentId) => {
        this._handleIndexChange(1, 'comment', undefined)
        const { originalComments, comments } = this.props

        Logger.log(
            `${DEBUG_KEY}: [ handleScrollToCommentItem ]: originalComments`,
            originalComments,
            2
        )
        const parentCommentId = getParentCommentId(commentId, originalComments)

        Logger.log(
            `${DEBUG_KEY}: [ handleScrollToCommentItem ]: commentId`,
            commentId,
            2
        )
        if (!parentCommentId) return // Do nothing since it's no loaded. Defensive coding

        Logger.log(
            `${DEBUG_KEY}: [ handleScrollToCommentItem ]: parentCommentId`,
            parentCommentId,
            2
        )
        const parentCommentIndex = comments.findIndex(
            (c) => c._id === parentCommentId
        )
        if (this.focusTab === undefined || parentCommentIndex === -1) return

        Logger.log(
            `${DEBUG_KEY}: [ handleScrollToCommentItem ]: parentCommentIndex`,
            parentCommentIndex,
            2
        )
        setTimeout(() => {
            this.focusTab.scrollToIndex(parentCommentIndex)
            this.setState({
                ...this.state,
                // Initial scrollToComment has completed. Reset all related params including
                // initialNumberToRender for focus tab
                initialScrollToCommentReset: true,
            })
        }, 500)
    }

    handleReplyTo = (type) => {
        this.setState({
            ...this.state,
            keyboardDidShow: true,
        })
        if (this.commentBox !== undefined) {
            console.log(
                `${DEBUG_KEY}: [ ${this.props.pageId} ]: [ handleReplyTo ]`
            )
            this.commentBox.focus(type)
        } else {
            console.warn(
                `${DEBUG_KEY}: [ handleReplyTo ] this.commentBox is undefined!`
            )
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

        if (!newComment) {
            console.warn(
                `${DEBUG_KEY}: [ handleOnCommentSubmitEditing ]: newComment is undefined. Something is wrong.`
            )
        }
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
            Animated.timing(this.state.scroll, {
                toValue: this.state.centralTabContentOffset,
                duration: 450,
                useNativeDriver: true,
            }).start()
            return
        }

        // Only record the scroll if we are switching tab.
        // This method can be called in the same tab
        if (navigationState && navigationState.index !== index) {
            this.setState({
                ...this.state,
                centralTabContentOffset: this.state.scroll._value,
            })
        }

        this.props.goalDetailSwitchTabV2ByKey(
            'focusTab',
            focusRef,
            focusType,
            goalId,
            pageId
        )

        Animated.timing(this.state.scroll, {
            toValue: new Animated.Value(0),
            duration: 300,
            useNativeDriver: true,
        }).start()
    }

    _renderScene = ({ route }) => {
        switch (route.key) {
            case 'centralTab':
                return (
                    <CentralTab
                        testID="goal-detail-card-central-tab"
                        onScroll={
                            this.props.isSelf
                                ? (offset) => {
                                      if (this.state.scroll)
                                          this.state.scroll.setValue(offset)
                                  }
                                : Animated.event(
                                      [
                                          {
                                              nativeEvent: {
                                                  contentOffset: {
                                                      y: this.state.scroll,
                                                  },
                                              },
                                          },
                                      ],
                                      { useNativeDriver: true }
                                  )
                        }
                        contentContainerStyle={{
                            paddingTop: this.state.cardHeight,
                            flexGrow: 1,
                            backgroundColor: '#F2F2F2',
                        }}
                        bottomOffset={this.state.contentBottomPadding}
                        isSelf={this.props.isSelf}
                        handleIndexChange={this._handleIndexChange}
                        pageId={this.props.pageId}
                        goalId={this.props.goalId}
                    />
                )

            case 'focusTab':
                return (
                    <FocusTab
                        // testID="goal-detail-card-focus-tab"
                        onRef={(ref) => {
                            this.focusTab = ref
                        }}
                        onScroll={Animated.event(
                            [
                                {
                                    nativeEvent: {
                                        contentOffset: { y: this.state.scroll },
                                    },
                                },
                            ],
                            { useNativeDriver: true }
                        )}
                        contentContainerStyle={{
                            paddingTop: this.state.cardHeight,
                            flexGrow: 1,
                        }}
                        paddingBottom={this.state.contentBottomPadding}
                        pageId={this.props.pageId}
                        goalId={this.props.goalId}
                        handleReplyTo={this.handleReplyTo}
                        isSelf={this.props.isSelf}
                        handleIndexChange={this._handleIndexChange}
                        initial={this.props.initial}
                        initialScrollToCommentReset={
                            this.state.initialScrollToCommentReset
                        }
                    />
                )

            default:
                return null
        }
    }

    _renderTabBar = (props) => {
        const translateY = this.state.scroll.interpolate({
            inputRange: [0, this.state.cardHeight - COLLAPSED_HEIGHT],
            outputRange: [0, -(this.state.cardHeight - COLLAPSED_HEIGHT)],
            extrapolate: 'clamp',
        })

        const { goalDetail, goalId, pageId } = this.props
        return (
            <Animated.View
                style={[
                    styles.header,
                    {
                        transform: [{ translateY }],
                        zIndex: this.state.goalCardzIndex,
                    },
                ]}
            >
                <View
                    style={{
                        height: this.state.cardHeight,
                        backgroundColor: 'white',
                    }}
                >
                    <GoalDetailSection
                        onRef={(ref) => {
                            this.goalDetailSection = ref
                        }}
                        item={goalDetail}
                        onSuggestion={() => {
                            // Goes to central tab by opening all comments
                            this.props.goalDetailSwitchTabV2ByKey(
                                'focusTab',
                                undefined,
                                'comment',
                                goalId,
                                pageId
                            )
                            setTimeout(() => {
                                console.log(
                                    `${DEBUG_KEY}: [ UI GoalDetailSectoin ]: calling handleReplyTo from onSuggestion`
                                )
                                this.handleReplyTo()
                            }, 500)
                        }}
                        onViewAllComments={this.onViewCommentPress}
                        isSelf={this.props.isSelf}
                        onContentSizeChange={this.onContentSizeChange}
                        pageId={pageId}
                        goalId={goalId}
                        menuName={constructMenuName(
                            COMPONENT_NAME,
                            this.props.pageId
                        )}
                    />
                    {this.renderFocusedItem()}
                    {this.renderCommentCTR()}
                </View>
            </Animated.View>
        )
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
                    onContentSizeChange={(event) =>
                        this.onContentSizeChange('focusedItem', event)
                    }
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
                    borderTopWidth: 0.5,
                    borderBottomWidth: 0.5,
                    borderColor: '#e5e5e5',
                    minHeight: TABBAR_HEIGHT,
                }}
                onPress={this.onViewCommentPress}
                onLayout={(event) =>
                    this.onContentSizeChange('allCommentItem', event)
                }
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
                        {commentCount > 0 && ` ${commentCount}`} comment
                        {commentCount !== 1 && 's'}
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
        Logger.log(
            `${DEBUG_KEY}: [ renderCommentBox ]: for [ ${this.props.pageId} ]: focusType is: `,
            focusType,
            2
        )
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
                        position: this.state.position,
                        paddingBottom: this.state.commentBoxPadding,
                        backgroundColor: 'white',
                        zIndex: 3,
                    },
                ]}
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
            </Animated.View>
        )
    }

    render() {
        const { goalDetail, navigationState, pageId, goalId } = this.props
        // Logger.log('transformed comments to render are: ', goalDetail, 1);
        if (!goalDetail || _.isEmpty(goalDetail)) return null
        const { focusType, focusRef } = navigationState

        return (
            <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
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
                    <TabView
                        style={{ flex: 1 }}
                        navigationState={this.props.navigationState}
                        renderScene={this._renderScene}
                        renderTabBar={this._renderTabBar}
                        initialLayout={initialLayout}
                        onIndexChange={(index) =>
                            this._handleIndexChange(index)
                        }
                        swipeEnabled={navigationState.focusType !== undefined}
                    />
                    {this.renderCommentBox(focusType, pageId)}
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
                    {/** <Report showing={this.props.showingModalInDetail} /> */}
                </View>
            </MenuProvider>
        )
    }
}

const styles = StyleSheet.create({
    composerContainer: {
        left: 0,
        right: 0,
        bottom: 0,
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
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
})

const makeMapStateToProps = () => {
    const getGoalPageDetailByPageId = makeGetGoalPageDetailByPageId()
    const getCommentByEntityId = makeGetCommentByEntityId()
    const getGoalStepsAndNeedsV2 = makeGetGoalStepsAndNeedsV2()

    const mapStateToProps = (state, props) => {
        const { pageId, goalId } = props
        const newComment = getNewCommentByTab(state, pageId)
        // Following two lines are used before refactoring
        // const goalDetail = getGoalDetailByTab(state);
        // const comments = getCommentByTab(state, pageId);
        const goalDetail = getGoalPageDetailByPageId(state, goalId, pageId)
        const { goal, goalPage } = goalDetail

        const { navigationStateV2, updating } = goalPage

        const { showingModalInDetail } = state.report
        const { userId } = state.user

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
        const isSelf =
            userId === (!goal || _.isEmpty(goal) ? '' : goal.owner._id)

        // Tutorial related
        const {
            tutorialText,
            hasShown,
            showTutorial,
        } = state.tutorials.goal_detail.goal_detail_page

        return {
            commentLoading: loading,
            stepsAndNeeds: getGoalStepsAndNeedsV2(state, goalId, pageId),
            comments: transformedComments,
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
            // Tutorial related
            tutorialText,
            hasShown,
            showTutorial,
        }
    }

    return mapStateToProps
}

const getFocusedItemCount = (comments, focusType, focusRef) => {
    // Initialize data by all comments
    // console.log(`type is: ${focusType}, ref is: ${focusRef}, count is: ${comments.length}`);
    const refPath = focusType === 'need' ? 'needRef' : 'stepRef'
    let rawComments = comments
    let focusedItemCount = 0
    // console.log(`${DEBUG_KEY}: focusType is: ${focusType}, ref is: ${focusRef}`);
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
    // Tutorial related
    showNextTutorialPage,
    startTutorial,
    updateNextStepNumber,
    pauseTutorial,
    saveTutorialState,
})(GoalDetailCardV3Explained)
