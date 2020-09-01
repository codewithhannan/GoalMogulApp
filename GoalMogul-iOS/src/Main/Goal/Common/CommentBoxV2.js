/** @format */

// This is new implementation of CommentBox to include tagging
import _ from 'lodash'
import R from 'ramda'
import React, { Component } from 'react'
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Keyboard,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { connect } from 'react-redux'
import { openCamera, openCameraRoll } from '../../../actions'
// Actions
import {
    createComment,
    createSuggestion,
    newCommentOnMediaRefChange,
    newCommentOnTagsChange,
    newCommentOnTagsRegChange,
    newCommentOnTextChange,
    openCurrentSuggestion,
    postComment,
    removeSuggestion,
} from '../../../redux/modules/feed/comment/CommentActions'
import { searchUser } from '../../../redux/modules/search/SearchActions'
// Selectors
import { getNewCommentByTab } from '../../../redux/modules/feed/comment/CommentSelector'

// Utils
import {
    arrayUnique,
    clearTags,
    getProfileImageOrDefaultFromUser,
} from '../../../redux/middleware/utils'
import { default_style } from '../../../styles/basic'

// Assets
import PhotoIcon from '../../../asset/utils/cameraRoll.png'
import LightBulb from '../../../asset/utils/makeSuggestion.png'
// Components
import MentionsTextInput from './MentionsTextInput'
import {
    actionSheet,
    switchByButtonIndex,
} from '../../Common/ActionSheetFactory'
import EmptyResult from '../../Common/Text/EmptyResult'
import SuggestionPreview, {
    RemoveComponent,
} from '../GoalDetailCard/SuggestionPreview'
import DelayedButton from '../../Common/Button/DelayedButton'
import ProfileImage from '../../Common/ProfileImage'

// Consts
const maxHeight = 120
const { height, width } = Dimensions.get('window')
const DEBUG_KEY = '[ UI CommentBoxV2 ]'

const INITIAL_TAG_SEARCH = {
    data: [],
    skip: 0,
    limit: 10,
    loading: false,
}

const DEFAULT_WRITE_COMMENT_PLACEHOLDER = 'Write a Comment...'
const DEFAULT_REPLY_TO_PLACEHOLDER = 'Reply to...'

class CommentBoxV2 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newValue: '',
            height: 34,
            defaultValue: DEFAULT_WRITE_COMMENT_PLACEHOLDER,
            keyword: '',
            tagSearchData: { ...INITIAL_TAG_SEARCH },
            testTaggingSuggestionData: [
                {
                    name: 'Jay Patel',
                    _id: '123',
                },
                {
                    name: 'Jia Zeng',
                    _id: '1234',
                },
            ],
            // position: 'absolute'
        }
        this.updateSearchRes = this.updateSearchRes.bind(this)
        this.focus = this.focus.bind(this)
        this.focus = this.focus.bind(this)
        this.handleOnSubmitEditing = this.handleOnSubmitEditing.bind(this)
        this.renderLoadingComponent = this.renderLoadingComponent.bind(this)
    }

    componentDidMount() {
        if (this.props.onRef) this.props.onRef(this)

        this.setState({
            defaultValue: this.props.isReplyCommentBox
                ? DEFAULT_REPLY_TO_PLACEHOLDER
                : DEFAULT_WRITE_COMMENT_PLACEHOLDER,
        })
    }

    componentWillUnmount() {
        if (this.reqTimer) {
            clearTimeout(this.reqTimer)
        }
    }

    onTaggingSuggestionTap(item, hidePanel, cursorPosition) {
        hidePanel()
        const { name } = item
        const { pageId, newComment } = this.props
        const { contentText, contentTags } = newComment

        const postCursorContent = contentText.slice(cursorPosition)
        const prevCursorContent = contentText.slice(0, cursorPosition)
        const comment = prevCursorContent.slice(0, -this.state.keyword.length)
        const newContentText = `${comment}@${name} ${postCursorContent.replace(
            /^\s+/g,
            ''
        )}`

        this.props.newCommentOnTextChange(newContentText, pageId)

        const newContentTag = {
            user: item,
            startIndex: comment.length, // `${comment}@${name} `
            endIndex: comment.length + 1 + name.length, // `${comment}@${name} `
            tagReg: `\\B@${name}`,
            tagText: `@${name}`,
        }

        // Clean up tags position before comparing
        const newTags = clearTags(newContentText, newContentTag, contentTags)

        // Check if this tags is already in the array
        const containsTag = newTags.some(
            (t) =>
                t.tagReg === `\\B@${name}` &&
                t.startIndex === comment.length + 1
        )

        const needReplceOldTag = newTags.some(
            (t) => t.startIndex === comment.length
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

            this.props.newCommentOnTagsChange(
                newContentTags.sort((a, b) => a.startIndex - b.startIndex),
                pageId
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
    validateContentTags = () => {
        const { pageId, newComment } = this.props
        const { contentText, contentTags } = newComment
        const newContentTags = contentTags.filter((tag) => {
            const { startIndex, endIndex, tagText } = tag

            const actualTag = contentText.slice(startIndex, endIndex)
            // Verify if with the same startIndex and endIndex, we can still get the
            // tag. If not, then we remove the tag.
            return actualTag === tagText
        })
        this.props.newCommentOnTagsChange(newContentTags, pageId)
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

    callback(keyword) {
        if (this.reqTimer) {
            clearTimeout(this.reqTimer)
        }

        this.reqTimer = setTimeout(() => {
            // TODO: send search request
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
            this.props.searchUser(keyword, 0, limit, (res, searchContent) => {
                this.updateSearchRes(res, searchContent)
            })
        }, 150)
    }

    handleTagSearchLoadMore = () => {
        const { tagSearchData, keyword } = this.state
        const { skip, limit, data, loading } = tagSearchData

        if (loading) return
        this.setState({
            ...this.state,
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

    handleOnPost = (uploading) => {
        // Ensure we only create comment once
        if (uploading) return
        this.props.postComment(this.props.pageId, this.props.onPost)
    }

    handleOpenCamera = () => {
        this.props.openCamera((result) => {
            this.props.newCommentOnMediaRefChange(result.uri, this.props.pageId)
        })
    }

    handleOpenCameraRoll = () => {
        const callback = R.curry((result) => {
            this.props.newCommentOnMediaRefChange(result.uri, this.props.pageId)
        })
        this.props.openCameraRoll(callback, { disableEditing: true })
    }

    /**
     * Open IOS menu to show two options ['Open Camera Roll', 'Take photo']
     * When image icon on the comment box is clicked
     */
    handleImageIconOnClick = () => {
        const mediaRefCases = switchByButtonIndex([
            [
                R.equals(0),
                () => {
                    this.handleOpenCameraRoll()
                },
            ],
            [
                R.equals(1),
                () => {
                    this.handleOpenCamera()
                },
            ],
        ])

        const addMediaRefActionSheet = actionSheet(
            ['Open Camera Roll', 'Take Photo', 'Cancel'],
            2,
            mediaRefCases
        )
        return addMediaRefActionSheet()
    }

    handleOnBlur = (newComment) => {
        console.log(`${DEBUG_KEY}: [ handleOnBlur ]`)
        const { resetCommentType, onSubmitEditing } = this.props
        const { contentText } = newComment
        // On Blur if no content then set default value to comment the goal / post
        if (!contentText || contentText === '' || contentText.trim() === '') {
            this.setState({
                ...this.state,
                defaultValue: this.props.isReplyCommentBox
                    ? DEFAULT_REPLY_TO_PLACEHOLDER
                    : DEFAULT_WRITE_COMMENT_PLACEHOLDER,
            })
            if (resetCommentType) {
                resetCommentType()
            }
            if (onSubmitEditing) {
                onSubmitEditing()
            }
        }
    }

    /**
     * NOTE: this function might not be called by TextInput somehow.
     */
    handleOnSubmitEditing = (newComment) => {
        const { onSubmitEditing } = this.props
        if (onSubmitEditing) {
            onSubmitEditing()
        }
        this.handleOnBlur(newComment)
    }

    focus() {
        if (this.textInput) this.textInput.focus()
    }

    updateSize = (height) => {
        this.setState({
            height: Math.min(height, maxHeight),
        })
    }

    //tintColor: '#f5d573'
    renderSuggestionIcon(newComment, pageId, goalId) {
        const { mediaRef, commentType } = newComment
        const disableButton = mediaRef !== undefined && mediaRef !== ''
        if (commentType === 'Reply') return null

        return (
            <DelayedButton
                activeOpacity={0.6}
                onPress={() => {
                    console.log('suggestion on click in comment box')
                    Keyboard.dismiss()
                    this.props.createSuggestion(goalId, pageId)
                }}
                disabled={disableButton}
            >
                <Image
                    source={LightBulb}
                    style={{ ...styles.iconStyle, tintColor: '' }}
                />
            </DelayedButton>
        )
    }

    renderLeftIcons(newComment, pageId, hasSuggestion, goalId) {
        const suggestionIcon = hasSuggestion
            ? this.renderSuggestionIcon(newComment, pageId, goalId)
            : null
        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginLeft: 5,
                    marginRight: 5,
                }}
            >
                {suggestionIcon}
                {this.renderImageIcon(newComment)}
            </View>
        )
    }

    renderImageIcon(newComment) {
        const { commentType } = newComment
        // Disable image icon if there is a valid suggestion
        const disableButton = commentType === 'Suggestion'
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={this.handleImageIconOnClick}
                disabled={disableButton}
            >
                <Image
                    source={PhotoIcon}
                    style={{
                        ...styles.iconStyle,
                        tintColor: '#cbd6d8',
                    }}
                />
            </TouchableOpacity>
        )
    }

    renderMedia(newComment) {
        const { mediaRef } = newComment
        if (!mediaRef) return null
        const onPress = () => {}
        const onRemove = () =>
            this.props.newCommentOnMediaRefChange(undefined, this.props.pageId)

        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.mediaContainerStyle}
                onPress={onPress}
            >
                <ProfileImage
                    imageStyle={{ width: 50, height: 50, borderRadius: 0 }}
                    imageUrl={mediaRef}
                    imageContainerStyle={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                />
                <View
                    style={{
                        flex: 1,
                        marginLeft: 12,
                        marginRight: 12,
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={styles.headingTextStyle}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        Attached image
                    </Text>
                </View>
                <RemoveComponent onRemove={onRemove} />
            </TouchableOpacity>
        )
    }

    renderPost(newComment) {
        const { uploading, contentText, commentType, mediaRef } = newComment
        // console.log(`${DEBUG_KEY}: new comment is: `, newComment);

        const isInValidComment =
            (commentType === 'Comment' || commentType === 'Reply') &&
            (!contentText || contentText === '' || contentText.trim() === '') &&
            mediaRef === undefined

        const isValidSuggestion = validSuggestion(newComment)

        // console.log(`${DEBUG_KEY}: invalid comment: `, isInValidComment);
        // console.log(`${DEBUG_KEY}: comment is: `, newComment);
        // const disable = uploading ||
        //   ((contentText === undefined || contentText === '' || contentText.trim() === '')
        //   && _.isEmpty(tmpSuggestion) && _.isEmpty(suggestion));
        const disable = uploading || isInValidComment || !isValidSuggestion

        const color = disable ? '#cbd6d8' : '#17B3EC'
        return (
            <DelayedButton
                activeOpacity={0.6}
                onPress={() => this.handleOnPost(uploading)}
                disabled={disable}
            >
                <Text
                    style={{
                        ...default_style.titleText_2,
                        color,
                        padding: 13,
                        letterSpacing: 0.5,
                        paddingBottom: 15,
                    }}
                >
                    Post
                </Text>
            </DelayedButton>
        )
    }

    renderSuggestionPreview(newComment, pageId) {
        const { showAttachedSuggestion, suggestion, uploading } = newComment

        if (showAttachedSuggestion) {
            return (
                <SuggestionPreview
                    item={suggestion}
                    onRemove={() => {
                        this.props.removeSuggestion(pageId)
                    }}
                    onPress={() => {
                        this.props.openCurrentSuggestion(pageId)
                    }}
                    uploading={uploading}
                />
            )
        }

        return null
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
                    borderTopColor: '#F2F2F2',
                    borderTopWidth: 0.5,
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

    renderLoadingComponent() {
        if (this.state.tagSearchData.loading) {
            return (
                <View
                    style={{
                        flex: 1,
                        height: 50,
                        width,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
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

    render() {
        const { pageId, newComment, hasSuggestion, goalId } = this.props
        console.log(`${DEBUG_KEY}: new comment in commentbox: `, newComment)

        if (!newComment || !newComment.parentRef) return null
        const { uploading } = newComment

        const inputContainerStyle = styles.inputContainerStyle
        const inputStyle = uploading
            ? {
                  ...styles.inputStyle,
                  color: '#b9c3c4',
              }
            : styles.inputStyle

        return (
            <MentionsTextInput
                ref={(r) => (this.textInput = r)}
                placeholder={this.state.defaultValue}
                onChangeText={(val) =>
                    this.props.newCommentOnTextChange(val, pageId)
                }
                editable={!uploading}
                maxHeight={maxHeight}
                multiline
                value={newComment.contentText}
                contentTags={newComment.contentTags}
                contentTagsReg={newComment.contentTags.map((t) => t.tagReg)}
                tagSearchRes={this.state.tagSearchData.data}
                defaultValue={this.state.defaultValue}
                onBlur={() => this.handleOnBlur(newComment)}
                onSubmitEditing={() => this.handleOnSubmitEditing(newComment)}
                renderSuggestionPreview={() =>
                    this.renderSuggestionPreview(newComment, pageId)
                }
                renderMedia={() => this.renderMedia(newComment)}
                renderLeftIcons={() =>
                    this.renderLeftIcons(
                        newComment,
                        pageId,
                        hasSuggestion,
                        goalId
                    )
                }
                renderPost={() => this.renderPost(newComment)}
                textInputContainerStyle={inputContainerStyle}
                textInputStyle={inputStyle}
                validateTags={() => this.validateContentTags()}
                suggestionsPanelStyle={{
                    backgroundColor: 'rgba(100,100,100,0.1)',
                }}
                loadingComponent={this.renderLoadingComponent}
                trigger={'@'}
                triggerLocation={'new-word-only'} // 'new-word-only', 'anywhere'
                triggerCallback={this.callback.bind(this)}
                triggerLoadMore={this.handleTagSearchLoadMore}
                renderSuggestionsRow={this.renderSuggestionsRow.bind(this)}
                suggestionsData={this.state.tagSearchData.data} // array of objects
                keyExtractor={(item) => item._id}
                suggestionRowHeight={50}
                horizontal={false} // defaut is true, change the orientation of the list
                MaxVisibleRowCount={7} // this is required if horizontal={false}
            />
        )
    }
}

const validSuggestion = (newComment) => {
    const { commentType, suggestion } = newComment
    if (commentType === 'Comment' || commentType === 'Reply') return true
    if (isInvalidObject(suggestion)) return false
    const {
        suggestionFor,
        suggestionForRef,
        suggestionType,
        suggestionText,
        suggestionLink,
        selectedItem,
    } = suggestion
    // console.log(`${DEBUG_KEY}: suggestion is:`, suggestion);
    if (
        isInvalidObject(suggestionFor) ||
        isInvalidObject(suggestionForRef) ||
        isInvalidObject(suggestionType)
    ) {
        return false
    }

    if (suggestionType !== 'Custom' && isInvalidObject(selectedItem)) {
        return false
    }

    if (suggestionType === 'Custom') {
        if (
            isInvalidObject(suggestionText) ||
            isInvalidObject(suggestionLink)
        ) {
            return false
        }
    }
    return true
}

export const isInvalidObject = (o) => {
    if (o === null) return true
    if (typeof o === 'object') {
        return _.isEmpty(o) || o === undefined
    }
    if (typeof o === 'string') {
        return o === '' || o.trim() === ''
    }
    return false
}

const styles = {
    inputContainerStyle: {
        justifyContent: 'center',
        borderRadius: 18,
        borderColor: '#F1F1F1',
        borderWidth: 1,
        flex: 1,
    },
    inputStyle: {
        ...default_style.normalText_1,
        minHeight: 30 * default_style.uiScale,
        maxHeight: 80 * default_style.uiScale,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: 'white',
        borderRadius: 22,
    },
    iconStyle: {
        ...default_style.buttonIcon_1,
        margin: 4,
    },
    // Media preview styles
    mediaContainerStyle: {
        flexDirection: 'row',
        height: 50,
        borderColor: '#cacaca',
        borderTopWidth: 0.5,
        backgroundColor: '#fff',
    },
    imageContainerStyle: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
        margin: 4,
        marginHorizontal: 12,
    },
    headingTextStyle: {
        fontSize: 13,
        color: '#666',
    },
}

const mapStateToProps = (state, props) => {
    return {
        newComment: getNewCommentByTab(state, props.pageId),
    }
}

export default connect(mapStateToProps, {
    searchUser,
    createComment,
    newCommentOnTextChange,
    openCurrentSuggestion,
    removeSuggestion,
    createSuggestion,
    postComment,
    openCamera,
    openCameraRoll,
    newCommentOnMediaRefChange,
    newCommentOnTagsRegChange,
    newCommentOnTagsChange,
})(CommentBoxV2)
