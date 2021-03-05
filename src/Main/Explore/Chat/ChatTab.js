/**
 * This is the file for People tab in discovery tab
 *
 * @format
 */

import React from 'react'
import { View, FlatList, Text, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Actions } from 'react-native-router-flux'

// Actions
import {
    exploreRefreshTab,
    exploreLoadMoreTab,
} from '../../../redux/modules/explore/ExploreActions'

// Selectors
import { makeGetUsers } from '../../../redux/modules/explore/selector'

// Components
import ChatRoomCard from '../../Chat/ChatRoomList/ChatRoomCard'
import DelayedButton from '../../Common/Button/DelayedButton'
import { componentKeyByTab } from '../../../redux/middleware/utils'
import { wrapAnalytics, SCREENS } from '../../../monitoring/segment'

const TAB_KEY = 'chatRooms'
const DEBUG_KEY = '[ UI Explore.ChatTab ]'

class ChatTab extends React.Component {
    componentDidMount() {
        if (!this.props.data || _.isEmpty(this.props.data)) {
            this.handleOnRefresh()
        }
    }

    _keyExtractor = (item) => item._id

    handleOnRefresh = () => this.props.exploreRefreshTab(TAB_KEY)

    handleOnLoadMore = () => this.props.exploreLoadMoreTab(TAB_KEY)

    handleItemSelect = (item) => {
        const { userId, tab } = this.props
        if (!item) {
            console.warn(
                `${DEBUG_KEY}: [ handleItemSelect ]: Invalid item: `,
                item
            )
            return
        }

        if (item.roomType === 'Direct') {
            Actions.push('chatRoomConversation', { chatRoomId: item._id })
            return
        }

        const isMember =
            item.members &&
            item.members.find(
                (memberDoc) =>
                    memberDoc.memberRef._id == userId &&
                    (memberDoc.status == 'Admin' ||
                        memberDoc.status == 'Member')
            )
        if (isMember) {
            Actions.push('chatRoomConversation', { chatRoomId: item._id })
            return
        }

        // User is a non-member. Open ChatRoomPublicView
        const componentKey = componentKeyByTab(tab, 'chatRoomPublicView')
        Actions.push(`${componentKey}`, {
            chatRoomId: item._id,
            path: 'explore.chatRooms.data',
        })
    }

    renderItem = ({ item }) => {
        return (
            <ChatRoomCard
                item={item}
                onItemSelect={this.handleItemSelect}
                renderDescription
            />
        )
    }

    renderListEmptyComponent() {
        if (this.props.refreshing) {
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
                <DelayedButton
                    onPress={() => {
                        Actions.jump('chatTab')
                        setTimeout(() => {
                            Actions.push('createChatRoomStack')
                        }, 300)
                    }}
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
                        Create a group chat
                    </Text>
                </DelayedButton>
            </View>
        )
    }

    renderListHeader() {
        return null
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
                    refreshing={this.props.refreshing}
                    onRefresh={this.handleOnRefresh}
                    onEndReached={this.handleOnLoadMore}
                    ListHeaderComponent={this.renderListHeader()}
                    ListEmptyComponent={this.renderListEmptyComponent()}
                    ListFooterComponent={this.renderListFooter.bind(this)}
                    onEndThreshold={0}
                />
            </View>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { refreshing, loading, data } = state.explore.chatRooms
    const { tab } = state.navigation
    const { userId } = state.user

    return {
        data,
        loading,
        refreshing,
        userId,
        tab,
    }
}

export default connect(mapStateToProps, {
    exploreRefreshTab,
    exploreLoadMoreTab,
})(wrapAnalytics(ChatTab, SCREENS.EXPLORE_CHAT_TAB))
