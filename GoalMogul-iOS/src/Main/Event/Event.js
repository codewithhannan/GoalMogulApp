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
import { MenuProvider } from 'react-native-popup-menu';

// Components
import SearchBarHeader from '../Common/Header/SearchBarHeader';
import TabButtonGroup from '../Common/TabButtonGroup';
import About from './About';
import StackedAvatars from '../Common/StackedAvatars';
import Dot from '../Common/Dot';
import MemberListCard from '../Tribe/MemberListCard';
import ParticipantFilterBar from './ParticipantFilterBar';

import ProfilePostCard from '../Post/PostProfileCard/ProfilePostCard';
import { actionSheet, switchByButtonIndex } from '../Common/ActionSheetFactory';

// Asset
import TestEventImage from '../../asset/TestEventImage.png';
import EditIcon from '../../asset/utils/edit.png';
import DefaultUserProfile from '../../asset/test-profile-pic.png';

// Actions
import {
  eventSelectTab,
  eventDetailClose,
  loadMoreEventFeed,
  rsvpEvent,
  openEventInvitModal
} from '../../redux/modules/event/EventActions';

// Selector
import {
  getUserStatus,
  participantSelector
} from '../../redux/modules/event/EventSelector';


const DEBUG_KEY = '[ Component SearchBarHeader ]';
const RSVP_OPTIONS = ['Interested', 'Going', 'Maybe', 'Not Going', 'Cancel'];
const CANCEL_INDEX = 4;
const { width } = Dimensions.get('window');
/**
 * This is the UI file for a single event.
 */
class Event extends Component {

  handleInvite = (_id) => {
    return this.props.openEventInvitModal(_id);
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

  _renderHeader = props => {
    return (
      <TabButtonGroup buttons={props} />
    );
  };

  // If feed is loading and feed tab is selected, then render the spinner
  renderFooter = () => {
    const { routes, index } = this.props.navigationState;
    if (this.props.feedLoading && routes[index].key === 'posts') {
      return <ActivityIndicator size='small' color='45C9F6' />;
    }

    return '';
  }

  renderEventImage() {
    const { item } = this.props;
    if (!item) return <View />;

    const { picture } = item;
    if (picture && picture.length > 0) {
      // Return provided picture
      return (
        <Image source={TestEventImage} style={styles.coverImageStyle} />
      );
    }
    // Return default picture
    return (
      <Image source={TestEventImage} style={styles.coverImageStyle} />
    );
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

    const date = 'August 12';
    const startTime = '5pm';
    const endTime = '9pm';
    const { eventInfoBasicTextStyle, eventContainerStyle } = styles;
    return (
      <View style={eventContainerStyle}>
        <StackedAvatars imageSource={DefaultUserProfile} />
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

  renderEventOverview(item) {
    const { title, _id } = item;
    const filterBar = this.props.tab === 'attendees'
      ? <ParticipantFilterBar />
      : '';

    const inviteButton = this.props.tab === 'attendees'
      ? (
        <TouchableOpacity
          onPress={() => this.handleInvite(_id)}
          style={styles.inviteButtonContainerStyle}
        >
          <Text>Invite</Text>
        </TouchableOpacity>
      )
      : '';

    return (
      <View>
        {this.renderEventImage()}
        <View style={styles.generalInfoContainerStyle}>
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
        {inviteButton}
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
        <View style={{ flex: 1 }}>
          <SearchBarHeader backButton onBackPress={() => this.props.eventDetailClose()} />
          <FlatList
            data={data}
            renderItem={this.renderItem}
            keyExtractor={(i) => i._id}
            ListHeaderComponent={this.renderEventOverview(item)}
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
    tab: routes[index].key
  };
};


export default connect(
  mapStateToProps,
  {
    eventSelectTab,
    eventDetailClose,
    loadMoreEventFeed,
    rsvpEvent,
    openEventInvitModal
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
