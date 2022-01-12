/**
 * View that displays user goals available to share
 * Clicking on a goal mounts it to ShareModal
 *
 * @format
 * */

import _ from 'lodash'
import React, { Component } from 'react'
import { TextInput } from 'react-native-paper'
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native'
import { MenuProvider } from 'react-native-popup-menu'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { MaterialIcons } from '@expo/vector-icons'

/* Actions */
import {
    handleRefreshFriend,
    loadMoreRequest,
} from '../../../redux/modules/meet/MeetActions'
import {
    onFriendsItemSelect,
    onFriendsItemUnselect,
    clearFriendsArray,
} from '../../../redux/modules/SeekHelp/seekHelpAction'
// import EmptyResult from '../../../Common/Text/EmptyResult'
import { postHelpFriends } from '../../../redux/modules/SeekHelp/seekHelpAction'
// Selector
import { getUserGoalsForTribeShare } from '../../../redux/modules/tribe/TribeSelector'
/* Components */
import { wrapAnalytics, SCREENS } from '../../../monitoring/segment'
import EmptyResult from '../../Common/Text/EmptyResult'
import ModalHeader from '../../Common/Header/ModalHeader'
import { color } from '../../../styles/basic'
import DelayedButton from '../../Common/Button/DelayedButton'
import UserCard from '../../Goal/GoalDetailCard/Suggestion/UserCard'
import InviteFriendModal from '../../MeetTab/Modal/InviteFriendModal'

const KEY = 'friends'
const DEBUG_KEY = '[ UI MyTribeGoalShare ]'

class MyTribeInviteFriends extends Component {
    constructor(props) {
        super(props)
        this.state = {
            query: '',
            showInviteFriendModal: false,
            friendsFilteredData: [],
        }
    }

    componentDidMount() {
        if (_.isEmpty(this.props.data)) this.props.handleRefreshFriend()
        //  this.props.tribeRefreshUserGoals(this.props.tribeId, this.props.pageId)
    }
    handleRefresh = () => {
        this.props.handleRefreshFriend()
    }

    // handleRefresh = () => {
    //     this.props.tribeRefreshUserGoals(this.props.tribeId, this.props.pageId)
    // }

    //  handleOnLoadMore = () => {
    //      this.props.tribeLoadMoreUserGoals(this.props.tribeId, this.props.pageId)
    //  }
    handleOnLoadMore = () => {
        this.props.loadMoreRequest(KEY)
    }

    handleOnBackPress = () => {
        Actions.pop()
    }
    openInviteFriendModal = () => {
        this.setState({ ...this.state, showInviteFriendModal: true })
    }
    closeInviteFriendModal = () => {
        this.setState({ ...this.state, showInviteFriendModal: false })
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
    //  renderListFooter() {
    //     const { loading, data } = this.props
    //     // console.log(`${DEBUG_KEY}: loading is: ${loadingMore}, data length is: ${data.length}`);
    //     if (loading && data.length >= SUGGESTION_SEARCH_LIMIT) {
    //         return (
    //             <View
    //                 style={{
    //                     paddingVertical: 20,
    //                 }}
    //             >
    //                 <ActivityIndicator size="small" />
    //             </View>
    //         )
    //     }
    // }
    searchFriends = (input) => {
        this.setState({ query: input })
        let friendsFilteredData = this.props.data.filter(function (item) {
            return item.name.includes(input)
        })
        this.setState({ friendsFilteredData: friendsFilteredData })
    }

    renderItem = ({ item }) => {
        const { selectedItemFriend, pageId } = this.props
        // console.log('THIS IS SELECTED', selectedItemFriend)
        console.log('THIS IS SELECTED ITEM', selectedItemFriend)
        //         const selected = selectedItemFriend && selectedItemFriend._id === item._id
        // console.log("THIS IS SELECTED TRUE",selected);
        return (
            <>
                <UserCard
                    item={item}
                    onCardPress={(val) => {
                        // console.log("THIS IS selected",val);
                        if (
                            selectedItemFriend &&
                            selectedItemFriend.some((e) => e._id === item._id)
                        ) {
                            this.props.onFriendsItemUnselect(val, pageId)
                        } else {
                            this.props.onFriendsItemSelect(val, pageId)
                            if (this.props.onSelect) {
                                this.props.onSelect()
                            }
                        }
                    }}
                    selected={
                        selectedItemFriend &&
                        selectedItemFriend.some((e) => e._id === item._id)
                    }
                />
                <View
                    style={{
                        width: '82%',
                        height: 1,
                        alignSelf: 'flex-end',
                        marginRight: 15,
                        backgroundColor: 'lightgray',
                    }}
                />
            </>
        )
    }
    renderMainComp = () => {
        return (
            <View style={{ backgroundColor: 'white', padding: 15, flex: 1 }}>
                {/* <Text
                     style={{ color: 'black', fontSize: 18, fontWeight: '700' }}
                 >
                     Invite GoalMogul Members
                 </Text> */}
                {this.renderSearch()}
                {/* <Text style={{color:'rgba(0,0,0,0.6)',fontSize:18,fontWeight:'700',paddingTop:10}}>Suggested</Text>
                  
                  <Text style={{color:'rgba(0,0,0,0.6)',fontSize:18,fontWeight:'700',paddingTop:20}}>All Others</Text> */}
                <View
                    style={{
                        width: '140%',
                        height: 8,
                        backgroundColor: '#F2F2F2',
                        left: -20,
                        marginTop: 10,
                    }}
                />
                <FlatList
                    data={
                        this.state.friendsFilteredData &&
                        this.state.friendsFilteredData.length > 0
                            ? this.state.friendsFilteredData
                            : this.props.data
                    }
                    renderItem={this.renderItem}
                    keyExtractor={(item) => item._id}
                    onEndReached={() => this.handleOnLoadMore()}
                    onEndReachedThreshold={0}
                    onRefresh={() => this.handleRefresh()}
                    refreshing={this.props.refreshing}
                    ListFooterComponent={this.renderListFooter()}
                    ListEmptyComponent={
                        this.props.refreshing ? null : (
                            <EmptyResult
                                text={"You haven't added any Friends"}
                            />
                        )
                    }
                />
                <DelayedButton
                    onPress={() =>
                        this.props.postHelpFriends({
                            helpText: this.props.helpText,
                            user: this.props.user,
                            goal: this.props.lateGoal,
                            hideFrom: this.props.selectedItemFriend,
                            privacy:
                                this.props.selected.key === 'friendsExcept'
                                    ? 'exclude-friends'
                                    : this.props.selected.key ===
                                      'closeFriendsExcept'
                                    ? 'exclude-close-friends'
                                    : 'specific-friends',
                        })
                    }
                    activeOpacity={0.6}
                    style={{
                        alignItems: 'center',
                        opacity: 1,
                        backgroundColor: color.GM_BLUE,
                        width: '90%',
                        height: 35,
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: 'white',
                            fontWeight: '600',
                            fontSize: 16,
                        }}
                    >
                        Submit
                    </Text>
                </DelayedButton>
            </View>
        )
    }

    handleSearchCancel = () => {
        console.log(`${DEBUG_KEY}: search cancel`)
        this.handleQueryChange('')
        // this.props.clearSearchState()

        // This is a hacky way to work around SearchBar bug
        // We have to trigger focus again before calling blur
        this.searchBar.focus()
        this.searchBar.blur()
    }

    handleSearchClear = () => this.handleQueryChange('')
    handleQueryChange = (query) => {
        // this.setState(state => ({ ...state, query: query || '' }));
        if (query === undefined) {
            return
        }

        this.setState({
            ...this.state,
            query,
        })
    }

    renderSearch() {
        // const { suggestionType } = this.props
        // const placeholder =
        //     suggestionType === 'ChatConvoRoom'
        //         ? 'Search Chat Room'
        //         : `Search ${this.props.suggestionType}`
        return (
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
                    value={this.state.query}
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
        )
    }

    renderListEmptyState() {
        return (
            <EmptyResult
                text="No Goals to Share"
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

    externalContactComponenet() {
        return (
            <View
                style={{
                    width: '100%',
                    height: 120,
                    backgroundColor: 'white',
                    padding: 15,
                    paddingTop: 20,
                }}
            >
                <Text
                    style={{
                        color: 'black',
                        fontSize: 18,
                        fontWeight: '600',
                        paddingBottom: 20,
                    }}
                >
                    Invite External Contacts
                </Text>
                <DelayedButton
                    onPress={() => this.openInviteFriendModal()}
                    activeOpacity={0.6}
                    style={{
                        alignItems: 'center',
                        opacity: 1,
                        backgroundColor: color.GM_BLUE,
                        width: 190,
                        height: 35,
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: 'white',
                            fontWeight: '600',
                            fontSize: 16,
                        }}
                    >
                        {this.props.accountability
                            ? 'Invite From Contacts'
                            : 'Share Trible Link'}
                    </Text>
                </DelayedButton>
            </View>
        )
    }

    render() {
        const { data } = this.props
        const { selectedItemFriend, tribeId } = this.props
        console.log('this tribe', this.props.key)
        return (
            <MenuProvider
                customStyles={{ backdrop: styles.backdrop }}
                skipInstanceCheck={true}
            >
                <InviteFriendModal
                    tribeCode={this.props.tribe}
                    isVisible={this.state.showInviteFriendModal}
                    closeModal={this.closeInviteFriendModal}
                    isTribe={this.props.accountability ? false : true}
                    tribeDes={`Join me in the ${this.props.tribe?.name} Tribe on GoalMogul. You'll find great value and meet like-minded people!`}
                />
                <View style={styles.containerStyle}>
                    <ModalHeader
                        onCancel={() => {
                            this.props.clearFriendsArray(this.props.pageId)
                            Actions.pop()
                        }}
                        //  onAction={() => {
                        //      this.props.addFriends(
                        //          tribeId,
                        //          selectedItemFriend,
                        //          () => {
                        //              Alert.alert('Friends Added')
                        //              this.props.clearFriendsArray(
                        //                  this.props.pageId
                        //              )
                        //              Actions.pop()
                        //          }
                        //      )
                        //  }}
                        title={
                            this.props.selected.key === 'friendsExcept'
                                ? 'Friends Expect'
                                : this.props.selected.key ===
                                  'closeFriendsExcept'
                                ? 'Close Friends Except'
                                : 'Specific Friends'
                        }
                        cross
                        //  actionText="Add"
                        //  actionDisabled={
                        //      this.props.selectedItemFriend === undefined
                        //  }
                    />
                    {/* {this.externalContactComponenet()} */}
                </View>

                {this.renderMainComp()}
            </MenuProvider>
        )
    }
}

const styles = {
    containerStyle: {
        backgroundColor: color.GM_BACKGROUND,
    },
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.5,
    },
    searchContainerStyle: {
        marginVertical: 10,
        width: '100%',
        padding: 0,
        marginTop: 15,
        // backgroundColor: 'gray',
        // backgroundColor: '#17B3EC',
        // borderTopColor: 'gray',
        // borderBottomColor: 'gray',
        borderWidth: 0.5,
        borderColor: 'lightgray',
        borderRadius: 5,
        alignSelf: 'center',
    },
    searchInputContainerStyle: {
        // backgroundColor: '#f3f4f6',
        backgroundColor: 'white',
        height: 10,
        alignItems: 'center',

        justifyContent: 'center',
    },
    searchInputStyle: {
        fontSize: 16,
    },
    searchIconStyle: {
        top: 15,
        fontSize: 13,
    },
}
const mapStateToProps = (state, props) => {
    //  console.log("this is state",state.tribes);
    // Set userId to main user if no userId present in props
    const { friends } = state.meet
    // const { selectedItemFriend } = state.seekHelp
    const { data, refreshing } = friends
    //  console.log("THIS IS DATA",data)
    const seekHelp = state.seekHelp
    const { selected, selectedItemFriend } = seekHelp
    const { user, token } = state.user
    const lateGoal = state.profile.lateGoal
    return {
        data,
        refreshing,
        selectedItemFriend,
        selected,
        user,
        token,
        lateGoal,
    }
}

export default connect(mapStateToProps, {
    //  tribeRefreshUserGoals,
    //  tribeLoadMoreUserGoals,
    //  openNewShareToTribeView,
    //  refreshMyTribeDetail,
    loadMoreRequest,
    handleRefreshFriend,
    onFriendsItemSelect,
    onFriendsItemUnselect,
    clearFriendsArray,
    postHelpFriends,
})(wrapAnalytics(MyTribeInviteFriends, SCREENS.TRIBE_GOAL_SHARE))
