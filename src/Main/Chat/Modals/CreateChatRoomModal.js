/** @format */

import _ from 'lodash'
import R from 'ramda'
import React from 'react'
import {
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Platform,
} from 'react-native'
import { Input, Icon, Button, withStyles, Layout } from '@ui-kitten/components'
import { connect } from 'react-redux'
import { formValueSelector, reduxForm } from 'redux-form'
import { openCamera, openCameraRoll, loadFriends } from '../../../actions'
// Actions
import {
    cancelCreateOrUpdateChatroom,
    changeModalPage,
    createOrUpdateChatroom,
    loadMoreFriendsSearch,
    refreshFriendsSearch,
    searchQueryUpdated,
    updateSelectedMembers,
} from '../../../redux/modules/chat/CreateChatRoomActions'
// Components
import ModalHeader from '../../Common/Header/ModalHeader'
import ImageModal from '../../Common/ImageModal'
import {
    track,
    trackWithProperties,
    EVENT as E,
} from '../../../monitoring/segment'
import { color, default_style } from '../../../styles/basic'
import { IMAGE_BASE_URL } from '../../../Utils/Constants'

import ToggleField from '../../Common/ToggleField'
import ImagePicker from '../../Common/ImagePicker'
import StyledMultiUserInvitePage from '../../Common/MultiUserInvitePage'
import { searchFriend } from '../../../redux/modules/search/SearchActions'

class CreateChatroomModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mediaModal: false,
            missingGroupName: false,
            membersAdded: 0,
        }
    }
    _keyExtractor = (item) => item._id

    componentDidMount() {
        this.startTime = new Date()
        track(
            this.props.initializeFromState
                ? E.EDIT_CHATROOM_OPENED
                : E.CREATE_CHATROOM_OPENED
        )
        this.initializeForm()
        this.switchValue = this.isPublic
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.name.trim().length && this.state.missingGroupName) {
            this.setState({
                ...this.state,
                missingGroupName: false,
            })
        }
    }

    initializeForm() {
        const defaulVals = {
            name: '',
            roomType: 'Group',
            description: undefined,
            isPublic: true,
            membersCanAdd: false,
            memberLimit: undefined,
            picture: undefined,
        }

        // Initialize based on the props, if it's opened through edit button
        const { initializeFromState, chat } = this.props
        const initialVals = initializeFromState
            ? { ...chat }
            : { ...defaulVals }

        this.props.initialize({
            ...initialVals,
        })
    }

    handleSubmit = () => {
        const {
            initializeFromState,
            chat,
            picture,
            membersToAdd,
            formVals,
            uploading,
        } = this.props
        if (uploading) return
        const chatId = chat && chat._id
        const needUpload =
            (initializeFromState && chat.picture && chat.picture !== picture) ||
            (!initializeFromState && picture)

        const durationSec =
            (new Date().getTime() - this.startTime.getTime()) / 1000
        trackWithProperties(
            initializeFromState ? E.CHATROOM_UPDATED : E.CHATROOM_CREATED,
            { ...formVals.values, ChatId: chatId, DurationSec: durationSec }
        )

        this.props.createOrUpdateChatroom(
            formVals.values,
            membersToAdd || '',
            chatId, // chatId
            initializeFromState, // isEdit
            needUpload
        )
    }

    handleNext = () => {
        const isEdit = this.props.initializeFromState
        if (!this.props.name.trim().length) {
            this.setState({
                ...this.state,
                missingGroupName: true,
            })
            return
        }
        if (this.state.membersAdded <= 0) {
            Alert.alert('Members Limit cannot be 0')
            return
        }
        if (isEdit) {
            this.handleSubmit()
        } else if (this.props.modalPageNumber == 1) {
            this.props.changeModalPage(2)
        } else if (this.props.modalPageNumber == 2) {
            // if (this.props.selectedMembers.length == 0) {
            // 	return Alert.alert('Warning', 'You must select at least one other person to add to the conversation.');
            // };
            if (
                this.props.selectedMembers.length >
                this.props.memberLimit - 1
            ) {
                return Alert.alert(
                    'Warning',
                    "You've added more members than the specified member limit for this chat"
                )
            }
            this.handleSubmit()
        }
    }

    handleOpenCamera = () => {
        this.props.openCamera((result) => {
            this.props.change('picture', result.uri)
        })
    }

    handleOpenCameraRoll = () => {
        const callback = R.curry((result) => {
            this.props.change('picture', result.uri)
        })
        this.props.openCameraRoll(callback)
    }

    renderImageModal(imageUrl) {
        if (!this.state.mediaModal) {
            return null
        }
        return (
            <ImageModal
                mediaRef={imageUrl}
                mediaModal={true}
                isLocalFile={true}
                closeModal={() => this.setState({ mediaModal: false })}
            />
        )
    }

    AlertIcon = (props) => <Icon {...props} name="alert-circle-outline" />

    renderChatroomName() {
        return (
            <Input
                label="Group Name"
                placeholder="Enter a name for this room..."
                captionIcon={this.AlertIcon}
                caption="This field is required."
                disabled={this.props.uploading}
                style={styles.inputStyle}
                onChangeText={(val) => this.props.change('name', val)}
                value={this.props.name}
                status={this.state.missingGroupName ? 'danger' : 'basic'}
            />
        )
    }

    renderChatRoomMemberLimit() {
        return (
            <Input
                label="Member Limit"
                disabled={
                    this.props.uploading || this.props.initializeFromState
                }
                placeholder="Enter a number..."
                keyboardType="number-pad"
                style={styles.inputStyle}
                onChangeText={(val) => {
                    this.setState({ membersAdded: val })
                    this.props.change('memberLimit', val)
                }}
                value={
                    this.props.memberLimit
                        ? `${this.props.memberLimit}`
                        : undefined
                }
            />
        )
    }

    renderChatroomDescription() {
        return (
            <Input
                label="Description"
                disabled={this.props.uploading}
                placeholder="What's this room about?"
                multiline
                textStyle={styles.multilineTextStyle}
                style={styles.inputStyle}
                onChangeText={(val) => this.props.change('description', val)}
                value={this.props.description}
            />
        )
    }

    renderGroupChatImage() {
        const { initializeFromState, chat, picture } = this.props
        const profile = this.props
        let imageUrl = picture
        if (initializeFromState && chat.picture) {
            const hasImageModified = chat.picture && chat.picture !== picture
            if (!hasImageModified) {
                // If editing a tribe and image hasn't changed, then image source should
                // be from server
                imageUrl = `${IMAGE_BASE_URL}${picture}`
            }
        }

        return (
            <View style={styles.imageContainerStyle}>
                <ImagePicker
                    handleTakingPicture={this.handleOpenCamera}
                    handleCameraRoll={this.handleOpenCameraRoll}
                    imageUri={imageUrl}
                    style={styles.imageStyle}
                    bordered
                    rounded
                />
            </View>
        )
    }

    handleInfoIconOnPress() {
        const { openProfileInfoModal } = true
        if (openProfileInfoModal) {
            // Open info modal here.
            // How should this work?
        }
    }

    renderGroupChatToggles() {
        return (
            <>
                <ToggleField
                    label={<Text>Publicly Visible</Text>}
                    checked={this.props.isPublic}
                    onCheckedChange={(val) => {
                        this.props.change('isPublic', val)
                    }}
                >
                    <TouchableOpacity>
                        <Icon
                            style={styles.infoIconStyle}
                            name="info-outline"
                        />
                    </TouchableOpacity>
                </ToggleField>
                <ToggleField
                    label={<Text>Members can invite their friends</Text>}
                    checked={this.props.membersCanAdd}
                    onCheckedChange={(val) => {
                        this.props.change('membersCanAdd', val)
                    }}
                />
            </>
        )
    }

    renderMemberInvite() {
        const { name } = this.props
        const props = {
            searchFor: this.props.searchFriend,
            onSubmitSelection: (users, inviteToEntity, actionToExecute) => {},
            onCloseCallback: (actionToExecute) => {},
            inviteToEntityType: 'Chat',
            inviteToEntityName: name,
            inviteToEntity: name, // this is not important here since we don't use header to submit
            preload: this.props.loadFriends,
            onSelectionChange: (data) => this.props.updateSelectedMembers(data),
            noHeader: true,
        }

        return (
            <Layout style={{ flex: 1 }}>
                <StyledMultiUserInvitePage {...props} />
            </Layout>
        )
    }

    render() {
        const { user, self, uploading } = this.props
        if (!user) return null
        const { name, headline, profile } = user
        const { modalPageNumber } = this.props
        const actionText = this.props.initializeFromState
            ? 'Update'
            : this.props.modalPageNumber == 1
            ? 'Next'
            : 'Create'
        const titleText = this.props.initializeFromState
            ? 'Edit Group Settings'
            : 'Group Conversation'

        return (
            <Layout style={{ flex: 1 }}>
                <ModalHeader
                    title={titleText}
                    back={modalPageNumber == 2}
                    onCancel={() => {
                        if (modalPageNumber == 2) {
                            this.props.changeModalPage(1)
                            return
                        }
                        const durationSec =
                            (new Date().getTime() - this.startTime.getTime()) /
                            1000
                        trackWithProperties(
                            this.props.initializeFromState
                                ? E.EDIT_CHATROOM_CANCELLED
                                : E.CREATE_CHATROOM_CANCELLED,
                            { DurationSec: durationSec }
                        )
                        this.props.cancelCreateOrUpdateChatroom()
                    }}
                    onAction={this.handleNext}
                    actionDisabled={uploading}
                />
                {modalPageNumber == 1 ? (
                    <KeyboardAvoidingView
                        behavior={Platform.select({
                            android: 'height',
                            ios: 'padding',
                            default: 'padding',
                        })}
                        style={{
                            ...styles.homeContainerStyle,
                            flex: 1,
                            backgroundColor: '#ffffff',
                        }}
                    >
                        <ScrollView
                            style={{
                                borderTopColor: '#e9e9e9',
                                borderTopWidth: 1,
                            }}
                        >
                            <View style={{ flex: 1, paddingTop: 0 }}>
                                <View
                                    style={{
                                        height: 90 * default_style.uiScale,
                                        backgroundColor:
                                            color.GM_BLUE_LIGHT_LIGHT,
                                    }}
                                />
                                <View style={styles.topWrapperStyle}>
                                    {this.renderGroupChatImage()}
                                </View>
                                <View style={{ flex: 1, padding: 20 }}>
                                    {this.renderChatroomName()}
                                    {this.renderChatroomDescription()}
                                    {this.renderChatRoomMemberLimit()}
                                    {this.renderGroupChatToggles()}
                                </View>
                            </View>
                            <Button
                                size="large"
                                style={styles.actionButtonStyle}
                                onPress={this.handleNext}
                                disabled={
                                    modalPageNumber == 2 &&
                                    this.props.selectedMembers.length == 0
                                }
                            >
                                {actionText}
                            </Button>
                        </ScrollView>
                    </KeyboardAvoidingView>
                ) : (
                    this.renderMemberInvite()
                )}
            </Layout>
        )
    }
}

/**
 * Map app theme to styles. These styles can be accessed
 * using the <eva> prop. For example,
 * const { eva } = this.props;
 * eva.styles.backgroundPrimary;
 * @see https://github.com/akveo/react-native-ui-kitten/blob/master/docs/src/articles/design-system/use-theme-variables.md
 */
const mapThemeToStyles = (theme) => ({
    backgroundPrimary: {
        backgroundColor: theme['color-primary-500'],
    },
})

const StyledCreateChatroomModal = withStyles(
    CreateChatroomModal,
    mapThemeToStyles
)

const FormedCreateChatroomModal = reduxForm({
    form: 'createChatRoomModal',
    enableReinitialize: true,
})(StyledCreateChatroomModal)

const mapStateToProps = (state) => {
    const selector = formValueSelector('createChatRoomModal')
    const { user } = state.user
    const {
        refreshing,
        loading,
        hasNextPage,
        pageSize,
        pageOffset,
        uploading,
        searchResults,
        selectedMembers,
        searchQuery,
        modalPageNumber,
    } = state.newChatRoom

    return {
        user,
        refreshing,
        loading,
        hasNextPage,
        pageSize,
        pageOffset,
        uploading,
        searchQuery,
        modalPageNumber,
        searchResults,
        selectedMembers,
        name: selector(state, 'name'),
        membersCanAdd: selector(state, 'membersCanAdd'),
        isPublic: selector(state, 'isPublic'),
        memberLimit: selector(state, 'memberLimit'),
        description: selector(state, 'description'),
        picture: selector(state, 'picture'),
        roomType: selector(state, 'roomType'),
        membersToAdd: selectedMembers
            .map((doc) => doc._id.toString())
            .join(','),
        formVals: state.form.createChatRoomModal,
    }
}

export default connect(mapStateToProps, {
    cancelCreateOrUpdateChatroom,
    createOrUpdateChatroom,
    changeModalPage,
    updateSelectedMembers,
    refreshFriendsSearch,
    loadMoreFriendsSearch,
    searchQueryUpdated,
    openCameraRoll,
    openCamera,
    searchFriend,
    loadFriends,
})(FormedCreateChatroomModal)

const styles = {
    homeContainerStyle: {
        backgroundColor: '#f8f8f8',
        flex: 1,
    },
    topWrapperStyle: {
        height: default_style.uiScale * 60,
        backgroundColor: color.GM_CARD_BACKGROUND,
        padding: 16,
    },
    imageContainerStyle: {
        alignItems: 'center',
        borderRadius: default_style.uiScale * 120,
        borderColor: '#BDBDBD',
        position: 'absolute',
        bottom: 10,
        left: 20,
        alignSelf: 'center',
        backgroundColor: color.GM_CARD_BACKGROUND,
    },
    imageStyle: {
        width: default_style.uiScale * 120,
        height: default_style.uiScale * 120,
        borderRadius: default_style.uiScale * 60,
    },
    inputStyle: {
        paddingVertical: 6,
    },
    multilineTextStyle: {
        height: 100,
    },
    borderStyle: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#e9e9e9',
        shadowColor: '#ddd',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
    },
    // Menu related style
    infoIconStyle: {
        width: 18,
        height: 18,
        marginLeft: 5,
    },
    actionButtonStyle: {
        marginHorizontal: 16,
        marginBottom: 32,
        marginTop: 20,
    },
}
