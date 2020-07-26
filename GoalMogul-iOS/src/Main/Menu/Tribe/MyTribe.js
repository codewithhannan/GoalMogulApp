/** @format */

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
// Assets
import plus from '../../../asset/utils/plus.png'
import flagIcon from '../../../asset/icons/flag.png'
import tribe_default_icon from '../../../asset/utils/tribeIcon.png'
// Utils
import { switchCase, decode } from '../../../redux/middleware/utils'
// modal
import MyTribeDescription from './MyTribeDescription'
// Actions
import { openPostDetail } from '../../../redux/modules/feed/post/PostActions'
import {
    openMultiUserInviteModal,
    searchFriend,
} from '../../../redux/modules/search/SearchActions'
import { loadFriends } from '../../../actions'
import {
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
    makeGetMyTribeFeedSelector,
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
import DelayedButton from '../../Common/Button/DelayedButton'

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
            infoCardHeight: new Animated.Value(INFO_CARD_HEIGHT),
            infoCardOpacity: new Animated.Value(1),
            showAboutModal: false,
            showNameInTitle: false,
        }
        this.switchCaseButton = this.switchCaseButton.bind(this)
    }

    componentWillUnmount() {
        // Cleanup tribe page in reducer and any other left over state
        this.props.tribeDetailClose(this.props.tribeId, this.props.pageId)
    }

    componentDidMount() {
        // Refresh my detail without showing indicator
        this.props.refreshMyTribeDetail(
            this.props.tribeId,
            this.props.pageId,
            null,
            false
        )
    }

    openUserInviteModal = (item) => {
        const { name, _id } = item
        this.props.openMultiUserInviteModal({
            searchFor: this.props.searchFriend,
            onSubmitSelection: (users, inviteToEntity, actionToExecute) => {
                const callback = () => {
                    this.props.refreshMyTribeDetail(
                        this.props.tribeId,
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
            tags: {
                member: item.members
                    .filter((doc) => doc.category === 'Member')
                    .map((i) => i.memberRef._id),
                requested: item.members
                    .filter((doc) => doc.category === 'JoinRequester')
                    .map((i) => i.memberRef._id),
                invited: item.members
                    .filter((doc) => doc.category === 'Invitee')
                    .map((i) => i.memberRef._id),
                admin: item.members
                    .filter((doc) => doc.category === 'Admin')
                    .map((i) => i.memberRef._id),
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
        if (buttonProps.disabled) return null

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
            userTribeStatus,
        } = this.props
        const { name, picture, memberCount, description } = item
        const newDate = item.created ? new Date(item.created) : new Date()
        const date = `${
            months[newDate.getMonth()]
        } ${newDate.getDate()}, ${newDate.getFullYear()}`
        const count = memberCount || '0'
        const isMemberOrAdmin =
            userTribeStatus === 'Admin' || userTribeStatus === 'Member'

        const bodyCard =
            data.length === 0 ? (
                isMemberOrAdmin ? (
                    !feedLoading &&
                    !feedRefreshing && (
                        <EmptyResult
                            text={'No Posts'}
                            textStyle={{ paddingTop: 80, paddingBottom: 80 }}
                        />
                    )
                ) : (
                    <View
                        style={{
                            padding: 16,
                            paddingBottom: 32,
                            backgroundColor: 'white',
                            marginTop: 8,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingBottom: 16,
                            }}
                        >
                            <Image
                                source={flagIcon}
                                style={[
                                    DEFAULT_STYLE.smallIcon_1,
                                    { marginRight: 10 },
                                ]}
                            />
                            <Text style={DEFAULT_STYLE.titleText_1}>About</Text>
                        </View>
                        <Text style={DEFAULT_STYLE.normalText_1}>
                            {description}
                        </Text>
                    </View>
                )
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
                        {isMemberOrAdmin && (
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
                        )}
                        {this.renderUserStatusButton()}
                    </View>
                </View>
                {isMemberOrAdmin && (
                    <MyTribeBanner
                        tribe={item}
                        tribeId={tribeId}
                        pageId={pageId}
                    />
                )}
                {bodyCard}
            </View>
        )
    }

    renderItem = (props) => {
        return (
            <ProfilePostCard
                item={props.item}
                isTribeDetailPost={true}
                key={props.index}
                hasActionButton
            />
        )
    }

    renderAddPostButton(item) {
        const { userTribeStatus } = this.props
        if (userTribeStatus === 'Admin' || userTribeStatus === 'Member') {
            return (
                <DelayedButton
                    activeOpacity={0.6}
                    style={styles.iconContainerStyle}
                    onPress={() => {
                        const postCallback = () => {
                            this.props.refreshMyTribeDetail(
                                this.props.tribeId,
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
                >
                    <Image style={styles.iconStyle} source={plus} />
                </DelayedButton>
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
                    refreshing={this.props.feedRefreshing}
                    onRefresh={() =>
                        this.props.refreshMyTribeDetail(
                            this.props.tribeId,
                            this.props.pageId
                        )
                    }
                    onEndReached={() =>
                        this.props.loadMoreTribeFeed(
                            this.props.tribeId,
                            this.props.pageId
                        )
                    }
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
                    scrollEventThrottle={16}
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
    tribeSizeTextStyle: DEFAULT_STYLE.smallText_1,
    backdrop: {
        backgroundColor: 'white',
        opacity: 0.5,
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
        backgroundColor: GM_BLUE,
    },
    iconStyle: {
        height: 26,
        width: 26,
        tintColor: 'white',
    },
}

const makeMapStateToProps = () => {
    const myTribeFeedSelector = makeGetMyTribeFeedSelector()
    const mapStateToProps = (state, props) => {
        const { tribeId, pageId } = props
        const { tribe, tribePage } = getMyTribeDetailById(
            state,
            tribeId,
            pageId
        )
        const {
            hasRequested,
            tribeLoading,
            feedLoading,
            feedRefreshing,
        } = tribePage
        const { userId } = state.user
        const memberData = myTribeMemberSelector(state, tribeId, pageId)
        const data = myTribeFeedSelector(state, tribeId, pageId)

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

    return mapStateToProps
}

export default connect(makeMapStateToProps, {
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
    openPostDetail,
    // Multi friend invite
    searchFriend,
    openMultiUserInviteModal,
    inviteMultipleUsersToTribe,
    loadFriends,
    loadMoreTribeFeed,
})(wrapAnalytics(MyTribe, SCREENS.TRIBE_DETAIL))
