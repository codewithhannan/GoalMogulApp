/** @format */

// This component is a ref on Comment / Post
// import Decode from 'unescape'; TODO: removed once new decode is good to go
import _ from 'lodash'
import React, { Component } from 'react'
import { Image, Text, View } from 'react-native'
import { connect } from 'react-redux'
import goalIcon from '../../asset/header/logo.png'
import helpIconn from '../../asset/utils/helpIcon.png'
// Assets
import badge from '../../asset/utils/badge.png'
import defaultProfilePic from '../../asset/utils/defaultUserProfile.png'
import helpIcon from '../../asset/utils/help.png'
import postIcon from '../../asset/utils/post.png'
import stepIcon from '../../asset/utils/steps.png'
import { decode, switchCaseFWithVal } from '../../redux/middleware/utils'
// Actions
import { openPostDetail } from '../../redux/modules/feed/post/PostActions'
import { openGoalDetailById } from '../../redux/modules/home/mastermind/actions'
import DelayedButton from './Button/DelayedButton'
// Components
import ProfileImage from './ProfileImage'

const DEBUG_KEY = '[ UI RefPreview ]'

class RefPreview extends Component {
    handleOnPress(item, postType, goalRef) {
        // console.log('item is : ', item);
        if (item === null) return

        // When RefPreview is rendered from ShareModal and it's a share of Goal
        // goalRef will be undefined.
        if (
            postType === 'ShareGoal' ||
            postType === 'seekHelpFromTribe' ||
            (postType === 'seekHelpFromFriend' && goalRef)
        ) {
            return this.props.openGoalDetailById(goalRef._id)
        }

        if (postType === 'ShareNeed' || postType === 'ShareStep') {
            const initialProps = {
                focusType: postType === 'ShareNeed' ? 'need' : 'step',
                focusRef: item._id,
                initialShowSuggestionModal: false,
            }
            return this.props.openGoalDetailById(goalRef._id, initialProps)
        }

        if (postType === 'ShareUser') {
            if (this.props.onPress) {
                this.props.onPress()
            }
            return
        }

        if (postType === 'SharePost') {
            return this.props.openPostDetail(item)
        }
    }

    renderBadge = (item, postType) => {
        if (postType === 'ShareUser') {
            // TODO: render badge accordingly based on the user points
            return (
                <View
                    style={{
                        width: 50,
                        height: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Image source={badge} style={{ height: 23, width: 23 }} />
                </View>
            )
        }
        return null
    }

    // Currently this is a dummy component
    render() {
        console.log('seek help', this.props)
        const { item, postType, goalRef, disabled } = this.props
        if (!item) return null

        // TODO: add a postType ShareStep
        const { title, content, defaultPicture, picture } = switchCaseItem(
            goalRef,
            postType
        )
        const titleToDisplay =
            postType === ('ShareNeed' || postType === 'ShareStep') &&
            goalRef &&
            goalRef.owner &&
            goalRef.owner.name
                ? goalRef.owner.name
                : title

        const imageContainerstyle = picture
            ? {
                  justifyContent: 'center',
                  paddingRight: 10,
                  // borderRadius: 5,
              }
            : {
                  justifyContent: 'center',
                  padding: 10,
                  // borderRadius: 5,
              }
        return (
            <DelayedButton
                activeOpacity={1}
                style={styles.containerStyle}
                onPress={() => this.handleOnPress(item, postType, goalRef)}
                disabled={disabled}
            >
                <ProfileImage
                    imageStyle={{ width: 50, height: 50, borderRadius: 5 }}
                    imageContainerStyle={imageContainerstyle}
                    defaultImageStyle={
                        postType === 'seekHelpFromTribe' ||
                        postType === 'seekHelpFromFriend'
                            ? styles.helpImage
                            : { width: 32, height: 34, opacity: 0.6 }
                    }
                    defaultImageSource={defaultPicture}
                    imageUrl={picture}
                />
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        paddingLeft: 0,
                        paddingTop: 8,
                        paddingBottom: 7,
                        paddingRight: 12,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={
                                postType === 'seekHelpFromTribe' ||
                                postType === 'seekHelpFromFriend'
                                    ? styles.titleSeek
                                    : styles.titleTextStyle
                            }
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {decode(titleToDisplay)}
                        </Text>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                        }}
                    >
                        <Text
                            style={
                                postType === 'seekHelpFromTribe' ||
                                postType === 'seekHelpFromFriend'
                                    ? styles.seekHeadingTextStyle
                                    : styles.headingTextStyle
                            }
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {decode(content)}
                        </Text>
                    </View>
                </View>
                {this.renderBadge(item, postType)}
            </DelayedButton>
        )
    }
}
// <Text style={styles.titleTextStyle}>{title}</Text>
// <Text style={styles.headingTextStyle}>{content}</Text>

// type: ["General", "ShareUser", "SharePost", "ShareGoal", "ShareNeed"]
const switchCaseItem = (val, type) =>
    switchCaseFWithVal(val)({
        General: () => ({
            title: undefined, // This case will never happen since it's creating a post
        }),
        GoalStorylineUpdate: () => ({
            title: undefined, // This case will never happen since it's creating a post
        }),
        ShareUser: (item) => {
            if (invalidItem(item)) {
                return {
                    title: 'User',
                    content: 'Content deleted',
                }
            }
            return {
                title: item.name,
                content: item.profile ? item.profile.about : undefined,
                picture: item.profile ? item.profile.image : undefined,
            }
        },
        SharePost: (item) => {
            if (invalidItem(item)) {
                return {
                    title: 'Post',
                    content: 'Content deleted',
                    defaultPicture: postIcon,
                }
            }

            let contentText =
                item.content && item.content.text
                    ? item.content.text
                    : undefined
            if (!contentText && item.mediaRef) {
                contentText = 'Posted an Image'
            }

            return {
                title: item.owner ? item.owner.name : undefined,
                // TODO: TAG: convert this to string later on
                content: contentText,
                picture: item.mediaRef ? item.mediaRef : undefined,
                defaultPicture: postIcon,
            }
        },
        ShareGoal: (item) => {
            if (invalidItem(item)) {
                return {
                    title: 'Goal',
                    content: 'Content deleted',
                    defaultPicture: goalIcon,
                }
            }

            return {
                title: item.owner ? item.owner.name : 'Goal', // We decide to replace title with owner's name
                // title: 'Goal',
                // TODO: TAG: convert this to string later on
                content: item.title,
                // picture: item.profile ? item.owner.profile.image : undefined,
                defaultPicture: goalIcon,
            }
        },
        ShareNeed: (item) => {
            if (invalidItem(item)) {
                return {
                    title: 'Need',
                    content: 'Content deleted',
                    defaultPicture: helpIcon,
                }
            }

            return {
                title: item.owner ? item.owner.name : 'Need', // We decide to replace title with owner's name
                // title: undefined,
                content: item.description,
                // picture: item.profile ? item.profile.image : undefined,
                defaultPicture: helpIcon,
            }
        },
        ShareStep: (item) => {
            if (invalidItem(item)) {
                return {
                    title: 'Step',
                    content: 'Content deleted',
                    defaultPicture: stepIcon,
                }
            }

            return {
                title: item.owner ? item.owner.name : 'Step', // We decide to replace title with owner's name
                // title: 'Step',
                content: item.description,
                defaultPicture: stepIcon,
            }
        },
        seekHelpFromTribe: (item) => {
            // console.log('item seek',item);
            if (invalidItem(item)) {
                return {
                    title: `Help ${item.owner.name}`,
                    content: 'Content deleted',
                    defaultPicture: goalIcon,
                }
            }

            return {
                title: item.owner ? `Help ${item.owner.name}!` : 'Help', // We decide to replace title with owner's name
                // title: 'Goal',
                // TODO: TAG: convert this to string later on
                content: item.title,
                // picture: item.profile ? item.owner.profile.image : undefined,
                defaultPicture: helpIconn,
            }
        },
        seekHelpFromFriend: (item) => {
            // console.log('item seek',item);
            if (invalidItem(item)) {
                return {
                    title: `Help ${item.owner.name}`,
                    content: 'Content deleted',
                    defaultPicture: goalIcon,
                }
            }

            return {
                title: item.owner ? `Help ${item.owner.name}!` : 'Help', // We decide to replace title with owner's name
                // title: 'Goal',
                // TODO: TAG: convert this to string later on
                content: item.title,
                // picture: item.profile ? item.owner.profile.image : undefined,
                defaultPicture: helpIconn,
            }
        },
    })('General')(type)

const invalidItem = (item) =>
    item === undefined || item === null || _.isEmpty(item)

const styles = {
    containerStyle: {
        flexDirection: 'row',
        height: 80,
        marginTop: 4,
        marginBottom: 4,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#f2f2f2',
        borderBottomWidth: 0,
        backgroundColor: '#fff',
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.15,
        shadowRadius: 1,
        elevation: 1,
    },
    titleTextStyle: {
        fontSize: 11,
        fontWeight: '600',
        flexWrap: 'wrap',
        flex: 1,
    },
    headingTextStyle: {
        fontSize: 12,
        flexWrap: 'wrap',
        flex: 1,
    },
    helpImage: {
        height: 16,
        width: 16,
        position: 'absolute',
        top: 8,
        left: 10,
        resizeMode: 'contain',
        borderColor: 'white',
    },
    titleSeek: {
        fontSize: 14,
        flexWrap: 'wrap',
        flex: 1,
        position: 'absolute',
        top: -2,
        left: 9,
    },
    seekHeadingTextStyle: {
        fontSize: 14,
        flexWrap: 'wrap',
        flex: 1,
        left: -6,
        fontWeight: 'bold',
    },
}

export default connect(null, {
    openPostDetail,
    openGoalDetailById,
})(RefPreview)
