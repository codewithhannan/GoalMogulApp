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

    render() {
        const { item } = this.props
        if (!item) return null
        const { name, headline, _id, profile, occupation } = this.props.item
        return (
            <View style={styles.containerStyle}>
                <ProfileImage
                    imageStyle={{ height: 55, width: 55, borderRadius: 5 }}
                    imageUrl={profile ? profile.image : undefined}
                    imageContainerStyle={{ ...styles.imageContainerStyle }}
                    userId={_id}
                    actionDecorator={this.props.callback}
                />
                <DelayedButton
                    style={styles.bodyContainerStyle}
                    activeOpacity={0.6}
                    onPress={() => this.handleOpenProfile(_id)}
                >
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
                    <View style={{ flex: 1, marginTop: 5 }}>
                        <Text
                            style={styles.titleTextStyle}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {headline || occupation}
                        </Text>
                    </View>
                </DelayedButton>
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10,
    },
    bodyContainerStyle: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flex: 1,
        marginLeft: 8,
        marginRight: 8,
    },
    titleTextStyle: {
        fontSize: 11,
        color: '#9B9B9B',
    },
    imageStyle: {
        marginRight: 3,
    },
    imageContainerStyle: {
        borderWidth: 0.5,
        padding: 1.5,
        borderColor: 'lightgray',
        alignItems: 'center',
        borderRadius: 6,
        alignSelf: 'center',
        backgroundColor: 'white',
    },
}

export default connect(null, { openProfile })(UserCard)
