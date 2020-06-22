/** @format */

import React, { Component } from 'react'
import { View, Modal, FlatList, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

// Component
import ModalHeader from '../Common/Header/ModalHeader'
import EmptyResult from '../Common/Text/EmptyResult'
import FriendCard from '../MeetTab/Friends/FriendCard'

// actions
import { fetchMutualFriends, openProfile } from '../../actions'

// Selectors
import {
    getUserData,
    getUserDataByPageId,
} from '../../redux/modules/User/Selector'

const DEBUG_KEY = '[ UI MutualFriends ]'

class MutualFriends extends Component {
    state = {
        modalVisible: false,
    }

    componentDidMount() {
        this.openModal()
        if (this.props.userId) {
            this.props.fetchMutualFriends(this.props.userId, true)
        }
    }

    openModal() {
        this.setState({ modalVisible: true })
    }

    closeModal() {
        this.setState({ modalVisible: false })
    }

    handleRefresh = () => {
        this.props.fetchMutualFriends(this.props.userId, true)
    }

    handleOnLoadMore = () => {
        this.props.fetchMutualFriends(this.props.userId, false)
    }

    handleOnItemSelect = (user) => {
        if (user && user._id) {
            Actions.pop()
            this.props.openProfile(user._id)
            return
        }
    }

    _keyExtractor = (item) => item._id

    renderItem = (props) => {
        const { item } = props
        return (
            <FriendCard
                item={item}
                onItemSelect={() => this.handleOnItemSelect(item)}
            />
        )
    }

    renderListFooter() {
        const { loading, data } = this.props
        // console.log(`${DEBUG_KEY}: loading is: ${loadingMore}, data length is: ${data.length}`);
        if (loading && data.length >= 4) {
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
        const emptyText = this.props.isSelf
            ? 'You have no friends.'
            : 'You have no mutual friends.'
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}
            >
                <ModalHeader
                    title={`${this.props.user.name}\'s Friends`}
                    actionText=""
                    onCancel={() => {
                        this.closeModal()
                        Actions.pop()
                    }}
                    cancelText="Close"
                />
                <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
                    <FlatList
                        data={this.props.data}
                        renderItem={this.renderItem}
                        keyExtractor={this._keyExtractor}
                        onRefresh={this.handleRefresh.bind()}
                        refreshing={this.props.refreshing}
                        onEndReached={this.handleOnLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={this.renderListFooter()}
                        ListEmptyComponent={
                            this.props.loading ? null : (
                                <EmptyResult text={emptyText} />
                            )
                        }
                    />
                </View>
            </Modal>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { userId } = props
    const userObject = getUserData(state, userId, '')
    const { user, mutualFriends } = userObject

    console.log(`${DEBUG_KEY}: mutual friend is: `, mutualFriends)
    const { data, loading, count, refreshing } = mutualFriends
    const isSelf = userId.toString() === state.user.userId.toString()

    return {
        count,
        data,
        loading,
        refreshing,
        userId,
        isSelf,
        user,
    }
}

export default connect(mapStateToProps, {
    fetchMutualFriends,
    openProfile,
})(MutualFriends)
