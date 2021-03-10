/** @format */

import React, { Component } from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

// Components
import GoalFilterBar from '../Common/GoalFilterBar'
import PostPreviewCard from '../Post/PostPreviewCard/PostPreviewCard'

// actions
import {
    handleTabRefresh,
    handleProfileTabOnLoadMore,
    changeFilter,
} from '../../actions'

import { openPostDetail } from '../../redux/modules/feed/post/PostActions'

// Selectors
import {
    makeGetUserPosts,
    makeGetUserPageInfoByType,
} from '../../redux/modules/User/Selector'

// tab key
const key = 'posts'
const DEBUG_KEY = '[ UI Profile Posts ]'

class MyPosts extends Component {
    constructor(props) {
        super(props)
        this.handleOnLoadMore = this.handleOnLoadMore.bind(this)
        this.handleRefresh = this.handleRefresh.bind(this)
    }

    _keyExtractor = (item) => item._id

    handleRefresh = () => {
        const { userId, pageId } = this.props
        console.log(`${DEBUG_KEY}: refreshing tab`, key)
        this.props.handleTabRefresh(key, userId, pageId)
    }

    handleOnLoadMore = () => {
        const { userId, pageId } = this.props
        this.props.handleProfileTabOnLoadMore(key, userId, pageId)
    }

    /**
     * @param type: ['sortBy', 'orderBy', 'categories', 'priorities']
     */
    handleOnMenuChange = (type, value) => {
        const { userId, pageId } = this.props
        this.props.changeFilter(key, type, value, { userId, pageId })
    }

    renderListFooter() {
        const { loading, data } = this.props
        // console.log(`${DEBUG_KEY}: loading is: ${loadingMore}, data length is: ${data.length}`);
        if (loading && data.length >= 7) {
            return (
                <View
                    style={{
                        paddingVertical: 15,
                    }}
                >
                    <ActivityIndicator size="small" />
                </View>
            )
        }
    }

    renderItem = ({ item }) => {
        // TODO: render item
        return <PostPreviewCard item={item} hasActionButton />
    }

    render() {
        const { refreshing, data } = this.props
        return (
            <View style={{ flex: 1 }}>
                {/*
        <GoalFilterBar
          selectedTab={this.props.selectedTab}
          filter={this.props.filter}
          onMenuChange={this.handleOnMenuChange}
        />
        */}
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={[...data]}
                        renderItem={this.renderItem}
                        keyExtractor={this._keyExtractor}
                        onRefresh={this.handleRefresh}
                        refreshing={refreshing}
                        onEndReached={this.handleOnLoadMore}
                        onEndReachedThreshold={0}
                        ListFooterComponent={this.renderListFooter()}
                    />
                </View>
                {/*
          onEndReached={() => this.props.handleProfileTabOnLoadMore(key)}
        */}
            </View>
        )
    }
}

const styles = {
    // Extract label color out
    labelContainerStyle: {
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        justifyContent: 'center',
    },
    labelTextStyle: {
        fontWeight: '600',
        color: '#969696',
        fontSize: 11,
    },
    buttonTextStyle: {
        marginLeft: 5,
        color: '#17B3EC',
        fontSize: 11,
    },
}

const makeMapStateToProps = () => {
    const getUserPosts = makeGetUserPosts()
    const getPageInfo = makeGetUserPageInfoByType()

    const mapStateToProps = (state, props) => {
        const { pageId, userId } = props
        const data = getUserPosts(state, userId, pageId)
        const { loading, refreshing, filter, selectedTab } = getPageInfo(
            state,
            userId,
            pageId,
            'posts'
        )

        // console.log(`${DEBUG_KEY}: user posts composed: `, userPosts.length);

        return {
            selectedTab,
            data,
            loading,
            filter,
            refreshing,
        }
    }

    return mapStateToProps
}

export default connect(makeMapStateToProps, {
    handleTabRefresh,
    handleProfileTabOnLoadMore,
    changeFilter,
    openPostDetail,
})(MyPosts)
