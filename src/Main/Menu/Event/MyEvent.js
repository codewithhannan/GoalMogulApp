/** @format */

import Fuse from 'fuse.js'
import R from 'ramda'
import React, { Component } from 'react'
import {
    ActivityIndicator,
    Animated,
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
import { loadFriends } from '../../../actions'
import DefaultUserProfile from '../../../asset/utils/defaultUserProfile.png'
import EditIcon from '../../../asset/utils/edit.png'
// Asset
import event_default_image from '../../../asset/utils/eventIcon.png'
import invite from '../../../asset/utils/invite.png'
import post from '../../../asset/utils/post.png'
import {
    deleteEvent,
    editEvent,
    openEventInviteModal,
    reportEvent,
    rsvpEvent,
} from '../../../redux/modules/event/EventActions'
// Selector
import {
    makeGetEventFeed,
    makeGetEventPageById,
    makeGetEventParticipantSelector,
    // getMyEventMemberNavigationState
    makeGetEventUserStatusById,
} from '../../../redux/modules/event/EventSelector'
// Actions
import {
    eventDetailClose,
    eventSelectTab,
    inviteMultipleUsersToEvent,
    loadMoreEventFeed,
    myEventSelectMembersFilter,
    refreshMyEventDetail,
} from '../../../redux/modules/event/MyEventActions'
import { openPostDetail } from '../../../redux/modules/feed/post/PostActions'
import {
    subscribeEntityNotification,
    unsubscribeEntityNotification,
} from '../../../redux/modules/notification/NotificationActions'
import {
    openMultiUserInviteModal,
    searchFriend,
} from '../../../redux/modules/search/SearchActions'
// Styles
import { color } from '../../../styles/basic'
// Constants
import {
    CARET_OPTION_NOTIFICATION_SUBSCRIBE,
    CARET_OPTION_NOTIFICATION_UNSUBSCRIBE,
    IMAGE_BASE_URL,
} from '../../../Utils/Constants'
import {
    actionSheet,
    switchByButtonIndex,
} from '../../Common/ActionSheetFactory'
import DelayedButton from '../../Common/Button/DelayedButton'
import PlusButton from '../../Common/Button/PlusButton'
import Dot from '../../Common/Dot'
// Components
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import { MenuFactory } from '../../Common/MenuFactory'
import { StackedAvatarsV2 } from '../../Common/StackedAvatars'
import TabButtonGroup from '../../Common/TabButtonGroup'
// import ParticipantFilterBar from '../../Event/ParticipantFilterBar';
import EmptyResult from '../../Common/Text/EmptyResult'
import PostPreviewCard from '../../Post/PostPreviewCard/PostPreviewCard'
import MemberListCard from '../../Tribe/MemberListCard'
import About from './MyEventAbout'
import { SCREENS, wrapAnalytics } from '../../../monitoring/segment'

const DEBUG_KEY = '[ UI MyEvent ]'
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
const TAG_SEARCH_OPTIONS = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['name'],
}

const INFO_CARD_HEIGHT = 242

/**
 * This is the UI file for a single event.
 */
class MyEvent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imageLoading: false,
            showPlus: true,
            infoCardHeight: new Animated.Value(INFO_CARD_HEIGHT),
            infoCardOpacity: new Animated.Value(1),
        }
        this._handleIndexChange = this._handleIndexChange.bind(this)
        this.handleGoingOnPress = this.handleGoingOnPress.bind(this)
    }

    componentWillUnmount() {
        const { pageId, eventId } = this.props
        this.props.eventDetailClose(eventId, pageId)
    }

    /**
     * Open multi-select user invite modal
     */
    openUserInviteModal = (item) => {
        const { title, _id } = item
        this.props.openMultiUserInviteModal({
            searchFor: this.props.searchFriend,
            onSubmitSelection: (users, inviteToEntity, actionToExecute) => {
                const callback = () => {
                    this.props.refreshMyEventDetail(
                        inviteToEntity,
                        null,
                        this.props.pageId
                    )
                    actionToExecute()
                }
                this.props.inviteMultipleUsersToEvent(_id, users, callback)
            },
            onCloseCallback: (actionToExecute) => {
                actionToExecute()
            },
            inviteToEntityType: 'Event',
            inviteToEntityName: title,
            inviteToEntity: _id,
            preload: this.props.loadFriends,
        })
    }

    /**
     * User clicks on the number of participants going
     * this should redirect to participants page with
     * subtab going
     */
    handleGoingOnPress = () => {
        // 3 is the participant index
        this._handleIndexChange(2)
        const { memberNavigationState, pageId, eventId } = this.props
        const { routes } = memberNavigationState

        // 0 is the Going index
        this.props.myEventSelectMembersFilter(routes[0].key, 0, eventId, pageId)
    }

    /**
     * On plus clicked, show two icons. Post and Invite
     * const { textStyle, iconStyle, iconSource, text, onPress } = button;
     */
    handlePlus = (item, navigationState) => {
        const { _id } = item
        const { routes } = navigationState
        const indexToGoForPost = routes
            .map((route) => route.key)
            .indexOf('posts')
        const indexToGoForInvite = routes
            .map((route) => route.key)
            .indexOf('attendees')

        const postCallback = () => {
            this._handleIndexChange(indexToGoForPost)
            this.props.refreshMyEventDetail(_id, undefined, this.props.pageId)
        }

        const inviteCallback = () => {
            this._handleIndexChange(indexToGoForInvite)
            this.props.refreshMyEventDetail(_id, undefined, this.props.pageId)
        }

        const participants = item.participants.map((p) => p.participantRef)
        const fuse = new Fuse(participants, TAG_SEARCH_OPTIONS)
        const tagSearch = (keyword, callback) => {
            const result = fuse.search(keyword.replace('@', ''))
            callback({ data: result }, keyword)
        }

        const buttons = [
            // button info for creating a post
            {
                iconSource: post,
                text: 'Post',
                iconStyle: { height: 18, width: 18, marginLeft: 3 },
                textStyle: { marginLeft: 5 },
                onPress: () => {
                    console.log('User trying to create post')
                    this.setState({
                        ...this.state,
                        showPlus: true,
                    })
                    Actions.push('createPostModal', {
                        belongsToEvent: _id,
                        callback: postCallback,
                        tagSearch,
                    })
                },
            },
            // button info for invite
            {
                iconSource: invite,
                text: 'Invite',
                iconStyle: { height: 18, width: 18, marginLeft: 3 },
                textStyle: { marginLeft: 5 },
                onPress: () => {
                    console.log('User trying to invite an user')
                    this.setState({
                        ...this.state,
                        showPlus: true,
                    })
                    // this.props.openEventInviteModal(
                    //   {
                    //     eventId: _id,
                    //     cardIconSource: invite,
                    //     cardIconStyle: { tintColor: APP_BLUE_BRIGHT },
                    //     callback: inviteCallback
                    //   }
                    // );
                    this.openUserInviteModal(item)
                },
            },
        ]
        this.setState({
            ...this.state,
            showPlus: false,
        })

        const callback = () => {
            this.setState({
                ...this.state,
                showPlus: true,
            })
        }
        Actions.push('createButtonOverlay', {
            buttons,
            callback,
            onCancel: () => {
                this.setState({
                    ...this.state,
                    showPlus: true,
                })
            },
        })
    }

    /**
     * This method is deprecated by the renderPlus
     */
    handleInvite = (_id) => {
        return this.props.openEventInviteModal(_id)
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
        const { pageId, eventId, navigationState } = this.props
        const { routes } = navigationState

        this.props.eventSelectTab(index, eventId, pageId)

        if (routes[index].key !== 'about') {
            // Animated to hide the infoCard if not on about tab
            Animated.parallel([
                Animated.timing(this.state.infoCardHeight, {
                    useNativeDriver: false,
                    duration: 200,
                    toValue: 0,
                }),
                Animated.timing(this.state.infoCardOpacity, {
                    useNativeDriver: false,
                    duration: 200,
                    toValue: 0,
                }),
            ]).start()
        } else {
            // Animated to open the infoCard if on about tab
            Animated.parallel([
                Animated.timing(this.state.infoCardHeight, {
                    useNativeDriver: false,
                    duration: 200,
                    toValue: INFO_CARD_HEIGHT,
                }),
                Animated.timing(this.state.infoCardOpacity, {
                    useNativeDriver: false,
                    duration: 200,
                    toValue: 1,
                }),
            ]).start()
        }
    }

    // This function is deprecated
    handleEventOptionsOnSelect = (value) => {
        const { item } = this.props
        const { _id } = item
        if (value === 'Delete') {
            return this.props.deleteEvent(_id)
        }
        if (value === 'Edit') {
            return this.props.editEvent(item)
        }
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
        return (
            <TabButtonGroup
                buttons={props}
                noBorder={noBorder}
                buttonStyle={{
                    selected: {
                        backgroundColor: color.GM_BLUE,
                        tintColor: 'white',
                        color: 'white',
                        fontWeight: '700',
                    },
                    unselected: {
                        backgroundColor: '#FCFCFC',
                        tintColor: '#616161',
                        color: '#616161',
                        fontWeight: '600',
                    },
                }}
            />
        )
    }

    // If feed is loading and feed tab is selected, then render the spinner
    renderFooter = () => {
        const { routes, index } = this.props.navigationState
        if (this.props.feedLoading && routes[index].key === 'posts') {
            return (
                <View
                    style={{
                        paddingVertical: 20,
                    }}
                >
                    <ActivityIndicator size="small" color="#17B3EC" />
                </View>
            )
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

        const rsvpText =
            status === undefined || status === 'Invited' ? 'RSVP' : status
        const eventProperty = item.isInviteOnly
            ? 'Private Event'
            : 'Public Event'
        const { eventPropertyTextStyle, eventPropertyContainerStyle } = styles
        return (
            <View style={eventPropertyContainerStyle}>
                <Text style={eventPropertyTextStyle}>{eventProperty}</Text>
                <Dot />
                <DelayedButton
                    activeOpacity={0.6}
                    style={styles.rsvpBoxContainerStyle}
                    onPress={this.handleRSVPOnPress}
                >
                    {/* <Image source={EditIcon} style={styles.rsvpIconStyle} /> */}
                    <Image source={EditIcon} style={styles.rsvpIconStyle} />
                    <Text style={styles.rsvpTextStyle}>
                        {rsvpText === 'NotGoing' ? 'Not going' : rsvpText}
                    </Text>
                </DelayedButton>
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
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={this.handleGoingOnPress}
                >
                    <Text
                        style={{ ...eventInfoBasicTextStyle, color: '#4ec9f3' }}
                    >
                        {item.participantCount} going
                    </Text>
                </TouchableOpacity>

                <Dot />
                <Text style={{ ...eventInfoBasicTextStyle }}>{date}, </Text>
                <Text style={{ ...eventInfoBasicTextStyle, fontWeight: '600' }}>
                    {startTime} - {endTime}
                </Text>
            </View>
        )
    }

    renderMemberTabs() {
        const { memberNavigationState, eventId, pageId } = this.props
        const { routes } = memberNavigationState

        // Button style 1
        // const buttonStyle = {
        //   selected: {
        //     backgroundColor: 'white', // container background style
        //     tintColor: '#696969', // icon tintColor
        //     color: '#696969', // text color
        //     fontWeight: '800', // text fontWeight
        //     statColor: 'white' // stat icon color
        //   },
        //   unselected: {
        //     backgroundColor: 'white',
        //     tintColor: '#696969',
        //     color: '#b2b2b2',
        //     fontWeight: '600',
        //     statColor: '#696969'
        //   }
        // };

        const props = {
            jumpToIndex: (i) =>
                this.props.myEventSelectMembersFilter(
                    routes[i].key,
                    i,
                    eventId,
                    pageId
                ),
            navigationState: this.props.memberNavigationState,
        }
        return (
            <View>
                {/* <TabButtonGroup buttons={props} subTab buttonStyle={buttonStyle} noVerticalDivider noBorder /> */}
                <TabButtonGroup buttons={props} noVerticalDivider />
            </View>
        )
    }

    renderEventOverview(item, data) {
        const { title, _id, picture } = item
        // const filterBar = this.props.tab === 'attendees'
        //   ? <ParticipantFilterBar />
        //   : null;
        const filterBar =
            this.props.tab === 'attendees' ? this.renderMemberTabs() : null

        // Invite button is replaced by renderPlus
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

        const emptyState =
            this.props.tab === 'posts' && data.length === 0 ? (
                <EmptyResult
                    text={'No Posts'}
                    textStyle={{ paddingTop: 100 }}
                />
            ) : null

        return (
            <View style={{ flex: 1 }}>
                <Animated.View
                    style={{
                        height: this.state.infoCardHeight,
                        opacity: this.state.infoCardOpacity,
                    }}
                >
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
                </Animated.View>
                {
                    // Render tabs
                    this._renderHeader(
                        {
                            jumpToIndex: (i) => this._handleIndexChange(i),
                            navigationState: this.props.navigationState,
                        },
                        this.props.tab !== 'about'
                    )
                }
                {filterBar}
                {this.renderFooter()}
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
                        key={Math.random().toString(36).substr(2, 9)}
                    />
                )
            }

            default:
                return <View key={Math.random().toString(36).substr(2, 9)} />
        }
    }

    renderPlus(item) {
        const { isMember, navigationState } = this.props
        return (
            <PlusButton
                plusActivated={this.state.showPlus}
                onPress={() => this.handlePlus(item, navigationState)}
            />
        )
    }

    render() {
        const { item, data } = this.props
        if (!item) return <View />

        // console.log(`${DEBUG_KEY}: rendering myevent with item: `, item);
        return (
            <MenuProvider
                customStyles={{ backdrop: styles.backdrop }}
                skipInstanceCheck={true}
            >
                <View style={styles.containerStyle}>
                    <SearchBarHeader
                        backButton
                        onBackPress={() => {
                            Actions.pop()
                        }}
                        pageSetting
                        handlePageSetting={() => this.handlePageSetting(item)}
                    />
                    <FlatList
                        data={data}
                        renderItem={this.renderItem}
                        keyExtractor={(i) => i._id}
                        onRefresh={() =>
                            this.props.refreshMyEventDetail(
                                item._id,
                                undefined,
                                this.props.pageId
                            )
                        }
                        refreshing={this.props.loading}
                        ListHeaderComponent={this.renderEventOverview(
                            item,
                            data
                        )}
                    />
                    {this.renderPlus(item)}
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

    // RSVP related styles
    rsvpBoxContainerStyle: {
        height: 25,
        // width: 60,
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
    // Styles for plus icon
    iconContainerStyle: {
        position: 'absolute',
        bottom: 20,
        right: 15,
        height: 54,
        width: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#17B3EC',
        backgroundColor: color.GM_BLUE,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
    },
    iconStyle: {
        height: 26,
        width: 26,
        tintColor: 'white',
    },
}

const makeMapStateToProps = () => {
    const getEventFeed = makeGetEventFeed()
    const getEventPageById = makeGetEventPageById()
    const getEventUserStatus = makeGetEventUserStatusById()
    const getEventParticipantSelector = makeGetEventParticipantSelector()

    const mapStateToProps = (state, props) => {
        const { userId } = state.user
        const { eventId, pageId } = props
        const feed = getEventFeed(state, eventId, pageId)
        const { event, eventPage } = getEventPageById(state, eventId, pageId)
        const userStatus = getEventUserStatus(state, eventId)

        const {
            navigationState,
            feedLoading,
            memberNavigationState,
            eventLoading,
        } = eventPage

        // const {
        //   navigationState, item, feed, feedLoading, memberNavigationState, eventLoading
        // } = state.myEvent;
        // const memberNavigationState = getMyEventMemberNavigationState(state);

        const { routes, index } = navigationState
        const data = ((key) => {
            switch (key) {
                case 'about':
                    return [event]

                case 'attendees':
                    // return myEventParticipantSelector(state);
                    return getEventParticipantSelector(state, eventId, pageId)

                case 'posts':
                    return feed

                default:
                    return []
            }
        })(routes[index].key)

        return {
            navigationState,
            item: event,
            data,
            feedLoading,
            status: userStatus,
            memberNavigationState,
            tab: routes[index].key,
            loading: eventLoading || false,
            userId,
        }
    }

    return mapStateToProps
}

export default connect(makeMapStateToProps, {
    eventSelectTab,
    eventDetailClose,
    loadMoreEventFeed,
    openEventInviteModal,
    deleteEvent,
    editEvent,
    reportEvent,
    myEventSelectMembersFilter,
    rsvpEvent,
    refreshMyEventDetail,
    openPostDetail,
    subscribeEntityNotification,
    unsubscribeEntityNotification,
    // Multi friend invite
    searchFriend,
    openMultiUserInviteModal,
    inviteMultipleUsersToEvent,
    loadFriends,
})(wrapAnalytics(MyEvent, SCREENS.MY_EVENT_DETAIL))
