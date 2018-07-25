import React, { Component } from 'react';
import {
  View,
  Image,
  Dimensions
 } from 'react-native';
import { connect } from 'react-redux';
import { TabViewAnimated, SceneMap } from 'react-native-tab-view';
import { MenuProvider } from 'react-native-popup-menu';

import SearchBarHeader from '../Common/Header/SearchBarHeader';

import TestEventImage from '../../asset/TestEventImage.png';

const { width } = Dimensions.get('window');
/**
 * This is the UI file for a single event.
 */
class Event extends Component {

  renderEventImage() {
    return (
      <Image source={TestEventImage} style={styles.coverImageStyle} />
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SearchBarHeader setting backButton />
        {this.renderEventImage()}
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
