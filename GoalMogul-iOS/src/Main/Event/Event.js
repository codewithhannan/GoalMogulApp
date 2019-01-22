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
import R from 'ramda';
import {
  MenuProvider
} from 'react-native-popup-menu';

// Components
import SearchBarHeader from '../Common/Header/SearchBarHeader';
import TabButtonGroup from '../Common/TabButtonGroup';
import About from './About';
import StackedAvatars, { StackedAvatarsV2 } from '../Common/StackedAvatars';
import Dot from '../Common/Dot';
import MemberListCard from '../Tribe/MemberListCard';
import ParticipantFilterBar from './ParticipantFilterBar';
import EmptyResult from '../Common/Text/EmptyResult';

import ProfilePostCard from '../Post/PostProfileCard/ProfilePostCard';
import { actionSheet, switchByButtonIndex } from '../Common/ActionSheetFactory';
import { MenuFactory } from '../Common/MenuFactory';

// Asset
import TestEventImage from '../../asset/TestEventImage.png';
import EditIcon from '../../asset/utils/edit.png';
import DefaultUserProfile from '../../asset/utils/defaultUserProfile.png';

// Actions
import {
  eventSelectTab,
  eventDetailClose,
  loadMoreEventFeed,
  rsvpEvent,
  openEventInvitModal,
  deleteEvent,
  editEvent,
  reportEvent
} from '../../redux/modules/event/EventActions';

import {
  openPostDetail
} from '../../redux/modules/feed/post/PostActions';

import {
  subscribeEntityNotification,
  unsubscribeEntityNotification
} from '../../redux/modules/notification/NotificationActions';

// Selector
import {
  getUserStatus,
  participantSelector
} from '../../redux/modules/event/EventSelector';


const DEBUG_KEY = '[ UI Event ]';
const RSVP_OPTIONS = ['Interested', 'Going', 'Maybe', 'Not Going', 'Cancel'];
const CANCEL_INDEX = 4;
const { width } = Dimensions.get('window');
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/**
 * This is the UI file for a single event.
 */
class Event extends Component {

  handleInvite = (_id) => {
    return this.props.openEventInvitModal(_id);
  }

  /**
   * This function is deprecated since renderCaret is replaced by
   * handlePageSetting
   */
  handleEventOptionsOnSelect = (value) => {
    const { item } = this.props;
    if (!item) return;

    const { _id } = item;
    if (value === 'Delete') {
      return this.props.deleteEvent(_id);
    }
    if (value === 'Edit') {
      return this.props.editEvent(item);
    }
  }

  handleRSVPOnPress = () => {
    const { item } = this.props;
    if (!item) return;
    const { _id } = item;

    const switchCases = switchByButtonIndex([
      [R.equals(0), () => {
        console.log(`${DEBUG_KEY} User chooses: Intereseted`);
        this.props.rsvpEvent('Interested', _id);
      }],
      [R.equals(1), () => {
        console.log(`${DEBUG_KEY} User chooses: Going`);
        this.props.rsvpEvent('Going', _id);
      }],
      [R.equals(2), () => {
        console.log(`${DEBUG_KEY} User chooses: Maybe`);
        this.props.rsvpEvent('Maybe', _id);
      }],
      [R.equals(3), () => {
        console.log(`${DEBUG_KEY} User chooses: Not Going`);
        this.props.rsvpEvent('NotGoing', _id);
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
    this.props.eventSelectTab(index);
  };

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
      return <ActivityIndicator size='small' color='46C8F5' />;
    }

    return '';
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
            maybeIsSubscribed ? 'Unsubscribe' : 'Subscribe'
          ],
          (val) => {  
            if (val === 'Report') {
              return this.props.reportEvent(_id);
            }
            if (val === 'Unsubscribe') {
              return this.props.unsubscribeEntityNotification(_id, 'Event');
            }
            if (val === 'Subscribe') {
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
        <TouchableOpacity activeOpacity={0.85}
          style={styles.rsvpBoxContainerStyle}
          onPress={this.handleRSVPOnPress}
        >
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

  renderEventOverview(item, data) {
    const { title, _id, picture } = item;
    const filterBar = this.props.tab === 'attendees'
      ? <ParticipantFilterBar />
      : '';

    const emptyState = this.props.tab === 'posts' && data.length === 0
      ? <EmptyResult text={'No Posts'} textStyle={{ paddingTop: 100 }} />
    : '';

    // Currently, explored events is not synced with my events
    const inviteButton = this.props.tab === 'attendees'
      ? (
        <TouchableOpacity activeOpacity={0.85}
          onPress={() => this.handleInvite(_id)}
          style={styles.inviteButtonContainerStyle}
        >
          <Text>Invite</Text>
        </TouchableOpacity>
      )
      : '';

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

  render() {
    const { item, data } = this.props;
    if (!item) return <View />;

    return (
      <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
        <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
          <SearchBarHeader
            backButton
            onBackPress={() => this.props.eventDetailClose()}
            pageSetting
            handlePageSetting={() => this.handlePageSetting(item)}
          />
          <FlatList
            data={data}
            renderItem={this.renderItem}
            keyExtractor={(i) => i._id}
            ListHeaderComponent={this.renderEventOverview(item, data)}
            ListFooterComponent={this.renderFooter}
          />

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
  // RSVP related styles
  rsvpBoxContainerStyle: {
    height: 25,
    width: 80,
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
  }
};

const mapStateToProps = state => {
  const { navigationState, item, feed, feedLoading } = state.event;
  const { userId } = state.user;

  const { routes, index } = navigationState;
  const data = ((key) => {
    switch (key) {
      case 'about':
        return [item];

      case 'attendees':
        return participantSelector(state);

      case 'posts':
      // TODO: delete testData
        return [...feed, ...testData];

      default: return [];
    }
  })(routes[index].key);

  return {
    navigationState,
    item,
    data,
    feedLoading,
    status: getUserStatus(state),
    tab: routes[index].key,
    userId
  };
};


export default connect(
  mapStateToProps,
  {
    eventSelectTab,
    eventDetailClose,
    loadMoreEventFeed,
    rsvpEvent,
    openEventInvitModal,
    deleteEvent,
    editEvent,
    reportEvent,
    openPostDetail,
    subscribeEntityNotification,
    unsubscribeEntityNotification
  }
)(Event);

// TODO: delete
const testData = [
  {
    _id: '5b5677e2e2f7ceccddb56067',
    created: '2018-07-24T00:50:42.534Z',
    lastUpdated: '2018-07-24T00:50:42.534Z',
    owner: {
        _id: '5b17781ebec96d001a409960',
        name: 'jia zeng',
        profile: {
            views: 0,
            pointsEarned: 0,
            elevatorPitch: '',
            occupation: 'test'
        }
    },
    postType: 'ShareGoal',
    privacy: 'friends',
    __v: 0,
    content: {
      text: 'This is a test post.',
      links: [],
      tags: []
    },
    needRef: {

    },
    goalRef: {
      __v: 0,
      _id: '5b502211e500e3001afd1e20',
      category: 'General',
      created: '2018-07-19T05:30:57.531Z',
      details: {
        tags: [],
        text: 'This is detail'
      },
      feedInfo: {
        _id: '5b502211e500e3001afd1e18',
        publishDate: '2018-07-19T05:30:57.531Z',
      },
      lastUpdated: '2018-07-19T05:30:57.531Z',
      needs: [{
        created: '2018-07-19T05:30:57.531Z',
        description: 'introduction to someone from the Bill and Melinda Gates Foundation',
        isCompleted: false,
        order: 0,
      },
      {
        created: '2018-07-19T05:30:57.531Z',
        description: 'Get in contact with Nuclear experts',
        isCompleted: false,
        order: 1,
      },
      {
        created: '2018-07-19T05:30:57.531Z',
        description: 'Legal & Safety experts who have worked with the United States',
        isCompleted: false,
        order: 2,
      }],
      owner: {
        _id: '5b17781ebec96d001a409960',
        name: 'jia zeng',
        profile: {
          elevatorPitch: 'This is my elevatorPitch',
          occupation: 'Software Engineer',
          pointsEarned: 10,
          views: 0,
        },
      },
      priority: 3,
      privacy: 'friends',
      steps: [],
      title: 'Establish a LMFBR near Westport, Connecticut by 2020',
    }
  },
  {
    _id: '5b5677e2e2f7ceccddb56068',
    created: '2018-07-24T00:50:42.534Z',
    lastUpdated: '2018-07-24T00:50:42.534Z',
    owner: {
        _id: '5b17781ebec96d001a409960',
        name: 'jia zeng',
        profile: {
            views: 0,
            pointsEarned: 0,
            elevatorPitch: '',
            occupation: 'test'
        }
    },
    postType: 'General',
    privacy: 'friends',
    __v: 0,
    content: {
      text: 'This is a test post with content.',
      links: [],
      tags: []
    }
  }
];
