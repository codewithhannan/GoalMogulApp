/** @format */

import React from 'react'
import {
    View,
    Dimensions,
    ImageBackground,
    TouchableWithoutFeedback,
} from 'react-native'
import _ from 'lodash'
import Modal from 'react-native-modal'

// Components
import ProgressBar from '../Goal/Common/ProgressBar'
import ImageModal from '../Common/ImageModal'

// Assets
import RefPreview from '../Common/RefPreview'

// Styles
import { imagePreviewContainerStyle } from '../../styles'

// Constants
import { IMAGE_BASE_URL, IS_ZOOMED } from '../../Utils/Constants'
import SparkleBadgeView from '../Gamification/Badge/SparkleBadgeView'

const DEBUG_KEY = '[ UI ActivityCard.ActivityBody ]'
const { width } = Dimensions.get('window')

class ActivityBody extends React.Component {
    state = {
        mediaModal: false,
    }

    renderGoalBody(goalRef) {
        const { start, end, steps, needs } = goalRef

        return (
            <ProgressBar
                onPress={this.props.openCardContent}
                startTime={start}
                endTime={end}
                steps={steps}
                needs={needs}
                goalRef={goalRef}
                width={IS_ZOOMED ? 216 : 268} // TODO: use ratio with screen size rather static number
                size="large"
            />
        )
    }

    // Current media type is only picture
    renderPostImage(url) {
        // TODO: update this to be able to load image
        if (!url) {
            return null
        }
        const imageUrl = `${IMAGE_BASE_URL}${url}`
        return (
            <TouchableWithoutFeedback
                onPress={() => this.setState({ mediaModal: true })}
            >
                <View>
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
                    ></ImageBackground>
                    {this.renderPostImageModal(imageUrl)}
                </View>
            </TouchableWithoutFeedback>
        )
    }

    renderBadgeEarnImage(milestoneIdentifier) {
        return (
            <SparkleBadgeView
                milestoneIdentifier={milestoneIdentifier}
                onPress={this.props.openCardContent}
            />
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

    renderPostBody(postRef) {
        if (!postRef) return null
        const { postType, goalRef, needRef, stepRef, userRef } = postRef
        if (postType === 'General') {
            const milestoneIdentifier = _.get(
                postRef,
                'milestoneCelebration.milestoneIdentifier'
            )
            if (milestoneIdentifier !== undefined) {
                return this.renderBadgeEarnImage(milestoneIdentifier)
            }
            return this.renderPostImage(postRef.mediaRef)
        }

        let item = goalRef
        if (postType === 'ShareNeed') {
            item = getNeedFromRef(goalRef, needRef)
        }

        if (postType === 'ShareStep') {
            item = getStepFromGoal(goalRef, stepRef)
        }

        if (postType === 'ShareUser') {
            item = userRef
        }

        if (postType === 'SharePost') {
            item = postRef.postRef
        }

        return (
            <View>
                <RefPreview item={item} postType={postType} goalRef={goalRef} />
            </View>
        )
    }

    // Render Activity Card body
    renderCardContent(item) {
        const { postRef, goalRef, actedUponEntityType } = item
        if (goalRef === null) {
            console.log(`${DEBUG_KEY}: rendering card content: `, item)
        }

        if (actedUponEntityType === 'Post') {
            return this.renderPostBody(postRef)
        }

        if (actedUponEntityType === 'Goal') {
            return this.renderGoalBody(goalRef)
        }

        // Incorrect acteduponEntityType
        console.warn(
            `${DEBUG_KEY}: incorrect actedUponEntityType: ${actedUponEntityType}`
        )
        return null
    }

    render() {
        const { item } = this.props
        if (!item) return null

        return (
            <View style={{ marginTop: 16 }}>
                {this.renderCardContent(item)}
            </View>
        )
    }
}

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

export default ActivityBody
