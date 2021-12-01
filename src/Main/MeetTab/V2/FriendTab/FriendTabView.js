/**
 * This is the central hub for current friends management. This is implemented based off design
 * https://www.figma.com/file/pbqMYdES3eWbz6bxlrIFP4/Friends?node-id=0%3A1
 *
 * @format
 */

import _ from 'lodash'
import React from 'react'
import {
    ActivityIndicator,
    FlatList,
    View,
    Text,
    useWindowDimensions,
    Dimensions,
} from 'react-native'
import { TextInput } from 'react-native-paper'
import Constants from 'expo-constants'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { connect } from 'react-redux'
import { MaterialIcons } from '@expo/vector-icons'
import { SearchIcon } from '../../../../Utils/Icons'
// Constants

import { MEET_REQUEST_LIMIT } from '../../../../reducers/MeetReducers'
/* Actions */
import {
    handleRefreshFriend,
    loadMoreRequest,
} from '../../../../redux/modules/meet/MeetActions'
/* Styles */
import { color, text } from '../../../../styles/basic'
import SearchBarHeader from '../../../Common/Header/SearchBarHeader'
import { SearchBar } from 'react-native-elements'
/* Components */
import EmptyResult from '../../../Common/Text/EmptyResult'
import FriendTabCardView from './FriendTabCardView'
import DelayedButton from '../../../Common/Button/DelayedButton'
import { Actions } from 'react-native-router-flux'
import { componentKeyByTab } from '../../../../redux/middleware/utils'
import { SCREENS, wrapAnalytics } from '../../../../monitoring/segment'
import { DEVICE_MODEL } from '../../../../Utils/Constants'

const KEY = 'friends'
const DEBUG_KEY = '[ UI FriendTabView ]'

const windowHeight = Dimensions.get('screen').height

class FriendTabView extends React.Component {
    state = {
        index: 0,
        routes: [
            { key: 'one', title: 'All Friends' },
            { key: 'two', title: 'Close Friends' },
        ],
        friendsSearchText: '',
        closeFriendsSearchText: '',

        inputA: '',
        inputB: '',
        inputC: '',

        friendsFilteredData: [],
        closeFriendsFilteredData: [],
    }

    componentDidMount() {
        if (_.isEmpty(this.props.data)) this.props.handleRefreshFriend()
    }

    handleRefresh = () => {
        this.props.handleRefreshFriend()
    }

    handleOnLoadMore = () => {
        this.props.loadMoreRequest(KEY)
    }

    handleManageInvitation = () => {
        const componentKeyToOpen = componentKeyByTab(
            this.props.navigationTab,
            'requestTabView'
        )
        Actions.push(componentKeyToOpen)
    }

    keyExtractor = (item) => item._id

    renderItem = (props) => {
        return <FriendTabCardView {...props} />
    }

    renderListFooter() {
        const { loading, data } = this.props
        // console.log(`${DEBUG_KEY}: loading is: ${loadingMore}, data length is: ${data.length}`);
        if (loading) {
            return (
                <View style={{ paddingVertical: 20 }}>
                    <ActivityIndicator size="small" />
                </View>
            )
        }
    }

    searchFriends = (input) => {
        this.setState({ friendsSearchText: input })
        let friendsFilteredData = this.props.data.filter(function (item) {
            return item.name.includes(input)
        })
        this.setState({ friendsFilteredData: friendsFilteredData })
    }

    searchCloseFriends = (input, closeFriends) => {
        this.setState({ closeFriendsSearchText: input })
        let filteredData = closeFriends.filter((friend) =>
            friend.name.includes(input)
        )
        this.setState({ closeFriendsFilteredData: filteredData })
    }

    _handleChangeTab = (index) => {
        this.setState({
            index,
        })
    }

    //this is the tab bar for the tabview
    renderTabBar = (props) => {
        const { routes } = this.state
        return (
            <TabBar
                renderLabel={({ route, focused, color }) => (
                    <Text
                        style={{
                            color: focused ? 'white' : '#828282',
                            marginBottom: 50,
                            bottom: 3,
                            // right: 2,
                            fontWeight: focused ? '400' : '300',
                        }}
                    >
                        {route.title}
                    </Text>
                )}
                {...props}
                indicatorStyle={{
                    backgroundColor: '#42C0F5',
                    height: windowHeight * 0.035,
                    borderRadius: 50,
                }}
                style={{
                    backgroundColor: '#F2F2F2',
                    borderRadius: 50,
                    width: '90%',
                    height: windowHeight * 0.035,
                    // flex: 1,
                    justifyContent: 'center',
                    marginHorizontal: 20,
                }}
            />
        )
    }

    /**
     * List header with All Friends title and searchbar for friends
     */

    renderListHeader() {
        return (
            <View
                style={[
                    {
                        padding: 16,
                        backgroundColor: color.GM_CARD_BACKGROUND,
                        marginBottom: 8,
                    },
                ]}
            >
                <View style={{ flexDirection: 'row' }}>
                    <Text
                        style={{
                            fontFamily: text.FONT_FAMILY.BOLD,
                            fontSize: 16,
                            marginTop: 2,
                        }}
                    >
                        All Friends
                    </Text>
                    <View style={{ flex: 1 }} />
                    <DelayedButton
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={this.handleManageInvitation}
                    >
                        <Text
                            style={{
                                fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                                fontWeight: '500',
                                fontSize: 13,
                                color: color.GM_BLUE,
                            }}
                        >
                            Manage Invitations
                        </Text>
                    </DelayedButton>
                </View>
            </View>
        )
    }

    //this the components of the tabs

    _renderTabs = ({ route }) => {
        const { userId } = this.props
        let closeFriends = this.props.data.filter((friend) => {
            let check
            for (let participant of friend.maybeFriendshipRef.participants) {
                if (participant.closenessWithFriend === 'CloseFriends') {
                    check = true
                    break
                }
            }
            if (check) return friend
        })

        switch (route.key) {
            case 'one':
                return (
                    <View style={{ flex: 1 }}>
                        <View
                            style={{
                                width: '100%',
                                borderWidth: 1,
                                marginTop: 20,
                                borderColor: '#FAF7F7',
                            }}
                        ></View>
                        <View
                            style={{
                                justifyContent: 'center',
                                marginTop: 10,
                            }}
                        >
                            <TextInput
                                theme={{
                                    colors: {
                                        primary: 'grey',
                                        underlineColor: 'transparent',
                                    },
                                }}
                                value={this.state.friendsSearchText}
                                onChangeText={this.searchFriends}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: 'lightgrey',
                                    width: '95%',
                                    height: 35,
                                    marginHorizontal: 10,

                                    // padding: 10,
                                }}
                                underlineColor={'transparent'}
                                placeholder={'Search'}
                                left={
                                    <TextInput.Icon
                                        name={() => (
                                            <MaterialIcons
                                                name={'search'}
                                                size={20}
                                                color="grey"
                                            />
                                        )}
                                    />
                                }
                            />
                        </View>
                        <View
                            style={{
                                width: '100%',
                                borderWidth: 1,
                                marginTop: 10,
                                borderColor: '#FAF7F7',
                            }}
                        ></View>
                        <FlatList
                            data={
                                this.state.friendsFilteredData &&
                                this.state.friendsFilteredData.length > 0
                                    ? this.state.friendsFilteredData
                                    : this.props.data
                            }
                            renderItem={this.renderItem}
                            keyExtractor={this.keyExtractor}
                            onRefresh={this.handleRefresh}
                            refreshing={this.props.refreshing}
                            onEndReached={this.handleOnLoadMore}
                            onEndReachedThreshold={0}
                            ListEmptyComponent={
                                this.props.refreshing ? null : (
                                    <EmptyResult
                                        text={"You haven't added any Friends"}
                                    />
                                )
                            }
                            ListFooterComponent={this.renderListFooter()}
                        />
                    </View>
                )

            case 'two':
                return (
                    <View style={{ flex: 1 }}>
                        <View
                            style={{
                                width: '100%',
                                borderWidth: 1,
                                marginTop: 20,
                                borderColor: '#FAF7F7',
                            }}
                        ></View>
                        <View
                            style={{
                                justifyContent: 'center',
                                marginTop: 10,
                            }}
                        >
                            <TextInput
                                theme={{
                                    colors: {
                                        primary: 'grey',
                                        underlineColor: 'transparent',
                                    },
                                }}
                                value={this.state.closeFriendsSearchText}
                                onChangeText={(input) =>
                                    this.searchCloseFriends(input, closeFriends)
                                }
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: 'lightgrey',
                                    width: '95%',
                                    height: 35,
                                    marginHorizontal: 10,

                                    // padding: 10,
                                }}
                                underlineColor={'transparent'}
                                placeholder={'Search'}
                                left={
                                    <TextInput.Icon
                                        name={() => (
                                            <MaterialIcons
                                                name={'search'}
                                                size={20}
                                                color="grey"
                                            />
                                        )}
                                    />
                                }
                            />
                        </View>
                        <View
                            style={{
                                width: '100%',
                                borderWidth: 1,
                                marginTop: 20,
                                borderColor: '#FAF7F7',
                            }}
                        ></View>

                        <FlatList
                            data={
                                this.state.closeFriendsFilteredData &&
                                this.state.closeFriendsFilteredData.length > 0
                                    ? this.state.closeFriendsFilteredData
                                    : closeFriends
                            }
                            renderItem={this.renderItem}
                            keyExtractor={this.keyExtractor}
                            onRefresh={this.handleRefresh}
                            refreshing={this.props.refreshing}
                            onEndReached={this.handleOnLoadMore}
                            onEndReachedThreshold={0}
                            ListEmptyComponent={
                                this.props.refreshing ? null : (
                                    <EmptyResult
                                        text={"You haven't added any "}
                                    />
                                )
                            }
                            ListFooterComponent={this.renderListFooter()}
                        />
                    </View>
                )
        }
    }

    render() {
        const { user, userId } = this.props
        const { routes, index } = this.state
        const modalTitle = `${user.name}'s Friends`
        const friendCount = this.props.data ? this.props.data.length : 0

        return (
            <View style={styles.containerStyle}>
                <SearchBarHeader backButton title={modalTitle} />

                {/* <Text
                    style={{
                        fontFamily: text.FONT_FAMILY.BOLD,
                        fontWeight: 'bold',

                        letterSpacing: 0.3,
                        marginLeft: 24,
                        marginTop: 24,
                    }}
                >
                    {friendCount} Friend{friendCount !== 1 ? 's' : null}
                </Text> */}
                {/* {this.renderListHeader()} */}

                <View
                    style={{ flex: 1, backgroundColor: 'white', marginTop: 30 }}
                >
                    <TabView
                        renderTabBar={this.renderTabBar}
                        navigationState={{ index, routes }}
                        renderScene={this._renderTabs}
                        onIndexChange={this._handleChangeTab}
                    />
                </View>
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
}

const mapStateToProps = (state) => {
    const { friends } = state.meet
    const { user, userId } = state.user

    const { data, refreshing } = friends
    const navigationTab = state.navigation.tab
    return {
        data,
        refreshing,
        user,
        navigationTab,
        userId,
    }
}

export default connect(mapStateToProps, {
    loadMoreRequest,
    handleRefreshFriend,
})(wrapAnalytics(FriendTabView, SCREENS.FRIEND_TAB_VIEW))
