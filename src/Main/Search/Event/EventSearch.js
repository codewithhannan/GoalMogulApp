/** @format */

// This is a tab for General search
import React, { Component } from 'react'
import { View, FlatList } from 'react-native'
import { connect } from 'react-redux'

// Components
import EventSearchCard from './EventSearchCard'
import EmptyResult from '../../Common/Text/EmptyResult'

// actions
import {
    refreshSearchResult,
    onLoadMore,
    refreshPreloadData,
    loadPreloadData,
} from '../../../redux/modules/search/SearchActions'

// tab key
const TYPE = 'Event' // Used for preload function
const key = 'events'
const DEBUG_KEY = '[ Component EventSearch ]'

class EventSearch extends Component {
    componentDidMount() {
        if (this.props.shouldPreload) {
            this.props.refreshPreloadData(TYPE)
        }
    }

    _keyExtractor = (item) => item._id

    handleRefresh = () => {
        console.log(`${DEBUG_KEY} Refreshing search: `, key)
        let keyToUse = key
        if (this.props.type !== 'GeneralSearch') {
            keyToUse = 'myEvents'
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
        }
    }

    handleOnLoadMore = () => {
        console.log(`${DEBUG_KEY} Loading more for search: `, key)
        let keyToUse = key
        if (this.props.type !== 'GeneralSearch') {
            keyToUse = 'myEvents'
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
            <EventSearchCard
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
                        refreshing={this.props.refreshing}
                    />
                )}
            </View>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { events, searchContent } = state.search

    let data, refreshing, loading
    const { shouldPreload } = props
    if (shouldPreload && (!searchContent || searchContent.trim() === '')) {
        // Display preload data when search content is null and shouldPreload is true
        data = events.preload.data
        refreshing = events.preload.refreshing
        loading = events.preload.loading
    } else {
        data = events.data
        refreshing = events.refreshing
        loading = events.loading
    }

    return {
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
})(EventSearch)
