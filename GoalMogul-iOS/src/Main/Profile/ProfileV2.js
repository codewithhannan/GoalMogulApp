import _ from 'lodash';
import R from 'ramda';
import React, { Component } from 'react';
import { ActivityIndicator, Animated, FlatList, Text, View } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
/* Actions */
import {
    blockUser, changeFilter, closeCreateOverlay, handleProfileTabOnLoadMore,
    // Page related functions
    loadMainProfile, handleTabRefresh, openCreateOverlay, selectProfileTab
} from '../../actions';
import { closeProfile } from '../../actions/ProfileActions';
import { Logger } from '../../redux/middleware/utils/Logger';
import { openPostDetail } from '../../redux/modules/feed/post/PostActions';
import { createReport } from '../../redux/modules/report/ReportActions';
// Selector
import { getUserData, getUserDataByPageId, makeGetUserGoals, makeGetUserNeeds, makeGetUserPosts } from '../../redux/modules/User/Selector';
import { INITIAL_USER_PAGE } from '../../redux/modules/User/Users';
/* Styles */
import { APP_DEEP_BLUE, BACKGROUND_COLOR } from '../../styles';
import { actionSheet, switchByButtonIndex } from '../Common/ActionSheetFactory';
import PlusButton from '../Common/Button/PlusButton';
import GoalFilterBar from '../Common/GoalFilterBar';
/* Components */
import SearchBarHeader from '../Common/Header/SearchBarHeader';
import TabButtonGroup from '../Common/TabButtonGroup';
import EarnBadgeModal from '../Gamification/Badge/EarnBadgeModal';
import ProfileGoalCard from '../Goal/GoalCard/ProfileGoalCard2';
import ProfileNeedCard from '../Goal/NeedCard/ProfileNeedCard';
import ProfilePostCard from '../Post/PostProfileCard/ProfilePostCard';
import About from './About';
import ProfileDetailCard from './ProfileCard/ProfileDetailCard';


const DEBUG_KEY = '[ UI ProfileV2 ]';
const INFO_CARD_HEIGHT = 242;

class ProfileV2 extends Component {
    constructor(props) {
        super(props);
        this._handleIndexChange = this._handleIndexChange.bind(this);
        this.renderTabs = this.renderTabs.bind(this);
        this.handleOnBackPress = this.handleOnBackPress.bind(this);
        this.closeProfileInfoCard = this.closeProfileInfoCard.bind(this);
        this.state = {
            infoCardHeight: new Animated.Value(INFO_CARD_HEIGHT), // Initial info card height
            infoCardOpacity: new Animated.Value(1),
            hasLoadedProfile: false,
            cardHeight: INFO_CARD_HEIGHT, // Read info card height
            showBadgeEarnModal: false // When user first open profile, show this info
        }
        this.handleProfileDetailCardLayout = this.handleProfileDetailCardLayout.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userPageLoading !== this.props.userPageLoading && this.props.userPageLoading === false) {
            this.setState({
                ...this.state,
                hasLoadedProfile: true
            });
        }

        // This is unlikely to be triggered. This function is to handle when user opens 
        // profile too fast before profile is being loaded
        if (this.props.isSelf && !_.isEqual(prevProps.user, this.props.user)
            && (!prevProps.user.profile || !prevProps.user.profile.badges)
            && _.has(this.props.user, 'profile.badges.milestoneBadge.isAwardAlertShown')
            && this.props.user.profile.badges.milestoneBadge.isAwardAlertShown === false) {
            // Showing modal to congrats user earning a new badge
            this.setState({
                ...this.state,
                showBadgeEarnModal: true
            });
            return;
        }
    }

    componentDidMount() {
        const { userId, pageId, hideProfileDetail } = this.props;
        console.log(`${DEBUG_KEY}: mounting Profile with pageId: ${pageId}`);

        // Hide profile detail as it's not on about tab
        if (hideProfileDetail) {
            this.closeProfileInfoCard();
        }

        this.props.handleTabRefresh('goals', userId, pageId, this.props.initialFilter);
        this.props.handleTabRefresh('posts', userId, pageId);
        this.props.handleTabRefresh('needs', userId, pageId);

        if (_.has(this.props.user, 'profile.badges.milestoneBadge.isAwardAlertShown')
            && this.props.user.profile.badges.milestoneBadge.isAwardAlertShown === false) {
            return;
        }
    }

    componentWillUnmount() {
        const { pageId, userId } = this.props;
        this.props.closeProfile(userId, pageId);
    }

    closeProfileInfoCard = () => {
        Logger.log(`${DEBUG_KEY}: [ closeProfileInfoCard ]`, {}, 2);
    }

    handleRefresh = () => {
        const { userId, pageId, selectedTab } = this.props;
        if (selectedTab === 'about') return;
        console.log(`${DEBUG_KEY}: refreshing tab`, selectedTab);
        this.props.handleTabRefresh(selectedTab, userId, pageId);
    }

    handleOnLoadMore = () => {
        const { userId, pageId, selectedTab } = this.props;
        if (selectedTab === 'about') return;
        console.log(`${DEBUG_KEY}: refreshing tab`, selectedTab);
        this.props.handleProfileTabOnLoadMore(selectedTab, userId, pageId);
    }

    /**
     * @param type: ['sortBy', 'orderBy', 'categories', 'priorities']
     */
    handleOnMenuChange = (type, value) => {
        const { userId, pageId, selectedTab } = this.props;
        this.props.changeFilter(selectedTab, type, value, { userId, pageId });
    }

    handleOnBackPress = () => {
        Actions.pop();
    }

    /**
     * Profile detail card onLayout will call this function to adjust INFO_CARD_HEIGHT
     */
    handleProfileDetailCardLayout = (e) => {
        return;
    }

    /**
     * Handle SearchBarHeader Setting icon onPress. This is only called if viewing 
     * profile that is not self
     */
    handlePageSetting = () => {
        const text = 'Please go to Settings to manage blocked users.';
        const switchCases = switchByButtonIndex([
            [R.equals(0), () => { // share to Direct Chat
                // TODO: @Jay Share to direct message
                const userToShare = this.props.user;
                const chatRoomType = 'Direct';
                Actions.push('shareToChatLightBox', { userToShare, chatRoomType });
            }],
            [R.equals(1), () => {
                // TODO: @Jay Share to group conversation
                const userToShare = this.props.user;
                const chatRoomType = 'Group';
                Actions.push('shareToChatLightBox', { userToShare, chatRoomType });
            }],
            [R.equals(2), () => {
                console.log(`${DEBUG_KEY} User blocks _id: `, this.props.userId);
                this.props.blockUser(
                    this.props.userId,
                    () => alert(
                        `You have successfully blocked ${this.props.user.name}. ${text}`
                    )
                );
            }],
            [R.equals(3), () => {
                console.log(`${DEBUG_KEY} User reports profile with _id: `, this.props.userId);
                this.props.createReport(this.props.userId, 'User');
            }]
        ]);
        const profileSettingActionSheet = actionSheet(
            ['Share Profile as Direct Message', 'Share Profile to Group Chat', 'Block', 'Report', 'Cancel'],
            4,
            switchCases
        );
        profileSettingActionSheet();
    }

    handleCreateGoal = () => {
        const { userId, pageId } = this.props;
        this.props.openCreateOverlay(userId, pageId);
        // As we move the create option here, we no longer need to care about the tab
        Actions.createGoalButtonOverlay({
            tab: 'mastermind',
            callback: () => this.closeProfileInfoCard(),
            onCreate: () => this.props.openCreateOverlay(userId, pageId),
            onClose: () => this.props.closeCreateOverlay(userId, pageId),
            openProfile: false,
            userId,
            pageId
        });
    }

    _handleIndexChange = (nextIndex) => {
        const { pageId, userId } = this.props;

        // Update the reducer for index selected
        this.props.selectProfileTab(nextIndex, userId, pageId);
    };

    renderTabs = (props) => {
        return (
            <TabButtonGroup
                buttons={props}
                buttonStyle={{
                    selected: {
                        backgroundColor: APP_DEEP_BLUE,
                        tintColor: 'white',
                        color: 'white',
                        fontWeight: '700'
                    },
                    unselected: {
                        backgroundColor: '#FCFCFC',
                        tintColor: '#616161',
                        color: '#616161',
                        fontWeight: '600'
                    }
                }}
            />
        );
    }

    renderItem = ({ item }) => {
        const { pageId, userId, navigationState } = this.props;
        const { routes, index } = navigationState;

        if (item && item.type === 'refreshing') {
            return (
                <View
                    style={{
                        paddingVertical: 15
                    }}
                >
                    <ActivityIndicator size='small' />
                </View>
            );
        }
        // TODO: refactor to become a literal function
        switch (routes[index].key) {
            case 'about': {
                return <About pageId={pageId} userId={userId} />;
            }
            case 'goals': {
                return <ProfileGoalCard item={item} pageId={pageId} />;
            }
            case 'posts': {
                return (
                    <ProfilePostCard
                        item={item}
                        onPress={(item) => {
                            const initialProps = {
                                initialFocusCommentBox: true
                            };
                            this.props.openPostDetail(item, initialProps);
                        }}
                        hasActionButton
                    />
                );
            }
            case 'needs': {
                return <ProfileNeedCard item={item} pageId={pageId} />;
            }
            default:
                return <View key={props.index} />;
        }
    }

    renderPlus() {
        if (!this.props.isSelf) {
            return null;
        }
        return (
            <PlusButton
                onPress={this.handleCreateGoal}
                plusActivated={this.props.showPlus}
            />
        );
    }

    renderFilterBar({ selectedTab }) {
        if (selectedTab === 'goals' || selectedTab === 'needs') {
            return (
                <GoalFilterBar
                    filter={this.props.filter}
                    onMenuChange={this.handleOnMenuChange}
                />
            );
        }
        return null;
    }

    renderUserInfo({ userId, pageId }) {
        return (
            <Animated.View
                style={{
                    // height: this.state.infoCardHeight,
                    opacity: this.state.infoCardOpacity
                }}
            >
                <ProfileDetailCard
                    pageId={pageId}
                    userId={userId}
                    onLayout={this.handleProfileDetailCardLayout}
                    openEarnBageModal={() => this.setState({ ...this.state, showBadgeEarnModal: true })}
                />
            </Animated.View>
        );
    }

    /**
     * 
     * @param {object} props { navigationState, selectedTab, userId, pageId }
     */
    renderHeader(props) {
        return (
            <View>
                {this.renderUserInfo(props)}
                {this.renderTabs(
                    {
                        jumpToIndex: (i) => this._handleIndexChange(i),
                        navigationState: props.navigationState
                    })
                }
                {this.renderFilterBar(props)}
            </View>
        )
    }

    renderListEmptyState() {
        const { navigationState, refreshing } = this.props;
        const { routes, index } = navigationState;
        let emptyText = '';
        if (routes[index].key === 'about' || refreshing) {
            return null;
        }

        emptyText = routes[index].key;
        return (
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                }}
            >
                <Text
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: 18,
                        color: '#999',
                        paddingTop: 80
                    }}
                >
                    No {emptyText}
                </Text>
            </View>
        );
    }

    renderListFooter() {
        const { loading, data } = this.props;
        // console.log(`${DEBUG_KEY}: loading is: ${loadingMore}, data length is: ${data.length}`);
        if (loading && data.length >= 7) {
            return (
                <View
                    style={{
                        paddingVertical: 12
                    }}
                >
                    <ActivityIndicator size='small' />
                </View>
            );
        }
    }

    render() {
        const { userId, pageId, selectedTab, navigationState, data } = this.props;
        
        // Routing by TabNavigator does not create pageId
        if (!pageId) this.props.loadMainProfile(userId);
        
        return (
            <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
                <View style={styles.containerStyle}>
                    <SearchBarHeader
                        backButton={this.props.backButton}
                        setting
                        onBackPress={this.handleOnBackPress}
                        userId={userId}
                        handlePageSetting={this.handlePageSetting}
                    />
                    <FlatList
                        data={data}
                        renderItem={this.renderItem}
                        keyExtractor={(i) => i._id}
                        onRefresh={this.handleRefresh}
                        onEndReached={this.handleOnLoadMore}
                        onEndReachedThreshold={0}
                        refreshing={false}
                        ListEmptyComponent={this.renderListEmptyState()}
                        ListHeaderComponent={this.renderHeader({ userId, pageId, selectedTab, navigationState })}
                        ListFooterComponent={this.renderListFooter()}
                    />
                    {this.renderPlus()}
                    <EarnBadgeModal
                        isVisible={this.state.showBadgeEarnModal}
                        closeModal={() => {
                            this.setState({
                                ...this.state,
                                showBadgeEarnModal: false
                            });
                        }}
                        user={this.props.user}
                    />
                </View>
            </MenuProvider>
        );
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
    },
    tabContainerStyle: {
        display: 'flex',
        height: 35,
        flexDirection: 'row'
    },
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.7,
    },
    iconContainerStyle: {
        position: 'absolute',
        bottom: 20,
        right: 29,
        height: 54,
        width: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3,
        backgroundColor: APP_DEEP_BLUE,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
    },
    iconStyle: {
        height: 26,
        width: 26,
        tintColor: 'white',
    }
};

const makeMapStateToProps = () => {
    const getUserGoals = makeGetUserGoals(); // Memorized selector
    const getUserNeeds = makeGetUserNeeds();
    const getUserPosts = makeGetUserPosts();

    const mapStateToProps = (state, props) => {
        // Set userId to main user if no userId present in props
        const userId = props.userId ? props.userId : state.auth.user.userId;
        const { pageId } = props;

        const user = getUserData(state, userId, 'user');
        let userPage = getUserDataByPageId(state, userId, pageId, '');

        if (!userPage || _.isEmpty(userPage)) {
            userPage = _.cloneDeep(INITIAL_USER_PAGE);
        }

        const { navigationState, showPlus } = userPage;

        const { routes, index } = navigationState;
        const selectedTab = routes[index].key;
        // Get page info by tab
        const { loading, refreshing, filter } = _.get(userPage, selectedTab);

        // Get data to render by tab
        let data = [{}];
        const goals = getUserGoals(state, userId, pageId);
        const posts = getUserPosts(state, userId, pageId);
        const needs = getUserNeeds(state, userId, pageId);
        const about = [{}];

        if (selectedTab === 'about') {
            data = about;
        } else if (selectedTab === 'goals') {
            data = goals;
        } else if (selectedTab === 'posts') {
            data = posts;
        } else if (selectedTab === 'needs') {
            data = needs;
        }

        // console.log(`${DEBUG_KEY}: refreshing is:`, refreshing);
        if (refreshing) {
            data = [{ type: 'refreshing' }].concat(data);
        }

        const appUser = state.user.user;

        return {
            userId,
            selectedTab,
            navigationState,
            isSelf: user && appUser && userId === appUser._id,
            showPlus,
            userPageLoading: userPage.loading,
            // Page related info
            loading, refreshing, filter, data,
            user // user for the current profile page
        };
    };

    return mapStateToProps;
}


export default connect(
    makeMapStateToProps,
    {
        selectProfileTab,
        closeCreateOverlay,
        openCreateOverlay,
        closeProfile,
        loadMainProfile,
        openPostDetail,
        blockUser,
        createReport,
        // Page related functions
        handleTabRefresh,
        handleProfileTabOnLoadMore,
        changeFilter
    }
)(ProfileV2);
