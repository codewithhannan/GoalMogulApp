/** @format */

import React, { Component } from 'react'
import { View, FlatList, ActivityIndicator, Image, Text } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import Swiper from 'react-native-swiper'

import LionMascot from '../../asset/image/LionMascot_shadow.png'
import TribeEmptyState from '../../asset/image/TribeEmptyState.png'
import moment from 'moment'

// Components
import ActivityCard from '../Activity/ActivityCard'
import EmptyResult from '../Common/Text/EmptyResult'
import InviteFriendModal from '../MeetTab//Modal/InviteFriendModal'

import { handleRefreshFriend } from '../../redux/modules/meet/MeetActions'

import { fetchUserProfile } from '../../actions/ProfileActions'
import { fetchProfile } from '../../actions/HomeActions'

import { openProfileDetailEditForm, refreshProfileData } from '../../actions'

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

import { fetchBadgeUserCount } from '../../actions/ProfileActions'

import { markUserViewGoal } from '../../redux/modules/goal/GoalDetailActions'
import { openGoalDetail } from '../../redux/modules/home/mastermind/actions'

import { color, default_style } from '../../styles/basic'
import { wrapAnalytics, SCREENS } from '../../monitoring/segment'
import { ActivityGhost } from '../Common/Ghosts'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Actions } from 'react-native-router-flux'
import MissingProfileToast from '../../components/MissingProfile'
import GreenBadgeToast from '../../components/GreenBadgeToast'
import GetGreenBadge from '../../components/GetGreenBadge'
import Profile from '../../reducers/Profile'
import SilverBadge from '../../components/SilverBadge'
import GoldBadge from '../../components/GoldBadge'
import GetBronzeBadge from '../../components/GetBronzeBadge'
import VisitFriendsToast from '../../components/VisitFriendsToast'
import VisitFriendsToast2 from '../../components/VisitFriendsToast2'
import CloseFriendsToast from '../../components/CloseFriendsToast'
import { getRandomValue } from '../../Utils/HelperMethods'

const TAB_KEY = 'activityfeed'
const DEBUG_KEY = '[ UI ActivityFeed ]'

const alternatingText = [
    {
        heading:
            'Your account has low activity. Invite more friends to get new suggestions, inspiration, and Likes! 🔥',
        text:
            'Bring new energy to old friendships by discovering the ambitions that drive each other. 🙌',
    },
    {
        heading:
            'Make your friendships more authentic by crushing your goals together!',
        text: '',
    },
    {
        heading: 'Find out what your friends want in life and help them. 🤝',
        text: '',
    },
    {
        heading:
            'Telling friends about your goals is a surefire way to get lit. Invite more friends to help you stay on track!',
        text: '',
    },
    {
        heading:
            'Step up the excitement of reaching your goals by involving more friends in the process.',
        text: 'Don’t let your journey be a lonely one.',
    },
    {
        heading:
            'After you get your Silver Badge, you’ll able to participate in other exciting Challenges!',
        text: '',
    },
    {
        heading:
            'Sharing your goals helps you avoid procrastination and be more accountable.',
        text:
            'Having more friends on GoalMogul will motivate, encourage and help you stay focused!',
    },
    {
        heading:
            'Gain access to 200+ more goal planning questions when get your Silver Badge!',
        text: '',
    },
    {
        heading:
            'Unlock the ability to create your own Tribe by getting your Silver Badge!',
        text: '',
    },
]

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
            closeFriendToVisit: '',
            badges: {
                milestoneBadge: {
                    currentMilestone: 0,
                },
            },
        }
    }

    componentDidMount() {
        // Refresh user friends
        this.props.handleRefreshFriend()

        const { friendsData, profile, userId } = this.props

        const friendsBadges = friendsData.map(
            (e) => e.profile.badges.milestoneBadge.currentMilestone
        )

        const count = friendsBadges.filter((x) => x == 3).length
        const item =
            alternatingText[Math.floor(Math.random() * alternatingText.length)]

        this.setState({
            heading: item.heading,
            text: item.text,
            friendsCount: count,
        })

        if (this.props.data && this.props.data.length) {
            this.props.loadUserInvitedFriendsCount()
        }

        const pageId = this.props.refreshProfileData(userId)

        pageAb = pageId
    }

    async componentDidUpdate() {
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
            image,
            headline,
            goals,
            profile,
            userId,
            friendsData,
            occupation,
            about,
        } = this.props

        const {
            heading,
            text,
            friendsCount,
            noGoals,
            someGoals,
            friendToVisit,
            visitFriendMore,
            closeFriendToVisit,
        } = this.state

        const { currentMilestone } = profile.badges.milestoneBadge

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

        let allFriendsId = friendsData.map((friend) => friend._id)
        console.log('\nAll friends IDs:', allFriendsId)

        // const friendsMileStone = friendsBadges.map((e) => e.milestoneBadge)

        // console.log('friendsMileStone', count)

        let closeFriends = friendsData.filter((friend) => {
            let check
            friend.maybeFriendshipRef.participants.map((participant) => {
                check =
                    participant.users_id !== userId &&
                    participant.closenessWithFriend === 'CloseFriends' &&
                    true
            })
            if (check) return friend
        })
        this.setState({ closeFriendToVisit: getRandomValue(closeFriends) })

        console.log('\nThese are the close friends of user:', closeFriends)

        let friendsArray = []
        friendsData.map((friend) => {
            if (friend.gender) {
                friendsArray.push(friend)
            }
        })
        console.log('\nThese are friends excluding chatbots', friendsArray)

        let visitedFriendsId
        if (profile.viewedFriendsProfile) {
            visitedFriendsId = profile.viewedFriendsProfile.map(
                (friend) => friend.userId
            )
        }
        console.log(
            '\nThese are the friends user has already visited',
            visitedFriendsId
        )

        let friendsToVisit
        if (friendsArray.length <= 7) {
            if (visitedFriendsId) {
                friendsToVisit = friendsArray.filter((friend) => {
                    if (!visitedFriendsId.includes(friend._id)) return friend
                })
            } else {
                friendsToVisit = friendsArray.map((friend) => friend)
            }
        }
        this.setState({
            friendToVisit: getRandomValue(friendsToVisit),
        })

        console.log(
            '\nThese are the friends user has not visited',
            friendsToVisit
        )

        let friendsToVisitMore = []
        if (friendsArray.length > 7) {
            if (visitedFriendsId) {
                friendsToVisitMore = friendsArray.filter((friend) => {
                    if (!visitedFriendsId.includes(friend._id)) return friend
                })
            } else {
                friendsToVisitMore = friendsArray.map((friend) => friend)
            }
        }

        this.setState({ visitFriendMore: friendsToVisitMore })

        console.log(
            '\nThese are the more friends user has not visited',
            friendsToVisitMore
        )

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

        var greenBadge
        // console.log('occupation => ', occupation)
        // console.log('about => ', about)
        // console.log('currentMilestone => ', currentMilestone)
        // console.log('imageeee=>', image)
        // console.log('headlineeee=>', headline)

        // console.log("friendsToVisitMore",friendsToVisitMore);

        const visitFriends = friendsToVisit.length > 0
        const visitFriendsMore = friendsToVisit.length > 0
        const renderVisitCloseFriend = closeFriends.length > 0

        console.log('renderVisitCloseFriend', renderVisitCloseFriend)

        if (currentMilestone == 0) {
            if (
                occupation == undefined &&
                about == undefined &&
                headline == undefined &&
                image == undefined
            ) {
                greenBadge = true
            } else {
                greenBadge = false
            }
            if (
                occupation == '' ||
                about == '' ||
                headline == '' ||
                image == undefined
            ) {
                greenBadge = true
            }
        } else {
            greenBadge = false
        }

        // console.log('greenbadge', greenBadge)

        var getGreenBadge

        if (goals.length == 0 && currentMilestone == 0) {
            if (
                headline != '' &&
                about != '' &&
                occupation != '' &&
                image != undefined
            ) {
                getGreenBadge = true
            }
        } else {
            getGreenBadge = false
        }

        var getBronzeBadge

        if (
            goals.length >= 1 &&
            currentMilestone == 1 &&
            friendsData.length == 3
        ) {
            getBronzeBadge = true
        } else {
            getBronzeBadge = false
        }

        // console.log('getbronzebadge', getBronzeBadge)

        const silverBadge = currentMilestone == 2
        const goldBadge = currentMilestone == 3

        return (
            <>
                {!image ||
                greenBadge ||
                silverBadge ||
                goldBadge ||
                getGreenBadge ||
                visitFriends ||
                visitFriendsMore ||
                getBronzeBadge ? (
                    <Swiper
                        style={{ height: 150 }}
                        showsPagination={false}
                        ref="swiper"
                        index={1}
                        onIndexChanged={(index) => {
                            this.setState({ currIndex: index })
                        }}
                        loop={false}
                    >
                        {greenBadge && <GreenBadgeToast pageId={pageAb} />}
                        {!image && <MissingProfileToast pageId={pageAb} />}
                        {goldBadge && <GoldBadge count={friendsCount} />}
                        {silverBadge && (
                            <SilverBadge heading={heading} text={text} />
                        )}
                        {getGreenBadge && <GetGreenBadge />}
                        {getBronzeBadge && <GetBronzeBadge />}
                        {/* {this.state.friendToVisit && (
                            <VisitFriendsToast
                                name={this.state.friendToVisit}
                            />
                        )} */}
                        {visitFriendsMore && (
                            <VisitFriendsToast2 name={visitFriendMore} />
                        )}
                        {this.state.closeFriendToVisit && (
                            <CloseFriendsToast
                                friend={this.state.closeFriendToVisit}
                            />
                        )}
                    </Swiper>
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
            </>
        )
    }
}

const mapStateToProps = (state, props) => {
    const getUserGoals = makeGetUserGoals()
    const { friends } = state.meet
    const { image, occupation, about } = state.user.user.profile
    const { messageDoc } = state

    // console.log('greeen', state.user.user)

    const { headline, profile } = state.user.user

    const { userId } = state.user

    const goals = getUserGoals(state, userId, pageAb)

    // console.log('currentuser', currentUser)

    // const { currentMilestone } = currentUser.profile.badges.milestoneBadge

    // console.log('currenMilestrone', currentMilestone)

    // const { data: friendsData, refreshing: friendsRefreshing } = friends

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
        goals,
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
        messageDoc,

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
    },
    null,
    { withRef: true }
)(wrapAnalytics(ActivityFeed, SCREENS.HOME_FEED))
