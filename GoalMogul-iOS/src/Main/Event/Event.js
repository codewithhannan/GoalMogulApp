import React, { Component } from 'react';
import {
  View,
  Image,
  Dimensions,
  Text
 } from 'react-native';
import { connect } from 'react-redux';
import { TabViewAnimated, SceneMap } from 'react-native-tab-view';

// Components
import SearchBarHeader from '../Common/Header/SearchBarHeader';
import TabButtonGroup from '../Common/TabButtonGroup';
import About from './About';
import StackedAvatars from '../Common/StackedAvatars';
import Dot from '../Common/Dot';

// Asset
import TestEventImage from '../../asset/TestEventImage.png';
import EditIcon from '../../asset/utils/edit.png';
import DefaultUserProfile from '../../asset/test-profile-pic.png';

// Actions
import {
  eventSelectTab
} from '../../redux/modules/event/EventActions';

const { width } = Dimensions.get('window');
/**
 * This is the UI file for a single event.
 */
class Event extends Component {

  // Tab related functions
  _handleIndexChange = (index) => {
    this.props.eventSelectTab(index);
  };

  _renderHeader = props => {
    return (
      <TabButtonGroup buttons={props} />
    );
  };

  _renderScene = SceneMap({
    about: About,
    posts: About,
    attendees: About,
  });


  renderEventImage() {
    return (
      <Image source={TestEventImage} style={styles.coverImageStyle} />
    );
  }

  renderEventStatus() {
    const { eventPropertyTextStyle, eventPropertyContainerStyle } = styles;
    return (
      <View style={eventPropertyContainerStyle}>
        <Text style={eventPropertyTextStyle}>Private Event</Text>
        <Dot />
        <View style={styles.rsvpBoxContainerStyle}>
          <Image source={EditIcon} style={styles.rsvpIconStyle} />
          <Text style={styles.rsvpTextStyle}>RSVP</Text>
        </View>
      </View>
    );
  }

  renderEventInfo() {
    const date = 'August 12';
    const startTime = '5pm';
    const endTime = '9pm';
    const { eventInfoBasicTextStyle, eventContainerStyle } = styles;
    return (
      <View style={eventContainerStyle}>
        <StackedAvatars imageSource={DefaultUserProfile} />
        <Text style={{ ...eventInfoBasicTextStyle, color: '#4ec9f3' }}>37 going</Text>
        <Dot />
        <Text style={{ ...eventInfoBasicTextStyle }}>{date}, </Text>
        <Text style={{ ...eventInfoBasicTextStyle, fontWeight: '600' }}>
          {startTime} - {endTime}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SearchBarHeader setting backButton />
        {this.renderEventImage()}
        <View style={styles.generalInfoContainerStyle}>
          <Text style={styles.eventTitleTextStyle}>
            Jay's end of internship party
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
        <TabViewAnimated
          navigationState={this.props.navigationState}
          renderScene={this._renderScene}
          renderHeader={this._renderHeader}
          onIndexChange={this._handleIndexChange}
          useNativeDriver
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
  const { navigationState } = state.event;

  return {
    navigationState
  };
};


export default connect(
  mapStateToProps,
  {
    eventSelectTab
  }
)(Event);
