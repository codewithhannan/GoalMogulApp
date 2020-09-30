/** @format */

import React from 'react'
import {
    View,
    FlatList,
    TouchableOpacity,
    Text,
    ActivityIndicator,
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Actions } from 'react-native-router-flux'

// Actions
import {
    refreshTribe,
    loadMoreTribe,
} from '../../redux/modules/tribe/TribeTabActions'

// Components
import TribeCard from './TribeCard'
import TribeTabFilterBar from './TribeTabFilterBar'
import { wrapAnalytics, SCREENS } from '../../monitoring/segment'

class TribeTab extends React.Component {
    componentDidMount() {
        if (!this.props.data || _.isEmpty(this.props.data)) {
            this.handleOnRefresh()
        }
    }

    _keyExtractor = (item) => item._id

    handleOnRefresh = () => this.props.refreshTribe()

    handleOnLoadMore = () => this.props.loadMoreTribe()

    renderItem = ({ item }) => {
        return <TribeCard item={item} />
    }

    renderListHeader() {
        return <TribeTabFilterBar value={{ sortBy: this.props.sortBy }} />
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
                        Actions.push('myTribeTab', {
                            pageId: 'tribe_hub_pageId',
                            initial: { openNewTribeModal: true },
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
                        Create a Tribe
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
    const { data, loading, sortBy, refreshing } = state.tribeTab

    return {
        data,
        // data: [],
        refreshing,
        loading,
        sortBy,
    }
}

export default connect(mapStateToProps, {
    refreshTribe,
    loadMoreTribe,
})(wrapAnalytics(TribeTab, SCREENS.EXPLORE_TRIBE_TAB))
