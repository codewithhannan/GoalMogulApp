/** @format */

import React, { Component } from 'react'
import {
    View,
    TextInput,
    Text,
    SafeAreaView,
    Image,
    TouchableOpacity,
    Keyboard,
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import R from 'ramda'

// Components
import SuggestionPreview, {
    RemoveComponent,
} from '../GoalDetailCard/SuggestionPreview'
import ProfileImage from '../../Common/ProfileImage'
import {
    actionSheet,
    switchByButtonIndex,
} from '../../Common/ActionSheetFactory'

// Actions
import {
    newCommentOnTextChange,
    openCurrentSuggestion,
    removeSuggestion,
    createSuggestion,
    postComment,
    newCommentOnMediaRefChange,
} from '../../../redux/modules/feed/comment/CommentActions'

import { isInvalidObject } from './CommentBoxV2'

import { openCamera, openCameraRoll } from '../../../actions'

// Selectors
import { getNewCommentByTab } from '../../../redux/modules/feed/comment/CommentSelector'

// Assets
import PhotoIcon from '../../../asset/utils/cameraRoll.png'
import LightBulb from '../../../asset/utils/makeSuggestion.png'

// Consts
const maxHeight = 120
const DEBUG_KEY = '[ UI CommentBox ]'

class CommentBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newValue: '',
            height: 34,
            defaultValue: 'Write a Comment...',
            // position: 'absolute'
        }
    }

    componentDidMount() {
        if (this.props.onRef !== null) {
            this.props.onRef(this)
        }
        this.setState({
            ...this.state,
            defaultValue: 'Write a Comment...',
        })
    }

    handleOnPost = (uploading) => {
        // Ensure we only create comment once
        if (uploading) return
        this.props.postComment(this.props.pageId)
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
        const { resetCommentType } = this.props
        const { contentText, tmpSuggestion } = newComment
        // On Blur if no content then set default value to comment the goal / post
        if (
            contentText === undefined ||
            contentText === '' ||
            contentText.trim() === ''
        ) {
            this.setState({
                ...this.state,
                defaultValue: 'Write a Comment...',
            })
            if (resetCommentType) {
                resetCommentType()
            }
        }
    }

    handleOnSubmitEditing = (newComment) => {
        const { onSubmitEditing } = this.props
        if (onSubmitEditing) onSubmitEditing()
        this.handleOnBlur(newComment)
    }

    focus() {
        this.refs['textInput'].focus()
        this.setState({
            ...this.state,
            defaultValue: 'Reply to...',
        })
    }

    focus() {
        this.refs['textInput'].focus()
    }

    updateSize = (height) => {
        this.setState({
            height: Math.min(height, maxHeight),
        })
    }

    //tintColor: '#f5d573'
    renderSuggestionIcon(newComment, pageId) {
        const { mediaRef, commentType } = newComment
        const disableButton = mediaRef !== undefined && mediaRef !== ''
        if (commentType === 'Reply') return null

        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.iconContainerStyle}
                onPress={() => {
                    console.log('suggestion on click in comment box')
                    Keyboard.dismiss()
                    this.props.createSuggestion(pageId)
                }}
                disabled={disableButton}
            >
                <Image
                    source={LightBulb}
                    style={{
                        height: 28,
                        width: 28,
                        margin: 4,
                    }}
                />
            </TouchableOpacity>
        )
    }

    renderLeftIcons(newComment, pageId, hasSuggestion) {
        const suggestionIcon = hasSuggestion
            ? this.renderSuggestionIcon(newComment, pageId)
            : null
        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginLeft: 5,
                    marginRight: 5,
                    marginBottom: 5,
                }}
            >
                {suggestionIcon}
                {this.renderImageIcon(newComment)}
            </View>
        )
    }

    renderImageIcon(newComment) {
        const { suggestion } = newComment
        const disableButton =
            suggestion !== undefined && suggestion.suggestionFor !== undefined
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.iconContainerStyle}
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
        const onPress = () => console.log('Media on Pressed')
        const onRemove = () =>
            this.props.newCommentOnMediaRefChange(undefined, this.props.pageId)

        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.mediaContainerStyle}
                onPress={onPress}
            >
                <ProfileImage
                    imageStyle={{ width: 50, height: 50 }}
                    defaultImageSource={{ uri: mediaRef }}
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
        const {
            uploading,
            contentText,
            tmpSuggestion,
            commentType,
            mediaRef,
        } = newComment

        // This is old and buggy implementation
        // const disable = uploading ||
        //   ((contentText === undefined || contentText === '' || contentText.trim() === '')
        //   && _.isEmpty(tmpSuggestion));

        const isInValidComment =
            (commentType === 'Comment' || commentType === 'Reply') &&
            (contentText === undefined ||
                contentText === '' ||
                contentText.trim() === '') &&
            mediaRef === undefined

        const isValidSuggestion = validSuggestion(newComment)

        // console.log(`${DEBUG_KEY}: invalid comment: `, isInValidComment);
        // console.log(`${DEBUG_KEY}: comment is: `, newComment);
        const disable = uploading || isInValidComment || !isValidSuggestion

        const color = disable ? '#cbd6d8' : '#17B3EC'
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.postContainerStyle}
                onPress={() => this.handleOnPost(uploading)}
                disabled={disable}
            >
                <Text
                    style={{
                        color,
                        fontSize: 14,
                        fontWeight: '700',
                        padding: 13,
                        letterSpacing: 0.5,
                    }}
                >
                    Post
                </Text>
            </TouchableOpacity>
        )
    }

    renderSuggestionPreview() {
        const { pageId, newComment } = this.props
        const { showAttachedSuggestion, suggestion } = newComment

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
                />
            )
        }

        return null
    }

    render() {
        const { pageId, newComment, hasSuggestion } = this.props
        if (!newComment || !newComment.parentRef) return null

        const { uploading } = newComment

        const inputContainerStyle = {
            ...styles.inputContainerStyle,
            // height: Math.max(36, height + 6)
        }

        const inputStyle = {
            ...styles.inputStyle,
            // height: Math.max(30, height)
        }

        return (
            // SafeAreaView and View should have the same effect
            <SafeAreaView
                style={{
                    backgroundColor: 'white',
                    shadowColor: 'black',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.7,
                    shadowRadius: 1,
                    elevation: 0.5,
                }}
            >
                {this.renderSuggestionPreview()}
                {this.renderMedia(newComment)}
                <View style={{ flexDirection: 'row' }}>
                    {this.renderLeftIcons(newComment, pageId, hasSuggestion)}
                    <View style={inputContainerStyle}>
                        <TextInput
                            ref="textInput"
                            placeholder={this.state.defaultValue}
                            onChangeText={(val) =>
                                this.props.newCommentOnTextChange(val, pageId)
                            }
                            style={inputStyle}
                            editable={!uploading}
                            maxHeight={maxHeight}
                            autoCorrect
                            multiline
                            value={newComment.contentText}
                            defaultValue={this.state.defaultValue}
                            onBlur={() => this.handleOnBlur(newComment)}
                            onSubmitEditing={() =>
                                this.handleOnSubmitEditing(newComment)
                            }
                        />
                    </View>
                    {this.renderPost(newComment)}
                </View>
            </SafeAreaView>
        )
    }
}
// onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}

const styles = {
    inputContainerStyle: {
        justifyContent: 'center',
        borderRadius: 18,
        marginTop: 5,
        marginBottom: 5,
        // borderColor: '#cbd6d8',
        borderColor: '#F1F1F1',
        borderWidth: 1,
        flex: 1,
    },
    inputStyle: {
        paddingTop: 7,
        paddingBottom: 7,
        padding: 13,
        backgroundColor: 'white',
        borderRadius: 22,
    },
    postContainerStyle: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    iconStyle: {
        height: 24,
        width: 24,
        margin: 5,
    },
    iconContainerStyle: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    // Media preview styles
    mediaContainerStyle: {
        flexDirection: 'row',
        height: 50,
        marginBottom: 8,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 1,
        elevation: 1,
    },
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
            isInvalidObject(suggestionText) &&
            isInvalidObject(suggestionLink)
        ) {
            return false
        }
    }
    return true
}

const mapStateToProps = (state, props) => {
    return {
        newComment: getNewCommentByTab(state, props.pageId),
    }
}

export default connect(mapStateToProps, {
    newCommentOnTextChange,
    openCurrentSuggestion,
    removeSuggestion,
    createSuggestion,
    postComment,
    openCamera,
    openCameraRoll,
    newCommentOnMediaRefChange,
})(CommentBox)
