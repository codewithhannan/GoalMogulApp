/** @format */

import React from 'react'
import { View, FlatList, Text, Image, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import SearchBarHeader from '../Common/Header/SearchBarHeader'
import DelayedButton from '../Common/Button/DelayedButton'
import Icons from '../../asset/base64/Icons'
import { BUTTON_STYLE } from '../../styles'
import { text, default_style, color } from '../../styles/basic'
import PYMKCard from './PYMKCard'
import {
    handleRefreshFriend,
    handleRefreshRequests,
} from '../../redux/modules/meet/MeetActions'
import { getIncomingUserFromFriendship } from '../../redux/modules/meet/selector'
import RequestCard from './V2/RequestCard'
import { componentKeyByTab } from '../../redux/middleware/utils'
import { handleRefresh, meetOnLoadMore } from '../../actions'
import InviteFriendModal from './Modal/InviteFriendModal'
import { SCREENS, wrapAnalytics } from '../../monitoring/segment'
import { FONT_FAMILY } from '../../styles/basic/text'

/**
 * Friend tab page for GM main tabs
 *
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 *
 * props {
 *  requests: [], friend request list
 *  pymkData: [], people you may know list
 *
 * }
 */
class FriendTab extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showInviteFriendModal: false,
        }
    }

    componentDidMount() {
        // Refresh user friends
        this.props.handleRefreshFriend()
        // Refresh user friend requests for both incoming and outgoing
        this.props.handleRefreshRequests()
        // Refresh recommended users with force refresh
        this.props.handleRefresh('suggested', true)
    }

    openInviteFriendModal = () => {
        this.setState({ ...this.state, showInviteFriendModal: true })
    }

    closeInviteFriendModal = () => {
        this.setState({ ...this.state, showInviteFriendModal: false })
    }

    handleSeeAllFriends = () => {
        Actions.friendTabView()
    }

    handleSeeAllRequests = () => {
        const componentKeyToOpen = componentKeyByTab(
            this.props.navigationTab,
            'requestTabView'
        )
        Actions.push(componentKeyToOpen)
    }

    /** Render top card for inviting friends */
    renderInviteFriendCard() {
        const { width } = Dimensions.get('window')
        return (
            <View
                style={{
                    padding: styles.padding,
                    flexDirection: 'row',
                    flex: 1,
                    backgroundColor: 'white',
                    marginBottom: 8,
                }}
            >
                <View
                    style={{ flex: 1, paddingVertical: 32, paddingRight: 16 }}
                >
                    <Text
                        style={[
                            default_style.titleText_1,
                            { marginBottom: styles.padding },
                        ]}
                    >
                        How well do your friends know you if they don't know
                        your goals?
                    </Text>
                    <DelayedButton
                        onPress={() => this.openInviteFriendModal()}
                        style={[
                            BUTTON_STYLE.GM_BLUE_BG_WHITE_BOLD_TEXT
                                .containerStyle,
                            { height: 40 },
                        ]}
                        activeOpacity={1}
                    >
                        <Text
                            style={[
                                default_style.titleText_1,
                                {
                                    color: 'white',
                                    fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                                },
                            ]}
                        >
                            Invite your Friends
                        </Text>
                    </DelayedButton>
                </View>
                <Image
                    source={Icons.LionMascotWithShadow}
                    style={{ width: width * 0.3 }}
                    resizeMode="contain"
                />
            </View>
        )
    }

    /** Render friend request section */
    renderRequestSection = () => {
        const { width } = Dimensions.get('window')
        const { incomingRequests } = this.props
        const requestCount = incomingRequests.length

        return (
            <View
                style={{
                    width: '100%',
                    padding: styles.padding,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <RequestCard user={incomingRequests[0]} />
                    {requestCount < 2 ? null : (
                        <RequestCard user={incomingRequests[1]} />
                    )}
                </View>
                {requestCount <= 2 ? null : (
                    <DelayedButton
                        touchableHighlight
                        onPress={this.handleSeeAllRequests}
                        activeOpacity={1}
                        style={{
                            backgroundColor: '#F2F2F2',
                            borderRadius: 3,
                            padding: 10,
                            alignItems: 'center',
                            marginTop: 16,
                        }}
                    >
                        <Text
                            style={[
                                default_style.normalText_1,
                                {
                                    fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                                    color: '#4F4F4F',
                                },
                            ]}
                        >
                            Show all ({`${requestCount}`} Requests)
                        </Text>
                    </DelayedButton>
                )}
            </View>
        )
    }

    renderRequestEmptyCard = () => {
        return (
            <View
                style={{
                    width: '100%',
                    minHeight: 120,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: '#F2F2F2',
                }}
            >
                <Image
                    source={Icons.AccountMultiple}
                    style={{ tintColor: '#E0E0E0', width: 40, height: 30 }}
                    resizeMode="cover"
                />
                <Text
                    style={{
                        fontSize: text.TEXT_FONT_SIZE.FONT_1,
                        lineHeight: text.TEXT_LINE_HEIGHT.FONT_2,
                        fontFamily: text.FONT_FAMILY.REGULAR,
                        color: '#9B9B9B',
                        marginTop: 16,
                    }}
                >
                    There are currently no friend requests.
                </Text>
            </View>
        )
    }

    renderFriendRequests = () => {
        return (
            <View
                style={{
                    width: '100%',
                    backgroundColor: 'white',
                    marginBottom: 8,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: styles.padding,
                    }}
                >
                    <Text style={[default_style.titleText_1]}>
                        Friend Requests
                    </Text>
                    <View style={{ flex: 1 }} />
                    <DelayedButton
                        onPress={() => this.handleSeeAllFriends()}
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                        activeOpacity={1}
                    >
                        <Text
                            style={[
                                default_style.titleText_2,
                                {
                                    color: color.GM_BLUE,
                                    fontFamily: FONT_FAMILY.SEMI_BOLD,
                                },
                            ]}
                        >
                            All My Friends
                        </Text>
                    </DelayedButton>
                </View>
                {this.renderItemSeparator()}
                {!this.props.incomingRequests ||
                this.props.incomingRequests.length == 0
                    ? this.renderRequestEmptyCard()
                    : this.renderRequestSection()}
            </View>
        )
    }

    renderPYMKHeader = () => {
        return (
            <View>
                <View
                    style={{
                        padding: 16,
                        alignItems: 'flex-start',
                        backgroundColor: 'white',
                    }}
                >
                    <Text style={[default_style.titleText_1]}>
                        People You May Know
                    </Text>
                </View>
                {this.renderItemSeparator()}
            </View>
        )
    }

    renderListHeader = () => {
        return (
            <View style={{ width: '100%' }}>
                {this.renderInviteFriendCard()}
                {this.renderFriendRequests()}
                {this.renderPYMKHeader()}
            </View>
        )
    }

    renderItemSeparator = () => {
        return <View style={{ height: 1, backgroundColor: '#F2F2F2' }} />
    }

    /** Render people you may know card */
    renderPYMK = ({ item, index }) => {
        return <PYMKCard user={item} index={index} />
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                <SearchBarHeader backButton title="Friends" />
                <FlatList
                    keyExtractor={(item) => item._id}
                    data={this.props.pymkData || testData}
                    ListHeaderComponent={this.renderListHeader}
                    renderItem={this.renderPYMK}
                    contentContainerStyle={{
                        backgroundColor: color.GM_BACKGROUND,
                    }}
                    loading={this.props.loading}
                    onEndReached={() => this.props.meetOnLoadMore('suggested')}
                    ItemSeparatorComponent={this.renderItemSeparator}
                />
                <InviteFriendModal
                    isVisible={this.state.showInviteFriendModal}
                    closeModal={this.closeInviteFriendModal}
                />
            </View>
        )
    }
}

const styles = {
    padding: 16,
    containerStyle: {
        backgroundColor: color.GM_BACKGROUND,
        flex: 1,
    },
    requestListContainerStyle: {
        width: '100%',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#F2F2F2',
    },
}

const testData = [
    {
        name: 'Jay Patel',
        profile: {
            badges: {
                milestoneBadge: {
                    currentMilestone: 1,
                },
            },
        },
        topGoals: [
            'Run 100 miles within 1 day 24 hours 20 seconds 203 milliseconds so that this is a super long goal',
        ],
    },
]

const mapStateToProps = (state) => {
    const { suggested } = state.meet
    const { data, loading } = suggested
    return {
        incomingRequests: getIncomingUserFromFriendship(state),
        pymkData: data,
        loading,
    }
}

export default connect(mapStateToProps, {
    handleRefreshFriend,
    handleRefreshRequests,
    handleRefresh,
    meetOnLoadMore,
})(wrapAnalytics(FriendTab, SCREENS.MEET_TAB))
