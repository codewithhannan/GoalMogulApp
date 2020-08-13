/** @format */

import React from 'react'
import {
    View,
    Dimensions,
    ImageBackground,
    TouchableWithoutFeedback,
} from 'react-native'
import _ from 'lodash'

import { switchCase } from '../../../redux/middleware/utils'

// Components
import ImageModal from '../../Common/ImageModal'

// Assets
import RefPreview from '../../Common/RefPreview'

// Styles
import { imagePreviewContainerStyle } from '../../../styles'
import { IMAGE_BASE_URL } from '../../../Utils/Constants'
import SparkleBadgeView from '../../Gamification/Badge/SparkleBadgeView'
import GoalCard from '../../Goal/GoalCard/GoalCard'
import ProfilePostCard from './ProfilePostCard'

// Constants
const DEBUG_KEY = '[ UI ProfilePostCard.ProfilePostBody ]'
const { width } = Dimensions.get('window')

class ProfilePostBody extends React.Component {
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
        return (
            <TouchableWithoutFeedback
                activeOpacity={1}
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
                milestoneIdentifier={milestoneIdentifier}
                onPress={this.props.openCardContent}
            />
        )
    }

    renderPostBody(item) {
        const { postType } = item
        if (postType === 'General') {
            const milestoneIdentifier = _.get(
                item,
                'milestoneCelebration.milestoneIdentifier'
            )
            if (milestoneIdentifier !== undefined) {
                return this.renderBadgeEarnImage(milestoneIdentifier)
            }
            return this.renderPostImage(item.mediaRef)
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
                    }}
                >
                    <ProfilePostCard
                        item={previewItem}
                        hasCaret={false}
                        isSharedItem={true}
                    />
                </View>
            )
        }

        return (
            <View>
                <RefPreview
                    item={previewItem}
                    postType={postType}
                    goalRef={item.goalRef}
                />
            </View>
        )
    }

    render() {
        const { item } = this.props
        if (!item) return null

        return <View style={{ marginTop: 8 }}>{this.renderPostBody(item)}</View>
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

export default ProfilePostBody
