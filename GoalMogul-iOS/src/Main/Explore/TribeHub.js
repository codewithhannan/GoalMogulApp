/** @format */

import React, { Component } from 'react'
import { View, TouchableOpacity, FlatList } from 'react-native'
import { connect } from 'react-redux'

/* Components */
import SearchBarHeader from '../Common/Header/SearchBarHeader'

// Actions
import {
    refreshTribeHubFeed,
    loadMoreTribeHubFeed,
    refreshTribeHub,
} from '../../redux/modules/tribe/TribeHubActions'
import { openPostDetail } from '../../redux/modules/feed/post/PostActions'

import { makeTribeFeedSelector } from '../../redux/modules/tribe/TribeSelector'

// Styles
import { default_style, color } from '../../styles/basic'
import { wrapAnalytics, SCREENS } from '../../monitoring/segment'

import { Actions } from 'react-native-router-flux'
import { componentKeyByTab } from '../../redux/middleware/utils'
import { Text, Icon } from '@ui-kitten/components'
import EmptyResult from '../Common/Text/EmptyResult'
import PostPreviewCard from '../Post/PostPreviewCard/PostPreviewCard'
import { MenuProvider } from 'react-native-popup-menu'

class TribeHub extends Component {
    componentDidMount() {
        // this.props.refreshTribeHub()
        this.props.refreshTribeHubFeed()
    }

    renderItem = ({ item }) => {
        return (
            <PostPreviewCard
                item={item}
                hasActionButton={item.postType !== 'ShareGoal'}
            />
        )
    }

    renderHeader() {
        return (
            <View style={{ backgroundColor: color.GM_BACKGROUND }}>
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
                                componentKeyByTab('exploreTab', 'myTribeTab')
                            )
                        }
                        icon="flag"
                        text="My Tribes"
                    />
                    <RoundedButton
                        onPress={() => Actions.push('explore')}
                        icon="magnify"
                        text="Discover"
                    />
                </View>
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
        const { data, loading, refreshing } = this.props
        return (
            <MenuProvider>
                <View style={{ backgroundColor: color.GM_BACKGROUND, flex: 1 }}>
                    <SearchBarHeader rightIcon="menu" />
                    <FlatList
                        data={data}
                        keyExtractor={(i) => i._id}
                        ListHeaderComponent={this.renderHeader.bind(this)}
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

    const mapStateToProps = (state) => {
        const { loading, refreshing } = state.myTribeTab.feed
        const data = getTribeFeed(state)

        return {
            data,
            loading,
            refreshing,
        }
    }

    return mapStateToProps
}

export default connect(makeMapStateToProps, {
    refreshTribeHubFeed,
    loadMoreTribeHubFeed,
    refreshTribeHub,
    openPostDetail,
})(wrapAnalytics(TribeHub, SCREENS.EXPLORE_PAGE))
