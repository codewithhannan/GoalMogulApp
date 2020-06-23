/** @format */

// This component is used to display post on a user's profile page
import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import R from 'ramda'
import timeago from 'timeago.js'

// Actions
import { likeGoal, unLikeGoal } from '../../../redux/modules/like/LikeActions'
import { chooseShareDest } from '../../../redux/modules/feed/post/ShareActions'
import { openPostDetail } from '../../../redux/modules/feed/post/PostActions'
import { deletePost, openProfile } from '../../../actions'

import {
    subscribeEntityNotification,
    unsubscribeEntityNotification,
} from '../../../redux/modules/notification/NotificationActions'

// Assets
import LoveIcon from '../../../asset/utils/love.png'
import LoveOutlineIcon from '../../../asset/utils/love-outline.png'
import CommentIcon from '../../../asset/utils/comment.png'
import ShareIcon from '../../../asset/utils/forward.png'

// Components
import ActionButton from '../../Goal/Common/ActionButton'
import ActionButtonGroup from '../../Goal/Common/ActionButtonGroup'
import {
    actionSheet,
    switchByButtonIndex,
} from '../../Common/ActionSheetFactory'
import ProfilePostBody from './ProfilePostBody'
import ProfileImage from '../../Common/ProfileImage'
import RichText from '../../Common/Text/RichText'
import Headline from '../../Goal/Common/Headline'
import Timestamp from '../../Goal/Common/Timestamp'
import DelayedButton from '../../Common/Button/DelayedButton'

// Constants
import {
    CARET_OPTION_NOTIFICATION_SUBSCRIBE,
    CARET_OPTION_NOTIFICATION_UNSUBSCRIBE,
    SHOW_SEE_MORE_TEXT_LENGTH,
} from '../../../Utils/Constants'

import { DEFAULT_STYLE, BACKGROUND_COLOR, GM_BLUE } from '../../../styles'

const DEBUG_KEY = '[ UI GoalDetailCard2.GoalDetailSection ]'
const SHARE_TO_MENU_OPTTIONS = [
    'Share to Feed',
    'Share to an Event',
    'Share to a Tribe',
    'Cancel',
]
const CANCEL_INDEX = 3

class ProfilePostCard extends React.PureComponent {
    handleCardOnPress = (item) => {
        const action = () => this.props.openPostDetail({ ...item })
        if (item) {
            if (this.props.actionDecorator) {
                this.props.actionDecorator(action)
            } else {
                action()
            }
        }
    }

    handleShareOnClick = (item) => {
        const { _id } = item
        const shareType = 'SharePost'

        const shareToSwitchCases = switchByButtonIndex([
            [
                R.equals(0),
                () => {
                    // User choose to share to feed
                    console.log(`${DEBUG_KEY} User choose destination: Feed `)
                    this.props.chooseShareDest(shareType, _id, 'feed', item)
                    // TODO: update reducer state
                },
            ],
            [
                R.equals(1),
                () => {
                    // User choose to share to an event
                    console.log(`${DEBUG_KEY} User choose destination: Event `)
                    this.props.chooseShareDest(shareType, _id, 'event', item)
                },
            ],
            [
                R.equals(2),
                () => {
                    // User choose to share to a tribe
                    console.log(`${DEBUG_KEY} User choose destination: Tribe `)
                    this.props.chooseShareDest(shareType, _id, 'tribe', item)
                },
            ],
        ])

        const shareToActionSheet = actionSheet(
            SHARE_TO_MENU_OPTTIONS,
            CANCEL_INDEX,
            shareToSwitchCases
        )
        return shareToActionSheet()
    }

    renderActionButtons(item, hasActionButton) {
        // Sanity check if ref exists
        if (!item || !hasActionButton) return null

        const { maybeLikeRef, _id } = item

        const likeCount = item.likeCount ? item.likeCount : 0
        const commentCount = item.commentCount ? item.commentCount : 0
        const shareCount = item.shareCount ? item.shareCount : 0

        const selfLiked = maybeLikeRef && maybeLikeRef.length > 0

        // User shouldn't share a share. When Activity on a post which is a share,
        // We disable the share button.
        const isShare = item.postType !== 'General'

        return (
            <View style={{ ...styles.containerStyle, marginTop: 1 }}>
                <ActionButtonGroup>
                    <ActionButton
                        iconSource={selfLiked ? LoveIcon : LoveOutlineIcon}
                        count={likeCount}
                        unitText="Like"
                        textStyle={{ color: selfLiked ? '#000' : '#828282' }}
                        iconStyle={{
                            tintColor: selfLiked ? '#EB5757' : '#828282',
                        }}
                        onPress={() => {
                            if (maybeLikeRef && maybeLikeRef.length > 0) {
                                return this.props.unLikeGoal(
                                    'post',
                                    _id,
                                    maybeLikeRef
                                )
                            }
                            this.props.likeGoal('post', _id)
                        }}
                    />
                    <ActionButton
                        iconSource={ShareIcon}
                        count={shareCount}
                        unitText="Share"
                        textStyle={{ color: '#828282' }}
                        iconStyle={{ tintColor: '#828282' }}
                        onPress={() => this.handleShareOnClick(item)}
                        disabled={isShare}
                    />
                    <ActionButton
                        iconSource={CommentIcon}
                        count={commentCount}
                        unitText="Comment"
                        textStyle={{ color: '#828282' }}
                        iconStyle={{ tintColor: '#828282' }}
                        onPress={() => {
                            this.props.onPress(item)
                        }}
                    />
                </ActionButtonGroup>
            </View>
        )
    }

    renderSeeMore(item) {
        const showSeeMore =
            item &&
            item.content &&
            item.content.text &&
            item.content.text.length > SHOW_SEE_MORE_TEXT_LENGTH

        if (!showSeeMore) return null
        return (
            <DelayedButton
                onPress={() => this.props.openPostDetail(item)}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    marginTop: 2,
                }}
            >
                <Text
                    style={{
                        ...DEFAULT_STYLE.smallText_1,
                        color: GM_BLUE,
                    }}
                >
                    See more
                </Text>
            </DelayedButton>
        )
    }

    renderHeader(item) {
        const { owner, _id, created, maybeIsSubscribed } = item
        const timeStamp = created || new Date()

        const caret = {
            self: {
                options: [{ option: 'Edit Post' }, { option: 'Delete' }],
                onPress: (key) => {
                    if (key === 'Delete') {
                        return this.props.deletePost(_id)
                    }
                    if (key === 'Edit Post') {
                        // Open post detail with a callback to open post edition
                        const initial = {
                            initialShowPostModal: true,
                        }
                        return this.props.openPostDetail(item, initial)
                    }
                },
                shouldExtendOptionLength: false,
            },
            others: {
                options: [
                    { option: 'Report' },
                    {
                        option: maybeIsSubscribed
                            ? CARET_OPTION_NOTIFICATION_UNSUBSCRIBE
                            : CARET_OPTION_NOTIFICATION_SUBSCRIBE,
                    },
                ],
                onPress: (key) => {
                    if (key === 'Report') {
                        return this.props.createReport(_id, 'profile', 'Post')
                    }
                    if (key === CARET_OPTION_NOTIFICATION_UNSUBSCRIBE) {
                        return this.props.unsubscribeEntityNotification(
                            _id,
                            'Post'
                        )
                    }
                    if (key === CARET_OPTION_NOTIFICATION_SUBSCRIBE) {
                        return this.props.subscribeEntityNotification(
                            _id,
                            'Post'
                        )
                    }
                },
            },
        }

        // TODO: TAG:
        const { text, tags, links } = item.content

        return (
            <View>
                <View
                    style={{ flexDirection: 'row', alignItems: 'flex-start' }}
                >
                    <ProfileImage
                        imageUrl={
                            owner && owner.profile
                                ? owner.profile.image
                                : undefined
                        }
                        userId={owner._id}
                        actionDecorator={this.props.actionDecorator}
                    />
                    <View style={{ marginLeft: 12, marginTop: 2, flex: 1 }}>
                        <Headline
                            name={owner.name || ''}
                            isSelf={this.props.userId === owner._id}
                            caret={caret}
                            user={owner}
                            actionDecorator={this.props.actionDecorator}
                            hasCaret={this.props.hasCaret}
                            textStyle={DEFAULT_STYLE.titleText_2}
                        />
                        <View style={{ marginTop: 2 }} />
                        <Timestamp time={timeago().format(timeStamp)} />
                    </View>
                </View>
                <RichText
                    contentText={text}
                    contentTags={tags}
                    contentLinks={links || []}
                    textStyle={DEFAULT_STYLE.normalText_1}
                    textContainerStyle={{ flexDirection: 'row', marginTop: 10 }}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                    onUserTagPressed={(user) => {
                        console.log(
                            `${DEBUG_KEY}: user tag press for user: `,
                            user
                        )
                        if (this.props.actionDecorator) {
                            this.props.actionDecorator(() =>
                                this.props.openProfile(user)
                            )
                        } else {
                            this.props.openProfile(user)
                        }
                    }}
                />
                {this.renderSeeMore(item)}
            </View>
        )
    }

    render() {
        const { item, hasActionButton } = this.props
        if (!item || _.isEmpty(item)) return null

        return (
            <View>
                <View style={styles.containerStyle}>
                    <View
                        style={{
                            marginTop: 12,
                            marginBottom: 10,
                            marginRight: 12,
                            marginLeft: 12,
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => this.handleCardOnPress(item)}
                        >
                            {this.renderHeader(item)}
                        </TouchableOpacity>
                        <ProfilePostBody
                            item={item}
                            showRefPreview={this.props.showRefPreview}
                            openCardContent={() => this.handleCardOnPress(item)}
                        />
                    </View>
                </View>
                {this.renderActionButtons(item, hasActionButton)}
                <View style={DEFAULT_STYLE.shadow} />
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        backgroundColor: 'white',
    },
    textStyle: {
        flex: 1,
        flexWrap: 'wrap',
        fontWeight: 'bold',
    },
}

const mapStateToProps = (state) => {
    const { userId } = state.user
    return {
        userId,
    }
}

export default connect(mapStateToProps, {
    likeGoal,
    unLikeGoal,
    chooseShareDest,
    openPostDetail,
    deletePost,
    openProfile,
    subscribeEntityNotification,
    unsubscribeEntityNotification,
})(ProfilePostCard)
