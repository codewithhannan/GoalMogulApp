/**
 * Entry point for user invitation banner at the top of MeetTab
 *
 * @format
 */

import React from 'react'
import { View, Image, Text, Dimensions } from 'react-native'
import { walkthroughable, CopilotStep } from 'react-native-copilot-gm'

/* Styles */
import { color } from '../../../styles/basic'

/* Assets */
import Friends from '../../../asset/utils/Friends.png'
import Suggest from '../../../asset/utils/Suggest.png'

/* Components */
import DelayedButton from '../../Common/Button/DelayedButton'

/* Constants */
const { width } = Dimensions.get('window')
const WalkableView = walkthroughable(View)

class FriendInvitationCTR extends React.PureComponent {
    handleOnPress = () => {
        this.props.handleInviteFriends()
    }

    renderInvitationButton() {
        return (
            <DelayedButton
                activeOpacity={0.6}
                onPress={this.handleOnPress}
                style={styles.buttonContainerStyle}
            >
                <Text style={styles.buttonTextStyle}>Invite friends now</Text>
                <CopilotStep
                    text={this.props.tutorialText}
                    order={1}
                    name="invite_friend"
                >
                    <WalkableView
                        style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }}
                    />
                </CopilotStep>
            </DelayedButton>
        )
    }

    renderBackgroundImage() {
        return (
            <View style={styles.backgroundImageContainerStyle}>
                <Image
                    source={Suggest}
                    style={{
                        alignSelf: 'flex-end',
                        width: 3 * (width / 10),
                        height: 2 * (width / 10),
                        marginBottom: 15,
                    }}
                />
                <View style={{ flex: 1 }} />
                <Image
                    source={Friends}
                    style={{
                        alignSelf: 'flex-end',
                        width: 3 * (width / 10),
                        height: 2 * (width / 10) + 10,
                        marginRight: 5,
                    }}
                />
            </View>
        )
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                {this.renderBackgroundImage()}
                <Text style={styles.textStyle}>
                    Great friends help each other achieve more.
                </Text>
                <Text style={[styles.textStyle, styles.boldedTextStyle]}>
                    Add friends who like to get stuff done
                </Text>
                {this.renderInvitationButton()}
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        width,
        paddingTop: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        backgroundColor: 'white',
    },
    buttonContainerStyle: {
        backgroundColor: color.GM_BLUE,
        borderRadius: 8,
        borderColor: color.GM_BLUE,
        borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        marginTop: 20,
        zIndex: 2,
        padding: 9,
        paddingLeft: 12,
        paddingRight: 12,
    },
    buttonTextStyle: {
        fontSize: 11,
        color: 'white',
        fontWeight: '700',
    },
    textStyle: {
        fontSize: 15,
        color: '#5e5e5e',
        zIndex: 2,
    },
    boldedTextStyle: {
        fontWeight: '700',
        fontSize: 17,
        marginTop: 5,
    },
    // Background image styles
    backgroundImageContainerStyle: {
        zIndex: 1,
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
    },
}

export default FriendInvitationCTR
