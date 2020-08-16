/** @format */

import React from 'react'
import {
    Animated,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    View,
} from 'react-native'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { MenuProvider } from 'react-native-popup-menu'
import { connect } from 'react-redux'
import { SCREENS, wrapAnalytics } from '../../../monitoring/segment'
import { getParentCommentId } from '../../../redux/middleware/utils'
import { Logger } from '../../../redux/middleware/utils/Logger'
import { refreshComments } from '../../../redux/modules/feed/comment/CommentActions'
// Selectors
import { makeGetCommentByEntityId } from '../../../redux/modules/feed/comment/CommentSelector'
// Actions
import {
    closePostDetail,
    fetchPostDetail,
    markUserViewPost,
} from '../../../redux/modules/feed/post/PostActions'
import { makeGetPostById } from '../../../redux/modules/feed/post/PostSelector'
// Styles
import { color } from '../../../styles/basic'
// Component
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import LikeListModal from '../../Common/Modal/LikeListModal'
import CommentBox from '../../Goal/Common/CommentBoxV2'
import CommentCard from '../../Goal/GoalDetailCard/Comment/CommentCard'
import PostDetailSection from './PostDetailSection'
import CreatePostModal from '../CreatePostModal'

const DEBUG_KEY = '[ UI PostDetailCard ]'
const TABBAR_HEIGHT = 48.5
const TOTAL_HEIGHT = TABBAR_HEIGHT

class PostDetailCard extends React.PureComponent {
    constructor(props) {
        super(props)
        this.commentBox = undefined
        this.state = {
            position: 'absolute',
            commentBoxPadding: new Animated.Value(0),
        }
        this.handleScrollToCommentItem = this.handleScrollToCommentItem.bind(
            this
        )
    }

    componentDidMount() {
        // Add listeners for keyboard
        this.keyboardWillShowListener = Keyboard.addListener(
            'keyboardWillShow',
            this.keyboardWillShow
        )
        this.keyboardWillHideListener = Keyboard.addListener(
            'keyboardWillHide',
            this.keyboardWillHide
        )

        const {
            initialProps,
            postDetail,
            pageId,
            postId,
            tab,
            userId,
        } = this.props
        console.log(
            `${DEBUG_KEY}: [ componentDidMount ]: initialProps:`,
            initialProps
        )

        // Send tracking event to mark this post as viewed
        if (
            postDetail &&
            postDetail.owner &&
            postDetail.owner._id &&
            postDetail.owner._id !== userId
        ) {
            this.props.markUserViewPost(postId)
        }

        // Check if needed to scroll to comment after loading
        const refreshCommentsCallback =
            initialProps &&
            initialProps.initialScrollToComment &&
            initialProps.commentId
                ? () => this.handleScrollToCommentItem(initialProps.commentId)
                : undefined

        this.props.refreshComments(
            'Post',
            postId,
            tab,
            pageId,
            refreshCommentsCallback
        )

        // Check if there is any initial operations
        if (initialProps) {
            const {
                initialShowPostModal,
                initialFocusCommentBox,
            } = initialProps

            // Display CreatePostModal
            if (initialShowPostModal) {
                setTimeout(() => {
                    this.createPostModal && this.createPostModal.open()
                }, 750)
                return
            }

            // Focus comment box
            if (initialFocusCommentBox) {
                setTimeout(() => {
                    this.dialogOnFocus()
                }, 700)
                return
            }
        }
    }

    componentWillUnmount() {
        this.keyboardWillShowListener.remove()
        this.keyboardWillHideListener.remove()
    }

    keyboardWillShow = (e) => {
        console.log(`${DEBUG_KEY}: [ keyboardWillShow ]`)
        const timeout = (TOTAL_HEIGHT * 210) / e.endCoordinates.height
        Animated.sequence([
            Animated.delay(timeout),
            Animated.parallel([
                Animated.timing(this.state.commentBoxPadding, {
                    toValue:
                        e.endCoordinates.height -
                        TOTAL_HEIGHT -
                        getBottomSpace(),
                    duration: 210 - timeout,
                }),
            ]),
        ]).start()
    }

    keyboardWillHide = () => {
        console.log(`${DEBUG_KEY}: [ keyboardWillHide ]`)
        Animated.parallel([
            Animated.timing(this.state.commentBoxPadding, {
                toValue: 0,
                duration: 210,
            }),
        ]).start()
    }

    /**
     * Open comment like list
     */
    openCommentLikeList = (likeListParentType, likeListParentId) => {
        console.log(
            `${DEBUG_KEY}: show comment like list: ${likeListParentType}, ${likeListParentId}`
        )
        this.setState({
            ...this.state,
            showCommentLikeList: true,
            likeListParentType,
            likeListParentId,
        })
    }

    /**
     * Close comment like list
     */
    closeCommentLikeList = () => {
        console.log(`${DEBUG_KEY}: close comment like list`)
        this.setState({
            ...this.state,
            showCommentLikeList: false,
            likeListParentId: undefined,
            likeListParentType: undefined,
        })
    }

    /**
     * Scroll to comment item
     */
    handleScrollToCommentItem = (commentId) => {
        const { originalComments, comments } = this.props

        Logger.log(
            `${DEBUG_KEY}: [ handleScrollToCommentItem ]: originalComments`,
            originalComments,
            2
        )
        const parentCommentId = getParentCommentId(commentId, originalComments)

        Logger.log(
            `${DEBUG_KEY}: [ handleScrollToCommentItem ]: commentId`,
            commentId,
            2
        )
        if (!parentCommentId) return // Do nothing since it's no loaded. Defensive coding

        Logger.log(
            `${DEBUG_KEY}: [ handleScrollToCommentItem ]: parentCommentId`,
            parentCommentId,
            2
        )
        const parentCommentIndex = comments.findIndex(
            (c) => c._id === parentCommentId
        )
        Logger.log(
            `${DEBUG_KEY}: [ handleScrollToCommentItem ]: parentCommentIndex`,
            parentCommentIndex,
            2
        )
        if (this.refs['flatList'] === undefined || parentCommentIndex === -1)
            return

        setTimeout(() => {
            this.refs['flatList'].scrollToIndex({
                index: parentCommentIndex,
                animated: true,
            })
        }, 200)
    }

    handleRefresh = () => {
        // const { routes, index } = this.state.navigationState;
        const { tab, postDetail, pageId } = this.props
        // if (routes[index].key === 'comments') {
        this.props.refreshComments('Post', postDetail._id, tab, pageId)
        // }
    }

    keyExtractor = (item) => item._id

    scrollToIndex = (index, viewOffset = 0) => {
        this.refs['flatList'].scrollToIndex({
            index,
            animated: true,
            viewPosition: 1,
            viewOffset,
        })
    }

    /**
     * Only pass in 'Reply' as type if it's a reply
     */
    dialogOnFocus = (type) => {
        if (!this.commentBox) {
            console.warn(
                `${DEBUG_KEY}: [ dialogOnFocus ]: this.commentBox is undefined`
            )
            return
        }
        this.commentBox.focus(type)
    }

    renderItem = (props) => {
        const { postDetail, pageId, postId } = this.props
        const parentRef = postDetail ? postDetail._id : undefined
        return (
            <CommentCard
                key={props.index}
                item={props.item}
                index={props.index}
                commentDetail={{ parentType: 'Post', parentRef }}
                scrollToIndex={(i, viewOffset) =>
                    this.scrollToIndex(i, viewOffset)
                }
                onCommentClicked={this.dialogOnFocus}
                onReportPressed={() =>
                    console.log('post detail report clicked')
                }
                reportType="postDetail"
                pageId={pageId}
                entityId={postId}
                openCommentLikeList={this.openCommentLikeList}
            />
        )
    }

    renderPostDetailSection() {
        const { postDetail } = this.props
        return (
            <View style={{ marginBottom: 1 }}>
                <PostDetailSection
                    item={postDetail}
                    onSuggestion={() => this.dialogOnFocus()}
                    pageId={this.props.pageId}
                    postId={this.props.postId}
                />
            </View>
        )
    }

    render() {
        const { comments, pageId, postId, postDetail } = this.props
        const data = comments

        return (
            <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
                <LikeListModal
                    isVisible={this.state.showCommentLikeList}
                    closeModal={this.closeCommentLikeList}
                    parentId={this.state.likeListParentId}
                    parentType={this.state.likeListParentType}
                    clearDataOnHide
                />
                <CreatePostModal
                    onRef={(r) => (this.createPostModal = r)}
                    initializeFromState
                    initialPost={postDetail}
                />
                <View style={styles.containerStyle}>
                    <SearchBarHeader
                        backButton
                        title="Post"
                        onBackPress={() =>
                            this.props.closePostDetail(postId, pageId)
                        }
                    />
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior="padding"
                    >
                        <FlatList
                            ref="flatList"
                            data={data}
                            renderItem={this.renderItem}
                            keyExtractor={this.keyExtractor}
                            ListHeaderComponent={this.renderPostDetailSection.apply(
                                this
                            )}
                            refreshing={this.props.commentLoading}
                            onRefresh={this.handleRefresh}
                            ListFooterComponent={
                                <View
                                    style={{
                                        height: 90,
                                        backgroundColor: 'transparent',
                                    }}
                                />
                            }
                        />
                        <Animated.View
                            style={[
                                styles.composerContainer,
                                {
                                    position: this.state.position,
                                    paddingBottom: this.state.commentBoxPadding,
                                    backgroundColor: 'white',
                                    zIndex: 3,
                                },
                            ]}
                        >
                            <CommentBox
                                onRef={(ref) => {
                                    this.commentBox = ref
                                }}
                                hasSuggestion={false}
                                pageId={pageId}
                                entityId={postId}
                            />
                        </Animated.View>
                    </KeyboardAvoidingView>
                </View>
            </MenuProvider>
        )
    }
}

// onRefresh={this.handleRefresh.bind()}
// refreshing={this.props.refreshing}

const styles = {
    containerStyle: {
        backgroundColor: color.GM_CARD_BACKGROUND,
        flex: 1,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.3,
        // shadowRadius: 6,
    },
    iconStyle: {
        alignSelf: 'center',
        fontSize: 20,
        marginLeft: 5,
        marginTop: 2,
    },
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.5,
    },
    composerContainer: {
        left: 0,
        right: 0,
        bottom: 0,
    },
}

const makeMapStateToProps = () => {
    const getPostById = makeGetPostById()
    const getCommentByEntityId = makeGetCommentByEntityId()

    const mapStateToProps = (state, props) => {
        // TODO: uncomment
        // const comments = getCommentByTab(state, props.pageId);
        // const getPostDetail = getPostDetailByTab();
        // const postDetail = getPostDetail(state);
        // const { pageId } = postDetail;
        const { userId } = state.user
        const { pageId, postId } = props
        const { post } = getPostById(state, postId)
        const postDetail = post

        const comments = getCommentByEntityId(state, postId, pageId)

        const { transformedComments, loading, data } = comments || {
            transformedComments: [],
            loading: false,
            data: [],
        }

        return {
            commentLoading: loading,
            comments: transformedComments,
            originalComments: data, // All comments in raw form
            postDetail,
            pageId,
            postId,
            userId,
            tab: state.navigation.tab,
        }
    }

    return mapStateToProps
}

export default connect(makeMapStateToProps, {
    closePostDetail,
    refreshComments,
    fetchPostDetail,
    markUserViewPost,
})(wrapAnalytics(PostDetailCard, SCREENS.POST_DETAIL))
