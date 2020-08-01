/** @format */

import React from 'react'
import {
    View,
    Text,
    Image,
    TextInput,
    Keyboard,
    ScrollView,
    Share,
    Linking,
    Alert,
    Clipboard,
    Dimensions,
} from 'react-native'
import * as SMS from 'expo-sms'
import { connect } from 'react-redux'
import Modal from 'react-native-modalbox'
import ModalHeader from '../../Common/Header/ModalHeader'
import { color, default_style } from '../../../styles/basic'
import cancel from '../../../asset/utils/cancel_no_background.png'
import DelayedButton from '../../Common/Button/DelayedButton'
import { generateInvitationLink } from '../../../redux/middleware/utils'
import { FONT_FAMILY } from '../../../styles/basic/text'

const DEBUG_KEY = '[UI InviteFriendModal]'
const DEFAULT_STATE = {
    description:
        "I'd love for us to keep each other inspired and motivated on our journeys. Add me on GoalMogul?",
    editEnabled: false,
}

const EXCLUDE_ACTIVITY_TYPE = [
    'com.apple.reminders.RemindersEditorExtension',
    'com.apple.mobilenotes.SharingExtension',
]

const DEFAULT_CARDS = [
    // currently disabled as linking to messenger / whatsapp requires ejection
    // {
    //     text: "Messenger",
    //     image: undefined,
    //     deepLink: "fb-messenger://",
    //     deepLinkFormat: (text, url) => {
    //         // return `fb-messenger://share?link=${encodeURIComponent(url)}&message=${text}`
    //         return `fb-messenger://share?link=${encodeURIComponent(url)}`
    //     }
    // }, {
    //     text: "Whatsapp",
    //     image: undefined,
    //     deepLink: "whatsapp://",
    //     deepLinkFormat: (text, url) => {
    //         return `whatsapp://send?text=${text}\n\n${encodeURIComponent(url)}`;
    //     }
    // },
    {
        type: 'sms',
        text: 'iMessage',
        image: undefined,
    },
    {
        type: 'email',
        text: 'Email',
        image: undefined,
    },
    {
        type: 'clipboard',
        text: 'Copy',
        image: undefined,
    },
    {
        type: 'native',
        text: 'More',
    },
]

class InviteFriendModal extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = { ...DEFAULT_STATE }
    }

    updateDescription = (text) => {
        this.setState({
            ...this.state,
            description: text,
        })
    }

    closeModal = () => {
        if (this.props.closeModal) {
            this.props.closeModal()
            this.setState({ ...DEFAULT_STATE })
        }
    }

    getInviteLink = () => {
        return generateInvitationLink(this.props.inviteCode)
    }

    inviteSms = async (message, url) => {
        const isAvailable = await SMS.isAvailableAsync()
        console.log(`${DEBUG_KEY}: SMS is available?`, isAvailable)
        if (isAvailable) {
            // do your SMS stuff here
            const { result } = await SMS.sendSMSAsync(
                [],
                `${message}\n\n${url}`
            )
            console.log(`${DEBUG_KEY}: result is: `, result)
        }
    }

    inviteEmail = async (message, url) => {
        // Linking.openURL(`mailto:?subject=Join GoalMogul&body=${unescape(message)}\n\n${unescape(url)}`);
        const canOpen = await Linking.canOpenURL('mailto:?')
        // Linking.openURL(`mailto:support@goalmogul.com?subject=Gold Badge winner&body=`);
        if (canOpen) {
            Linking.openURL(
                `mailto:?subject=Join GoalMogul&body=${unescape(
                    message
                )}\n\n${unescape(url)}`
            )
        }
    }

    inviteNative = (message, url) => {
        Share.share(
            { title: undefined, message, url },
            {
                excludedActivityTypes: EXCLUDE_ACTIVITY_TYPE,
            }
        )
    }

    copyToClipboard = async (message, url) => {
        await Clipboard.setString(`${message}\n\n${url}`)
        Alert.alert('Copied to clipboard')
    }

    handleDeepLink = async (item) => {
        const { type, deepLink, deepLinkFormat } = item
        const inviteLink = this.getInviteLink()
        if (type == 'sms') {
            return this.inviteSms(this.state.description, inviteLink)
        }

        if (type == 'native') {
            return this.inviteNative(this.state.description, inviteLink)
        }

        if (type == 'clipboard') {
            return this.copyToClipboard(this.state.description, inviteLink)
        }

        if (type == 'email') {
            return this.inviteEmail(this.state.description, inviteLink)
        }

        const canOpen = await Linking.canOpenURL(deepLink)

        if (canOpen) {
            const fullLink = deepLinkFormat
                ? deepLinkFormat(this.state.description, inviteLink)
                : deepLink
            await Linking.openURL(fullLink)
        }
    }

    handleEditDescriptionOnClick = () => {
        const editEnabled = this.state.editEnabled
        this.setState(
            {
                ...this.state,
                editEnabled: !editEnabled,
            },
            () => {
                // Original enabled and now disabled
                if (editEnabled) {
                    // Dismiss keyboard
                    Keyboard.dismiss()
                } else {
                    // Originally disabled and now enabled. Focus on input
                    this.input.focus()
                }
            }
        )
    }

    renderCard = (item) => {
        if (!item) return null
        const { text, image } = item

        return (
            <DelayedButton
                style={[
                    {
                        width: '100%',
                        paddingVertical: 24,
                        paddingHorizontal: 16,
                    },
                ]}
                onPress={() => this.handleDeepLink(item)}
            >
                <View
                    style={[
                        { flexDirection: 'row', flex: 1, alignItems: 'center' },
                    ]}
                >
                    <Text
                        style={[
                            default_style.titleText_2,
                            { fontWeight: '300' },
                        ]}
                    >
                        {text}
                    </Text>
                    <View style={{ flex: 1 }} />
                </View>
            </DelayedButton>
        )
    }

    render() {
        const { width } = Dimensions.get('window')
        const inviteLink = this.getInviteLink()

        return (
            <Modal
                isOpen={this.props.isVisible}
                backdropOpacity={0.6}
                coverScreen={true}
                hideModalContentWhileAnimating
                onClosed={this.closeModal}
                style={{
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    flex: 1,
                    marginTop: 50,
                }}
                useNativeDriver={false}
            >
                <View
                    style={{
                        backgroundColor: '#F2F2F2',
                        flex: 1,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    }}
                >
                    <View
                        style={[
                            styles.boxContainerStyle,
                            {
                                flexDirection: 'row',
                                marginBottom: 1,
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                            },
                        ]}
                    >
                        <Text style={[default_style.titleText_1]}>Share</Text>
                        <View style={{ flex: 1, alignItems: 'center' }} />
                        <DelayedButton
                            activeOpacity={0.85}
                            onPress={this.closeModal}
                            style={{
                                width: 24,
                                height: 24,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Image
                                source={cancel}
                                style={{
                                    width: 16,
                                    height: 16,
                                    tintColor: 'black',
                                    padding: 2,
                                }}
                            />
                        </DelayedButton>
                    </View>
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{
                            paddingBottom: 30,
                            flexGrow: 1,
                        }}
                    >
                        <View
                            style={[
                                styles.boxContainerStyle,
                                { marginBottom: 1 },
                            ]}
                        >
                            <View
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#E0E0E0',
                                    borderRadius: 5,
                                    padding: 20,
                                    justifyContent: 'center',
                                }}
                            >
                                <TextInput
                                    ref={(input) => {
                                        this.input = input
                                    }}
                                    value={this.state.description}
                                    onChangeText={(text) =>
                                        this.updateDescription(text)
                                    }
                                    style={[
                                        default_style.subTitleText_1,
                                        {
                                            lineHeight: 24,
                                            padding: 0,
                                            width: width - 72,
                                        },
                                    ]}
                                    multiline
                                />
                                <Text
                                    style={[
                                        default_style.titleText_1,
                                        {
                                            fontWeight: '400',
                                            color: color.GM_BLUE,
                                            fontFamily: FONT_FAMILY.REGULAR,
                                            textDecorationLine: 'underline',
                                            marginTop: 16,
                                        },
                                    ]}
                                >
                                    {inviteLink}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                paddingBottom: 30,
                                backgroundColor: 'white',
                            }}
                        >
                            {DEFAULT_CARDS.map((i) => this.renderCard(i))}
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        )
    }
}

const styles = {
    boxContainerStyle: {
        padding: 16,
        backgroundColor: 'white',
    },
    buttonContainerStyle: {
        paddingVertical: 10,
        backgroundColor: color.GM_BLUE,
        alignItems: 'center',
        borderRadius: 5,
    },
}

const mapStateToProps = (state) => {
    const { user } = state.user
    const { inviteCode } = user

    return {
        user,
        inviteCode,
    }
}

export default connect(mapStateToProps, null)(InviteFriendModal)
