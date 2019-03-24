import React, { Component } from 'react';
import {
  View,
  Image,
  Dimensions,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
 } from 'react-native';
import { connect } from 'react-redux';
import {
  MenuProvider
} from 'react-native-popup-menu';
import R from 'ramda';
import { Actions } from 'react-native-router-flux';
import Fuse from 'fuse.js';

// Components
import SearchBarHeader from '../../Common/Header/SearchBarHeader';
import TabButtonGroup from '../../Common/TabButtonGroup';
import About from './MyEventAbout';
import { StackedAvatarsV2 } from '../../Common/StackedAvatars';
import Dot from '../../Common/Dot';
import MemberListCard from '../../Tribe/MemberListCard';
import ProfilePostCard from '../../Post/PostProfileCard/ProfilePostCard';
import { MenuFactory } from '../../Common/MenuFactory';
import { actionSheet, switchByButtonIndex } from '../../Common/ActionSheetFactory';
// import ParticipantFilterBar from '../../Event/ParticipantFilterBar';
import EmptyResult from '../../Common/Text/EmptyResult';

// Asset
import TestEventImage from '../../../asset/TestEventImage.png';
import EditIcon from '../../../asset/utils/edit.png';
import DefaultUserProfile from '../../../asset/utils/defaultUserProfile.png';
import plus from '../../../asset/utils/plus.png';
import post from '../../../asset/utils/post.png';
import invite from '../../../asset/utils/invite.png';

// Actions
import {
  eventSelectTab,
  eventDetailClose,
  loadMoreEventFeed,
  myEventSelectMembersFilter,
  refreshMyEventDetail
} from '../../../redux/modules/event/MyEventActions';

import {
  subscribeEntityNotification,
  unsubscribeEntityNotification
} from '../../../redux/modules/notification/NotificationActions';

// Selector
import {
  getMyEventUserStatus,
  myEventParticipantSelector,
  makeGetEventFeed,
  makeGetEventPageById,
  makeGetEventUserStatusById,
  makeGetEventParticipantSelector
  // getMyEventMemberNavigationState
} from '../../../redux/modules/event/EventSelector';

import {
  openEventInvitModal,
  deleteEvent,
  editEvent,
  reportEvent,
  rsvpEvent
} from '../../../redux/modules/event/EventActions';

import {
  openPostDetail
} from '../../../redux/modules/feed/post/PostActions';

// Styles
import { APP_BLUE_BRIGHT, APP_DEEP_BLUE } from '../../../styles';

// Constants
import { 
  CARET_OPTION_NOTIFICATION_SUBSCRIBE,
  CARET_OPTION_NOTIFICATION_UNSUBSCRIBE
} from '../../../Utils/Constants';

const DEBUG_KEY = '[ UI MyEvent ]';
const RSVP_OPTIONS = ['Interested', 'Going', 'Maybe', 'Not Going', 'Cancel'];
const CANCEL_INDEX = 4;
const { width } = Dimensions.get('window');
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const TAG_SEARCH_OPTIONS = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    'name',
  ]
};
/**
 * This is the UI file for a single event.
 */
class MyEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageLoading: false,
      showPlus: true
    };
  }

  componentWillUnmount() {
    const { pageId, eventId } = this.props;
    this.props.eventDetailClose(eventId, pageId);
  }
  /**
   * On plus clicked, show two icons. Post and Invite
   * const { textStyle, iconStyle, iconSource, text, onPress } = button;
   */
  handlePlus = (item, navigationState) => {
    const { _id } = item;
    const { routes } = navigationState;
    const indexToGoForPost = routes.map((route) => route.key).indexOf('posts');
    const indexToGoForInvite = routes.map((route) => route.key).indexOf('attendees');

    const postCallback = () => {
      this._handleIndexChange(indexToGoForPost);
      this.props.refreshMyEventDetail(_id, undefined, this.props.pageId);
    };

    const inviteCallback = () => {
      this._handleIndexChange(indexToGoForInvite);
      this.props.refreshMyEventDetail(_id, undefined, this.props.pageId);
    };

    const participants = item.participants.map(p => p.participantRef);
    const fuse = new Fuse(participants, TAG_SEARCH_OPTIONS);
    const tagSearch = (keyword, callback) => {
      const result = fuse.search(keyword.replace('@', ''));
      callback({ data: result }, keyword);
    };

    const buttons = [
      // button info for creating a post
      {
        iconSource: post,
        text: 'Post',
        iconStyle: { height: 18, width: 18, marginLeft: 3 },
        textStyle: { marginLeft: 5 },
        onPress: () => {
          console.log('User trying to create post');
          this.setState({
            ...this.state,
            showPlus: true
          });
          Actions.pop();
          Actions.push('createPostModal', {
            belongsToEvent: _id,
            callback: postCallback,
            tagSearch
          });
        }
      },
      // button info for invite
      {
        iconSource: invite,
        text: 'Invite',
        iconStyle: { height: 18, width: 18, marginLeft: 3 },
        textStyle: { marginLeft: 5 },
        onPress: () => {
          console.log('User trying to invite an user');
          this.setState({
            ...this.state,
            showPlus: true
          });
          Actions.pop();
          this.props.openEventInvitModal(
            {
              eventId: _id,
              cardIconSource: invite,
              cardIconStyle: { tintColor: APP_BLUE_BRIGHT },
              callback: inviteCallback
            }
          );
        }
      }
    ];
    this.setState({
      ...this.state,
      showPlus: false
    });

    const callback = () => {
      this.setState({
        ...this.state,
        showPlus: true
      });
    };
    Actions.push('createButtonOverlay', { buttons, callback });
  }

  /**
   * This method is deprecated by the renderPlus
   */
  handleInvite = (_id) => {
    return this.props.openEventInvitModal(_id);
  }

  handleRSVPOnPress = () => {
    const { item, pageId } = this.props;
    if (!item) return;
    const { _id } = item;

    const switchCases = switchByButtonIndex([
      [R.equals(0), () => {
        console.log(`${DEBUG_KEY} User chooses: Intereseted`);
        this.props.rsvpEvent('Interested', _id, pageId);
      }],
      [R.equals(1), () => {
        console.log(`${DEBUG_KEY} User chooses: Going`);
        this.props.rsvpEvent('Going', _id, pageId);
      }],
      [R.equals(2), () => {
        console.log(`${DEBUG_KEY} User chooses: Maybe`);
        this.props.rsvpEvent('Maybe', _id, pageId);
      }],
      [R.equals(3), () => {
        console.log(`${DEBUG_KEY} User chooses: Not Going`);
        this.props.rsvpEvent('NotGoing', _id, pageId);
      }],
    ]);
    const rsvpActionSheet = actionSheet(
      RSVP_OPTIONS,
      CANCEL_INDEX,
      switchCases
    );
    rsvpActionSheet();
  }

  // Tab related functions
  _handleIndexChange = (index) => {
    const { pageId, eventId } = this.props;
    this.props.eventSelectTab(index, eventId, pageId);
  };

  // This function is deprecated
  handleEventOptionsOnSelect = (value) => {
    const { item } = this.props;
    const { _id } = item;
    if (value === 'Delete') {
      return this.props.deleteEvent(_id);
    }
    if (value === 'Edit') {
      return this.props.editEvent(item);
    }
  }

  /**
   * Handle modal setting on click. Show IOS menu with options
   */
  handlePageSetting = (item) => {
    const { _id, creator } = item;
    const { userId } = this.props;
    const isAdmin = creator && creator._id === userId;

    let options;
    if (isAdmin) {
      options = switchByButtonIndex([
        [R.equals(0), () => {
          console.log(`${DEBUG_KEY} User chooses to delete current event`);
          this.props.deleteEvent(_id);
        }],
        [R.equals(1), () => {
          console.log(`${DEBUG_KEY} User chooses to edit current event`);
          this.props.editEvent(item);
        }],
      ]);
    } else {
      options = switchByButtonIndex([
        [R.equals(0), () => {
          console.log(`${DEBUG_KEY} User chooses to report this event`);
          this.props.reportEvent(_id);
        }]
      ]);
    }

    const requestOptions = isAdmin ? ['Delete', 'Edit', 'Cancel'] : ['Report', 'Cancel'];
    const cancelIndex = isAdmin ? 2 : 1;

    const eventActionSheet = actionSheet(
      requestOptions,
      cancelIndex,
      options
    );
    eventActionSheet();
  }

  _renderHeader = props => {
    return (
      <TabButtonGroup buttons={props} />
    );
  };

  // If feed is loading and feed tab is selected, then render the spinner
  renderFooter = () => {
    const { routes, index } = this.props.navigationState;
    if (this.props.feedLoading && routes[index].key === 'posts') {
      return (
        <View
          style={{
            paddingVertical: 20
          }}
        >
          <ActivityIndicator size='small' color='#17B3EC' />
        </View>
      );
    }

    return null;
  }

  /**
   * Caret to show options for an event.
   * If owner, options are delete and edit.
   * Otherwise, option is report
   */
  renderCaret(item) {
    // If item belongs to self, then caret displays delete
    const { creator, _id, maybeIsSubscribed } = item;

    const isSelf = creator._id === this.props.userId;
    const menu = (!isSelf)
      ? MenuFactory(
          [
            'Report',
            maybeIsSubscribed ? CARET_OPTION_NOTIFICATION_UNSUBSCRIBE : CARET_OPTION_NOTIFICATION_SUBSCRIBE
          ],
          (val) => {  
            if (val === 'Report') {
              return this.props.reportEvent(_id);
            }
            if (val === CARET_OPTION_NOTIFICATION_UNSUBSCRIBE) {
              return this.props.unsubscribeEntityNotification(_id, 'Event');
            }
            if (val === CARET_OPTION_NOTIFICATION_SUBSCRIBE) {
              return this.props.subscribeEntityNotification(_id, 'Event');
            }
          },
          '',
          { ...styles.caretContainer },
          () => console.log('User clicks on options for event')
        )
      : MenuFactory(
          [
            'Delete',
            'Edit'
          ],
          this.handleEventOptionsOnSelect,
          '',
          { ...styles.caretContainer },
          () => console.log('User clicks on options for self event.')
        );
    return (
      <View style={{ position: 'absolute', top: 3, right: 3 }}>
        {menu}
      </View>
    );
  }

  renderEventImage(picture) {
    let imageUrl;
    let eventImage = (<Image source={TestEventImage} style={styles.coverImageStyle} />);
    if (picture) {
      imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${picture}`;
      eventImage = (
        <Image
          onLoadStart={() => this.setState({ imageLoading: true })}
          onLoadEnd={() => this.setState({ imageLoading: false })}
          style={styles.coverImageStyle}
          source={{ uri: imageUrl }}
        />
      );
    }

    return eventImage;
  }

  renderEventStatus() {
    const { item, status } = this.props;
    if (!item) return <View />;

    const rsvpText = status === undefined ? 'RSVP' : status;
    const eventProperty = item.isInviteOnly ? 'Private Event' : 'Public Event';
    const { eventPropertyTextStyle, eventPropertyContainerStyle } = styles;
    return (
      <View style={eventPropertyContainerStyle}>
        <Text style={eventPropertyTextStyle}>{eventProperty}</Text>
        <Dot />
        <TouchableOpacity 
          activeOpacity={0.85}
          style={styles.rsvpBoxContainerStyle}
          onPress={this.handleRSVPOnPress}
        >
          {/* <Image source={EditIcon} style={styles.rsvpIconStyle} /> */}
          <Image source={EditIcon} style={styles.rsvpIconStyle} />
          <Text style={styles.rsvpTextStyle}>
            {rsvpText === 'NotGoing' ? 'Not going' : rsvpText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderEventInfo() {
    const { item } = this.props;
    if (!item) return <View />;

    const { start, durationHours, participants } = item;
    const startDate = start ? new Date(start) : new Date();
    const date = `${months[startDate.getMonth() - 1]} ${startDate.getDate()}, ` +
      `${startDate.getFullYear()}`;

    const startTime = `${startDate.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })}`;

    const endDate = durationHours
      ? new Date(startDate.getTime() + (1000 * 60 * 60 * durationHours))
      : new Date(startDate.getTime() + (1000 * 60 * 60 * 2));
    const endTime = `${endDate.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })}`;
    const { eventInfoBasicTextStyle, eventContainerStyle } = styles;
    return (
      <View style={eventContainerStyle}>
        <StackedAvatarsV2 imageSource={DefaultUserProfile} participants={participants} />
        <Text style={{ ...eventInfoBasicTextStyle, color: '#4ec9f3' }}>
          {item.participantCount} going
        </Text>
        <Dot />
        <Text style={{ ...eventInfoBasicTextStyle }}>{date}, </Text>
        <Text style={{ ...eventInfoBasicTextStyle, fontWeight: '600' }}>
          {startTime} - {endTime}
        </Text>
      </View>
    );
  }

  renderMemberTabs() {
    const { memberNavigationState, eventId, pageId } = this.props;
    const { routes } = memberNavigationState;

    const props = {
      jumpToIndex: (i) => this.props.myEventSelectMembersFilter(routes[i].key, i, eventId, pageId),
      navigationState: this.props.memberNavigationState
    };
    return (
      <TabButtonGroup buttons={props} subTab />
    );
  }

  renderEventOverview(item, data) {
    const { title, _id, picture } = item;
    // const filterBar = this.props.tab === 'attendees'
    //   ? <ParticipantFilterBar />
    //   : null;
    const filterBar = this.props.tab === 'attendees'
      ? this.renderMemberTabs()
      : null;

    // Invite button is replaced by renderPlus
    const inviteButton = this.props.tab === 'attendees'
      ? (
        <TouchableOpacity activeOpacity={0.85}
          onPress={() => this.handleInvite(_id)}
          style={styles.inviteButtonContainerStyle}
        >
          <Text>Invite</Text>
        </TouchableOpacity>
      )
      : null;

    const emptyState = this.props.tab === 'posts' && data.length === 0
      ? <EmptyResult text={'No Posts'} textStyle={{ paddingTop: 100 }} />
      : null;

    return (
      <View>
        {this.renderEventImage(picture)}
        <View style={styles.generalInfoContainerStyle}>
          {/* {this.renderCaret(item)} */}
          <Text style={styles.eventTitleTextStyle}>
            {title}
          </Text>
          {this.renderEventStatus()}
          <View
            style={{
              width: width * 0.75,
              borderColor: '#dcdcdc',
              borderWidth: 0.5
            }}
          />
          {this.renderEventInfo()}

        </View>
        {
          // Render tabs
          this._renderHeader({
            jumpToIndex: (i) => this._handleIndexChange(i),
            navigationState: this.props.navigationState
          })
        }
        {filterBar}
        {this.renderFooter()}
        {emptyState}
      </View>
    );
  }

  renderItem = (props) => {
    const { routes, index } = this.props.navigationState;

    // TODO: refactor to become a literal function
    switch (routes[index].key) {
      case 'about': {
        return <About item={props.item} key={props.index} />;
      }

      case 'posts': {
        return (
          <ProfilePostCard
            item={props.item}
            key={props.index}
            hasActionButton
            onPress={(item) => this.props.openPostDetail(item)}
          />
        );
      }

      case 'attendees': {
        return <MemberListCard item={props.item.participantRef} key={props.index} />;
      }

      default:
        return <View key={props.index} />;
    }
  }

  renderPlus(item) {
    const { isMember, navigationState } = this.props;
    // if (this.state.showPlus && (isMember === 'Admin' || isMember === 'Member')) {
    if (this.state.showPlus) {
      return (
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.iconContainerStyle}
          onPress={() => this.handlePlus(item, navigationState)}
        >
          <Image style={styles.iconStyle} source={plus} />
        </TouchableOpacity>
      );
    }
    return null;
  }

  render() {
    const { item, data } = this.props;
    if (!item) return <View />;

    // console.log(`${DEBUG_KEY}: rendering myevent with item: `, item);
    return (
      <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
        <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
          <SearchBarHeader
            backButton
            onBackPress={() => {
              Actions.pop();
            }}
            pageSetting
            handlePageSetting={() => this.handlePageSetting(item)}
          />
          <FlatList
            data={data}
            renderItem={this.renderItem}
            keyExtractor={(i) => i._id}
            onRefresh={() => this.props.refreshMyEventDetail(item._id, undefined, this.props.pageId)}
            refreshing={this.props.loading}
            ListHeaderComponent={this.renderEventOverview(item, data)}
          />
          {this.renderPlus(item)}
        </View>
      </MenuProvider>
    );
  }
}

const styles = {
  coverImageStyle: {
    height: 110,
    width
  },
  generalInfoContainerStyle: {
    backgroundColor: 'white',
    alignItems: 'center'
  },
  eventTitleTextStyle: {
    marginTop: 15,
    fontSize: 19,
    fontWeight: '300'
  },
  // Event property related styles
  eventPropertyContainerStyle: {
    margin: 8,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  eventPropertyTextStyle: {
    color: '#696969',
    fontSize: 12
  },

  // caret for options
  caretContainer: {
    padding: 14
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
    borderRadius: 5
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
    flexDirection: 'row'
  },
  rsvpIconStyle: {
    height: 13,
    width: 13,
    margin: 2
  },
  rsvpTextStyle: {
    fontSize: 10,
    margin: 2
  },
  // Event info related styles
  eventContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50
  },
  eventInfoBasicTextStyle: {
    fontSize: 11,
    fontWeight: '300'
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
    backgroundColor: APP_DEEP_BLUE,
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
};

const makeMapStateToProps = () => {
  const getEventFeed = makeGetEventFeed();
  const getEventPageById = makeGetEventPageById();
  const getEventUserStatus = makeGetEventUserStatusById();
  const getEventParticipantSelector = makeGetEventParticipantSelector();

  const mapStateToProps = (state, props) => {
    const { eventId, pageId } = props;
    const feed = getEventFeed(state, eventId, pageId);
    const { event, eventPage } = getEventPageById(state, eventId, pageId);
    const userStatus = getEventUserStatus(state, eventId);

    const {
      navigationState, feedLoading, memberNavigationState, eventLoading
    } = eventPage;

    // const {
    //   navigationState, item, feed, feedLoading, memberNavigationState, eventLoading
    // } = state.myEvent;
    // const memberNavigationState = getMyEventMemberNavigationState(state);
  
    const { routes, index } = navigationState;
    const data = ((key) => {
      switch (key) {
        case 'about':
          return [event];
  
        case 'attendees':
          // return myEventParticipantSelector(state);
          return getEventParticipantSelector(state, eventId, pageId);
  
        case 'posts':
          return feed;
  
        default: return [];
      }
    })(routes[index].key);
  
    return {
      navigationState,
      item: event,
      data,
      feedLoading,
      status: userStatus,
      memberNavigationState,
      tab: routes[index].key,
      loading: eventLoading || false
    };
  };

  return mapStateToProps;
};

export default connect(
  makeMapStateToProps,
  {
    eventSelectTab,
    eventDetailClose,
    loadMoreEventFeed,
    openEventInvitModal,
    deleteEvent,
    editEvent,
    reportEvent,
    myEventSelectMembersFilter,
    rsvpEvent,
    refreshMyEventDetail,
    openPostDetail,
    subscribeEntityNotification,
    unsubscribeEntityNotification
  }
)(MyEvent);
