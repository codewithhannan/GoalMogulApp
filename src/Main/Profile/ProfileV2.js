/** @format */

import _ from 'lodash'
import React, { Component } from 'react'
import {
    ActivityIndicator,
    Animated,
    SectionList,
    View,
    Image,
    Text,
} from 'react-native'
import { MenuProvider } from 'react-native-popup-menu'
import { Actions } from 'react-native-router-flux'
import StepsTooltip from '../../components/StepsTooltip'
import { connect } from 'react-redux'
/* Actions */
import {
    blockUser,
    changeFilter,
    closeCreateOverlay,
    handleProfileTabOnLoadMore,
    // Page related functions
    handleTabRefresh,
    selectProfileTab,
    uploadPopupData,
} from '../../actions'
import { closeProfile } from '../../actions/ProfileActions'
import { openPostDetail } from '../../redux/modules/feed/post/PostActions'
import { createReport } from '../../redux/modules/report/ReportActions'

// Selector
import {
    getUserData,
    getUserDataByPageId,
    makeGetUserGoals,
    makeGetUserNeeds,
    makeGetUserPosts,
} from '../../redux/modules/User/Selector'
import { INITIAL_USER_PAGE } from '../../redux/modules/User/Users'
/* Styles */
import { color } from '../../styles/basic'
import GoalFilterBar from '../Common/GoalFilterBar'
/* Components */
import SearchBarHeader from '../Common/Header/SearchBarHeader'
import TabButtonGroup from '../Common/TabButtonGroup'
import EarnBadgeModal from '../Gamification/Badge/EarnBadgeModal'
import ProfileGoalCard from '../Goal/GoalCard/ProfileGoalCard'
import ProfileNeedCard from '../Goal/NeedCard/ProfileNeedCard'
import PostPreviewCard from '../Post/PostPreviewCard/PostPreviewCard'
import About from './About'
import ProfileDetailCard from './ProfileCard/ProfileDetailCard'
import { wrapAnalytics, SCREENS } from '../../monitoring/segment'
import EmptyResult from '../Common/Text/EmptyResult'
import CreatePostModal from '../Post/CreatePostModal'
import CreateContentButtons from '../Common/Button/CreateContentButtons'
import PrivateGoalsToast from '../../components/PrivateGoalsToast'
import NudgeModal from '../../components/NudgeModal'
import { postRequest } from '../../store/services'
import Popup from '../Journey/Popup'
import PrivateGoalsNudge from '../../components/PrivateGoalsNudge'
import { getFirstName } from '../../Utils/HelperMethods'

import { api as API } from '../../redux/middleware/api'
import InviteFriendModal from '../MeetTab//Modal/InviteFriendModal'

import FriendsGoalsVisit from '../../components/FriendsGoalsVisit'
import ProfilePictureModal from '../../components/ProfilePictureModal'
import NoGoalToast from '../../components/NoGoalToast'
import HopePopup from '../Journey/HopePopup'
import EnterDrawPopup from '../Journey/EnterDrawPopup'
import InviteFriendsPopup from '../Journey/InviteFriendsPopup'
import ShareGoalPopup1 from '../Journey/ShareGoalPopup1'
import FeedbackPopup from '../Journey/FeedbackPopup'
import SubmitFeedbackPopup from '../Journey/SubmitFeedbackPopup'
import ShareGoalPopup2 from '../Journey/ShareGoalPopup2'
import SWIPER_BACKGROUND from '../../asset/utils/tooltipBackground.png'

import { TouchableOpacity } from 'react-native-gesture-handler'
import NoGoalPrompt from '../../components/NoGoalPrompt'
import CommentVideoModal from '../Common/Modal/CommentVideoModal'
import AccountabilityPopUp from '../Common/Modal/AccountabilityPopUp'
// import { getFollowedStatus } from '../../actions/FollowActions'
import { clearFollowData } from '../../reducers/FollowReducers'

const DEBUG_KEY = '[ UI ProfileV2 ]'
const INFO_CARD_HEIGHT = 242

const goalDetailTooltipText = `Tap goal for details; OR swipe left and right to reveal more cool ways to interact!`

class ProfileV2 extends Component {
    constructor(props) {
        super(props)
        this._handleIndexChange = this._handleIndexChange.bind(this)
        this.renderTabs = this.renderTabs.bind(this)
        this.state = {
            infoCardHeight: new Animated.Value(INFO_CARD_HEIGHT), // Initial info card height
            infoCardOpacity: new Animated.Value(1),
            hasLoadedProfile: false,
            newPrivateGoals: false,
            cardHeight: INFO_CARD_HEIGHT, // Read info card height
            showBadgeEarnModal: false, // When user first open profile, show this info
            showInviteFriendModal: false,
            showGoalVisibleModal: false,
            profileVisited: false,
            showPopupModal: false,
            showQuestionModal: false,
            showDrawModal: false,
            showInviteFriendsModal: false,
            popupName: '',
            showNudgePrivateGoals: false,
            showNudgeAddGoals: false,
            showNudgeInviteeGoals: false,
            showShareGoalPopup1: false,
            showShareGoalPopup2: false,
            showFeedbackPopup: false,
            showSubmitFeedbackPopup: false,
            profilePictureVisible: false,
            toolTipVisible: true,
        }
        this.handleProfileDetailCardLayout = this.handleProfileDetailCardLayout.bind(
            this
        )
    }

    async componentDidUpdate(prevProps, nextProps) {
        // console.log('THIS IS PREVPROPSSS', prevProps)
        // console.log('THIS IS PREVPROPSSS 1', nextProps)
        // console.log('this is token', this.props.token)

        // if (
        //     !this.props.isSelf &&
        //     prevProps.visitedUser !== nextProps.visitedUser
        // ) {
        //     this.shouldSendNudge()
        // }

        if (
            prevProps.userPageLoading !== this.props.userPageLoading &&
            this.props.userPageLoading === false
        ) {
            this.setState({
                hasLoadedProfile: true,
            })
        }

        // This is unlikely to be triggered. This function is to handle when user opens
        // profile too fast before profile is being loaded
        // if (
        //     this.props.isSelf &&
        //     !this.state.showBadgeEarnModal &&
        //     _.get(
        //         this.props.user,
        //         'profile.badges.milestoneBadge.currentMilestone',
        //         0
        //     ) > 0 &&
        //     !_.get(
        //         this.props.user,
        //         'profile.badges.milestoneBadge.isAwardAlertShown',
        //         true
        //     )
        // ) {
        //     // Showing modal to congrats user earning a new badge
        //     this.setState({
        //         showBadgeEarnModal: true,
        //     })
        // }
        // if (!this.props.isSelf && prevProps.user._id !== this.props.user._id) {
        //     this.shouldSendNudge()
        // }

        if (!this.props.isSelf && !_.isEqual(prevProps, this.props)) {
            this.shouldSendNudge()
        }
        if (this.props.isSelf) {
            this.handlePopup()
            this.openShareGoalPopup1()
        }

        if (
            this.props.isSelf &&
            this.props.popup['SHAREGOALS_POPUP1'].status &&
            !this.props.popup['SHAREGOALS_POPUP2'].status
        ) {
            this.openShareGoalPopup2()
            return
        }
    }

    async componentDidMount() {
        // const self = this.props.selfUser

        const { userId, pageId } = this.props
        // console.log(`${DEBUG_KEY}: mounting Profile with pageId: ${pageId}`);

        this.props.handleTabRefresh(
            'goals',
            userId,
            pageId,
            this.props.initialFilter
        )

        this.props.handleTabRefresh('posts', userId, pageId)
        this.props.handleTabRefresh('needs', userId, pageId)

        if (
            _.has(
                this.props.user,
                'profile.badges.milestoneBadge.isAwardAlertShown'
            ) &&
            this.props.user.profile.badges.milestoneBadge.isAwardAlertShown ===
                false
        ) {
            return
        }
        if (!this.props.isSelf && !this.state.profileVisited) {
            this.handleFirstVisit()
        }
    }

    toggleNudgePrivateGoals = () => {
        this.setState({
            showNudgePrivateGoals: !this.state.showNudgePrivateGoals,
        })
    }
    toggleNudgeAddGoals = () => {
        this.setState({ showNudgeAddGoals: !this.state.showNudgeAddGoals })
    }
    toggleNudgeInviteeGoals = () => {
        this.setState({
            showNudgeInviteeGoals: !this.state.showNudgeInviteeGoals,
        })
    }

    handlePopup = () => {
        // console.log('\nhandlePopup is called')
        const { popup, profile, goals } = this.props
        // console.log('POPP UPP OBJECT', popup)
        // console.log('\nThis is popup', profile)
        if (!popup['FIRST_GOAL'].status && goals.length === 1) {
            console.log('ISME ARAHA HA')
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
        } else if (!popup['SEVEN_GOALS'].status && goals.length === 7) {
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

    shouldSendNudge = async () => {
        const { token, user } = this.props
        let res
        if (user._id) {
            try {
                res = await API.get(
                    `secure/nudge/evaluate-nudge?id=${user._id}`,
                    token
                )
                console.log(
                    '\n Response from nudge API to check conditions',
                    res
                )
                let {
                    makeGoalsPublic,
                    createFirstGoal,
                    inviteeGoalCheck,
                } = res.result
                this.setState({
                    showNudgePrivateGoals: makeGoalsPublic,
                    showNudgeAddGoals: createFirstGoal,
                    showNudgeInviteeGoals: inviteeGoalCheck,
                })
            } catch (err) {
                console.log(
                    '\n This is the error while getting nudges data: ',
                    err
                )
            }
        } else return
    }

    handleFirstVisit = async () => {
        const visited = this.props.visitedUser
        try {
            const apiResponse = await API.post(
                'secure/user/Profile/view/friend',
                {
                    id: visited,
                },
                this.props.token
            )
            if (apiResponse.status == 200) {
                const viewedFriendsProfile =
                    apiResponse.result.profile.viewedFriendsProfile
                let visitedProfileObject
                viewedFriendsProfile.map((item) => {
                    if (item.userId == visited) {
                        return (visitedProfileObject = item)
                    }
                })

                if (visitedProfileObject.firstVisit == true) {
                    this.setState({ profileVisited: true })
                } else {
                    this.setState({ profileVisited: false })
                }
            }
        } catch (error) {
            console.log('error', error.message)
        }
    }

    openInviteFriendModal = () => {
        this.setState({
            showInviteFriendsModal: false,
        })
        setTimeout(() => {
            this.setState({
                showInviteFriendModal: true,
            })
        }, 500)
    }

    closeInviteFriendModal = () => {
        this.setState({ showInviteFriendModal: false })
    }

    componentWillUnmount() {
        const { pageId, userId } = this.props
        this.props.closeProfile(userId, pageId)
        this.props.clearFollowData()
    }

    handleRefresh = () => {
        const { userId, pageId, selectedTab } = this.props
        if (selectedTab === 'about') return
        console.log(`${DEBUG_KEY}: refreshing tab`, selectedTab)
        this.props.handleTabRefresh(selectedTab, userId, pageId)
    }

    handleOnLoadMore = () => {
        const { userId, pageId, selectedTab } = this.props
        if (selectedTab === 'about') return
        console.log(`${DEBUG_KEY}: refreshing tab`, selectedTab)
        this.props.handleProfileTabOnLoadMore(selectedTab, userId, pageId)
    }

    /**
     * @param type: ['sortBy', 'orderBy', 'categories', 'priorities']
     */
    handleOnMenuChange = (type, value) => {
        const { userId, pageId, selectedTab } = this.props
        this.props.changeFilter(selectedTab, type, value, { userId, pageId })
    }

    handleOnBackPress = () => {
        Actions.pop()
    }

    /**
     * Profile detail card onLayout will call this function to adjust INFO_CARD_HEIGHT
     */
    handleProfileDetailCardLayout = (e) => {
        return
    }

    handleQuestionPopup = () => {
        // console.log('\ncoming in handleQuestionPopup')
        this.setState({
            showPopupModal: false,
        })
        setTimeout(() => {
            if (!this.props.popup['INVITE_POPUPS'].status) {
                this.props.uploadPopupData('INVITE_POPUPS')
                this.setState({
                    showQuestionModal: true,
                })
            }
        }, 500)
    }

    handleDrawPopup = () => {
        this.setState({
            showQuestionModal: false,
        })
        setTimeout(() => {
            this.setState({
                showDrawModal: true,
            })
        }, 500)
    }

    handleInviteFriendsPopup = (feedback) => {
        if (feedback) {
            this.props.uploadPopupData('INVITE_POPUPS', feedback)
        }
        this.setState({
            showDrawModal: false,
        })
        setTimeout(() => {
            this.setState({
                showInviteFriendsModal: true,
            })
        }, 500)
    }

    closeFeedbackPopup = (feedback) => {
        console.log(`closeFeedbackPopup feedback: ${feedback}`)
        if (feedback) {
            this.props.uploadPopupData('SHAREGOALS_POPUP1', feedback)
        }
        this.setState({
            showFeedbackPopup: false,
        })
        setTimeout(() => {
            this.setState({
                showSubmitFeedbackPopup: true,
            })
        }, 500)
    }

    openShareGoalPopup1 = () => {
        const { goals, popup } = this.props
        // console.log(
        //     `status:${popup['SHAREGOALS_POPUP1'].status} goalcount:${goals.length} shouldOpen:${popup['SHAREGOALS_POPUP1'].shouldOpen}`
        // )
        if (
            goals.length == 4 &&
            !popup['SHAREGOALS_POPUP1'].status &&
            popup['SHAREGOALS_POPUP1'].shouldOpen
        ) {
            this.props.uploadPopupData('SHAREGOALS_POPUP1')
            this.setState({ showShareGoalPopup1: true })
        }
    }
    openShareGoalPopup2 = () => {
        console.log('Function called openShareGoalPopup2')
        if (!this.state.showShareGoalPopup1) {
            this.props.uploadPopupData('SHAREGOALS_POPUP2')
            setTimeout(() => this.setState({ showShareGoalPopup2: true }), 500)
        }
    }

    closeShareGoalPopup1 = (popupToDispaly) => {
        switch (popupToDispaly) {
            case 'feedbackpopup': {
                this.setState({ showShareGoalPopup1: false })
                setTimeout(() => {
                    this.setState({
                        showFeedbackPopup: true,
                    })
                }, 500)
                break
            }
            case 'invitefriendpopup': {
                this.setState({ showShareGoalPopup1: false })
                setTimeout(() => {
                    this.setState({
                        showInviteFriendModal: true,
                    })
                }, 500)
                break
            }
            default: {
                this.setState({ showShareGoalPopup1: false })
            }
        }
    }
    closeShareGoalPopup2 = (popupToDispaly) => {
        switch (popupToDispaly) {
            case 'invitefriendpopup': {
                this.setState({ showShareGoalPopup2: false })
                setTimeout(() => {
                    this.setState({
                        showInviteFriendModal: true,
                    })
                }, 500)
                break
            }
            default: {
                this.setState({ showShareGoalPopup2: false })
            }
        }
    }

    _handleIndexChange = (nextIndex) => {
        const { pageId, userId } = this.props

        // Update the reducer for index selected
        this.props.selectProfileTab(nextIndex, userId, pageId)
    }

    renderTabs = (props) => {
        const paddingBottom = props.renderFilter
            ? 0
            : styles.tabContainer.padding
        return (
            <View style={{ ...styles.tabContainer, paddingBottom }}>
                <TabButtonGroup buttons={props} />
            </View>
        )
    }

    chooseImage = async () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
            },
            (buttonIndex) => {
                console.log('button clicked', BUTTONS[buttonIndex])
                switch (buttonIndex) {
                    case TAKING_PICTURE_INDEX:
                        this.props.openCamera((result) => {
                            this.props.change('profile.image', result.uri)
                        })
                        break
                    case CAMERA_ROLL_INDEX:
                        this.props.openCameraRoll((result) => {
                            this.props.change('profile.image', result.uri)
                        })
                        break
                    default:
                        return
                }
            }
        )
    }

    renderImage = ({ input: { value } }) => {
        return (
            <View style={{ width: '100%' }}>
                <View
                    style={{
                        height: 90 * default_style.uiScale,
                        backgroundColor: color.GM_BLUE_LIGHT_LIGHT,
                    }}
                />
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={this.chooseImage}
                >
                    <View style={styles.imageContainerStyle}>
                        <View style={styles.imageWrapperStyle}>
                            <ProfileImage
                                imageStyle={styles.imageStyle}
                                imageUrl={getProfileImageOrDefault(value)}
                            />
                        </View>
                    </View>
                    <View style={styles.iconContainerStyle}>
                        <Icon
                            name="edit"
                            pack="material"
                            style={styles.editIconStyle}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderItem = ({ item, index: itemIndex }) => {
        // let result = false

        const {
            pageId,
            userId,
            navigationState,
            goals,
            data,
            friendship,
        } = this.props

        const { routes, index } = navigationState

        // const check = newPrivateGoals.every((i) => console.log('tyoeee', i))

        if (item && item.type === 'refreshing') {
            return (
                <View
                    style={{
                        paddingVertical: 15,
                    }}
                >
                    <ActivityIndicator size="small" />
                </View>
            )
        }

        // TODO: refactor to become a literal function
        switch (routes[index].key) {
            case 'about': {
                return <About pageId={pageId} userId={userId} />
            }
            case 'goals': {
                return (
                    <>
                        {itemIndex === 0 &&
                            !this.props.isSelf &&
                            friendship.status == 'Accepted' && <StepsTooltip />}

                        {/* {itemIndex === 0 &&
                            !this.props.isSelf &&
                            friendship.status == 'Accepted' && <Tooltip title={goalDetailTooltipText} imageSource = {too} />} */}
                        <ProfileGoalCard
                            index={itemIndex}
                            item={item}
                            friendShip={friendship.status == 'Accepted'}
                            pageId={pageId}
                            userId={userId}
                        />
                    </>
                )
            }
            case 'posts': {
                return <PostPreviewCard item={item} hasActionButton />
            }
            case 'needs': {
                return <ProfileNeedCard item={item} pageId={pageId} />
            }
            default:
                return <View key={Math.random().toString(36).substr(2, 9)} />
        }
    }

    renderFilterBar() {
        return (
            <GoalFilterBar
                filter={this.props.filter}
                onMenuChange={this.handleOnMenuChange}
            />
        )
    }

    renderUserInfo({ userId, pageId, selectedTab }) {
        return (
            <Animated.View style={{ opacity: this.state.infoCardOpacity }}>
                <ProfileDetailCard
                    pageId={pageId}
                    userId={userId}
                    selectedTab={selectedTab}
                    onLayout={this.handleProfileDetailCardLayout}
                    openEarnBageModal={() =>
                        this.setState({
                            showBadgeEarnModal: true,
                        })
                    }
                    profilePictureVisible={() =>
                        this.setState({ profilePictureVisible: true })
                    }
                    profilePictureClose={this.state.profilePictureVisible}
                />
            </Animated.View>
        )
    }

    renderContentCreationButtons() {
        return (
            <CreateContentButtons
                copilotStep
                containerStyle={{
                    marginBottom: 8,
                }}
                onCreateUpdatePress={() =>
                    this.createPostModal && this.createPostModal.open()
                }
                onCreateGoalPress={() =>
                    Actions.createGoalModal({
                        openProfile: false,
                        pageId: this.props.pageId,
                    })
                }
            />
        )
    }

    /**
     * @param {object} props { navigationState, selectedTab, userId, pageId }
     */
    renderHeader(props) {
        const { profileVisited } = this.state
        const { user } = this.props

        const path = user?.name?.split(/(\s+)/).filter(function (e) {
            return e.trim().length > 0
        })

        const firstName = path[0]

        const newPrivateGoals = this.props.goals.map((goal) => goal.privacy)
        const allEqual = (arr) =>
            newPrivateGoals.every((item) => item === 'self')

        const result = allEqual(newPrivateGoals)

        const goals = this.props.goals.length > 0
        const allPrivateGoals =
            props.selectedTab === 'goals' && props.isSelf && result && goals

        const renderFilter =
            props.selectedTab === 'goals' || props.selectedTab === 'needs'
        const renderContentCreationButtons =
            (props.selectedTab === 'goals' || props.selectedTab == 'posts') &&
            props.isSelf // disable for now to show more on the profile page
        const friendsGoalVisited = profileVisited && !props.isSelf

        return (
            <View>
                <View
                    style={{
                        marginBottom: 8,
                        backgroundColor: color.GM_CARD_BACKGROUND,
                        zIndex: 1,
                    }}
                >
                    {this.renderUserInfo(props)}
                    {this.renderTabs({
                        jumpToIndex: (i) => this._handleIndexChange(i),
                        navigationState: props.navigationState,
                        renderFilter,
                    })}

                    {renderFilter ? this.renderFilterBar(props) : null}
                    {allPrivateGoals && <PrivateGoalsToast />}
                    {friendsGoalVisited && (
                        <FriendsGoalsVisit name={firstName} />
                    )}
                </View>
                {renderContentCreationButtons
                    ? this.renderContentCreationButtons()
                    : null}
            </View>
        )
    }

    renderListEmptyState() {
        const { navigationState, refreshing, isSelf } = this.props
        const { routes, index } = navigationState
        const currentTabName = routes[index].key
        const noGoals = this.props.goals.length == 0

        if (currentTabName === 'about' || refreshing) {
            return null
        }
        // console.log('\ncurrentTabName: ', currentTabName)
        if (
            currentTabName === 'goals' &&
            !isSelf &&
            this.state.showNudgePrivateGoals
        ) {
            //Nudge friends to make their goals public
            return (
                <PrivateGoalsNudge
                    name={getFirstName(this.props.user.name)}
                    visitedUser={this.props.visitedUser}
                />
            )
        } else if (currentTabName === 'goals' && isSelf && noGoals) {
            return <NoGoalToast pageId={this.props.pageId} />
        }

        const emptyStateText = `No ${currentTabName}`
        return currentTabName === 'goals' ? (
            <>
                <View
                    style={{
                        height: 310,
                        width: '100%',
                        backgroundColor: 'white',
                        alignItems: 'center',
                    }}
                >
                    <Image
                        source={require('../../asset/image/NoGoal.png')}
                        style={{ height: 200, width: 200, top: 40 }}
                        resizeMode="contain"
                    />
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: '500',
                            top: 20,
                            paddingHorizontal: 5,
                            textAlign: 'center',
                            alignSelf: 'center',
                        }}
                    >
                        {this.props.user.name} has no goals yet
                    </Text>
                </View>
            </>
        ) : (
            <EmptyResult
                text={emptyStateText}
                textStyle={{
                    paddingTop: 80,
                    paddingBottom: 80,
                }}
            />
        )
    }

    renderListFooter() {
        const { loading, data } = this.props
        if (loading && data.length >= 7) {
            return (
                <View
                    style={{
                        paddingVertical: 12,
                    }}
                >
                    <ActivityIndicator size="small" />
                </View>
            )
        }
    }

    closeProfileModal = () => {
        this.setState({ profilePictureVisible: false })
    }

    render() {
        const {
            userId,
            pageId,
            selectedTab,
            navigationState,
            data,
            isSelf,
            goals,
            user,
        } = this.props

        let sectionsData
        if (data.length > 0) {
            sectionsData = [{ data }]
        } else {
            sectionsData = []
        }

        // const visitedId = this.props.visitedUser

        return (
            <>
                <MenuProvider
                    customStyles={{ backdrop: styles.backdrop }}
                    skipInstanceCheck={true}
                >
                    <ProfilePictureModal
                        isVisible={this.state.profilePictureVisible}
                        onClose={this.closeProfileModal}
                        userId={userId}
                        pageId={pageId}
                        isSelf={this.props.isSelf}
                    />
                    {/* <CommentVideoModal /> */}

                    <AccountabilityPopUp />
                    <Popup
                        popupName={this.state.popupName}
                        isVisible={this.state.showPopupModal}
                        closeModal={() => {
                            this.state.popupName == 'FIRST_GOAL'
                                ? this.handleQuestionPopup()
                                : this.setState({
                                      showPopupModal: false,
                                  })
                        }}
                    />
                    <HopePopup
                        isVisible={this.state.showQuestionModal}
                        closeModal={(displayNextPopup = false) => {
                            displayNextPopup
                                ? this.handleDrawPopup()
                                : this.setState({
                                      showQuestionModal: false,
                                  })
                        }}
                        name={getFirstName(this.props.user.name)}
                    />
                    <EnterDrawPopup
                        isVisible={this.state.showDrawModal}
                        closeModal={(displayNextPopup = false, feedback) => {
                            displayNextPopup
                                ? this.handleInviteFriendsPopup(feedback)
                                : this.setState({
                                      showDrawModal: false,
                                  })
                        }}
                    />
                    <InviteFriendsPopup
                        isVisible={this.state.showInviteFriendsModal}
                        closeModal={(displayNextPopup = false) => {
                            displayNextPopup
                                ? this.openInviteFriendModal()
                                : this.setState({
                                      showInviteFriendsModal: false,
                                  })
                        }}
                    />
                    <InviteFriendModal
                        isVisible={this.state.showInviteFriendModal}
                        closeModal={this.closeInviteFriendModal}
                    />
                    <ShareGoalPopup1
                        isVisible={this.state.showShareGoalPopup1}
                        closeModal={this.closeShareGoalPopup1}
                    />
                    <ShareGoalPopup2
                        isVisible={this.state.showShareGoalPopup2}
                        closeModal={this.closeShareGoalPopup2}
                    />
                    <FeedbackPopup
                        isVisible={this.state.showFeedbackPopup}
                        closeModal={(displayNextPopup = false, feedback) => {
                            displayNextPopup
                                ? this.closeFeedbackPopup(feedback)
                                : this.setState({
                                      showFeedbackPopup: false,
                                  })
                        }}
                    />
                    <SubmitFeedbackPopup
                        isVisible={this.state.showSubmitFeedbackPopup}
                        closeModal={() =>
                            this.setState({ showSubmitFeedbackPopup: false })
                        }
                    />
                    <NudgeModal
                        name={getFirstName(this.props.user.name)}
                        isVisible={this.state.showNudgeAddGoals}
                        onClose={() =>
                            this.setState({
                                showNudgeAddGoals: !this.state
                                    .showNudgeAddGoals,
                            })
                        }
                    />
                    <NoGoalPrompt
                        name={getFirstName(this.props.user.name)}
                        isVisible={this.state.showNudgeInviteeGoals}
                        onClose={() =>
                            this.setState({
                                showNudgeInviteeGoals: !this.state
                                    .showNudgeInviteeGoals,
                            })
                        }
                    />
                    <CreatePostModal
                        attachGoalRequired
                        onRef={(r) => (this.createPostModal = r)}
                        openProfile={false}
                        pageId={pageId}
                    />
                    <EarnBadgeModal
                        isVisible={this.state.showBadgeEarnModal}
                        closeModal={() => {
                            this.setState({
                                showBadgeEarnModal: false,
                            })
                        }}
                        user={this.props.user}
                    />
                    <SearchBarHeader
                        backButton={!this.props.isMainTab}
                        rightIcon={this.props.isMainTab ? 'menu' : null}
                        onBackPress={this.handleOnBackPress}
                        userId={userId}
                    />
                    <SectionList
                        keyboardShouldPersistTaps="handled"
                        sections={sectionsData}
                        renderItem={this.renderItem}
                        keyExtractor={(i) => i._id}
                        onRefresh={this.handleRefresh}
                        onEndReached={this.handleOnLoadMore}
                        onEndReachedThreshold={2}
                        refreshing={false}
                        ListEmptyComponent={this.renderListEmptyState()}
                        ListHeaderComponent={this.renderHeader({
                            userId,
                            pageId,
                            selectedTab,
                            navigationState,
                            isSelf,
                        })}
                        ListFooterComponent={this.renderListFooter()}
                        style={styles.containerStyle}
                    />
                </MenuProvider>
            </>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: color.GM_BACKGROUND,
    },
    tabContainer: {
        padding: 8,
    },
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.5,
    },
}

const makeMapStateToProps = () => {
    const getUserGoals = makeGetUserGoals() // Memorized selector
    const getUserNeeds = makeGetUserNeeds()
    const getUserPosts = makeGetUserPosts()

    const mapStateToProps = (state, props) => {
        // Set userId to main user if no userId present in props
        const { pageId, userId } = props

        const { popup } = state

        const { profile } = state.user.user

        const { token } = state.auth.user

        const userVisited = state.usersVisited

        const selfUser = state.user.userId
        const visitedUserName = state.profile
        const visitedUser = state.profile.userId.userId

        const visitedUserFriendShip = state.profile.friendship.status

        // console.log('visitedFrp', state.profile.friendship.status)

        const user = getUserData(state, userId, 'user')

        let userPage = getUserDataByPageId(state, userId, pageId, '')

        if (!userPage || _.isEmpty(userPage)) {
            userPage = _.cloneDeep(INITIAL_USER_PAGE)
        }

        const { navigationState, showPlus } = userPage
        const userObject = getUserData(state, userId, '')

        const { mutualFriends, friendship } = userObject

        const friendsCount = state.meet.friends.count

        const { routes, index } = navigationState
        const selectedTab = routes[index].key
        const needRespond =
            friendship &&
            friendship.initiator_id &&
            friendship.initiator_id !== state.user.userId &&
            friendship.status === 'Invited'
        // Get page info by tab

        const { loading, refreshing, filter } = _.get(userPage, selectedTab)
        // console.log(
        //     `this is loading ${loading} this is refreshing ${refreshing}`
        // )

        // Get data to render by tab
        let data = [{}]
        const goals = getUserGoals(state, userId, pageId)

        const posts = getUserPosts(state, userId, pageId)
        const needs = getUserNeeds(state, userId, pageId)
        const about = [{}]

        if (selectedTab === 'about') {
            data = about
        } else if (selectedTab === 'goals') {
            data = goals
        } else if (selectedTab === 'posts') {
            data = posts
        } else if (selectedTab === 'needs') {
            data = needs
        }

        // console.log(`${DEBUG_KEY}: refreshing is:`, refreshing);
        if (refreshing) data = [{ type: 'refreshing' }].concat(data)

        const appUser = state.user.user

        return {
            selectedTab,
            navigationState,
            isSelf: user && appUser && userId === appUser._id,
            showPlus,
            userPageLoading: userPage.loading,
            mutualFriends,
            friendsCount,
            needRespond,
            friendship,
            // Page related info
            loading,
            goals,
            selfUser,
            visitedUser,
            visitedUserFriendShip,

            refreshing,
            token,
            visitedUserName,
            profile,

            filter,
            data,
            user, // user for the current profile page
            popup,
            userVisited,
        }
    }

    return mapStateToProps
}

export default connect(makeMapStateToProps, {
    selectProfileTab,
    closeCreateOverlay,
    closeProfile,
    openPostDetail,
    blockUser,
    createReport,
    // Page related functions
    handleTabRefresh,
    handleProfileTabOnLoadMore,
    changeFilter,
    uploadPopupData,
    // getFollowedStatus,
    clearFollowData,
})(wrapAnalytics(ProfileV2, SCREENS.PROFILE))
