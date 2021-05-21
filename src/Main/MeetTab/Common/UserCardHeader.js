/** @format */

import React from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import { text, default_style } from '../../../styles/basic'
import { UserBanner, openProfile } from '../../../actions'
import Icons from '../../../asset/base64/Icons'
import ProfileImage from '../../Common/ProfileImage'
import Name from '../../Common/Name'
import DelayedButton from '../../Common/Button/DelayedButton'
import { Icon } from '@ui-kitten/components'
import { getProfileImageOrDefaultFromUser } from '../../../redux/middleware/utils'

/**
 * This class render user object
 * props: {
 *      optionOnPress: () => (),     // callback to open options. Requried if options are available
 *      user: Object                 // user object for the header to display
 * }
 */
class UserCardHeader extends React.PureComponent {
    handleOpenProfile = () => {
        this.props.openProfile(this.props.user._id)
    }

    renderHeader(user) {
        const { name, profile, mutualFriendCount } = user
        if (!profile) {
            // TODO: add sentry error logging
            return null
        }
        // Only render occupation in header if it exists
        const detailText = profile.occupation || ''

        return (
            <View
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
            >
                <ProfileImage
                    imageUrl={getProfileImageOrDefaultFromUser(user)}
                />
                <View style={{ marginLeft: 7, flex: 1 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,
                        }}
                    >
                        <Name
                            text={name}
                            textStyle={default_style.titleText_2}
                        />
                        <UserBanner
                            user={user}
                            iconStyle={{ marginLeft: 5, height: 18, width: 15 }}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                flex: 1,
                                flexWrap: 'wrap',
                            }}
                        >
                            <Text
                                style={styles.infoTextStyle}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {detailText}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 2,
                            flex: 1,
                        }}
                    >
                        <View
                            style={{
                                height: 14,
                                width: 14,
                                marginRight: 4,
                                marginBottom: 2,
                            }}
                        >
                            <Image
                                source={Icons.Connection}
                                style={{ flex: 1, tintColor: '#777777' }}
                                resizeMode="contain"
                                resizeMethod="scale"
                            />
                        </View>
                        <Text
                            style={[
                                default_style.smallText_1,
                                { color: '#555555' },
                            ]}
                        >
                            <Text
                                style={{ fontWeight: 'bold' }}
                            >{`${mutualFriendCount} `}</Text>
                            {mutualFriendCount && mutualFriendCount > 1
                                ? 'friends'
                                : 'friend'}{' '}
                            in common
                        </Text>
                    </View>
                </View>
                {/* Placeholder for options icon */}
                <View style={{ width: 20 }} />
            </View>
        )
    }

    renderOptions = () => {
        if (this.props.hideOptions && this.props.optionsOnPress) {
            return null
        } else if (this.props.optionsOnPress) {
            return (
                <DelayedButton
                    style={{
                        position: 'absolute',
                        right: -16,
                        top: -16,
                        paddingBottom: 23,
                        paddingLeft: 25,
                        paddingTop: 14,
                        paddingRight: 14,
                    }}
                    onPress={this.props.optionsOnPress}
                >
                    <Icon
                        name="dots-horizontal"
                        pack="material-community"
                        style={{ height: 24, color: '#828282' }}
                    />
                </DelayedButton>
            )
        } else {
            return null
        }
    }

    render() {
        const { user, optionsOnPress } = this.props

        if (!user) {
            return null
        }
        return (
            <View style={styles.containerStyle}>
                {this.renderHeader(user)}
                {this.renderOptions()}
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
    },
    imageContainerStyle: {
        borderWidth: 0.5,
        borderColor: 'lightgray',
        alignItems: 'center',
        borderRadius: 30,
        alignSelf: 'flex-start',
        backgroundColor: 'white',
    },
    infoTextStyle: {
        color: '#9B9B9B',
        fontSize: 11,
        fontFamily: text.FONT_FAMILY.BOLD,
        marginLeft: 5,
    },
}

export default connect(null, {
    openProfile,
})(UserCardHeader)
