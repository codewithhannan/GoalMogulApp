/** @format */

import React from 'react'
import {
    View,
    Image,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from 'react-native'
import timeago from 'timeago.js'
import { connect } from 'react-redux'

// Assets
// TODO: set default tribe picture
import tribeDefaultIcon from '../../../asset/explore/tribe.png'

/* Components */
import DelayedButton from '../../Common/Button/DelayedButton'

// Actions
import {
    tribeDetailOpen,
    requestJoinTribe,
    acceptTribeInvit,
    declineTribeInvit,
} from '../../../redux/modules/tribe/MyTribeActions'
import { IMAGE_BASE_URL } from '../../../Utils/Constants'
import { decode } from '../../../redux/middleware/utils'
import { default_style, color } from '../../../styles/basic'

const DEBUG_KEY = '[UI Tribe Card] '

class MyTribeCard extends React.Component {
    onCardPress = () => {
        // console.log(`${DEBUG_KEY} open Tribe Detail with item: `, this.props.item);
        this.props.tribeDetailOpen(this.props.item)
    }

    renderTimeStamp() {
        const { created } = this.props.item
        const timeStamp =
            created === undefined || created.length === 0 ? new Date() : created
        const { timeStampContainerStyle, timeStampTextStyle } = styles

        return (
            <View style={timeStampContainerStyle}>
                <Text style={[default_style.smallText_2, timeStampTextStyle]}>
                    {timeago().format(timeStamp)}
                </Text>
            </View>
        )
    }

    renderTribeImage() {
        // If no tribe image, render a default one
        const { picture } = this.props.item
        if (picture && picture.length > 0) {
            // Render the corresponding image
            const imageUrl = `${IMAGE_BASE_URL}${picture}`
            return (
                <View style={styles.imageContainerStyle}>
                    <Image
                        style={styles.imageStyle}
                        source={{ uri: imageUrl }}
                    />
                </View>
            )
        }

        // Render default image
        return (
            <View style={styles.imageContainerStyle}>
                <Image style={styles.imageStyle} source={tribeDefaultIcon} />
            </View>
        )
    }

    renderTribeTitle() {
        const { name } = this.props.item
        return (
            <View style={{ flexDirection: 'row' }}>
                <Text
                    style={[default_style.titleText_2, styles.titleTextStyle]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {decode(name)}
                </Text>
            </View>
        )
    }

    renderDescription() {
        const { description } = this.props.item
        return (
            <View style={{ flexDirection: 'row' }}>
                <Text
                    style={[
                        default_style.normalText_2,
                        styles.descriptionTextStyle,
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {decode(description)}
                </Text>
            </View>
        )
    }

    // Info includes memeber count for now
    renderTribeInfo() {
        const { memberCount } = this.props.item
        const member = memberCount === 1 ? ' Member' : ' Members'

        return (
            <View>
                <Text
                    style={[
                        default_style.normalText_2,
                        styles.memberInfoTextStyle,
                    ]}
                >
                    <Text>{memberCount}</Text>
                    {member}
                </Text>
            </View>
        )
    }

    renderTribeAction() {
        const tribeId = this.props.item._id
        if (this.props.tribeAction && this.props.tribeAction == 'requested') {
            return (
                <View style={styles.tribeActionStyle}>
                    <TouchableOpacity
                        style={[
                            styles.buttonStyle,
                            {
                                backgroundColor: color.GM_BACKGROUND,
                            },
                        ]}
                        onPress={() =>
                            this.props.requestJoinTribe(
                                tribeId,
                                false,
                                this.props.pageId,
                                this.props.item.isAutoAcceptEnabled
                            )
                        }
                    >
                        <Text
                            style={[
                                default_style.buttonText_2,
                                {
                                    color: color.TEXT_COLOR.DARK,
                                },
                            ]}
                        >
                            Withdraw
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }
        if (this.props.tribeAction && this.props.tribeAction == 'invited') {
            return (
                <View style={styles.tribeActionStyle}>
                    <TouchableOpacity
                        style={[styles.buttonStyle]}
                        onPress={() => this.props.acceptTribeInvit(tribeId)}
                    >
                        <Text
                            style={[
                                default_style.buttonText_2,
                                {
                                    color: color.TEXT_COLOR.LIGHT,
                                },
                            ]}
                        >
                            Accept
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.buttonStyle,
                            {
                                backgroundColor: color.GM_BACKGROUND,
                            },
                        ]}
                        onPress={() => this.props.declineTribeInvit(tribeId)}
                    >
                        <Text
                            style={[
                                default_style.buttonText_2,
                                {
                                    color: color.TEXT_COLOR.DARK,
                                },
                            ]}
                        >
                            Decline
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    render() {
        return (
            <DelayedButton
                activeOpacity={1}
                onPress={this.onCardPress}
                delay={2000}
            >
                <View
                    style={[
                        styles.containerStyle,
                        this.props.tribeAction ? { height: 130 } : null,
                    ]}
                >
                    {this.renderTribeImage()}
                    {this.renderTimeStamp()}
                    <View style={styles.detailContainerStyle}>
                        {this.renderTribeTitle()}
                        {this.renderDescription()}
                        {this.renderTribeInfo()}
                        {this.renderTribeAction()}
                    </View>
                </View>
            </DelayedButton>
        )
    }
}

const ProfileImageWidth = 56
const CardHeight = 80
const styles = {
    containerStyle: {
        flexDirection: 'row',
        marginTop: 8,
        paddingBottom: 8,
        height: CardHeight,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
    },
    // Image related styles
    imageContainerStyle: {
        borderWidth: 0.5,
        padding: 1,
        marginTop: 8,
        borderColor: 'lightgray',
        alignItems: 'center',
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginLeft: 15,
    },
    imageStyle: {
        width: ProfileImageWidth,
        height: ProfileImageWidth,
        borderRadius: 5,
    },
    // Timestamp style
    timeStampContainerStyle: {
        position: 'absolute',
        top: 0,
        right: 5,
        padding: (CardHeight - ProfileImageWidth) / 2,
    },
    timeStampTextStyle: {
        color: '#28485e',
        fontWeight: '700',
    },
    // Tribe detail related style
    detailContainerStyle: {
        justifyContent: 'space-between',
        paddingTop: (CardHeight - ProfileImageWidth) / 2,
        paddingBottom: (CardHeight - ProfileImageWidth) / 2,
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'column',
        flex: 1,
    },
    titleTextStyle: {
        flex: 1,
        flexWrap: 'wrap',
        marginRight: 80,
    },
    descriptionTextStyle: {
        flex: 1,
        flexWrap: 'wrap',
        color: color.GM_MID_GREY,
    },
    memberInfoTextStyle: {
        color: '#b3b8b9',
    },
    tribeActionStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    buttonStyle: {
        marginTop: 12,
        marginRight: 12,
        width: 120,
        backgroundColor: color.GM_BLUE,
        paddingVertical: 10,
        flexDirection: 'row',
        borderRadius: 3,
        justifyContent: 'center',
    },
}

export default connect(null, {
    tribeDetailOpen,
    requestJoinTribe,
    acceptTribeInvit,
    declineTribeInvit,
})(MyTribeCard)
