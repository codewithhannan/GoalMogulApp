/** @format */

import React, { Component } from 'react'
import { View, FlatList } from 'react-native'
import { connect } from 'react-redux'

// Components
import MeetFilterBar from './MeetFilterBar'
import SuggestedCard from './Suggested/SuggestedCard'
import EmptyResult from '../Common/Text/EmptyResult'

// actions
import { handleRefresh, meetOnLoadMore } from '../../actions'

// tab key
const key = 'suggested'
const DEBUG_KEY = '[ Component Suggested ]'

class Suggested extends Component {
    constructor(props) {
        super(props)
        this.handleRefresh = this.handleRefresh.bind(this)
    }

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

    renderItem = ({ item }) => <SuggestedCard item={item} />

    render() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={this.props.data}
                    renderItem={this.renderItem}
                    keyExtractor={this._keyExtractor}
                    onEndReached={this.handleOnLoadMore}
                    onEndReachedThreshold={0}
                    onRefresh={this.handleRefresh}
                    refreshing={this.props.loading}
                    ListEmptyComponent={
                        this.props.loading ? null : (
                            <EmptyResult text={'No Recommendations'} />
                        )
                    }
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { suggested } = state.meet
    const { data, refreshing, loading } = suggested

    return {
        suggested,
        data,
        refreshing,
        loading,
    }
}

export default connect(mapStateToProps, {
    handleRefresh,
    meetOnLoadMore,
})(Suggested)
