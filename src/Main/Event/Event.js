/**
 * After Event reducer refactoring, this class is no longer in use. It's replaced by MyEvent.js
 *
 * @format
 */

import R from 'ramda'
import React, { Component } from 'react'
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { MenuProvider } from 'react-native-popup-menu'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import DefaultUserProfile from '../../asset/utils/defaultUserProfile.png'
import EditIcon from '../../asset/utils/edit.png'
// Asset
import event_default_image from '../../asset/utils/eventIcon.png'
// Actions
import {
    deleteEvent,
    editEvent,
    eventDetailClose,
    eventSelectTab,
    loadMoreEventFeed,
    openEventInviteModal,
    reportEvent,
    rsvpEvent,
} from '../../redux/modules/event/EventActions'
// Selector
import {
    getUserStatus,
    participantSelector,
} from '../../redux/modules/event/EventSelector'
import { openPostDetail } from '../../redux/modules/feed/post/PostActions'
import {
    subscribeEntityNotification,
    unsubscribeEntityNotification,
} from '../../redux/modules/notification/NotificationActions'
// Constants
import {
    CARET_OPTION_NOTIFICATION_SUBSCRIBE,
    CARET_OPTION_NOTIFICATION_UNSUBSCRIBE,
    IMAGE_BASE_URL,
} from '../../Utils/Constants'
import { actionSheet, switchByButtonIndex } from '../Common/ActionSheetFactory'
import Dot from '../Common/Dot'
// Components
import SearchBarHeader from '../Common/Header/SearchBarHeader'
import { MenuFactory } from '../Common/MenuFactory'
import { StackedAvatarsV2 } from '../Common/StackedAvatars'
import TabButtonGroup from '../Common/TabButtonGroup'
import EmptyResult from '../Common/Text/EmptyResult'
import PostPreviewCard from '../Post/PostPreviewCard/PostPreviewCard'
import MemberListCard from '../Tribe/MemberListCard'
import About from './About'
import ParticipantFilterBar from './ParticipantFilterBar'
import { wrapAnalytics, SCREENS } from '../../monitoring/segment'

const DEBUG_KEY = '[ UI Event ]'
const RSVP_OPTIONS = ['Interested', 'Going', 'Maybe', 'Not Going', 'Cancel']
const CANCEL_INDEX = 4
const { width } = Dimensions.get('window')
const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]
/**
 * This is the UI file for a single event.
 */
class Event extends Component {
    constructor(props) {
        super(props)
        this.handleGoingOnPress = this.handleGoingOnPress.bind(this)
    }

    componentWillUnmount() {
        const { pageId, eventId } = pageId
        this.props.eventDetailClose(eventId, pageId)
    }

    handleInvite = (_id) => {
        return this.props.openEventInviteModal(_id)
    }

    /**
     * When user clicks on number of people going, it should redirect
     * to participant page with going option
     */
    handleGoingOnPress = () => {}

    /**
     * This function is deprecated since renderCaret is replaced by
     * handlePageSetting
     */
    handleEventOptionsOnSelect = (value) => {
        const { item } = this.props
        if (!item) return

        const { _id } = item
        if (value === 'Delete') {
            return this.props.deleteEvent(_id)
        }
        if (value === 'Edit') {
            return this.props.editEvent(item)
        }
    }

    handleRSVPOnPress = () => {
        const { item, pageId } = this.props
        if (!item) return
        const { _id } = item

        const switchCases = switchByButtonIndex([
            [
                R.equals(0),
                () => {
                    console.log(`${DEBUG_KEY} User chooses: Intereseted`)
                    this.props.rsvpEvent('Interested', _id, pageId)
                },
            ],
            [
                R.equals(1),
                () => {
                    console.log(`${DEBUG_KEY} User chooses: Going`)
                    this.props.rsvpEvent('Going', _id, pageId)
                },
            ],
            [
                R.equals(2),
                () => {
                    console.log(`${DEBUG_KEY} User chooses: Maybe`)
                    this.props.rsvpEvent('Maybe', _id, pageId)
                },
            ],
            [
                R.equals(3),
                () => {
                    console.log(`${DEBUG_KEY} User chooses: Not Going`)
                    this.props.rsvpEvent('NotGoing', _id, pageId)
                },
            ],
        ])
        const rsvpActionSheet = actionSheet(
            RSVP_OPTIONS,
            CANCEL_INDEX,
            switchCases
        )
        rsvpActionSheet()
    }

    // Tab related functions
    _handleIndexChange = (index) => {
        const { pageId, eventId } = this.props
        this.props.eventSelectTab(index, eventId, pageId)
    }

    /**
     * Handle modal setting on click. Show IOS menu with options
     */
    handlePageSetting = (item) => {
        const { _id, creator } = item
        const { userId } = this.props
        const isAdmin = creator && creator._id === userId

        let options
        if (isAdmin) {
            options = switchByButtonIndex([
                [
                    R.equals(0),
                    () => {
                        console.log(
                            `${DEBUG_KEY} User chooses to edit current event`
                        )
                        this.props.editEvent(item)
                    },
                ],
                [
                    R.equals(1),
                    () => {
                        console.log(
                            `${DEBUG_KEY} User chooses to delete current event`
                        )
                        this.props.deleteEvent(_id)
                    },
                ],
            ])
        } else {
            options = switchByButtonIndex([
                [
                    R.equals(0),
                    () => {
                        console.log(
                            `${DEBUG_KEY} User chooses to report this event`
                        )
                        this.props.reportEvent(_id)
                    },
                ],
            ])
        }

        const requestOptions = isAdmin
            ? ['Edit', 'Delete', 'Cancel']
            : ['Report', 'Cancel']
        const cancelIndex = isAdmin ? 2 : 1

        const eventActionSheet = actionSheet(
            requestOptions,
            cancelIndex,
            options
        )
        eventActionSheet()
    }

    _renderHeader = (props, noBorder) => {
        return <TabButtonGroup buttons={props} />
    }

    // If feed is loading and feed tab is selected, then render the spinner
    renderFooter = () => {
        const { routes, index } = this.props.navigationState
        if (this.props.feedLoading && routes[index].key === 'posts') {
            return <ActivityIndicator size="small" color="46C8F5" />
        }

        return null
    }

    /**
     * Caret to show options for an event.
     * If owner, options are delete and edit.
     * Otherwise, option is report
     */
    renderCaret(item) {
        // If item belongs to self, then caret displays delete
        const { creator, _id, maybeIsSubscribed } = item

        const isSelf = creator._id === this.props.userId
        const menu = !isSelf
            ? MenuFactory(
                  [
                      'Report',
                      maybeIsSubscribed
                          ? CARET_OPTION_NOTIFICATION_UNSUBSCRIBE
                          : CARET_OPTION_NOTIFICATION_SUBSCRIBE,
                  ],
                  (val) => {
                      if (val === 'Report') {
                          return this.props.reportEvent(_id)
                      }
                      if (val === CARET_OPTION_NOTIFICATION_UNSUBSCRIBE) {
                          return this.props.unsubscribeEntityNotification(
                              _id,
                              'Event'
                          )
                      }
                      if (val === CARET_OPTION_NOTIFICATION_SUBSCRIBE) {
                          return this.props.subscribeEntityNotification(
                              _id,
                              'Event'
                          )
                      }
                  },
                  '',
                  { ...styles.caretContainer },
                  () => console.log('User clicks on options for event')
              )
            : MenuFactory(
                  ['Edit', 'Delete'],
                  this.handleEventOptionsOnSelect,
                  '',
                  { ...styles.caretContainer },
                  () => console.log('User clicks on options for self event.')
              )
        return (
            <View style={{ position: 'absolute', top: 3, right: 3 }}>
                {menu}
            </View>
        )
    }

    renderEventImage(picture) {
        let imageUrl
        // let eventImage = (<Image source={TestEventImage} style={styles.coverImageStyle} />);
        let eventImage = (
            <View
                style={{
                    height: 110,
                    width,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Image
                    source={event_default_image}
                    style={styles.defaultCoverImageStyle}
                />
            </View>
        )
        if (picture) {
            imageUrl = `${IMAGE_BASE_URL}${picture}`
            eventImage = (
                <Image
                    onLoadStart={() => this.setState({ imageLoading: true })}
                    onLoadEnd={() => this.setState({ imageLoading: false })}
                    style={styles.coverImageStyle}
                    source={{ uri: imageUrl }}
                />
            )
        }

        return eventImage
    }

    renderEventStatus() {
        const { item, status } = this.props
        if (!item) return <View />

        const rsvpText = status === undefined ? 'RSVP' : status
        const eventProperty = item.isInviteOnly
            ? 'Private Event'
            : 'Public Event'
        const { eventPropertyTextStyle, eventPropertyContainerStyle } = styles
        return (
            <View style={eventPropertyContainerStyle}>
                <Text style={eventPropertyTextStyle}>{eventProperty}</Text>
                <Dot />
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.rsvpBoxContainerStyle}
                    onPress={this.handleRSVPOnPress}
                >
                    <Image source={EditIcon} style={styles.rsvpIconStyle} />
                    <Text style={styles.rsvpTextStyle}>
                        {rsvpText === 'NotGoing' ? 'Not going' : rsvpText}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderEventInfo() {
        const { item } = this.props
        if (!item) return <View />

        const { start, durationHours, participants } = item
        const startDate = start ? new Date(start) : new Date()
        const date =
            `${months[startDate.getMonth()]} ${startDate.getDate()}, ` +
            `${startDate.getFullYear()}`

        const startTime = `${startDate.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        })}`

        const endDate = durationHours
            ? new Date(startDate.getTime() + 1000 * 60 * 60 * durationHours)
            : new Date(startDate.getTime() + 1000 * 60 * 60 * 2)
        const endTime = `${endDate.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        })}`

        const { eventInfoBasicTextStyle, eventContainerStyle } = styles
        return (
            <View style={eventContainerStyle}>
                <StackedAvatarsV2
                    imageSource={DefaultUserProfile}
                    participants={participants}
                />
                <Text style={{ ...eventInfoBasicTextStyle, color: '#4ec9f3' }}>
                    {item.participantCount} going
                </Text>
                <Dot />
                <Text style={{ ...eventInfoBasicTextStyle }}>{date}, </Text>
                <Text style={{ ...eventInfoBasicTextStyle, fontWeight: '600' }}>
                    {startTime} - {endTime}
                </Text>
            </View>
        )
    }

    renderEventOverview(item, data) {
        const { title, _id, picture } = item
        const filterBar =
            this.props.tab === 'attendees' ? <ParticipantFilterBar /> : null

        const emptyState =
            this.props.tab === 'posts' && data.length === 0 ? (
                <EmptyResult
                    text={'No Posts'}
                    textStyle={{ paddingTop: 100 }}
                />
            ) : null

        // Currently, explored events is not synced with my events
        const inviteButton =
            this.props.tab === 'attendees' ? (
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => this.handleInvite(_id)}
                    style={styles.inviteButtonContainerStyle}
                >
                    <Text>Invite</Text>
                </TouchableOpacity>
            ) : null

        return (
            <View>
                {this.renderEventImage(picture)}
                <View style={styles.generalInfoContainerStyle}>
                    {/* {this.renderCaret(item)} */}
                    <Text style={styles.eventTitleTextStyle}>{title}</Text>
                    {this.renderEventStatus()}
                    <View
                        style={{
                            width: width * 0.75,
                            borderColor: '#dcdcdc',
                            borderWidth: 0.5,
                        }}
                    />
                    {this.renderEventInfo()}
                </View>
                {
                    // Render tabs
                    this._renderHeader(
                        {
                            jumpToIndex: (i) => this._handleIndexChange(i),
                            navigationState: this.props.navigationState,
                        },
                        this.props.tab === 'attendees'
                    )
                }
                {filterBar}
                {emptyState}
            </View>
        )
    }

    renderItem = (props) => {
        const { routes, index } = this.props.navigationState

        // TODO: refactor to become a literal function
        switch (routes[index].key) {
            case 'about': {
                return (
                    <About
                        item={props.item}
                        key={Math.random().toString(36).substr(2, 9)}
                    />
                )
            }

            case 'posts': {
                return (
                    <PostPreviewCard
                        item={props.item}
                        key={Math.random().toString(36).substr(2, 9)}
                        hasActionButton
                    />
                )
            }

            case 'attendees': {
                return (
                    <MemberListCard
                        item={props.item.participantRef}
                        key={props.index}
                    />
                )
            }

            default:
                return <View key={props.index} />
        }
    }

    render() {
        const { item, data, pageId, eventId } = this.props
        if (!item) return <View />

        return (
            <MenuProvider
                customStyles={{ backdrop: styles.backdrop }}
                skipInstanceCheck={true}
            >
                <View style={styles.containerStyle}>
                    <SearchBarHeader
                        backButton
                        onBackPress={() => Actions.pop()}
                        pageSetting
                        handlePageSetting={() => this.handlePageSetting(item)}
                    />
                    <FlatList
                        data={data}
                        renderItem={this.renderItem}
                        keyExtractor={(i) => i._id}
                        ListHeaderComponent={this.renderEventOverview(
                            item,
                            data
                        )}
                        ListFooterComponent={this.renderFooter}
                    />
                </View>
            </MenuProvider>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.3,
        // shadowRadius: 6,
    },
    defaultCoverImageStyle: {
        height: 65,
        width: 65,
    },
    coverImageStyle: {
        height: 110,
        width,
    },
    generalInfoContainerStyle: {
        backgroundColor: 'white',
        alignItems: 'center',
    },
    eventTitleTextStyle: {
        marginTop: 15,
        fontSize: 19,
        fontWeight: '300',
    },
    // Event property related styles
    eventPropertyContainerStyle: {
        margin: 8,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    eventPropertyTextStyle: {
        color: '#696969',
        fontSize: 12,
    },
    // RSVP related styles
    rsvpBoxContainerStyle: {
        height: 25,
        // width: 80,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 5,
        backgroundColor: '#efefef',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    rsvpIconStyle: {
        height: 13,
        width: 13,
        margin: 2,
    },
    rsvpTextStyle: {
        fontSize: 10,
        margin: 2,
    },

    // caret for options
    caretContainer: {
        padding: 14,
    },

    // Style for Invite button
    inviteButtonContainerStyle: {
        height: 30,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        marginRight: 20,
        backgroundColor: '#efefef',
        borderRadius: 5,
    },

    // Event info related styles
    eventContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    eventInfoBasicTextStyle: {
        fontSize: 11,
        fontWeight: '300',
    },
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.5,
    },
}

const mapStateToProps = (state) => {
    const { navigationState, item, feed, feedLoading } = state.event
    const { userId } = state.user

    const { routes, index } = navigationState
    const data = ((key) => {
        switch (key) {
            case 'about':
                return [item]

            case 'attendees':
                return participantSelector(state)

            case 'posts':
                return [...feed]

            default:
                return []
        }
    })(routes[index].key)

    return {
        navigationState,
        item,
        data,
        feedLoading,
        status: getUserStatus(state),
        tab: routes[index].key,
        userId,
    }
}

export default connect(mapStateToProps, {
    eventSelectTab,
    eventDetailClose,
    loadMoreEventFeed,
    rsvpEvent,
    openEventInviteModal,
    deleteEvent,
    editEvent,
    reportEvent,
    openPostDetail,
    subscribeEntityNotification,
    unsubscribeEntityNotification,
})(wrapAnalytics(Event, SCREENS.EVENT_DETAIL))
