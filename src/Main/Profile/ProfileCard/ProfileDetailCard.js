/** @format */

import React, { Component } from 'react'
import {
    Alert,
    View,
    Image,
    Text,
    Dimensions,
    TouchableHighlight,
    TouchableOpacity,
    ActionSheetIOS,
} from 'react-native'
import { connect } from 'react-redux'
import { Entypo } from '@expo/vector-icons'

import { Icon } from '@ui-kitten/components'
import { Actions } from 'react-native-router-flux'
import R from 'ramda'

import { Field, reduxForm } from 'redux-form'

import BottomButtonsSheet from '../../Common/Modal/BottomButtonsSheet'

import Icons from '../../../asset/base64/Icons'
import { default_style, color } from '../../../styles/basic'
import { PROFILE_STYLES } from '../../../styles/Profile'
import { createReport } from '../../../redux/modules/report/ReportActions'
import ImagePicker from '../../Common/ImagePicker'

/* Actions */
import {
    openProfileDetailEditForm,
    updateFriendship,
    UserBanner,
    blockUser,
    createOrGetDirectMessage,
    openCamera,
    openCameraRoll,
    submitUpdatingProfile,
} from '../../../actions/'

// Selector
import { getUserData } from '../../../redux/modules/User/Selector'

/* Components */
import ProfileActionButton from '../../Common/Button/ProfileActionButton'
import DelayedButton from '../../Common/Button/DelayedButton'

import { IMAGE_BASE_URL } from '../../../Utils/Constants'

import RichText from '../../Common/Text/RichText'
import _ from 'lodash'
import { getButtonBottomSheetHeight } from '../../../styles/'
import OnboardingStyles from '../../../styles/Onboarding'
import ProfileImage from '../../Common/ProfileImage'
import {
    getProfileImageOrDefault,
    getProfileImageOrDefaultFromUser,
} from '../../../redux/middleware/utils'
import {
    trackWithProperties,
    EVENT as E,
    wrapAnalytics,
    SCREENS,
} from '../../../monitoring/segment'

const BUTTONS = ['Take a Picture', 'Camera Roll', 'Cancel']
const TAKING_PICTURE_INDEX = 0
const CAMERA_ROLL_INDEX = 1
const CANCEL_INDEX = 2

const { InfoIcon } = Icons
const { width } = Dimensions.get('window')
const DEBUG_KEY = '[ Copmonent ProfileDetailCard ]'

// TODO: use redux instead of passed in props
class ProfileDetailCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imageUrl: '',
            profilepicture: true,
            imagepicker: false,
        }
        this.handleEditOnPressed = this.handleEditOnPressed.bind(this)
    }

    openCamera = () => {
        const trackOpenCamera = () =>
            trackWithProperties(E.REG_CAMERA, {
                UserId: this.props.userId,
            })

        const trackImageAttached = () =>
            trackWithProperties(E.REG_ADD_PHOTO_ATTACHED, {
                UserId: this.props.userId,
            })

        this.props.openCamera(null, trackOpenCamera, trackImageAttached)
    }

    componentDidMount() {
        const { image } = this.props.user.profile

        // console.log(`${DEBUG_KEY}: prefetch image: ${image}`);
        if (image) {
            this.prefetchImage(image)
        }
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

    componentDidUpdate(prevProps, prevState, snapshot) {
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
    openFriendRequestOptionModal = () => this.friendRequestBottomSheetRef.open()
    closeFriendRequestOptionModal = () =>
        this.friendRequestBottomSheetRef.close()

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
    }

    handleBannerInfoIconOnPress = () => {
        const { openEarnBageModal } = this.props
        if (openEarnBageModal) {
            openEarnBageModal()
        }
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
                    <View style={{ marginRight: 10 }}>
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

    openCameraRoll = () => {
        const trackOpenCameraRoll = () =>
            trackWithProperties(E.REG_CAMROLL, {
                UserId: this.props.userId,
            })

        const trackImageAttached = () =>
            trackWithProperties(E.REG_ADD_PHOTO_ATTACHED, {
                UserId: this.props.userId,
            })

        this.props.openCameraRoll(
            null,
            null,
            trackOpenCameraRoll,
            trackImageAttached
        )
    }

    onSkip = () => {
        trackWithProperties(E.REG_ADD_PHOTO_SKIPPED, {
            UserId: this.props.userId,
        })

        Actions.push('registration_contact_sync')
    }

    onContinue = () => {
        // Screen transition first
        Actions.push('registration_contact_sync')

        // Upload image
        this.props.registrationAddProfilePhoto()
    }

    profilepictureChange = () => {
        this.setState({ profilepicture: false, imagepicker: true })
    }

    renderImage = ({ input: { value } }) => {
        const { user } = this.props

        console.log('userr', value)

        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={this.chooseImage}
                style={styles.imageContainerStyle}
            >
                <ProfileImage
                    imageStyle={{
                        width: default_style.uiScale * 120,
                        height: default_style.uiScale * 120,
                    }}
                    imageUrl={getProfileImageOrDefaultFromUser(user)}
                />

                <View style={styles.iconContainerStyle}>
                    <Entypo name="camera" size={13} color="#FFFFFF" />
                </View>
            </TouchableOpacity>
        )
    }

    renderProfileImage() {
        const { user } = this.props
        return (
            <TouchableOpacity style={styles.imageContainerStyle}>
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
            <View>
                {this.renderAddAction(
                    'Add a location',
                    this.handleEditOnPressed
                )}
            </View>
        )
    }

    chooseImage = async () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
            },
            (buttonIndex) => {
                console.log('button clicked', BUTTONS[buttonIndex])
                switch (buttonIndex) {
                    case TAKING_PICTURE_INDEX:
                        this.props.openCamera((result) => {
                            this.props.change('profile.image', result.uri)
                        })
                        break
                    case CAMERA_ROLL_INDEX:
                        this.props.openCameraRoll((result) => {
                            console.log(
                                'resultttt',
                                this.props.change('profile.image', result.uri)
                            )
                            this.props.change('profile.image', result.uri)
                        })
                        break
                    default:
                        return
                }
            }
        )
    }

    renderInput = ({
        input: { onChange, onFocus, ...restInput },
        label,
        secure,
        limitation,
        multiline,
        disabled,
        clearButtonMode,
        enablesReturnKeyAutomatically,
        forFocus,
        onNextPress,
        autoCorrect,
        meta: { error },
        returnKeyType,
        ...custom
    }) => {
        return (
            <View style={styles.inputContainerStyle}>
                <TextField
                    label={label}
                    title={custom.title}
                    autoCapitalize={'none'}
                    autoCorrect={autoCorrect || true}
                    onChangeText={onChange}
                    error={error}
                    enablesReturnKeyAutomatically={
                        enablesReturnKeyAutomatically
                    }
                    returnKeyType={returnKeyType || 'done'}
                    secureTextEntry={secure}
                    characterRestriction={limitation}
                    multiline={multiline}
                    clearButtonMode={clearButtonMode}
                    onFocus={forFocus}
                    disabled={disabled}
                    autoCorrect
                    onKeyPress={(key) => {
                        if (key === 'next' && onNextPress) {
                            onNextPress()
                        }
                    }}
                    {...custom}
                    {...restInput}
                />
            </View>
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

    render() {
        const { user, self } = this.props

        if (!user) return null

        const { name, headline, profile } = user

        const { location } = profile

        return (
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
                        {self ? (
                            <Field
                                name="profile.image"
                                label="Profile Picture"
                                component={this.renderImage.bind(this)}
                            />
                        ) : (
                            this.renderProfileImage(profile, self)
                        )}
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {/* <View style={{ flex: 1 }} /> */}
                        {this.renderFriendshipStatusButton()}
                        {this.renderMoreProfileActionButton()}
                        {this.renderBottomSheet()}
                        {this.renderFriendshipStatusBottomSheet()}
                    </View>
                </View>
                <View style={styles.containerStyle}>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
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
        )
    }
}

ProfileDetailCard = reduxForm({
    form: 'profileDetailCard',
    enableReinitialize: true,
})(ProfileDetailCard)

const styles = {
    editIconStyle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        tintColor: '#BBB',
    },

    imagePickerStyles: {
        marginVertical: 60,
    },
    containerStyle: {
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        // paddingTop: 10,
        paddingLeft: 16,
        paddingRight: 16,
    },
    imageWrapperStyle: {
        // alignItems: 'center',
        borderRadius: 60 * default_style.uiScale,
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        backgroundColor: 'white',
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
        backgroundColor: color.GM_CARD_BACKGROUND,
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
        left: width * 0.23,
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
    const { userId } = props

    const { profilePic } = state.registration

    const self = userId === state.user.userId

    const userObject = getUserData(state, userId, '')
    const { user, mutualFriends, friendship } = userObject

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
        userId,
        friendsCount,
        mutualFriends,
        needRespond,
        profilePic,
    }
}

export default connect(mapStateToProps, {
    openProfileDetailEditForm,
    updateFriendship,
    createOrGetDirectMessage,
    createReport,
    blockUser,
    openCamera,
    openCameraRoll,
    submitUpdatingProfile,
})(ProfileDetailCard)
