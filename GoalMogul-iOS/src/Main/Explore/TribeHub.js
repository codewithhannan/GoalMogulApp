/** @format */

import React, { Component } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

/* Components */
import SearchBarHeader from '../Common/Header/SearchBarHeader'

// Actions
import {
    refreshTribeHubFeed,
    loadMoreTribeHubFeed,
    refreshTribeHub,
} from '../../redux/modules/tribe/TribeHubActions'

import { makeTribeFeedSelector } from '../../redux/modules/tribe/TribeSelector'

// Styles
import { DEFAULT_STYLE } from '../../styles'
import { wrapAnalytics, SCREENS } from '../../monitoring/segment'
import { FlatList } from 'react-native-gesture-handler'

import { Actions } from 'react-native-router-flux'
import { componentKeyByTab } from '../../redux/middleware/utils'
import { Text, Icon } from '@ui-kitten/components'
import EmptyResult from '../Common/Text/EmptyResult'
import ProfilePostCard from '../Post/PostProfileCard/ProfilePostCard'
import { MenuProvider } from 'react-native-popup-menu'

class TribeHub extends Component {
    componentDidMount() {
        // this.props.refreshTribeHub()
        this.props.refreshTribeHubFeed()
    }

    renderItem = (props) => {
        return (
            <ProfilePostCard
                item={props.item}
                key={props.index}
                hasActionButton
                onPress={(item) => {
                    // onPress is called by CommentIcon
                    this.props.openPostDetail(item, {
                        initialFocusCommentBox: true,
                    })
                }}
            />
        )
    }

    render() {
        const { data, loading, refreshing } = this.props
        // console.log(data)
        return (
            <MenuProvider>
                <View style={{ backgroundColor: '#FAFAFA', flex: 1 }}>
                    <SearchBarHeader rightIcon="menu" />
                    <View
                        style={{
                            backgroundColor: 'white',
                            padding: 12,
                            marginBottom: 8,
                            flexDirection: 'row',
                        }}
                    >
                        <RoundedButton
                            onPress={() =>
                                Actions.push(
                                    componentKeyByTab(
                                        'exploreTab',
                                        'myTribeTab'
                                    )
                                )
                            }
                            icon="flag"
                            text="My Tribes"
                        />
                        <RoundedButton
                            onPress={() => Actions.push('explore')}
                            icon="search"
                            text="Discover"
                        />
                    </View>
                    <FlatList
                        data={data}
                        keyExtractor={(i) => i._id}
                        ListHeaderComponent={
                            <View style={{ padding: 16 }}>
                                <Text style={DEFAULT_STYLE.titleText_1}>
                                    All Tribe Activity
                                </Text>
                            </View>
                        }
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
                        contentContainerStyle={{ backgroundColor: 'white' }}
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
                name={icon}
                style={{ ...DEFAULT_STYLE.smallIcon_1, marginRight: 8 }}
            />
            <Text style={DEFAULT_STYLE.titleText_2}>{text}</Text>
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
})(wrapAnalytics(TribeHub, SCREENS.EXPLORE_PAGE))
