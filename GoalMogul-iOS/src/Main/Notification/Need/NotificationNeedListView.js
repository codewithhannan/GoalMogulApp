/**
 * This list view display the full list of friends' needs in notification panel
 *
 * @format
 */

import React from 'react'
import { View, ActivityIndicator, FlatList } from 'react-native'
import { connect } from 'react-redux'

// Components
import NotificationNeedCard from './NotificationNeedCard'
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import EmptyResult from '../../Common/Text/EmptyResult'

// Actions
import {
    refreshNeeds,
    loadMoreNeeds,
} from '../../../redux/modules/notification/NotificationTabActions'

// Styles
import { color } from '../../../styles/basic'

class NotificationNeedListView extends React.PureComponent {
    handleRefresh = () => {
        this.props.refreshNeeds()
    }

    handleOnLoadMore = () => {
        this.props.loadMoreNeeds()
    }

    keyExtractor = (item) => item._id

    renderItem = ({ item }) => {
        return <NotificationNeedCard item={item} />
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
            <View style={{ flex: 1, backgroundColor: color.GM_BACKGROUND }}>
                <SearchBarHeader backButton title="Need feed" />
                <FlatList
                    data={this.props.data}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    onRefresh={this.handleRefresh}
                    refreshing={this.props.refreshing}
                    onEndReached={this.handleOnLoadMore}
                    onEndReachedThreshold={0}
                    ListEmptyComponent={
                        this.props.refreshing ? null : (
                            <EmptyResult
                                text={'You have no need feed'}
                                textStyle={{ paddingTop: 200 }}
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
    const { needs } = state.notification
    const { data, refreshing, loading } = needs

    return {
        data,
        refreshing,
        loading,
    }
}

export default connect(mapStateToProps, {
    refreshNeeds,
    loadMoreNeeds,
})(NotificationNeedListView)
