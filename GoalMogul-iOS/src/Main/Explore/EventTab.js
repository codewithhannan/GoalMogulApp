/** @format */

import React from 'react'
import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Actions } from 'react-native-router-flux'

// Actions
import {
    refreshEvent,
    loadMoreEvent,
} from '../../redux/modules/event/EventTabActions'

// Components
import EventCard from './EventCard'
import EventTabFilterBar from './EventTabFilterBar'
import EmptyResult from '../Common/Text/EmptyResult'
import { wrapAnalytics, SCREENS } from '../../monitoring/segment'

class EventTab extends React.Component {
    componentDidMount() {
        if (!this.props.data || _.isEmpty(this.props.data)) {
            this.handleOnRefresh()
        }
    }

    _keyExtractor = (item) => item._id

    handleOnRefresh = () => this.props.refreshEvent()

    handleOnLoadMore = () => this.props.loadMoreEvent()

    renderItem = ({ item }) => {
        return <EventCard item={item} />
    }

    renderListHeader() {
        return <EventTabFilterBar value={{ sortBy: this.props.sortBy }} />
    }

    renderListEmptyComponent() {
        if (this.props.loading) {
            return null
        }
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Text
                    style={{
                        paddingTop: 100,
                        fontSize: 17,
                        fontWeight: '600',
                        color: '#818181',
                    }}
                >
                    No Recommendations
                </Text>
                <TouchableOpacity
                    onPress={() =>
                        Actions.push('myEventTab', {
                            initial: { openNewEventModal: true },
                        })
                    }
                    style={{
                        height: 40,
                        width: 'auto',
                        padding: 10,
                        marginTop: 20,
                        borderRadius: 5,
                        borderWidth: 0.5,
                        borderColor: 'lightgray',
                        justifyContent: 'center',
                    }}
                    activeOpacity={0.6}
                >
                    <Text
                        style={{
                            color: 'gray',
                            fontSize: 13,
                            fontWeight: '600',
                        }}
                    >
                        Create an Event
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderListFooter() {
        if (!this.props.loading) return null
        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: '#CED0CE',
                }}
            >
                <ActivityIndicator animating size="small" />
            </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={this.props.data}
                    renderItem={this.renderItem}
                    numColumns={1}
                    keyExtractor={this._keyExtractor}
                    refreshing={this.props.loading}
                    onRefresh={this.handleOnRefresh}
                    onEndReached={this.handleOnLoadMore}
                    ListHeaderComponent={this.renderListHeader.bind(this)}
                    ListEmptyComponent={this.renderListEmptyComponent.bind(
                        this
                    )}
                    ListFooterComponent={this.renderListFooter.bind(this)}
                    onEndThreshold={0}
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { data, loading, sortBy, refreshing } = state.eventTab

    return {
        data,
        // data: [],
        loading,
        sortBy,
        refreshing,
    }
}

export default connect(mapStateToProps, {
    refreshEvent,
    loadMoreEvent,
})(wrapAnalytics(EventTab, SCREENS.EXPLORE_EVENT_TAB))
