/**
 * This list view display the full list of notifications in
 * notification Panel
 *
 * @format
 */

import React from 'react'
import { View, FlatList, ActivityIndicator, Text } from 'react-native'
import { connect } from 'react-redux'

import moment from 'moment'
// Components
import NudgeCard from './NudgeCard'
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import EmptyResult from '../../Common/Text/EmptyResult'

// Actions
import {
    loadMoreNotifications,
    refreshNotifications,
} from '../../../redux/modules/notification/NotificationTabActions'

// Styles
import { color } from '../../../styles/basic'

const DEBUG_KEY = '[ UI NudgeListView ]'

class NudgeListView extends React.PureComponent {
    handleRefresh = () => {
        this.props.refreshNotifications({ refreshForUnreadNotif: true })
    }

    handleOnLoadMore = () => {
        this.props.loadMoreNotifications()
    }

    keyExtractor = (item) => item._id.toString()

    _keyExtractor = (item, index) => {
        return (
            this.props.index +
            '_' +
            index +
            '_' +
            item.id +
            '_' +
            moment().valueOf().toString()
        )
    }

    renderItem = ({ item }) => {
        return <NudgeCard item={item} />
    }

    renderListFooter() {
        const { loading, data } = this.props
        // console.log(`${DEBUG_KEY}: loading is: ${loadingMore}, data length is: ${data.length}`);
        if (loading && data.length >= 7) {
            return (
                <View
                    style={{
                        paddingVertical: 12,
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
                    data={this.props.nudgesData}
                    renderItem={this.renderItem}
                    // keyExtractor={this._keyExtractor}
                    listKey={(item, index) => 'D' + index.toString()}
                    onRefresh={this.handleRefresh}
                    refreshing={this.props.refreshing}
                    onEndReached={this.handleOnLoadMore}
                    onEndReachedThreshold={0}
                    ListEmptyComponent={
                        this.props.refreshing ? null : (
                            <View
                                style={{
                                    height: 50,
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text>You have no nudges</Text>
                            </View>
                        )
                    }
                    ListFooterComponent={this.renderListFooter()}
                    ItemSeparatorComponent={() => (
                        <View
                            style={{
                                borderWidth: 0.5,
                                borderColor: '#F1EEEE',
                            }}
                        ></View>
                    )}
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { notifications } = state.notification
    const { data, refreshing, loading } = notifications
    const { nudgesData } = state.nudges

    return {
        // data: data.filter(d => !d.parsedNoti.error),
        data,
        refreshing,
        loading,
        nudgesData,
    }
}

export default connect(mapStateToProps, {
    loadMoreNotifications,
    refreshNotifications,
})(NudgeListView)
