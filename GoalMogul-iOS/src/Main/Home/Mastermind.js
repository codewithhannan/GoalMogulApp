/** @format */

import React, { Component } from 'react'
import { View, Image, ActivityIndicator, FlatList } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
// This is commented out as we switch back to the old implementation
import { walkthroughable, CopilotStep } from 'react-native-copilot-gm'

// Components
import GoalCard from '../Goal/GoalCard/GoalCard'
import EmptyResult from '../Common/Text/EmptyResult'

// actions
import {
    loadMoreGoals,
    openCreateOverlay,
    closeCreateOverlay,
    openGoalDetail,
    changeFilter,
} from '../../redux/modules/home/mastermind/actions'
import { markUserViewGoal } from '../../redux/modules/goal/GoalDetailActions'

import { color } from '../../styles/basic'
import { Logger } from '../../redux/middleware/utils/Logger'
import DelayedButton from '../Common/Button/DelayedButton'
import { wrapAnalytics, SCREENS } from '../../monitoring/segment'

const TAB_KEY = 'mastermind'
const DEBUG_KEY = '[ UI Mastermind ]'
const WalkableView = walkthroughable(View)

class Mastermind extends Component {
    constructor(props) {
        super(props)
        // Same config is used in ActivityFeed
        this.viewabilityConfig = {
            waitForInteraction: true,
            itemVisiblePercentThreshold: 100,
            minimumViewTime: 1500,
        }
    }

    handleCreateGoal = () => {
        this.props.openCreateOverlay()
        Actions.createGoalButtonOverlay({ tab: TAB_KEY })
    }

    handleOnViewableItemsChanged = ({ viewableItems, changed }) => {
        viewableItems.map(({ item }) => this.props.markUserViewGoal(item._id))
    }

    handleOnLoadMore = () => this.props.loadMoreGoals()

    _keyExtractor = (item) => item._id

    renderItem = ({ item }) => {
        // TODO: render item
        // mastermind currently renders goals and needs
        // TODO: add NeedCard
        return (
            <GoalCard
                item={item}
                onPress={(goal, subItem) => {
                    // console.log('[ UI Mastermind ]: onPress with subItem: ', subItem);
                    if (subItem) {
                        this.props.openGoalDetail(goal, {
                            focusType: subItem.type,
                            focusRef: subItem._id,
                            initialShowSuggestionModal:
                                subItem.initialShowSuggestionModal === false
                                    ? false
                                    : true,
                            initialFocusCommentBox:
                                subItem.initialFocusCommentBox,
                            // commentBox is passed in to GoalDetailCardV3 as initial
                            // commentBox: true
                        })
                        return
                    }
                    this.props.openGoalDetail(goal)
                }}
            />
        )
    }

    // This was used in V2 where user can only create Goal here. But we decide
    // to move this function to Home component so that it won't scroll over
    renderPlus() {
        const { tutorialText, order, name, nextStepNumber } = this.props
        // console.log(`${DEBUG_KEY}: [renderPlus]: nextStepNumber <= order + 1: ${nextStepNumber <= order + 1}`);
        // console.log(`${DEBUG_KEY}: [renderPlus]: order: ${order}, nextStepNumber: ${nextStepNumber}`);

        const tutorialView =
            nextStepNumber <= order + 1 ? (
                <CopilotStep text={tutorialText} order={order} name={name}>
                    <WalkableView
                        style={{
                            height: 54,
                            width: 54,
                            borderRadius: 28,
                            position: 'absolute',
                        }}
                    />
                </CopilotStep>
            ) : null

        return (
            <DelayedButton
                activeOpacity={0.6}
                style={styles.iconContainerStyle}
                onPress={() => Actions.createGoalModal()}
            >
                <Image style={styles.iconStyle} source={plus} />
                {tutorialView}
            </DelayedButton>
        )
    }

    renderListFooter() {
        const { loadingMore, data } = this.props
        // console.log(`${DEBUG_KEY}: loading is: ${loadingMore}, data length is: ${data.length}`);
        if (loadingMore && data.length >= 4) {
            return (
                <View
                    style={{
                        paddingVertical: 20,
                    }}
                >
                    <ActivityIndicator size="small" />
                </View>
            )
        }
    }

    render() {
        // Following is the old implementation
        return (
            <FlatList
                ref={this.props.setMastermindRef}
                data={this.props.data}
                renderItem={this.renderItem}
                numColumns={1}
                keyExtractor={this._keyExtractor}
                onViewableItemsChanged={this.handleOnViewableItemsChanged}
                viewabilityConfig={this.viewabilityConfig}
                ListFooterComponent={this.renderListFooter()}
                ListEmptyComponent={
                    this.props.loading || this.props.refreshing ? null : (
                        <EmptyResult
                            text={'No Goals have been shared'}
                            textStyle={{ paddingTop: 230 }}
                        />
                    )
                }
                onEndReached={this.handleOnLoadMore}
                onEndThreshold={2}
            />
        )
    }
}

const styles = {
    iconContainerStyle: {
        position: 'absolute',
        bottom: 20,
        right: 29,
        height: 54,
        width: 54,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3,
        backgroundColor: color.GM_BLUE,
    },
    iconStyle: {
        height: 26,
        width: 26,
        tintColor: 'white',
    },
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.7,
    },
    nextIconContainerStyle: {
        position: 'absolute',
        bottom: 0,
        right: 50,
        left: 50,
        alignItems: 'center',
    },
}

const mapStateToProps = (state) => {
    const { data, loading, loadingMore, refreshing } = state.home.mastermind

    return {
        data,
        loading,
        loadingMore,
        refreshing,
    }
}

export default connect(
    mapStateToProps,
    {
        loadMoreGoals,
        openCreateOverlay,
        closeCreateOverlay,
        openGoalDetail,
        changeFilter,
        markUserViewGoal,
    },
    null,
    { withRef: true }
)(wrapAnalytics(Mastermind, SCREENS.HOME_GOAL))
