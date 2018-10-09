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

// Components
import SearchBarHeader from '../../Common/Header/SearchBarHeader';
import TabButtonGroup from '../../Common/TabButtonGroup';
import About from './MyEventAbout';
import StackedAvatars from '../../Common/StackedAvatars';
import Dot from '../../Common/Dot';
import MemberListCard from '../../Tribe/MemberListCard';
import ProfilePostCard from '../../Post/PostProfileCard/ProfilePostCard';
import { MenuFactory } from '../../Common/MenuFactory';
import ParticipantFilterBar from '../../Event/ParticipantFilterBar';

// Asset
import TestEventImage from '../../../asset/TestEventImage.png';
import EditIcon from '../../../asset/utils/edit.png';
import DefaultUserProfile from '../../../asset/test-profile-pic.png';

// Actions
import {
  eventSelectTab,
  eventDetailClose,
  loadMoreEventFeed,
} from '../../../redux/modules/event/MyEventActions';

import {
  openEventInvitModal,
  deleteEvent,
  editEvent,
  reportEvent
} from '../../../redux/modules/event/EventActions';

const { width } = Dimensions.get('window');
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/**
 * This is the UI file for a single event.
 */
class MyEvent extends Component {
  handleInvite = (_id) => {
    return this.props.openEventInvitModal(_id);
  }

  // Tab related functions
  _handleIndexChange = (index) => {
    this.props.eventSelectTab(index);
  };

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

  /**
   * Caret to show options for an event.
   * If owner, options are delete and edit.
   * Otherwise, option is report
   */
  renderCaret(item) {
    // If item belongs to self, then caret displays delete
    const { creator, _id } = item;

    const isSelf = creator._id === this.props.userId;
    const menu = (!isSelf)
      ? MenuFactory(
          [
            'Report',
          ],
          () => this.props.reportEvent(_id),
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
    const { item } = this.props;
    if (!item) return <View />;

    const eventProperty = item.isInviteOnly ? 'Private Event' : 'Public Event';
    const { eventPropertyTextStyle, eventPropertyContainerStyle } = styles;
    return (
      <View style={eventPropertyContainerStyle}>
        <Text style={eventPropertyTextStyle}>{eventProperty}</Text>
        <Dot />
        <View style={styles.rsvpBoxContainerStyle}>
          <Image source={EditIcon} style={styles.rsvpIconStyle} />
          <Text style={styles.rsvpTextStyle}>RSVP</Text>
        </View>
      </View>
    );
  }

  renderEventInfo() {
    const { item } = this.props;
    if (!item) return <View />;

    const { start, durationHours } = item;
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
          {this.renderCaret(item)}
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
    width: 60,
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
  }
};

const mapStateToProps = state => {
  const { navigationState, item, feed, feedLoading } = state.myEvent;

  const { routes, index } = navigationState;
  const data = ((key) => {
    switch (key) {
      case 'about':
        return [item];

      case 'attendees':
        return item.participants;

      case 'posts':
        return feed;

      default: return [];
    }
  })(routes[index].key);

  return {
    navigationState,
    item,
    data,
    feedLoading
  };
};


export default connect(
  mapStateToProps,
  {
    eventSelectTab,
    eventDetailClose,
    loadMoreEventFeed,
    openEventInvitModal,
    deleteEvent,
    editEvent,
    reportEvent
  }
)(MyEvent);
