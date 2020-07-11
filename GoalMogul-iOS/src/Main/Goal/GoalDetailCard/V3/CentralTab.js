/**
 * This is main subtab for GoalDetailCardV3. It contains the main components
 * for a goal. Steps, needs and all comment card.
 * On tab for each subcomponent, it will open FocusTab to render corresponding
 * focus content.
 *
 * @format
 */

import React from 'react'
import { FlatList, Animated } from 'react-native'
import DraggableFlatList from 'react-native-draggable-flatlist'
import { connect } from 'react-redux'
import _ from 'lodash'

// Components
import EmptyResult from '../../../Common/Text/EmptyResult'
import StepAndNeedCardV3 from './StepAndNeedCardV3'

// Actions
import {
    refreshGoalDetailById,
    goalDetailSwitchTabV2,
    goalDetailSwitchTabV2ByKey,
    updateGoalItemsOrder,
} from '../../../../redux/modules/goal/GoalDetailActions'

import {
    createCommentFromSuggestion,
    createCommentForSuggestion,
} from '../../../../redux/modules/feed/comment/CommentActions'

// Selectors
import {
    // getGoalStepsAndNeeds, // These are used before refactoring
    // getGoalDetailByTab, // These are used before refactoring
    makeGetGoalPageDetailByPageId,
    makeGetGoalStepsAndNeedsV2,
} from '../../../../redux/modules/goal/selector'

// Constants
const DEBUG_KEY = '[ UI CentralTab ]'
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

class CentralTab extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    // Refresh goal content and comment
    handleRefresh = () => {
        if (this.props.goalDetail) {
            this.props.refreshGoalDetailById(
                this.props.goalDetail._id,
                this.props.pageId
            )
        }
    }

    scrollToIndex = (index, viewOffset = 0, animated = true) => {
        // Set timeout so keyboard pops up before autoscroll begins to ensure proper scrolling
        setTimeout(() => {
            this.flatlist.getNode().scrollToIndex({
                index,
                animated,
                viewPosition: 1,
                viewOffset,
            })
        }, 200)
    }

    keyExtractor = (item) => {
        const { _id } = item
        return _id
    }

    renderItem = (props) => {
        const { goalDetail, pageId } = this.props
        const { item, index } = props
        if (!goalDetail) return null

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
            <StepAndNeedCardV3
                key={`mastermind-${props.index}`}
                item={item}
                goalRef={goalDetail}
                onCardPress={() => {
                    // Use passed in function to handle tab switch with animation
                    this.props.handleIndexChange(1, item.type, item._id)
                    this.props.createCommentForSuggestion(
                        newCommentParams,
                        pageId
                    )
                }}
                isSelf={this.props.isSelf}
                count={item.count}
                pageId={pageId}
                drag={props.drag}
                isActive={props.isActive}
                onEdit={() => {
                    this.scrollToIndex(index)
                }}
            />
        )
    }

    render() {
        const {
            data,
            isSelf,
            goalDetail,
            pageId,
            bottomOffset,
            onScroll,
            contentContainerStyle,
        } = this.props

        const list = isSelf ? (
            <DraggableFlatList
                ref={(ref) => {
                    if (ref && ref.containerRef)
                        this.flatlist = ref.flatlistRef.current
                }}
                contentContainerStyle={contentContainerStyle}
                data={data}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                refreshing={this.props.loading || false}
                onRefresh={this.handleRefresh}
                ListEmptyComponent={
                    this.props.loading ? null : (
                        <EmptyResult
                            text="No steps or needs"
                            textStyle={{ paddingTop: 70 }}
                        />
                    )
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
                        pageId
                    )
                }}
                onScrollOffsetChange={onScroll}
                scrollEventThrottle={2}
            />
        ) : (
            <AnimatedFlatList
                ref={(ref) => {
                    this.flatlist = ref
                }}
                onScroll={onScroll}
                contentContainerStyle={contentContainerStyle}
                data={data}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                refreshing={this.props.loading || false}
                onRefresh={this.handleRefresh}
                ListEmptyComponent={
                    this.props.loading ? null : (
                        <EmptyResult
                            text="No steps or needs"
                            textStyle={{ paddingTop: 70 }}
                        />
                    )
                }
                scrollEventThrottle={2}
            />
        )

        return (
            <Animated.View style={{ flex: 1, marginBottom: bottomOffset }}>
                {list}
            </Animated.View>
        )
    }
}

CentralTab.defaultPros = {
    data: [],
    goalDetail: undefined,
    isSelf: false,
}

const makeMapStateToProps = () => {
    const getGoalPageDetailByPageId = makeGetGoalPageDetailByPageId()
    const getGoalStepsAndNeedsV2 = makeGetGoalStepsAndNeedsV2()

    const mapStateToProps = (state, props) => {
        const { pageId, goalId, isSelf } = props
        const goalDetail = getGoalPageDetailByPageId(state, goalId, pageId)
        const { goal, goalPage } = goalDetail
        let loading = false
        if (goalPage) {
            loading = goalPage.loading
        }

        return {
            goalDetail: goal,
            loading,
            data: getGoalStepsAndNeedsV2(state, goalId, pageId, { isSelf }),
        }
    }

    return mapStateToProps
}

export default connect(
    makeMapStateToProps,
    {
        goalDetailSwitchTabV2,
        goalDetailSwitchTabV2ByKey,
        refreshGoalDetailById,
        createCommentFromSuggestion,
        createCommentForSuggestion,
        updateGoalItemsOrder,
    },
    null,
    { withRef: true }
)(CentralTab)
