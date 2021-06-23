/** @format */

import React, { Component } from 'react'
import { View, FlatList } from 'react-native'
import { connect } from 'react-redux'

// Components
import SearchUserCard from './SearchUserCard'
import EmptyResult from '../../Common/Text/EmptyResult'

import * as _ from 'underscore'

// actions
import {
    refreshSearchResult,
    onLoadMore,
} from '../../../redux/modules/search/SearchActions'
import { getAllAccounts } from '../../../actions'

// tab key
const key = 'friends'
const DEBUG_KEY = '[ Component FriendsSearch ]'

class FriendsSearch extends Component {
    _keyExtractor = (item) => item._id

    handleRefresh = () => {
        console.log(`${DEBUG_KEY} Refreshing tab: `, key)
        this.props.refreshSearchResult(key)
    }

    handleOnLoadMore = () => {
        console.log(`${DEBUG_KEY} Loading more for tab: `, key)
        this.props.onLoadMore(key)
    }

    renderItem = ({ item }) => {
        return (
            <SearchUserCard
                {...this.props}
                item={item}
                onSelect={this.props.onSelect}
                type={this.props.type}
            />
        )
    }

    render() {
        let SortedObjs = _.sortBy(this.props.data, 'name')

        return (
            <View style={{ flex: 1 }}>
                {this.props.data.length === 0 &&
                this.props.searchContent &&
                !this.props.loading ? (
                    <EmptyResult text={'No Results'} />
                ) : (
                    <FlatList
                        data={this.props.data}
                        renderItem={this.renderItem}
                        keyExtractor={this._keyExtractor}
                        onEndReached={this.handleOnLoadMore}
                        onEndReachedThreshold={0.5}
                        onRefresh={this.handleRefresh}
                        refreshing={this.props.loading}
                    />
                )}
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { friends, searchContent } = state.search
    const { data, refreshing, loading } = friends
    const { allUsers } = state.account

    return {
        friends,
        data,
        refreshing,
        loading,
        searchContent,
        allUsers,
    }
}

export default connect(mapStateToProps, {
    refreshSearchResult,
    onLoadMore,
})(FriendsSearch)
