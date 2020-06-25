/** @format */

import React, { Component } from 'react'
import { View, FlatList } from 'react-native'
import { connect } from 'react-redux'

// Selector
import { getFilteredFriendsList } from '../../redux/modules/meet/selector'

// Components
import FriendsFilterBar from './Friends/FriendsFilterBar'
import FriendCard from './Friends/FriendCard'
import EmptyResult from '../Common/Text/EmptyResult'

// actions
import { handleRefresh, meetOnLoadMore } from '../../actions'

// tab key
const key = 'friends'
const DEBUG_KEY = '[ Component Friends ]'

class Friends extends Component {
    componentDidMount() {
        this.handleRefresh()
    }

    _keyExtractor = (item) => item._id

    handleRefresh = () => {
        console.log(`${DEBUG_KEY} Refreshing tab: `, key)
        this.props.handleRefresh(key)
    }

    handleOnLoadMore = () => {
        console.log(`${DEBUG_KEY} Loading more for tab: `, key)
        this.props.meetOnLoadMore(key)
    }

    renderItem = ({ item }) => <FriendCard item={item} />

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={this.props.data}
                        renderItem={this.renderItem}
                        keyExtractor={this._keyExtractor}
                        onRefresh={this.handleRefresh.bind()}
                        refreshing={this.props.refreshing}
                        onEndReached={this.handleOnLoadMore}
                        onEndReachedThreshold={0}
                        ListEmptyComponent={
                            this.props.refreshing ? null : (
                                <EmptyResult
                                    text={"You haven't added any friends"}
                                />
                            )
                        }
                    />
                </View>
                {/*
          onEndReached={this.onLoadMore}
        */}
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { friends } = state.meet
    const { refreshing } = friends

    return {
        friends,
        data: getFilteredFriendsList(state),
        refreshing,
    }
}

export default connect(mapStateToProps, {
    handleRefresh,
    meetOnLoadMore,
})(Friends)
