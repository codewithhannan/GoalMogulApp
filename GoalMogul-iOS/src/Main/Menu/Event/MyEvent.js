import React, { Component } from 'react';
import {
  View,
  Image,
  Dimensions,
  Text,
  FlatList,
  ActivityIndicator
 } from 'react-native';
import { connect } from 'react-redux';

// Components
import SearchBarHeader from '../../Common/Header/SearchBarHeader';
import TabButtonGroup from '../../Common/TabButtonGroup';
import About from './MyEventAbout';
import StackedAvatars from '../../Common/StackedAvatars';
import Dot from '../../Common/Dot';
import MemberListCard from '../../Tribe/MemberListCard';

import GoalCard from '../../Goal/GoalCard/GoalCard';
import NeedCard from '../../Goal/NeedCard/NeedCard';

// Asset
import TestEventImage from '../../../asset/TestEventImage.png';
import EditIcon from '../../../asset/utils/edit.png';
import DefaultUserProfile from '../../../asset/test-profile-pic.png';

// Actions
import {
  eventSelectTab,
  eventDetailClose,
  loadMoreEventFeed
} from '../../../redux/modules/event/MyEventActions';

const { width } = Dimensions.get('window');
/**
 * This is the UI file for a single event.
 */
class MyEvent extends Component {

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
    const { title } = item;

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
        if (props.item.type === 'need') {
          return <NeedCard item={props.item} key={props.index} />;
        } else if (props.item.type === 'goal') {
          return <GoalCard item={props.item} key={props.index} />;
        }
        return (
          <View
            item={props.item}
            key={props.index}
            style={{ height: 20, backgroundColor: 'black' }}
          />
        );
      }

      case 'attendees': {
        return <MemberListCard item={props.item} key={props.index} />;
      }

      default:
        return <View key={props.index} />;
    }
  }

  render() {
    const { item, data } = this.props;
    if (!item) return <View />;

    return (
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
    loadMoreEventFeed
  }
)(MyEvent);
