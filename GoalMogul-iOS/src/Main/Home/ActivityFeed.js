/** @format */

import React, { Component } from 'react'
import { View, FlatList, ActivityIndicator, Image, Text } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import LionMascot from '../../asset/image/LionMascot_shadow.png'
import TribeEmptyState from '../../asset/image/TribeEmptyState.png'

// Components
import ActivityCard from '../Activity/ActivityCard'
import EmptyResult from '../Common/Text/EmptyResult'
import InviteFriendModal from '../MeetTab//Modal/InviteFriendModal'

import {
    openPostDetail,
    markUserViewPost,
} from '../../redux/modules/feed/post/PostActions'
import {
    loadMoreFeed,
    loadUserInvitedFriendsCount,
} from '../../redux/modules/home/feed/actions'
import { markUserViewGoal } from '../../redux/modules/goal/GoalDetailActions'
import { openGoalDetail } from '../../redux/modules/home/mastermind/actions'

import { color, default_style } from '../../styles/basic'
import { wrapAnalytics, SCREENS } from '../../monitoring/segment'
import { ActivityGhost } from '../Common/Ghosts'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Actions } from 'react-native-router-flux'

const TAB_KEY = 'activityfeed'
const DEBUG_KEY = '[ UI ActivityFeed ]'

class ActivityFeed extends Component {
    constructor(props) {
        super(props)

        // Same config is used in Mastermind.js
        this.viewabilityConfig = {
            waitForInteraction: true,
            itemVisiblePercentThreshold: 100,
            minimumViewTime: 1500,
        }
        this.state = {
            showInviteFriendModal: false,
        }
    }

    componentDidMount() {
        if (this.props.data && this.props.data.length) {
            this.props.loadUserInvitedFriendsCount()
        }
    }
    componentDidUpdate() {
        if (this.props.data && this.props.data.length) {
            this.props.loadUserInvitedFriendsCount()
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(this.props, nextProps) ||
            !_.isEqual(this.state, nextState)
        )
    }

    handleOnViewableItemsChanged = ({ viewableItems, changed }) => {
        if (!this.props.loading) {
            viewableItems.map(({ item }) => {
                if (item.postRef) {
                    const postId = item.postRef._id
                    this.props.markUserViewPost(postId)
                } else if (item.goalRef) {
                    const goalId = item.goalRef._id
                    this.props.markUserViewGoal(goalId)
                }
            })
        }
    }

    handleOnLoadMore = () => this.props.loadMoreFeed()

    _keyExtractor = (item) => item._id

    openInviteFriendModal = () => {
        this.setState({ showInviteFriendModal: true })
    }

    closeInviteFriendModal = () => {
        this.setState({ showInviteFriendModal: false })
    }

    renderInviteFreindsButton() {
        return [
            <TouchableWithoutFeedback
                onPress={this.openInviteFriendModal}
                style={{
                    backgroundColor: color.GM_BLUE,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    marginTop: 12,
                    borderRadius: 3,
                }}
            >
                <Text
                    style={{
                        ...default_style.buttonText_1,
                        color: color.TEXT_COLOR.LIGHT,
                        textAlign: 'center',
                    }}
                >
                    Invite Friends
                </Text>
            </TouchableWithoutFeedback>,
            <InviteFriendModal
                isVisible={this.state.showInviteFriendModal}
                closeModal={this.closeInviteFriendModal}
            />,
        ]
    }

    renderInviteSomeFreindsCard() {
        return (
            <View
                style={{
                    backgroundColor: color.GM_CARD_BACKGROUND,
                    marginTop: 8,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    paddingHorizontal: 96,
                    paddingVertical: 24,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        width: 120,
                    }}
                >
                    <Image
                        source={LionMascot}
                        style={{
                            height: 136,
                            width: 90,
                            resizeMode: 'contain',
                        }}
                    />
                </View>
                <View style={{}}>
                    <Text
                        style={{
                            ...default_style.titleText_1,
                        }}
                    >
                        Your feed has no activity
                    </Text>
                    <Text
                        style={{
                            ...default_style.normalText_1,
                            marginTop: 12,
                        }}
                    >
                        Enjoy sharing your goals with friends to make your
                        friendships more fulfilling!
                    </Text>
                    {this.renderInviteFreindsButton()}
                </View>
            </View>
        )
    }

    renderGetYourSilverBadgeCard() {
        return (
            <View
                style={{
                    backgroundColor: color.GM_CARD_BACKGROUND,
                    marginTop: 8,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    paddingHorizontal: 96,
                    paddingVertical: 24,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        width: 120,
                        alignItems: 'center',
                    }}
                >
                    <Image
                        source={LionMascot}
                        style={{
                            height: 136,
                            width: 90,
                            resizeMode: 'contain',
                        }}
                    />
                </View>
                <View style={{}}>
                    <Text
                        style={{
                            ...default_style.titleText_1,
                        }}
                    >
                        Invite {7 - this.props.userInvitedFriendsCount} more
                        friends to get your Silver badge!
                    </Text>
                    <Text
                        style={{
                            ...default_style.normalText_1,
                            marginTop: 12,
                        }}
                    >
                        {this.props.randomNumber > 0.5
                            ? 'Help each other crush your goals, bring new energy to old friendships.'
                            : 'Sharing goals will bring you closer to your friends.'}
                    </Text>
                    {this.renderInviteFreindsButton()}
                </View>
            </View>
        )
    }

    renderJoinSomeTribesCard() {
        return (
            <View
                style={{
                    backgroundColor: color.GM_CARD_BACKGROUND,
                    marginTop: 8,
                    justifyContent: 'center',
                    paddingVertical: 8,
                }}
            >
                <View
                    style={{
                        width: '100%',
                        borderBottomColor: color.GM_LIGHT_GRAY,
                        borderBottomWidth: 1,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                    }}
                >
                    <Text
                        style={{
                            ...default_style.titleText_1,
                        }}
                    >
                        Browse our Community
                    </Text>
                </View>
                <View
                    style={{
                        paddingHorizontal: 16,
                        justifyContent: 'center',
                    }}
                >
                    <View
                        style={{
                            alignItems: 'center',
                            paddingVertical: 24,
                        }}
                    >
                        <Image
                            source={TribeEmptyState}
                            style={{
                                height: 160,
                                resizeMode: 'contain',
                            }}
                        />
                    </View>
                    <Text
                        style={{
                            ...default_style.titleText_2,
                            textAlign: 'center',
                            lineHeight: 24,
                        }}
                    >
                        Join our encouraging community of achievers.{'\n'}
                        Pay it forward and brighten someone’s day!{'\n'}
                        Join a Tribe and help someone.{'\n'}
                    </Text>
                    <TouchableWithoutFeedback
                        onPress={() => Actions.push('tribeDiscover')}
                        style={{
                            backgroundColor: color.GM_LIGHT_GRAY,
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                            borderRadius: 3,
                            width: '100%',
                            marginBottom: 24,
                        }}
                    >
                        <Text
                            style={{
                                ...default_style.buttonText_1,
                                color: color.TEXT_COLOR.DARK,
                                textAlign: 'center',
                            }}
                        >
                            Discover Tribes
                        </Text>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }

    renderItem = ({ item }) => {
        if (item.cardType == 'InviteSomeFriends') {
            return this.renderInviteSomeFreindsCard()
        } else if (item.cardType == 'JoinSomeTribes') {
            return this.renderJoinSomeTribesCard()
        } else if (item.cardType == 'GetYourSilverBadge') {
            return this.renderGetYourSilverBadgeCard()
        }
        // TODO: render item
        return (
            <ActivityCard
                item={item}
                onPress={(curItem, isGoal, options = {}) => {
                    const { shouldNotFocusCommentBox } = options
                    if (isGoal) {
                        // Open goal and focus on comment
                        const initialProps = {
                            focusType: 'comment',
                            focusRef: undefined,
                            initialShowSuggestionModal: false,
                            initialFocusCommentBox: !shouldNotFocusCommentBox,
                        }
                        return this.props.openGoalDetail(curItem, initialProps)
                    }
                    const initialProps = {
                        initialFocusCommentBox: !shouldNotFocusCommentBox,
                    }
                    this.props.openPostDetail(curItem, initialProps)
                }}
                onShareCallback={() => this.scrollToTop()}
            />
        )
    }

    renderListFooter() {
        const { loadingMore, data } = this.props
        // console.log(`${DEBUG_KEY}: loading is: ${loadingMore}, data length is: ${data.length}`);
        if (loadingMore && data.length >= 4) {
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
        const {
            data,
            userInvitedFriendsCount,
            refreshing,
            loading,
        } = this.props
        // const showGhostCards =
        //     this.props.refreshing &&
        //     (!this.props.data || this.props.data.length === 0)
        // if (showGhostCards) {
        //     return (
        //         <FlatList
        //             data={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
        //             renderItem={() => <ActivityGhost />}
        //             onViewableItemsChanged={this.handleOnViewableItemsChanged}
        //             viewabilityConfig={this.viewabilityConfig}
        //         />
        //     )
        // }
        let processedData = _.clone(data)

        if (!processedData.length && !refreshing) {
            processedData.push({
                cardType: 'InviteSomeFriends',
            })
            processedData.push({
                cardType: 'JoinSomeTribes',
            })
        } else if (
            userInvitedFriendsCount < 7 &&
            (!refreshing || processedData.length)
        ) {
            // second item on list
            processedData.splice(1, 0, {
                cardType: 'GetYourSilverBadge',
            })
        }
        return (
            <FlatList
                keyboardShouldPersistTaps="handled"
                scrollEnabled={false}
                data={processedData}
                renderItem={this.renderItem}
                numColumns={1}
                keyExtractor={this._keyExtractor}
                onViewableItemsChanged={this.handleOnViewableItemsChanged}
                viewabilityConfig={this.viewabilityConfig}
                ListEmptyComponent={
                    !this.props.loading &&
                    !this.props.refreshing && (
                        <EmptyResult
                            text={'No Activity'}
                            textStyle={{ paddingTop: 230 }}
                        />
                    )
                }
                ListFooterComponent={this.renderListFooter()}
                onEndReached={this.handleOnLoadMore}
                onEndThreshold={2}
            />
        )
    }
}

const mapStateToProps = (state) => {
    const {
        refreshing,
        loading,
        loadingMore,
        data,
        userInvitedFriendsCount,
        randomNumber,
    } = state.home.activityfeed

    return {
        data,
        refreshing,
        loading,
        loadingMore, // For footer indicator
        userInvitedFriendsCount,
        randomNumber,
    }
}

const styles = {
    iconContainerStyle: {
        position: 'absolute',
        bottom: 20,
        right: 29,
        height: 54,
        width: 54,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3,
        backgroundColor: color.GM_BLUE,
    },
    iconStyle: {
        height: 26,
        width: 26,
        tintColor: 'white',
    },
}

export default connect(
    mapStateToProps,
    {
        loadMoreFeed,
        loadUserInvitedFriendsCount,
        openPostDetail,
        openGoalDetail,
        markUserViewPost,
        markUserViewGoal,
    },
    null,
    { withRef: true }
)(wrapAnalytics(ActivityFeed, SCREENS.HOME_FEED))
