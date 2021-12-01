/** @format */

import React, { PureComponent } from 'react'
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
    trackWithProperties,
    EVENT as E,
} from '../../../monitoring/segment/index'

import {
    generateInvitationLink,
    componentKeyByTab,
} from '../../../redux/middleware/utils'

import { storeData } from '../../../store/storage'
import { cancelSuggestion } from '../../../redux/modules/feed/comment/CommentActions'
import { getAllContacts } from '../../../actions/ContactActions'
import { FONT_FAMILY } from '../../../styles/basic/text'
import { DEFAULT_CARDS } from './modalSvg'
import { Icon } from '@ui-kitten/components'
import { getUserData } from '../../../redux/modules/User/Selector'
import { parseExpressionAndEval } from '../../../Utils/HelperMethods'
import ArrowRight from '../../../asset/svgs/ArrowRightCircle'
import ArrowLeft from '../../../asset/svgs/ArrowLeftCircle'
import { DropDownHolder } from '../../Common/Modal/DropDownModal'
import OnboardingHeader from '../../Onboarding/Common/OnboardingHeader'
import SearchBarHeader from '../../Common/Header/SearchBarHeader'

const DEBUG_KEY = '[UI InviteFriendModal]'
const DEFAULT_STATE = {
    description:
        "I'd love for us to keep each other inspired and motivated on our journeys. Add me on GoalMogul?",
    editEnabled: false,
}

const DESCRIPTIONS_TOP3 = [
    // this.props.shouldOpenFromComments
    //     ? this.props.goalTosend
    `I’d love to grow closer with you by keeping up with each others’ goals and helping. GoalMogul makes it fun and easy. Please join and check out my goals.`,
    `We barely have time to catch up these days. Can you join me on GoalMogul? It will help us keep up with each others’ life goals so we don't lose touch.`,
    `I joined GoalMogul to share my goals with trusted friends. Can you have a look and provide feedback?`,
]
let DESCRIPTIONS_REMAINING = [
    `It’s been a while since we connected. GoalMogul enables us to stay connected by helping each other achieve our goals. I invite you to keep up with my goals.`,
    `I know you're super busy and don't always have the time to catch up. Can you join me on GoalMogul? I would love to share with each other what we’re trying to achieve in life!`,
    `I'm working on improving myself by setting goals. When you have the time, can you please view them and tell me what you think? Thanks! `,
    `It's been a while since we were in touch. Let's connect on GoalMogul so we can remain updated on what each other want in life!`,
    `GoalMogul helps friends to grow closer by letting us keep up with each others’ goals. I want to stay connected, can you check out my goals?`,
    `I wanted to share my goals with you because you're a great friend. I want you to join me on GoalMogul. We can crush our goals together.`,
    `I've set some exciting goals using GoalMogul. Come and join me! It will be great for your aspirations!`,
    `I know you have some goals you want to achieve. Why not use GoalMogul! It has some really cool resources for getting stuff done!`,
    `You're always telling me how you want to do more in life. I think you should join GoalMogul -- it's great for discovering and setting new goals!`,
    `It's been a while since you've had a change in life. I think you should join me on GoalMogul. It's great for finding motivation and inspiration!`,
    `How often do we really talk about each other's life goals and dreams? Let's connect on GoalMogul so we can stay updated on what truly matters to us.`,
    `Let's catch up on each other's goals. Join me on GoalMogul!`,
    `I wanted to have more productive conversations with my friends, so I joined GoalMogul. Please join me so we can keep up with each others’ goals.`,
    `Over the years, I lost touch with a lot of friends because I lost touch with what they wanted in life. I don't want the same to happen to us! Let's connect on GoalMogul over what truly matters -- our goals.`,
    `We have both been busy in our own lives and career paths, so I want you to join me on GoalMogul. This way we can stay updated on each other’s goals in life.`,
    `What are you up to these days? Join me on GoalMogul so we stay updated on what we’re both trying to achieve in life.`,
    `I just set a new goal on GoalMogul. Would really appreciate it if you checked it out 🙏`,
    `I wanna share a bit more about myself with you. Wanna check out my personal goals that I set?`,
    `I set a goal recently that I would really appreciate some feedback in. Would you like to have a look and share your thoughts?`,
    `You've been there for me many times before, so I wanted to ask you to view the goals I set. I know you'd give some really good advice!`,
    `GoalMogul is an app for overachievers like us. Can you join me so we can keep in touch and help each other achieve our goals?`,
]

const EXCLUDE_ACTIVITY_TYPE = [
    'com.apple.reminders.RemindersEditorExtension',
    'com.apple.mobilenotes.SharingExtension',
]

class InviteFriendScreen extends PureComponent {
    shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]]
        }
    }

    makeDescriptionsArray = () => {
        if (this.props.shouldOpenFromComments) {
            this.shuffleArray(DESCRIPTIONS_REMAINING)
            return [this.props.goalTosend, ...DESCRIPTIONS_REMAINING]
        } else {
            this.shuffleArray(DESCRIPTIONS_REMAINING)
            return [...DESCRIPTIONS_TOP3, ...DESCRIPTIONS_REMAINING]
        }
    }

    descriptionsArray = this.makeDescriptionsArray()
    constructor(props) {
        super(props)
        this.state = {
            description: this.descriptionsArray[0],
            descriptionIndex: 0,
            editEnabled: false,
        }
    }

    updateDescription = async (text) => {
        this.setState({
            ...this.state,
            description: text,
        })
    }

    componentDidMount() {
        setTimeout(() => {
            trackWithProperties(E.DEEPLINK_CLICKED, {
                FunnelName: this.props.funnel,
            })
        }, 2000)
    }

    closeModal = () => {
        if (this.props.closeModal) {
            this.props.closeModal()
            this.setState({
                description: this.descriptionsArray[0],
                descriptionIndex: 0,
                editEnabled: false,
            })
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
                console.log('FACEBOOK OPENED', data)
            })
            .catch(() => {
                setTimeout(() => {
                    Alert.alert('Error!', 'App is not installed!')
                }, 500)
            })
    }

    shareOnMessanger = (message, link) => {
        Linking.openURL(`fb-messenger://share?link=${message}\n\n${link}`)
            .then((data) => {
                console.log('Messanger OPENED', data)
            })
            .catch(() => {
                setTimeout(() => {
                    Alert.alert('Error!', 'App is not installed!')
                }, 500)
            })
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

    leftArrowClickHandler = () => {
        if (this.state.descriptionIndex === 0) {
            this.setState({
                descriptionIndex: 23 - this.state.descriptionIndex,
                description: this.descriptionsArray[
                    23 - this.state.descriptionIndex
                ],
            })
        } else if (this.state.descriptionIndex > 0) {
            this.setState({
                descriptionIndex: this.state.descriptionIndex - 1,
                description: this.descriptionsArray[
                    this.state.descriptionIndex - 1
                ],
            })
        } else {
            return null
        }
    }

    rightArrowClickHandler = () => {
        if (this.state.descriptionIndex == 23) {
            this.setState({
                descriptionIndex: 0,
                description: this.descriptionsArray[0 + 1],
            })
        } else if (
            this.state.descriptionIndex <
            this.descriptionsArray.length - 1
        ) {
            this.setState({
                descriptionIndex: this.state.descriptionIndex + 1,
                description: this.descriptionsArray[
                    this.state.descriptionIndex + 1
                ],
            })
        } else {
            return null
        }
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
            .then((data) => {
                console.log('WHATSAPP OPENED', data)
            })
            .catch(() => {
                setTimeout(() => {
                    Alert.alert('Error!', 'App is not installed!')
                }, 500)
            })
    }

    handleDeepLink = async (item) => {
        const { type, deepLink, deepLinkFormat } = item
        const inviteLink = this.getInviteLink()

        if (type == 'contacts') {
            return (
                // this.props.cancelSuggestion(this.props.pageId),
                Actions.push('ContactMessageScreen'),
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

    renderCard = (item, index) => {
        if (!item) return null
        const { text, image, icon } = item

        return (
            <DelayedButton
                index={Math.random().toString(36).substr(2, 9) + index}
                style={[
                    {
                        width: '100%',
                        paddingVertical: 15,
                        paddingHorizontal: 16,
                    },
                ]}
                onPress={() => {
                    this.handleDeepLink(item)
                }}
            >
                <View
                    // key={Math.random().toString(36).substr(2, 9) + index}
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
                            fontWeight: '500',
                            // fontFamily: 'SFProDisplay-Medium',
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
            <View
                style={{
                    backgroundColor: '#F2F2F2',
                    flex: 1,
                }}
            >
                <SearchBarHeader backButton />
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
                            {
                                flexDirection: 'row',
                                marginBottom: 1,
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                            },
                        ]}
                    >
                        <Text
                            style={{
                                fontSize: 17,
                                fontWeight: 'bold',
                            }}
                        >
                            Invite Friends
                        </Text>
                        <View style={{ flex: 1, alignItems: 'center' }} />
                        {/* <DelayedButton
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
                    </DelayedButton> */}
                    </View>

                    <View
                        style={[styles.boxContainerStyle, { marginBottom: 1 }]}
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
                                value={
                                    this.descriptionsArray[
                                        this.state.descriptionIndex
                                    ]
                                }
                                onChangeText={(text) =>
                                    this.updateDescription(text)
                                }
                                style={[
                                    {
                                        lineHeight: 24,
                                        padding: 0,
                                        width: width - 72,
                                        height: 120,
                                        fontSize: 15,
                                    },
                                ]}
                                multiline
                            />
                            <Text
                                numberOfLines={1}
                                style={[
                                    {
                                        fontWeight: '400',
                                        color: color.GM_BLUE,
                                        textDecorationLine: 'underline',
                                        marginTop: 16,
                                        width: '90%',
                                    },
                                ]}
                            >
                                {inviteLink}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    Clipboard.setString(inviteLink)
                                    Alert.alert('Link is copied to Clipboard')
                                }}
                            >
                                <View
                                    style={{
                                        position: 'absolute',
                                        right: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <Icon
                                        name="link-variant"
                                        pack="material-community"
                                        style={{
                                            height: 24,
                                            tintColor: color.GM_MID_GREY,
                                        }}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                marginTop: '3%',
                            }}
                        >
                            <TouchableOpacity
                                onPress={this.leftArrowClickHandler}
                                style={styles.arrowButtons}
                            >
                                <ArrowLeft />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.rightArrowClickHandler}
                                style={styles.arrowButtons}
                            >
                                <ArrowRight />
                            </TouchableOpacity>
                        </View>
                        <Text
                            onPress={this.openEditInviteCodeForm}
                            style={[
                                {
                                    color: color.GM_BLUE,
                                    paddingTop: 8,
                                    paddingLeft: 10,
                                    fontSize: 12,
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
                        {DEFAULT_CARDS.map((i, index) =>
                            this.renderCard(i, index)
                        )}

                        <DelayedButton
                            style={[
                                {
                                    width: '100%',
                                    paddingVertical: 15,
                                    paddingHorizontal: 16,
                                },
                            ]}
                            onPress={() => {
                                this.inviteNative(
                                    this.state.description,
                                    inviteLink
                                )
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
    arrowButtons: {
        marginHorizontal: '1.5%',
    },
}

const mapStateToProps = (state) => {
    const { user } = state.user
    const { inviteCode } = user
    const { tab } = state.navigation
    const contacts = state.contacts
    const check = state
    return {
        inviteCode,
        tab,
        contacts,
        check,
    }
}

export default connect(mapStateToProps, {
    getAllContacts,
    cancelSuggestion,
})(InviteFriendScreen)
