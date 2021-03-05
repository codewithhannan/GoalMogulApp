/**
 * This UI implemetns the Welcome screen from zpl.io/V457KLQ
 *
 * @format
 */

import React from 'react'
import { View, Text, Image } from 'react-native'
import Constants from 'expo-constants'
import Modal from 'react-native-modal'
import ProfileImage from '../Common/ProfileImage'
import DelayedButton from '../Common/Button/DelayedButton'
import { RightArrowIcon } from '../../Utils/Icons'
import profile_people_image from '../../asset/suggestion/friend.png'
import HeaderLogo from '../../asset/header/header-logo-white.png'
import Icons from '../../asset/base64/Icons'

const { MikeIcon } = Icons

class WelcomSreen extends React.PureComponent {
    handleStartOnPress = () => {
        this.closeModal()
    }

    renderHeader() {
        return (
            <View style={styles.headerContainerStyle}>
                <Image style={styles.headerImageStyle} source={HeaderLogo} />
                {/* <Text style={styles.welcomeTextStyle}>Welcome to GoalMogul,</Text>
                <Text style={styles.nameTextStyle}>{this.props.name}</Text> */}
                <Text style={styles.nameTextStyle}>Welcome</Text>
            </View>
        )
    }

    renderPrompt() {
        let firstName = this.props.name
        if (firstName) {
            firstName = firstName.split(' ')[0]
        }
        return (
            <View style={{ alignItems: 'center', ...styles.shadow }}>
                <View style={styles.caretStyle} />
                <View style={styles.promptContainerStyle}>
                    <View style={{ margin: 12 }}>
                        <Text style={styles.promptWelcomeTextStyle}>
                            Welcome to GoalMogul,
                        </Text>
                        <Text style={styles.promptWelcomeTextStyle}>
                            {firstName}
                        </Text>
                    </View>
                    <Text style={styles.promptTextStyle}>
                        Whatever you want done,
                    </Text>
                    <Text style={styles.promptTextStyle}>
                        We hope you'll get it done here,
                    </Text>
                    <Text style={styles.promptTextStyle}>
                        with the help of your friends!
                    </Text>

                    <Text style={{ ...styles.promptTextStyle, margin: 12 }}>
                        Tap{' '}
                        <Text style={{ color: 'rgba(0, 202, 250, 1)' }}>
                            'Start'
                        </Text>{' '}
                        to begin!
                    </Text>
                </View>
            </View>
        )
    }

    closeModal() {
        this.props.closeModal && this.props.closeModal()
    }

    render() {
        return (
            <Modal
                backdropColor={'black'}
                isVisible={this.props.isVisible}
                backdropOpacity={0.7}
                style={{ flex: 1, marginTop: Constants.statusBarHeight + 15 }}
            >
                <View style={styles.containerStyle}>
                    {this.renderHeader()}
                    <View
                        style={{
                            ...styles.mainContentContainerStyle,
                            ...styles.shadow,
                        }}
                    >
                        <View
                            style={{
                                paddingTop: 30,
                                paddingBottom: 10,
                                alignItems: 'center',
                            }}
                        >
                            <View style={styles.profileImageContainerStyle}>
                                <Image
                                    source={MikeIcon}
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 4,
                                    }}
                                />
                            </View>
                            {/* <ProfileImage 
                                imageUrl={MikeIcon.uri}
                                defaultImageSource={profile_people_image}
                                disabled
                                imageStyle={{ width: 60, height: 60, borderRadius: 4 }}
                                defaultImageStyle={{ width: 60, height: 60 }}
                                defaultImageContainerStyle={styles.profileImageContainerStyle}
                                imageContainerStyle={style.profileImageContainerStyle}
                            /> */}
                            <Text
                                style={{
                                    color: 'rgba(121, 121, 121, 1)',
                                    fontSize: 12,
                                }}
                            >
                                Mike Cheng, CEO
                            </Text>
                        </View>

                        {this.renderPrompt()}

                        <DelayedButton
                            style={{
                                ...styles.buttonContainerStyle,
                                ...styles.shadow,
                                shadowOpacity: 0.2,
                            }}
                            activeOpacity={0.6}
                            onPress={this.handleStartOnPress}
                        >
                            <Text style={styles.buttonTextStyle}>Start</Text>
                            <RightArrowIcon
                                iconContainerStyle={{
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                }}
                                iconStyle={{
                                    tintColor: 'white',
                                    height: 15,
                                    width: 18,
                                }}
                            />
                        </DelayedButton>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 15,
    },
    mainContentContainerStyle: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    // User image style
    imageStyle: {},
    imageContainerStyle: {},
    // Info text style
    textStyle: {},
    // Start button style
    buttonContainerStyle: {
        borderRadius: 5,
        backgroundColor: 'rgba(68, 200, 245, 1)',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingVertical: 14,
        paddingHorizontal: 50,
        margin: 40,
    },
    buttonTextStyle: {
        color: 'white',
        fontSize: 17,
        fontWeight: '600',
        marginRight: 6,
    },
    // Styles for header
    headerContainerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(35, 183, 233, 1)',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 16,
    },
    headerImageStyle: {
        tintColor: 'rgba(195, 229, 243, 1)',
        height: 38,
        width: 38,
        marginBottom: 12,
    },
    welcomeTextStyle: {
        color: 'rgba(214, 240, 250, 1)',
        fontSize: 19,
        lineHeight: 23,
        letterSpacing: 0.19,
    },
    nameTextStyle: {
        color: 'white',
        fontSize: 23,
        lineHeight: 27,
        letterSpacing: 0.19,
        fontWeight: '800',
    },
    // Prompt style
    promptContainerStyle: {
        backgroundColor: 'white',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.15,
        // shadowRadius: 3,
        borderRadius: 5,
        elevation: 1,
        padding: 12,
        paddingHorizontal: 18,
    },
    promptWelcomeTextStyle: {
        letterSpacing: 0.02,
        color: 'rgba(40, 40, 40, 1)',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 15,
        lineHeight: 22,
    },
    promptTextStyle: {
        letterSpacing: 0.02,
        color: 'rgba(51, 51, 51, 1)',
        textAlign: 'center',
        fontSize: 15,
        lineHeight: 22,
    },
    // Profile image
    profileImageContainerStyle: {
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'lightgray',
        padding: 1,
        margin: 5,
        alignItems: 'center',
    },
    profileImageStyle: {},
    caretStyle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 15,
        borderRightWidth: 15,
        borderBottomWidth: 17,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'white',
    },
    shadow: {
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1.2 },
        // shadowOpacity: 0.23,
        // shadowRadius: 4
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
    },
}

export default WelcomSreen
