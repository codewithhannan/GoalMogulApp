/**
 * NOTE: this is used in Contacts.js for MeetTab.js. It's no longer used in MeetTabV2.js.
 *
 * @format
 */

import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

// Components
import Name from '../../Common/Name'

// Actions
import { openProfile } from '../../../actions'

// Styles
import { cardBoxShadow } from '../../../styles'
import ProfileImage from '../../Common/ProfileImage'
import { getProfileImageOrDefaultFromUser } from '../../../redux/middleware/utils'

class ContactCard extends Component {
    handleOnOpenProfile = () => {
        const { _id } = this.props.item
        if (_id) {
            return this.props.openProfile(_id)
        }
        // TODO: showToast
    }

    renderProfileImage() {
        return (
            <ProfileImage
                imageStyle={styles.imageStyle}
                imageUrl={getProfileImageOrDefaultFromUser(this.props.item)}
            />
        )
    }

    renderInfo() {
        const { name } = this.props.item
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginRight: 6,
                    alignItems: 'center',
                }}
            >
                <Name text={name} />
            </View>
        )
    }

    renderOccupation() {
        const { profile } = this.props.item
        if (profile.occupation) {
            return (
                <Text
                    style={styles.titleTextStyle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    <Text style={styles.detailTextStyle}>
                        {profile.occupation}
                    </Text>
                </Text>
            )
        }
        return null
    }

    render() {
        const { item } = this.props
        if (!item) return null

        const { headline } = item
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={[styles.containerStyle, cardBoxShadow]}
                onPress={this.handleOnOpenProfile}
            >
                {this.renderProfileImage()}

                <View style={styles.bodyContainerStyle}>
                    {this.renderInfo()}
                    {this.renderOccupation()}
                    <Text
                        style={styles.jobTitleTextStyle}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {headline}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = {
    containerStyle: {
        flexDirection: 'row',
        marginTop: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 8,
        paddingBottom: 8,
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    bodyContainerStyle: {
        marginLeft: 8,
        flex: 1,
    },
    infoContainerStyle: {
        flexDirection: 'row',
        flex: 1,
    },
    imageStyle: {
        height: 48,
        width: 48,
    },
    buttonContainerStyle: {
        marginLeft: 8,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    buttonStyle: {
        width: 70,
        height: 26,
        borderWidth: 1,
        borderColor: '#17B3EC',
        borderRadius: 13,
    },
    buttonTextStyle: {
        color: '#17B3EC',
        fontSize: 11,
        fontWeight: '700',
        paddingLeft: 1,
        padding: 0,
        alignSelf: 'center',
    },
    settingIconStyle: {
        height: 20,
        width: 20,
    },
    buttonIconStyle: {
        marginTop: 1,
    },
    needContainerStyle: {},
    titleTextStyle: {
        color: '#17B3EC',
        fontSize: 11,
        paddingTop: 1,
        paddingBottom: 1,
    },
    detailTextStyle: {
        color: '#000000',
        paddingLeft: 3,
    },
    jobTitleTextStyle: {
        color: '#17B3EC',
        fontSize: 11,
        fontWeight: '800',
        paddingTop: 5,
        paddingBottom: 3,
    },
    friendTextStyle: {
        paddingLeft: 10,
        color: '#17B3EC',
        fontSize: 9,
        fontWeight: '800',
        maxWidth: 120,
    },
}

export default connect(null, {
    openProfile,
})(ContactCard)
