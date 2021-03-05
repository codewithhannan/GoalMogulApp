/** @format */

// This is a tab for General search
import React, { Component } from 'react'
import { View, FlatList } from 'react-native'
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

// tab key
const TYPE = 'Tribe' // Used for preload function
const key = 'tribes'
const DEBUG_KEY = '[ Component TribeSearch ]'

class TribeSearch extends Component {
    componentDidMount() {
        if (this.props.shouldPreload) {
            this.props.refreshPreloadData(TYPE)
        }
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

    renderItem = ({ item }) => {
        return (
            <TribeSearchCard
                item={item}
                type={this.props.type}
                callback={this.props.callback}
                onItemSelect={this.props.onItemSelect}
            />
        )
    }

    render() {
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
    }
}

export default connect(mapStateToProps, {
    refreshSearchResult,
    onLoadMore,
    refreshPreloadData,
    loadPreloadData,
})(TribeSearch)
