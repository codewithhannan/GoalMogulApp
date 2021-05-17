/** @format */

import React, { Component } from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

// Components
import GoalFilterBar from '../Common/GoalFilterBar'
import ProfileGoalCard from '../Goal/GoalCard/ProfileGoalCard'

// actions
import {
    handleTabRefresh,
    handleProfileTabOnLoadMore,
    changeFilter,
} from '../../actions'

// Selector
import {
    makeGetUserGoals,
    makeGetUserPageInfoByType,
} from '../../redux/modules/User/Selector'

// tab key
const key = 'goals'
const DEBUG_KEY = '[ UI Profile Goals ]'

class MyGoals extends Component {
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

    renderItem = ({ item }) => {
        // Pass down the pageId from the profile component to the ProfileGoalCard
        return <ProfileGoalCard item={item} pageId={this.props.pageId} />
    }

    renderListFooter() {
        const { loading, data } = this.props
        // console.log(`${DEBUG_KEY}: loading is: ${loadingMore}, data length is: ${data.length}`);
        if (loading && data.length >= 7) {
            return (
                <View
                    style={{
                        paddingVertical: 12,
                    }}
                >
                    <ActivityIndicator size="small" />
                </View>
            )
        }
    }

    render() {
        const { data } = this.props

        return (
            <View style={{ flex: 1 }}>
                <GoalFilterBar
                    filter={this.props.filter}
                    onMenuChange={this.handleOnMenuChange}
                />

                <FlatList
                    data={data}
                    renderItem={this.renderItem}
                    keyExtractor={this._keyExtractor}
                    onRefresh={this.handleRefresh}
                    onEndReached={this.handleOnLoadMore}
                    onEndReachedThreshold={0}
                    refreshing={this.props.refreshing}
                    ListFooterComponent={this.renderListFooter()}
                />
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
    const getUserGoals = makeGetUserGoals()
    const getPageInfo = makeGetUserPageInfoByType()

    const mapStateToProps = (state, props) => {
        const { pageId, userId } = props
        const data = getUserGoals(state, userId, pageId)

        const { loading, refreshing, filter, selectedTab } = getPageInfo(
            state,
            userId,
            pageId,
            'goals'
        )

        // console.log(`${DEBUG_KEY}: user goals composed: `, userGoals);
        // console.log(`${DEBUG_KEY}: goals are: `, state.goals);
        // console.log(`${DEBUG_KEY}: user object is: `, state.users[`${userId}`]);

        // console.log(`${DEBUG_KEY}: filter object is: `, filter);
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
})(MyGoals)
