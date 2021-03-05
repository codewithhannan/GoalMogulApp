/**
 * This View is the Friend Card View
 *
 * @format
 */

import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'

// Components
import Name from '../../Common/Name'
import ProfileImage from '../../Common/ProfileImage'

/* Assets */
import next from '../../../asset/utils/next.png'

/* Actions */
import {
    updateFriendship,
    blockUser,
    openProfile,
    UserBanner,
} from '../../../actions'
import DelayedButton from '../../Common/Button/DelayedButton'
import { getProfileImageOrDefaultFromUser } from '../../../redux/middleware/utils'

const DEBUG_KEY = '[ UI FriendCardView ]'

class FriendCardView extends React.PureComponent {
    state = {
        requested: false,
        accepted: false,
    }

    handleOnOpenProfile = () => {
        const { _id } = this.props.item
        if (_id) {
            return this.props.openProfile(_id)
        }
    }

    renderProfileImage(item) {
        return (
            <ProfileImage
                imageStyle={{ height: 56, width: 56 }}
                defaultImageStyle={{
                    height: 56,
                    width: 53,
                    borderRadius: 5,
                    marginLeft: 1,
                    marginRight: 1,
                }}
                imageContainerStyle={{ marginTop: 5 }}
                imageUrl={getProfileImageOrDefaultFromUser(item)}
                imageContainerStyle={styles.imageContainerStyle}
                userId={item._id}
            />
        )
    }

    /**
     * Starting 0.4.1, we don't render this button to clear more space for Goals and Needs
     */
    renderButton(item, shouldRenderNextButton) {
        if (shouldRenderNextButton === false) {
            return null
        }
        return (
            <TouchableOpacity
                onPress={() => this.props.openProfile(item._id)}
                activeOpacity={0.6}
                style={styles.nextButtonContainerStyle}
            >
                <Image
                    source={next}
                    style={{ ...styles.nextIconStyle, opacity: 0.8 }}
                />
            </TouchableOpacity>
        )
    }

    /**
     * Render user top goals and needs
     * @param {} item
     */
    renderGoals(item) {
        const { topGoals, topNeeds } = item

        let topGoalText = 'None shared'
        if (
            topGoals !== null &&
            topGoals !== undefined &&
            topGoals.length !== 0
        ) {
            topGoalText = ''
            topGoals.forEach((g, index) => {
                if (index !== 0) {
                    topGoalText = `${topGoalText}, ${g}`
                } else {
                    topGoalText = `${g}`
                }
            })
        }

        let topNeedText = 'None shared'
        if (
            topNeeds !== null &&
            topNeeds !== undefined &&
            topNeeds.length !== 0
        ) {
            topNeedText = ''
            topNeeds.forEach((n, index) => {
                if (index !== 0) {
                    topNeedText = `${topNeedText}, ${n}`
                } else {
                    topNeedText = `${n}`
                }
            })
        }

        return (
            <View style={styles.infoContainerStyle}>
                <View style={{ flex: 1, marginRight: 6 }}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{ marginBottom: 2 }}
                    >
                        <Text style={styles.subTitleTextStyle}>Goals: </Text>
                        <Text style={styles.bodyTextStyle}>{topGoalText}</Text>
                    </Text>
                    <Text numberOfLines={1} ellipsizeMode="tail">
                        <Text style={styles.subTitleTextStyle}>Needs: </Text>
                        <Text style={styles.bodyTextStyle}>{topNeedText}</Text>
                    </Text>
                </View>
            </View>
        )
    }

    renderProfile(item) {
        const { name, profile, headline } = item
        // const detailText = headline || profile.occupation;
        return (
            <View style={{ flex: 1, marginLeft: 13 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Name text={name} />
                    <UserBanner
                        user={item}
                        iconStyle={{
                            marginTop: 1,
                            marginLeft: 7,
                            height: 18,
                            width: 15,
                        }}
                    />
                </View>
                {/* 
            // Disabled this detailText and replaced it with top goals and needs
                <View style={{ flexWrap: 'wrap', marginTop: 4 }}>
                    <Text 
                        style={styles.infoTextStyle}
                        numberOfLines={2}
                        ellipsizeMode='tail'
                    >
                        {detailText}
                    </Text>
                </View> 
            */}
                {this.renderGoals(item)}
            </View>
        )
    }

    render() {
        const { item } = this.props
        if (!item) return null

        const { enableCardOnPress, shouldRenderNextButton } = this.props

        return (
            <DelayedButton
                style={[styles.containerStyle, styles.shadow]}
                activeOpacity={1}
                // disabled={enableCardOnPress === undefined || enableCardOnPress === false} comment out this line as the usage is not clear
                disabled={enableCardOnPress === false}
                onPress={() => this.props.openProfile(item._id)}
            >
                {this.renderProfileImage(item)}
                {this.renderProfile(item)}
                <View
                    style={{
                        borderLeftWidth: 1,
                        borderColor: '#efefef',
                        height: 35,
                    }}
                />
                {/* {this.renderButton(item, shouldRenderNextButton)} */}
            </DelayedButton>
        )
    }
}

const styles = {
    containerStyle: {
        flexDirection: 'row',
        paddingLeft: 13,
        paddingTop: 8,
        paddingBottom: 8,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    // Button styles
    nextButtonContainerStyle: {
        width: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextIconStyle: {
        height: 25,
        width: 26,
        transform: [{ rotateY: '180deg' }],
        tintColor: '#17B3EC',
    },
    // ProfileImage
    imageContainerStyle: {
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: 'white',
    },
    infoTextStyle: {
        color: '#9c9c9c',
        fontSize: 11,
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    // Top goals and need related styles
    infoContainerStyle: {
        flexDirection: 'row',
        flex: 1,
        marginTop: 2,
    },
    subTitleTextStyle: {
        color: '#17B3EC',
        fontSize: 12,
        fontWeight: '600',
    },
    bodyTextStyle: {
        fontSize: 12,
        color: '#9B9B9B',
    },
}

export default connect(null, {
    updateFriendship,
    blockUser,
    openProfile,
})(FriendCardView)
