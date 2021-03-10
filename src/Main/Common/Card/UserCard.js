/**
 * There are multiple different user cards throughout the app. This is the first effort to align
 * all user cards.
 *
 * @format
 */

import React from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import ProfileImage from '../ProfileImage'
import Name from '../../Goal/Common/Name'
import { UserBanner, openProfile } from '../../../actions'
import DelayedButton from '../Button/DelayedButton'
import { getProfileImageOrDefaultFromUser } from '../../../redux/middleware/utils'
import { color } from '../../../styles/basic'

class UserCard extends React.PureComponent {
    handleOpenProfile = (_id) => {
        // Pass openProfile as a callback to a callback function
        if (this.props.callback) {
            this.props.callback(() => this.props.openProfile(_id))
            return
        }

        // If no callback, then directly open profile
        this.props.openProfile(_id)
    }

    renderHeadline(headline, occupation) {
        if (!headline && !occupation) {
            return
        }
        return (
            <View style={{ flex: 1, marginTop: 5 }}>
                <Text
                    style={styles.titleTextStyle}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {headline || occupation}
                </Text>
            </View>
        )
    }

    render() {
        const { item } = this.props
        if (!item) return null
        const { name, headline, _id, occupation } = item
        return (
            <DelayedButton
                underlayColor={color.GM_LIGHT_GRAY}
                touchableHighlight
                onPress={() => this.handleOpenProfile(_id)}
            >
                <View style={styles.containerStyle}>
                    <ProfileImage
                        imageStyle={{ height: 48, width: 48 }}
                        imageUrl={getProfileImageOrDefaultFromUser(item)}
                        userId={_id}
                        actionDecorator={this.props.callback}
                    />
                    <View style={styles.containerContentWrapper}>
                        {/* Name and banner  */}
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 3,
                            }}
                        >
                            <Name text={name} />
                            <UserBanner
                                user={item}
                                iconStyle={{
                                    marginTop: 1,
                                    marginLeft: 5,
                                    height: 18,
                                    width: 15,
                                }}
                            />
                        </View>

                        {/* Headline */}
                        {this.renderHeadline(headline, occupation)}
                    </View>
                </View>
            </DelayedButton>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    containerContentWrapper: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        flex: 1,
        marginLeft: 8,
    },
    titleTextStyle: {
        fontSize: 11,
        color: '#9B9B9B',
    },
    imageStyle: {
        marginRight: 3,
    },
}

export default connect(null, { openProfile })(UserCard)
