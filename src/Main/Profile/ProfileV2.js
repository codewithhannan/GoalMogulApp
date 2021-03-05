/** @format */

import _ from 'lodash'
import React, { Component } from 'react'
import {
    ActivityIndicator,
    Animated,
    SectionList,
    View,
    Text,
} from 'react-native'
import { MenuProvider } from 'react-native-popup-menu'
import { Actions } from 'react-native-router-flux'
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

const DEBUG_KEY = '[ UI ProfileV2 ]'
const INFO_CARD_HEIGHT = 242

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
        }
        this.handleProfileDetailCardLayout = this.handleProfileDetailCardLayout.bind(
            this
        )
    }

    async componentDidUpdate(prevProps) {
        // console.log('this is token', this.props.token)

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
        if (
            this.props.isSelf &&
            !this.state.showBadgeEarnModal &&
            _.get(
                this.props.user,
                'profile.badges.milestoneBadge.currentMilestone',
                0
            ) > 0 &&
            !_.get(
                this.props.user,
                'profile.badges.milestoneBadge.isAwardAlertShown',
                true
            )
        ) {
            // Showing modal to congrats user earning a new badge
            this.setState({
                showBadgeEarnModal: true,
            })
            return
        }
    }

    async componentDidMount() {
        // const self = this.props.selfUser
        const visited = this.props.visitedUser

        console.log('visited', visited)

        try {
            const apiResponse = await postRequest(
                'http://192.168.1.7:8081/api/secure/user/Profile/view/friend',
                {
                    id: visited,
                    token: this.props.token,
                }
            )
            console.log('this is response', apiResponse)
        } catch (error) {
            console.log('error', error.message)
        }

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
    }

    openInviteFriendModal = () => {
        this.setState({ showInviteFriendModal: true })
    }

    closeInviteFriendModal = () => {
        this.setState({ showInviteFriendModal: false })
    }

    componentWillUnmount() {
        const { pageId, userId } = this.props
        this.props.closeProfile(userId, pageId)
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

    renderItem = ({ item }) => {
        let result = false

        const { pageId, userId, navigationState, goals } = this.props

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
                return <ProfileGoalCard item={item} pageId={pageId} />
            }
            case 'posts': {
                return <PostPreviewCard item={item} hasActionButton />
            }
            case 'needs': {
                return <ProfileNeedCard item={item} pageId={pageId} />
            }
            default:
                return <View key={props.index} />
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

    renderUserInfo({ userId, pageId }) {
        return (
            <Animated.View style={{ opacity: this.state.infoCardOpacity }}>
                <ProfileDetailCard
                    pageId={pageId}
                    userId={userId}
                    onLayout={this.handleProfileDetailCardLayout}
                    openEarnBageModal={() =>
                        this.setState({
                            showBadgeEarnModal: true,
                        })
                    }
                />
            </Animated.View>
        )
    }

    renderNoGoalModel() {
        const { goals, isSelf } = this.props

        setTimeout(() => {
            if (goals.length == 0 && !isSelf) {
                return <NudgeModal />
            }
        }, 5000)
    }

    renderContentCreationButtons() {
        return (
            <CreateContentButtons
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
            props.isSelf &&
            false // disable for now to show more on the profile page
        return (
            <View>
                <View
                    style={{
                        marginBottom: 8,
                        backgroundColor: color.GM_CARD_BACKGROUND,
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
                </View>
                {renderContentCreationButtons
                    ? this.renderContentCreationButtons()
                    : null}
            </View>
        )
    }

    renderListEmptyState() {
        const { navigationState, refreshing } = this.props
        const { routes, index } = navigationState
        const currentTabName = routes[index].key

        if (currentTabName === 'about' || refreshing) {
            return null
        }

        const emptyStateText = `No ${currentTabName}`
        return (
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

    _renderPrivateGoalsUi() {
        if (this.props.isSelf && this.props.goals.length > 0) {
            return <Text>ABdul hannan</Text>
        }
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
        } = this.props

        const visitedName = this.props.visitedUserName.user.name
        const visitedFriendShip = this.props.visitedUserFriendShip == 'Accepted'

        // console.log('visitedFriendShip', visitedFriendShip)

        const noGoals = goals.length == 0 && !isSelf && visitedFriendShip

        return (
            <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
                {/* {noGoals && <NudgeModal name={visitedName} />} */}

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
                    sections={[{ data }]}
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

        // console.log('this is state', state)

        const { token } = state.auth.user

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

            filter,
            data,
            user, // user for the current profile page
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
})(wrapAnalytics(ProfileV2, SCREENS.PROFILE))
