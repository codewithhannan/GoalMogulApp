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
import { getOutgoingUserFromFriendship } from '../../../../redux/modules/meet/selector'

// Styles
import { color } from '../../../../styles/basic'

// Constants
import { MEET_REQUEST_LIMIT } from '../../../../reducers/MeetReducers'

// tab key
const routes = {
    outgoing: 'requests.outgoing',
    incoming: 'requests.incoming',
}
const route = routes.outgoing

const Tabs = [
    {
        name: 'Incoming',
        key: 'incoming',
    },
    {
        name: 'Outgoing',
        key: 'outgoing',
    },
]

const DEBUG_KEY = '[ UI OutgoingRequestTabView ]'

class OutgoingRequestTabView extends Component {
    componentDidMount() {
        const { data } = this.props
        if (!data || data.length === 0) {
            this.props.handleRefresh('requests.outgoing')
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
                                text={'No outgoing requests'}
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
    const { outgoing } = requests
    const { user } = state.user

    return {
        requests,
        data: getOutgoingUserFromFriendship(state),
        refreshing: outgoing.refreshing,
        user,
    }
}

export default connect(mapStateToProps, {
    handleRefresh,
    loadMoreRequest,
})(OutgoingRequestTabView)
