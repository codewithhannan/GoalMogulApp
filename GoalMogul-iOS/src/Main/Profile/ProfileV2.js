import React, { Component } from 'react';
import { View, Animated, FlatList, ActivityIndicator } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';

/* Components */
import SearchBarHeader from '../Common/Header/SearchBarHeader';
import ProfileDetailCard from './ProfileCard/ProfileDetailCard';
import TabButtonGroup from '../Common/TabButtonGroup';
import GoalFilterBar from '../Common/GoalFilterBar';
import ProfileGoalCard from '../Goal/GoalCard/ProfileGoalCard2';
import ProfileNeedCard from '../Goal/NeedCard/ProfileNeedCard';
import ProfilePostCard from '../Post/PostProfileCard/ProfilePostCard';

import About from './About';

/* Actions */
import {
  selectProfileTab,
  closeCreateOverlay,
  openCreateOverlay,
  // Page related functions
  handleTabRefresh,
  handleProfileTabOnLoadMore,
  changeFilter
} from '../../actions';

import {
    openPostDetail
} from '../../redux/modules/feed/post/PostActions';

import {
  closeProfile
} from '../../actions/ProfileActions';

/* Styles */
import { BACKGROUND_COLOR, APP_DEEP_BLUE } from '../../styles';

/* Assets */
import plus from '../../asset/utils/plus.png';

// Selector
import {
  getUserDataByPageId,
  getUserData,
  makeGetUserGoals,
  makeGetUserNeeds,
  makeGetUserPosts
} from '../../redux/modules/User/Selector';
import PlusButton from '../Common/Button/PlusButton';

const DEBUG_KEY = '[ UI ProfileV2 ]';
// const SEARCHBAR_HEIGHT = 70;
// const COLLAPSED_HEIGHT = 30 + SEARCHBAR_HEIGHT;
// const HEADER_HEIGHT = 284 + 30 + SEARCHBAR_HEIGHT;
const INFO_CARD_HEIGHT = 284;
const DEFAULT_TRANSITION_TIME = 120;

class ProfileV2 extends Component {
    constructor(props) {
        super(props);
        this._handleIndexChange = this._handleIndexChange.bind(this);
        this.renderTabs = this.renderTabs.bind(this);
        this.handleOnBackPress = this.handleOnBackPress.bind(this);
        this.state = {
            infoCardHeight: new Animated.Value(INFO_CARD_HEIGHT), // Initial info card height
            infoCardOpacity: new Animated.Value(1)
        }
    }

    componentDidMount() {
        console.log(`${DEBUG_KEY}: mounting Profile with pageId: ${this.props.pageId}`);
        const { userId, pageId } = this.props;

        this.props.handleTabRefresh('goals', userId, pageId);
        this.props.handleTabRefresh('posts', userId, pageId);
        this.props.handleTabRefresh('needs', userId, pageId);
    }

    componentWillUnmount() {
        const { pageId, userId } = this.props;
        this.props.closeProfile(userId, pageId);
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

    handleCreateGoal = () => {
        const { userId, pageId } = this.props;
        this.props.openCreateOverlay(userId, pageId);
        // As we move the create option here, we no longer need to care about the tab
        Actions.createGoalButtonOverlay({ 
            tab: 'mastermind', 
            onCreate: () => this.props.openCreateOverlay(userId, pageId),
            onClose: () => this.props.closeCreateOverlay(userId, pageId),
            openProfile: false,
            userId,
            pageId
        });
    }

    _handleIndexChange = (nextIndex) => {
        const { pageId, userId, navigationState } = this.props;
        const { routes } = navigationState;

        if (routes[nextIndex].key === 'about') {
        // Animated to hide the infoCard if not on about tab
            Animated.parallel([
                Animated.timing(this.state.infoCardHeight, {
                    duration: DEFAULT_TRANSITION_TIME,
                    toValue: INFO_CARD_HEIGHT,
                }),
                Animated.timing(this.state.infoCardOpacity, {
                    duration: DEFAULT_TRANSITION_TIME,
                    toValue: 1,
                }),
            ]).start();
        } else {
            // Animated to hide the infoCard if not on about tab
            Animated.parallel([
                Animated.timing(this.state.infoCardHeight, {
                    duration: DEFAULT_TRANSITION_TIME,
                    toValue: 0,
                }),
                Animated.timing(this.state.infoCardOpacity, {
                    duration: DEFAULT_TRANSITION_TIME,
                    toValue: 0,
                }),
            ]).start();
        }

        // Update the reducer for index selected
        this.props.selectProfileTab(nextIndex, userId, pageId);
    };

    renderTabs = (props) => {
        return (
            <TabButtonGroup 
                buttons={props}
                noBorder={this.props.selectedTab !== 'about'}
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
        const { pageId, userId, navigationState, refreshing } = this.props;
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
                height: this.state.infoCardHeight,
                opacity: this.state.infoCardOpacity
                }}
            >
                <ProfileDetailCard pageId={pageId} userId={userId} />
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
        return (
            <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
                <View style={styles.containerStyle}>
                <SearchBarHeader 
                    backButton 
                    setting 
                    onBackPress={this.handleOnBackPress} 
                    userId={userId}  
                />
                {/* <ProfileSummaryCard pageId={this.props.pageId} userId={this.props.userId} /> */}
                <FlatList
                    data={data}
                    renderItem={this.renderItem}
                    keyExtractor={(i) => i._id}
                    onRefresh={this.handleRefresh}
                    onEndReached={this.handleOnLoadMore}
                    onEndReachedThreshold={0}
                    refreshing={false}
                    ListHeaderComponent={this.renderHeader({ userId, pageId, selectedTab, navigationState })}
                    ListFooterComponent={this.renderListFooter()}
                />
                {this.renderPlus()}
                </View>
            </MenuProvider>
        );
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
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
        // backgroundColor: '#17B3EC',
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
        const { userId, pageId } = props;
    
        const user = getUserData(state, userId, 'user');
        const userPage = getUserDataByPageId(state, userId, pageId, '');
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
            selectedTab,
            navigationState,
            isSelf: user && appUser && userId === appUser._id,
            showPlus,
            // Page related info
            loading, refreshing, filter, data
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
        openPostDetail,
        // Page related functions
        handleTabRefresh,
        handleProfileTabOnLoadMore,
        changeFilter
    }
)(ProfileV2);