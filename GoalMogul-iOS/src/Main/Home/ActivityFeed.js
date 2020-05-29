import React, { Component } from 'react';
import {
    View,
    FlatList,
    ActivityIndicator,
    Image
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

// Components
import ActivityCard from '../Activity/ActivityCard';
import EmptyResult from '../Common/Text/EmptyResult';

// Assets
import plus from '../../asset/utils/plus.png';

// actions
import {
    loadMoreFeed,
    refreshFeed
} from '../../redux/modules/home/feed/actions';

import { openPostDetail, markUserViewPost } from '../../redux/modules/feed/post/PostActions';
import { markUserViewGoal } from '../../redux/modules/goal/GoalDetailActions';
import {
    openGoalDetail
} from '../../redux/modules/home/mastermind/actions';

import { GM_BLUE } from '../../styles';
import DelayedButton from '../Common/Button/DelayedButton';

const TAB_KEY = 'activityfeed';
const DEBUG_KEY = '[ UI ActivityFeed ]';

class ActivityFeed extends Component {
    constructor(props) {
        super(props);

        // Same config is used in Mastermind.js
        this.viewabilityConfig = {
            waitForInteraction: true,
            itemVisiblePercentThreshold: 100,
            minimumViewTime: 1500
        }
    }

    handleOnViewableItemsChanged = ({ viewableItems, changed }) => {
        viewableItems.map(({ item }) => {
            if (item.postRef) {
                const postId = item.postRef._id;
                this.props.markUserViewPost(postId);
            } else if (item.goalRef) {
                const goalId = item.goalRef._id;
                this.props.markUserViewGoal(goalId);
            };
        });
    }

    handleOnLoadMore = () => this.props.loadMoreFeed();

    handleOnRefresh = () => this.props.refreshFeed();

    /**
     * Used by parent to scroll mastermind to top on tab pressed
     */
    scrollToTop = () => {
        const { data } = this.props;
        if (!data || data.length === 0) return;
        this.flatlist.scrollToIndex({
            animated: true,
            index: 0
        });
    }

    /**
     * @param type: ['sortBy', 'orderBy', 'categories', 'priorities']
     */
    handleOnMenuChange = (type, value) => {
        this.props.changeFilter(TAB_KEY, type, value);
    }


    _keyExtractor = (item) => item._id

    renderItem = ({ item }) => {
        // TODO: render item
        return (
            <ActivityCard
                item={item}
                onPress={(curItem, isGoal) => {
                    if (isGoal) {
                        // Open goal and focus on comment 
                        const initialProps = {
                            focusType: 'comment',
                            focusRef: undefined,
                            initialShowSuggestionModal: false,
                            initialFocusCommentBox: true
                        };
                        return this.props.openGoalDetail(curItem, initialProps);
                    }

                    const initialProps = {
                        initialFocusCommentBox: true
                    };
                    this.props.openPostDetail(curItem, initialProps);
                }}
                onShareCallback={() => this.scrollToTop()}
            />
        );
    }

    renderListFooter() {
        const { loadingMore, data } = this.props;
        // console.log(`${DEBUG_KEY}: loading is: ${loadingMore}, data length is: ${data.length}`);
        if (loadingMore && data.length >= 4) {
            return (
                <View
                    style={{
                        paddingVertical: 20
                    }}
                >
                    <ActivityIndicator size='small' />
                </View>
            );
        }
    }

    // This was used in V2 where user can only create Goal here. 
    renderPlus() {
        return (
            <DelayedButton
                activeOpacity={0.6}
                style={styles.iconContainerStyle}
                onPress={() => Actions.createPostModal()}
            >
                <Image style={styles.iconStyle} source={plus} />
            </DelayedButton>
        );
    }

    render() {
        console.log(this.props.data[3])
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    ref={f => (this.flatlist = f)}
                    data={this.props.data}
                    renderItem={this.renderItem}
                    numColumns={1}
                    keyExtractor={this._keyExtractor}
                    refreshing={this.props.loading}
                    onRefresh={this.handleOnRefresh}
                    onEndReached={this.handleOnLoadMore}
                    onViewableItemsChanged={this.handleOnViewableItemsChanged}
                    viewabilityConfig={this.viewabilityConfig}
                    ListEmptyComponent={
                        this.props.loading ? null :
                            <EmptyResult text={'No Activity'} textStyle={{ paddingTop: 230 }} />
                    }
                    ListFooterComponent={this.renderListFooter()}
                    onEndThreshold={0}
                />
                {this.renderPlus()}
            </View>
        );
    }
}

const mapStateToProps = state => {
    const { loading, loadingMore, filter, data } = state.home.activityfeed;

    return {
        data,
        loading,
        filter,
        loadingMore // For footer indicator
    };
};

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
        backgroundColor: GM_BLUE
    },
    iconStyle: {
        height: 26,
        width: 26,
        tintColor: 'white',
    },
};

export default connect(
    mapStateToProps,
    {
        loadMoreFeed,
        refreshFeed,
        openPostDetail,
        openGoalDetail,
        markUserViewPost,
        markUserViewGoal
    },
    null,
    { withRef: true }
)(ActivityFeed);
