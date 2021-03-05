/** @format */

import React, { Component } from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

// Components
import GoalFilterBar from '../Common/GoalFilterBar'
import ProfileNeedCard from '../Goal/NeedCard/ProfileNeedCard'

// actions
import {
    handleTabRefresh,
    handleProfileTabOnLoadMore,
    changeFilter,
} from '../../actions'

// Selector
import {
    makeGetUserNeeds,
    makeGetUserPageInfoByType,
} from '../../redux/modules/User/Selector'

// tab key
const key = 'needs'
const DEBUG_KEY = '[ UI Profile Needs ]'

class MyNeeds extends Component {
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
        if (loading && data.length >= 20) {
            return (
                <View
                    style={{
                        paddingVertical: 14,
                    }}
                >
                    <ActivityIndicator size="small" />
                </View>
            )
        }
    }

    renderItem = ({ item }) => {
        // TODO: render item
        // Pass down the pageId from Profile component to ProfileNeedCard
        return <ProfileNeedCard item={item} pageId={this.props.pageId} />
    }

    render() {
        const { refreshing, data } = this.props
        return (
            <View style={{ flex: 1 }}>
                <GoalFilterBar
                    filter={this.props.filter}
                    onMenuChange={this.handleOnMenuChange}
                />
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={[...data]}
                        renderItem={this.renderItem}
                        keyExtractor={this._keyExtractor}
                        onRefresh={this.handleRefresh}
                        onEndReached={this.handleOnLoadMore}
                        onEndReachedThreshold={0}
                        refreshing={refreshing}
                        ListFooterComponent={this.renderListFooter()}
                    />
                </View>
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
    const getUserNeeds = makeGetUserNeeds()
    const getPageInfo = makeGetUserPageInfoByType()

    const mapStateToProps = (state, props) => {
        const { userId, pageId } = props
        const data = getUserNeeds(state, userId, pageId)
        const { loading, refreshing, filter, selectedTab } = getPageInfo(
            state,
            userId,
            pageId,
            'needs'
        )

        // console.log(`${DEBUG_KEY}: user needs composed: `, userNeeds.length);

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
})(MyNeeds)
