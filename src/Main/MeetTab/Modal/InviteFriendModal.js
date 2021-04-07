/** @format */

import React from 'react'
import {
    View,
    Text,
    TextInput,
    Keyboard,
    ScrollView,
    Share,
    Linking,
    Alert,
    Dimensions,
    TouchableOpacity,
    Image,
    Clipboard,
} from 'react-native'
import * as SMS from 'expo-sms'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

import Svg, {
    Path,
    Circle,
    Defs,
    Pattern,
    Use,
    Image as SvgImage,
} from 'react-native-svg'
import Modal from 'react-native-modalbox'
import { color, default_style } from '../../../styles/basic'
import cancel from '../../../asset/utils/cancel_no_background.png'
import DelayedButton from '../../Common/Button/DelayedButton'
import {
    generateInvitationLink,
    componentKeyByTab,
} from '../../../redux/middleware/utils'

import { storeData } from '../../../store/storage'

import SendContactMessage from './SendContactMessage'

import { getAllContacts } from '../../../actions/ContactActions'
import { FONT_FAMILY } from '../../../styles/basic/text'
import { DEFAULT_CARDS } from './modalSvg'
import { Icon } from '@ui-kitten/components'

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

class InviteFriendModal extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = { ...DEFAULT_STATE }
    }

    updateDescription = async (text) => {
        this.setState({
            ...this.state,
            description: text,
        })
    }

    async componentDidUpdate() {}

    closeModal = () => {
        if (this.props.closeModal) {
            this.props.closeModal()
            this.setState({ ...DEFAULT_STATE })
        }
    }

    onScrollFlatList(offset, screenHeight) {
        if (offset < -0.001 * screenHeight) {
            this.closeModal()
        }
    }

    getInviteLink = () => {
        return generateInvitationLink(this.props.inviteCode)
    }

    postOnFacebook = () => {
        let facebookParameters = []
        const inviteLink = this.getInviteLink()

        if (inviteLink) facebookParameters.push('u=' + encodeURI(inviteLink))
        const url =
            'https://www.facebook.com/sharer/sharer.php?' +
            facebookParameters.join('&')

        //    "fb://facewebmodal/f?href=https://www.facebook.com/sharer/sharer.php?";

        Linking.openURL(url)
            .then((data) => {
                alert('Facebook Opened')
            })
            .catch(() => {
                alert('Something went wrong')
            })
    }

    shareOnMessanger = (message, link) => {
        Linking.openURL(`fb-messenger://share?link=${message}\n\n${link}`)
    }

    openEditInviteCodeForm = () => {
        const componentKeyToOpen = componentKeyByTab(
            this.props.tab,
            'editInviteCodeForm'
        )
        this.closeModal()
        setTimeout(() => {
            Actions.push(`${componentKeyToOpen}`)
        }, 300)
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

    shareToWhatsApp = (text, link) => {
        Linking.openURL(`whatsapp://send?text=${text}\n\n${link}`)
    }

    handleDeepLink = async (item) => {
        const { type, deepLink, deepLinkFormat } = item
        const inviteLink = this.getInviteLink()

        if (type == 'contacts') {
            return (
                Actions.push('ContactMessage'),
                this.closeModal(),
                await storeData('INVITEMESSAGE', this.state.description)
            )
        }
        if (type == 'sms') {
            return this.inviteSms(this.state.description, inviteLink)
        }
        if (type == 'facebook') {
            return this.postOnFacebook()
        }
        if (type == 'whatsapp') {
            return this.shareToWhatsApp(this.state.description, inviteLink)
        }
        if (type == 'messagner') {
            return this.shareOnMessanger(this.state.description, inviteLink)
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
        const { text, image, icon } = item

        return (
            <DelayedButton
                style={[
                    {
                        width: '100%',
                        paddingVertical: 24,
                        paddingHorizontal: 16,
                    },
                ]}
                onPress={() => {
                    this.handleDeepLink(item)
                    console.log('the item is pressed', item.type)
                }}
            >
                <View
                    style={[
                        {
                            flexDirection: 'row',
                            flex: 1,
                            alignItems: 'center',
                        },
                    ]}
                >
                    {image !== undefined ? (
                        <Image
                            source={image}
                            resizeMode="contain"
                            style={{ height: 26, width: 26 }}
                        />
                    ) : (
                        <Svg
                            width={item.Svg.svg.width}
                            height={item.Svg.svg.height}
                            viewBox={item.Svg.svg.viewBox}
                            fill={item.Svg.svg.fill}
                            xmlns={item.Svg.svg.xmlns}
                            xmlnsXlink={item.Svg.svg.xmlnsXlink}
                            {...this.props}
                        >
                            <Path
                                fill={item.Svg.path.fill}
                                d={item.Svg.path.d}
                            />
                            <Defs>
                                <Pattern
                                    id={item.Svg.pattern.id}
                                    patternContentUnits={
                                        item.Svg.pattern.patternContentUnits
                                    }
                                    width={item.Svg.pattern.width}
                                    height={item.Svg.pattern.height}
                                >
                                    <Use
                                        xlinkHref={item.Svg.use.xlinkHref}
                                        transform={item.Svg.use.transform}
                                    />
                                </Pattern>
                                <SvgImage
                                    id={item.Svg.img.id}
                                    width={item.Svg.img.width}
                                    height={item.Svg.img.height}
                                    xlinkHref={item.Svg.img.xlinkHref}
                                />
                            </Defs>
                        </Svg>
                    )}

                    <Text
                        style={{
                            // fontWeight: '900',
                            marginLeft: 16,
                            fontSize: 18,
                            fontFamily: 'SFProDisplay-Medium',
                        }}
                    >
                        {text}
                    </Text>
                    <View style={{ flex: 1 }} />
                </View>
            </DelayedButton>
        )
    }

    render() {
        const { width, height } = Dimensions.get('window')
        const inviteLink = this.getInviteLink()

        return (
            <>
                <Modal
                    swipeToClose={true}
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
                    useNativeDriver={true}
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
                            <Text style={[default_style.titleText_1]}>
                                Share
                            </Text>
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
                            onScroll={(e) => {
                                this.onScrollFlatList(
                                    e.nativeEvent.contentOffset.y,
                                    height
                                )
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
                                    <TouchableOpacity
                                        onPress={() => {
                                            Clipboard.setString(inviteLink)
                                            Alert.alert(
                                                'Link is copied to Clipboard'
                                            )
                                        }}
                                    >
                                        <View
                                            style={{
                                                position: 'absolute',
                                                right: 0,
                                                bottom: 5,
                                            }}
                                        >
                                            <Icon
                                                name="link-variant"
                                                pack="material-community"
                                                style={{
                                                    height: 24,
                                                    tintColor:
                                                        color.GM_MID_GREY,
                                                }}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <Text
                                    onPress={this.openEditInviteCodeForm}
                                    style={[
                                        default_style.smallTitle_1,
                                        {
                                            color: color.GM_BLUE,
                                            paddingTop: 8,
                                            paddingLeft: 10,
                                            alignSelf: 'flex-end',
                                        },
                                    ]}
                                >
                                    Customize invite code
                                </Text>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    paddingBottom: 30,
                                    backgroundColor: 'white',
                                }}
                            >
                                {DEFAULT_CARDS.map((i) => this.renderCard(i))}

                                <DelayedButton
                                    style={[
                                        {
                                            width: '100%',
                                            paddingVertical: 24,
                                            paddingHorizontal: 16,
                                        },
                                    ]}
                                    onPress={() =>
                                        // this.inviteNative(
                                        //     this.state.description,
                                        //     inviteLink
                                        // )
                                        this.getContacts()
                                    }
                                >
                                    <View
                                        style={[
                                            {
                                                flexDirection: 'row',
                                                flex: 1,
                                                alignItems: 'center',
                                            },
                                        ]}
                                    >
                                        <Icon
                                            name="more-horiz"
                                            pack="material"
                                            style={{
                                                height: 24,
                                                tintColor: color.GM_MID_GREY,
                                            }}
                                        />
                                        <Text
                                            style={{
                                                fontWeight: '700',
                                                marginLeft: 20,
                                                fontSize: 18,
                                                fontFamily:
                                                    'SFProDisplay-Medium',
                                            }}
                                        >
                                            More
                                        </Text>
                                        <View style={{ flex: 1 }} />
                                    </View>
                                </DelayedButton>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>
            </>
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
    const { tab } = state.navigation
    const contacts = state.contacts

    return {
        user,
        inviteCode,
        tab,
        contacts,
    }
}

export default connect(mapStateToProps, {
    getAllContacts,
})(InviteFriendModal)
