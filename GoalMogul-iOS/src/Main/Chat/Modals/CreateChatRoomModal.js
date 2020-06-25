/** @format */

import { MaterialIcons } from '@expo/vector-icons'
import _ from 'lodash'
import R from 'ramda'
import React from 'react'
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    SafeAreaView,
    Switch,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions,
} from 'react-native'
import { CheckBox, SearchBar } from 'react-native-elements'
import { Input, Icon, Button } from '@ui-kitten/components'
import { MenuProvider } from 'react-native-popup-menu'
import { connect } from 'react-redux'
import { Field, formValueSelector, reduxForm } from 'redux-form'
import { openCamera, openCameraRoll } from '../../../actions'
import camera from '../../../asset/utils/camera.png'
import cameraRoll from '../../../asset/utils/cameraRoll.png'
// assets
import cancel from '../../../asset/utils/cancel_no_background.png'
import plus from '../../../asset/utils/plus.png'
import times from '../../../asset/utils/times.png'
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
import { SearchIcon } from '../../../Utils/Icons'
// Components
import ModalHeader from '../../Common/Header/ModalHeader'
import ImageModal from '../../Common/ImageModal'
import SearchUserCard from '../../Search/People/SearchUserCard'
import {
    track,
    trackWithProperties,
    EVENT as E,
} from '../../../monitoring/segment'
import {
    GM_BLUE_LIGHT_LIGHT,
    GM_BLUE,
    GM_BLUE_LIGHT,
    DEFAULT_STYLE,
    TEXT_COLOR_1,
    BACKGROUND_COLOR,
} from '../../../styles'
import DelayedButton from '../../Common/Button/DelayedButton'

import { IMAGE_BASE_URL } from '../../../Utils/Constants'

import defaultGroupPic from '../../../asset/utils/defaultSelfUserProfile.png'
import ToggleField from '../../Common/ToggleField'
import ImagePicker from '../../Common/ImagePicker'

const { InfoIcon } = Icons

const { width } = Dimensions.get('window')

const FRIEND_SEARCH_AUTO_SEARCH_DELAY_MS = 500

class CreateChatroomModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mediaModal: false,
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
            // return Alert.alert('Warning', 'You must enter a Name.')
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

    renderInput = ({
        input: { onChange, onFocus, value },
        editable,
        numberOfLines,
        meta: { touched, error },
        placeholder,
        keyboardType,
        ...custom
    }) => {
        const inputStyle = {
            ...styles.inputStyle,
        }

        let multiline = true
        if (numberOfLines && numberOfLines === 1) {
            multiline = false
        }
        return (
            <SafeAreaView
                style={{
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderRadius: 3,
                    margin: 3,
                    marginBottom: 9,
                    borderColor: '#A6AAB4',
                }}
            >
                <TextInput
                    placeholder={placeholder}
                    onChangeText={onChange}
                    style={inputStyle}
                    editable={editable}
                    maxHeight={150}
                    keyboardType={keyboardType || 'default'}
                    multiline={multiline}
                    value={value}
                />
            </SafeAreaView>
        )
    }

    renderActionIcons() {
        const actionIconStyle = { ...styles.actionIconStyle }
        const actionIconWrapperStyle = { ...styles.actionIconWrapperStyle }
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginTop: 10,
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={actionIconWrapperStyle}
                    onPress={this.handleOpenCamera}
                >
                    <Image style={actionIconStyle} source={camera} />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={{ ...actionIconWrapperStyle, marginLeft: 5 }}
                    onPress={this.handleOpenCameraRoll}
                >
                    <Image style={actionIconStyle} source={cameraRoll} />
                </TouchableOpacity>
            </View>
        )
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
        // const titleText = <Text style={styles.titleTextStyle}>Group Name</Text>;
        // return (
        //   <View style={{ marginBottom: 5 }}>
        //     {titleText}
        //     <Field
        //       name="name"
        //       label="name"
        //       component={this.renderInput}
        //       editable={!this.props.uploading}
        //       numberOfLines={1}
        //       multiline
        //       style={styles.goalInputStyle}
        //     />
        //   </View>
        // );
        return (
            <Input
                label="Group Name"
                placeholder="Enter a name for this room..."
                captionIcon={this.AlertIcon}
                caption="This field is required."
                disabled={this.props.uploading}
                style={styles.inputStyle}
            />
        )
    }

    renderChatRoomMemberLimit() {
        // const titleText = (
        //   <Text style={styles.titleTextStyle}>Member Limit (Optional)</Text>
        // );
        // return (
        //   <View style={{ marginBottom: 5 }}>
        //     {titleText}
        //     <Field
        //       name="memberLimit"
        //       label="memberLimit"
        //       component={this.renderInput}
        //       editable={!this.props.uploading}
        //       numberOfLines={1}
        //       keyboardType="number-pad"
        //       style={styles.goalInputStyle}
        //       placeholder="Enter a number..."
        //     />
        //   </View>
        // );
        return (
            <Input
                label="Member Limit"
                disabled={this.props.uploading}
                placeholder="Enter a number..."
                keyboardType="number-pad"
                style={styles.inputStyle}
            />
        )
    }

    renderChatroomDescription() {
        // const titleText = (
        //   <Text style={styles.titleTextStyle}>Description (Optional)</Text>
        // );
        // return (
        //   <View style={{ marginBottom: 5 }}>
        //     {titleText}
        //     <Field
        //       name="description"
        //       label="description"
        //       component={this.renderInput}
        //       editable={!this.props.uploading}
        //       numberOfLines={5}
        //       style={styles.goalInputStyle}
        //       placeholder="What's this room about?"
        //     />
        //   </View>
        // );
        return (
            <Input
                label="Description"
                disabled={this.props.uploading}
                placeholder="What's this room about?"
                multiline
                textStyle={styles.multilineTextStyle}
                style={styles.inputStyle}
            />
        )
    }

    renderMemberItem(item) {
        return (
            <SearchUserCard
                item={item.item}
                onSelect={this.onSearchResultSelect}
                cardIconSource={item.item.isSearchResult ? plus : times}
                cardContainerStyles={
                    item.item.isSearchResult
                        ? {}
                        : { backgroundColor: '#D8EDFF' }
                }
            />
        )
    }
    onSearchResultSelect = (userId, userDoc) => {
        let newSelectedMembers = _.map(this.props.selectedMembers, _.clone)
        if (userDoc.isSearchResult) {
            let newUserDoc = _.cloneDeep(userDoc)
            newUserDoc = _.set(newUserDoc, 'isSearchResult', false)
            newSelectedMembers.push(newUserDoc)
            this.search.clear()
            this.search.focus()
        } else {
            const indexToRemove = newSelectedMembers.findIndex(
                (userDoc) => userDoc._id == userId
            )
            if (indexToRemove > -1) {
                newSelectedMembers.splice(indexToRemove, 1)
            } else {
                return
            }
        }
        this.props.updateSelectedMembers(newSelectedMembers)
    }
    handleOnRefresh = (maybeQuery) => {
        const query =
            typeof maybeQuery == 'string' ? maybeQuery : this.props.searchQuery
        this.props.refreshFriendsSearch(query, this.props.pageSize)
    }
    handleOnLoadMore = () => {
        if (!this.props.hasNextPage) return
        this.props.loadMoreFriendsSearch(
            this.props.searchQuery,
            this.props.pageSize,
            this.props.pageOffset
        )
    }
    handleSearchUpdate(newText = '') {
        if (this.friendsSearchTimer) {
            clearInterval(this.friendsSearchTimer)
        }
        this.props.searchQueryUpdated(newText)
        if (newText.trim().length) {
            this.friendsSearchTimer = setTimeout(
                this.handleOnRefresh.bind(this),
                FRIEND_SEARCH_AUTO_SEARCH_DELAY_MS
            )
        } else {
            this.handleOnRefresh('')
        }
    }
    renderListHeader = () => {
        const { searchQuery } = this.props
        return (
            <SearchBar
                ref={(search) => (this.search = search)}
                platform="default"
                clearIcon={
                    <MaterialIcons name="clear" color="#777" size={21} />
                }
                containerStyle={{
                    backgroundColor: 'transparent',
                    padding: 6,
                    borderColor: 'white',
                    borderWidth: 0,
                }}
                inputContainerStyle={{
                    backgroundColor: '#FAFAFA',
                }}
                inputStyle={{
                    fontSize: 15,
                }}
                placeholder={`Search...`}
                onChangeText={this.handleSearchUpdate.bind(this)}
                onClear={this.handleSearchUpdate.bind(this)}
                searchIcon={
                    <SearchIcon
                        iconContainerStyle={{ marginBottom: 3, marginTop: 1 }}
                        iconStyle={{ tintColor: '#777', height: 15, width: 15 }}
                    />
                }
                value={searchQuery}
                lightTheme={true}
            />
        )
    }
    renderListFooter() {
        if (!this.props.loading) return null
        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: '#CED0CE',
                }}
            >
                <ActivityIndicator animating size="small" />
            </View>
        )
    }
    renderListEmptyState() {
        if (!this.props.loading && !this.props.refreshing) {
            return (
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 100,
                    }}
                >
                    <Text
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: 18,
                            color: '#999',
                        }}
                    >
                        {this.props.searchQuery.trim().length
                            ? ''
                            : 'Search some friends to add...'}
                    </Text>
                </View>
            )
        }
        return null
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
        // const style = picture
        //     ? styles.imageStyle
        //     : {
        //           width: 30 * DEFAULT_STYLE.uiScale,
        //           height: 30 * DEFAULT_STYLE.uiScale,
        //           margin: 40 * DEFAULT_STYLE.uiScale,
        //       }
        // const containerStyle = [
        //     styles.imageContainerStyle,
        //     picture
        //         ? {}
        //         : {
        //               borderColor: '#BDBDBD',
        //               borderRadius: width * 0.15,
        //               borderWidth: 2,
        //           },
        // ]
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

        // <TouchableOpacity
        //             activeOpacity={0.85}
        //             onPress={this.handleOpenCameraRoll}
        //         >
        //             <Image style={style} source={{ uri: imageUrl }} />
        //         </TouchableOpacity>
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
                    label="Publicly Visible"
                    checked={this.props.isPublic}
                    onCheckedChange={(switchValue) => {
                        this.setState({ switchValue })
                        this.props.change('isPublic', !this.props.isPublic)
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
                    label="Members can invite their friends"
                    checked={this.props.membersCanAdd}
                    onCheckedChange={(switchValue2) => {
                        this.setState({ switchValue2 })
                        this.props.change(
                            'membersCanAdd',
                            !this.props.membersCanAdd
                        )
                    }}
                />
            </>
        )
        /*
        return (
            <View>
                <View style={styles.toggle}>
                    <Text style={styles.switchLabel}>Publicly Visible</Text>

                    <DelayedButton
                        onPress={this.handleInfoIconOnPress}
                        style={[
                            styles.infoIconContainerStyle,
                            styles.marginStyle,
                        ]}
                        activeOpacity={0.6}
                    >
                        <Image
                            source={InfoIcon}
                            style={DEFAULT_STYLE.infoIcon}
                        />
                    </DelayedButton>

                    <Switch
                        style={styles.switch}
                        trackColor={{ false: '#767577', true: '#45C9F6' }}
                        thumbColor={this.state.switchValue ? '#fff' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        value={this.props.isPublic}
                        onValueChange={(switchValue) => {
                            this.setState({ switchValue })
                            this.props.change('isPublic', !this.props.isPublic)
                        }}
                    />
                </View>
                <View style={styles.toggle}>
                    <Text style={styles.switchLabel}>
                        Members can invite their friends
                    </Text>
                    <Switch
                        style={styles.switch}
                        trackColor={{ false: '#767577', true: '#45C9F6' }}
                        thumbColor={
                            this.state.switchValue2 ? '#fff' : '#f4f3f4'
                        }
                        ios_backgroundColor="#3e3e3e"
                        value={this.props.membersCanAdd}
                        onPress={() =>
                            this.props.change(
                                'membersCanAdd',
                                !this.props.membersCanAdd
                            )
                        }
                        onValueChange={(switchValue2) => {
                            this.setState({ switchValue2 })
                            this.props.change(
                                'membersCanAdd',
                                !this.props.membersCanAdd
                            )
                        }}
                    />
                </View>
            </View>
        )
        */
    }

    render() {
        const { user, self } = this.props
        if (!user) return null
        const { name, headline, profile } = user
        const { modalPageNumber } = this.props
        const actionText = this.props.initializeFromState
            ? 'Update'
            : this.props.modalPageNumber == 1
            ? 'Next'
            : 'Create'
        const titleText = this.props.initializeFromState
            ? 'Edit Group Chat'
            : 'Group Message'

        return (
            <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
                <KeyboardAvoidingView
                    behavior="padding"
                    style={{
                        ...styles.homeContainerStyle,
                        flex: 1,
                        backgroundColor: '#ffffff',
                    }}
                >
                    <ModalHeader
                        title={titleText}
                        actionText={actionText}
                        onCancel={() => {
                            const durationSec =
                                (new Date().getTime() -
                                    this.startTime.getTime()) /
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
                    />
                    <ScrollView
                        style={{ borderTopColor: '#e9e9e9', borderTopWidth: 1 }}
                    >
                        {modalPageNumber == 1 ? (
                            <View style={{ flex: 1, paddingTop: 0 }}>
                                <View
                                    style={{
                                        height: 90 * DEFAULT_STYLE.uiScale,
                                        backgroundColor: GM_BLUE_LIGHT_LIGHT,
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
                        ) : (
                            <View style={{ flex: 1, padding: 21 }}>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: '#CCC',
                                        marginBottom: 6,
                                        textAlign: 'center',
                                    }}
                                >
                                    Add friends to the chat
                                </Text>
                                {/* Selected items */}
                                <FlatList
                                    data={[...this.props.selectedMembers]}
                                    renderItem={this.renderMemberItem.bind(
                                        this
                                    )}
                                    numColumns={1}
                                    keyExtractor={this._keyExtractor}
                                    ListHeaderComponent={this.renderListHeader}
                                />
                                {/* Search result items */}
                                <FlatList
                                    data={[...this.props.searchResults]}
                                    renderItem={this.renderMemberItem.bind(
                                        this
                                    )}
                                    numColumns={1}
                                    keyExtractor={this._keyExtractor}
                                    refreshing={this.props.refreshing}
                                    onRefresh={this.handleOnRefresh.bind(this)}
                                    ListFooterComponent={this.renderListFooter.bind(
                                        this
                                    )}
                                    ListEmptyComponent={this.renderListEmptyState.bind(
                                        this
                                    )}
                                    onEndThreshold={0}
                                    onEndReached={this.handleOnLoadMore.bind(
                                        this
                                    )}
                                />
                            </View>
                        )}
                    </ScrollView>
                    <Button
                        size="large"
                        style={styles.actionButtonStyle}
                        onPress={this.handleNext}
                    >
                        {actionText}
                    </Button>
                </KeyboardAvoidingView>
            </MenuProvider>
        )
    }
}

CreateChatroomModal = reduxForm({
    form: 'createChatRoomModal',
    enableReinitialize: true,
})(CreateChatroomModal)

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
        swithValue: false,
        switchValue2: false,
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
})(CreateChatroomModal)

const styles = {
    homeContainerStyle: {
        backgroundColor: '#f8f8f8',
        flex: 1,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.3,
        // shadowRadius: 6,
    },
    sectionMargin: {
        marginTop: 20,
    },
    inputContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#e9e9e9',
        shadowColor: '#ddd',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        elevation: 1,
    },
    topWrapperStyle: {
        height: DEFAULT_STYLE.uiScale * 60,
        backgroundColor: BACKGROUND_COLOR,
        padding: 16,
    },
    imageContainerStyle: {
        alignItems: 'center',
        borderRadius: DEFAULT_STYLE.uiScale * 120,
        borderColor: '#BDBDBD',
        position: 'absolute',
        bottom: 10,
        left: 20,
        alignSelf: 'center',
        backgroundColor: BACKGROUND_COLOR,
    },
    imageStyle: {
        width: DEFAULT_STYLE.uiScale * 120,
        height: DEFAULT_STYLE.uiScale * 120,
        borderRadius: DEFAULT_STYLE.uiScale * 60,
    },
    titleTextStyle: {
        fontSize: 14,
        color: '#000',
        padding: 2,
    },
    standardInputStyle: {
        flex: 1,
        fontSize: 12,
        padding: 13,
        paddingRight: 14,
        paddingLeft: 14,
    },
    goalInputStyle: {
        fontSize: 20,
        padding: 20,
        paddingRight: 15,
        paddingLeft: 15,
        fontWeight: 400,
    },
    // inputStyle: {
    //   paddingTop: 6,
    //   paddingBottom: 6,
    //   padding: 10,
    //   backgroundColor: "white",
    //   borderRadius: 22,
    // },
    inputStyle: {
        paddingVertical: 6,
    },
    multilineTextStyle: {
        height: 100,
    },
    cancelIconStyle: {
        height: 20,
        width: 20,
        justifyContent: 'flex-end',
    },
    mediaStyle: {
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionIconWrapperStyle: {
        backgroundColor: '#fafafa',
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    actionIconStyle: {
        tintColor: '#4a4a4a',
        height: 15,
        width: 18,
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
    backdrop: {
        backgroundColor: 'transparent',
    },
    toggle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 10,
    },
    switch: {
        marginLeft: 'auto',
        alignSelf: 'flex-end',
    },
    switchLabel: {},
    infoIconContainerStyle: {
        borderRadius: 180,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        marginLeft: 5,
    },
    infoIconStyle: {
        width: 18,
        height: 18,
        marginLeft: 5,
    },
    actionButtonStyle: {
        marginHorizontal: 16,
        marginBottom: 32,
    },
}
