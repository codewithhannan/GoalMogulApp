/** @format */

import React, { Component } from 'react'
import {
    Alert,
    View,
    Image,
    Text,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
} from 'react-native'
import { connect } from 'react-redux'
import { Icon } from '@ui-kitten/components'
import R from 'ramda'
import BottomButtonsSheet from '../../Common/Modal/BottomButtonsSheet'

import Icons from '../../../asset/base64/Icons'
import { default_style, color } from '../../../styles/basic'
import { PROFILE_STYLES } from '../../../styles/Profile'
import { createReport } from '../../../redux/modules/report/ReportActions'
// import * as ImagePicker from 'expo-image-picker'
import ImagePicker from 'react-native-image-crop-picker'

import { Entypo } from '@expo/vector-icons'

/* Actions */
import {
    openProfileDetailEditForm,
    updateFriendship,
    UserBanner,
    blockUser,
    createOrGetDirectMessage,
    openCameraRoll,
    submitUpdatingProfile,
    updateProfilePic,
    handleTabRefresh,
} from '../../../actions/'

// Selector
import { getUserData } from '../../../redux/modules/User/Selector'

/* Components */
import ProfileActionButton from '../../Common/Button/ProfileActionButton'
import DelayedButton from '../../Common/Button/DelayedButton'
import {
    actionSheet,
    switchByButtonIndex,
} from '../../Common/ActionSheetFactory'

import { IMAGE_BASE_URL } from '../../../Utils/Constants'

import { Actions } from 'react-native-router-flux'

import RichText from '../../Common/Text/RichText'
import _ from 'lodash'
import { getButtonBottomSheetHeight } from '../../../styles'
import ProfileImage from '../../Common/ProfileImage'
import { getProfileImageOrDefaultFromUser } from '../../../redux/middleware/utils'
import { EVENT as E, track } from '../../../monitoring/segment'
import FOLLOW from '../../../asset/icons/follow.png'

const { width } = Dimensions.get('window')
const DEBUG_KEY = '[ Copmonent ProfileDetailCard ]'

// TODO: use redux instead of passed in props

class ProfileDetailCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imageUrl: '',
            imageSource: '',
            name: '',
        }

        this.handleEditOnPressed = this.handleEditOnPressed.bind(this)
    }

    async componentDidMount() {
        const { image } = this.props.user.profile
        // console.log(`${DEBUG_KEY}: prefetch image: ${image}`);
        if (image) {
            this.prefetchImage(image)
        }

        // if (Platform.OS !== 'web') {
        //     const {
        //         status,
        //     } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        //     if (status !== 'granted') {
        //         alert(
        //             'Sorry, we need camera roll permissions to make this work!'
        //         )
        //     }
        // }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {
            self,
            user,
            friendship,
            userId,
            friendsCount,
            mutualFriends,
            needRespond,
        } = this.props

        const { imageUrl } = this.state

        return (
            !_.isEqual(self, nextProps.self) ||
            !_.isEqual(user, nextProps.user) ||
            !_.isEqual(friendship, nextProps.friendship) ||
            !_.isEqual(userId, nextProps.userId) ||
            !_.isEqual(friendsCount, nextProps.friendsCount) ||
            !_.isEqual(mutualFriends, nextProps.mutualFriends) ||
            !_.isEqual(needRespond, nextProps.needRespond) ||
            !_.isEqual(imageUrl, nextState.imageUrl)
        )
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        let prevImageUrl = ''
        if (
            prevProps.user &&
            prevProps.user.profile &&
            prevProps.user.profile.image
        ) {
            prevImageUrl = `${IMAGE_BASE_URL}${prevProps.user.profile.image}`
        }

        if (
            this.props.user &&
            this.props.user.profile &&
            this.props.user.profile.image
        ) {
            const { image } = this.props.user.profile
            const imageUrl = `${IMAGE_BASE_URL}${image}`
            if (imageUrl !== this.state.imageUrl || imageUrl !== prevImageUrl) {
                this.prefetchImage(image)
                // console.log(`prefetching image, imageUrl: ${imageUrl}, prevImageUrl: ${prevImageUrl}`);
            }
        }
    }

    openOptionModal = () => this.bottomSheetRef.open()
    closeOptionModal = () => this.bottomSheetRef.close()
    openCameraRollBottomSheet = () => this.CameraRefBottomSheetRef.open()
    closeNotificationBottomSheet = () => this.CameraRefBottomSheetRef.close()
    openFriendRequestOptionModal = () => this.friendRequestBottomSheetRef.open()
    closeFriendRequestOptionModal = () =>
        this.friendRequestBottomSheetRef.close()
    openFriendshipTypeModal = () => this.friendshipTypeBottomSheetRef.open()
    closeFriendshipTypeModal = () => this.friendshipTypeBottomSheetRef.close()

    onLayout = (e) => {
        if (this.props.onLayout) {
            this.props.onLayout(e)
        }
    }

    prefetchImage(image) {
        const fullImageUrl = `${IMAGE_BASE_URL}${image}`
        this.setState({
            imageUrl: fullImageUrl,
        })
        Image.prefetch(fullImageUrl)
    }

    handleEditOnPressed() {
        const { userId, pageId } = this.props
        this.props.openProfileDetailEditForm(userId, pageId)
        track(E.PROFILE_EDIT_PRESSED)
    }

    handleBannerInfoIconOnPress = () => {
        const { openEarnBageModal } = this.props
        if (openEarnBageModal) {
            openEarnBageModal()
        }
    }

    handleRefresh = () => {
        const { userId, pageId, selectedTab } = this.props
        if (selectedTab === 'about') return
        console.log(`${DEBUG_KEY}: refreshing tab`, selectedTab)
        this.props.handleTabRefresh(selectedTab, userId, pageId)
    }

    makeFriendshipStatusOptions = () => {
        return [
            {
                text: 'Accept Friend Request',
                textStyle: { color: 'black' },
                onPress: () => {
                    this.props.updateFriendship(
                        this.props.userId,
                        this.props.friendship._id,
                        'acceptFriend',
                        'requests.incoming',
                        undefined
                    )
                    setTimeout(() => this.handleRefresh(), 1500)
                    // close bottom sheet
                    this.closeFriendRequestOptionModal()
                },
            },
            {
                text: 'Dismiss',
                textStyle: { color: 'black' },
                onPress: () => {
                    this.props.updateFriendship(
                        this.props.userId,
                        this.props.friendship._id,
                        'deleteFriend',
                        'requests.incoming',
                        undefined
                    )
                    // close bottom sheet
                    this.closeFriendRequestOptionModal()
                },
            },
            {
                text: 'Cancel',
                textStyle: { color: 'black' },
                onPress: () => {
                    // close bottom sheet
                    this.closeFriendRequestOptionModal()
                },
            },
        ]
    }

    makeFriendshipTypeOptions = () => {
        return [
            {
                text: 'Friend',
                textStyle: { color: 'black' },
                onPress: () => {
                    // close bottom sheet
                    this.closeFriendshipTypeModal()
                    setTimeout(() => {
                        this.handleButtonOnPress('addAsFriend')
                    }, 500)
                },
            },
            {
                text: 'Close Friend',
                textStyle: { color: 'black' },
                onPress: () => {
                    // close bottom sheet
                    this.closeFriendshipTypeModal()
                    setTimeout(() => {
                        this.handleButtonOnPress('addAsCloseFriend')
                    }, 500)
                },
            },
        ]
    }

    renderFriendshipStatusBottomSheet = () => {
        const options = this.makeFriendshipStatusOptions()
        // Options height + bottom space + bottom sheet handler height
        const sheetHeight = getButtonBottomSheetHeight(options.length)
        return (
            <BottomButtonsSheet
                ref={(r) => (this.friendRequestBottomSheetRef = r)}
                buttons={options}
                height={sheetHeight}
            />
        )
    }

    renderFriendshipTypeBottomSheet = () => {
        const options = this.makeFriendshipTypeOptions()
        // Options height + bottom space + bottom sheet handler height
        const sheetHeight = getButtonBottomSheetHeight(options.length)
        return (
            <BottomButtonsSheet
                ref={(r) => (this.friendshipTypeBottomSheetRef = r)}
                buttons={options}
                height={sheetHeight}
            />
        )
    }

    // type: ['unfriend', 'deleteFriend', 'requestFriend']
    handleButtonOnPress = (type) => {
        if (type === 'requestFriend') {
            this.props.updateFriendship(
                this.props.userId,
                '',
                'requestFriend',
                'requests.outgoing',
                undefined
            )
            return
        }

        if (type === 'addAsCloseFriend') {
            // console.log('\n action is dispatched for addAsCloseFriend')
            // console.log(
            //     `\n parameters passed to update friendship userID:${this.props.userId} friendshipID:${this.props.friendship._id}`
            // )
            this.props.updateFriendship(
                this.props.userId,
                this.props.friendship._id,
                'addAsCloseFriend',
                'requests.outgoing',
                undefined
            )
            Alert.alert('Added as close friend', '')
            return
        }

        if (type === 'addAsFriend') {
            this.props.updateFriendship(
                this.props.userId,
                this.props.friendship._id,
                'addAsFriend',
                'requests.outgoing',
                undefined
            )
            Alert.alert('Removed from close friends', '')
            return
        }

        if (type === 'deleteFriend') {
            Alert.alert(
                'Are you sure you want to withdraw friend request?',
                '',
                [
                    {
                        text: 'Confirm',
                        onPress: () => {
                            console.log(
                                `${DEBUG_KEY} User withdraw request _id: `,
                                this.props.friendship._id
                            )
                            this.props.updateFriendship(
                                this.props.userId,
                                this.props.friendship._id,
                                'deleteFriend',
                                'requests.outgoing',
                                undefined
                            )
                        },
                    },
                    {
                        text: 'Cancel',
                    },
                ]
            )
        }

        if (type === 'unfriend') {
            Alert.alert('Are you sure you want to unfriend?', '', [
                {
                    text: 'Confirm',
                    onPress: () => {
                        console.log(
                            `${DEBUG_KEY} User unfriend _id: `,
                            this.props.friendship._id
                        )
                        this.props.updateFriendship(
                            this.props.userId,
                            this.props.friendship._id,
                            'deleteFriend',
                            'friends',
                            undefined
                        )
                    },
                },
                {
                    text: 'Cancel',
                },
            ])
        }

        if (type === 'respond') {
            this.openFriendRequestOptionModal()
        }
    }

    renderFriendshipStatusButton() {
        if (this.props.self) return null
        const containerStyle = styles.buttonContainerStyle
        const textStyle = { ...default_style.buttonText_1, color: 'white' }
        const iconStyle = {
            ...default_style.normalIcon_1,
            tintColor: 'white',
            marginRight: 8,
        }

        const ADD_FRIEND = 'Add Friend'
        const ADD_CLOSE_FRIEND = 'Add Close Friend'
        const REQUEST_PENDING = 'Cancel Request'
        const MESSAGE = 'Message'
        const RESPOND = 'Respond'

        if (this.props.needRespond) {
            return (
                <View style={{ marginRight: 10 }}>
                    <ProfileActionButton
                        iconName="account-plus"
                        text={RESPOND}
                        onPress={this.handleButtonOnPress.bind(this, 'respond')}
                        iconStyle={iconStyle}
                        containerStyle={containerStyle}
                        textStyle={textStyle}
                    />
                </View>
            )
        }

        const status = this.props.friendship.status
        switch (status) {
            case undefined:
                return (
                    <View style={{ marginRight: 10 }}>
                        <ProfileActionButton
                            text={ADD_FRIEND}
                            iconName="account-plus"
                            onPress={this.handleButtonOnPress.bind(
                                this,
                                'requestFriend'
                            )}
                            iconStyle={iconStyle}
                            textStyle={textStyle}
                            containerStyle={{
                                ...containerStyle,
                            }}
                        />
                    </View>
                )

            case 'Accepted':
                return (
                    <View style={{ marginRight: 10 }}>
                        <ProfileActionButton
                            text={MESSAGE}
                            iconName="chat-processing"
                            onPress={() => this.handleMessageButtonOnPress()}
                            iconStyle={iconStyle}
                            textStyle={textStyle}
                            containerStyle={{
                                ...containerStyle,
                            }}
                        />
                    </View>
                )

            case 'Invited':
                return (
                    <View style={{ marginRight: 5 }}>
                        <ProfileActionButton
                            text={REQUEST_PENDING}
                            iconName="close-circle"
                            onPress={this.handleButtonOnPress.bind(
                                this,
                                'deleteFriend'
                            )}
                            containerStyle={{
                                ...containerStyle,
                                backgroundColor: color.GM_BLUE_LIGHT,
                            }}
                            textStyle={textStyle}
                            iconStyle={iconStyle}
                        />
                    </View>
                )

            default:
                return null
        }
    }

    renderMoreProfileActionButton() {
        if (this.props.self) {
            return (
                <DelayedButton
                    onPress={() => this.handleEditOnPressed()}
                    style={{
                        ...styles.editButtonContainerStyle,
                    }}
                >
                    <Icon
                        name="border-color"
                        pack="material-community"
                        style={{
                            ...default_style.buttonIcon_1,
                            tintColor: 'white',
                            paddingTop: 2,
                        }}
                        zIndex={1}
                    />
                </DelayedButton>
            )
        }

        return (
            <DelayedButton
                onPress={() => this.openOptionModal()}
                style={{
                    ...styles.buttonContainerStyle,
                    backgroundColor: '#F2F2F2',
                    paddingHorizontal: 8,
                }}
            >
                <Icon
                    name="dots-horizontal"
                    pack="material-community"
                    style={{
                        ...default_style.normalIcon_1,
                        tintColor: color.TEXT_COLOR.DARK,
                    }}
                    zIndex={1}
                />
            </DelayedButton>
        )
    }

    // Open direct message with this person
    handleMessageButtonOnPress = () => {
        this.props.createOrGetDirectMessage(
            this.props.userId,
            (err, chatRoom) => {
                // TODO: @Jia re-enable the 'Message' button
                if (err || !chatRoom) {
                    return Alert.alert(
                        'Error',
                        'Could not start the conversation. Please try again later.'
                    )
                }
                Actions.push('chatRoomConversation', {
                    chatRoomId: chatRoom._id,
                })
            }
        )
    }

    renderProfileImage() {
        const { user } = this.props
        return (
            <TouchableOpacity
                onPress={() => this.props.profilePictureVisible()}
                style={styles.imageContainerStyle}
            >
                <View>
                    <ProfileImage
                        imageStyle={{
                            width: default_style.uiScale * 120,
                            height: default_style.uiScale * 120,
                        }}
                        imageUrl={getProfileImageOrDefaultFromUser(user)}
                    />
                </View>
            </TouchableOpacity>
        )
    }

    pickImage = async () => {
        let res
        try {
            ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
                includeExif: true,
            }).then((image) => {
                res = image
                this.props.updateProfilePic(image.path, this.props.pageId)
            })
            // res = await ImagePicker.launchImageLibraryAsync({
            //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
            //     allowsEditing: true,
            //     aspect: [1, 1],
            //     quality: 1,
            // })
        } catch (err) {
            console.log(
                '\nError while selecting image from device: ',
                err.message
            )
        }
        if (!res === undefined) {
            this.setState({ imageUrl: res.path })
        }
    }

    handleOptionsOnPress() {
        const options = switchByButtonIndex([
            [
                R.equals(0),
                () => {
                    console.log(
                        `${DEBUG_KEY} User chooses to change profile pitrue`,
                        '',
                        this.pickImage()
                    )
                },
            ],
            [
                R.equals(1),
                () => {
                    console.log(
                        `${DEBUG_KEY} User chooses to show profile pitrue`,
                        '',
                        this.props.profilePictureVisible()
                    )
                },
            ],
        ])

        const requestOptions = [
            'Update Profile Picture',
            'Show Profile Picutre',
            'Cancel',
        ]

        const cancelIndex = 2

        const adminActionSheet = actionSheet(
            requestOptions,
            cancelIndex,
            options
        )
        adminActionSheet()
    }

    renderImageSource = () => {
        const { imageUrl } = this.state
        if (this.state.imageUrl === '') {
            return require('../../../asset/utils/defaultUserProfile.png')
        } else {
            return { uri: imageUrl }
        }
    }

    renderImage = () => {
        return (
            <View activeOpacity={0.6} style={styles.imageContainerStyle}>
                {this.props.uploading ? (
                    <View
                        style={{
                            width: 110,
                            height: 110,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 150 / 2,
                            overflow: 'hidden',
                        }}
                    >
                        <ActivityIndicator size="small" />
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={
                            Platform.OS == 'ios'
                                ? () => this.handleOptionsOnPress()
                                : this.openCameraRollBottomSheet
                        }
                    >
                        <Image
                            source={this.renderImageSource()}
                            style={{
                                width: 110,
                                height: 110,

                                borderRadius: 150 / 2,
                                overflow: 'hidden',
                            }}
                        />
                        <View style={styles.iconContainerStyle}>
                            <Entypo name="camera" size={11} color="#FFFF" />
                        </View>
                    </TouchableOpacity>
                )}

                {/* <TouchableOpacity
                    onPress={
                        // this.handleOptionsOnPress
                        Platform.OS == 'ios'
                            ? () => this.handleOptionsOnPress()
                            : this.openCameraRollBottomSheet
                    }
                > */}

                {/* </TouchableOpacity> */}
            </View>
        )
    }

    renderHeadline(headline) {
        if (headline && headline.trim() !== '') {
            return (
                <RichText
                    textStyle={[
                        styles.marginStyle,
                        default_style.subTitleText_1,
                    ]}
                    contentText={headline}
                    textContainerStyle={{ flexDirection: 'row' }}
                    numberOfLines={1}
                />
            )
        }
        return (
            <View style={{ marginBottom: 4 }}>
                {this.renderAddAction(
                    'Add a headline',
                    this.handleEditOnPressed
                )}
            </View>
        )
    }

    renderLocation(location) {
        if (location && location.trim() !== '') {
            return (
                <RichText
                    textStyle={[styles.marginStyle, default_style.normalText_1]}
                    contentText={location}
                    textContainerStyle={{ flexDirection: 'row' }}
                    numberOfLines={1}
                />
            )
        }
        return (
            <></>
            // <View>
            //     {this.renderAddAction(
            //         'Add a location',
            //         this.handleEditOnPressed
            //     )}
            // </View>
        )
    }

    renderAddAction(text, handleAddAction) {
        return (
            this.props.self && (
                <DelayedButton
                    activeOpacity={0.6}
                    onPress={() => handleAddAction()}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            borderColor: '#E0E0E0',
                            borderWidth: 1,
                            borderStyle: 'dashed',
                            borderRadius: 6,
                            padding: 4,
                            paddingBottom: 2,
                            paddingTop: 2,
                            alignItems: 'center',
                            width: 130,
                        }}
                    >
                        <Icon
                            name="plus"
                            pack="material-community"
                            style={{
                                ...default_style.buttonIcon_2,
                                tintColor: '#828282',
                                marginRight: 8,
                            }}
                            zIndex={1}
                        ></Icon>
                        <Text
                            style={{
                                ...default_style.normalText_1,
                                color: '#828282',
                                fontWeight: '600',
                            }}
                        >
                            {text}
                        </Text>
                    </View>
                </DelayedButton>
            )
        )
    }

    makeProfileCardOptions = () => {
        const unfriendOption = {
            text: 'Unfriend',
            textStyle: { color: 'black' },
            icon: { name: 'account-remove', pack: 'material-community' },
            onPress: () => {
                this.closeOptionModal()
                // Wait for bottom sheet to close
                // before showing unfriend alert confirmation
                setTimeout(() => {
                    this.handleButtonOnPress('unfriend')
                }, 500)
            },
        }

        const closeFriendOption = {
            text: 'Edit Friend Type',
            textStyle: { color: 'black' },
            icon: { name: 'account-heart', pack: 'material-community' },
            onPress: () => {
                this.closeOptionModal()
                setTimeout(() => {
                    this.openFriendshipTypeModal()
                }, 500)
            },
        }

        const shareToDirectMessageOption = {
            text: 'Share Profile as Direct Message',
            textStyle: { color: 'black' },
            icon: { name: 'account-arrow-right', pack: 'material-community' },
            onPress: () => {
                this.closeOptionModal()
                // share to Direct Chat
                // TODO: @Jay Share to direct message
                const userToShare = this.props.user
                const chatRoomType = 'Direct'
                Actions.push('shareToChatLightBox', {
                    userToShare,
                    chatRoomType,
                })
            },
        }

        const shareToGroupChatOption = {
            text: 'Share Profile to Group Chat',
            textStyle: { color: 'black' },
            icon: { name: 'account-arrow-right', pack: 'material-community' },
            onPress: () => {
                this.closeOptionModal()
                // TODO: @Jay Share to group conversation
                const userToShare = this.props.user
                const chatRoomType = 'Group'
                Actions.push('shareToChatLightBox', {
                    userToShare,
                    chatRoomType,
                })
            },
        }

        const blockOption = {
            text: 'Block',
            textStyle: { color: 'black' },
            image: Icons.AccountCancel,
            imageStyle: { tintColor: 'black' },
            // icon: { name: 'account-cancel', pack: 'material-community' },
            onPress: () => {
                this.closeOptionModal()
                setTimeout(() => {
                    console.log(
                        `${DEBUG_KEY} User blocks _id: `,
                        this.props.userId
                    )
                    this.props.blockUser(this.props.userId, () =>
                        alert(
                            `You have successfully blocked ${this.props.user.name}`
                        )
                    )
                }, 500)
            },
        }
        const followOption = {
            text: this.props.isFollowed ? 'Unfollow' : 'Follow',
            textStyle: { color: 'black' },
            image: FOLLOW,
            imageStyle: { tintColor: 'black' },
            // icon: { name: 'account-cancel', pack: 'material-community' },
            onPress: () => {
                this.closeOptionModal()
                setTimeout(() => {
                    if (this.props.isFollowed) {
                        return (
                            this.props.shouldUnfollowUser(this.props.userId),
                            setTimeout(() => {
                                this.handleRefresh()
                            }, 1000)
                        )
                    } else {
                        return (
                            this.props.shouldFollowUser(this.props.userId),
                            setTimeout(() => {
                                this.handleRefresh()
                            }, 1000)
                        )
                    }
                }, 500)
            },
        }

        const reportOption = {
            text: 'Report',
            textStyle: { color: 'black' },
            icon: { name: 'account-alert', pack: 'material-community' },
            onPress: () => {
                this.closeOptionModal()
                setTimeout(() => {
                    console.log(
                        `${DEBUG_KEY} User reports profile with _id: `,
                        this.props.userId
                    )
                    this.props.createReport(this.props.userId, 'User')
                }, 500)
            },
        }

        // friend case
        if (this.props.friendship.status == 'Accepted') {
            return [
                unfriendOption,
                closeFriendOption,
                shareToDirectMessageOption,
                shareToGroupChatOption,
                blockOption,
                reportOption,
            ]
        }

        return [
            shareToDirectMessageOption,
            shareToGroupChatOption,
            blockOption,
            reportOption,
        ]
    }

    renderBottomSheet = () => {
        const options = this.makeProfileCardOptions()
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
    makeCameraRefOptions = () => {
        return [
            {
                text: 'Update Profile Picture',
                onPress: () => {
                    this.closeNotificationBottomSheet(),
                        setTimeout(() => this.pickImage(), 500)
                },
            },
            {
                text: 'Show Profile Picture',
                onPress: () => {
                    this.closeNotificationBottomSheet(),
                        setTimeout(
                            () => this.props.profilePictureVisible(),
                            500
                        )
                },
            },
            {
                text: 'Cancel',
                onPress: () => this.closeNotificationBottomSheet(),
            },
        ]
    }

    renderCameraRollBottomSheet = () => {
        const options = this.makeCameraRefOptions()

        const sheetHeight = getButtonBottomSheetHeight(options.length)

        return (
            <BottomButtonsSheet
                ref={(r) => (this.CameraRefBottomSheetRef = r)}
                buttons={options}
                height={sheetHeight}
            />
        )
    }

    render() {
        const { user, self } = this.props
        if (!user) return null
        const { name, headline, profile } = user
        const { location } = profile

        return (
            <>
                <View onLayout={this.onLayout}>
                    <View
                        style={{
                            height: 90 * default_style.uiScale,
                            backgroundColor: color.GM_BLUE_LIGHT_LIGHT,
                        }}
                    />
                    <View style={styles.topWrapperStyle}>
                        <View
                            style={{
                                flexGrow: 1,
                                flexDirection: 'row',
                            }}
                        >
                            {self
                                ? this.renderImage()
                                : this.renderProfileImage(profile, self)}
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            {/* <View style={{ flex: 1 }} /> */}
                            {this.renderFriendshipStatusButton()}
                            {this.renderMoreProfileActionButton()}
                            {this.renderBottomSheet()}
                            {this.renderFriendshipStatusBottomSheet()}
                            {this.renderFriendshipTypeBottomSheet()}
                            {this.renderCameraRollBottomSheet()}
                        </View>
                    </View>
                    <View style={styles.containerStyle}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    ...PROFILE_STYLES.nameTitle,
                                    marginBottom: 8,
                                }}
                            >
                                {name}
                            </Text>
                            <UserBanner
                                user={this.props.user}
                                iconStyle={{
                                    ...styles.marginStyle,
                                    height: 20 * default_style.uiScale,
                                    width: 17 * default_style.uiScale,
                                }}
                            />
                            {this.props.self && (
                                <DelayedButton
                                    onPress={this.handleBannerInfoIconOnPress}
                                    activeOpacity={0.6}
                                >
                                    <Icon
                                        name="information"
                                        pack="material-community"
                                        style={{
                                            ...styles.marginStyle,
                                            height: 20 * default_style.uiScale,
                                            width: 20 * default_style.uiScale,
                                            tintColor: color.GM_BLUE,
                                        }}
                                        zIndex={1}
                                    />
                                </DelayedButton>
                            )}
                        </View>
                        {this.renderHeadline(headline)}
                        {this.renderLocation(location)}
                    </View>
                </View>
            </>
        )
    }
}

const styles = {
    containerStyle: {
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        // paddingTop: 10,
        paddingLeft: 16,
        paddingRight: 16,
    },
    topWrapperStyle: {
        backgroundColor: color.BACKGROUND_COLOR,
        paddingHorizontal: 16,
        marginTop: 16,
        marginBottom: 16,
        flexDirection: 'row',
        paddingBottom: 0,
    },
    imageContainerStyle: {
        flex: 1,
        alignItems: 'center',
        borderRadius: default_style.uiScale * 60,
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        backgroundColor: 'white',
    },
    iconContainerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#42C0F5',
        borderRadius: 50,
        borderWidth: 2,
        height: 24,
        width: 24,
        borderColor: '#FFFFFF',
        position: 'absolute',
        bottom: 10 * default_style.uiScale,
        left: width * 0.2,
    },

    imageStyle: {
        width: default_style.uiScale * 120,
        height: default_style.uiScale * 120,
        borderRadius: default_style.uiScale * 60,
    },
    buttonContainerStyle: {
        color: color.GM_CARD_BACKGROUND,
        backgroundColor: color.GM_BLUE,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    editButtonContainerStyle: {
        color: color.GM_CARD_BACKGROUND,
        backgroundColor: color.GM_BLUE,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 6,
        padding: 8,
    },
    marginStyle: {
        marginBottom: 5,
    },
    infoIconContainerStyle: {
        borderRadius: 100,
        borderWidth: 1,
        borderColor: color.TEXT_COLOR.DARK,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        marginLeft: 5,
    },
}

const mapStateToProps = (state, props) => {
    const { userId, pageId } = props

    const self = userId === state.user.userId

    const userObject = getUserData(state, userId, '')

    const { user, mutualFriends, friendship } = userObject
    const { profile } = user
    const { uploading } = state.profile

    const friendsCount = state.meet.friends.count
    const needRespond =
        friendship &&
        friendship.initiator_id &&
        friendship.initiator_id !== state.user.userId &&
        friendship.status === 'Invited'

    return {
        self,
        user,
        friendship,
        userObject,
        userId,
        friendsCount,
        mutualFriends,
        needRespond,
        profile,
        pageId,
        uploading,
    }
}

export default connect(mapStateToProps, {
    openProfileDetailEditForm,
    updateFriendship,
    createOrGetDirectMessage,
    createReport,
    blockUser,
    openCameraRoll,
    submitUpdatingProfile,
    updateProfilePic,
    handleTabRefresh,
})(ProfileDetailCard)
