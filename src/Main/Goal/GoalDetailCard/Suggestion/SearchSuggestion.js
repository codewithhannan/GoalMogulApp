/** @format */

// This component provides search for suggestion for Tribe, Event, User, Friend,
// and Chat room
import React from 'react'
import { View, FlatList, Text, Animated, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { SearchBar } from 'react-native-elements'
import _ from 'lodash'

import { switchCaseF, switchCase } from '../../../../redux/middleware/utils'

// Components
import TribeCard from './TribeCard'
import UserCard from './UserCard'
import EventCard from './EventCard'
import ChatCard from './ChatCard'
import { SearchIcon } from '../../../../Utils/Icons'
import EmptyResult from '../../../Common/Text/EmptyResult'

// Actions
import {
    handleSearch,
    clearSearchState,
    refreshSearchResult,
    onLoadMore,
    refreshPreloadData,
    loadMorePreloadData,
} from '../../../../redux/modules/feed/comment/SuggestionSearchActions'

import { onSuggestionItemSelect } from '../../../../redux/modules/feed/comment/CommentActions'

import { getNewCommentByTab } from '../../../../redux/modules/feed/comment/CommentSelector'

// Constants
import { SUGGESTION_SEARCH_LIMIT } from '../../../../redux/modules/feed/comment/SuggestionSearchReducers'
import { arrayUnique } from '../../../../reducers/MeetReducers'

const DEBUG_KEY = '[ UI SearchSuggestion ]'

class SearchSuggestion extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            query: '',
        }
    }

    // Search Query handler
    handleSearchCancel = () => {
        console.log(`${DEBUG_KEY}: search cancel`)
        this.handleQueryChange('')
        this.props.clearSearchState()

        // This is a hacky way to work around SearchBar bug
        // We have to trigger focus again before calling blur
        this.searchBar.focus()
        this.searchBar.blur()
    }

    handleSearchClear = () => this.handleQueryChange('')

    handleQueryChange = (query) => {
        // this.setState(state => ({ ...state, query: query || '' }));
        if (query === undefined) {
            return
        }

        this.setState(
            {
                ...this.state,
                query,
            },
            () => {
                if (query === '') {
                    this.props.clearSearchState(this.props.selectedTab)
                    return
                }
                this.props.debouncedSearch(query.trim(), this.props.selectedTab)
            }
        )
    }

    handleRefresh = () => {
        const { searchType, searchContent } = this.props
        // If there is no search input and user refresh, we refresh the preload data
        if (searchContent === undefined || searchContent.trim() === '') {
            return this.props.refreshPreloadData(searchType)
        }
        this.props.refreshSearchResult()
    }

    handleLoadMore = () => {
        const { searchType, hasNextPage } = this.props
        if (hasNextPage === false) {
            this.props.loadMorePreloadData(searchType)
            return
        }
        this.props.onLoadMore()
    }

    renderItem = ({ item }) => {
        const { selectedItem, pageId } = this.props
        console.log('THIS IS SELECTED', selectedItem?._id === item._id)
        const selected = selectedItem && selectedItem?._id === item._id

        return switchCaseF({
            User: (
                <>
                    <UserCard
                        item={item}
                        onCardPress={(val) => {
                            this.props.onSuggestionItemSelect(val, pageId)
                            if (this.props.onSelect) {
                                this.props.onSelect()
                            }
                        }}
                        selected={selected}
                    />
                    <View
                        style={{
                            width: '82%',
                            height: 1,
                            alignSelf: 'flex-end',
                            marginRight: 15,
                            backgroundColor: 'lightgray',
                        }}
                    />
                </>
            ),
            Tribe: (
                <>
                    <TribeCard
                        item={item}
                        onCardPress={(val) => {
                            this.props.onSuggestionItemSelect(val, pageId)
                            if (this.props.onSelect) {
                                this.props.onSelect()
                            }
                        }}
                        selected={selected}
                    />
                    <View
                        style={{
                            // marginVertical: 5,
                            // position: 'absolute',
                            // bottom: -25,
                            width: '95%',
                            height: 1,
                            // alignSelf: 'flex-end',
                            // marginRight: 15,
                            alignSelf: 'center',
                            backgroundColor: 'lightgray',
                        }}
                    />
                </>
            ),
            Event: (
                <EventCard
                    item={item}
                    onCardPress={(val) => {
                        this.props.onSuggestionItemSelect(val, pageId)
                        if (this.props.onSelect) {
                            this.props.onSelect()
                        }
                    }}
                    selected={selected}
                />
            ),
            Friend: (
                <UserCard
                    item={item}
                    onCardPress={(val) => {
                        this.props.onSuggestionItemSelect(val, pageId)
                        if (this.props.onSelect) {
                            this.props.onSelect()
                        }
                    }}
                    selected={selected}
                />
            ),
            ChatConvoRoom: (
                <ChatCard
                    item={item}
                    selected={selected}
                    onCardPress={(val) => {
                        this.props.onSuggestionItemSelect(val, pageId)
                        if (this.props.onSelect) {
                            this.props.onSelect()
                        }
                    }}
                />
            ),
            Default: <View />,
        })('Default')(this.props.suggestionType)
    }

    renderSearch() {
        // const { suggestionType } = this.props
        // const placeholder =
        //     suggestionType === 'ChatConvoRoom'
        //         ? 'Search Chat Room'
        //         : `Search ${this.props.suggestionType}`
        return (
            <View style={{}}>
                <SearchBar
                    ref={(ref) => {
                        this.searchBar = ref
                    }}
                    platform="ios"
                    round
                    autoFocus={false}
                    inputStyle={styles.searchInputStyle}
                    inputContainerStyle={styles.searchInputContainerStyle}
                    containerStyle={styles.searchContainerStyle}
                    placeholder={'Search'}
                    placeholderTextColor={'lightgray'}
                    cancelButtonTitle="Cancel"
                    onCancel={this.handleSearchCancel}
                    onChangeText={this.handleQueryChange}
                    cancelButtonProps={{ color: '#17B3EC' }}
                    showLoading={this.props.loading}
                    onClear={this.handleSearchClear}
                    clearIcon={null}
                    searchIcon={() => (
                        <SearchIcon
                            iconContainerStyle={{
                                marginBottom: 3,
                                marginTop: 1,
                            }}
                            iconStyle={{
                                tintColor: 'gray',
                                height: 15,
                                width: 15,
                            }}
                        />
                    )}
                    value={this.state.query}
                />
            </View>
        )
    }

    renderListFooter() {
        const { loading, data } = this.props
        // console.log(`${DEBUG_KEY}: loading is: ${loadingMore}, data length is: ${data.length}`);
        if (loading && data.length >= SUGGESTION_SEARCH_LIMIT) {
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
        const { opacity, searchType } = this.props
        return (
            // <Animated.View style={{ opacity }}>

            <View
                style={{
                    flex: 1,
                    marginTop: 0.5,
                    backgroundColor: 'white',
                }}
            >
                {this.renderSearch()}
                <View
                    style={{
                        height: 10,
                        width: '100%',
                        marginVertical: 10,
                        backgroundColor: '#E5E5E5',
                    }}
                />
                {this.props.suggestionType === 'User' ? (
                    <>
                        <View
                            style={{ marginHorizontal: 10, marginVertical: 10 }}
                        >
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                All Others
                            </Text>
                        </View>
                        <View
                            style={{
                                width: '100%',
                                height: 1,
                                backgroundColor: 'lightgray',
                            }}
                        />
                    </>
                ) : null}
                <FlatList
                    data={this.props.data}
                    renderItem={this.renderItem}
                    keyExtractor={(item) => item._id}
                    onEndReached={() => this.handleLoadMore()}
                    onEndReachedThreshold={0}
                    onRefresh={() => this.handleRefresh()}
                    refreshing={this.props.refreshing}
                    ListFooterComponent={this.renderListFooter()}
                    ListEmptyComponent={
                        this.props.refreshing ? null : (
                            <EmptyResult
                                text={switchEmptyText(searchType)}
                                textStyle={{ paddingTop: 130 }}
                            />
                        )
                    }
                />
            </View>
            // </Animated.View>
        )
    }
}

const switchEmptyText = (searchType) =>
    switchCase({
        User: 'No user found',
        Event: 'No event found',
        Tribe: 'No tribe found',
        ChatConvoRoom: 'No chat room found',
    })('No search result')(searchType)

const styles = {
    // search related styles
    searchContainerStyle: {
        marginVertical: 10,
        width: '90%',
        padding: 0,
        marginTop: 15,
        // backgroundColor: 'gray',
        // backgroundColor: '#17B3EC',
        // borderTopColor: 'gray',
        // borderBottomColor: 'gray',
        borderWidth: 0.5,
        borderColor: 'lightgray',
        borderRadius: 5,
        alignSelf: 'center',
    },
    searchInputContainerStyle: {
        // backgroundColor: '#f3f4f6',
        backgroundColor: 'white',
        height: 10,
        alignItems: 'center',

        justifyContent: 'center',
    },
    searchInputStyle: {
        fontSize: 16,
    },
    searchIconStyle: {
        top: 15,
        fontSize: 13,
    },
}

const mapDispatchToProps = (dispatch) => {
    const debouncedSearch = _.debounce(
        (value, type) => dispatch(handleSearch(value, type)),
        400
    )

    return {
        debouncedSearch,
        clearSearchState: clearSearchState(dispatch),
        refreshSearchResult: () => dispatch(refreshSearchResult()),
        onLoadMore: () => dispatch(onLoadMore()),
        onSuggestionItemSelect: (val, pageId) =>
            dispatch(onSuggestionItemSelect(val, pageId)),
        refreshPreloadData: (searchType) =>
            dispatch(refreshPreloadData(searchType)),
        loadMorePreloadData: (searchType) =>
            dispatch(loadMorePreloadData(searchType)),
    }
}

const mapStateToProps = (state, props) => {
    const { suggestionType, selectedItem } = getNewCommentByTab(
        state,
        props.pageId
    ).tmpSuggestion
    const {
        searchRes,
        searchContent,
        preloadData,
        searchType,
    } = state.suggestionSearch
    const { data, loading, refreshing, hasNextPage } = searchRes

    let dataToRender = data
    let refreshingToUse = refreshing
    let loadingToUse = loading
    if (_.has(preloadData, searchType)) {
        // Get the preloaded data with the right path
        // e.g. User.data, Event.data...
        const preloadDataToRender = _.get(preloadData, `${searchType}.data`)
        const preloadDataLoadingState = _.get(
            preloadData,
            `${searchType}.loading`
        )
        const preloadDataRefreshingState = _.get(
            preloadData,
            `${searchType}.refreshing`
        )

        if (searchContent === undefined || searchContent.trim() === '') {
            // Use preload data when searchContent is empty
            dataToRender = preloadDataToRender
            refreshingToUse = preloadDataRefreshingState
        } else if (hasNextPage === false) {
            // Data concat with preload data when hasNextPage is false
            dataToRender = arrayUnique(data.concat(preloadDataToRender))
            loadingToUse = preloadDataLoadingState
        }
    }

    return {
        suggestionType,
        data: dataToRender,
        loading: loadingToUse,
        refreshing: refreshingToUse,
        searchContent,
        selectedItem,
        searchType,
        hasNextPage, // For handleLoadMore to determine whether to load more preload data or search data
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchSuggestion)
