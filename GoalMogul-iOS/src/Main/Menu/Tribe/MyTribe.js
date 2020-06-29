/** @format */

import Fuse from 'fuse.js'
import R from 'ramda'
import React, { Component } from 'react'
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    Image,
    Platform,
    Text,
    TouchableOpacity,
    View,
    Button,
} from 'react-native'
import { MenuProvider } from 'react-native-popup-menu'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { loadFriends } from '../../../actions'
import Icons from '../../../asset/base64/Icons'
import envelope from '../../../asset/utils/envelope.png'
import invite from '../../../asset/utils/invite.png'
import post from '../../../asset/utils/post.png'
import tribe_default_icon from '../../../asset/utils/tribeIcon.png'
import { switchCase, decode } from '../../../redux/middleware/utils'
import { openPostDetail } from '../../../redux/modules/feed/post/PostActions'
import {
    subscribeEntityNotification,
    unsubscribeEntityNotification,
} from '../../../redux/modules/notification/NotificationActions'
import {
    openMultiUserInviteModal,
    searchFriend,
} from '../../../redux/modules/search/SearchActions'

// modal
import MyTribeDescription from './MyTribeDescription'
// middleware
import { componentKeyByTab } from '../../../redux/middleware/utils'
// Actions
import {
    myTribeAdminAcceptUser,
    myTribeAdminDemoteUser,
    myTribeAdminPromoteUser,
    myTribeAdminRemoveUser,
    myTribeReset,
    refreshMyTribeDetail,
    tribeDetailClose,
    loadMoreTribeFeed,
    requestJoinTribe,
    acceptTribeInvit,
    declineTribeInvit,
    leaveTribe,
    deleteTribe,
    editTribe,
    inviteMultipleUsersToTribe,
    openTribeInvitModal,
    reportTribe,
} from '../../../redux/modules/tribe/MyTribeActions'
// Selector
import {
    getMyTribeUserStatus,
    myTribeMemberSelector,
    getMyTribeDetailById,
    getMyTribeFeedSelector,
} from '../../../redux/modules/tribe/TribeSelector'
// Styles
import { APP_DEEP_BLUE, DEFAULT_STYLE, GM_BLUE } from '../../../styles'
// Constants
import {
    CARET_OPTION_NOTIFICATION_SUBSCRIBE,
    CARET_OPTION_NOTIFICATION_UNSUBSCRIBE,
    IMAGE_BASE_URL,
    IPHONE_MODELS,
    DEVICE_MODEL,
} from '../../../Utils/Constants'
import { DotIcon } from '../../../Utils/Icons'
import {
    actionSheet,
    switchByButtonIndex,
} from '../../Common/ActionSheetFactory'
import DelayedButton from '../../Common/Button/DelayedButton'
import PlusButton from '../../Common/Button/PlusButton'
import Divider from '../../Common/Divider'
// Components
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import { MenuFactory } from '../../Common/MenuFactory'
import TabButtonGroup from '../../Common/TabButtonGroup'
import EmptyResult from '../../Common/Text/EmptyResult'
import ProfilePostCard from '../../Post/PostProfileCard/ProfilePostCard'
import MemberListCard from '../../Tribe/MemberListCard'
import About from './MyTribeAbout'

import MyTribeBanner from './MyTribeBanner'

const { CheckIcon: check } = Icons
const DEBUG_KEY = '[ UI MyTribe ]'
const { width } = Dimensions.get('window')
const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]
const CANCEL_REQUEST_INDEX = 1
const CANCEL_REQUEST_OPTIONS = ['Cancel the request', 'Cancel']
const REQUEST_OPTIONS = ['Request to join', 'Cancel']
const TAG_SEARCH_OPTIONS = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['name'],
}

const SEARCHBAR_HEIGHT =
    Platform.OS === 'ios' && IPHONE_MODELS.includes(DEVICE_MODEL) ? 30 : 40

const SCREEN_HEIGHT = Dimensions.get('window').height
const PADDING = SCREEN_HEIGHT - 48.5 - SEARCHBAR_HEIGHT

const INFO_CARD_HEIGHT = (width * 0.95) / 3 + 30 + 56.5
/**
 * This is the UI file for a single event.
 */
class MyTribe extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            imageLoading: false,
            showPlus: true,
            infoCardHeight: new Animated.Value(INFO_CARD_HEIGHT),
            infoCardOpacity: new Animated.Value(1),
            showAboutModal: false,
            showNameInTitle: false,
        }
    }

    componentWillUnmount() {
        this.props.tribeDetailClose(this.props.tribeId, this.props.pageId)
    }

    openUserInviteModal = (item) => {
        const { name, _id } = item
        this.props.openMultiUserInviteModal({
            searchFor: this.props.searchFriend,
            onSubmitSelection: (users, inviteToEntity, actionToExecute) => {
                const callback = () => {
                    this.props.refreshMyTribeDetail(
                        inviteToEntity,
                        this.props.pageId,
                        null,
                        false
                    )
                    actionToExecute()
                }
                this.props.inviteMultipleUsersToTribe(_id, users, callback)
            },
            onCloseCallback: (actionToExecute) => {
                actionToExecute()
            },
            inviteToEntityType: 'Tribe',
            inviteToEntityName: name,
            inviteToEntity: _id,
            preload: this.props.loadFriends,
        })
    }

    /**
     * This function is passed to MemberListCard when setting icon is clicked
     * and remove user option is chosen
     */
    handleRemoveUser = (userId) => {
        const { _id } = this.props.item
        this.props.myTribeAdminRemoveUser(userId, _id)
    }

    /**
     * This function is passed to MemberListCard when setting icon is clicked
     * and promote user option is chosen
     */
    handlePromoteUser = (userId) => {
        const { _id } = this.props.item
        this.props.myTribeAdminPromoteUser(userId, _id)
    }

    /**
     * This function is passed to MemberListCard when setting icon is clicked
     * and demote user option is chosen
     */
    handleDemoteUser = (userId) => {
        const { _id } = this.props.item
        this.props.myTribeAdminDemoteUser(userId, _id)
    }

    /**
     * This function is passed to MemberListCard when setting icon is clicked
     * and accept user's join request option is chosen
     */
    handleAcceptUser = (userId) => {
        const { _id } = this.props.item
        this.props.myTribeAdminAcceptUser(userId, _id)
    }

    /**
     * On plus clicked, show two icons. Post and Invite
     * const { textStyle, iconStyle, iconSource, text, onPress } = button;
     */
    handlePlus = (item) => {
        const { _id } = item

        const postCallback = () => {
            this.props.refreshMyTribeDetail(_id, this.props.pageId)
        }

        const members = item
            ? item.members
                  .filter(
                      (m) => m.category === 'Admin' || m.category === 'Member'
                  )
                  .map((m) => m.memberRef)
            : []
        const fuse = new Fuse(members, TAG_SEARCH_OPTIONS)
        const tagSearch = (keyword, callback) => {
            const result = fuse.search(keyword.replace('@', ''))
            callback({ data: result }, keyword)
        }

        const buttons = [
            // button info for creating a post
            {
                iconSource: post,
                text: 'Post',
                iconStyle: { height: 18, width: 18, marginLeft: 3 },
                textStyle: { marginLeft: 5 },
                onPress: () => {
                    console.log('User trying to create post')
                    this.setState({
                        ...this.state,
                        showPlus: true,
                    })
                    Actions.createPostModal({
                        belongsToTribe: _id,
                        callback: postCallback,
                        tagSearch,
                    })
                },
            },
            // button info for invite
            {
                iconSource: invite,
                text: 'Invite',
                iconStyle: { height: 18, width: 18, marginLeft: 3 },
                textStyle: { marginLeft: 5 },
                onPress: () => {
                    console.log('User trying to invite an user')
                    this.setState({
                        ...this.state,
                        showPlus: true,
                    })
                    // this.props.openTribeInvitModal({
                    //   tribeId: _id,
                    //   cardIconSource: invite,
                    //   cardIconStyle: { tintColor: APP_BLUE_BRIGHT }
                    // });
                    this.openUserInviteModal(item)
                },
            },
        ]
        this.setState({
            ...this.state,
            showPlus: false,
        })

        const callback = () => {
            this.setState({
                ...this.state,
                showPlus: true,
            })
        }
        Actions.push('createButtonOverlay', {
            buttons,
            callback,
            pageId: this.props.pageId,
            onCancel: () => {
                this.setState({
                    ...this.state,
                    showPlus: true,
                })
            },
        })
    }

    handleTribeOptionsOnSelect = (value) => {
        const { item } = this.props
        if (!item) return

        const { _id } = item
        if (value === 'Delete') {
            return this.props.deleteTribe(_id)
        }
        if (value === 'Edit') {
            return this.props.editTribe(item)
        }
    }

    // This function is deprecated and replaced by renderPlus
    handleInvite = (_id) => {
        return this.props.openTribeInvitModal(_id)
    }

    handleStatusChange = (isMember, item) => {
        let options
        const { _id } = item
        if (isMember === 'Member') {
            options = switchByButtonIndex([
                [
                    R.equals(0),
                    () => {
                        console.log(
                            `${DEBUG_KEY} User chooses to remove request`
                        )
                        this.props.leaveTribe(_id, 'mytribe')
                    },
                ],
            ])
        } else if (isMember === 'JoinRequester') {
            options = switchByButtonIndex([
                [
                    R.equals(0),
                    () => {
                        console.log(
                            `${DEBUG_KEY} User chooses to remove request`
                        )
                        this.props.requestJoinTribe(
                            _id,
                            false,
                            this.props.pageId
                        )
                    },
                ],
            ])
        } else if (isMember === 'Invitee') {
            options = switchByButtonIndex([
                [
                    R.equals(0),
                    () => {
                        console.log(`${DEBUG_KEY} User chooses to accept`)
                        this.props.acceptTribeInvit(_id)
                    },
                ],
                [
                    R.equals(1),
                    () => {
                        console.log(`${DEBUG_KEY} User chooses to decline`)
                        this.props.declineTribeInvit(_id)
                    },
                ],
            ])
        } else {
            options = switchByButtonIndex([
                [
                    R.equals(0),
                    () => {
                        console.log(`${DEBUG_KEY} User chooses to `)
                    },
                ],
            ])
        }

        const requestOptions = switchCasesMemberStatusChangeText(isMember)
        const cancelIndex = switchCasesCancelIndex(isMember)
        const statusActionSheet = actionSheet(
            requestOptions,
            cancelIndex,
            options
        )
        statusActionSheet()
    }

    getMemberData() {
        return this.props.memberData
    }

    /**
     * Handle modal setting on click. Show IOS menu with options
     */
    handlePageSetting = (item) => {
        const { _id, members } = item
        const { userId } = this.props
        const isAdmin = checkIsAdmin(members, userId)

        let options
        if (isAdmin) {
            options = switchByButtonIndex([
                [
                    R.equals(0),
                    () => {
                        console.log(
                            `${DEBUG_KEY} User chooses to edit current tribe`
                        )
                        this.props.editTribe(item)
                    },
                ],
                [
                    R.equals(1),
                    () => {
                        console.log(
                            `${DEBUG_KEY} User chooses to delete current tribe`
                        )
                        this.props.deleteTribe(_id)
                    },
                ],
            ])
        } else {
            options = switchByButtonIndex([
                [
                    R.equals(0),
                    () => {
                        console.log(
                            `${DEBUG_KEY} User chooses to remove request`
                        )
                        this.props.reportTribe(_id)
                    },
                ],
            ])
        }

        const requestOptions = isAdmin
            ? ['Edit', 'Delete', 'Cancel']
            : ['Report', 'Cancel']
        const cancelIndex = isAdmin ? 2 : 1

        const tribeActionSheet = actionSheet(
            requestOptions,
            cancelIndex,
            options
        )
        tribeActionSheet()
    }

    handleRequestOnPress = () => {
        const { item, hasRequested } = this.props
        if (!item) return
        const { _id } = item

        let options
        if (hasRequested) {
            options = switchByButtonIndex([
                [
                    R.equals(0),
                    () => {
                        console.log(
                            `${DEBUG_KEY} User chooses to remove request`
                        )
                        this.props.requestJoinTribe(
                            _id,
                            false,
                            this.props.pageId
                        )
                    },
                ],
            ])
        } else {
            options = switchByButtonIndex([
                [
                    R.equals(0),
                    () => {
                        console.log(
                            `${DEBUG_KEY} User chooses to join the tribe`
                        )
                        this.props.requestJoinTribe(
                            _id,
                            true,
                            this.props.pageId
                        )
                    },
                ],
            ])
        }

        const requestOptions = hasRequested
            ? CANCEL_REQUEST_OPTIONS
            : REQUEST_OPTIONS

        const rsvpActionSheet = actionSheet(
            requestOptions,
            CANCEL_REQUEST_INDEX,
            options
        )
        rsvpActionSheet()
    }

    /**
     * Caret to show options for a tribe.
     * If owner, options are delete and edit.
     * Otherwise, option is report.
     *
     * NOTE: this is currently deprecated and replaced by handlePageSetting
     */
    renderCaret(item) {
        // If item belongs to self, then caret displays delete
        const { creator, _id, maybeIsSubscribed } = item

        const isSelf = creator._id === this.props.userId
        const menu = !isSelf
            ? MenuFactory(
                  [
                      'Report',
                      maybeIsSubscribed
                          ? CARET_OPTION_NOTIFICATION_UNSUBSCRIBE
                          : CARET_OPTION_NOTIFICATION_SUBSCRIBE,
                  ],
                  (val) => {
                      if (val === 'Report') {
                          return this.props.reportTribe(_id)
                      }
                      if (val === CARET_OPTION_NOTIFICATION_UNSUBSCRIBE) {
                          return this.props.unsubscribeEntityNotification(
                              _id,
                              'Event'
                          )
                      }
                      if (val === CARET_OPTION_NOTIFICATION_SUBSCRIBE) {
                          return this.props.subscribeEntityNotification(
                              _id,
                              'Event'
                          )
                      }
                  },
                  '',
                  { ...styles.caretContainer },
                  () => console.log('User clicks on options for tribe')
              )
            : MenuFactory(
                  ['Edit', 'Delete'],
                  this.handleTribeOptionsOnSelect,
                  '',
                  { ...styles.caretContainer },
                  () => console.log('User clicks on options for self tribe.')
              )
        return (
            <View style={{ position: 'absolute', top: 3, right: 3 }}>
                {menu}
            </View>
        )
    }

    renderTribeImage(picture) {
        let imageUrl
        // let eventImage = (<Image source={tribe_default_icon} style={styles.defaultImageStyle} />);
        let tribeImage = (
            <Image
                source={tribe_default_icon}
                resizeMode="contain"
                style={styles.imageStyle}
            />
        )
        if (picture) {
            imageUrl = `${IMAGE_BASE_URL}${picture}`
            tribeImage = (
                <Image
                    onLoadStart={() => this.setState({ imageLoading: true })}
                    onLoadEnd={() => this.setState({ imageLoading: false })}
                    style={styles.imageStyle}
                    source={{ uri: imageUrl }}
                />
            )
        }

        return <View style={styles.imageWrapperStyle}>{tribeImage}</View>
    }

    // Render tribe visibility and user membership status
    renderVisibilityAndStatus(item) {
        const tribeVisibility = item.isPubliclyVisible
            ? 'Publicly Visible'
            : 'Private Tribe'

        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: 8,
                    marginBottom: 8,
                    alignItems: 'center',
                }}
            >
                <Text style={styles.tribeStatusTextStyle}>
                    {tribeVisibility}
                </Text>
                <Divider orthogonal height={12} borderColor="gray" />
                {this.renderMemberStatus(item)}
            </View>
        )
    }

    renderMemberStatus(item) {
        // TODO: remove test var
        // const isUserMemeber = isMember(item.members, this.props.user);
        const { isMember, hasRequested } = this.props
        const tintColor = isMember ? '#2dca4a' : 'gray'

        if (isMember) {
            const { text, iconSource, iconStyle } = switchCaseMemberStatus(
                isMember
            )
            return (
                <DelayedButton
                    activeOpacity={0.6}
                    // style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8, height: 23 }}
                    style={{ ...styles.rsvpBoxContainerStyle, marginLeft: 6 }}
                    onPress={() => this.handleStatusChange(isMember, item)}
                >
                    <Image source={iconSource} style={iconStyle} />
                    <Text
                        style={{
                            ...styles.tribeStatusTextStyle,
                            color: tintColor,
                        }}
                    >
                        {text}
                    </Text>
                </DelayedButton>
            )
        }
        // Return view to request to join
        const requestText = hasRequested ? 'Cancel Request' : 'Request to Join'
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.memberStatusContainerStyle}
                onPress={this.handleRequestOnPress}
            >
                <Text
                    style={{
                        ...styles.tribeStatusTextStyle,
                        color: tintColor,
                    }}
                >
                    {requestText}
                </Text>
            </TouchableOpacity>
        )
    }

    renderTribeOverview() {
        const { tribeId, pageId, item, data } = this.props
        const { name, picture, memberCount } = item
        const newDate = item.created ? new Date(item.created) : new Date()
        const date = `${
            months[newDate.getMonth()]
        } ${newDate.getDate()}, ${newDate.getFullYear()}`
        const count = memberCount || '0'

        const emptyState =
            data.length === 0 && !this.props.feedLoading ? (
                <EmptyResult text={'No Posts'} textStyle={{ paddingTop: 80 }} />
            ) : null

        return (
            <View>
                <View style={{ backgroundColor: 'white' }}>
                    <View
                        onLayout={({
                            nativeEvent: {
                                layout: { height },
                            },
                        }) => {
                            this.topCardHeight = height
                        }}
                    >
                        {this.renderTribeImage(picture)}
                        <View style={styles.generalInfoContainerStyle}>
                            <Text style={DEFAULT_STYLE.titleText_1}>
                                {decode(name)}
                            </Text>
                            <Text
                                style={{
                                    ...styles.tribeSizeTextStyle,
                                    color: '#737475',
                                    marginTop: 5,
                                }}
                            >
                                {count} members | Created {date}
                            </Text>
                        </View>
                        <About pageId={pageId} tribeId={tribeId} data={item} />
                    </View>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={styles.buttonStyleAbout}
                            onPress={() => {
                                this.setState({
                                    ...this.state,
                                    showAboutModal: true,
                                })
                            }}
                        >
                            <Text style={styles.buttonText}>About</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonStyleInvite}
                            onPress={() => this.openUserInviteModal(item)}
                        >
                            <Text
                                style={{ ...styles.buttonText, color: 'white' }}
                            >
                                Invite friends
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <MyTribeBanner />
                {emptyState}
            </View>
        )
    }

    handleOnEndReached = (tribeId) => {
        // Do not load more when user is not on posts tab
        if (!tribeId) return

        this.props.loadMoreTribeFeed(tribeId, this.props.pageId)
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

    renderAddPostButton(item) {
        const { isMember } = this.props
        if (
            this.state.showPlus &&
            (isMember === 'Admin' || isMember === 'Member')
        ) {
            return (
                <PlusButton
                    plusActivated={this.state.showPlus}
                    onPress={() => {
                        const postCallback = () => {
                            this.props.refreshMyTribeDetail(
                                _id,
                                this.props.pageId
                            )
                        }
                        const tagSearch = (keyword, callback) => {
                            const result = fuse.search(keyword.replace('@', ''))
                            callback({ data: result }, keyword)
                        }
                        Actions.createPostModal({
                            belongsToTribe: item._id,
                            callback: postCallback,
                            tagSearch,
                        })
                    }}
                />
            )
        }
        return null
    }

    render() {
        const { item, data } = this.props
        if (!item) return <View />
        return (
            <MenuProvider
                style={{ backgroundColor: '#FAFAFA' }}
                customStyles={{ backdrop: styles.backdrop }}
            >
                <SearchBarHeader
                    backButton
                    title={this.state.showNameInTitle ? decode(item.name) : ''}
                    onBackPress={() => Actions.pop()} // componentWillUnmount takes care of the state cleaning
                    pageSetting
                    handlePageSetting={() => this.handlePageSetting(item)}
                />
                <FlatList
                    ref="flatList"
                    data={data}
                    keyExtractor={(i) => i._id}
                    ListHeaderComponent={this.renderTribeOverview()}
                    renderItem={this.renderItem}
                    loading={this.props.tribeLoading}
                    refreshing={this.props.loading}
                    onRefresh={() =>
                        this.props.refreshMyTribeDetail(
                            item._id,
                            this.props.pageId
                        )
                    }
                    onEndReached={() => this.handleOnEndReached(item._id)}
                    onEndReachedThreshold={2}
                    onScroll={({
                        nativeEvent: {
                            contentOffset: { y },
                        },
                    }) => {
                        if (this.topCardHeight <= y)
                            this.setState({ showNameInTitle: true })
                        else this.setState({ showNameInTitle: false })
                    }}
                    scrollEventThrottle={2}
                />
                {this.renderAddPostButton(item)}
                <MyTribeDescription
                    isVisible={this.state.showAboutModal}
                    closeModal={() => {
                        this.setState({
                            ...this.state,
                            showAboutModal: false,
                        })
                    }}
                    item={this.props.item}
                />
            </MenuProvider>
        )
    }
}

const styles = {
    imageContainerStyle: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
    },
    imageStyle: {
        width: '100%',
        height: '100%',
    },
    imageWrapperStyle: {
        height: (width * 0.95) / 3 + 30 + 10,
        backgroundColor: 'white',
    },
    // This is the style for general info container
    generalInfoContainerStyle: {
        alignItems: 'center',
        padding: 16,
    },
    // Style for subinfo
    tribeStatusTextStyle: {
        ...DEFAULT_STYLE.smallText_1,
        marginLeft: 4,
        marginRight: 4,
    },
    memberStatusContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
        width: 100,
        height: 23,
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    // caret for options
    caretContainer: {
        padding: 14,
    },
    // Style for Invite button
    inviteButtonContainerStyle: {
        height: 30,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        marginRight: 20,
        backgroundColor: '#efefef',
        borderRadius: 5,
    },

    // Style for tribe info
    tribeInfoContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tribeSizeTextStyle: DEFAULT_STYLE.smallText_1,
    backdrop: {
        backgroundColor: 'white',
        opacity: 0.5,
    },
    // Styles for plus icon
    iconContainerStyle: {
        height: 54,
        width: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconStyle: {
        height: 26,
        width: 26,
        tintColor: 'white',
    },
    rsvpBoxContainerStyle: {
        height: 25,
        paddingVertical: 3,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 5,
        backgroundColor: '#efefef',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonGroup: {
        flexDirection: 'row',
        margin: 16,
    },
    buttonStyleAbout: {
        flex: 2,
        marginRight: 8,
        backgroundColor: '#F2F2F2',
        borderRadius: 3,
    },
    buttonStyleInvite: {
        flex: 4,
        backgroundColor: GM_BLUE,
        borderRadius: 3,
    },
    buttonText: {
        ...DEFAULT_STYLE.buttonText_1,
        textAlign: 'center',
        margin: 7,
    },
    aboutStyle: {
        backgroundColor: '#ffffff',
    },
}

const mapStateToProps = (state, props) => {
    const { tribeId, pageId } = props
    const { tribe, tribePage } = getMyTribeDetailById(state, tribeId, pageId)
    const {
        hasRequested,
        tribeLoading,
        feedLoading,
        feedRefreshing,
    } = tribePage
    const { userId } = state.user

    const memberData = myTribeMemberSelector(state, tribeId, pageId)

    const data = getMyTribeFeedSelector(state, tribeId, pageId)

    return {
        item: tribe,
        user: state.user,
        data,
        isMember: getMyTribeUserStatus(state, tribeId),
        hasRequested,
        userId,
        loading: tribeLoading,
        feedLoading,
        feedRefreshing,
        memberData,
    }
}

export default connect(mapStateToProps, {
    refreshMyTribeDetail,
    tribeDetailClose,
    openTribeInvitModal,
    deleteTribe,
    editTribe,
    reportTribe,
    leaveTribe,
    acceptTribeInvit,
    declineTribeInvit,
    requestJoinTribe,
    myTribeAdminRemoveUser,
    myTribeAdminPromoteUser,
    myTribeAdminDemoteUser,
    myTribeAdminAcceptUser,
    myTribeReset,
    openPostDetail,
    subscribeEntityNotification,
    unsubscribeEntityNotification,
    // Multi friend invite
    searchFriend,
    openMultiUserInviteModal,
    inviteMultipleUsersToTribe,
    loadFriends,
    loadMoreTribeFeed,
})(MyTribe)

const switchCaseMemberStatus = (status) =>
    switchCase({
        Admin: {
            text: 'Admin',
            iconSource: check,
            iconStyle: {
                height: 10,
                width: 13,
                tintColor: '#2dca4a',
            },
        },
        Member: {
            text: 'Member',
            iconSource: check,
            iconStyle: {
                height: 10,
                width: 13,
                tintColor: '#2dca4a',
            },
        },
        JoinRequester: {
            text: 'Requested',
            iconSource: envelope,
            iconStyle: {
                height: 12,
                width: 15,
                tintColor: '#2dca4a',
            },
        },
        Invitee: {
            text: 'Respond to Invitation',
            iconSource: envelope,
            iconStyle: {
                height: 12,
                width: 15,
                tintColor: '#2dca4a',
            },
        },
    })({ text: 'Unknown', iconSource: check })(status)

const switchCasesMemberStatusChangeText = (status) =>
    switchCase({
        Admin: ['Cancel'],
        Member: ['Leave tribe', 'Cancel'],
        JoinRequester: ['Cancel Request', 'Cancel'],
        Invitee: ['Accept', 'Decline', 'Cancel'],
    })(['Cancel'])(status)

const switchCasesCancelIndex = (status) =>
    switchCase({
        Admin: 0,
        Member: 1,
        JoinRequester: 1,
        Invitee: 2,
    })(0)(status)
