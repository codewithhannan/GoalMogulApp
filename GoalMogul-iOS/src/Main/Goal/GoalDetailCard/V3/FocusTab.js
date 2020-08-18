/** @format */

import React from 'react'
import { View, FlatList, Animated } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

// Components
import EmptyResult from '../../../Common/Text/EmptyResult'
import CommentCard from '../Comment/CommentCard'

// Actions
import { goalDetailSwitchTabV2ByKey } from '../../../../redux/modules/goal/GoalDetailActions'
import { resetCommentType } from '../../../../redux/modules/feed/comment/CommentActions'

// Utils
import { switchCase } from '../../../../redux/middleware/utils'

// Selectors
import { makeGetGoalPageDetailByPageId } from '../../../../redux/modules/goal/selector'

import {
    getNewCommentByTab,
    makeGetCommentByEntityId,
} from '../../../../redux/modules/feed/comment/CommentSelector'
import LikeListModal from '../../../Common/Modal/LikeListModal'

// Constants
const DEBUG_KEY = '[ UI FocusTab ]'
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

class FocusTab extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            keyboardHeight: 0,
            position: 'absolute',
            keyboardDidShow: false,
            // TODO: merge LikeListModal for comment with the one for goal
            showCommentLikeList: false,
            likeListParentType: undefined,
            likeListParentId: undefined,
        }
        this.scrollToIndex = this.scrollToIndex.bind(this)
        this.handleHeadlineOnPressed = this.handleHeadlineOnPressed.bind(this)
    }

    componentDidMount() {
        console.log(`${DEBUG_KEY}: component did mount`)
        if (this.props.onRef !== null) {
            this.props.onRef(this)
        }
    }

    componentWillUnmount() {
        console.log(`${DEBUG_KEY}:  component will unmount`)
    }

    /**
     * Open comment like list
     */
    openCommentLikeList = (likeListParentType, likeListParentId) => {
        console.log(
            `${DEBUG_KEY}: show comment like list: ${likeListParentType}, ${likeListParentId}`
        )
        this.setState({
            ...this.state,
            showCommentLikeList: true,
            likeListParentType,
            likeListParentId,
        })
    }

    /**
     * Close comment like list
     */
    closeCommentLikeList = () => {
        console.log(`${DEBUG_KEY}: close comment like list`)
        this.setState({
            ...this.state,
            showCommentLikeList: false,
            likeListParentId: undefined,
            likeListParentType: undefined,
        })
    }

    handleOnScrollToIndexFailed = (info) => {
        const { index, highestMeasuredFrameIndex, averageItemLength } = info
        console.log(
            `${DEBUG_KEY}: [ handleOnScrollToIndexFailed ]: index: ${index}, highestMeasuredFrameIndex: ${highestMeasuredFrameIndex}`
        )
    }

    // Refresh goal detail and comments all together
    handleRefresh = () => {
        console.log(`${DEBUG_KEY}: user tries to refresh.`)
    }

    scrollToIndex = (index, viewOffset = 0, animated = true) => {
        this.flatlist.getNode().scrollToIndex({
            // this.flatlist.scrollToIndex({
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
        this.props.handleIndexChange(1, focusType, focusRef)
    }

    keyExtractor = (item) => {
        const { _id } = item
        return _id
    }

    dialogOnFocus = () => this.commentBox.focus()

    renderItem = (props) => {
        const { goalDetail } = this.props
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
                scrollToIndex={(i, viewOffset) =>
                    this.scrollToIndex(i, viewOffset)
                }
                onCommentClicked={this.props.handleReplyTo}
                reportType="detail"
                pageId={this.props.pageId}
                entityId={this.props.goalId}
                goalId={this.props.goalId}
                onHeadlinePressed={this.handleHeadlineOnPressed}
                openCommentLikeList={this.openCommentLikeList}
            />
        )
    }

    render() {
        const {
            data,
            focusType,
            initial,
            initialScrollToCommentReset,
            goalDetail,
        } = this.props
        if (!focusType) return null
        const emptyText = switchCaseEmptyText(focusType)
        const initialScrollToComment =
            initial &&
            initial.initialScrollToComment &&
            initial.commentId &&
            !initialScrollToCommentReset
        const totalCommentCount =
            goalDetail && goalDetail.commentCount
                ? goalDetail.commentCount
                : 100

        // const resetCommentTypeFunc = focusType === 'comment'
        //   ? () => this.props.resetCommentType('Comment', pageId)
        //   : () => this.props.resetCommentType('Suggestion', pageId);

        return (
            <View
                style={{ flex: 1, backgroundColor: 'transparent' }}
                testID="goal-detail-card-focus-tab"
            >
                <LikeListModal
                    isVisible={this.state.showCommentLikeList}
                    closeModal={this.closeCommentLikeList}
                    parentId={this.state.likeListParentId}
                    parentType={this.state.likeListParentType}
                    clearDataOnHide
                />
                <AnimatedFlatList
                    ref={(ref) => {
                        this.flatlist = ref
                    }}
                    data={data}
                    initialNumToRender={
                        initialScrollToComment ? totalCommentCount : 5
                    }
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    refreshing={this.props.loading || false}
                    onRefresh={this.handleRefresh}
                    onScrollToIndexFailed={this.handleOnScrollToIndexFailed}
                    ListEmptyComponent={
                        this.props.loading ? null : (
                            <EmptyResult
                                testID="focus-tab-empty-result"
                                text={emptyText}
                                textStyle={{ paddingTop: 90 }}
                            />
                        )
                    }
                    ListFooterComponent={
                        <View
                            style={{
                                height: 51,
                                backgroundColor: 'transparent',
                            }}
                        />
                    }
                    onScroll={this.props.onScroll}
                    scrollEventThrottle={1}
                    contentContainerStyle={{
                        ...this.props.contentContainerStyle,
                    }}
                />
                <Animated.View style={{ height: this.props.paddingBottom }} />
            </View>
        )
    }
}
const makeMapStateToProps = () => {
    const getGoalPageDetailByPageId = makeGetGoalPageDetailByPageId()
    const getCommentByEntityId = makeGetCommentByEntityId()

    const mapStateToProps = (state, props) => {
        const { pageId, goalId } = props
        const newComment = getNewCommentByTab(state, pageId)
        // const goalDetail = getGoalDetailByTab(state);
        // const { goal, navigationStateV2 } = goalDetail;
        // const comments = getCommentByTab(state, props.pageId);

        const goalDetail = getGoalPageDetailByPageId(state, goalId, pageId)
        const { goal, goalPage } = goalDetail
        const { navigationStateV2 } = goalPage

        const { focusType, focusRef } = navigationStateV2
        const comments = getCommentByEntityId(state, goalId, pageId)
        const { transformedComments, loading } = comments || {
            transformedComments: [],
            loading: false,
        }
        // Initialize data by all comments
        let data = transformedComments

        // console.log(`${DEBUG_KEY}: focusType is: ${focusType}, ref is: ${focusRef}`);
        if (focusType === 'step' || focusType === 'need') {
            // TODO: grab comments by step, filter by typeRef
            data = data.filter((comment) => {
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

        return {
            newComment,
            data, // Comments of interest
            // loading: loading || goal.loading,
            loading: false,
            focusType,
            focusRef,
            goalDetail: goal,
        }
    }

    return mapStateToProps
}

const switchCaseEmptyText = (type) =>
    switchCase({
        comment: 'No Comments',
        step: 'No suggestions for this step',
        need: 'No suggestions for this need',
    })('comment')(type)

FocusTab.defaultPros = {
    focusType: undefined, // ['comment', 'step', 'need']
    focusRef: undefined,
    goalDetail: undefined,
    isSelf: false,
}

export default connect(
    makeMapStateToProps,
    {
        goalDetailSwitchTabV2ByKey,
        resetCommentType,
    },
    null,
    { withRef: true }
)(FocusTab)
