/** @format */

import _ from 'lodash'
import R from 'ramda'
import React from 'react'
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { Field, formValueSelector, reduxForm } from 'redux-form'
// Assets
import defaultUserProfile from '../../asset/utils/defaultUserProfile.png'
// Utils
import {
    arrayUnique,
    clearTags,
    switchCase,
    getProfileImageOrDefaultFromUser,
} from '../../redux/middleware/utils'
// Actions
import {
    cancelShare,
    submitShare,
} from '../../redux/modules/feed/post/ShareActions'
import {
    searchEventParticipants,
    searchTribeMember,
    searchUser,
} from '../../redux/modules/search/SearchActions'
import {
    IMAGE_BASE_URL,
    PRIVACY_FRIENDS,
    PRIVACY_PUBLIC,
} from '../../Utils/Constants'
// Components
import ModalHeader from '../Common/Header/ModalHeader'
import ProfileImage from '../Common/ProfileImage'
import RefPreview from '../Common/RefPreview'
import EmptyResult from '../Common/Text/EmptyResult'
import MentionsTextInput from '../Goal/Common/MentionsTextInput'
import ViewableSettingMenu from '../Goal/ViewableSettingMenu'

// Constants
const DEBUG_KEY = '[ UI ShareModal ]'
const maxHeight = 200
const INITIAL_TAG_SEARCH = {
    data: [],
    skip: 0,
    limit: 10,
    loading: false,
}

const TAG_SEARCH_OPTIONS = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['name'],
}

class ShareModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            height: 34,
            keyword: '',
            tagSearchData: { ...INITIAL_TAG_SEARCH },
        }
        this.updateSearchRes = this.updateSearchRes.bind(this)
    }

    componentDidMount() {
        this.initializeForm()
    }

    /**
     * Tag related functions
     */
    onTaggingSuggestionTap(item, hidePanel, cursorPosition) {
        hidePanel()
        const { name } = item
        const { content, tags } = this.props

        const postCursorContent = content.slice(cursorPosition)
        const prevCursorContent = content.slice(0, cursorPosition)
        const prevTagContent = prevCursorContent.slice(
            0,
            -this.state.keyword.length
        )
        const newContent = `${prevTagContent}@${name} ${postCursorContent.replace(
            /^\s+/g,
            ''
        )}`
        // console.log(`${DEBUG_KEY}: keyword is: `, this.state.keyword);
        this.props.change('content', newContent)

        const newContentTag = {
            user: item,
            startIndex: prevTagContent.length, // `${comment}@${name} `
            endIndex: prevTagContent.length + 1 + name.length, // `${comment}@${name} `
            tagReg: `\\B@${name}`,
            tagText: `@${name}`,
        }

        // Clean up tags position before comparing
        const newTags = clearTags(newContent, newContentTag, tags)

        // Check if this tags is already in the array
        const containsTag = newTags.some(
            (t) =>
                t.tagReg === `\\B@${name}` &&
                t.startIndex === prevTagContent.length + 1
        )

        const needReplceOldTag = newTags.some(
            (t) => t.startIndex === prevTagContent.length
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
        const { tags, content } = this.props
        const newContentTags = tags.filter((tag) => {
            const { startIndex, endIndex, tagText } = tag

            const actualTag = content.slice(startIndex, endIndex)
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
            const { shareTo } = this.props
            const { name, item } = shareTo

            if (name === 'Event') {
                const { _id } = item // Search using eventId
                this.props.searchEventParticipants(
                    keyword,
                    _id,
                    0,
                    10,
                    (res, searchContent) => {
                        this.updateSearchRes(res, searchContent)
                    }
                )
                return
            }

            if (name === 'Tribe') {
                const { _id } = item // Search using tribeId
                this.props.searchTribeMember(
                    keyword,
                    _id,
                    0,
                    10,
                    (res, searchContent) => {
                        this.updateSearchRes(res, searchContent)
                    }
                )
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
        if (this.tagSearch) return

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
        this.props.initialize({
            privacy: PRIVACY_PUBLIC,
            tags: [],
        })
    }

    handleCreate = (values) => {
        this.props.submitShare(this.props.formVals.values, this.props.callback)
    }

    updateSize = (height) => {
        console.log('new height is: ', height)
        this.setState({
            height: Math.min(height, maxHeight),
        })
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
                    imageStyle={{ height: 31, width: 30 }}
                />
                <Text style={{ fontSize: 16, color: 'darkgray' }}>{name}</Text>
            </TouchableOpacity>
        )
    }

    renderInput = ({
        input: { onChange, value },
        editable,
        placeholder,
        loading,
        tagData,
        change,
    }) => {
        const { tags } = this.props
        return (
            <View style={{ zIndex: 3 }}>
                <MentionsTextInput
                    placeholder={placeholder}
                    onChangeText={(val) => onChange(val)}
                    editable={editable}
                    value={_.isEmpty(value) ? '' : value}
                    contentTags={tags || []}
                    contentTagsReg={tags ? tags.map((t) => t.tagReg) : []}
                    tagSearchRes={this.state.tagSearchData.data}
                    flexGrowDirection="bottom"
                    suggestionPosition="bottom"
                    textInputContainerStyle={{ ...styles.inputContainerStyle }}
                    textInputStyle={styles.inputStyle}
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
                    keyExtractor={(item) => item._id}
                    suggestionRowHeight={50}
                    horizontal={false} // defaut is true, change the orientation of the list
                    MaxVisibleRowCount={4} // this is required if horizontal={false}
                />
            </View>
        )
    }

    // Render user info
    renderUserInfo(user) {
        const name = user && user.name ? user.name : 'Jordan Gardner'

        const callback = R.curry((value) => this.props.change('privacy', value))

        return (
            <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                <ProfileImage
                    imageUrl={getProfileImageOrDefaultFromUser(user)}
                    imageStyle={styles.imageStyle}
                />
                <View style={{ flexDirection: 'column', marginLeft: 15 }}>
                    <Text style={{ fontSize: 18, marginBottom: 8 }}>
                        {name}
                    </Text>
                    <ViewableSettingMenu
                        privacy={this.props.privacy}
                        callback={callback}
                        handleOnClick={() => {
                            Alert.alert(
                                'Public Permission',
                                'This share has to be public to share to a Tribe'
                            )
                        }}
                    />
                </View>
            </View>
        )
    }

    renderContentHeader(shareTo) {
        const { item, name } = shareTo

        const { shareToBasicTextStyle } = styles
        // If share to event or tribe, item must not be null
        if (!item && name !== 'Feed') return null

        // Select the item namef
        let nameToRender = ''
        if (name === 'Tribe') nameToRender = item.name
        if (name === 'Event') nameToRender = item.title

        const basicText = name === 'Feed' ? 'To' : `To ${name} `

        const shareToComponent = switchCase({
            Feed: (
                <Text
                    style={{
                        paddingLeft: 0,
                        paddingTop: 5,
                        paddingBottom: 5,
                        fontSize: 12,
                        fontWeight: '600',
                    }}
                >
                    Feed
                </Text>
            ),
            Tribe: (
                <ShareToComponent
                    name={nameToRender}
                    onPress={() => Actions.push('searchTribeLightBox')}
                />
            ),
            Event: (
                <ShareToComponent
                    name={nameToRender}
                    onPress={() => Actions.push('searchEventLightBox')}
                />
            ),
        })('Feed')(name)

        return (
            <View
                style={{
                    marginTop: 10,
                    marginLeft: 10,
                    marginRight: 10,
                    flexDirection: 'row',
                    width: 200,
                }}
            >
                <Text style={shareToBasicTextStyle}>{basicText}</Text>
                {shareToComponent}
            </View>
        )
    }

    renderPost() {
        return (
            <View style={{ marginTop: 10 }}>
                <Field
                    name="content"
                    label=""
                    component={this.renderInput}
                    editable={!this.props.uploading}
                    numberOfLines={10}
                    style={styles.goalInputStyle}
                    placeholder="Say something about this share"
                    loading={this.state.tagSearchData.loading}
                    tagData={this.state.tagSearchData.data}
                    keyword={this.state.keyword}
                    change={(type, val) => this.props.change(type, val)}
                />
            </View>
        )
    }

    render() {
        // NOTE: currently there is postType passed in to ShareModal
        const {
            handleSubmit,
            errors,
            user,
            shareTo,
            itemToShare,
            postType,
        } = this.props
        const modalTitle =
            shareTo.name !== 'feed'
                ? `Share to ${shareTo.name}`
                : 'Share to Feed'
        return (
            <KeyboardAvoidingView
                behavior="padding"
                style={{ flex: 1, backgroundColor: '#ffffff' }}
            >
                <ModalHeader
                    title={modalTitle}
                    actionText="Share"
                    onCancel={() => this.props.cancelShare()}
                    onAction={handleSubmit(this.handleCreate)}
                />
                <ScrollView
                    style={{ borderTopColor: '#e9e9e9', borderTopWidth: 1 }}
                >
                    <View style={{ flex: 1, padding: 20 }}>
                        {this.renderUserInfo(user)}
                        {this.renderContentHeader(shareTo)}
                        {this.renderPost()}
                        <RefPreview
                            item={itemToShare}
                            postType={postType}
                            disabled
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

const mapStateToProps = (state, props) => {
    const selector = formValueSelector('shareModal')
    const { user } = state.user
    const { itemToShare, postType } = state.newShare

    return {
        user,
        shareTo: getShareTo(state),
        privacy: selector(state, 'privacy'),
        tags: selector(state, 'tags'),
        content: selector(state, 'content'),
        itemToShare,
        postType,
        formVals: state.form.shareModal,
        uploading: state.newShare.uploading,
    }
}

const getShareTo = (state) => {
    const {
        belongsToTribe,
        belongsToEvent,
        belongsToTribeItem,
        belongsToEventItem,
    } = state.newShare

    let destination = {
        name: 'Feed',
    }
    if (belongsToTribe && belongsToTribeItem) {
        console.log('tribe item is: ', belongsToTribeItem)
        destination = {
            name: 'Tribe',
            item: belongsToTribeItem,
        }
    }
    if (belongsToEvent && belongsToEventItem) {
        destination = {
            name: 'Event',
            item: belongsToEventItem,
        }
    }
    return destination
}

const ShareToComponent = (props) => {
    const { name, onPress } = props
    return (
        <TouchableOpacity
            activeOpacity={0.6}
            style={styles.shareToContainerStyler}
            onPress={onPress}
        >
            <Text
                style={styles.shareToTextStyle}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {name}
            </Text>
        </TouchableOpacity>
    )
}

const styles = {
    imageStyle: {
        height: 54,
        width: 54,
    },
    inputStyle: {
        paddingTop: 6,
        paddingBottom: 6,
        padding: 13,
        backgroundColor: 'white',
        borderRadius: 22,
        maxHeight: 120,
        maxHeight: 200,
        minHeight: 80,
    },
    inputContainerStyle: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderBottomWidth: 0.5,
        margin: 5,
        borderColor: 'lightgray',
    },
    shareToBasicTextStyle: {
        fontSize: 12,
        padding: 5,
    },
    shareToTextStyle: {
        fontSize: 12,
        fontWeight: '600',
        flexWrap: 'wrap',
        flex: 1,
    },
    shareToContainerStyler: {
        backgroundColor: 'lightgray',
        borderRadius: 4,
        maxWidth: 200,
        padding: 5,
    },
    imageContainerStyle: {
        alignItems: 'center',
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

ShareModal = reduxForm({
    form: 'shareModal',
    enableReinitialize: true,
})(ShareModal)

export default connect(mapStateToProps, {
    cancelShare,
    submitShare,
    searchUser,
    searchTribeMember,
    searchEventParticipants,
})(ShareModal)
