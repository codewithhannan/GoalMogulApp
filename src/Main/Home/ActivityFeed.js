/** @format */

import React, { Component } from 'react'
import { View, FlatList, ActivityIndicator, Image, Text } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import RNUrlPreview from 'react-native-url-preview'

import Swiper from 'react-native-swiper'

import LionMascot from '../../asset/image/LionMascot_shadow.png'
import TribeEmptyState from '../../asset/image/TribeEmptyState.png'
import moment from 'moment'

// Components
import ActivityCard from '../Activity/ActivityCard'
import EmptyResult from '../Common/Text/EmptyResult'
import InviteFriendModal from '../MeetTab//Modal/InviteFriendModal'

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

import {
    makeGetUserGoals,
    getUserData,
    getUserDataByPageId,
} from '../../redux/modules/User/Selector'

import TestSwiper from '../../Main/Home/TestSwiper'

import { fetchBadgeUserCount } from '../../actions/ProfileActions'

import { markUserViewGoal } from '../../redux/modules/goal/GoalDetailActions'
import { openGoalDetail } from '../../redux/modules/home/mastermind/actions'

import { color, default_style } from '../../styles/basic'
import { wrapAnalytics, SCREENS } from '../../monitoring/segment'
import { ActivityGhost } from '../Common/Ghosts'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Actions } from 'react-native-router-flux'

import PopupFB from '../Journey/FbPopup'

import { getRandomValue } from '../../Utils/HelperMethods'
import { getToastsData } from '../../actions/ToastActions'

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
            goldBadge: false,
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
        // this.props.fetchUnreadCount()
        this.props.handleRefreshFriend()

        this.props.getPopupData()

        const { token } = this.props

        this.props.getAllNudges(token)

        //To save the user's journey in redux store
        const { friendsData, profile, userId } = this.props

        let friendsArray = []
        friendsData.map((friend) => {
            if (friend.gender) {
                friendsArray.push(friend)
            }
        })

        const friendsBadges = friendsArray.map(
            (e) => e.profile.badges.milestoneBadge.currentMilestone
        )

        const count = friendsBadges.filter((x) => x == 3).length

        this.setState({
            heading: item,

            friendsCount: count,
        })

        if (this.props.data && this.props.data.length) {
            this.props.loadUserInvitedFriendsCount()
        }

        const pageId = this.props.refreshProfileData(this.props.userId)

        pageAb = pageId
    }
    async componentDidUpdate(prevProps) {
        // this.props.getToastsData()

        if (this.props.data && this.props.data.length) {
            this.props.loadUserInvitedFriendsCount()
        }

        if (this.props.goals.length >= 1) {
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
            return null
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

    render() {
        const {
            data,
            userInvitedFriendsCount,
            refreshing,
            profile,
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

        // let allFriendsId = friendsData.map((friend) => friend._id)
        // console.log('\nAll friends IDs:', allFriendsId)

        // const friendsMileStone = friendsBadges.map((e) => e.milestoneBadge)

        // console.log('friendsMileStone', count)

        // let closeFriends = friendsData.filter((friend) => {
        //     let check
        //     for (let participant of friend.maybeFriendshipRef.participants) {
        //         if (participant.closenessWithFriend === 'CloseFriends') {
        //             check = true
        //             break
        //         }
        //     }
        //     if (check) return friend
        // })
        // this.setState({ closeFriendToVisit: getRandomValue(closeFriends) })

        // console.log('\nThese are the close friends of user:', closeFriends)

        // let friendsArray = []
        // friendsData.map((friend) => {
        //     if (friend.gender) {
        //         friendsArray.push(friend)
        //     }
        // })
        // console.log('\nThese are friends excluding chatbots', friendsArray)

        // let visitedFriendsId
        // if (profile.viewedFriendsProfile) {
        //     visitedFriendsId = profile.viewedFriendsProfile.map(
        //         (friend) => friend.userId
        //     )
        // }
        // console.log(
        //     '\nThese are the friends user has already visited',
        //     visitedFriendsId
        // )

        // let friendsToVisit
        // if (friendsArray.length <= 7) {
        //     if (visitedFriendsId) {
        //         friendsToVisit = friendsArray.filter((friend) => {
        //             if (!visitedFriendsId.includes(friend._id)) return friend
        //         })
        //     } else {
        //         friendsToVisit = friendsArray.map((friend) => friend)
        //     }
        // }
        // this.setState({
        //     friendToVisit: getRandomValue(friendsToVisit),
        // })

        // console.log(
        //     '\nThese are the friends user has not visited',
        //     friendsToVisit
        // )

        // let friendsToVisitMore = []
        // if (friendsArray.length > 7) {
        //     if (visitedFriendsId) {
        //         friendsToVisitMore = friendsArray.filter((friend) => {
        //             if (!visitedFriendsId.includes(friend._id)) return friend
        //         })
        //     } else {
        //         friendsToVisitMore = friendsArray.map((friend) => friend)
        //     }
        // }

        // this.setState({ visitFriendMore: friendsToVisitMore })

        // console.log(
        //     '\nThese are the more friends user has not visited',
        //     friendsToVisitMore
        // )

        // console.log('friendsData', typeof visitedFriends)
        // console.log('friendsData1', visitedFriends)

        // if (friendsData.length < 7) {
        //     if (visitedFriends.length > 0) {
        //         const visitedFriendsId = visitedFriends.map((e) => e.userId)
        //     }
        // }

        // const friendsLatestId = friendsArray.map((e) => e._id)

        // const filteredArray = visitedFriendsId.filter((value) => {
        //     friendsLatestId.includes(value)
        // })

        // console.log('friendsData', friendsLatestId)
        // console.log('friendsData2', visitedFriendsId)
        // console.log('friendsData3', filteredArray)

        // console.log('all friends==>', friendsId)
        // console.log('all visitedFriends==>', visitedFriends)

        // console.log('goalsssss', goals)

        // const currentData = Date.now()
        // const dateCalculated = currentData.diff(visitedFriendsTime, 'days')

        // console.log('occupation => ', occupation)
        // console.log('about => ', about)
        // console.log('currentMilestone => ', currentMilestone)
        // console.log('imageeee=>', image)
        // console.log('headlineeee=>', headline)

        // console.log("friendsToVisitMore",friendsToVisitMore);

        // const visitFriends = friendsToVisit.length > 0
        // const visitFriendsMore = friendsToVisit.length > 0
        // const renderVisitCloseFriend = closeFriends.length > 0

        // var greenBadge

        // if (currentMilestone == 0) {
        //     if (
        //         occupation == undefined &&
        //         about == undefined &&
        //         headline == undefined &&
        //         image == undefined
        //     ) {
        //         greenBadge = true
        //     } else {
        //         greenBadge = false
        //     }
        //     if (
        //         occupation == '' ||
        //         about == '' ||
        //         headline == '' ||
        //         image == undefined
        //     ) {
        //         greenBadge = true
        //     }
        // } else {
        //     greenBadge = false
        // }

        // // console.log('greenbadge', greenBadge)

        // var getGreenBadge

        // if (goals.length == 0 && currentMilestone == 0) {
        //     if (
        //         headline != '' &&
        //         about != '' &&
        //         occupation != '' &&
        //         image != undefined
        //     ) {
        //         getGreenBadge = true
        //     }
        // } else {
        //     getGreenBadge = false
        // }

        // var getBronzeBadge

        // // console.log('greenBadgeee', headline)
        // // console.log('greenBadgeee1', about)
        // // console.log('greenBadgeee2', occupation)
        // // console.log('greenBadgeee3', image)

        // if (
        //     this.state.getBronzeBadgeGoals &&
        //     currentMilestone == 1 &&
        //     this.props.friendsData.length > 4
        // ) {
        //     this.setState({ getBronzeBadge: true })
        // } else {
        //     this.setState({ getBronzeBadge: false })
        // }

        // const silverBadge = currentMilestone == 2
        // const goldBadge = currentMilestone == 3

        // const { toastsData } = this.props

        // const {
        //     friendsProfileToVisit,
        //     showImageToast,
        //     showGreenBadge,
        //     showGetGreenBadge,
        //     showGetBronzeBadge,
        //     showGetSilverBadge,
        //     showGetGoldBadge,
        //     closeFriendsToVisit,
        // } = toastsData

        // const showNoToasts =
        //     !friendsProfileToVisit.length > 0 &&
        //     !showImageToast &&
        //     !showGreenBadge &&
        //     !showGetGreenBadge &&
        //     !showGetBronzeBadge &&
        //     !showGetSilverBadge &&
        //     !showGetGoldBadge.toShow &&
        //     !closeFriendsToVisit.length > 0

        // console.log('THIS IS TOASTTTTTT CONDITIONS', showNoToasts)

        return (
            <>
                {/* <NoGoalPrompt /> */}
                {/* {!image ||
                greenBadge ||
                getGreenBadge ||
                this.state.getBronzeBadge ||
                silverBadge ||
                goldBadge ||
                visitFriends ||
                visitFriendsMore ? (
                    <Swiper
                        style={{
                            height: 150,
                            backgroundColor: 'white',
                            marginTop: 9,
                        }}
                        showsPagination={false}
                        ref="swiper"
                        index={0}
                        onIndexChanged={(index) => {
                            this.setState({ currIndex: index })
                        }}
                        loop={false}
                    >
                        {!image ? (
                            <MissingProfileToast pageId={pageAb} />
                        ) : null}
                        {greenBadge && <GreenBadgeToast pageId={pageAb} />}
                        {getGreenBadge && <GetGreenBadge />}
                        {this.state.getBronzeBadge && <GetBronzeBadge />}

                        {silverBadge && (
                            <SilverBadge heading={heading} text={text} />
                        )}
                        {goldBadge && <GoldBadge count={friendsCount} />}

                        {this.state.friendToVisit && (
                            <VisitFriendsToast
                                name={this.state.friendToVisit}
                            />
                        )}
                        {friendsToVisitMore.length > 0 &&
                            this.state.visitFriendMore && (
                                <VisitFriendsToast2
                                    name={this.state.visitFriendMore}
                                />
                            )}
                        {this.state.closeFriendToVisit && (
                            <CloseFriendsToast
                                friend={this.state.closeFriendToVisit}
                            />
                        )}
                    </Swiper>
                ) : null} */}

                {this.props.loading ? null : (
                    <View style={{ backgroundColor: 'white', marginTop: 8 }}>
                        <TestSwiper />
                    </View>
                )}

                <FlatList
                    keyExtractor={(item, index) => index.toString()}
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
        // return <EarnBadgeModal isVisible={true} />
    }
}

const mapStateToProps = (state, props) => {
    const getUserGoals = makeGetUserGoals()
    const { friends } = state.meet
    const { image, occupation, about } = state.user.user.profile
    const { nudges, popup } = state
    const { headline, profile } = state.user.user
    const { userId } = state.user
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
        // currentMilestone: 0,
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
