/** @format */

import React, { Component } from 'react'
import { View, FlatList, Dimensions } from 'react-native'
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
import { loadMoreUsers, getAllAccounts } from '../../../actions'

// tab key
const key = 'people'
const DEBUG_KEY = '[ Component PeopleSearch ]'

class PeopleSearch extends Component {
    constructor(props) {
        super(props)
        this.onEndReachedCalledDuringMomentum = true
        this.state = {}
    }

    _keyExtractor = (item) => item._id

    async componentDidMount() {
        this.props.getAllAccounts()
    }
    componentDidUpdate(prevProps, prevState) {
        // if (
        //     this.props.data.length === 0 &&
        //     !this.props.searchContent &&
        //     !this.props.loading
        // ) {
        //     this.props.getAllAccounts()
        // }
    }

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

    handleOnLoadMore = () => {
        console.log(`${DEBUG_KEY} Loading more for tab: `, key)
        this.props.onLoadMore(key)
    }

    preHandleOnLoadMore = () => {
        console.log(`${DEBUG_KEY} Loading more for tab: `, key)
        this.props.loadMoreUsers()
    }

    handleOnLoadMoreAccounts = ({ distanceFromEnd }) => {
        if (!this.onEndReachedCalledDuringMomentum) {
            this.props.loadMoreUsers()
            this.onEndReachedCalledDuringMomentum = true
        }
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

    renderFlatList = (item) => {
        if (
            this.props.data.length === 0 &&
            !this.props.searchContent &&
            !this.props.loading
        ) {
            return (
                <FlatList
                    data={this.props.allUser}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => 'key' + index}
                    refreshing={this.props.peopleLoading}
                    onEndReached={this.preHandleOnLoadMore}
                    onEndReachedThreshold={0.5}
                    keyboardShouldPersistTaps="always"
                />
            )
        } else if (
            this.props.data.length === 0 &&
            this.props.searchContent &&
            !this.props.loading
        ) {
            return <EmptyResult text={'No Results'} />
        } else {
            let SortedObjs = _.sortBy(this.props.data, 'name')
            return (
                <FlatList
                    data={SortedObjs}
                    renderItem={this.renderItem}
                    keyExtractor={this._keyExtractor}
                    onEndReached={this.handleOnLoadMore}
                    onEndReachedThreshold={0.5}
                    // onRefresh={this.handleRefresh}
                    // refreshing={this.props.loading}
                    keyboardShouldPersistTaps="always"
                />
            )
        }
    }

    render() {
        const { height } = Dimensions.get('window')
        let SortedObjs = _.sortBy(this.props.data, 'name')

        return (
            <View style={{ flex: 1, height: height }}>
                {this.props.data.length === 0 &&
                this.props.searchContent &&
                !this.props.loading ? (
                    <EmptyResult text={'No Results'} />
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
    const { allUser, loading: peopleLoading } = state.account

    return {
        people,
        data,
        refreshing,
        loading,
        searchContent,
        allUser,
        peopleLoading,
    }
}

export default connect(mapStateToProps, {
    refreshSearchResult,

    loadMoreUsers,
    onLoadMore,
    getAllAccounts,
})(PeopleSearch)
