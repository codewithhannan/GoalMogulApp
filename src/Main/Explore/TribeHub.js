/** @format */

import React, { Component } from 'react'
import { View, TouchableOpacity, FlatList, Image } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
/* Components */
import SearchBarHeader from '../Common/Header/SearchBarHeader'

// Actions
import {
    refreshTribeHubFeed,
    loadMoreTribeHubFeed,
    refreshTribeHub,
    TRIBE_TYPE,
} from '../../redux/modules/tribe/TribeHubActions'

import { refreshProfileData } from '../../actions'
import { makeGetUserGoals } from '../../redux/modules/User/Selector'
import { openPostDetail } from '../../redux/modules/feed/post/PostActions'

import {
    makeTribeFeedSelector,
    makeTribesSelector,
} from '../../redux/modules/tribe/TribeSelector'
import { openNewTribeModal } from '../../redux/modules/tribe/NewTribeActions'
// Styles
import { default_style, color } from '../../styles/basic'
import { wrapAnalytics, SCREENS } from '../../monitoring/segment'

import { Actions } from 'react-native-router-flux'
import { componentKeyByTab } from '../../redux/middleware/utils'
import { Text, Icon } from '@ui-kitten/components'
import EmptyResult from '../Common/Text/EmptyResult'
import PostPreviewCard from '../Post/PostPreviewCard/PostPreviewCard'
import { MenuProvider } from 'react-native-popup-menu'
import EmptyTribe from '../../asset/image/empty_tribe.png'
import LionMascot from '../../asset/image/LionMascot_shadow.png'
import FeedToast from '../../components/FeedToast'
import {
    trackWithProperties,
    EVENT as E,
    track,
} from '../../monitoring/segment'

let pageAb = ''

class TribeHub extends Component {
    state = {
        heading: 'Now that you know what your goals are, ask yourself:',
        text1: 'Who do I need to become to get what I want?',
        text2: 'What am I willing to let go of to become that person?',
        text3:
            "Introduce yourself in the Tribes and let us know what you're committed to changing in your life!",
    }

    componentDidMount() {
        // this.props.refreshTribeHub()
        this.props.refreshTribeHubFeed()
        this.props.refreshTribeHub()
        setTimeout(() => {
            trackWithProperties(E.DEEPLINK_CLICKED, {
                FunnelName: this.props.funnel,
            })
        }, 2000)

        const pageId = this.props.refreshProfileData(this.props.userId)

        pageAb = pageId
    }

    componentDidUpdate(prevProps, prevState) {}

    scrollToTop = () => {
        if (this.flatList)
            this.flatList.scrollToIndex({
                animated: true,
                index: 0,
                viewOffset: this.topTabBarHeight || 50,
            })
    }

    renderItem = ({ item }) => {
        return (
            <PostPreviewCard
                item={item}
                hasActionButton={item.postType !== 'ShareGoal'}
            />
        )
    }

    renderEmptyTribeFeedPage() {
        return (
            <View
                style={{ backgroundColor: color.GM_CARD_BACKGROUND, flex: 1 }}
            >
                <SearchBarHeader rightIcon="menu" />
                <View style={styles.emptyTribeImageContainerStyle}>
                    <Image
                        source={EmptyTribe}
                        resizeMode="contain"
                        style={styles.emptyTribeImageStyle}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <View
                        style={{
                            padding: 10,
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={default_style.titleText_1}>
                            Join our encouraging community of achievers. Pay it
                            forward and brighten someone's day!
                        </Text>
                        <Text style={default_style.titleText_1}>
                            Join a Tribe and help someone.
                        </Text>
                    </View>

                    <View style={{ paddingHorizontal: 10, paddingTop: 12 }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.emptyTribeButtonStyle}
                            onPress={() => {
                                Actions.push('tribeDiscover')
                                track(E.DISCOVER_TRIBE_OPEN)
                            }}
                        >
                            <Text
                                style={[
                                    default_style.titleText_1,
                                    styles.buttonText,
                                    { color: color.GM_CARD_BACKGROUND },
                                ]}
                            >
                                Discover Tribes
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {this.props.isSilverBadgePlus && (
                        <View style={{ paddingHorizontal: 10 }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={{
                                    ...styles.emptyTribeButtonStyle,
                                    backgroundColor: color.GM_CARD_BACKGROUND,
                                }}
                                onPress={() => this.props.openNewTribeModal()}
                            >
                                <Text
                                    style={[
                                        default_style.titleText_1,
                                        styles.buttonText,
                                        { color: color.GM_MID_GREY },
                                    ]}
                                >
                                    Create a Tribe
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        )
    }

    renderHeader() {
        return (
            <View
                onLayout={(e) =>
                    (this.topTabBarHeight = e.nativeEvent.layout.height)
                }
                style={{ backgroundColor: color.GM_BACKGROUND }}
            >
                <View
                    style={{
                        backgroundColor: color.GM_CARD_BACKGROUND,
                        padding: 12,
                        marginBottom: 8,
                        flexDirection: 'row',
                    }}
                >
                    <RoundedButton
                        onPress={() =>
                            Actions.push(
                                componentKeyByTab('exploreTab', 'myTribeTab'),
                                { pageId: 'tribe_hub_pageId' }
                            )
                        }
                        icon="flag"
                        text="My Tribes"
                    />
                    <RoundedButton
                        onPress={() => Actions.push('tribeDiscover')}
                        icon="magnify"
                        text="Discover"
                    />
                </View>

                {this.props.goals.length == 1 ? (
                    <FeedToast
                        image={LionMascot}
                        heading={this.state.heading}
                        text1={this.state.text1}
                        text2={this.state.text2}
                        text3={this.state.text3}
                        height={140}
                    />
                ) : null}
                <View
                    style={{
                        padding: 12,
                        backgroundColor: color.GM_CARD_BACKGROUND,
                        borderColor: color.GM_LIGHT_GRAY,
                        borderBottomWidth: 1,
                    }}
                >
                    <Text style={default_style.titleText_1}>
                        All Tribe Activity
                    </Text>
                </View>
            </View>
        )
    }

    render() {
        const {
            data,
            loading,
            refreshing,
            adminTribes,
            memberTribes,
            requestedTribes,
            invitedTribes,
        } = this.props
        if (
            !adminTribes.length &&
            !memberTribes.length &&
            !requestedTribes.length &&
            !invitedTribes.length &&
            !loading &&
            !refreshing
        ) {
            return this.renderEmptyTribeFeedPage()
        }
        return (
            <MenuProvider skipInstanceCheck={true}>
                <View style={{ backgroundColor: color.GM_BACKGROUND, flex: 1 }}>
                    <SearchBarHeader rightIcon="menu" />
                    <FlatList
                        ref={(ref) => (this.flatList = ref)}
                        data={data}
                        keyExtractor={(i) => i._id}
                        ListHeaderComponent={this.renderHeader()}
                        renderItem={this.renderItem}
                        refreshing={refreshing}
                        onRefresh={this.props.refreshTribeHubFeed}
                        onEndReached={this.props.loadMoreTribeHubFeed}
                        onEndReachedThreshold={2}
                        ListEmptyComponent={
                            !loading &&
                            !refreshing && (
                                <EmptyResult
                                    text={'No Tribe Activity'}
                                    textStyle={{
                                        paddingTop: 80,
                                        paddingBottom: 80,
                                    }}
                                />
                            )
                        }
                    />
                </View>
            </MenuProvider>
        )
    }
}

const RoundedButton = (props) => {
    const { onPress, text, icon } = props
    return (
        <TouchableOpacity
            style={{
                margin: 4,
                padding: 8,
                paddingLeft: 17,
                paddingRight: 20,
                borderRadius: 100,
                backgroundColor: '#F2F2F2',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            onPress={onPress}
        >
            <Icon
                pack="material-community"
                name={icon}
                style={{ ...default_style.smallIcon_1, marginRight: 8 }}
            />
            <Text style={default_style.titleText_2}>{text}</Text>
        </TouchableOpacity>
    )
}

const makeMapStateToProps = () => {
    const getTribeFeed = makeTribeFeedSelector()
    const managedTribeSelector = makeTribesSelector()

    const mapStateToProps = (state) => {
        const { loading, refreshing } = state.myTribeTab.feed
        const data = getTribeFeed(state)
        const { myGoals } = state.goals
        const getUserGoals = makeGetUserGoals()

        const { userId } = state.user

        const goals = getUserGoals(state, userId, pageAb)

        let adminTribes = managedTribeSelector(state, TRIBE_TYPE.admin)
        let memberTribes = managedTribeSelector(state, TRIBE_TYPE.member)
        let requestedTribes = managedTribeSelector(state, TRIBE_TYPE.requested)
        let invitedTribes = managedTribeSelector(state, TRIBE_TYPE.invited)
        const { user } = state.user
        const level = _.get(
            user,
            'profile.badges.milestoneBadge.currentMilestone',
            1
        )
        const isSilverBadgePlus = level >= 2

        return {
            data,
            loading,
            userId,
            goals,
            refreshing,
            myGoals,
            isSilverBadgePlus,
            adminTribes,
            memberTribes,
            requestedTribes,
            invitedTribes,
        }
    }

    return mapStateToProps
}

const styles = {
    emptyTribeButtonStyle: {
        backgroundColor: color.GM_BLUE,
        borderRadius: 3,
        marginBottom: 8,
    },
    buttonText: {
        ...default_style.buttonText_1,
        textAlign: 'center',
        margin: 7,
    },
    emptyTribeImageContainerStyle: {
        flex: 1,
        alignItems: 'center',
        marginTop: 100,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    emptyTribeImageStyle: {
        flex: 1,
    },
}

export default connect(
    makeMapStateToProps,
    {
        refreshTribeHubFeed,
        loadMoreTribeHubFeed,
        refreshTribeHub,
        openPostDetail,
        openNewTribeModal,
        refreshProfileData,
    },
    null,
    { withRef: true }
)(wrapAnalytics(TribeHub, SCREENS.EXPLORE_PAGE))
