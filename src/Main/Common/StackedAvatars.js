/** @format */

import _ from 'lodash'
import React from 'react'
import { Image, View } from 'react-native'
// Assets
import defaultProfileImage from '../../asset/utils/defaultUserProfile.png'
import ProfileImage from './ProfileImage'

/* This is a simple logic to render stacked avatars.
 * Could be refactored to user
 */
const StackedAvatars = (props) => {
    const { imageSource } = props
    return (
        <View
            style={{
                flexDirection: 'row',
                marginTop: 5,
                marginBottom: 5,
                alignSelf: 'center',
            }}
        >
            <View style={styles.memberPicturesContainerStyle}>
                <View style={styles.bottomPictureContainerStyle}>
                    <Image source={imageSource} style={styles.pictureStyle} />
                </View>

                <View style={styles.topPictureContainerStyle}>
                    <Image source={imageSource} style={styles.pictureStyle} />
                </View>
            </View>
        </View>
    )
}

const DEBUG_KEY = '[ UI StackedAvatarsV2 ]'
export const StackedAvatarsV2 = (props) => {
    const { participants, chatMembers, tribeMembers } = props
    if (participants) {
        // If there is no members than return null
        if (_.isEmpty(participants)) return null
        const participantPictures = participants
            .filter(
                (participant) =>
                    participant.rsvp === 'Going' ||
                    participant.rsvp === 'Interested'
            )
            .map((participant, index) => {
                if (index > 1) return null
                const { participantRef } = participant
                return (
                    <ProfileImage
                        key={Math.random().toString(36).substr(2, 9)}
                        imageContainerStyle={{
                            ...styles.bottomPictureContainerStyle,
                            marginRight: 0,
                            left: index * 13,
                            zIndex: index + 1,
                        }}
                        imageUrl={participantRef.profile.image}
                        imageStyle={{ ...styles.pictureStyle }}
                    />
                )
            })

        const count = participantPictures.length
        const participantPicturesWidth = count < 2 ? 40 : 50
        return (
            <View
                style={{
                    ...styles.memberPicturesContainerStyle,
                    width: participantPicturesWidth,
                }}
            >
                {participantPictures}
            </View>
        )
    } else if (chatMembers) {
        // If there is no members than return null
        if (_.isEmpty(chatMembers)) return null
        const realMembers = chatMembers.filter(
            (memberDoc) => memberDoc.status != 'JoinRequester'
        )
        let pictures = realMembers
            .filter(
                (memberDoc) =>
                    memberDoc.memberRef &&
                    memberDoc.memberRef.profile &&
                    memberDoc.memberRef.profile.image
            )
            .map((memberDoc, index) => {
                if (index > 1) return null
                const { memberRef } = memberDoc
                return (
                    <ProfileImage
                        key={Math.random().toString(36).substr(2, 9)}
                        imageContainerStyle={{
                            ...styles.bottomPictureContainerStyle,
                            right: index * 13,
                            zIndex: index + 1,
                        }}
                        imageUrl={memberRef.profile.image}
                        imageStyle={styles.pictureStyle}
                    />
                )
            })
        if (pictures.length < 2) {
            const numToAdd = 2 - pictures.length
            for (let i = 0; i < numToAdd; i++) {
                const index = pictures.length
                pictures.push(
                    <ProfileImage
                        key={Math.random().toString(36).substr(2, 9)}
                        imageContainerStyle={{
                            ...styles.bottomPictureContainerStyle,
                            left: index * 13,
                        }}
                        imageUrl={undefined}
                        imageStyle={styles.pictureStyle}
                    />
                )
            }
        }

        const count = pictures.length
        const picturesWidth = count < 2 ? 45 : 50
        return (
            <View
                style={{
                    ...styles.memberPicturesContainerStyle,
                    width: picturesWidth,
                }}
            >
                {pictures}
            </View>
        )
    } else if (tribeMembers) {
        const memberPictures = tribeMembers
            .filter(
                (member) =>
                    member.category === 'Admin' || member.category === 'Member'
            )
            .map((member, index) => {
                if (index > 1) return null
                const { memberRef } = member
                return (
                    <ProfileImage
                        key={Math.random().toString(36).substr(2, 9)}
                        imageContainerStyle={{
                            ...styles.bottomPictureContainerStyle,
                            left: index * 13,
                            zIndex: index + 1,
                        }}
                        imageUrl={memberRef.profile.image}
                        imageStyle={{ ...styles.pictureStyle }}
                    />
                )
            })
        const count = memberPictures.length
        const participantPicturesWidth = count < 2 ? 40 : 50
        return (
            <View
                style={{
                    ...styles.memberPicturesContainerStyle,
                    marginRight: 0,
                    width: participantPicturesWidth,
                }}
            >
                {memberPictures}
            </View>
        )
    }

    return null
}

const PictureDimension = 24
const styles = {
    // Style for member pictures
    memberPicturesContainerStyle: {
        height: 25,
        width: 50,
        marginRight: 2,
    },
    topPictureContainerStyle: {
        height: PictureDimension + 2,
        width: PictureDimension + 2,
        borderRadius: PictureDimension / 2 + 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        border: '1px solid #FDFDFD',
        left: 2,
    },
    bottomPictureContainerStyle: {
        height: PictureDimension + 2,
        width: PictureDimension + 2,
        borderRadius: PictureDimension / 2 + 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #CCC',
        position: 'absolute',
        marginRight: 5,
    },
    pictureStyle: {
        height: PictureDimension,
        width: PictureDimension,
        borderRadius: PictureDimension / 2,
    },
}

export default StackedAvatars
