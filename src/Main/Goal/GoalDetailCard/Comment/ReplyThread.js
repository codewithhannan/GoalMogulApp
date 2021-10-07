/**
 * This component functions similar to reply threads in Slack
 * required props:
 *  @param itemId: id of comment that the thread belongs to
 *  @param entityId: id of goal/post that the thread belongs to
 *  @param pageId: id of page that the thread was spawned from
 *
 * @format
 * */

import React from 'react'
import {
    View,
    FlatList,
    TouchableWithoutFeedback,
    ImageBackground,
    TouchableOpacity,
    Image,
    Animated,
    Keyboard,
    KeyboardAvoidingView,
} from 'react-native'
import _ from 'lodash'
import { MenuProvider } from 'react-native-popup-menu'
import { connect } from 'react-redux'
import timeago from 'timeago.js'

// Components
import ModalHeader from '../../../Common/Header/ModalHeader'
import Headline from '../../Common/Headline'
import Timestamp from '../../Common/Timestamp'
import ImageModal from '../../../Common/ImageModal'
import RichText from '../../../Common/Text/RichText'
import CommentRef from './CommentRef'
import CommentBox from '../../Common/CommentBoxV2'

// Actions
import { openPostDetail } from '../../../../redux/modules/feed/post/PostActions'

import {
    createComment,
    createEmptyComment,
    updateNewComment,
} from '../../../../redux/modules/feed/comment/CommentActions'
import {
    makeGetRepliesById,
    getNewCommentByTab,
} from '../../../../redux/modules/feed/comment/CommentSelector'

// Assets
import { default_style, color } from '../../../../styles/basic'
import ProfileImage from '../../../Common/ProfileImage'
import { IMAGE_BASE_URL } from '../../../../Utils/Constants'
import expand from '../../../../asset/utils/expand.png'
import ChildCommentCard from './ChildCommentCard'
import { Icon } from '@ui-kitten/components'
import { Text } from 'react-native-animatable'
import LikeListModal from '../../../Common/Modal/LikeListModal'
import { Actions } from 'react-native-router-flux'
import { getProfileImageOrDefaultFromUser } from '../../../../redux/middleware/utils'
import DelayedButton from '../../../Common/Button/DelayedButton'

const DEBUG_KEY = '[ UI CommentCard ]'

class ReplyThread extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mediaModal: false,
            showCommentLikeList: false,
            likeListParentId: undefined,
            likeListParentType: undefined,
            savedComment: props.newComment,
            commentBoxHeight: 80,
            initScroll: true,
        }
        this.contentBottomPadding = new Animated.Value(0)
        this.openCommentLikeList = this.openCommentLikeList.bind(this)
        this.closeCommentLikeList = this.closeCommentLikeList.bind(this)

        this.onCommentBoxLayout = this.onCommentBoxLayout.bind(this)
        this.clearCommentBox = this.clearCommentBox.bind(this)
        this.renderItem = this.renderItem.bind(this)
    }

    componentDidMount() {
        this.keyboardWillShowListener = Keyboard.addListener(
            'keyboardWillShow',
            this.keyboardWillShow
        )
        this.keyboardWillHideListener = Keyboard.addListener(
            'keyboardWillHide',
            this.keyboardWillHide
        )
        this.clearCommentBox()
        if (this.props.initScrollToComment && this.state.initScroll) {
            this.setState({ initScroll: false })
            const parentCommentIndex = this.props.item.childComments.findIndex(
                (c) => c._id === this.props.initScrollToComment
            )
            setTimeout(() => this.scrollToIndex(parentCommentIndex), 300)
        }
        if (this.props.focusCommentBox)
            setTimeout(() => this.commentBox.focus(), 500)
    }

    componentWillUnmount() {
        // This is second tome resetCommentBox is called because sometimes
        // due to auto correct text persists from reply thread as comment boxes are
        // using same redux area
        this.keyboardWillShowListener.remove()
        this.keyboardWillHideListener.remove()
        this.resetCommentBox()
    }

    keyboardWillShow = (e) => {
        Animated.timing(this.contentBottomPadding, {
            useNativeDriver: false,
            toValue: e.endCoordinates.height,
            duration: e.duration,
        }).start()
    }

    keyboardWillHide = (e) => {
        Animated.timing(this.contentBottomPadding, {
            useNativeDriver: false,
            toValue: 0,
            duration: e.duration,
        }).start()
    }

    resetCommentBox = () => {
        const { savedComment } = this.state
        const { newComment, pageId } = this.props
        if (!newComment && !savedComment) return
        this.props.createEmptyComment(
            savedComment || {
                commentType: 'Comment',
                replyToRef: undefined,
                parentType: newComment.parentType,
                parentRef: newComment.parentRef,
                owner: newComment.owner,
            },
            pageId
        )
    }

    openCommentLikeList = (likeListParentType, likeListParentId) => {
        this.setState({
            showCommentLikeList: true,
            likeListParentType,
            likeListParentId,
        })
    }

    closeCommentLikeList = () => {
        this.setState({
            showCommentLikeList: false,
            likeListParentId: undefined,
            likeListParentType: undefined,
        })
    }

    clearCommentBox = () => {
        const { newComment, itemId, pageId } = this.props

        if (!newComment) return
        this.props.createEmptyComment(
            {
                commentType: 'Reply',
                replyToRef: itemId,
                parentType: newComment.parentType,
                parentRef: newComment.parentRef,
                owner: newComment.owner,
            },
            pageId
        )
    }

    scrollToIndex = (index, viewOffset = 0, animated = true) => {
        if (this.flatList)
            this.flatList.scrollToIndex({
                index,
                animated,
                viewPosition: 1,
                viewOffset,
            })
    }

    /**
     * Render Image user attached to the comment.
     * Comment type should be "commentType": "Comment"
     * @param {commentObject} item
     */
    renderCommentMedia(item) {
        const { mediaRef } = item
        if (!mediaRef) return null

        const url = mediaRef
        const imageUrl = `${IMAGE_BASE_URL}${url}`
        return (
            <TouchableWithoutFeedback
                onPress={() => this.setState({ mediaModal: true })}
            >
                <View style={{ marginTop: 10 }}>
                    <ImageBackground
                        style={{
                            height: 100,
                            borderRadius: 8,
                            backgroundColor: 'black',
                        }}
                        source={{ uri: imageUrl }}
                        imageStyle={{
                            borderRadius: 8,
                            opacity: 0.8,
                            resizeMode: 'cover',
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => this.setState({ mediaModal: true })}
                            style={{
                                position: 'absolute',
                                top: 10,
                                right: 15,
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                                padding: 2,
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Image
                                source={expand}
                                style={{
                                    width: 16,
                                    height: 16,
                                    tintColor: '#fafafa',
                                    borderRadius: 4,
                                }}
                            />
                        </TouchableOpacity>
                    </ImageBackground>
                    <ImageModal
                        mediaRef={imageUrl}
                        mediaModal={this.state.mediaModal}
                        closeModal={() => this.setState({ mediaModal: false })}
                    />
                </View>
            </TouchableWithoutFeedback>
        )
    }

    renderTextContent(item) {
        let text
        let tags = []
        let links = []
        if (
            item.commentType === 'Suggestion' &&
            item.suggestion &&
            item.suggestion.suggestionType === 'Link'
        ) {
            text =
                item.suggestion && item.suggestion.suggestionText
                    ? item.suggestion.suggestionText
                    : ''
        } else {
            text = item.content.text
            tags = item.content.tags
            links = item.content.links
        }

        return (
            <RichText
                contentText={text}
                contentTags={tags}
                contentLinks={links}
                textStyle={{
                    flexWrap: 'wrap',
                    ...default_style.normalText_1,
                }}
                multiline
                onUserTagPressed={(user) => {
                    console.log(`${DEBUG_KEY}: user tag press for user: `, user)
                    let userId = user
                    if (typeof user !== 'string') {
                        userId = user._id
                    }
                    this.props.openProfile(userId)
                }}
            />
        )
    }

    renderCommentRef({ suggestion, owner }) {
        return <CommentRef item={suggestion} owner={owner} />
    }

    renderStatus() {
        const { likeCount, childComments, _id } = this.props.item
        const commentCount = childComments.length
        console.log(typeof likeCount)

        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: '#F2F2F2',
                    padding: 10,
                    paddingLeft: 16,
                    paddingRight: 16,
                }}
            >
                <DelayedButton
                    onPress={() => this.openCommentLikeList('Comment', _id)}
                    activeOpacity={0.6}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                    <Icon
                        pack="material-community"
                        style={[
                            default_style.normalIcon_1,
                            {
                                tintColor: color.GM_RED,
                                marginRight: 4,
                            },
                        ]}
                        name={'heart'}
                    />
                    <Text style={default_style.normalText_1}>
                        {likeCount || 0}
                    </Text>
                </DelayedButton>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 16,
                    }}
                >
                    <Icon
                        pack="material-community"
                        style={[
                            default_style.normalIcon_1,
                            { tintColor: color.GM_YELLOW, marginRight: 4 },
                        ]}
                        name="message"
                    />
                    <Text style={default_style.normalText_1}>
                        {commentCount}
                    </Text>
                </View>
            </View>
        )
    }

    renderHeader() {
        const { item } = this.props
        const { owner, created } = item

        const timeStamp =
            created === undefined || created.length === 0 ? new Date() : created

        return (
            <View>
                <View
                    style={{
                        padding: 16,
                    }}
                    onLayout={(e) => {
                        this.commentCardHeight = e.nativeEvent.layout.height
                    }}
                >
                    <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                        <ProfileImage
                            userId={owner._id}
                            imageUrl={getProfileImageOrDefaultFromUser(owner)}
                        />
                        <View style={{ marginLeft: 12, marginTop: 2 }}>
                            <Headline
                                name={owner.name || ''}
                                user={owner}
                                hasCaret={false}
                                textStyle={default_style.titleText_2}
                            />
                            <View style={{ marginTop: 2 }} />
                            <Timestamp time={timeago().format(timeStamp)} />
                        </View>
                    </View>
                    {this.renderTextContent(item)}
                    {this.renderCommentMedia(item)}
                    {this.renderCommentRef(item)}
                </View>
                {this.renderStatus()}
            </View>
        )
    }

    renderItem({ item }) {
        return (
            <View style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 8 }}>
                <ChildCommentCard
                    item={item}
                    pageId={this.props.pageId}
                    parentCommentId={this.props.item._id}
                    userId={this.props.userId}
                    openCommentLikeList={this.openCommentLikeList}
                />
            </View>
        )
    }

    onCommentBoxLayout({ nativeEvent }) {
        this.setState({
            commentBoxHeight: nativeEvent.layout.height,
        })
    }

    render() {
        const { item } = this.props
        if (!item) return <ModalHeader back />
        const { childComments } = item
        return (
            <MenuProvider skipInstanceCheck={true}>
                <LikeListModal
                    isVisible={this.state.showCommentLikeList}
                    closeModal={this.closeCommentLikeList}
                    parentId={this.state.likeListParentId}
                    parentType={this.state.likeListParentType}
                    clearDataOnHide
                />
                <ModalHeader
                    onCancel={() => {
                        // reset comment box redux area on close
                        this.resetCommentBox()
                        Actions.pop()
                    }}
                    back
                />
                <KeyboardAvoidingView
                    style={{
                        paddingBottom: this.state.commentBoxHeight,
                        flex: 1,
                    }}
                    behavior={'height'}
                >
                    <FlatList
                        ref={(ref) => (this.flatList = ref)}
                        ListHeaderComponent={this.renderHeader()}
                        data={childComments}
                        renderItem={this.renderItem}
                    />
                </KeyboardAvoidingView>
                <Animated.View
                    style={[
                        styles.composerContainer,
                        {
                            paddingBottom: this.contentBottomPadding,
                        },
                    ]}
                >
                    <View onLayout={this.onCommentBoxLayout.bind(this)}>
                        <CommentBox
                            onRef={(ref) => (this.commentBox = ref)}
                            hasSuggestion={!!this.props.goalId}
                            pageId={this.props.pageId}
                            goalId={this.props.goalId}
                            onPost={this.clearCommentBox}
                            isReplyCommentBox={true}
                        />
                    </View>
                </Animated.View>
            </MenuProvider>
        )
    }
}

const styles = {
    cardContainerStyle: {
        flex: 1,
        backgroundColor: 'white',
    },
    composerContainer: {
        left: 0,
        bottom: 0,
        width: '100%',
        position: 'absolute',
        backgroundColor: 'white',
        zIndex: 3,
    },
    // Styles related to child comments
    replyIconStyle: {
        height: 20,
        width: 20,
        tintColor: '#d2d2d2',
    },
    replyIconContainerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
    },
}

const makeMapStateToProps = () => {
    const getRepliesById = makeGetRepliesById()

    const mapStateToProps = (state, props) => {
        const { userId } = state.user
        const { itemId, entityId, pageId } = props
        const { item } = getRepliesById(state, itemId, entityId)
        const newComment =
            getNewCommentByTab(state, pageId) ||
            getNewCommentByTab(state, props.pageId)

        return {
            userId,
            item,
            newComment,
        }
    }

    return mapStateToProps
}

export default connect(makeMapStateToProps, {
    openPostDetail,
    createComment,
    createEmptyComment,
    updateNewComment,
})(ReplyThread)
