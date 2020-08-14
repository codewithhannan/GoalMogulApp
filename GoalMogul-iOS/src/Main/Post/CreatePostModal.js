/** @format */

import React, { Component } from 'react'
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    ImageBackground,
    ActivityIndicator,
} from 'react-native'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import _ from 'lodash'
import R from 'ramda'
import { Actions } from 'react-native-router-flux'

/* Components */
import ViewableSettingMenu from '../Goal/ViewableSettingMenu'
import ImageModal from '../Common/ImageModal'
import EmptyResult from '../Common/Text/EmptyResult'
import ProfileImage from '../Common/ProfileImage'
import MentionsTextInput from '../Goal/Common/MentionsTextInput'
import DelayedButton from '../Common/Button/DelayedButton'
import { actionSheet, switchByButtonIndex } from '../Common/ActionSheetFactory'

// assets
import defaultUserProfile from '../../asset/utils/defaultUserProfile.png'
import cancel from '../../asset/utils/cancel_no_background.png'
import imageOverlay from '../../asset/utils/imageOverlay.png'
import expand from '../../asset/utils/expand.png'

// Utils
import { arrayUnique, clearTags } from '../../redux/middleware/utils'
import {
    track,
    trackWithProperties,
    EVENT as E,
} from '../../monitoring/segment'

// Actions
import { openCameraRoll, openCamera, getPhotosAsync } from '../../actions'
import {
    submitCreatingPost,
    postToFormAdapter,
    fetchPostDrafts,
    savePostDrafts,
} from '../../redux/modules/feed/post/PostActions'
import { searchUser } from '../../redux/modules/search/SearchActions'
import { IMAGE_BASE_URL, PRIVACY_FRIENDS } from '../../Utils/Constants'
import { default_style, color } from '../../styles/basic'
import DraftsView from './DraftsView'
import BottomSheet from '../Common/Modal/BottomSheet'
import { Icon } from '@ui-kitten/components'

const DEBUG_KEY = '[ UI CreatePostModal ]'
const INITIAL_TAG_SEARCH = {
    data: [],
    skip: 0,
    limit: 10,
    loading: false,
}
const ON_CANCEL_OPTIONS = ['Save Draft', 'Discard', 'Cancel']
const ON_CANCEL_CANCEL_INDEX = 2

class CreatePostModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            draftIndex: 0,
            drafts: [],
            mediaModal: false,
            keyword: '',
            tagSearchData: { ...INITIAL_TAG_SEARCH },
        }
        this.updateSearchRes = this.updateSearchRes.bind(this)
    }

    componentDidMount() {
        if (this.props.onRef) this.props.onRef(this)
        this.startTime = new Date()
        track(
            this.props.initializeFromState
                ? E.EDIT_POST_MODAL_OPENED
                : E.CREATE_POST_MODAL_OPENED
        )
        this.initializeForm()
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
            ...this.state,
            tagSearchData: { ...INITIAL_TAG_SEARCH },
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
            ...this.state,
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
                ...this.state,
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
            ...this.state,
            keyword,
            tagSearchData: {
                ...this.state.tagSearchData,
                loading: true,
            },
        })

        this.props.searchUser(keyword, skip, limit, (res) => {
            this.setState({
                ...this.state,
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
        const { belongsToTribe, belongsToEvent } = this.props
        const defaulVals = {
            viewableSetting: PRIVACY_FRIENDS,
            mediaRef: undefined,
            post: '',
            tags: [],
            belongsToTribe,
            belongsToEvent,
        }

        // Initialize based on the props, if it's opened through edit button
        const { initializeFromState, initialPost } = this.props
        const initialVals = initializeFromState
            ? { ...postToFormAdapter(initialPost) }
            : { ...defaulVals }

        this.props.initialize({
            ...initialVals,
        })

        fetchPostDrafts().then((drafts) => {
            if (drafts && drafts.length > 0) {
                this.setState({
                    draftIndex: drafts.length,
                    drafts: drafts,
                })
            }
        })
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

    handleSaveDraft = async () => {
        const draft = {
            post: this.props.post,
            mediaRef: this.props.mediaRef,
        }

        let index = this.state.draftIndex
        let drafts = this.state.drafts

        if (index >= drafts.length) {
            drafts.push(draft)
            index = drafts.length - 1
        } else drafts[index] = draft

        await savePostDrafts(drafts)
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
            mediaRef,
            belongsToTribe,
            belongsToEvent,
            openProfile,
        } = this.props

        const needUpload =
            (initializeFromState &&
                initialPost.mediaRef &&
                initialPost.mediaRef !== mediaRef) ||
            (!initializeFromState && mediaRef)

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

        return this.props.submitCreatingPost(
            this.props.formVals.values,
            needUpload,
            {
                needOpenProfile, // Open user profile page and refresh the profile
                needRefreshProfile, // Only refresh the profile page with given tab and filter
            },
            initializeFromState,
            initialPost,
            this.props.callback,
            this.props.pageId
        )
    }

    handleCancel = () => {
        const durationSec =
            (new Date().getTime() - this.startTime.getTime()) / 1000
        trackWithProperties(
            this.props.initializeFromState
                ? E.EDIT_POST_MODAL_CANCELLED
                : E.CREATE_POST_MODAL_CANCELLED,
            { DurationSec: durationSec }
        )
        this.handleDraftCancel(() => {
            if (this.props.onClose) this.props.onClose()
            Actions.pop()
        })
    }

    handleDraftCancel = (callback) => {
        const { post, mediaRef } = this.props
        // TODO: check if draft is already saved
        const draftSaved =
            ((!post || post.trim() === '') && !mediaRef) ||
            !this.isSaveDraftDisabled()

        if (draftSaved) return callback ? callback() : null

        const onCancelSwitchCases = switchByButtonIndex([
            [
                R.equals(0),
                () => {
                    this.handleSaveDraft().then(callback)
                },
            ],
            [
                R.equals(1),
                () => {
                    if (callback) callback()
                },
            ],
        ])
        const onCancelActionSheet = actionSheet(
            ON_CANCEL_OPTIONS,
            ON_CANCEL_CANCEL_INDEX,
            onCancelSwitchCases
        )
        return onCancelActionSheet()
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
        } = props

        const { tags } = this.props

        return (
            <View style={{ zIndex: 3, flex: 1 }}>
                <MentionsTextInput
                    onRef={(r) => (this.textInput = r)}
                    placeholder={placeholder}
                    onChangeText={(val) => onChange(val)}
                    editable={editable}
                    value={_.isEmpty(value) ? '' : value}
                    contentTags={tags || []}
                    contentTagsReg={tags ? tags.map((t) => t.tagReg) : []}
                    tagSearchRes={this.state.tagSearchData.data}
                    flexGrowDirection="bottom"
                    suggestionPosition="bottom"
                    textInputContainerStyle={styles.inputContainerStyle}
                    textInputStyle={styles.inputStyle}
                    validateTags={() => this.validateContentTags(change)}
                    autoCorrect
                    suggestionsPanelStyle={{ backgroundColor: '#f8f8f8' }}
                    loadingComponent={() =>
                        this.renderTagSearchLoadingComponent(loading)
                    }
                    textInputMinHeight={80}
                    textInputMaxHeight={200}
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
        const { name, profile } = item
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
                    imageUrl={
                        profile && profile.image ? profile.image : undefined
                    }
                    imageStyle={{ height: 31, width: 30, borderRadius: 3 }}
                    defaultImageSource={defaultUserProfile}
                />
                <Text style={{ fontSize: 16, color: 'darkgray' }}>{name}</Text>
            </TouchableOpacity>
        )
    }

    renderUserInfo() {
        const { belongsToTribe, belongsToEvent, user } = this.props
        const { profile, name } = user

        const callback = R.curry((value) =>
            this.props.change('viewableSetting', value)
        )

        return (
            <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                <ProfileImage imageUrl={profile ? profile.image : undefined} />
                <View
                    style={{
                        flexDirection: 'column',
                        marginLeft: 12,
                        marginTop: 0,
                    }}
                >
                    <Text
                        style={{
                            ...default_style.titleText_2,
                            marginBottom: 2,
                        }}
                    >
                        {name}
                    </Text>
                    <ViewableSettingMenu
                        viewableSetting={this.props.viewableSetting}
                        callback={callback}
                    />
                </View>
            </View>
        )
    }

    // Current media type is only picture
    renderMedia() {
        const { initializeFromState, post, mediaRef } = this.props
        let imageUrl = mediaRef
        if (initializeFromState && mediaRef) {
            const hasImageModified = post.mediaRef && post.mediaRef !== mediaRef
            if (!hasImageModified) {
                // If editing a tribe and image hasn't changed, then image source should
                // be from server
                imageUrl = `${IMAGE_BASE_URL}${mediaRef}`
            }
        }

        // Do not render cancel button if editing since we
        // don't allow editing image
        const cancelButton = initializeFromState ? null : (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => this.props.change('mediaRef', false)}
                style={{ position: 'absolute', top: 10, left: 15 }}
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
                        marginTop: 8,
                        backgroundColor: 'gray',
                        borderRadius: 8,
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
                        <View
                            style={{
                                alignSelf: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Image
                                source={imageOverlay}
                                style={{
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    height: 45,
                                    width: 50,
                                    tintColor: '#fafafa',
                                }}
                            />
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => this.setState({ mediaModal: true })}
                            style={{ position: 'absolute', top: 10, right: 15 }}
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
        const { initializeFromState, initialPost, mediaRef } = this.props

        // This is not a local file if
        // this is an edit and mediaRef has not changed yet
        return (
            <ImageModal
                mediaRef={this.props.mediaRef}
                mediaModal={this.state.mediaModal}
                closeModal={() => this.setState({ mediaModal: false })}
                isLocalFile={
                    !(
                        initializeFromState &&
                        initialPost.mediaRef &&
                        initialPost.mediaRef === mediaRef
                    )
                }
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
            />
        )
    }

    isSaveDraftDisabled() {
        if (this.props.initializeFromState) return false
        const { drafts, draftIndex } = this.state
        if (
            drafts.length <= draftIndex ||
            this.props.post !== drafts[draftIndex].post ||
            this.props.mediaRef != drafts[draftIndex].mediaRef
        )
            return true
        return false
    }

    renderActionIcons() {
        // If user already has the image, they need to delete the image and then
        // these icons would show up to attach another image
        const { uploading } = this.props
        const actionIconStyle = [
            default_style.buttonIcon_1,
            { color: '#E0E0E0' },
        ]
        const actionIconWrapperStyle = styles.actionIconWrapperStyle

        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: 10,
                }}
            >
                <DelayedButton
                    activeOpacity={0.6}
                    style={actionIconWrapperStyle}
                    onPress={this.handleOpenCamera}
                    disabled={uploading}
                >
                    <Icon
                        name="camera"
                        pack="material-community"
                        style={actionIconStyle}
                    />
                </DelayedButton>
                <DelayedButton
                    activeOpacity={0.6}
                    style={{ ...actionIconWrapperStyle, marginLeft: 8 }}
                    onPress={this.handleOpenCameraRoll}
                    disabled={uploading}
                >
                    <Icon
                        name="image-area"
                        pack="material-community"
                        style={actionIconStyle}
                    />
                </DelayedButton>
            </View>
        )
    }

    renderDraftsHeader() {
        return (
            <View style={styles.draftsHeader}>
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
                    onDelete={this.handleDeleteDraft}
                    onSelect={(index) => {
                        this.handleDraftCancel(() => {
                            const selectedDraft = this.state.drafts[index]
                            this.setState({ draftIndex: index })
                            this.props.change(
                                'mediaRef',
                                selectedDraft.mediaRef
                                    ? selectedDraft.mediaRef
                                    : null
                            )
                            this.props.change('post', selectedDraft.post)
                        })
                    }}
                />
            </View>
        )
    }

    open = () => this.bottomSheetRef.open()

    close = () => this.bottomSheetRef.close()

    render() {
        const {
            handleSubmit,
            initializeFromState,
            post,
            mediaRef,
            uploading,
            user,
            viewableSetting,
        } = this.props
        const modalActionText = initializeFromState ? 'Update' : 'Publish'
        const actionDisabled =
            uploading || ((!post || post.trim() === '') && !mediaRef)
        const saveDraftDisabled = actionDisabled || !this.isSaveDraftDisabled()
        const { profile } = user

        return (
            <BottomSheet
                fullScreenGesturesEnabled
                ref={(r) => (this.bottomSheetRef = r)}
                height={330}
                onOpen={() => {
                    this.textInput && this.textInput.focus()
                }}
                customStyles={{ container: { flex: 1, padding: 16 } }}
                sheetFooter={
                    <DelayedButton
                        style={{
                            backgroundColor: color.GM_BLUE,
                            marginHorizontal: 16,
                            marginVertical: 8,
                            padding: 8,
                            alignItems: 'center',
                        }}
                        onPress={handleSubmit(this.handleCreate)}
                        disabled={actionDisabled}
                    >
                        <Text
                            style={[
                                default_style.buttonText_1,
                                { color: 'white' },
                            ]}
                        >
                            {modalActionText}
                        </Text>
                    </DelayedButton>
                }
            >
                {!initializeFromState &&
                    this.state.drafts.length > 0 &&
                    this.renderDraftsHeader()}
                <View style={{ flexDirection: 'row' }}>
                    <ProfileImage
                        imageUrl={profile ? profile.image : undefined}
                    />
                    {this.renderPost()}
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <ViewableSettingMenu
                        viewableSetting={viewableSetting}
                        callback={R.curry((value) =>
                            this.props.change('viewableSetting', value)
                        )}
                    />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <DelayedButton
                        activeOpacity={0.6}
                        style={{ marginTop: 8, padding: 2 }}
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
                {this.renderActionIcons()}
                {this.renderImageModal()}
            </BottomSheet>
        )
    }
}

const styles = {
    inputContainerStyle: {
        marginLeft: 10,
        minHeight: 100,
        paddingBotttom: 8,
    },
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.5,
    },
    draftsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF8E3',
        borderColor: '#D39F00',
        borderWidth: 1,
        padding: 12,
    },
    inputStyle: default_style.subTitleText_1,
    titleTextStyle: {
        ...default_style.smallTitle_1,
        padding: 2,
    },
    mediaStyle: {
        height: 150 * default_style.uiScale,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionIconWrapperStyle: {
        flexDirection: 'row',
        backgroundColor: '#4F4F4F',
        height: 74,
        width: 74,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
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
        borderWidth: 0.5,
        padding: 1,
        borderColor: 'lightgray',
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

const mapStateToProps = (state) => {
    const selector = formValueSelector('createPostModal')
    const { user } = state.user
    const { profile } = user

    return {
        user,
        profile,
        viewableSetting: selector(state, 'viewableSetting'),
        post: selector(state, 'post'),
        tags: selector(state, 'tags'),
        mediaRef: selector(state, 'mediaRef'),
        formVals: state.form.createPostModal,
        uploading: state.posts.newPost.uploading,
    }
}

export default connect(mapStateToProps, {
    searchUser,
    openCameraRoll,
    openCamera,
    submitCreatingPost,
})(CreatePostModal)
