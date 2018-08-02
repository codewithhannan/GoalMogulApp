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
import Divider from '../Common/Divider';
import About from './About';

// Asset
import TestEventImage from '../../asset/TestEventImage.png';

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
    this.props.tribeSelectTab(index);
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

  }

  renderEventInfo() {

  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SearchBarHeader setting backButton />
        {this.renderEventImage()}
        <View style={styles.generalInfoContainerStyle}>
          <Text
            style={{ fontSize: 22, fontWeight: '300' }}
          >
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
    height: 120,
    width
  }
};

export default connect(
  null,
  null
)(Event);
