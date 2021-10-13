/** @format */

import React from 'react'
import {
    View,
    Dimensions,
    ImageBackground,
    TouchableWithoutFeedback,
    Text,
} from 'react-native'
import _ from 'lodash'

import { switchCase, isSharedPost } from '../../../redux/middleware/utils'

// Components
import ImageModal from '../../Common/ImageModal'

// Assets
import RefPreview from '../../Common/RefPreview'

// Styles
import { imagePreviewContainerStyle } from '../../../styles'
import { IMAGE_BASE_URL } from '../../../Utils/Constants'
import SparkleBadgeView from '../../Gamification/Badge/SparkleBadgeView'
import GoalCard from '../../Goal/GoalCard/GoalCard'
import PostPreviewCard from './PostPreviewCard'
import ShareCard from '../../Common/Card/ShareCard'
import { default_style } from '../../../styles/basic'

// Constants
const DEBUG_KEY = '[ UI PostPreviewCard.PostPreviewBody ]'
const { width } = Dimensions.get('window')

class PostPreviewBody extends React.Component {
    state = {
        mediaModal: false,
    }

    // Current media type is only picture
    renderPostImage(url) {
        // TODO: update this to be able to load image
        if (!url) {
            return null
        }
        const imageUrl = `${IMAGE_BASE_URL}${url}`
        console.log(imageUrl)
        return (
            <TouchableWithoutFeedback
                activeOpacity={1}
                onPress={() => this.setState({ mediaModal: true })}
            >
                <View style={{ marginTop: 8 }}>
                    <ImageBackground
                        style={{
                            ...styles.mediaStyle,
                            ...imagePreviewContainerStyle,
                            borderRadius: 8,
                            backgroundColor: 'black',
                        }}
                        source={{ uri: imageUrl }}
                        imageStyle={{
                            borderRadius: 8,
                            opacity: 0.8,
                            resizeMode: 'cover',
                        }}
                    />
                    {this.renderPostImageModal(imageUrl)}
                </View>
            </TouchableWithoutFeedback>
        )
    }

    renderPostImageModal(imageUrl) {
        return (
            <ImageModal
                mediaRef={imageUrl}
                mediaModal={this.state.mediaModal}
                closeModal={() => this.setState({ mediaModal: false })}
            />
        )
    }

    renderBadgeEarnImage(milestoneIdentifier) {
        return (
            <SparkleBadgeView
                containerStyle={{ marginTop: 8 }}
                milestoneIdentifier={milestoneIdentifier}
                onPress={this.props.openCardContent}
            />
        )
    }

    renderUpdateAttachments(item) {
        const { belongsToGoalStoryline, mediaRef } = item
        const showGoalRefCard = _.get(belongsToGoalStoryline, 'goalRef', false)
        return (
            <View>
                {this.renderPostImage(mediaRef)}
                {showGoalRefCard && [
                    <Text
                        style={[
                            default_style.normalText_2,
                            { marginTop: 12, marginBottom: 4 },
                        ]}
                    >
                        Attached
                    </Text>,
                    <ShareCard
                        goalRef={
                            belongsToGoalStoryline.goalRef._id ||
                            belongsToGoalStoryline.goalRef
                        }
                        containerStyle={{ width: '100%' }}
                    />,
                ]}
            </View>
        )
    }

    render() {
        const { item } = this.props
        if (!item) return null

        const { postType } = item
        if (!isSharedPost(postType)) {
            const milestoneIdentifier = _.get(
                item,
                'milestoneCelebration.milestoneIdentifier'
            )
            if (milestoneIdentifier !== undefined) {
                return this.renderBadgeEarnImage(milestoneIdentifier)
            }
            return this.renderUpdateAttachments(item)
        }

        if (this.props.showRefPreview === false) return null
        const previewItem = switchItem(item, postType)

        if (postType === 'ShareGoal') {
            return (
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: '#F2F2F2',
                        borderRadius: 5,
                        marginTop: 8,
                    }}
                >
                    <GoalCard item={previewItem} isSharedItem={true} />
                </View>
            )
        }

        if (postType === 'SharePost') {
            return (
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: '#F2F2F2',
                        marginTop: 8,
                    }}
                >
                    <PostPreviewCard
                        item={previewItem}
                        hasCaret={false}
                        isSharedItem={true}
                    />
                </View>
            )
        }

        return (
            <View style={{ marginTop: 8 }}>
                <RefPreview
                    item={previewItem}
                    postType={postType}
                    goalRef={item.goalRef}
                />
            </View>
        )
    }
}

const styles = {
    // Post image and modal style
    postImageStyle: {
        width,
        height: width,
    },
    cancelIconStyle: {
        height: 20,
        width: 20,
        justifyContent: 'flex-end',
    },
    mediaStyle: {
        height: width / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
}

const switchItem = (item, postType) =>
    switchCase({
        ShareNeed: getNeedFromRef(item.goalRef, item.needRef),
        ShareGoal: item.goalRef,
        SharePost: item.postRef,
        ShareUser: item.userRef,
        ShareStep: getStepFromGoal(item.goalRef, item.stepRef),
    })('ShareGoal')(postType)

const getStepFromGoal = (goal, stepRef) =>
    getItemFromGoal(goal, 'steps', stepRef)

const getNeedFromRef = (goal, needRef) =>
    getItemFromGoal(goal, 'needs', needRef)

const getItemFromGoal = (goal, type, ref) => {
    let ret
    if (goal) {
        _.get(goal, `${type}`).forEach((item) => {
            if (item._id === ref) {
                ret = item
            }
        })
    }
    return ret
}

export default PostPreviewBody
