/** @format */

import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Linking,
    Image,
    Alert,
    Platform,
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import Expo, { WebBrowser } from 'expo'
import { Actions } from 'react-native-router-flux'

// Components
import ProfileImage from '../../../Common/ProfileImage'
import RichText from '../../../Common/Text/RichText'
import Tooltip from '../../../../Main/Common/Tooltip'

// Assets
import stepIcon from '../../../../asset/suggestion/step.png'
import needIcon from '../../../../asset/suggestion/need.png'
import eventIcon from '../../../../asset/suggestion/event.png'
import tribeIcon from '../../../../asset/suggestion/tribe.png'
import userIcon from '../../../../asset/suggestion/user.png'
import friendIcon from '../../../../asset/suggestion/group.png'
import linkIcon from '../../../../asset/suggestion/link.png'
import customIcon from '../../../../asset/suggestion/other.png'
// import chatIcon from '../../../../asset/suggestion/chat.png'
import readingIcon from '../../../../asset/suggestion/book.png'
import chatIcon from '../../../../asset/suggestion/chat.png'
import SWIPER_BACKGROUND from '../../../../asset/image/messageUI.png'

// Utils
import {
    switchCaseFWithVal,
    componentKeyByTab,
} from '../../../../redux/middleware/utils'
import { colors } from 'react-native-elements'
import { color } from '../../../../styles/basic'
// Actions
import { openProfile, UserBanner } from '../../../../actions'

import { myTribeDetailOpenWithId } from '../../../../redux/modules/tribe/MyTribeActions'

// Actions
import { updateGoal } from '../../../../redux/modules/goal/GoalDetailActions'
import {
    tribeDetailOpen,
    requestJoinTribe,
    acceptTribeInvit,
    declineTribeInvit,
} from '../../../../redux/modules/tribe/MyTribeActions'
import { selectTribe } from '../../../../redux/modules/feed/post/ShareActions'
import { createOrGetDirectMessage } from '../../../../actions/'
import { myEventDetailOpenWithId } from '../../../../redux/modules/event/MyEventActions'
import DelayedButton from '../../../Common/Button/DelayedButton'
import SuggestionDetailModal from './SuggestionDetailModal'

const DEBUG_KEY = '[ UI CommentRef ]'

class CommentRef extends React.PureComponent {
    constructor(props) {
        super(props)
        this.handleSuggestionLinkOnPress = this.handleSuggestionLinkOnPress.bind(
            this
        )
        this.handleSuggestionLinkOnClose = this.handleSuggestionLinkOnClose.bind(
            this
        )
        this.state = {
            suggestionModal: false,
        }
    }

    handleSuggestionLinkOnPress = async (url) => {
        // Below is the original expo webbrowser way of opening but it doesn't work in real
        // build environment
        // const returnUrl = Expo.Linking.makeUrl('/');
        // Expo.Linking.addEventListener('url', this.handleSuggestionLinkOnClose);
        // const result = await WebBrowser.openBrowserAsync(url);
        // Expo.Linking.removeEventListener('url', this.handleSuggestionLinkOnClose);

        // Se we switch to the new react native way
        const canOpen = await Linking.canOpenURL(url)
        if (canOpen) {
            await Linking.openURL(url)
        }
        console.log(`${DEBUG_KEY}: close suggestion link with res: `, result)
    }

    handleSuggestionLinkOnClose = (event) => {
        WebBrowser.dismissBrowser()
        // TODO: parse url and determine verification states
        const { path, queryParams } = Expo.Linking.parse(event.url)
        console.log(
            `${DEBUG_KEY}: suggestion link close with path: ${path} and param: `,
            queryParams
        )
    }

    handleOnRefPress = (item, userId, tab) => {
        const {
            suggestionType,
            chatRoomRef,
            eventRef,
            tribeRef,
            suggestionLink,
            // suggestionText,
            // goalRef,
            userRef,
        } = item

        // console.log(`${DEBUG_KEY}: handle ref on press for item: `, item);
        if (
            (suggestionType === 'User' || suggestionType === 'Friend') &&
            userRef
        ) {
            return this.props.openProfile(userRef._id)
        }
        if (suggestionType === 'Tribe' && tribeRef) {
            // console.log(`${DEBUG_KEY}: open my tribe detail`)
            return this.props.myTribeDetailOpenWithId(tribeRef._id)
        }
        if (suggestionType === 'Event' && eventRef) {
            return this.props.myEventDetailOpenWithId(eventRef._id)
        }
        if (suggestionType === 'NewNeed') {
            this.setState({
                ...this.state,
                suggestionModal: true,
            })
            return
        }
        if (suggestionType === 'NewStep') {
            this.setState({
                ...this.state,
                suggestionModal: true,
            })
            return
        }
        if (suggestionType === 'ChatConvoRoom' && chatRoomRef) {
            const isMember =
                chatRoomRef.members &&
                chatRoomRef.members.find(
                    (memberDoc) =>
                        memberDoc.memberRef._id == userId &&
                        (memberDoc.status == 'Admin' ||
                            memberDoc.status == 'Member')
                )
            if (isMember) {
                Actions.push('chatRoomConversation', {
                    chatRoomId: chatRoomRef._id,
                })
                return
            }

            // User is a non-member. Open ChatRoomPublicView
            const componentKey = componentKeyByTab(tab, 'chatRoomPublicView')
            Actions.push(`${componentKey}`, {
                chatRoomId: item._id,
                chatRoom: chatRoomRef,
            })
            // console.log(`${DEBUG_KEY}: suggestion type is ChatConvoRoom, chatRoomId is: ${chatRoomRef._id}, chatRoomRef is: `, chatRoomRef);
        }
        if (suggestionType === 'Custom' && suggestionLink) {
            this.handleSuggestionLinkOnPress(suggestionLink)
            return
        }
    }

    handleMessageButtonOnPress = (userRef) => {
        this.props.createOrGetDirectMessage(userRef._id, (err, chatRoom) => {
            if (err || !chatRoom) {
                return Alert.alert(
                    'Error',
                    'Could not start the conversation. Please try again later.'
                )
            }
            Actions.push('chatRoomConversation', {
                chatRoomId: chatRoom._id,
            })
        })
    }

    // Render badge
    renderEndImage(item) {
        const {
            suggestionType,
            userRef,
            tribeRef,
            goalRef,
            suggestionText,
            suggestionForRef,
        } = item
        const { pageId } = this.props
        // if (
        //     (suggestionType === 'User' || suggestionType === 'Friend') &&
        //     userRef !== null &&
        //     userRef !== undefined
        // ) {
        //     return (
        //         <View style={styles.iconContainerStyle}>
        //             <UserBanner
        //                 user={userRef}
        //                 iconStyle={{ height: 24, width: 22 }}
        //             />
        //         </View>
        //     )
        // }
        // return null
        const tooltipText = `Tap here to introduce Shunsuke to ${userRef?.name} in chat`
        if (suggestionType === 'User') {
            return (
                <>
                    <TouchableOpacity
                        style={{
                            width: 30,
                            height: 30,
                            backgroundColor: '#42C0F5',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 5,
                            marginTop: 10,
                            marginRight: 10,
                        }}
                        onPress={() => this.handleMessageButtonOnPress(userRef)}
                    >
                        <Image
                            source={chatIcon}
                            style={{
                                width: 20,
                                height: 20,
                                resizeMode: 'contain',
                                tintColor: 'white',
                            }}
                        />
                    </TouchableOpacity>

                    {/* <Tooltip
                        title={tooltipText}
                        imageSource={SWIPER_BACKGROUND}
                        type="commentSuggestion"
                        viewStyle={{
                            position: 'absolute',
                            zIndex: 1,
                            left: -10,
                            // top: 0,
                            bottom: 15,
                        }}
                    /> */}
                </>
            )
        }
        if (suggestionType === 'Tribe') {
            return (
                <View
                    style={{
                        marginHorizontal: 8,
                        marginVertical: 5,
                        flexDirection: 'row',
                    }}
                >
                    <DelayedButton
                        activeOpacity={0.6}
                        onPress={() =>
                            this.props.tribeDetailOpen(item.tribeRef)
                        }
                        style={{
                            height: 31,
                            width: 45,
                            backgroundColor: color.GM_BLUE,
                            borderRadius: 3,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 3,
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 12,
                                fontWeight: '600',
                                lineHeight: 14,
                                fontFamily: 'SFProDisplay-Semibold',
                            }}
                        >
                            Join
                        </Text>
                    </DelayedButton>
                </View>
            )
        }

        if (suggestionType === 'NewStep') {
            const type = suggestionType === 'NewStep' ? 'step' : null
            return (
                <>
                    {this.props.isSelf ? (
                        <View
                            style={{
                                marginHorizontal: 8,
                                marginVertical: 5,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <DelayedButton
                                activeOpacity={0.6}
                                onPress={() => {
                                    this.props.updateGoal(
                                        item._id,
                                        type,
                                        {
                                            description: suggestionText,
                                        },
                                        goalRef,
                                        pageId
                                    )
                                    setTimeout(() => {
                                        Alert.alert(
                                            'Success',
                                            'Your Step has been added'
                                        )
                                    }, 1000)
                                }}
                                style={{
                                    height: 31,
                                    width: 65,
                                    backgroundColor: color.GM_BLUE,
                                    borderRadius: 3,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 3,
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: 12,
                                        fontWeight: '600',
                                        lineHeight: 14,
                                        fontFamily: 'SFProDisplay-Semibold',
                                    }}
                                >
                                    Add Step
                                </Text>
                            </DelayedButton>
                        </View>
                    ) : null}
                </>
            )
        }
        if (suggestionType === 'NewNeed') {
            const type = suggestionType === 'NewNeed' ? 'need' : null
            return (
                <>
                    {this.props.isSelf ? (
                        <View
                            style={{
                                marginHorizontal: 8,
                                marginVertical: 5,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <DelayedButton
                                activeOpacity={0.6}
                                onPress={() => {
                                    this.props.updateGoal(
                                        item._id,
                                        type,
                                        {
                                            description: suggestionText,
                                        },
                                        goalRef,
                                        pageId
                                    )
                                    setTimeout(() => {
                                        Alert.alert(
                                            'Success',
                                            'Your Need has been added'
                                        )
                                    }, 1000)
                                }}
                                style={{
                                    height: 31,
                                    width: 105,
                                    backgroundColor: color.GM_BLUE,
                                    borderRadius: 3,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 3,
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: 12,
                                        fontWeight: '600',
                                        lineHeight: 14,
                                        fontFamily: 'SFProDisplay-Semibold',
                                    }}
                                >
                                    Add to My Needs
                                </Text>
                            </DelayedButton>
                        </View>
                    ) : null}
                </>
            )
        }
    }

    renderTextContent(item) {
        const { title, content } = getTextContent(item)

        const { suggestionType } = item
        const defaultImage = switchDefaultImageType(suggestionType, item)
        const { imageUrl } = defaultImage
        const marginLeft = imageUrl ? 10 : 0 // There is only margin left if it's not default icon

        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    marginLeft,
                    marginRight: 10,
                    // paddingVertical: 4,
                    marginHorizontal: 5,
                }}
            >
                {suggestionType === 'NewNeed' ||
                suggestionType === 'NewStep' ? null : (
                    <Text
                        style={styles.titleTextStyle}
                        numberOfLines={3}
                        ellipsizeMode="tail"
                    >
                        {title}
                    </Text>
                )}
                <RichText
                    contentText={
                        suggestionType === 'NewNeed' ||
                        suggestionType === 'NewStep' ||
                        suggestionType === 'Tribe'
                            ? content
                            : null
                    }
                    textStyle={{
                        ...styles.headingTextStyle,
                        // flex: 1,
                        // flexWrap: 'wrap',
                        color: 'black',
                        fontSize: 10,
                    }}
                    numberOfLines={2}
                    textContainerStyle={{
                        flexDirection: 'row',
                        marginHorizontal:
                            suggestionType === 'NewNeed' ||
                            suggestionType === 'NewStep'
                                ? 10
                                : 0,
                    }}
                    ellipsizeMode="tail"
                    handleUrlPress={this.handleSuggestionLinkOnPress}
                    onUserTagPressed={() =>
                        console.log(`${DEBUG_KEY}: user tag pressed`)
                    }
                />
            </View>
        )
    }

    /**
     * Render corresponding image. If no image in the suggestion item,
     * show default icon.
     */
    renderImage(item) {
        const { suggestionType } = item
        const defaultImage = switchDefaultImageType(suggestionType, item)
        const { source, style, imageUrl, defaultImageStyle } = defaultImage

        return (
            <ProfileImage
                imageStyle={{
                    width: 40,
                    height: 40,
                    ...style,
                    borderRadius: suggestionType === 'Tribe' ? 0 : 20,
                }}
                defaultImageSource={source}
                defaultImageStyle={{
                    width: 34,
                    height: 34,
                    ...defaultImageStyle,
                }}
                imageUrl={imageUrl}
                imageContainerStyle={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 5,
                    marginVertical: 5,
                    width: 40,
                    height: 40,
                    padding: 10,
                }}
            />
        )
    }

    renderSuggestionModal(item) {
        return (
            <SuggestionDetailModal
                isVisible={this.state.suggestionModal}
                suggestion={item}
                closeModal={() => this.setState({ suggestionModal: false })}
                owner={this.props.owner}
            />
        )
    }

    renderSuggestedIcon = (suggestionType) => {
        if (suggestionType === 'User') return userIcon
        else if (suggestionType === 'Tribe') return tribeIcon
        else if (suggestionType === 'NewStep') return stepIcon
        else if (suggestionType === 'NewNeed') return needIcon
        else if (suggestionType === 'Clarify') return needIcon
    }

    // Currently this is a dummy component
    render() {
        const { item, userId, tab, containerStyles } = this.props
        if (!item) return null
        const { suggestionType, suggestionText, suggestionLink } = item

        // if suggestionType is Custom and no suggestionText and suggestionLink,
        // then it's a suggestionComment for a step or a need
        // If suggestionText is {} which is an empty object, it means that it's
        // a suggestion comment for a step / need
        if (
            suggestionType === 'Custom' &&
            (!suggestionText ||
                _.isEmpty(suggestionText) ||
                suggestionText === '{}') &&
            (!suggestionLink || _.isEmpty(suggestionLink))
        ) {
            return null
        }

        return (
            <>
                <View
                    style={{
                        backgroundColor: 'white',
                        elevation: 1,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1.5 },
                        shadowOpacity: 0.2,
                        shadowRadius: 1,
                        borderRadius: 5,
                        borderWidth: 0.5,
                        borderColor: colors.grey4,
                        padding: 5,
                        marginTop: Platform.OS === 'ios' ? 5 : 0,
                    }}
                >
                    <View
                        style={{
                            marginHorizontal: 10,
                            flexDirection: 'row',
                            marginTop: 5,
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            source={this.renderSuggestedIcon(suggestionType)}
                            style={{
                                width: 15,
                                height: 15,
                                resizeMode: 'contain',
                                marginRight: 7,
                            }}
                        />
                        <Text style={{ color: '#828282' }}>
                            {suggestionType === 'User' ? 'USER' : null}
                            {suggestionType === 'Tribe' ? 'TRIBE' : null}
                            {suggestionType === 'NewNeed' ? 'NEED' : null}
                            {suggestionType === 'NewStep' ? 'STEP' : null}
                            {suggestionType === 'Clarify' ? 'CLARIFY' : null}
                        </Text>
                    </View>
                    <DelayedButton
                        activeOpacity={0.6}
                        style={[styles.containerStyle, containerStyles || {}]}
                        onPress={() => this.handleOnRefPress(item, userId, tab)}
                    >
                        {this.renderSuggestionModal(item)}
                        {suggestionType === 'NewNeed' ||
                        suggestionType === 'NewStep' ||
                        suggestionType === 'Clarify'
                            ? null
                            : this.renderImage(item)}
                        {this.renderTextContent(item)}
                        {this.renderEndImage(item)}
                    </DelayedButton>
                </View>
            </>
        )
    }
}

const switchDefaultImageType = (type, item) =>
    switchCaseFWithVal(item)({
        ChatConvoRoom: (val) => ({
            source: chatIcon,
            defaultImageStyle: {
                width: 30,
                height: 28,
                tintColor: '#333',
            },
            style: undefined,
            imageUrl: item && item.picture ? item.picture : undefined,
        }),
        Event: (val) => {
            const { eventRef } = val
            return {
                source: eventIcon,
                imageUrl: eventRef ? eventRef.picture : undefined,
            }
        },
        Tribe: (val) => {
            const { tribeRef } = val
            return {
                source: tribeIcon,
                imageUrl: tribeRef ? tribeRef.picture : undefined,
            }
        },
        Friend: (val) => {
            const { userRef } = val
            return {
                source: friendIcon,
                imageUrl:
                    userRef && userRef.profile
                        ? userRef.profile.image
                        : undefined,
                defaultImageStyle: {
                    tintColor: '#333',
                },
            }
        },
        User: (val) => {
            const { userRef } = val
            return {
                source: userIcon,
                imageUrl:
                    userRef && userRef.profile
                        ? userRef.profile.image
                        : undefined,
                defaultImageStyle: {
                    tintColor: '#333',
                },
            }
        },
        Reading: () => ({
            source: readingIcon,
            defaultImageStyle: {
                tintColor: '#333',
            },
        }),
        Link: () => ({
            source: linkIcon,
            defaultImageStyle: {
                tintColor: '#333',
            },
        }),
        Custom: () => ({
            source: customIcon,
            defaultImageStyle: {
                tintColor: '#333',
            },
        }),
        NewNeed: () => ({
            source: needIcon,
            defaultImageStyle: {
                tintColor: '#333',
            },
        }),
        NewStep: () => ({
            source: stepIcon,
            defaultImageStyle: {
                tintColor: '#333',
            },
        }),
        Clarify: () => ({
            source: stepIcon,
            defaultImageStyle: {
                tintColor: 'white',
            },
        }),
    })('User')(type)

const getTextContent = (item) => {
    const {
        suggestionType,
        chatRoomRef,
        eventRef,
        tribeRef,
        suggestionLink,
        suggestionText,
        goalRef,
        userRef,
    } = item

    let ret = {
        title: 'Content deleted',
        content: '',
    }
    if ((suggestionType === 'User' || suggestionType === 'Friend') && userRef) {
        ret = {
            title: userRef.name,
            content: userRef.headline,
        }
    }
    if (suggestionType === 'Tribe' && tribeRef) {
        ret = {
            title: tribeRef.name,
            content: `${tribeRef.description.slice(0, 125)}...`,
        }
    }
    if (suggestionType === 'Event' && eventRef) {
        ret = {
            title: eventRef.title,
            content: eventRef.description,
        }
    }
    if (suggestionType === 'NewNeed' && suggestionText) {
        ret = {
            title: 'Suggested need',
            content: suggestionText,
        }
    }
    if (suggestionType === 'NewStep' && suggestionText) {
        ret = {
            title: 'Suggested step',
            content: suggestionText,
        }
    }
    if (suggestionType === 'Clarify' && suggestionText) {
        ret = {
            content: 'Clarify Goal',
            title: suggestionText,
        }
    }
    if (suggestionType === 'ChatConvoRoom' && chatRoomRef) {
        ret = {
            title: chatRoomRef.name || 'Chat room',
            content:
                chatRoomRef.description ||
                'No description for this chat room..',
        }
    }

    if (suggestionType === 'Custom') {
        ret = {
            title: suggestionText || 'Suggested Link',
            content: suggestionLink,
        }
    }
    return ret
}

const styles = {
    containerStyle: {
        flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'center',
        minHeight: 55,
        marginTop: 12,
        marginBottom: 8,
        borderWidth: 0.5,
        borderRadius: 5,
        // borderColor: '#ddd',
        borderColor: 'lightgray',
        borderBottomWidth: 0,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 1,
        marginHorizontal: 10,
    },
    titleTextStyle: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 2,
        left: 10,
    },
    headingTextStyle: {
        fontSize: 9,
    },
    iconContainerStyle: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
}

const mapStateToProps = (state) => {
    const ownerGoalId = state.goalDetail.goal.goal?.owner?._id
    const { userId } = state.user
    const { tab } = state.navigation
    const isSelf = userId === ownerGoalId

    return {
        tab,
        userId,
        isSelf,
    }
}

export default connect(mapStateToProps, {
    openProfile,
    updateGoal,
    tribeDetailOpen,
    selectTribe,
    createOrGetDirectMessage,
    myTribeDetailOpenWithId,
    myEventDetailOpenWithId,
    requestJoinTribe,
})(CommentRef)
