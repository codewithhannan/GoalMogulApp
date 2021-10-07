/** @format */

import React, { Component } from 'react'
import {
    Animated,
    FlatList,
    Keyboard,
    View,
    KeyboardAvoidingView,
} from 'react-native'
import { MenuProvider } from 'react-native-popup-menu'
import { connect } from 'react-redux'
import { SCREENS, wrapAnalytics } from '../../../monitoring/segment'
// Utils
import { getParentCommentId, switchCase } from '../../../redux/middleware/utils'
import { Logger } from '../../../redux/middleware/utils/Logger'
import { refreshComments } from '../../../redux/modules/feed/comment/CommentActions'
// Selectors
import {
    // getCommentByTab,
    makeGetCommentByEntityId,
} from '../../../redux/modules/feed/comment/CommentSelector'
import {
    fetchPostDetail,
    markUserViewPost,
} from '../../../redux/modules/feed/post/PostActions'
import {
    // getShareDetailByTab,
    makeGetPostById,
} from '../../../redux/modules/feed/post/PostSelector'
// Actions
import { closeShareDetail } from '../../../redux/modules/feed/post/ShareActions'
// Styles
import { color } from '../../../styles/basic'
// Component
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import LikeListModal from '../../Common/Modal/LikeListModal'
import CommentBox from '../../Goal/Common/CommentBoxV2'
import CommentCard from '../../Goal/GoalDetailCard/Comment/CommentCard'
import ShareDetailSection from './ShareDetailSection'

const DEBUG_KEY = '[ UI ShareDetailCard ]'

class ShareDetailCard extends Component {
    constructor(props) {
        super(props)
        this.commentBox = undefined
        this.state = {
            bottomPadding: new Animated.Value(0),
            commentBoxHeight: 80,
        }
        this.handleScrollToCommentItem = this.handleScrollToCommentItem.bind(
            this
        )
        this.onCommentBoxLayout = this.onCommentBoxLayout.bind(this)
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
            postId,
            pageId,
            tab,
            shareDetail,
            userId,
        } = this.props
        console.log(
            `${DEBUG_KEY}: [ componentDidMount ]: initialProps:`,
            initialProps
        )

        // Send tracking event to mark this share as viewed
        if (
            shareDetail &&
            shareDetail.owner &&
            shareDetail.owner._id &&
            shareDetail.owner._id !== userId
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
            const { initialFocusCommentBox } = initialProps

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
        Animated.timing(this.state.bottomPadding, {
            useNativeDriver: false,
            toValue: e.endCoordinates.height,
            duration: e.duration,
        }).start()
    }

    keyboardWillHide = (e) => {
        Animated.timing(this.state.bottomPadding, {
            useNativeDriver: false,
            toValue: 0,
            duration: e.duration,
        }).start()
    }

    /**
     * Open comment like list
     */
    openCommentLikeList = (likeListParentType, likeListParentId) => {
        console.log(
            `${DEBUG_KEY}: show comment like list: ${likeListParentType}, ${likeListParentId}`
        )
        this.setState({
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
            showCommentLikeList: false,
            likeListParentId: undefined,
            likeListParentType: undefined,
        })
    }

    /**
     * Scroll to comment item
     */
    handleScrollToCommentItem = (commentId) => {
        const { originalComments, comments, tab, pageId, postId } = this.props

        Logger.log(
            `${DEBUG_KEY}: [ handleScrollToCommentItem ]: originalComments`,
            originalComments,
            2
        )
        const parentCommentId = getParentCommentId(
            commentId,
            originalComments,
            { navigationTab: tab, pageId, entityId: postId }
        )

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
        const { tab, shareDetail, pageId } = this.props
        // if (routes[index].key === 'comments') {
        this.props.refreshComments('Post', shareDetail._id, tab, pageId)
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
        // const { routes, index } = this.state.navigationState;
        const { shareDetail, pageId, postId } = this.props
        const parentRef = shareDetail ? shareDetail._id : undefined
        return (
            <CommentCard
                key={Math.random().toString(36).substr(2, 9)}
                item={props.item}
                index={Math.random().toString(36).substr(2, 9)}
                scrollToIndex={(i, viewOffset) =>
                    this.scrollToIndex(i, viewOffset)
                }
                commentDetail={{ parentType: 'Post', parentRef }}
                onCommentClicked={this.dialogOnFocus}
                onReportPressed={() =>
                    console.log('share detail report clicked')
                }
                reportType="shareDetail"
                pageId={pageId}
                entityId={postId}
                openCommentLikeList={this.openCommentLikeList}
            />
        )
    }

    renderShareDetailSection() {
        const { shareDetail } = this.props
        return (
            <ShareDetailSection
                item={shareDetail}
                onSuggestion={() => this.dialogOnFocus()}
                pageId={this.props.pageId}
            />
        )
    }

    onCommentBoxLayout({ nativeEvent }) {
        this.setState({
            commentBoxHeight: nativeEvent.layout.height,
        })
    }

    render() {
        const { comments, shareDetail, pageId, postId, postType } = this.props
        const data = comments
        if (!shareDetail || !shareDetail.created) return null
        const title = switchCaseTitle(shareDetail.postType || postType)

        return (
            <MenuProvider
                customStyles={{ backdrop: styles.backdrop }}
                skipInstanceCheck={true}
            >
                <LikeListModal
                    isVisible={this.state.showCommentLikeList}
                    closeModal={this.closeCommentLikeList}
                    parentId={this.state.likeListParentId}
                    parentType={this.state.likeListParentType}
                    clearDataOnHide
                />
                <SearchBarHeader
                    backButton
                    title={title}
                    onBackPress={() =>
                        this.props.closeShareDetail(postId, pageId)
                    }
                />
                <KeyboardAvoidingView
                    style={[
                        styles.containerStyle,
                        {
                            paddingBottom: this.state.commentBoxHeight,
                        },
                    ]}
                    behavior={'height'}
                >
                    <FlatList
                        ref="flatList"
                        data={data}
                        renderItem={this.renderItem}
                        keyExtractor={this.keyExtractor}
                        ListHeaderComponent={this.renderShareDetailSection.apply(
                            this
                        )}
                        refreshing={this.props.commentLoading}
                        onRefresh={this.handleRefresh}
                        ListFooterComponent={
                            <View
                                style={{
                                    height: 43,
                                    backgroundColor: 'transparent',
                                }}
                            />
                        }
                    />
                </KeyboardAvoidingView>
                <Animated.View
                    style={[
                        styles.composerContainer,
                        {
                            paddingBottom: this.state.bottomPadding,
                        },
                    ]}
                >
                    <View onLayout={this.onCommentBoxLayout.bind(this)}>
                        <CommentBox
                            onRef={(ref) => {
                                this.commentBox = ref
                            }}
                            hasSuggestion={false}
                            pageId={pageId}
                            entityId={postId}
                        />
                    </View>
                </Animated.View>
            </MenuProvider>
        )
    }
}

const styles = {
    containerStyle: {
        backgroundColor: color.GM_CARD_BACKGROUND,
        flex: 1,
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
        backgroundColor: 'white',
        zIndex: 3,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
}

const makeMapStateToProps = () => {
    const getPostById = makeGetPostById()
    const getCommentByEntityId = makeGetCommentByEntityId()

    const mapStateToProps = (state, props) => {
        const { userId } = state.user
        const { pageId, postId } = props
        const { post } = getPostById(state, postId)
        const shareDetail = post

        const comments = getCommentByEntityId(state, postId, pageId)
        const { transformedComments, loading, data } = comments || {
            transformedComments: [],
            loading: false,
            data: [],
        }

        return {
            commentLoading: loading,
            comments: transformedComments,
            shareDetail,
            pageId,
            userId,
            originalComments: data, // All comments in raw form,
            tab: state.navigation.tab,
        }
    }
    return mapStateToProps
}

const switchCaseTitle = (postType) =>
    switchCase({
        ShareUser: 'Shared User',
        SharePost: 'Shared Update',
        ShareGoal: 'Shared Goal',
        ShareNeed: 'Shared Need',
        ShareStep: 'Shared Step',
    })('Shared')(postType)

export default connect(makeMapStateToProps, {
    closeShareDetail,
    refreshComments,
    fetchPostDetail,
    markUserViewPost,
})(wrapAnalytics(ShareDetailCard, SCREENS.SHARE_DETAIL))
