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

import { ActivityIndicator } from 'react-native-paper'
import { getAllAccounts, loadMoreAccounts } from '../../../actions'

// tab key
const key = 'people'
const DEBUG_KEY = '[ Component PeopleSearch ]'

class PeopleSearch extends Component {
    state = {}

    _keyExtractor = (item) => item._id

    handleRefresh = () => {
        console.log(`${DEBUG_KEY} Refreshing tab: `, key)
        // Only refresh if there is content
        if (
            this.props.searchContent &&
            this.props.searchContent.trim() !== ''
        ) {
            this.props.refreshSearchResult(key)
        }
    }

    componentDidMount() {
        this.props.getAllAccounts()
    }

    handleOnLoadMore = () => {
        console.log(`${DEBUG_KEY} Loading more for tab: `, key)
        this.props.onLoadMore(key)
    }
    handleOnLoadMoreAccounts = () => {
        console.log(`${DEBUG_KEY} Loading more for tab: `, key)
        this.props.loadMoreAccounts()
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
                !this.props.searchContent &&
                !this.props.loading ? (
                    <FlatList
                        data={this.props.allUser}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => 'key' + index}
                        refreshing={this.state.isLoading}
                        onEndReached={() => this.props.loadMoreAccounts()}
                        onEndReachedThreshold={0.5}
                        keyboardShouldPersistTaps="always"
                    />
                ) : (
                    <FlatList
                        data={SortedObjs}
                        renderItem={this.renderItem}
                        keyExtractor={this._keyExtractor}
                        onEndReached={this.handleOnLoadMore}
                        onEndReachedThreshold={0.5}
                        onRefresh={this.handleRefresh}
                        refreshing={this.props.loading}
                        keyboardShouldPersistTaps="always"
                    />
                )}
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { people, searchContent } = state.search
    const { token } = state.user

    const { data, refreshing, loading } = people
    const { allUser } = state.account

    return {
        people,
        data,
        refreshing,
        loading,
        searchContent,
        allUser,
    }
}

export default connect(mapStateToProps, {
    refreshSearchResult,
    getAllAccounts,
    loadMoreAccounts,
    onLoadMore,
})(PeopleSearch)
