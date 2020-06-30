/** @format */

import Fuse from 'fuse.js'
import R from 'ramda'
import React from 'react'
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { MenuProvider } from 'react-native-popup-menu'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { loadFriends } from '../../../actions'
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

// Actions
import {
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
import { DEFAULT_STYLE, GM_BLUE } from '../../../styles'
// Constants
import {
    IMAGE_BASE_URL,
    IPHONE_MODELS,
    DEVICE_MODEL,
} from '../../../Utils/Constants'
import {
    actionSheet,
    switchByButtonIndex,
} from '../../Common/ActionSheetFactory'
import PlusButton from '../../Common/Button/PlusButton'
// Components
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import EmptyResult from '../../Common/Text/EmptyResult'
import ProfilePostCard from '../../Post/PostProfileCard/ProfilePostCard'
import About from './MyTribeAbout'
import { SCREENS, wrapAnalytics } from '../../../monitoring/segment'

import MyTribeBanner from './MyTribeBanner'

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
        this.switchCaseButton = this.switchCaseButton.bind(this)
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

    handleRespondToInvitation = (item) => {
        const { _id } = item
        const options = switchByButtonIndex([
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

        const requestOptions = ['Accept', 'Decline', 'Cancel']
        const statusActionSheet = actionSheet(requestOptions, 2, options)
        statusActionSheet()
    }

    getMemberData() {
        return this.props.memberData
    }

    /**
     * Handle modal setting on click. Show IOS menu with options
     */
    handlePageSetting = (item) => {
        const { _id } = item
        const { userTribeStatus } = this.props
        const isAdmin = userTribeStatus === 'Admin'
        const isMember = userTribeStatus === 'Member'

        let options
        let requestOptions
        let cancelIndex = 2
        if (isAdmin) {
            requestOptions = ['Edit', 'Delete', 'Cancel']
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
        } else if (isMember) {
            requestOptions = ['Leave Tribe', 'Report', 'Cancel']
            options = switchByButtonIndex([
                [
                    R.equals(0),
                    () => {
                        console.log(
                            `${DEBUG_KEY} User chooses to remove request`
                        )
                        this.props.leaveTribe(_id, 'mytribe')
                    },
                    R.equals(1),
                    () => {
                        console.log(
                            `${DEBUG_KEY} User chooses to remove request`
                        )
                        this.props.reportTribe(_id)
                    },
                ],
            ])
        } else {
            cancelIndex = 1
            requestOptions = ['Report', 'Cancel']
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

        const tribeActionSheet = actionSheet(
            requestOptions,
            cancelIndex,
            options
        )
        tribeActionSheet()
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

    switchCaseButton = (status, item, _id) =>
        switchCase({
            Admin: {
                text: 'Invite Friends',
                onPress: () => this.openUserInviteModal(item),
            },
            Member: {
                text: 'Invite Friends',
                onPress: () => this.openUserInviteModal(item),
                disabled: !item.membersCanInvite,
            },
            JoinRequester: {
                text: 'Withdraw Request',
                onPress: () =>
                    this.props.requestJoinTribe(
                        item._id,
                        false,
                        this.props.pageId
                    ),
            },
            Invitee: {
                text: 'Respond',
                onPress: () => this.handleRespondToInvitation(item),
            },
        })({
            text: 'Join Tribe',
            onPress: () =>
                this.props.requestJoinTribe(item._id, true, this.props.pageId),
        })(status)

    renderUserStatusButton() {
        const { userTribeStatus, item } = this.props
        const buttonProps = this.switchCaseButton(userTribeStatus, item)

        return (
            <TouchableOpacity
                style={[
                    styles.buttonStyleInvite,
                    { opacity: buttonProps.disabled ? 0.6 : 1 },
                ]}
                onPress={buttonProps.onPress}
                disabled={buttonProps.disabled}
            >
                <Text style={{ ...styles.buttonText, color: 'white' }}>
                    {buttonProps.text}
                </Text>
            </TouchableOpacity>
        )
    }

    renderTribeOverview() {
        const {
            tribeId,
            pageId,
            item,
            data,
            feedLoading,
            feedRefreshing,
        } = this.props
        const { name, picture, memberCount } = item
        const newDate = item.created ? new Date(item.created) : new Date()
        const date = `${
            months[newDate.getMonth()]
        } ${newDate.getDate()}, ${newDate.getFullYear()}`
        const count = memberCount || '0'

        const emptyState =
            data.length === 0 && !feedLoading && !feedRefreshing ? (
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
                        {this.renderUserStatusButton()}
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
        const { userTribeStatus } = this.props
        if (
            this.state.showPlus &&
            (userTribeStatus === 'Admin' || userTribeStatus === 'Member')
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
        userTribeStatus: getMyTribeUserStatus(state, tribeId),
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
})(wrapAnalytics(MyTribe, SCREENS.TRIBE_DETAIL))
