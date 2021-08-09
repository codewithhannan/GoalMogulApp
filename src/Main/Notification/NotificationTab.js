/** @format */

import React, { Component } from 'react'
import { View, FlatList, Text } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Actions } from 'react-native-router-flux'

// Components
import SearchBarHeader from '../Common/Header/SearchBarHeader'
import NotificationCard from './Notification/NotificationCard'
import NotificationNeedCard from './Need/NotificationNeedCard'
import EmptyResult from '../Common/Text/EmptyResult'
import DelayedButton from '../Common/Button/DelayedButton'
import InviteFriendModal from '../MeetTab/Modal/InviteFriendModal'

// Actions
import {
    refreshNeeds,
    refreshNotificationTab,
    loadMoreNotifications,
    markAllNotificationAsRead,
} from '../../redux/modules/notification/NotificationTabActions'

import { getAllNudges } from '../../actions/NudgeActions'

// Selectors
import { getNotificationNeeds } from '../../redux/modules/notification/NotificationSelector'

// Styles
import { color, default_style, text } from '../../styles/basic'
import PrivateGoalsToast from '../../components/PrivateGoalsToast'
import NudgeCard from './Nudge/NudgeCard'
import NudgeListView from './Nudge/NudgeListView'

// Constants
const DEBUG_KEY = '[ UI NotificationTab ]'

class NotificationTab extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showInviteFriendModal: false,
        }
    }

    componentDidMount() {
        const { token } = this.props
        // Refresh notification tab
        console.log(`${DEBUG_KEY}: component did mount`)
        if (!this.props.data || _.isEmpty(this.props.data.length)) {
            this.props.refreshNotificationTab()
            this.props.getAllNudges(token)
        }
    }

    componentDidUpdate(prevProps) {
        // When notification finishes refreshing and
        // user is at the notification tab.
        // Then send mark all as read

        const justFinishRefreshing =
            prevProps.refreshing === true && this.props.refreshing === false
        const userOnNotificationPage =
            this.props.shouldUpdateUnreadCount === false

        if (justFinishRefreshing && userOnNotificationPage) {
            this.props.markAllNotificationAsRead()
        }
    }

    keyExtractor = (item) => item._id

    handleRefresh = () => {
        this.props.refreshNotificationTab()
        this.props.refreshNeeds()
        this.props.getAllNudges()
    }

    handleOnLoadMore = () => {
        this.props.loadMoreNotifications()
    }

    openInviteFriendModal = () => {
        this.setState({ ...this.state, showInviteFriendModal: true })
    }

    closeInviteFriendModal = () => {
        this.setState({ ...this.state, showInviteFriendModal: false })
    }

    renderSectionTitle = (item) => {
        return (
            <View style={styles.titleComponentContainerStyle}>
                <Text style={default_style.titleText_1}>{item.text}</Text>
            </View>
        )
    }

    // handleRefreshSeeMoreButton = () => {
    //     const { token, nudgesLoading } = this.props
    //     this.props.getAllNudges(token)
    // }

    handleNudgeHeader = () => {
        if (this.props.nudgesData.length > 0) {
            return (
                this.renderSectionTitle({
                    text: "You've been nudged",
                    type: 'header',
                    length: 1,
                }),
                this.renderNudge()
            )
        }
    }

    renderHeader = ({ item }) => {
        return (
            <View style={{ flex: 1, backgroundColor: color.GM_BACKGROUND }}>
                {/* {this.props.nudgesData.length > 0
                    ? (this.renderSectionTitle({
                          text: "You've been nudged",
                          type: 'header',
                          length: 1,
                      }),
                      this.renderNudge())
                    : null} */}
                {this.handleNudgeHeader()}
                {this.renderSectionTitle({
                    text: 'Things your friends need',
                    type: 'header',
                    length: 1,
                })}

                {this.renderFriendsNeeds()}
                {this.renderSectionTitle({
                    text: 'Notifications',
                    type: 'header',
                    length: 1,
                })}
            </View>
        )
    }

    renderSeeMoreButton() {
        return (
            <View
                style={{
                    borderColor: 'lightgrey',
                    borderWidth: 0.3,
                    justifyContent: 'center',
                }}
            >
                <DelayedButton
                    style={{
                        width: '90%',
                        backgroundColor: '#F2F2F2',
                        alignItems: 'center',

                        paddingVertical: 12,
                        marginBottom: 8,
                        marginTop: 8,

                        borderRadius: 3,
                        marginHorizontal: 20,
                        justifyContent: 'center',
                    }}
                    onPress={this.openInviteFriendModal}
                >
                    <Text
                        style={
                            (default_style.buttonText_1,
                            {
                                color: color.TEXT_COLOR.DARK,
                                fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                            })
                        }
                    >
                        See More
                    </Text>
                </DelayedButton>
            </View>
        )
    }

    renderNudge() {
        return (
            <>
                <View style={styles.titleComponentContainerStyle}>
                    <Text style={default_style.titleText_1}>
                        You've been nudged
                    </Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'white',
                        marginBottom: 10,
                    }}
                >
                    <NudgeListView />

                    {/* {this.renderSeeMoreButton()} */}
                </View>
            </>
        )
    }

    renderNeeds({ item }) {
        return <NotificationNeedCard item={item} />
    }

    renderItem({ item }) {
        if (item.type === 'empty') {
            return (
                <View
                    style={{
                        backgroundColor: 'white',
                        height: '100%',
                        width: '100%',
                        alignItems: 'center',
                    }}
                >
                    <EmptyResult
                        text="You have no notifications"
                        textStyle={{ paddingTop: 120 }}
                    />
                </View>
            )
        }
        return <NotificationCard item={item} />
    }

    renderFriendsNeeds() {
        if (this.props.needData.length < 2 && !this.props.refreshing) {
            return (
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        backgroundColor: color.GM_CARD_BACKGROUND,
                        paddingTop: 35,
                        paddingBottom: 10,
                        marginBottom: 10,
                    }}
                >
                    <View style={{ marginBottom: 10 }}>
                        <Text style={default_style.titleText_1}>
                            You don't have many friends yet
                        </Text>
                    </View>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={default_style.subTitleText_2}>
                            Invite some friends to share their goals with you!
                        </Text>
                    </View>

                    <DelayedButton
                        style={{
                            width: '90%',
                            backgroundColor: color.GM_BLUE,
                            alignItems: 'center',
                            paddingVertical: 12,
                            marginBottom: 30,
                            borderRadius: 3,
                        }}
                        onPress={this.openInviteFriendModal}
                    >
                        <Text
                            style={
                                (default_style.buttonText_1,
                                {
                                    color: color.TEXT_COLOR.LIGHT,
                                    fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                                })
                            }
                        >
                            Invite My Friends
                        </Text>
                    </DelayedButton>
                </View>
            )
        } else {
            return (
                <View>
                    <FlatList
                        data={this.props.needData.slice(0, 2)}
                        renderItem={this.renderNeeds}
                        keyExtractor={this.keyExtractor}
                    />
                    <DelayedButton
                        style={{
                            backgroundColor: color.GM_CARD_BACKGROUND,
                            alignItems: 'center',
                            paddingVertical: 12,
                            marginBottom: 8,
                        }}
                        onPress={() => {
                            Actions.push('notificationNeedList')
                        }}
                        activeOpacity={0.6}
                    >
                        <Text style={default_style.buttonText_1}>See More</Text>
                    </DelayedButton>
                </View>
            )
        }
    }

    render() {
        const { notifData, refreshing } = this.props
        let dataToRender = notifData
        if ((_.isEmpty(notifData) || notifData.length === 0) && !refreshing) {
            //if (true) {
            dataToRender = [{ type: 'empty', _id: 'empty' }]
        }

        return (
            <View style={{ flex: 1 }}>
                <SearchBarHeader rightIcon="menu" />
                <FlatList
                    style={{
                        backgroundColor: color.GM_BACKGROUND,
                        paddingBottom: 0,
                        marginBottom: 0,
                    }}
                    data={dataToRender}
                    renderItem={this.renderItem}
                    ListHeaderComponent={this.renderHeader}
                    keyExtractor={this.keyExtractor}
                    onRefresh={this.handleRefresh}
                    onEndReached={this.handleOnLoadMore}
                    onEndReachedThreshold={2}
                    refreshing={refreshing}
                />
                <InviteFriendModal
                    isVisible={this.state.showInviteFriendModal | false}
                    closeModal={this.closeInviteFriendModal}
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const notificationNeedData = getNotificationNeeds(state)
    const { needs, notifications, unread } = state.notification
    const { shouldUpdateUnreadCount } = unread
    const { token } = state.auth.user
    const { loading: nudgesLoading } = state.nudges
    const { nudgesData } = state.nudges

    return {
        refreshing: needs.refreshing || notifications.refreshing,
        notifData: notifications.data,
        needData: notificationNeedData,
        loading: notifications.loading,
        shouldUpdateUnreadCount,
        token,
        nudgesLoading,
        nudgesData,
    }
}

const styles = {
    iconStyle: {
        alignSelf: 'center',
        height: 15,
        width: 20,
        marginLeft: 5,
    },
    titleComponentContainerStyle: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: color.GM_CARD_BACKGROUND,
        marginBottom: 1,
    },
}

export default connect(
    mapStateToProps,
    {
        refreshNotificationTab,
        loadMoreNotifications,
        refreshNeeds,
        markAllNotificationAsRead,
        getAllNudges,
    },
    null,
    { withRef: true }
)(NotificationTab)
