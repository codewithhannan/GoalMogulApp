/** @format */

// This is the V2 design of the meettab with design spec
import React from 'react'
import {
    View,
    Text,
    Image,
    ScrollView,
    RefreshControl,
    Platform,
    Share,
    Alert,
} from 'react-native'
import { connect } from 'react-redux'
import * as WebBrowser from 'expo-web-browser'
import { Actions } from 'react-native-router-flux'
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot-gm'

/* Components */
import FriendCardView from './V2/FriendCardView'
import FriendRequestCardView from './V2/FriendRequestCardView'
import FriendInvitationCTR from './V2/FriendInvitationCTR'
import SearchBarHeader from '../Common/Header/SearchBarHeader'
import DelayedButton from '../Common/Button/DelayedButton'
import { RightArrowIcon } from '../../Utils/Icons'

/* Actions */
import { handleRefresh } from '../../redux/modules/meet/MeetActions'

import { meetContactSync } from '../../actions'

import {
    showNextTutorialPage,
    startTutorial,
    saveTutorialState,
    updateNextStepNumber,
    pauseTutorial,
    resetTutorial,
} from '../../redux/modules/User/TutorialActions'

/* Assets */
import ContactSyncIcon from '../../asset/utils/ContactSync.png'
import Icons from '../../asset/base64/Icons'

/* Selectors */
import {
    getIncomingUserFromFriendship,
    getOutgoingUserFromFriendship,
} from '../../redux/modules/meet/selector'

/* Styles */
import { color } from '../../styles/basic'

/* Constants */
import {
    IPHONE_MODELS,
    PRIVACY_POLICY_URL,
    DEVICE_MODEL,
} from '../../Utils/Constants'
import { generateInvitationLink } from '../../redux/middleware/utils'
import Tooltip from '../Tutorial/Tooltip'
import { svgMaskPath } from '../Tutorial/Utils'

const { PeopleIcon: People } = Icons
const DEBUG_KEY = '[ UI MeetTabV2 ]'
const NumCardsToShow =
    Platform.OS === 'ios' && IPHONE_MODELS.includes(DEVICE_MODEL) ? 3 : 5
const WalkableView = walkthroughable(View)

class MeetTabV2 extends React.Component {
    constructor(props) {
        super(props)
        this.handleOnRefresh = this.handleOnRefresh.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.refreshing &&
            !this.props.refreshing &&
            !this.props.hasShown &&
            Actions.currentScene === 'meet'
        ) {
            this.props.start()
        }

        if (!prevProps.showTutorial && this.props.showTutorial === true) {
            if (Actions.currentScene === 'meet' && !this.props.refreshing) {
                console.log(`${DEBUG_KEY}: [ componentDidUpdate ]: [ start ]`)
                this.props.start()
            } else {
                // Current scene is not meet thus reseting the showTutorial state
                this.props.pauseTutorial('meet_tab_friend', 'meet_tab', 0)
            }
        }
    }

    componentDidMount() {
        // Preloading data by calling handleOnRefresh
        this.handleOnRefresh()

        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            () => {
                // We always fire this event since it's only stored locally
                if (!this.props.hasShown) {
                    setTimeout(() => {
                        console.log(
                            `${DEBUG_KEY}: [ onFocus ]: [ startTutorial ]`
                        )
                        this.props.startTutorial('meet_tab_friend', 'meet_tab')
                    }, 650)
                }
            }
        )

        this.props.copilotEvents.on('stop', () => {
            console.log(`${DEBUG_KEY}: [ componentDidMount ]: tutorial stop.`)
            this.props.showNextTutorialPage('meet_tab_friend', 'meet_tab')

            // Right now we don't need to have conditions here
            this.props.resetTutorial('meet_tab_friend', 'meet_tab')
        })

        this.props.copilotEvents.on('stepChange', (step) => {
            const { name, order, visible, target, wrapper } = step
            console.log(
                `${DEBUG_KEY}: [ onStepChange ]: step order: ${order}, step visible: ${name} `
            )

            // We showing current order. SO the next step should be order + 1
            this.props.updateNextStepNumber(
                'meet_tab_friend',
                'meet_tab',
                order + 1
            )
        })
    }

    componentWillUnmount() {
        this.props.copilotEvents.off('stop')
        this.props.copilotEvents.off('stepChange')
        this.props.saveTutorialState()
        this.didFocusListener.remove()
    }

    keyExtractor = (item) => item._id

    // MeetTab refresh
    handleOnRefresh = () => {
        console.log(`${DEBUG_KEY}: refreshing`)
        this.props.handleRefresh()
    }

    handleSyncContact = () => {
        Alert.alert(
            'Upload your contacts',
            'Your contacts will be used to help you find your friends on GoalMogul.',
            [
                {
                    text: 'Privacy Policy',
                    onPress: async () =>
                        await WebBrowser.openBrowserAsync(PRIVACY_POLICY_URL, {
                            showTitle: true,
                        }),
                },
                {
                    text: 'Continue',
                    onPress: () =>
                        this.props.meetContactSync(
                            this.handleOnRefresh,
                            'friendsTab_meetContactSync'
                        ),
                    style: 'default',
                },
            ]
        )
    }

    handleDiscoverFriend = () => {
        Actions.discoverTabView()
    }

    handleSeeAllFriends = () => {
        Actions.friendTabView()
    }

    handleSeeAllRequests = () => {
        Actions.requestTabView()
    }

    handleInviteFriends = () => {
        // With the new step by step tutorial, this is directly showing the more options
        // Actions.push('friendInvitationView');
        console.log(`${DEBUG_KEY}: user chooses to see more options`)
        const { user, inviteCode } = this.props
        console.log(`${DEBUG_KEY}: user is: `, user)
        const { name } = user
        const inviteLink = generateInvitationLink(inviteCode)
        // const title = `Your friend ${name} is asking you to help achieve his goals on GoalMogul`;
        const message =
            'Hey, I’m using GoalMogul to get more stuff done and better myself. ' +
            'Can you check out this link and suggest ways to help me achieve my goals faster? Thanks! \n'

        Share.share({ title: undefined, message, url: inviteLink }, {})
    }

    // List header is the FriendInvitationCTR, Sync Conacts and Discover Friends option
    renderListHeader() {
        return (
            <View>
                <FriendInvitationCTR
                    handleInviteFriends={this.handleInviteFriends.bind(this)}
                    tutorialText={this.props.tutorialText[1]}
                />
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 12,
                        marginBottom: 5,
                        backgroundColor: 'white',
                        ...styles.shadow,
                        alignItems: 'center',
                    }}
                >
                    <DelayedButton
                        activeOpacity={0.6}
                        style={styles.CTRContainerStyle}
                        onPress={this.handleSyncContact}
                    >
                        <Image
                            source={ContactSyncIcon}
                            style={styles.iconStyle}
                            resizeMode="contain"
                        />
                        <Text style={styles.CTRTextStyle}>Sync Contacts</Text>
                    </DelayedButton>
                    <View
                        style={{
                            height: 25,
                            width: 0.5,
                            backgroundColor: 'lightgray',
                        }}
                    />

                    <CopilotStep
                        text={this.props.tutorialText[0]}
                        order={0}
                        name="discover_friend"
                    >
                        <WalkableView style={styles.CTRContainerStyle}>
                            <DelayedButton
                                activeOpacity={0.6}
                                style={{
                                    ...styles.CTRContainerStyle,
                                    padding: 0,
                                }}
                                onPress={this.handleDiscoverFriend}
                            >
                                <Image
                                    source={People}
                                    style={styles.iconStyle}
                                    resizeMode="contain"
                                />
                                <Text style={styles.CTRTextStyle}>
                                    Discover Friends
                                </Text>
                            </DelayedButton>
                        </WalkableView>
                    </CopilotStep>
                </View>
            </View>
        )
    }

    renderEmptyRequestCard = () => {
        const item = {
            _id: 'friend-request-empty',
            type: 'info',
            info: 'You have no incoming request',
        }
        return (
            <FriendRequestCardView
                item={item}
                key={Math.random().toString(36).substr(2, 9)}
            />
        )
    }

    // Render compacted friend request cards
    renderRequests = (incomingRequests, outgoingRequests) => {
        // render FriendCardView or FriendRequestCardView based on item type
        const inLength = incomingRequests ? incomingRequests.length : 0
        const outLength = outgoingRequests ? outgoingRequests.length : 0
        const totalLength = inLength + outLength
        const dataToRender = requestDataToRender(
            incomingRequests,
            [], // We are not rendering outgoing request on this page
            NumCardsToShow
        )

        let ret = []

        ret.push(
            this.renderSectionTitle(
                'Friend Requests',
                inLength,
                this.handleSeeAllRequests
            )
        )
        ret = ret.concat(
            dataToRender.map((d) => (
                <FriendRequestCardView
                    item={d}
                    key={Math.random().toString(36).substr(2, 9)}
                />
            ))
        )

        // TODO: delete the following line
        // ret.push(this.renderSeeAll(totalLength, this.handleSeeAllRequests, 'request-see-all-test'));

        // Only render See All if there are incoming requests
        if (inLength > 0) {
            ret.push(
                this.renderSeeAll(
                    inLength > 0 ? totalLength : 0,
                    this.handleSeeAllRequests,
                    'request-see-all'
                )
            )
        }

        return ret
    }

    // Render compacted friend cards
    renderFriends = (friends, friendCount) => {
        const length = friends ? friends.length : 0
        const dataToRender =
            length > NumCardsToShow ? friends.slice(0, NumCardsToShow) : friends
        let ret = []
        if (length > 0) {
            ret.push(this.renderSectionTitle('Your Friends'))
        }
        ret = ret.concat(
            dataToRender.map((d) => (
                <FriendCardView
                    item={d}
                    key={Math.random().toString(36).substr(2, 9)}
                />
            ))
        )
        if (friendCount > NumCardsToShow) {
            ret.push(
                this.renderSeeAll(
                    friendCount,
                    this.handleSeeAllFriends,
                    'friends-see-all'
                )
            )
        }
        return ret
    }

    renderSectionTitle = (title, inLength, onPress) => {
        let seeAll = null
        if (inLength !== undefined && inLength === 0) {
            const { seeAllContainerStyle, seeAllTextStyle } = styles
            seeAll = (
                <DelayedButton
                    style={{
                        ...seeAllContainerStyle,
                        padding: 13,
                        paddingLeft: 5,
                        alignSelf: 'flex-end',
                    }}
                    activeOpacity={0.6}
                    onPress={onPress}
                >
                    <Text style={seeAllTextStyle}>Manage All</Text>
                </DelayedButton>
            )
        }
        return (
            <View
                style={{ flexDirection: 'row', alignItems: 'center' }}
                key={Math.random().toString(36).substr(2, 9)}
            >
                <View style={{ padding: 13 }}>
                    <Text
                        style={{
                            color: '#616161',
                            fontWeight: '700',
                            fontSize: 12,
                        }}
                    >
                        {title}
                    </Text>
                </View>
                {seeAll}
            </View>
        )
    }

    renderSeeAll = (count, onPress, key) => {
        const { seeAllContainerStyle, seeAllTextStyle, shadow } = styles
        const countToDisplay = count ? ` (${count})` : ''
        return (
            <DelayedButton
                style={{ ...seeAllContainerStyle, ...shadow }}
                activeOpacity={0.6}
                onPress={onPress}
                key={Math.random().toString(36).substr(2, 9)}
            >
                <Text style={seeAllTextStyle}>See All{countToDisplay}</Text>
                <RightArrowIcon
                    iconStyle={{
                        tintColor: '#17B3EC',
                        ...styles.arrowIconStyle,
                        height: 12,
                        width: 18,
                    }}
                    iconContainerStyle={{
                        alignSelf: 'center',
                        alignItems: 'center',
                        marginLeft: 5,
                    }}
                />
            </DelayedButton>
        )
    }

    render() {
        const {
            incomingRequests,
            outgoingRequests,
            friends,
            friendCount,
        } = this.props
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <SearchBarHeader backButton />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.refreshing}
                            onRefresh={this.handleOnRefresh}
                        />
                    }
                >
                    {this.renderListHeader()}
                    {this.renderRequests(incomingRequests, outgoingRequests)}
                    {this.renderFriends(friends, friendCount)}
                </ScrollView>
            </View>
        )
    }
}

const styles = {
    iconStyle: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
    CTRContainerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1,
        padding: 10,
    },
    CTRTextStyle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#5e5e5e',
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    // See all related styles
    seeAllContainerStyle: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 7,
    },
    seeAllTextStyle: {
        color: color.GM_BLUE,
        fontSize: 12,
        fontWeight: '700',
    },
    arrowIconStyle: {
        alignSelf: 'center',
        // fontSize: 20,
    },
}

const mapStateToProps = (state) => {
    // Use new selector to cache the format the meettab data
    const { user } = state.user
    const { inviteCode } = user
    const { requests, friends } = state.meet
    const { data, count } = friends
    const { incoming, outgoing } = requests
    const incomingRequests = getIncomingUserFromFriendship(state)
    const outgoingRequests = getOutgoingUserFromFriendship(state)

    const { meet_tab_friend } = state.tutorials
    const { meet_tab } = meet_tab_friend
    const { tutorialText, showTutorial, hasShown } = meet_tab

    return {
        // Meet tab is on refreshing state if one of them is refreshing
        refreshing:
            incoming.refreshing || outgoing.refreshing || friends.refreshing,
        incomingRequests,
        outgoingRequests,
        friends: data,
        friendCount: count,
        user,
        inviteCode,
        tutorialText,
        showTutorial,
        hasShown,
    }
}

const requestDataToRender = (incomingRequests, outgoingRequests, threshold) => {
    let dataToRender = []
    const inLength = incomingRequests ? incomingRequests.length : 0
    const outLength = outgoingRequests ? outgoingRequests.length : 0
    const totalLength = inLength + outLength
    if (totalLength <= threshold) {
        dataToRender = [...incomingRequests, ...outgoingRequests]
    } else if (inLength > threshold) {
        // Render all incoming requests
        dataToRender = incomingRequests.slice(0, threshold)
    } else {
        // Incoming request is not sufficient, use outgoing request to fulfill the length
        dataToRender = [
            ...incomingRequests,
            ...outgoingRequests.slice(0, threshold - inLength),
        ]
    }
    return dataToRender
}

const MeetTabV2Explained = copilot({
    overlay: 'svg', // or 'view'
    animated: true, // or false
    stepNumberComponent: () => <View />,
    tooltipComponent: Tooltip,
    svgMaskPath: svgMaskPath,
})(MeetTabV2)

export default connect(mapStateToProps, {
    handleRefresh,
    meetContactSync,
    showNextTutorialPage,
    startTutorial,
    saveTutorialState,
    updateNextStepNumber,
    pauseTutorial,
    resetTutorial,
})(MeetTabV2Explained)
