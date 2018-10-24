// This is the original implementation of Tribe before structural change.
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
import MemberList from './MemberList';

// Asset
import check from '../../asset/utils/check.png';

import TestEventImage from '../../asset/TestEventImage.png';
import {
  tribeSelectTab,
  tribeDetailClose
} from '../../redux/modules/tribe/TribeActions';

const { width } = Dimensions.get('window');
/**
 * This is the UI file for a single event.
 */
class Tribe2 extends Component {

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
    members: MemberList,
  });

  renderEventImage() {
    return (
      <View style={styles.imageContainerStyle}>
        <Image source={TestEventImage} style={styles.imageStyle} />
      </View>
    );
  }

  // Render tribe visibility and user membership status
  renderVisibilityAndStatus(item) {
    const tribeVisibility = item.isPubliclyVisibl
      ? 'Publicly Visible'
      : 'Private Tribe';

    return (
      <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}>
        <Text style={styles.tribeStatusTextStyle}>{tribeVisibility}</Text>
        <Divider orthogonal height={12} borderColor='gray' />
        {this.renderMemberStatus(item)}
      </View>
    );
  }

  renderMemberStatus(item) {
    // TODO: remove test var
    const isUserMemeber = isMember(item.members, this.props.user);
    const tintColor = isUserMemeber ? '#2dca4a' : 'gray';

    if (isUserMemeber) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
          <Image
            source={check}
            style={{
              height: 10,
              width: 13,
              tintColor
            }}
          />
          <Text
            style={{
              ...styles.tribeStatusTextStyle,
              ...styles.memberStatusTextStyle,
              color: tintColor
            }}
          >
            Member
          </Text>
        </View>
      );
    }
    // Return view to request to join
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
        <Text
          style={{
            ...styles.tribeStatusTextStyle,
            ...styles.memberStatusTextStyle,
            color: tintColor
          }}
        >
          Request to Join
        </Text>
      </View>
    );
  }

  // Render tribe size and created date
  renderTribeInfo(item) {
    const date = 'Jan 2017';
    const count = item.memberCount ? item.memberCount : '102';
    return (
      <View style={styles.tribeInfoContainerStyle}>
        <Text style={{ ...styles.tribeSizeTextStyle, color: '#4ec9f3' }}>
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
    const { item } = this.props;
    if (!item) return <View />;

    const { name } = item;

    return (
      <View style={{ flex: 1 }}>
        <SearchBarHeader setting backButton onBackPress={() => this.props.tribeDetailClose()} />
        <View style={{ height: 70, backgroundColor: '#1998c9' }} />
        <View style={styles.imageWrapperStyle}>
          {this.renderEventImage()}
        </View>
        <View style={styles.generalInfoContainerStyle}>
          <Text
            style={{ fontSize: 22, fontWeight: '300' }}
          >
            {name}
          </Text>
          {this.renderVisibilityAndStatus(item)}
          <View
            style={{
              width: width * 0.75,
              borderColor: '#dcdcdc',
              borderWidth: 0.5
            }}
          />
          {this.renderTribeInfo(item)}
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
    marginBottom: 5,
    height: 30
  },
  tribeSizeTextStyle: {
    fontSize: 11
  },
  tribeCountTextStyle: {
    fontWeight: '600'
  }
};

const mapStateToProps = state => {
  const { navigationState, item } = state.tribe;

  return {
    navigationState,
    item,
    user: state.user
  };
};

const isMember = (memberList, self) =>
  memberList.reduce((total, curr) => {
    if (curr._id && self._id && (curr._id.toString() === self._id.toString())) {
      return 1;
    }
    return 0;
  }, 0);


export default connect(
  mapStateToProps,
  {
    tribeSelectTab,
    tribeDetailClose
  }
)(Tribe2);