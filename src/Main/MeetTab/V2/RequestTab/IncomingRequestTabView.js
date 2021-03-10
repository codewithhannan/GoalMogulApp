/**
 * This view is a central hub for incoming and outgoing request for a user
 *
 * @format
 */

import React, { Component } from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

// Components
import FriendRequestCardView from '../FriendRequestCardView'
import EmptyResult from '../../../Common/Text/EmptyResult'

// actions
import { handleRefresh } from '../../../../actions'

import { loadMoreRequest } from '../../../../redux/modules/meet/MeetActions'

// Selectors
import { getIncomingUserFromFriendship } from '../../../../redux/modules/meet/selector'

// Styles
import { color } from '../../../../styles/basic'

// Constants
import { MEET_REQUEST_LIMIT } from '../../../../reducers/MeetReducers'

// tab key
const routes = {
    outgoing: 'requests.outgoing',
    incoming: 'requests.incoming',
}
const route = routes.incoming

const DEBUG_KEY = '[ UI IncomingRequestsTabView ]'

class IncomingRequestTabView extends Component {
    componentDidMount() {
        const { data } = this.props
        if (!data || data.length === 0) {
            this.props.handleRefresh('requests.incoming')
        }
    }

    handleRefresh = () => {
        console.log(`${DEBUG_KEY} Refreshing tab: `, route)
        this.props.handleRefresh(route)
    }

    handleOnLoadMore = () => {
        this.props.loadMoreRequest(route)
    }

    keyExtractor = (item) => item._id

    renderItem = ({ item }) => <FriendRequestCardView item={item} />

    renderListFooter() {
        const { loading, data } = this.props
        // console.log(`${DEBUG_KEY}: loading is: ${loadingMore}, data length is: ${data.length}`);
        if (loading && data.length >= MEET_REQUEST_LIMIT) {
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
        return (
            <View
                style={{ flex: 1, backgroundColor: color.GM_CARD_BACKGROUND }}
            >
                <FlatList
                    data={this.props.data}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    onRefresh={this.handleRefresh.bind(this)}
                    refreshing={this.props.refreshing}
                    onEndReached={this.handleOnLoadMore}
                    onEndReachedThreshold={0}
                    ListEmptyComponent={
                        this.props.refreshing ? null : (
                            <EmptyResult
                                text={'No incoming requests'}
                                textStyle={{ paddingTop: 220 }}
                            />
                        )
                    }
                    ListFooterComponent={this.renderListFooter()}
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { requests } = state.meet
    const { incoming } = requests
    const { user } = state.user

    return {
        requests,
        data: getIncomingUserFromFriendship(state),
        refreshing: incoming.refreshing,
        user,
    }
}

export default connect(mapStateToProps, {
    handleRefresh,
    loadMoreRequest,
})(IncomingRequestTabView)
