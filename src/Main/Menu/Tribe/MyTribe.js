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
import Tooltip from 'react-native-walkthrough-tooltip'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

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
import BottomButtonsSheet from '../../Common/Modal/BottomButtonsSheet'
// Actions
import { openPostDetail } from '../../../redux/modules/feed/post/PostActions'
import {
    openMultiUserInviteModal,
    searchFriend,
} from '../../../redux/modules/search/SearchActions'
import { getButtonBottomSheetHeight } from '../../../styles'
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
import { default_style, color } from '../../../styles/basic'
// Constants
import { IMAGE_BASE_URL } from '../../../Utils/Constants'
import {
    actionSheet,
    switchByButtonIndex,
} from '../../Common/ActionSheetFactory'
// Components
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import EmptyResult from '../../Common/Text/EmptyResult'
import PostPreviewCard from '../../Post/PostPreviewCard/PostPreviewCard'
import About from './MyTribeAbout'
import { SCREENS, wrapAnalytics } from '../../../monitoring/segment'

import MyTribeBanner from './MyTribeBanner'
import DelayedButton from '../../Common/Button/DelayedButton'
import CreatePostModal from '../../Post/CreatePostModal'
import CREATE_POST from '../../../asset/icons/group.png'
import CREATE_GOAL from '../../../asset/icons/create_group.png'
import SHARE_GOAL from '../../../asset/icons/share_goal.png'

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

const TAG_SEARCH_OPTIONS = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['name'],
}

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
            tooltipVisible: false,
        }
        this.switchCaseButton = this.switchCaseButton.bind(this)
        this.ADD_BUTTON = [
            {
                name: 'Create a Post',
                icon: CREATE_POST,
                onPress: () => {
                    this.setState({ tooltipVisible: false }),
                        setTimeout(() => {
                            this.createPostModal && this.createPostModal.open()
                        }, 500)
                },

                showBorder: true,
            },
            // {
            //     name: 'Share a New Goal in Tribe',
            //     icon: CREATE_GOAL,
            //     onPress: () => {
            //         this.setState({ tooltipVisible: false })

            //         Actions.push('createGoalModal', {
            //             pageId: this.props.pageId,
            //         })
            //     },
            //     showBorder: true,
            // },
            {
                name: 'Share an Existing Goal ',
                icon: SHARE_GOAL,
                onPress: () => {
                    this.setState({ tooltipVisible: false }),
                        setTimeout(() => {
                            Actions.push('myTribeGoalShareView', {
                                tribe: this.props.item,
                                tribeId: this.props.tribeId,
                                pageId: this.props.pageId,
                            })
                        }, 500)
                },

                showBorder: true,
            },
            {
                name: 'Invite Friends',
                icon: CREATE_GOAL,
                onPress: () => {
                    this.setState({ tooltipVisible: false }),
                        setTimeout(() => {
                            Actions.push('myTribeGoalInviteFriends', {
                                tribe: this.props.item,
                                tribeId: this.props.tribeId,
                                pageId: this.props.pageId,
                            })
                        }, 500)
                },

                showBorder: false,
            },
        ]
    }

    componentWillUnmount() {
        // Cleanup tribe page in reducer and any other left over state
        this.props.tribeDetailClose(this.props.tribeId, this.props.pageId)
    }

    componentDidMount() {
        const { pageId, tribeId, initialRoute, item } = this.props
        // Refresh my detail without showing indicator
        this.props.refreshMyTribeDetail(
            this.props.tribeId,
            this.props.pageId,
            null,
            false
        )

        if (initialRoute && initialRoute === 'request') {
            // Entry point through notification for join request.
            setTimeout(() => {
                Actions.push('myTribeMembers', {
                    itemId: item ? item._id : tribeId,
                    pageId,
                    tribeId,
                    initialRoute, // initialRoute === 'request'
                })
            }, 200)
        }
    }

    openOptionModal = () => this.bottomSheetRef.open()
    closeOptionModal = () => this.bottomSheetRef.close()

    openTribeRespondSheet = () => this.tribeRespondBottomSheetRef.open()
    closeTribeRespondSheet = () => this.tribeRespondBottomSheetRef.close()

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
                    setTimeout(() => {
                        this.props.refreshMyTribeDetail(
                            this.props.tribeId,
                            this.props.pageId
                            // null,
                            // false
                        )
                    }, 1800)
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

    makeTribeOptions = (item) => {
        const { _id } = item
        const { userTribeStatus } = this.props
        const isAdmin = userTribeStatus === 'Admin'
        const isMember = userTribeStatus === 'Member'

        const reportOption = {
            text: 'Report',
            textStyle: { color: 'black' },
            icon: { name: 'account-alert', pack: 'material-community' },
            onPress: () => {
                this.closeOptionModal()
                // Wait for bottom sheet to close
                // before showing unfriend alert confirmation
                setTimeout(() => {
                    this.props.reportTribe(_id)
                }, 500)
            },
        }

        const editOption = {
            text: 'Edit',
            textStyle: { color: 'black' },
            icon: { name: 'account-edit', pack: 'material-community' },
            onPress: () => {
                this.closeOptionModal()
                // Wait for bottom sheet to close
                // before showing unfriend alert confirmation
                setTimeout(() => {
                    this.props.editTribe(item)
                }, 500)
            },
        }

        const deleteOption = {
            text: 'Delete',
            textStyle: { color: 'black' },
            icon: { name: 'account-remove', pack: 'material-community' },
            onPress: () => {
                this.closeOptionModal()
                // Wait for bottom sheet to close
                // before showing unfriend alert confirmation
                setTimeout(() => {
                    this.props.deleteTribe(_id)
                }, 500)
            },
        }

        const leaveOption = {
            text: 'Leave Tribe',
            textStyle: { color: 'black' },
            icon: { name: 'account-off', pack: 'material-community' },
            onPress: () => {
                this.closeOptionModal()
                // Wait for bottom sheet to close
                // before showing unfriend alert confirmation
                setTimeout(() => {
                    this.props.leaveTribe(_id, 'mytribe')
                }, 500)
            },
        }

        if (isAdmin) {
            return [editOption, deleteOption]
        }
        if (isMember) {
            return [leaveOption, reportOption]
        }

        return [reportOption]
    }

    renderBottomSheet = (item) => {
        const options = this.makeTribeOptions(item)
        // Options height + bottom space + bottom sheet handler height
        const sheetHeight = getButtonBottomSheetHeight(options.length)
        return (
            <BottomButtonsSheet
                ref={(r) => (this.bottomSheetRef = r)}
                buttons={options}
                height={sheetHeight}
            />
        )
    }

    openTribeStatusnModal = () => this.tribeRequestBottomSheetRef.open()
    closeTribeStatusnModal = () => this.tribeRequestBottomSheetRef.close()

    renderStatusBottomSheet = (item) => {
        const options = this.makeStatusBottomOptions(item)
        // Options height + bottom space + bottom sheet handler height
        const sheetHeight = getButtonBottomSheetHeight(options.length)
        return (
            <BottomButtonsSheet
                ref={(r) => (this.tribeRequestBottomSheetRef = r)}
                buttons={options}
                height={sheetHeight}
            />
        )
    }

    makeStatusBottomOptions = (item) => {
        const { _id } = item
        return [
            {
                text: 'Accept',
                textStyle: { color: 'black' },
                onPress: () => {
                    // close bottom sheet
                    this.closeTribeStatusnModal()
                    setTimeout(() => {
                        this.props.acceptTribeInvit(_id)
                    }, 500)
                },
            },
            {
                text: 'Decline',
                textStyle: { color: 'black' },
                onPress: () => {
                    // close bottom sheet
                    this.closeTribeStatusnModal()
                    setTimeout(() => {
                        this.props.declineTribeInvit(_id)
                    }, 500)
                },
            },
        ]
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
                        this.props.pageId,
                        null
                    ),
            },
            Invitee: {
                text: 'Respond',
                onPress: () =>
                    Platform.OS == 'ios'
                        ? this.handleRespondToInvitation(item)
                        : this.openTribeStatusnModal(),
            },
        })({
            text: 'Join Tribe',
            onPress: () => {
                this.props.requestJoinTribe(
                    item._id,
                    true,
                    this.props.pageId,
                    this.props.item.isAutoAcceptEnabled
                )
            },
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

        const bodyCard = isMemberOrAdmin ? (
            data.length === 0 ? (
                !feedLoading &&
                !feedRefreshing && (
                    <EmptyResult
                        text={'No Posts'}
                        textStyle={{ paddingTop: 80, paddingBottom: 80 }}
                    />
                )
            ) : null
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
                        style={[default_style.smallIcon_1, { marginRight: 10 }]}
                    />
                    <Text style={default_style.titleText_1}>About</Text>
                </View>
                <Text style={default_style.normalText_1}>{description}</Text>
            </View>
        )

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
                            <Text style={default_style.titleText_1}>
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
        let tribeDetailPostData = {
            userTribeStatus: this.props.userTribeStatus,
        }
        if (this.props.userTribeStatus == undefined) {
            return
        }

        return (
            <PostPreviewCard
                item={props.item}
                tribeDetailPostData={tribeDetailPostData}
                key={props.index}
                hasActionButton
            />
        )
    }

    renderIOSAddPostButtons(item) {
        const { userTribeStatus } = this.props
        if (userTribeStatus === 'Admin' || userTribeStatus === 'Member') {
            return (
                <Tooltip
                    animated={true}
                    // arrowSize={{ width: 16, height: 8 }}
                    backgroundColor="rgba(0,0,0,0.5)"
                    isVisible={this.state.tooltipVisible}
                    contentStyle={{
                        backgroundColor: '#42C0F5',
                        width: wp('60%'),
                        marginTop: -80,
                        marginHorizontal: 30,
                    }}
                    arrowStyle={{ marginTop: -80, marginHorizontal: 140 }}
                    placement="top"
                    content={
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'column',
                                padding: 5,
                            }}
                        >
                            {this.ADD_BUTTON.map((button, i) => {
                                return (
                                    <>
                                        {button.name !== 'Invite Friends' ? (
                                            <TouchableOpacity
                                                onPress={button.onPress}
                                            >
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        padding: 5,
                                                    }}
                                                    key={button.name + i}
                                                >
                                                    <Image
                                                        source={button.icon}
                                                        style={{
                                                            height: 17,
                                                            width: 17,
                                                            resizeMode:
                                                                'contain',
                                                        }}
                                                    />
                                                    <Text
                                                        style={{
                                                            color: 'white',
                                                            fontSize: 16,
                                                            marginHorizontal: 10,
                                                            fontFamily:
                                                                'SFProDisplay-Semibold',
                                                        }}
                                                    >
                                                        {button.name}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        ) : this.props.item
                                              .isMemberInviteEnabled ? (
                                            <TouchableOpacity
                                                onPress={button.onPress}
                                            >
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        padding: 5,
                                                    }}
                                                >
                                                    <Image
                                                        source={button.icon}
                                                        style={{
                                                            height: 17,
                                                            width: 17,
                                                            resizeMode:
                                                                'contain',
                                                        }}
                                                    />
                                                    <Text
                                                        style={{
                                                            color: 'white',
                                                            fontSize: 16,
                                                            marginHorizontal: 10,
                                                            fontFamily:
                                                                'SFProDisplay-Semibold',
                                                        }}
                                                    >
                                                        {button.name}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        ) : (
                                            <></>
                                        )}

                                        {button.showBorder ? (
                                            <View
                                                style={{
                                                    backgroundColor: 'white',
                                                    height: 1,
                                                    marginTop: 4,
                                                    width: '100%',
                                                }}
                                            />
                                        ) : null}
                                    </>
                                )
                            })}
                        </View>
                    }
                    onClose={() => this.setState({ tooltipVisible: false })}
                >
                    <DelayedButton
                        activeOpacity={0.6}
                        style={styles.iconContainerStyle}
                        onPress={() => this.setState({ tooltipVisible: true })}
                    >
                        <Image style={styles.iconStyle} source={plus} />
                    </DelayedButton>
                </Tooltip>
            )
        }
        return null
    }

    renderAndroidAddPostButton(item) {
        const { userTribeStatus } = this.props
        if (userTribeStatus === 'Admin' || userTribeStatus === 'Member') {
            return (
                <>
                    <Tooltip
                        animated={true}
                        backgroundColor="rgba(0,0,0,0.5)"
                        isVisible={this.state.tooltipVisible}
                        contentStyle={{
                            backgroundColor: '#42C0F5',
                            width: wp('60%'),
                        }}
                        tooltipStyle={{
                            marginVertical: -100,
                            marginHorizontal: 40,
                        }}
                        placement="bottom"
                        content={
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    padding: 5,
                                }}
                            >
                                {this.ADD_BUTTON.map((button, i) => {
                                    return (
                                        <>
                                            {button.name !==
                                            'Invite Friends' ? (
                                                <TouchableOpacity
                                                    onPress={button.onPress}
                                                >
                                                    <View
                                                        style={{
                                                            flexDirection:
                                                                'row',
                                                            padding: 5,
                                                            alignItems:
                                                                'center',
                                                        }}
                                                        key={button.name + i}
                                                    >
                                                        <Image
                                                            source={button.icon}
                                                            style={{
                                                                height: 17,
                                                                width: 17,
                                                                resizeMode:
                                                                    'contain',
                                                            }}
                                                        />
                                                        <Text
                                                            style={{
                                                                color: 'white',
                                                                fontSize: 16,
                                                                marginHorizontal: 10,
                                                                fontFamily:
                                                                    'SFProDisplay-Semibold',
                                                            }}
                                                        >
                                                            {button.name}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            ) : this.props.item
                                                  .isMemberInviteEnabled ? (
                                                <TouchableOpacity
                                                    onPress={button.onPress}
                                                >
                                                    <View
                                                        style={{
                                                            flexDirection:
                                                                'row',
                                                            padding: 5,
                                                        }}
                                                    >
                                                        <Image
                                                            source={button.icon}
                                                            style={{
                                                                height: 17,
                                                                width: 17,
                                                                resizeMode:
                                                                    'contain',
                                                            }}
                                                        />
                                                        <Text
                                                            style={{
                                                                color: 'white',
                                                                fontSize: 16,
                                                                marginHorizontal: 10,
                                                                fontFamily:
                                                                    'SFProDisplay-Semibold',
                                                            }}
                                                        >
                                                            {button.name}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            ) : (
                                                <></>
                                            )}

                                            {button.showBorder ? (
                                                <View
                                                    style={{
                                                        backgroundColor:
                                                            'white',
                                                        height: 1,
                                                        marginTop: 4,
                                                        width: '100%',
                                                    }}
                                                />
                                            ) : null}
                                        </>
                                    )
                                })}
                            </View>
                        }
                        onClose={() => this.setState({ tooltipVisible: false })}
                    />
                    {/* )} */}

                    <DelayedButton
                        activeOpacity={0.6}
                        style={styles.iconContainerStyle}
                        onPress={() => this.setState({ tooltipVisible: true })}
                    >
                        <Image style={styles.iconStyle} source={plus} />
                    </DelayedButton>
                </>
            )
        }
    }

    renderCreatePostModal(item) {
        const postCallback = () => {
            this.props.refreshMyTribeDetail(
                this.props.tribeId,
                this.props.pageId
            )
        }
        const members = item
            ? item.members
                  .filter(
                      (m) =>
                          m &&
                          (m.category === 'Admin' || m.category === 'Member')
                  )
                  .map((m) => m.memberRef)
            : []
        const fuse = new Fuse(members, TAG_SEARCH_OPTIONS)
        const tagSearch = (keyword, callback) => {
            const result = fuse.search(keyword.replace('@', ''))
            callback({ data: result }, keyword)
        }

        return (
            <CreatePostModal
                onRef={(r) => (this.createPostModal = r)}
                belongsToTribe={item._id}
                callback={postCallback}
                tagSearch={tagSearch}
            />
        )
    }

    render() {
        const { item, data } = this.props
        if (!item) return <View />
        // console.log("tribe props",this.props);
        return (
            <MenuProvider
                style={{ backgroundColor: color.GM_BACKGROUND }}
                customStyles={{ backdrop: styles.backdrop }}
                skipInstanceCheck={true}
            >
                {this.renderCreatePostModal(item)}
                <SearchBarHeader
                    backButton
                    title={this.state.showNameInTitle ? decode(item.name) : ''}
                    onBackPress={() => Actions.pop()} // componentWillUnmount takes care of the state cleaning
                    pageSetting
                    handlePageSetting={() => this.openOptionModal()}
                />
                {this.renderBottomSheet(item)}
                {this.renderStatusBottomSheet(item)}
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
                            // null,
                            // false
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
                {Platform.OS === 'ios'
                    ? this.renderIOSAddPostButton(item)
                    : this.renderAndroidAddPostButton(item)}

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
    tribeSizeTextStyle: default_style.smallText_1,
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
        backgroundColor: color.GM_BLUE,
        borderRadius: 3,
    },
    buttonText: {
        ...default_style.buttonText_1,
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
        zIndex: 3000,
        backgroundColor: color.GM_BLUE,
    },
    iconButtonStyle: {
        height: 54,
        width: 54,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3,
        backgroundColor: color.GM_BLUE,
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
