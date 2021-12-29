/** @format */

// This is a tab for General search
import React, { Component } from 'react'
import { View, FlatList, Dimensions, Text } from 'react-native'
import { connect } from 'react-redux'

// Components
import TribeSearchCard from './TribeSearchCard'
import EmptyResult from '../../Common/Text/EmptyResult'

// actions
import {
    refreshSearchResult,
    onLoadMore,
    refreshPreloadData,
    loadPreloadData,
} from '../../../redux/modules/search/SearchActions'
import * as _ from 'underscore'

import { loadMoreTribes, getAllAccounts } from '../../../actions'

// tab key
const TYPE = 'Tribe' // Used for preload function
const key = 'tribes'
const DEBUG_KEY = '[ Component TribeSearch ]'

class TribeSearch extends Component {
    constructor(props) {
        super(props)
        this.onEndReachedCalledDuringMomentum = true
        this.state = {}
    }

    componentDidMount() {
        if (this.props.shouldPreload) {
            this.props.refreshPreloadData(TYPE)
        }
        this.props.getAllAccounts()
    }

    _keyExtractor = (item) => item._id

    handleRefresh = () => {
        console.log(`${DEBUG_KEY} Refreshing search`)
        let keyToUse = key
        if (this.props.type !== 'GeneralSearch') {
            keyToUse = 'myTribes'
        }

        // Only refresh if there is content
        if (
            this.props.searchContent &&
            this.props.searchContent.trim() !== ''
        ) {
            this.props.refreshSearchResult(keyToUse)
            return
        }

        if (this.props.shouldPreload) {
            this.props.refreshPreloadData(TYPE)
            return
        }
    }

    handleOnLoadMore = () => {
        let keyToUse = key
        if (this.props.type !== 'GeneralSearch') {
            keyToUse = 'myTribes'
        }

        if (
            this.props.searchContent &&
            this.props.searchContent.trim() !== ''
        ) {
            this.props.onLoadMore(keyToUse)
            return
        }

        if (this.props.shouldPreload) {
            this.props.loadPreloadData(TYPE)
            return
        }
    }

    preHandleOnLoadMore = () => {
        console.log(`${DEBUG_KEY} Loading more for tab: `, key)
        this.props.loadMoreTribes()
    }

    renderItem = ({ item }) => {
        return (
            <TribeSearchCard
                item={item}
                type={this.props.type}
                callback={this.props.callback}
                onItemSelect={this.props.onItemSelect}
                hideJoinButton={this.props.hideJoinButton}
            />
        )
    }

    suggestedHeader = () => {
        return (
            <View>
                <View
                    style={{
                        width: '100%',
                        height: 1,
                        backgroundColor: '#F2F2F2',
                        marginTop: 10,
                    }}
                />
                <Text
                    style={{
                        fontSize: 19,
                        padding: 17,
                        fontWeight: '600',
                        fontFamily: 'SFProDisplay-Semibold',
                    }}
                >
                    Suggested Tribes
                </Text>
            </View>
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
                    data={this.props.allTribes}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => 'key' + index}
                    ListHeaderComponent={this.suggestedHeader}
                    onEndReached={this.preHandleOnLoadMore}
                    refreshing={this.props.tribesLoading}
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
            return (
                <FlatList
                    data={this.props.data}
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

const mapStateToProps = (state, props) => {
    const { tribes, searchContent } = state.search
    let refreshing, loading, data

    const { allTribes, loading: tribesLoading } = state.account

    const { shouldPreload } = props

    if (shouldPreload && (!searchContent || searchContent.trim() === '')) {
        // Display preload data when search content is null and shouldPreload is true

        data = tribes.preload.data
        refreshing = tribes.preload.refreshing
        loading = tribes.preload.loading
    } else {
        data = tribes.data
        refreshing = tribes.refreshing
        loading = tribes.loading
    }

    return {
        tribes,
        data,
        refreshing,
        loading,
        searchContent,
        allTribes,
        tribesLoading,
    }
}

export default connect(mapStateToProps, {
    refreshSearchResult,
    onLoadMore,
    refreshPreloadData,
    loadPreloadData,
    loadMoreTribes,
    getAllAccounts,
})(TribeSearch)
