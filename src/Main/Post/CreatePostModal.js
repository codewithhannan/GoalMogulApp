/** @format */

import _ from 'lodash'
import R from 'ramda'
import React, { Component } from 'react'
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    ImageBackground,
    ActivityIndicator,
    Keyboard,
    Alert,
} from 'react-native'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { Icon } from '@ui-kitten/components'

// assets
import cancel from '../../asset/utils/cancel_no_background.png'
import expand from '../../asset/utils/expand.png'

// Actions
import { openCameraRoll, openCamera } from '../../actions'
import {
    fetchPostDrafts,
    postToFormAdapter,
    savePostDrafts,
    submitCreatingPost,
} from '../../redux/modules/feed/post/PostActions'
import { searchUser } from '../../redux/modules/search/SearchActions'

// Utils
import {
    EVENT as E,
    track,
    trackWithProperties,
} from '../../monitoring/segment'
import {
    arrayUnique,
    clearTags,
    getProfileImageOrDefaultFromUser,
} from '../../redux/middleware/utils'

import { IMAGE_BASE_URL, PRIVACY_FRIENDS } from '../../Utils/Constants'
import { default_style, color } from '../../styles/basic'
import { IS_SMALL_PHONE } from '../../styles'

/* Components */
import BottomSheet from '../Common/Modal/BottomSheet'
import DelayedButton from '../Common/Button/DelayedButton'
import ImageModal from '../Common/ImageModal'
import ProfileImage from '../Common/ProfileImage'
import EmptyResult from '../Common/Text/EmptyResult'
import MentionsTextInput from '../Goal/Common/MentionsTextInput'
import ViewableSettingMenu from '../Goal/ViewableSettingMenu'
import DraftsView from './DraftsView'
import AttachGoal from './AttachGoal'

const DEBUG_KEY = '[ UI CreatePostModal ]'
const INITIAL_TAG_SEARCH = {
    data: [],
    skip: 0,
    limit: 10,
    loading: false,
}
const ON_CANCEL_OPTIONS = ['Save Draft', 'Discard', 'Cancel']
const ON_CANCEL_CANCEL_INDEX = 2
const TEXT_INPUT_DEAFULT_HEIGHT = 80

class CreatePostModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            draftIndex: 0,
            drafts: [],
            mediaModal: false,
            keyword: '',
            tagSearchData: INITIAL_TAG_SEARCH,
            textContentHeight: TEXT_INPUT_DEAFULT_HEIGHT,
            textInputHeight: TEXT_INPUT_DEAFULT_HEIGHT,
            draftHeaderHeight: 0,
        }
        this.onOpen = this.onOpen.bind(this)
        this.updateSearchRes = this.updateSearchRes.bind(this)
        this.handleTextInputSizeChange = this.handleTextInputSizeChange.bind(
            this
        )
    }

    componentDidMount() {
        if (this.props.onRef) this.props.onRef(this)
    }

    onOpen() {
        this.startTime = new Date()
        track(
            this.props.initializeFromState
                ? E.EDIT_POST_MODAL_OPENED
                : E.CREATE_POST_MODAL_OPENED
        )
        this.initializeForm()
        if (!this.isAttachGoalRequirementSatisfied())
            setTimeout(() => this.attachGoalModal.open(), 500)
    }

    /**
     * Tag related functions
     */
    onTaggingSuggestionTap(item, hidePanel, cursorPosition) {
        hidePanel()
        const { name } = item
        const { post, tags } = this.props

        const postCursorContent = post.slice(cursorPosition)
        const prevCursorContent = post.slice(0, cursorPosition)
        const content = prevCursorContent.slice(0, -this.state.keyword.length)
        const newContent = `${content}@${name} ${postCursorContent.replace(
            /^\s+/g,
            ''
        )}`
        // console.log(`${DEBUG_KEY}: keyword is: `, this.state.keyword);
        // console.log(`${DEBUG_KEY}: newContentText is: `, newContentText);
        this.props.change('post', newContent)

        const newContentTag = {
            user: item,
            startIndex: content.length, // `${comment}@${name} `
            endIndex: content.length + 1 + name.length, // `${comment}@${name} `
            tagReg: `\\B@${name}`,
            tagText: `@${name}`,
        }

        // Clean up tags position before comparing
        const newTags = clearTags(newContent, newContentTag, tags)

        // Check if this tags is already in the array
        const containsTag = newTags.some(
            (t) =>
                t.tagReg === `\\B@${name}` &&
                t.startIndex === content.length + 1
        )

        const needReplceOldTag = newTags.some(
            (t) => t.startIndex === content.length
        )

        // Update comment contentTags regex and contentTags
        if (!containsTag) {
            let newContentTags
            if (needReplceOldTag) {
                newContentTags = newTags.map((t) => {
                    if (t.startIndex === newContentTag.startIndex) {
                        return newContentTag
                    }
                    return t
                })
            } else {
                newContentTags = [...newTags, newContentTag]
            }
            // TODO: sort newContentTags by startIndex
            this.props.change(
                'tags',
                newContentTags.sort((a, b) => a.startIndex - b.startIndex)
            )
        }

        // Clear tag search data state
        this.setState({
            tagSearchData: INITIAL_TAG_SEARCH,
        })
    }

    // This is triggered when a trigger (@) is removed. Verify if all tags
    // are still valid.
    validateContentTags = (change) => {
        const { tags, post } = this.props
        const newContentTags = tags.filter((tag) => {
            const { startIndex, endIndex, tagText } = tag

            const actualTag = post.slice(startIndex, endIndex)
            // Verify if with the same startIndex and endIndex, we can still get the
            // tag. If not, then we remove the tag.
            return actualTag === tagText
        })
        change('tags', newContentTags)
    }

    updateSearchRes(res, searchContent) {
        if (searchContent !== this.state.keyword) return
        this.setState({
            // keyword,
            tagSearchData: {
                ...this.state.tagSearchData,
                skip: res.data.length, //TODO: new skip
                data: res.data,
                loading: false,
            },
        })
    }

    triggerCallback(keyword) {
        if (this.reqTimer) {
            clearTimeout(this.reqTimer)
        }

        this.reqTimer = setTimeout(() => {
            console.log(`${DEBUG_KEY}: requesting for keyword: `, keyword)
            this.setState({
                keyword,
                tagSearchData: {
                    ...this.state.tagSearchData,
                    loading: true,
                },
            })
            const { limit } = this.state.tagSearchData
            // Use the customized search if there is one
            if (this.props.tagSearch) {
                this.props.tagSearch(keyword, (res, searchContent) => {
                    this.updateSearchRes(res, searchContent)
                })
                return
            }

            this.props.searchUser(keyword, 0, limit, (res, searchContent) => {
                this.updateSearchRes(res, searchContent)
            })
        }, 150)
    }

    handleTagSearchLoadMore = () => {
        const { tagSearchData, keyword } = this.state
        const { skip, limit, data, loading } = tagSearchData

        // Disable load more if customized search is provided
        if (this.props.tagSearch) {
            return
        }

        if (loading) return
        this.setState({
            keyword,
            tagSearchData: {
                ...this.state.tagSearchData,
                loading: true,
            },
        })

        this.props.searchUser(keyword, skip, limit, (res) => {
            this.setState({
                keyword,
                tagSearchData: {
                    ...this.state.tagSearchData,
                    skip: skip + res.data.length, //TODO: new skip
                    data: arrayUnique([...data, ...res.data]),
                    loading: false,
                },
            })
        })
    }
    /* Tagging related function ends */

    initializeForm() {
        const { belongsToTribe, belongsToGoalStoryline } = this.props

        const defaulVals = {
            privacy: PRIVACY_FRIENDS,
            mediaRef: undefined,
            post: '',
            tags: [],
            belongsToTribe,
            belongsToGoalStoryline,
        }

        // Initialize based on the props, if it's opened through edit button
        const {
            initializeFromState,
            initializeFromGoal,
            initialPost,
        } = this.props
        console.log(initialPost)
        const initialVals =
            initializeFromState || initializeFromGoal
                ? postToFormAdapter(initialPost)
                : defaulVals

        this.props.initialize(initialVals)

        fetchPostDrafts(this.props.user._id).then((drafts) => {
            if (drafts && drafts.length > 0) {
                this.setState({
                    draftIndex: drafts.length,
                    drafts: drafts,
                })
            }
        })
    }

    resetForm() {
        const defaulVals = {
            privacy: PRIVACY_FRIENDS,
            mediaRef: undefined,
            post: '',
            tags: [],
            belongsToTribe: undefined,
            belongsToGoalStoryline: undefined,
        }
        this.props.initialize(defaulVals)

        const { drafts } = this.state
        if (drafts && drafts.length > 0) {
            this.setState({
                draftIndex: drafts.length,
                drafts: drafts,
            })
        }
    }

    handleOpenCamera = () => {
        this.props.openCamera((result) => {
            this.props.change('mediaRef', result.uri)
        })
    }

    handleOpenCameraRoll = () => {
        const callback = (result) => {
            this.props.change('mediaRef', result.uri)
        }
        this.props.openCameraRoll(callback, { disableEditing: true })
    }

    loadFromDraft = (selectedDraft, index) => {
        this.setState({ draftIndex: index })
        this.props.change(
            'mediaRef',
            selectedDraft.mediaRef ? selectedDraft.mediaRef : false
        )
        this.props.change('post', selectedDraft.post)
        this.props.change(
            'belongsToGoalStoryline',
            selectedDraft.belongsToGoalStoryline
        )
        this.props.change('privacy', selectedDraft.privacy)
        this.props.change('tags', selectedDraft.tags)
    }

    handleSaveDraft = async () => {
        const draft = {
            post: this.props.post,
            mediaRef: this.props.mediaRef,
            belongsToGoalStoryline: this.props.belongsToGoalStoryline,
            privacy: this.props.privacy,
            tags: this.props.tags,
        }

        let index = this.state.draftIndex
        let drafts = this.state.drafts

        if (index >= drafts.length) {
            drafts.push(draft)
            index = drafts.length - 1
        } else drafts[index] = draft

        await savePostDrafts(drafts, this.props.user._id)
            .then(() => {
                this.setState({
                    drafts: drafts,
                    draftIndex: index,
                })
            })
            .catch(this.handleDraftUpdateError)
    }

    handleDeleteDraft = async (index) => {
        let drafts = this.state.drafts

        if (index < drafts.length) {
            const { draftIndex } = this.state

            drafts.splice(index, 1)
            const newIndex =
                index === draftIndex
                    ? drafts.length
                    : index > draftIndex
                    ? draftIndex
                    : draftIndex - 1

            await savePostDrafts(drafts)
                .then(() => {
                    this.setState({
                        drafts: drafts,
                        draftIndex: newIndex,
                    })
                })
                .catch(this.handleDraftUpdateError)
        }
    }

    handleDraftUpdateError(error) {}

    isMediaNotUploaded() {
        const { initializeFromState, initialPost, mediaRef } = this.props
        return (
            (initializeFromState &&
                initialPost &&
                initialPost.mediaRef !== mediaRef) ||
            (!initializeFromState && mediaRef)
        )
    }

    /**
     * This is a hacky solution due to the fact that redux-form
     * handleSubmit values differ from the values actually stored.
     * NOTE:
     * Verify by comparing
     * console.log('handleSubmit passed in values are: ', values);
     * console.log('form state values: ', this.props.formVals);
     *
     * Synchronize validate form values, contains simple check
     */
    handleCreate = () => {
        // Delete from drafts
        this.handleDeleteDraft(this.state.draftIndex)

        const {
            initializeFromState,
            initialPost,
            belongsToTribe,
            belongsToEvent,
            openProfile,
        } = this.props

        const needUpload = this.isMediaNotUploaded()

        const needOpenProfile =
            belongsToTribe === undefined &&
            belongsToEvent === undefined &&
            (openProfile === undefined || openProfile === true) &&
            !initializeFromState

        const needRefreshProfile = openProfile === false

        const durationSec =
            (new Date().getTime() - this.startTime.getTime()) / 1000
        trackWithProperties(
            initializeFromState ? E.POST_UPDATED : E.POST_CREATED,
            {
                ...this.props.formVals.values,
                DurationSec: durationSec,
            }
        )
        const callback = (props) => {
            if (this.props.callBack) this.props.callBack(props)
            this.resetForm()
            this.close()
        }

        return this.props.submitCreatingPost(
            this.props.formVals.values,
            needUpload,
            {
                needOpenProfile, // Open user profile page and refresh the profile
                needRefreshProfile, // Only refresh the profile page with given tab and filter
                needRefreshTribeFeed: !!belongsToTribe,
                needRefreshMainFeed: !belongsToTribe,
            },
            initializeFromState,
            initialPost,
            callback,
            this.props.pageId
        )
    }

    handleCancel = (callback) => {
        const durationSec =
            (new Date().getTime() - this.startTime.getTime()) / 1000
        trackWithProperties(
            this.props.initializeFromState
                ? E.EDIT_POST_MODAL_CANCELLED
                : E.CREATE_POST_MODAL_CANCELLED,
            { DurationSec: durationSec }
        )
        this.handleDraftCancel(() => {
            if (callback) callback()
            // reset form vals
            this.resetForm()
        })
    }

    handleDraftCancel = (callback) => {
        const { post, mediaRef } = this.props
        // TODO: check if draft is already saved
        const draftSaved =
            ((!post || post.trim() === '') && !mediaRef) ||
            !this.isDraftNotSaved()

        if (draftSaved) return callback ? callback() : null

        Alert.alert(
            undefined,
            'Would you like to save this for later?',
            [
                {
                    text: 'Cancel',
                    onPress: () => {
                        this.bottomSheetRef.open()
                    },
                    style: 'cancel',
                },
                {
                    text: 'Discard',
                    onPress: () => {
                        if (callback) callback()
                    },
                },
                {
                    text: 'Save Draft',
                    onPress: () => this.handleSaveDraft().then(callback),
                },
            ],
            { cancelable: false }
        )
    }

    handleTextInputSizeChange({ nativeEvent }) {
        // Modal height needs to be adjusted when post text content size increases/decreases
        const height = nativeEvent.contentSize.height
        // At initialization bottomSheetRef.maskHeight can be null so we make a safe assumption
        const spaceAboveModal =
            this.bottomSheetRef && this.bottomSheetRef.maskHeight
                ? this.bottomSheetRef.maskHeight
                : TEXT_INPUT_DEAFULT_HEIGHT
        // this is to leave some space above modal for user to easily interact with modal
        const spaceAvailableAboveModal =
            spaceAboveModal - (IS_SMALL_PHONE ? 50 : 70)
        const heightChange = height - this.state.textContentHeight

        if (height > TEXT_INPUT_DEAFULT_HEIGHT) {
            // height increased
            if (heightChange > 0) {
                if (spaceAvailableAboveModal >= heightChange) {
                    this.setState({
                        textContentHeight: height,
                    })
                } else {
                    this.setState({
                        textContentHeight:
                            height - (heightChange - spaceAvailableAboveModal),
                    })
                }
            }
            // height decreased
            else {
                this.setState({
                    textContentHeight: height,
                })
            }
        } else {
            this.setState({
                textContentHeight: TEXT_INPUT_DEAFULT_HEIGHT,
            })
        }
    }

    renderTagSearchLoadingComponent(loading) {
        if (loading) {
            return (
                <View style={styles.activityIndicatorStyle}>
                    <ActivityIndicator />
                </View>
            )
        }
        return (
            <EmptyResult
                text={'No User Found'}
                textStyle={{ paddingTop: 15, height: 50 }}
            />
        )
    }

    /**
     * This is added on ms2 polish as a new way to render textinput for post
     */
    renderInput = (props) => {
        const {
            input: { value, onChange },
            editable,
            placeholder,
            loading,
            tagData,
            change,
            autoFocus,
        } = props
        const { tags } = this.props
        return (
            <View style={{ zIndex: 3, flex: 1 }}>
                <MentionsTextInput
                    autoFocus={autoFocus}
                    onRef={(r) => (this.textInput = r)}
                    textInputContainerStyle={styles.inputContainerStyle}
                    textInputStyle={{
                        ...styles.inputStyle,
                        height: this.state.textInputHeight,
                    }}
                    onContentSizeChange={this.handleTextInputSizeChange}
                    placeholder={placeholder}
                    onChangeText={(val) => onChange(val)}
                    editable={editable}
                    value={_.isEmpty(value) ? '' : value}
                    contentTags={tags || []}
                    contentTagsReg={tags ? tags.map((t) => t.tagReg) : []}
                    tagSearchRes={this.state.tagSearchData.data}
                    flexGrowDirection="bottom"
                    suggestionPosition="bottom"
                    validateTags={() => this.validateContentTags(change)}
                    autoCorrect
                    suggestionsPanelStyle={{ backgroundColor: '#f8f8f8' }}
                    loadingComponent={() =>
                        this.renderTagSearchLoadingComponent(loading)
                    }
                    trigger={'@'}
                    triggerLocation={'new-word-only'} // 'new-word-only', 'anywhere'
                    triggerCallback={(keyword) => this.triggerCallback(keyword)}
                    triggerLoadMore={this.handleTagSearchLoadMore.bind(this)}
                    renderSuggestionsRow={this.renderSuggestionsRow.bind(this)}
                    suggestionsData={tagData} // array of objects
                    keyExtractor={(item, index) => item._id}
                    suggestionRowHeight={50}
                    horizontal={false} // defaut is true, change the orientation of the list
                    MaxVisibleRowCount={4} // this is required if horizontal={false}
                />
            </View>
        )
    }

    /**
     * This is to render tagging suggestion row
     * @param hidePanel: lib passed in funct to close suggestion panel
     * @param item: suggestion item to render
     */
    renderSuggestionsRow({ item }, hidePanel, cursorPosition) {
        const { name } = item
        return (
            <TouchableOpacity
                onPress={() =>
                    this.onTaggingSuggestionTap(item, hidePanel, cursorPosition)
                }
                style={{
                    height: 50,
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'white',
                }}
            >
                <ProfileImage
                    imageContainerStyle={styles.imageContainerStyle}
                    imageUrl={getProfileImageOrDefaultFromUser(item)}
                    imageStyle={{ height: 30, width: 30 }}
                />
                <Text style={{ fontSize: 16, color: 'darkgray' }}>{name}</Text>
            </TouchableOpacity>
        )
    }

    // Current media type is only picture
    renderMedia() {
        const { mediaRef, uploading } = this.props
        let imageUrl = mediaRef

        if (!this.isMediaNotUploaded()) {
            // if nor stored locally image source must be from server
            imageUrl = `${IMAGE_BASE_URL}${mediaRef}`
        }

        // Do not render cancel button if editing post since we
        // don't allow editing image
        const cancelButton = this.isEditMediaDisabled() ? null : (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => this.props.change('mediaRef', false)}
                style={{ position: 'absolute', top: 10, left: 15 }}
                disabled={uploading}
            >
                <Image
                    source={cancel}
                    style={{ width: 15, height: 15, tintColor: '#fafafa' }}
                />
            </TouchableOpacity>
        )

        if (this.props.mediaRef) {
            return (
                <View
                    style={{
                        backgroundColor: 'gray',
                        borderRadius: 5,
                        flex: 1,
                    }}
                >
                    <ImageBackground
                        style={styles.mediaStyle}
                        source={{ uri: imageUrl }}
                        imageStyle={{
                            borderRadius: 8,
                            opacity: 0.7,
                            resizeMode: 'cover',
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => this.setState({ mediaModal: true })}
                            style={{ position: 'absolute', top: 10, right: 15 }}
                            disabled={uploading}
                        >
                            <Image
                                source={expand}
                                style={{
                                    width: 15,
                                    height: 15,
                                    tintColor: '#fafafa',
                                }}
                            />
                        </TouchableOpacity>
                        {cancelButton}
                    </ImageBackground>
                </View>
            )
        }
        return null
    }

    renderImageModal() {
        return (
            <ImageModal
                mediaRef={this.props.mediaRef}
                mediaModal={this.state.mediaModal}
                closeModal={() => this.setState({ mediaModal: false })}
                isLocalFile={this.isMediaNotUploaded()}
            />
        )
    }

    renderPost() {
        return (
            <Field
                name="post"
                label="post"
                component={this.renderInput}
                editable={!this.props.uploading}
                multiline
                placeholder="Got new updates for your goal or things in general?"
                loading={this.state.tagSearchData.loading}
                tagData={this.state.tagSearchData.data}
                keyword={this.state.keyword}
                change={(type, val) => this.props.change(type, val)}
                autoFocus={this.isAttachGoalRequirementSatisfied()}
            />
        )
    }

    isDraftNotSaved() {
        const {
            initializeFromState,
            post,
            mediaRef,
            belongsToGoalStoryline,
        } = this.props
        if (initializeFromState) return false
        const { drafts, draftIndex } = this.state
        if (
            drafts.length <= draftIndex ||
            post !== drafts[draftIndex].post ||
            mediaRef != drafts[draftIndex].mediaRef ||
            // post text or media needs to be there for belongsToGoalStoryline to be considered in this logic
            (((post && post.trim().length > 0) || mediaRef) &&
                _.get(belongsToGoalStoryline, 'goalRef', undefined) !==
                    _.get(
                        drafts[draftIndex].belongsToGoalStoryline,
                        'goalRef',
                        undefined
                    ))
        )
            return true
        return false
    }

    isEditMediaDisabled() {
        return (
            this.props.initializeFromState &&
            this.props.mediaRef &&
            !this.isMediaNotUploaded()
        )
    }

    isAttachGoalRequirementSatisfied = () => {
        const { attachGoalRequired, belongsToGoalStoryline } = this.props
        const isGoalAttached =
            belongsToGoalStoryline && !!belongsToGoalStoryline.goalRef
        return isGoalAttached || !attachGoalRequired
    }

    renderAttachGoalButton() {
        const {
            initializeFromState,
            initializeFromGoal,
            belongsToGoalStoryline,
            uploading,
            attachGoalRequired,
        } = this.props

        const isGoalAttached =
            belongsToGoalStoryline && !!belongsToGoalStoryline.goalRef
        // Do not allow user to change the attached goal if editing this update
        const disabled =
            uploading ||
            ((initializeFromState || initializeFromGoal) && isGoalAttached)

        const attachGoalButton = (
            <DelayedButton
                style={{ flexDirection: 'row' }}
                disabled={disabled}
                onPress={() => {
                    if (isGoalAttached && !attachGoalRequired) {
                        // Clear goalRef on Press of a goal is attached
                        this.props.change('belongsToGoalStoryline', false)
                    } else {
                        Keyboard.dismiss()
                        // Wait for keyboard to dissmiss before opening
                        if (this.attachGoalModal)
                            setTimeout(() => this.attachGoalModal.open(), 200)
                    }
                }}
            >
                {!isGoalAttached && (
                    <Icon
                        pack="material-community"
                        name="plus"
                        style={[
                            default_style.normalIcon_1,
                            { tintColor: '#BDBDBD' },
                        ]}
                    />
                )}
                <Text
                    style={[
                        default_style.normalText_2,
                        {
                            color: isGoalAttached ? 'white' : '#9A9A9A',
                            marginHorizontal: 3,
                            maxWidth: 123 * default_style.uiScale,
                        },
                    ]}
                    numberOfLines={1}
                >
                    {isGoalAttached
                        ? belongsToGoalStoryline.title
                        : 'Add to a Goal Storyline'}
                </Text>
                {!disabled && isGoalAttached && (
                    <Icon
                        pack="material-community"
                        name="close"
                        style={[
                            default_style.normalIcon_1,
                            { tintColor: 'white' },
                        ]}
                    />
                )}
            </DelayedButton>
        )
        const attachGoalButtonStyle = {
            backgroundColor: isGoalAttached
                ? color.GM_BLUE_DEEP
                : color.GM_CARD_BACKGROUND,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 3,
            paddingHorizontal: 6,
            borderColor: isGoalAttached ? color.GM_BLUE_DEEP : '#E8E8E8',
            borderWidth: 1,
            borderRadius: 2,
            marginLeft: 8,
        }

        return (
            <AttachGoal
                onRef={(ref) => (this.attachGoalModal = ref)}
                triggerDisabled={disabled}
                triggerComponent={attachGoalButton}
                triggerWrapperStyle={attachGoalButtonStyle}
                title="Select a goal to update"
                closeDisabled={!this.isAttachGoalRequirementSatisfied()}
                onSelect={(item) => {
                    this.props.change('belongsToGoalStoryline', {
                        goalRef: item._id,
                        title: item.title,
                    })
                    this.props.change('privacy', item.privacy)
                }}
                onClose={() => {
                    if (
                        !this.isAttachGoalRequirementSatisfied() &&
                        this.bottomSheetRef
                    )
                        this.bottomSheetRef.close()
                    else this.textInput && this.textInput.focus()
                }}
            />
        )
    }

    renderActionIcons(actionDisabled) {
        const saveDraftDisabled = actionDisabled || !this.isDraftNotSaved()
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <View style={{ flexDirection: 'row' }}>
                    <ViewableSettingMenu
                        privacy={this.props.privacy}
                        callback={R.curry((value) =>
                            this.props.change('privacy', value)
                        )}
                    />
                    {this.renderAttachGoalButton()}
                </View>
                <DelayedButton
                    activeOpacity={0.6}
                    style={{ padding: 2 }}
                    onPress={this.handleSaveDraft}
                    disabled={saveDraftDisabled}
                >
                    <Text
                        style={{
                            ...default_style.titleText_2,
                            color: saveDraftDisabled
                                ? color.GM_CARD_BACKGROUND
                                : color.GM_BLUE,
                        }}
                    >
                        Save Draft
                    </Text>
                </DelayedButton>
            </View>
        )
    }

    renderMediaIcons() {
        // If user already has the image, they need to delete the image and then
        // these icons would show up to attach another image
        const { uploading } = this.props
        const disabled = uploading || this.isEditMediaDisabled()

        const actionIconStyle = [
            default_style.buttonIcon_1,
            { color: '#E0E0E0' },
        ]
        const actionIconWrapperStyle = [
            styles.actionIconWrapperStyle,
            { opacity: disabled ? 0.6 : 1 },
        ]

        return (
            <View
                style={{
                    flexDirection: 'row',
                }}
            >
                {/* Camera Button */}
                <DelayedButton
                    touchableHighlight
                    underlayColor="gray"
                    style={actionIconWrapperStyle}
                    onPress={this.handleOpenCamera}
                    disabled={disabled}
                >
                    <Icon
                        name="camera"
                        pack="material-community"
                        style={actionIconStyle}
                    />
                </DelayedButton>
                {/* Media roll button */}
                <DelayedButton
                    touchableHighlight
                    underlayColor="gray"
                    style={actionIconWrapperStyle}
                    onPress={this.handleOpenCameraRoll}
                    disabled={disabled}
                >
                    <Icon
                        name="image-area"
                        pack="material-community"
                        style={actionIconStyle}
                    />
                </DelayedButton>
                {this.renderMedia()}
            </View>
        )
    }

    renderDraftsHeader() {
        return (
            <View
                onLayout={(e) =>
                    this.setState({
                        draftHeaderHeight: e.nativeEvent.layout.height,
                    })
                }
                style={styles.draftsHeader}
            >
                <Text
                    style={{
                        ...default_style.subTitleText_1,
                        color: '#D39F00',
                    }}
                >
                    {this.state.drafts.length} Draft
                    {this.state.drafts.length !== 1 ? 's' : ''}
                </Text>
                <DraftsView
                    drafts={this.state.drafts}
                    disabled={this.props.uploading}
                    onDelete={this.handleDeleteDraft}
                    onSelect={(index) => {
                        this.handleDraftCancel(() => {
                            const selectedDraft = this.state.drafts[index]
                            this.loadFromDraft(selectedDraft, index)
                            this.textInput && this.textInput.focus()
                        })
                    }}
                />
            </View>
        )
    }

    renderCreateButton(actionDisabled) {
        const modalActionText = this.props.initializeFromState
            ? 'Update'
            : 'Publish'

        return (
            <DelayedButton
                activeOpacity={0.6}
                style={{
                    backgroundColor: color.GM_BLUE,
                    marginHorizontal: 16,
                    marginVertical: 8,
                    padding: 8,
                    alignItems: 'center',
                    opacity: actionDisabled ? 0.5 : 1,
                }}
                onPress={this.props.handleSubmit(this.handleCreate)}
                disabled={actionDisabled}
            >
                <Text style={[default_style.buttonText_1, { color: 'white' }]}>
                    {modalActionText}
                </Text>
            </DelayedButton>
        )
    }

    open = () => this.bottomSheetRef && this.bottomSheetRef.open()

    close = () => this.bottomSheetRef && this.bottomSheetRef.close()

    render() {
        const {
            initializeFromState,
            initializeFromGoal,
            post,
            mediaRef,
            uploading,
            user,
        } = this.props
        const { profile } = user

        const actionDisabled =
            uploading ||
            ((!post || post.trim() === '') && !mediaRef) ||
            !this.isAttachGoalRequirementSatisfied()

        const showDraftHeader =
            !initializeFromState &&
            !initializeFromGoal &&
            this.state.drafts.length > 0

        const modalHeight =
            230 +
            this.state.textContentHeight +
            (showDraftHeader ? this.state.draftHeaderHeight : 0)

        return (
            <BottomSheet
                openDuration={200}
                ref={(r) => (this.bottomSheetRef = r)}
                height={modalHeight}
                onOpen={this.onOpen}
                onClose={(callback) => this.handleCancel(callback)}
                onPropsHeightChange={() =>
                    // once BottomSheet adjusts its height based on new textContentHeight
                    // CreatePostModal will adjust the height of it's textInput container
                    this.setState((state) => ({
                        textInputHeight: state.textContentHeight + 5,
                    }))
                }
                customStyles={{
                    container: {
                        flex: 1,
                        paddingHorizontal: 16,
                        paddingBotttom: 16,
                    },
                }}
                sheetFooter={this.renderCreateButton(actionDisabled)}
            >
                {showDraftHeader && this.renderDraftsHeader()}
                <View style={{ flexDirection: 'row', marginTop: 16 }}>
                    <ProfileImage
                        imageUrl={profile ? profile.image : undefined}
                    />
                    {this.renderPost()}
                </View>
                {this.renderActionIcons(actionDisabled)}
                {this.renderMediaIcons()}
                {this.renderImageModal()}
            </BottomSheet>
        )
    }
}

const styles = {
    inputContainerStyle: {
        marginLeft: 10,
        marginBotttom: 8,
    },
    draftsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF8E3',
        borderColor: '#D39F00',
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    inputStyle: {
        ...default_style.subTitleText_1,
        marginRight: 32,
    },
    mediaStyle: {
        height: 74,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionIconWrapperStyle: {
        flexDirection: 'row',
        backgroundColor: '#4F4F4F',
        height: 100,
        width: 110,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginRight: 8,
        marginTop: 12,
    },
    userImageContainerStyle: {
        borderWidth: 0.5,
        borderColor: 'lightgray',
        alignItems: 'center',
        borderRadius: 100,
        alignSelf: 'flex-start',
        backgroundColor: 'white',
    },
    imageContainerStyle: {
        alignItems: 'center',
        borderRadius: 3,
        alignSelf: 'center',
        backgroundColor: 'white',
        marginLeft: 10,
        marginRight: 10,
        margin: 5,
    },
    activityIndicatorStyle: {
        flex: 1,
        height: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
}

CreatePostModal = reduxForm({
    form: 'createPostModal',
    enableReinitialize: true,
})(CreatePostModal)

const mapStateToProps = (state, props) => {
    const selector = formValueSelector('createPostModal')

    const { user } = state.user
    const { myGoals } = state.goals

    const { data, refreshing, loading, filter } = myGoals

    const { profile } = user

    return {
        user,
        profile,
        privacy: selector(state, 'privacy'),
        belongsToGoalStoryline: selector(state, 'belongsToGoalStoryline'),
        post: selector(state, 'post'),
        tags: selector(state, 'tags'),
        mediaRef: selector(state, 'mediaRef'),
        formVals: state.form.createPostModal,
        uploading: state.posts.newPost.uploading,
        data,
        refreshing,
        loading,
        filter,
    }
}

export default connect(mapStateToProps, {
    searchUser,
    openCameraRoll,
    openCamera,
    submitCreatingPost,
})(CreatePostModal)
