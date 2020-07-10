/** @format */

import React from 'react'
import {
    View,
    FlatList,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    ImageBackground,
    TouchableOpacity,
    Image,
    TextInput,
    Platform,
    Keyboard,
    Animated,
} from 'react-native'
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

// Actions
import { openPostDetail } from '../../../../redux/modules/feed/post/PostActions'

// Assets
import { DEFAULT_STYLE } from '../../../../styles'
import ProfileImage from '../../../Common/ProfileImage'
import { IMAGE_BASE_URL } from '../../../../Utils/Constants'
import expand from '../../../../asset/utils/expand.png'
import ChildCommentCard from './ChildCommentCard'
import { Icon } from '@ui-kitten/components'
import { Text } from 'react-native-animatable'
import LikeListModal from '../../../Common/Modal/LikeListModal'

const DEBUG_KEY = '[ UI CommentCard ]'

class ReplyThread extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mediaModal: false,
            showCommentLikeList: false,
            likeListParentId: undefined,
            likeListParentType: undefined,
            marginTop: new Animated.Value(0),
        }
        this.openCommentLikeList = this.openCommentLikeList.bind(this)
        this.closeCommentLikeList = this.closeCommentLikeList.bind(this)
        this.renderItem = this.renderItem.bind(this)
        this.keyboardWillShow = this.keyboardWillShow.bind(this)
        this.keyboardWillHide = this.keyboardWillHide.bind(this)
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
    }

    componentWillUnmount() {
        this.keyboardWillShowListener.remove()
        this.keyboardWillHideListener.remove()
    }

    keyboardWillShow() {
        if (!this.marginTopOnKeyboard) return
        Animated.timing(this.state.marginTop, {
            toValue: -this.marginTopOnKeyboard,
            duration: this.marginTopOnKeyboard,
        }).start()
    }

    keyboardWillHide() {
        Animated.timing(this.state.marginTop, {
            toValue: 0,
            duration: this.marginTopOnKeyboard,
        }).start()
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
                    ...DEFAULT_STYLE.normalText_1,
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
        const { likeCount, childComments } = this.props.item
        const commentCount = childComments.length

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
                <Icon
                    pack="material-community"
                    style={[
                        DEFAULT_STYLE.normalIcon_1,
                        { tintColor: '#828282', marginRight: 4 },
                    ]}
                    name="message-outline"
                />
                <Text style={DEFAULT_STYLE.normalText_1}>{commentCount}</Text>
                <Icon
                    pack="material-community"
                    style={[
                        DEFAULT_STYLE.normalIcon_1,
                        {
                            tintColor: '#EB5757',
                            marginLeft: 16,
                            marginRight: 4,
                        },
                    ]}
                    name="heart"
                />
                <Text style={DEFAULT_STYLE.normalText_1}>{likeCount}</Text>
            </View>
        )
    }

    renderHeader() {
        const { item } = this.props
        const { owner, created } = item

        const timeStamp =
            created === undefined || created.length === 0 ? new Date() : created

        return (
            <Animated.View
                style={{
                    padding: 16,
                    marginTop: this.state.marginTop,
                }}
                onLayout={(e) => {
                    this.marginTopOnKeyboard = e.nativeEvent.layout.height
                }}
            >
                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                    <ProfileImage
                        imageUrl={
                            owner && owner.profile
                                ? owner.profile.image
                                : undefined
                        }
                        userId={owner._id}
                    />
                    <View style={{ marginLeft: 12, marginTop: 2 }}>
                        <Headline
                            name={owner.name || ''}
                            user={owner}
                            hasCaret={false}
                            textStyle={DEFAULT_STYLE.titleText_2}
                        />
                        <View style={{ marginTop: 2 }} />
                        <Timestamp time={timeago().format(timeStamp)} />
                    </View>
                </View>
                {this.renderTextContent(item)}
                {this.renderCommentMedia(item)}
                {this.renderCommentRef(item)}
            </Animated.View>
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

    renderItem({ item }) {
        return (
            <ChildCommentCard
                {...this.props}
                item={item}
                parentCommentId={this.props.item._id}
                userId={this.props.userId}
                openCommentLikeList={this.openCommentLikeList}
            />
        )
    }

    render() {
        const { item } = this.props
        const { childComments } = item

        return (
            <MenuProvider>
                <LikeListModal
                    isVisible={this.state.showCommentLikeList}
                    closeModal={this.closeCommentLikeList}
                    parentId={this.state.likeListParentId}
                    parentType={this.state.likeListParentType}
                    clearDataOnHide
                />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                    style={styles.cardContainerStyle}
                >
                    <ModalHeader back />
                    {this.renderHeader()}
                    {this.renderStatus()}
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={childComments}
                            renderItem={this.renderItem}
                            contentContainerStyle={{
                                padding: 16,
                                paddingTop: 8,
                                paddingBottom: 8,
                            }}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                backgroundColor: 'white',
                                padding: 16,
                                borderTopWidth: 1,
                                borderColor: '#F2F2F2',
                            }}
                        >
                            <TextInput
                                multiline={true}
                                placeholder={'Enter a message...'}
                                value={''}
                                style={DEFAULT_STYLE.normalText_1}
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </MenuProvider>
        )
    }
}

const styles = {
    cardContainerStyle: {
        flex: 1,
        backgroundColor: 'white',
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

const mapStateToProps = (state) => {
    const { userId } = state.user

    return {
        userId,
    }
}

export default connect(mapStateToProps, {
    openPostDetail,
})(ReplyThread)
