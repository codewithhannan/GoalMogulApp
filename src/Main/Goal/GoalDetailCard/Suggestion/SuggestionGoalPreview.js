/** @format */

// This component is used to display goal on a user's profile page
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import timeago from 'timeago.js'
import { connect } from 'react-redux'

// Components
import Headline from '../../Common/Headline'
import Timestamp from '../../Common/Timestamp'
import ProfileImage from '../../../Common/ProfileImage'
import { getProfileImageOrDefaultFromUser } from '../../../../redux/middleware/utils'

class SuggestionGoalPreview extends React.Component {
    renderProfileImage(item) {
        // Not passing in userId since we don't want to user profile here
        return (
            <ProfileImage
                imageStyle={{ width: 55, height: 55 }}
                imageUrl={getProfileImageOrDefaultFromUser(item.owner)}
                imageContainerStyle={styles.imageContainerStyle}
                disabled
            />
        )
    }

    // user basic information
    renderUserDetail(item) {
        const { title, owner, category, _id, created } = item
        const timeStamp =
            created === undefined || created.length === 0 ? new Date() : created
        // TODO: verify all the fields have data
        return (
            <View style={{ flexDirection: 'row', flex: 1 }}>
                <View style={{ marginLeft: 15, flex: 1 }}>
                    <Headline
                        name={owner.name}
                        category={category}
                        hasCaret={null}
                        user={owner}
                        disabled
                    />
                    <Timestamp time={timeago().format(timeStamp)} />
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Text
                            style={{
                                flex: 1,
                                flexWrap: 'wrap',
                                color: 'black',
                                fontSize: 15,
                            }}
                            ellipsizeMode="tail"
                        >
                            {title}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        const { item } = this.props
        if (!item) return null

        return (
            <View style={styles.containerStyle}>
                <View style={{ flexDirection: 'row' }}>
                    {this.renderProfileImage(item)}
                    {this.renderUserDetail(item)}
                </View>
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        backgroundColor: 'white',
        margin: 12,
    },
    iconStyle: {
        alignSelf: 'center',
        fontSize: 20,
        marginLeft: 5,
        marginTop: 2,
    },
    borderShadow: {
        shadowColor: 'lightgray',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 1,
    },
    imageContainerStyle: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
        marginLeft: 3,
    },
}

const mapStateToProps = (state) => {
    const { userId } = state.user

    return {
        userId,
    }
}

export default connect(mapStateToProps, null)(SuggestionGoalPreview)
