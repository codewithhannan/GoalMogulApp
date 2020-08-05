/** @format */

import React, { Component } from 'react'
import { View, FlatList, ActivityIndicator, Image } from 'react-native'
import { connect } from 'react-redux'

// Components
import ActivityCard from '../Activity/ActivityCard'
import EmptyResult from '../Common/Text/EmptyResult'

// Assets
import plus from '../../asset/utils/plus.png'

import {
    openPostDetail,
    markUserViewPost,
} from '../../redux/modules/feed/post/PostActions'
import { markUserViewGoal } from '../../redux/modules/goal/GoalDetailActions'
import { openGoalDetail } from '../../redux/modules/home/mastermind/actions'

import { color } from '../../styles/basic'
import DelayedButton from '../Common/Button/DelayedButton'
import { wrapAnalytics, SCREENS } from '../../monitoring/segment'
import CreatePostModal from '../Post/CreatePostModal'
import { Actions } from 'react-native-router-flux'

const TAB_KEY = 'activityfeed'
const DEBUG_KEY = '[ UI ActivityFeed ]'

class ActivityFeed extends Component {
    constructor(props) {
        super(props)

        // Same config is used in Mastermind.js
        this.viewabilityConfig = {
            waitForInteraction: true,
            itemVisiblePercentThreshold: 100,
            minimumViewTime: 1500,
        }
    }

    handleOnViewableItemsChanged = ({ viewableItems, changed }) => {
        viewableItems.map(({ item }) => {
            if (item.postRef) {
                const postId = item.postRef._id
                this.props.markUserViewPost(postId)
            } else if (item.goalRef) {
                const goalId = item.goalRef._id
                this.props.markUserViewGoal(goalId)
            }
        })
    }

    _keyExtractor = (item) => item._id

    renderItem = ({ item }) => {
        // TODO: render item
        return (
            <ActivityCard
                item={item}
                onPress={(curItem, isGoal) => {
                    if (isGoal) {
                        // Open goal and focus on comment
                        const initialProps = {
                            focusType: 'comment',
                            focusRef: undefined,
                            initialShowSuggestionModal: false,
                            initialFocusCommentBox: true,
                        }
                        return this.props.openGoalDetail(curItem, initialProps)
                    }
                    const initialProps = {
                        initialFocusCommentBox: true,
                    }
                    this.props.openPostDetail(curItem, initialProps)
                }}
                onShareCallback={() => this.scrollToTop()}
            />
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
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    scrollEnabled={false}
                    data={this.props.data}
                    renderItem={this.renderItem}
                    numColumns={1}
                    keyExtractor={this._keyExtractor}
                    onViewableItemsChanged={this.handleOnViewableItemsChanged}
                    viewabilityConfig={this.viewabilityConfig}
                    ListEmptyComponent={
                        this.props.loading || this.props.refreshing ? null : (
                            <EmptyResult
                                text={'No Activity'}
                                textStyle={{ paddingTop: 230 }}
                            />
                        )
                    }
                    ListFooterComponent={this.renderListFooter()}
                    onEndThreshold={2}
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { refreshing, loading, loadingMore, data } = state.home.activityfeed
    return {
        data,
        refreshing,
        loading,
        loadingMore, // For footer indicator
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
}

export default connect(
    mapStateToProps,
    {
        openPostDetail,
        openGoalDetail,
        markUserViewPost,
        markUserViewGoal,
    },
    null,
    { withRef: true }
)(wrapAnalytics(ActivityFeed, SCREENS.HOME_FEED))
