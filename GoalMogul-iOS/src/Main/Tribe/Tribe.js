import React, { Component } from 'react';
import {
  View,
  Image,
  Dimensions,
  Text
 } from 'react-native';
import { connect } from 'react-redux';
import { TabViewAnimated, SceneMap } from 'react-native-tab-view';
import { MenuProvider } from 'react-native-popup-menu';
import { Icon } from 'react-native-elements';

// Components
import SearchBarHeader from '../Common/Header/SearchBarHeader';
import TabButtonGroup from '../Common/TabButtonGroup';
import Divider from '../Common/Divider';
import About from './About';

import TestEventImage from '../../asset/TestEventImage.png';
import {
  tribeSelectTab
} from '../../redux/modules/tribe/TribeActions';

const { width } = Dimensions.get('window');
/**
 * This is the UI file for a single event.
 */
class Tribe extends Component {

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
    members: About,
  });

  renderEventImage() {
    return (
      <View style={styles.imageContainerStyle}>
        <Image source={TestEventImage} style={styles.imageStyle} />
      </View>
    );
  }

  // Render tribe visibility and user membership status
  renderVisibilityAndStatus() {
    return (
      <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}>
        <Text style={styles.tribeStatusTextStyle}>Publicly visible</Text>
        <Divider orthogonal height={12} borderColor='gray' />
        {this.renderMemberStatus()}
      </View>
    );
  }

  renderMemberStatus() {
    return (
      <Text style={{ ...styles.tribeStatusTextStyle, ...styles.memberStatusTextStyle }}>
        Member
      </Text>
    );
  }

  // Render tribe size and created date
  renderTribeInfo() {
    const date = 'Jan 2017';
    const count = '102';
    return (
      <View style={styles.tribeInfoContainerStyle}>
        <Text style={styles.tribeSizeTextStyle}>
          <Text style={styles.tribeCountTextStyle}>{count} </Text>
            members
        </Text>
        <Icon name='dot-single' type='entypo' color="#616161" size={16} />
        <Text style={{ ...styles.tribeSizeTextStyle }}>
          Created {date}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SearchBarHeader setting backButton />
        <View style={{ height: 70, backgroundColor: '#1998c9' }} />
        <View style={styles.imageWrapperStyle}>
          {this.renderEventImage()}
        </View>
        <View style={styles.generalInfoContainerStyle}>
          <Text
            style={{ fontSize: 22, fontWeight: '300' }}
          >
            SoHo Artists
          </Text>
          {this.renderVisibilityAndStatus()}
          <View
            style={{
              width: width * 0.75,
              borderColor: '#dcdcdc',
              borderWidth: 0.5
            }}
          />
          {this.renderTribeInfo()}
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
  imageContainerStyle: {
    borderWidth: 1,
    borderColor: '#646464',
    alignItems: 'center',
    borderRadius: 14,
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: 'white'
  },
  imageStyle: {
    width: (width * 1.1) / 3,
    height: (width * 0.95) / 3,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'white'
  },
  imageWrapperStyle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    height: 80,
    backgroundColor: 'white'
  },
  // This is the style for general info container
  generalInfoContainerStyle: {
    backgroundColor: 'white',
    alignItems: 'center'
  },

  // Style for subinfo
  tribeStatusTextStyle: {
    fontSize: 11,
    marginLeft: 4,
    marginRight: 4
  },
  memberStatusTextStyle: {

  },

  // Style for tribe info
  tribeInfoContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5
  },
  tribeSizeTextStyle: {
    fontSize: 11
  },
  tribeCountTextStyle: {
    fontWeight: '600'
  }

};

const mapStateToProps = state => {
  const { navigationState } = state.tribe;

  return {
    navigationState
  };
};

export default connect(
  mapStateToProps,
  {
    tribeSelectTab
  }
)(Tribe);
