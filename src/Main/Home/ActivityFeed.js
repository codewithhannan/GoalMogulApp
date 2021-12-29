/** @format */

import React, { Component } from 'react'
import { View, FlatList, ActivityIndicator, Image, Text } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import LionMascot from '../../asset/image/LionMascot_shadow.png'
import TribeEmptyState from '../../asset/image/TribeEmptyState.png'
import moment from 'moment'

// Components
import ActivityCard from '../Activity/ActivityCard'
import EmptyResult from '../Common/Text/EmptyResult'
import InviteFriendModal from '../MeetTab/Modal/InviteFriendModal'
import HomeFeedToast from './HomeFeedToast'

import { handleRefreshFriend } from '../../redux/modules/meet/MeetActions'
import { fetchUnreadCount } from '../../redux/modules/notification/NotificationTabActions'

import { fetchUserProfile } from '../../actions/ProfileActions'
import { fetchProfile } from '../../actions/HomeActions'

import {
    openProfileDetailEditForm,
    refreshProfileData,
    getPopupData,
    uploadPopupData,
} from '../../actions'

import { getAllNudges } from '../../actions/NudgeActions'

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
import {
    wrapAnalytics,
    SCREENS,
    trackWithProperties,
    EVENT as E,
    track,
    identifyWithTraits,
} from '../../monitoring/segment'

import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Actions } from 'react-native-router-flux'

import PopupFB from '../Journey/FbPopup'

import { getToastsData } from '../../actions/ToastActions'
import Popup from '../Journey/Popup'

const TAB_KEY = 'activityfeed'
const DEBUG_KEY = '[ UI ActivityFeed ]'

let pageAb = ''

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
            profileLoaded: false,
            heading: '',
            text: '',
            friendsCount: '',
            popupName: '',
            goldBadge: false,
            showPopupModal: false,
            noGoals: false,
            someGoals: false,
            friendToVisit: '',
            visitFriendMore: '',
            getBronzeBadge: false,
            closeFriendToVisit: '',
            showFbModal: false,
            getBronzeBadgeGoals: false,
            currIndex: 0,

            badges: {
                milestoneBadge: {
                    currentMilestone: 0,
                },
            },
        }
    }

    async componentDidMount() {
        // Refresh user friends
        this.props.getToastsData()

        this.props.handleRefreshFriend()
        this.props.getPopupData()
        const { token } = this.props
        this.props.getAllNudges(token)
        if (this.props.data && this.props.data.length) {
            this.props.loadUserInvitedFriendsCount()
        }

        // if (this.props.userLastActive) {

        // }
        identifyWithTraits(this.props.userId, {
            lastLoginDate: this.props.userLastActive,
            country: this.props.userLogedIn.user.profile.ipLocation?.country,
            age: moment(this.props.userLogedIn.user.dateOfBirth)
                .fromNow()
                .slice(0, 2),
            createdAt: this.props.userLogedIn.user.created,
            email: this.props.userLogedIn.user.email.address,
            firstname: this.props.userLogedIn.user.name,
            gender: this.props.userLogedIn.user.gender,
            gender: this.props.userLogedIn.user.gender,
            headline: this.props.userLogedIn.user?.headline,
            occupation: this.props.userLogedIn.user.profile.occupation,
            location: this.props.userLogedIn.user.profile.location,
            elevatorPitch: this.props.userLogedIn.user.profile.elevatorPitch,
            about: this.props.userLogedIn.user.profile.about,
            goalsCreated: this.props.myGoals.data.length,
        })

        const pageId = this.props.refreshProfileData(this.props.userId)

        pageAb = pageId
    }
    async componentDidUpdate() {
        // this.props.getToastsData()

        if (this.props.data && this.props.data.length) {
            this.props.loadUserInvitedFriendsCount()
        }

        if (this.props.myGoals.data >= 1) {
            this.setState({ getBronzeBadgeGoals: true })
        } else {
            this.setState({ getBronzeBadgeGoals: false })
        }

        this.props.getPopupData()

        if (this.props.myGoals.length === 2) {
            this.renderFacebookPopup()
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
        track(E.INVITE_FRIENDS_OPEN)
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
            // <View
            //     style={{
            //         backgroundColor: color.GM_CARD_BACKGROUND,
            //         marginTop: 8,
            //         flexDirection: 'row',
            //         justifyContent: 'center',
            //         paddingHorizontal: 96,
            //         paddingVertical: 24,
            //     }}
            // >
            //     <View
            //         style={{
            //             flexDirection: 'row',
            //             width: 120,
            //         }}
            //     >
            //         <Image
            //             source={LionMascot}
            //             style={{
            //                 height: 136,
            //                 width: 90,
            //                 resizeMode: 'contain',
            //             }}
            //         />
            //     </View>
            //     <View style={{}}>
            //         <Text
            //             style={{
            //                 ...default_style.titleText_1,
            //             }}
            //         >
            //             Your feed has no activity
            //         </Text>
            //         <Text
            //             style={{
            //                 ...default_style.normalText_1,
            //                 marginTop: 12,
            //             }}
            //         >
            //             Enjoy sharing your goals with friends to make your
            //             friendships more fulfilling!
            //         </Text>
            //         {this.renderInviteFreindsButton()}
            //     </View>
            // </View>
            null
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
            // <View
            //     style={{
            //         backgroundColor: color.GM_CARD_BACKGROUND,
            //         marginTop: 8,
            //         justifyContent: 'center',
            //         paddingVertical: 8,
            //     }}
            // >
            //     <View
            //         style={{
            //             width: '100%',
            //             borderBottomColor: color.GM_LIGHT_GRAY,
            //             borderBottomWidth: 1,
            //             paddingHorizontal: 16,
            //             paddingVertical: 8,
            //         }}
            //     >
            //         <Text
            //             style={{
            //                 ...default_style.titleText_1,
            //             }}
            //         >
            //             Browse our Community
            //         </Text>
            //     </View>
            //     <View
            //         style={{
            //             paddingHorizontal: 16,
            //             justifyContent: 'center',
            //         }}
            //     >
            //         <View
            //             style={{
            //                 alignItems: 'center',
            //                 paddingVertical: 24,
            //             }}
            //         >
            //             <Image
            //                 source={TribeEmptyState}
            //                 style={{
            //                     height: 160,
            //                     resizeMode: 'contain',
            //                 }}
            //             />
            //         </View>
            //         <Text
            //             style={{
            //                 ...default_style.titleText_2,
            //                 textAlign: 'center',
            //                 lineHeight: 24,
            //             }}
            //         >
            //             Join our encouraging community of achievers.{'\n'}
            //             Pay it forward and brighten someone’s day!{'\n'}
            //             Join a Tribe and help someone.{'\n'}
            //         </Text>
            //         <TouchableWithoutFeedback
            //             onPress={() => {
            //                 Actions.push('tribeDiscover')
            //                 track(E.DISCOVER_TRIBE_OPEN)
            //             }}
            //             style={{
            //                 backgroundColor: color.GM_LIGHT_GRAY,
            //                 paddingVertical: 12,
            //                 paddingHorizontal: 16,
            //                 borderRadius: 3,
            //                 width: '100%',
            //                 marginBottom: 24,
            //             }}
            //         >
            //             <Text
            //                 style={{
            //                     ...default_style.buttonText_1,
            //                     color: color.TEXT_COLOR.DARK,
            //                     textAlign: 'center',
            //                 }}
            //             >
            //                 Discover Tribes
            //             </Text>
            //         </TouchableWithoutFeedback>
            //     </View>
            // </View>
            null
        )
    }

    renderItem = ({ item, index }) => {
        if (item.cardType == 'InviteSomeFriends') {
            return this.renderInviteSomeFreindsCard()
        } else if (item.cardType == 'JoinSomeTribes') {
            return this.renderJoinSomeTribesCard()
        } else if (item.cardType == 'GetYourSilverBadge') {
            return null
        }
        // TODO: render item
        return (
            <ActivityCard
                item={item}
                index={index}
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

    renderFacebookPopup = () => {
        const { popup, myGoals } = this.props
        // console.log(
        //     `status: ${popup['FBPOPUP_2ND_GOAL'].status} length: ${goals.length}`
        // )
        if (myGoals.length === 2 && !popup['FBPOPUP_2ND_GOAL'].status) {
            this.props.uploadPopupData('FBPOPUP_2ND_GOAL')
            this.setState({ showFbModal: true })
        }
    }

    handlePopup = () => {
        // console.log('\nhandlePopup is called')
        const { popup, profile, myGoals } = this.props
        // console.log('POPP UPP OBJECT', popup)
        // console.log('\nThis is popup', profile)
        if (!popup['FIRST_GOAL'].status && myGoals.length === 1) {
            this.props.uploadPopupData('FIRST_GOAL')
            this.setState({ showPopupModal: true, popupName: 'FIRST_GOAL' })
        } else if (
            !popup['GREEN_BADGE'].status &&
            profile.badges.milestoneBadge.currentMilestone === 1
        ) {
            this.props.uploadPopupData('GREEN_BADGE')
            this.setState({ showPopupModal: true, popupName: 'GREEN_BADGE' })
        } else if (
            !popup['BRONZE_BADGE'].status &&
            profile.badges.milestoneBadge.currentMilestone === 2
        ) {
            this.props.uploadPopupData('BRONZE_BADGE')
            this.setState({ showPopupModal: true, popupName: 'BRONZE_BADGE' })
        } else if (!popup['SEVEN_GOALS'].status && myGoals.length === 7) {
            this.props.uploadPopupData('SEVEN_GOALS')
            this.setState({ showPopupModal: true, popupName: 'SEVEN_GOALS' })
        } else if (
            !popup['SILVER_BADGE'].status &&
            profile.badges.milestoneBadge.currentMilestone === 3
        ) {
            this.props.uploadPopupData('SILVER_BADGE')
            this.setState({ showPopupModal: true, popupName: 'SILVER_BADGE' })
        } else if (
            !popup['GOLD_BADGE'].status &&
            profile.badges.milestoneBadge.currentMilestone === 4
        ) {
            this.props.uploadPopupData('GOLD_BADGE')
            this.setState({ showPopupModal: true, popupName: 'GOLD_BADGE' })
        }
    }

    render() {
        console.log('Activity user', this.props.userLogedIn.user)
        const { data, userInvitedFriendsCount, refreshing } = this.props

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
            <>
                {!this.props.loading && !this.props.refreshing ? (
                    <View style={{ backgroundColor: 'white', marginTop: 8 }}>
                        <HomeFeedToast />
                    </View>
                ) : null}

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
                <PopupFB
                    isVisible={this.state.showFbModal}
                    closeModal={() => {
                        this.setState({
                            showFbModal: false,
                        })
                    }}
                />
            </>
        )
    }
}

const mapStateToProps = (state, props) => {
    const userActivity = state.user.user

    let userLastActive

    if (userActivity.sessionActivity != undefined) {
        userLastActive = userActivity.sessionActivity.lastActive
    }

    const { friends } = state.meet
    const { image, occupation, about } = state.user.user.profile
    const { popup } = state
    const { headline, profile } = state.user.user
    const { userId } = state.user
    const userLogedIn = state.user
    const { token } = state.auth.user
    const { myGoals } = state.goals
    const { toastsData, loading: toastsLoading } = state.toasts

    const {
        user,
        refreshing,
        loading,
        loadingMore,
        data,
        userInvitedFriendsCount,
        randomNumber,
    } = state.home.activityfeed

    return {
        headline,
        // lastActive,
        userLastActive,
        userId,
        image,
        user,
        data,
        refreshing,
        friendsData: friends.data,
        friendsRefreshing: friends.refreshing,
        loading,
        loadingMore, // For footer indicator
        userInvitedFriendsCount,
        randomNumber,
        profile,
        occupation,
        about,
        token,
        popup,
        toastsData,
        toastsLoading,
        myGoals,
        userLogedIn,
    }
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
        handleRefreshFriend,
        openProfileDetailEditForm,
        refreshProfileData,
        fetchUserProfile,
        fetchProfile,
        getAllNudges,
        getPopupData,
        uploadPopupData,
        getToastsData,
        fetchUnreadCount,
    },
    null,
    { withRef: true }
)(wrapAnalytics(ActivityFeed, SCREENS.HOME_FEED))
