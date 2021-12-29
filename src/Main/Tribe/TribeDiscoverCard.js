/**
 * Tribe discover page card
 * @format
 */
import React from 'react'
import { connect } from 'react-redux'
import DelayedButton from '../Common/Button/DelayedButton'
// import { getImageOrDefault, decode } from '../../redux/middleware/utils'
import tribe_default_icon from '../../asset/utils/tribeIcon.png'
import { View, Image, Text } from 'react-native'
// import { Icon } from '@ui-kitten/components'
import { color } from '../../styles/basic'
import MEMBERS from '../../asset/utils/mutualFriends.png'
import TRIBE_FRIENDS from '../../asset/utils/tribeFriends.png'

import {
    requestJoinTribe,
    tribeDetailOpen,
} from '../../redux/modules/tribe/MyTribeActions'
import ProfileImage from '../Common/ProfileImage'

import { refreshProfileData } from '../../actions'

let pageAb
class TribeDiscoverCard extends React.PureComponent {
    state = {
        requested: false,
        joined: false,
        selected: false,
    }

    componentDidMount() {
        const pageId = this.props.refreshProfileData(this.props.userId)
        pageAb = pageId
    }

    renderTitle(item) {
        let title = item.name
        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: 2,
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{ color: 'black', fontSize: 18, fontWeight: '600' }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {title}
                </Text>
            </View>
        )
    }

    renderButtonText = () => {
        if (this.props.isSeekTribe) {
            if (this.state.selected) {
                return 'Posted'
            }
            return 'Select'
        } else {
            if (this.state.requested) {
                return 'Requested'
            } else if (this.state.joined) {
                return 'Joined'
            } else {
                return 'Join'
            }
        }
    }

    handleJoinButton = (item) => {
        const { onPress } = this.props
        const { requested, joined } = this.state

        if (item.isAutoAcceptEnabled && !this.state.joined) {
            this.setState({ joined: true })
            this.props.requestJoinTribe(
                item._id,
                true,
                pageAb,
                item.isAutoAcceptEnabled
            )
        } else if (requested || joined) {
            onPress(item)
        } else {
            this.setState({ requested: true })
            this.props.requestJoinTribe(
                item._id,
                true,
                pageAb,
                item.isAutoAcceptEnabled
            )
        }
    }

    renderButton(item) {
        const { requested } = this.state
        return (
            <View style={styles.iconContainerStyle}>
                <DelayedButton
                    disabled={this.state.selected}
                    activeOpacity={0.6}
                    onPress={() => {
                        if (this.props.isSeekTribe) {
                            this.setState({ selected: true })
                            return this.props.onPress(item)
                        }
                        this.handleJoinButton(item)
                    }}
                    style={{
                        height: 31,
                        width: requested ? 100 : 65,
                        backgroundColor: requested ? '#BDBDBD' : color.GM_BLUE,
                        borderRadius: 3,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 3,
                    }}
                >
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 12,
                            fontWeight: '600',
                            lineHeight: 14,
                            fontFamily: 'SFProDisplay-Semibold',
                        }}
                    >
                        {this.renderButtonText()}
                    </Text>
                </DelayedButton>
            </View>
        )
    }
    renderInformation(item) {
        let count = item.memberCount
        let friendCount = item.friendsCount

        if (count > 999) {
            count = '1k+'
        }
        if (friendCount > 999) {
            friendCount = '1k+'
        }
        const defaultTextStyle = { color: '#abb1b0', fontSize: 10 }

        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 3,
                }}
            >
                {/* <Text style={defaultTextStyle}>{category}</Text> */}
                {/* <Dot /> */}
                <Image
                    source={MEMBERS}
                    style={{ height: 12, width: 12, marginHorizontal: 1 }}
                    resizeMode="contain"
                />
                {count ? (
                    <View style={{ flexDirection: 'row', marginHorizontal: 3 }}>
                        <Text
                            style={{
                                ...defaultTextStyle,
                                color: '#737475',
                                fontSize: 12,
                                fontWeight: '500',
                            }}
                        >
                            {count}
                        </Text>
                        <Text
                            style={{
                                ...defaultTextStyle,
                                color: '#737475',
                                fontSize: 12,
                                fontWeight: '500',
                            }}
                        >
                            &nbsp;{item.memberCount > 1 ? 'members' : 'member'}
                        </Text>
                    </View>
                ) : null}

                {friendCount > 0 ? (
                    <>
                        <Image
                            source={TRIBE_FRIENDS}
                            style={{
                                height: 12,
                                width: 12,
                                marginHorizontal: 1,
                            }}
                            resizeMode="contain"
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                marginHorizontal: 3,
                            }}
                        >
                            <Text
                                style={{
                                    ...defaultTextStyle,
                                    color: '#737475',
                                    fontSize: 12,
                                    fontWeight: '500',
                                }}
                            >
                                {friendCount}
                            </Text>
                            <Text
                                style={{
                                    ...defaultTextStyle,
                                    color: '#737475',
                                    fontSize: 12,
                                    fontWeight: '500',
                                }}
                            >
                                &nbsp;
                                {item.friendsCount > 1 ? 'friends' : 'friend'}
                            </Text>
                        </View>
                    </>
                ) : null}
            </View>
        )
    }

    renderCardContent(item) {
        let content
        if (item.description) {
            content = item.description
        }

        return (
            <View
                style={{
                    justifyContent: 'flex-start',
                    flex: 1,
                    marginLeft: 10,
                }}
            >
                {this.renderTitle(item)}
                {this.renderInformation(item)}
                <View style={{ marginTop: item.memberCount ? 3 : 6 }}>
                    <Text
                        style={{
                            flex: 1,
                            flexWrap: 'wrap',
                            color: '#000000',
                            fontSize: 14,
                            // letterSpacing: -0.216066,
                            fontFamily: 'SFProDisplay-Regular',
                        }}
                        // numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {content}
                    </Text>
                </View>
            </View>
        )
    }

    render() {
        const { onPress, item, canSelect, type } = this.props
        const { selected, name, picture, description, memberCount } = item
        const containerStyle = selected
            ? styles.tribeCardSelectedContainerStyle
            : styles.tribeCardContainerStyle

        console.log('THIS IS TRIBE TO DISCOVER', item)

        return (
            <DelayedButton
                // style={containerStyle}
                onPress={() => onPress(item)}
                activeOpacity={0.9}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 1,
                        paddingLeft: 12,
                        paddingRight: 12,
                        paddingTop: 8,
                        paddingBottom: 8,
                        backgroundColor: '#ffffff',
                        shadowColor: 'gray',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 2,
                    }}
                >
                    <ProfileImage
                        imageStyle={{
                            height: 48,
                            width: 48,
                            borderRadius: 0,
                            borderColor: 'transparent',
                        }}
                        imageUrl={picture}
                        rounded
                        imageContainerStyle={styles.imageContainerStyle}
                        defaultUserProfile={tribe_default_icon}
                    />
                    {this.renderCardContent(item)}
                    {this.renderButton(item, type)}

                    {/* {canSelect && (
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 16,
                                left: 16,
                                zIndex: 2,
                                borderRadius: 10,
                                borderWidth: 0.5,
                                backgroundColor: selected
                                    ? color.GM_BLUE
                                    : color.GM_CARD_BACKGROUND,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderColor: selected
                                    ? color.GM_BLUE
                                    : '#8C8C8C',
                            }}
                        >
                            <Icon
                                name="check"
                                pack="material-community"
                                style={{
                                    tintColor: selected
                                        ? color.GM_CARD_BACKGROUND
                                        : '#8C8C8C',
                                    height: 20,
                                    width: 20,
                                }}
                            />
                        </View>
                    )} */}
                    {/* {picture ? (
                        <Image
                            style={{
                                height: (width - 32) / 2.2,
                                width: width - 32,
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5,
                            }}
                            resizeMode="cover"
                            source={getImageOrDefault(picture)}
                        />
                    ) : (
                        <View
                            style={{
                                height: (width - 32) / 2.2,
                                width: width - 32,
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Icon
                                pack="material-community"
                                name="flag"
                                style={{ height: 72 }}
                            />
                        </View>
                    )} */}
                </View>
                {/* <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            paddingVertical: 8,
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={[
                                default_style.titleText_1,
                                {
                                    letterSpacing: text.LETTER_SPACING.REGULAR,
                                    flex: 1,
                                },
                            ]}
                        >
                            {name}
                        </Text>
                        <Text
                            style={[
                                default_style.normalText_1,
                                {
                                    color: '#828282',
                                    letterSpacing: text.LETTER_SPACING.REGULAR,
                                },
                            ]}
                        >
                            {memberCount}{' '}
                            {memberCount > 1 ? 'members' : 'member'}
                        </Text>
                    </View>
                    <Text
                        style={[
                            default_style.normalText_1,
                            {
                                color: '#828282',
                                letterSpacing: text.LETTER_SPACING.REGULAR,
                            },
                        ]}
                    >
                        {decode(description)}
                    </Text>
                </View> */}
            </DelayedButton>
        )
    }
}

const styles = {
    tribeCardContainerStyle: {
        backgroundColor: 'white',
        borderRadius: 5,
        justifyContent: 'center',
        flex: 1,
        marginTop: 20,
        marginLeft: 16,
        marginRight: 16,
        shadowOffset: {
            width: -2,
            height: 2,
        },
        shadowRadius: 3,
        shadowOpacity: 0.9,
        shadowColor: 'rgba(0,0,0,0.1)',
        borderWidth: 0.5,
        borderColor: '#FAFAFA',
    },
    tribeCardSelectedContainerStyle: {
        backgroundColor: '#F6FDFF',
        borderRadius: 5,
        justifyContent: 'center',
        flex: 1,
        marginTop: 20,
        marginLeft: 16,
        marginRight: 16,
        shadowOffset: {
            width: -2,
            height: 2,
        },
        shadowRadius: 3,
        shadowOpacity: 0.9,
        shadowColor: 'rgba(0,0,0,0.1)',
        borderWidth: 0.5,
        borderColor: color.GM_BLUE,
    },
}

const mapStateToProps = (state, props) => {
    const { userId } = state.user

    return {
        userId,
    }
}

export default connect(mapStateToProps, {
    tribeDetailOpen,
    requestJoinTribe,
    refreshProfileData,
})(TribeDiscoverCard)
