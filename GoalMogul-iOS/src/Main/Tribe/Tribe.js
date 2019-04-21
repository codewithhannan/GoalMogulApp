import React, { Component } from 'react';
import {
  Animated,
  ActivityIndicator,
  View,
  Image,
  Dimensions,
  Text,
  FlatList,
  TouchableOpacity
 } from 'react-native';
import { connect } from 'react-redux';
import R from 'ramda';
import { MenuProvider } from 'react-native-popup-menu';
import { Actions } from 'react-native-router-flux';
import Fuse from 'fuse.js';

// Components
import SearchBarHeader from '../Common/Header/SearchBarHeader';
import TabButtonGroup from '../Common/TabButtonGroup';
import Divider from '../Common/Divider';
import About from './About';
import MemberListCard from './MemberListCard';
import MemberFilterBar from './MemberFilterBar';
import { MenuFactory } from '../Common/MenuFactory';
import EmptyResult from '../Common/Text/EmptyResult';
import {
  DotIcon
} from '../../Utils/Icons';

import ProfilePostCard from '../Post/PostProfileCard/ProfilePostCard';
import { actionSheet, switchByButtonIndex } from '../Common/ActionSheetFactory';

// Asset
import check from '../../asset/utils/check.png';
import plus from '../../asset/utils/plus.png';
import post from '../../asset/utils/post.png';
import envelope from '../../asset/utils/envelope.png';

import TestEventImage from '../../asset/TestEventImage.png';

// Actions
import {
  tribeSelectTab,
  tribeDetailClose,
  requestJoinTribe,
  openTribeInvitModal,
  deleteTribe,
  editTribe,
  reportTribe,
  leaveTribe,
  acceptTribeInvit,
  declineTribeInvit,
  tribeSelectMembersFilter,
  tribeReset
} from '../../redux/modules/tribe/TribeActions';

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
  memberSelector,
  getTribeNavigationState,
  getTribeMemberNavigationState
} from '../../redux/modules/tribe/TribeSelector';

// Utils
import { switchCase } from '../../redux/middleware/utils';

// Styles
import { APP_DEEP_BLUE } from '../../styles';

// Constants
import {
  CARET_OPTION_NOTIFICATION_SUBSCRIBE,
  CARET_OPTION_NOTIFICATION_UNSUBSCRIBE
} from '../../Utils/Constants';

const DEBUG_KEY = '[ UI Tribe ]';
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const { width } = Dimensions.get('window');
const CANCEL_REQUEST_INDEX = 1;
const CANCEL_REQUEST_OPTIONS = ['Cancel the request', 'Cancel'];
const REQUEST_OPTIONS = ['Request to join', 'Cancel'];
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

const INFO_CARD_HEIGHT = (width * 0.95) / 3 + 30 + 106.5;
/**
 * This is the UI file for a single event.
 */
class Tribe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageLoading: false,
      showPlus: true,
      infoCardHeight: new Animated.Value(INFO_CARD_HEIGHT),
      infoCardOpacity: new Animated.Value(1)
    };
    this._handleIndexChange = this._handleIndexChange.bind(this);
  }

  componentWillUnmount() {
    this.props.tribeReset();
  }

  /**
   * On plus clicked, show two icons. Post and Invite
   * const { textStyle, iconStyle, iconSource, text, onPress } = button;
   */
  handlePlus = (item) => {
    const { _id } = item;

    // Post creation tag search
    const members = item.members
      .filter(m => m.category === 'Admin' || m.category === 'Member')
      .map(m => m.memberRef);
    const fuse = new Fuse(members, TAG_SEARCH_OPTIONS);
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
          Actions.createPostModal({ tagSearch });
        }
      },
      // button info for invite
      {
        iconSource: post,
        text: 'Invite',
        iconStyle: { height: 18, width: 18, marginLeft: 3 },
        textStyle: { marginLeft: 5 },
        onPress: () => {
          console.log('User trying to invite an user');
          this.setState({
            ...this.state,
            showPlus: true
          });
          this.props.openTribeInvitModal(_id);
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
    Actions.push('createButtonOverlay', { 
      buttons, 
      callback, 
      pageId: this.props.pageId,
      onCancel: () => {
        this.setState({
          ...this.state,
          showPlus: true
        });
      }
    });
  }

  handleTribeOptionsOnSelect = (value) => {
    const { item } = this.props;
    if (!item) return;

    const { _id } = item;
    if (value === 'Delete') {
      return this.props.deleteTribe(_id);
    }
    if (value === 'Edit') {
      return this.props.editTribe(item);
    }
  }

  handleInvite = (_id) => {
    return this.props.openTribeInvitModal(_id);
  }

  handleStatusChange = (isMember, item) => {
    let options;
    const { _id } = item; // tribeId
    if (isMember === 'Member') {
      options = switchByButtonIndex([
        [R.equals(0), () => {
          console.log(`${DEBUG_KEY} User chooses to remove request`);
          this.props.leaveTribe(_id, 'tribe');
        }]
      ]);
    } else if (isMember === 'JoinRequester') {
      options = switchByButtonIndex([
        [R.equals(0), () => {
          console.log(`${DEBUG_KEY} User chooses to remove request`);
          this.props.requestJoinTribe(_id, false);
        }]
      ]);
    } else if (isMember === 'Invitee') {
      options = switchByButtonIndex([
        [R.equals(0), () => {
          console.log(`${DEBUG_KEY} User chooses to accept`);
          this.props.acceptTribeInvit(_id, 'tribe');
        }],
        [R.equals(1), () => {
          console.log(`${DEBUG_KEY} User chooses to decline`);
          this.props.declineTribeInvit(_id, 'tribe');
        }],
      ]);
    } else {
      options = switchByButtonIndex([
        [R.equals(0), () => {
          console.log(`${DEBUG_KEY} User chooses to `);
        }]
      ]);
    }

    const requestOptions = switchCasesMemberStatusChangeText(isMember);
    const cancelIndex = switchCasesCancelIndex(isMember);
    const statusActionSheet = actionSheet(
      requestOptions,
      cancelIndex,
      options
    );
    statusActionSheet();
  }

  /**
   * Handle modal setting on click. Show IOS menu with options
   */
  handlePageSetting = (item) => {
    const { _id, members } = item;
    const { userId } = this.props;
    const isAdmin = checkIsAdmin(members, userId);

    let options;
    if (isAdmin) {
      options = switchByButtonIndex([
        [R.equals(0), () => {
          console.log(`${DEBUG_KEY} User chooses to delete current tribe`);
          this.props.deleteTribe(_id);
        }],
        [R.equals(1), () => {
          console.log(`${DEBUG_KEY} User chooses to edit current tribe`);
          this.props.editTribe(item);
        }],
      ]);
    } else {
      options = switchByButtonIndex([
        [R.equals(0), () => {
          console.log(`${DEBUG_KEY} User chooses to remove request`);
          this.props.reportTribe(_id);
        }]
      ]);
    }

    const requestOptions = isAdmin ? ['Delete', 'Edit', 'Cancel'] : ['Report', 'Cancel'];
    const cancelIndex = isAdmin ? 2 : 1;

    const tribeActionSheet = actionSheet(
      requestOptions,
      cancelIndex,
      options
    );
    tribeActionSheet();
  }

  handleRequestOnPress = () => {
    const { item, hasRequested } = this.props;
    if (!item) return;
    const { _id } = item;

    let options;
    if (hasRequested) {
      options = switchByButtonIndex([
        [R.equals(0), () => {
          console.log(`${DEBUG_KEY} User chooses to remove request`);
          this.props.requestJoinTribe(_id, false);
        }]
      ]);
    } else {
      options = switchByButtonIndex([
        [R.equals(0), () => {
          console.log(`${DEBUG_KEY} User chooses to join the tribe`);
          this.props.requestJoinTribe(_id, true);
        }]
      ]);
    }

    const requestOptions = hasRequested ? CANCEL_REQUEST_OPTIONS : REQUEST_OPTIONS;

    const rsvpActionSheet = actionSheet(
      requestOptions,
      CANCEL_REQUEST_INDEX,
      options
    );
    rsvpActionSheet();
  }

  // Tab related functions
  _handleIndexChange = (index) => {
    const { navigationState } = this.props;
    const { routes } = navigationState;

    this.props.tribeSelectTab(index);

    if (routes[index].key !== 'about') {
      // Animated to hide the infoCard if not on about tab
      Animated.parallel([
        Animated.timing(this.state.infoCardHeight, {
          duration: 200,
          toValue: 0,
        }),
        Animated.timing(this.state.infoCardOpacity, {
          duration: 200,
          toValue: 0,
        }),
      ]).start();
    } else {
      // Animated to open the infoCard if on about tab
      Animated.parallel([
        Animated.timing(this.state.infoCardHeight, {
          duration: 200,
          toValue: INFO_CARD_HEIGHT,
        }),
        Animated.timing(this.state.infoCardOpacity, {
          duration: 200,
          toValue: 1,
        }),
      ]).start();
    }
  };

  _renderHeader = props => {
    return (
      <TabButtonGroup buttons={props} />
    );
  };

  /**
   * Caret to show options for a tribe.
   * If owner, options are delete and edit.
   * Otherwise, option is report
   */
  renderCaret(item) {
    // If item belongs to self, then caret displays delete
    const { creator, _id, maybeIsSubscribed } = item;

    const isSelf = creator._id === this.props.userId;
    // const isSelf = false;
    const menu = (!isSelf)
      ? MenuFactory(
          [
            'Report',
            maybeIsSubscribed ? CARET_OPTION_NOTIFICATION_UNSUBSCRIBE : CARET_OPTION_NOTIFICATION_SUBSCRIBE
          ],
          (val) => {  
            if (val === 'Report') {
              return this.props.reportTribe(_id);
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
          () => console.log('User clicks on options for tribe')
        )
      : MenuFactory(
          [
            'Delete',
            'Edit'
          ],
          this.handleTribeOptionsOnSelect,
          '',
          { ...styles.caretContainer },
          () => console.log('User clicks on options for self tribe.')
        );
    return (
      <View style={{ position: 'absolute', top: 3, right: 3 }}>
        {menu}
      </View>
    );
  }

  renderTribeImage(picture) {
    let imageUrl;
    let eventImage = (<Image source={TestEventImage} style={styles.imageStyle} />);
    if (picture) {
      imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${picture}`;
      eventImage = (
        <Image
          onLoadStart={() => this.setState({ imageLoading: true })}
          onLoadEnd={() => this.setState({ imageLoading: false })}
          style={styles.imageStyle}
          source={{ uri: imageUrl }}
        />
      );
    }

    return (
      <View style={styles.imageContainerStyle}>
        {eventImage}
      </View>
    );
  }

  // Render tribe visibility and user membership status
  renderVisibilityAndStatus(item) {
    const tribeVisibility = item.isPubliclyVisible
      ? 'Publicly Visible'
      : 'Private Tribe';

    return (
      <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 8, alignItems: 'center' }}>
        <Text style={styles.tribeStatusTextStyle}>{tribeVisibility}</Text>
        <Divider orthogonal height={12} borderColor='gray' />
        {this.renderMemberStatus(item)}
      </View>
    );
  }

  renderMemberStatus(item) {
    // TODO: remove test var
    const { isMember, hasRequested } = this.props;
    const tintColor = isMember ? '#2dca4a' : 'gray';

    if (isMember) {
      const { text, iconSource, iconStyle } = switchCaseMemberStatus(isMember);
      return (
        <TouchableOpacity
          activeOpacity={0.6}
          style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8, height: 23 }}
          onPress={() => this.handleStatusChange(isMember, item)}
        >
          <Image
            source={iconSource}
            style={iconStyle}
          />
          <Text
            style={{
              ...styles.tribeStatusTextStyle,
              ...styles.memberStatusTextStyle,
              color: tintColor
            }}
          >
            {text}
          </Text>
        </TouchableOpacity>
      );
    }
    // Return view to request to join
    const requestText = hasRequested ? 'Cancel Request' : 'Request to Join';

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.memberStatusContainerStyle}
        onPress={this.handleRequestOnPress}
      >
        <Text
          style={{
            ...styles.tribeStatusTextStyle,
            ...styles.memberStatusTextStyle,
            color: tintColor
          }}
        >
          {requestText}
        </Text>
      </TouchableOpacity>
    );
  }

  // Render tribe size and created date
  renderTribeInfo(item) {
    const newDate = item.created ? new Date(item.created) : new Date();
    const date = `${months[newDate.getMonth() - 1]} ${newDate.getDate()}, ${newDate.getFullYear()}`;
    const count = item.memberCount ? item.memberCount : '102';
    return (
      <View style={styles.tribeInfoContainerStyle}>
        <Text style={{ ...styles.tribeSizeTextStyle, color: '#4ec9f3' }}>
          <Text style={styles.tribeCountTextStyle}>{count} </Text>
            members
        </Text>
        <DotIcon 
          iconStyle={{ tintColor: '#616161', width: 4, height: 4, marginLeft: 4, marginRight: 4 }}
        />
        {/* <Icon name='dot-single' type='entypo' color="#616161" size={16} /> */}
        <Text style={{ ...styles.tribeSizeTextStyle }}>
          Created {date}
        </Text>
      </View>
    );
  }

  renderMemberTabs() {
    const { memberNavigationState } = this.props;
    const { routes } = memberNavigationState;

    const buttonStyle = {
      selected: {
        backgroundColor: 'white', // container background style
        tintColor: '#696969', // icon tintColor
        color: '#696969', // text color
        fontWeight: '800', // text fontWeight
        statColor: 'white' // stat icon color
      },
      unselected: {
        backgroundColor: 'white',
        tintColor: '#696969',
        color: '#b2b2b2',
        fontWeight: '600',
        statColor: '#696969'
      }
    };

    const props = {
      jumpToIndex: (i) => this.props.tribeSelectMembersFilter(routes[i].key, i),
      navigationState: this.props.memberNavigationState
    };
    return (
      <TabButtonGroup buttons={props} subTab buttonStyle={buttonStyle} noVerticalDivider noBorder />
    );
  }

  renderTribeOverview(item, data) {
    const { name, _id, picture } = item;

    // Following method is replaced by renderMemberTabs
    // const filterBar = this.props.tab === 'members'
    //   ? <MemberFilterBar />
    //   : null;

    const filterBar = this.props.tab === 'members'
      ? this.renderMemberTabs()
      : null;

    const emptyState = this.props.tab === 'posts' && data.length === 0
      ? <EmptyResult text={'No Posts'} textStyle={{ paddingTop: 100 }} />
      : null;
    // Currently it's not in sync with MyTribe
    const inviteButton = this.props.tab === 'members'
      ? (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => this.handleInvite(_id)}
          style={styles.inviteButtonContainerStyle}
        >
          <Text>Invite</Text>
        </TouchableOpacity>
      )
      : null;

    return (
      <View>
        <Animated.View 
          style={{
            height: this.state.infoCardHeight,
            opacity: this.state.infoCardOpacity
          }}
        >
          <View style={styles.imagePaddingContainerStyle} />
          <View style={styles.imageWrapperStyle}>
            {this.renderTribeImage(picture)}
          </View>
          <View style={styles.generalInfoContainerStyle}>
            {/* {this.renderCaret(item)} */}
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
        </Animated.View>
        {
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

      case 'members': {
        return <MemberListCard item={props.item.memberRef} key={props.index} />;
      }

      default:
        return <View key={props.index} />;
    }
  }

  renderPlus(item) {
    const { isMember } = this.props;
    if (this.state.showPlus && (isMember === 'Admin' || isMember === 'Member')) {
      return (
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.iconContainerStyle}
          onPress={() => this.handlePlus(item)}
        >
          <Image style={styles.iconStyle} source={plus} />
        </TouchableOpacity>
      );
    }
    return null;
  }

  // render padding has been changed to render loading indicator
  renderPadding() {
    const { navigationState, feedLoading } = this.props;
    const { routes, index } = navigationState;
    
    if (feedLoading && routes[index].key === 'posts') {
      return (
        <View
          style={{
            paddingVertical: 12
          }}
        >
          <ActivityIndicator size='large' />
        </View>
      );
      // Original padding was added for scroll up animation
      // return (
      //   <View style={{ height: PADDING }}>
      //     <View
      //       style={{
      //         paddingVertical: 12
      //       }}
      //     >
      //       <ActivityIndicator size='large' />
      //     </View>
      //   </View>
      // );
    }
    // Original padding was added for scroll up animation
    // return (
    //   <View style={{ height: PADDING }} />
    // );
    return null
  }

  render() {
    const { item, data } = this.props;
    if (!item) return <View />;

    return (
      <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
        <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
          <SearchBarHeader
            backButton
            onBackPress={() => this.props.tribeDetailClose()}
            pageSetting
            handlePageSetting={() => this.handlePageSetting(item)}
          />
          <FlatList
            data={data}
            renderItem={this.renderItem}
            keyExtractor={(i) => i._id}
            ListHeaderComponent={this.renderTribeOverview(item, data)}
            ListFooterComponent={this.renderPadding()}
          />
          {this.renderPlus(item)}
        </View>
      </MenuProvider>
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
  // Style for the empty view for image top
  imagePaddingContainerStyle: {
    height: ((width * 0.95) / 3 + 30 - 10) / 2,
    backgroundColor: '#1998c9'
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
    height: ((width * 0.95) / 3 + 30 + 10) / 2,
    // height: 80,
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
  memberStatusContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    width: 100,
    height: 23,
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#efefef',
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
    height: 50,
    width: 50,
    borderRadius: 25,
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

const mapStateToProps = state => {
  const { item, feed, hasRequested, feedLoading, tribeLoading } = state.tribe;
  const { userId } = state.user;

  const navigationState = getTribeNavigationState(state);
  const memberNavigationState = getTribeMemberNavigationState(state);
  const { routes, index } = navigationState;

  const data = ((key) => {
    switch (key) {
      case 'about':
        return [item];

      case 'members':
        return memberSelector(state);

      case 'posts':
        return feed;

      default: return [];
    }
  })(routes[index].key);

  return {
    navigationState,
    item,
    user: state.user,
    data,
    isMember: getUserStatus(state),
    hasRequested,
    tab: routes[index].key,
    userId,
    memberNavigationState,
    loading: tribeLoading,
    feedLoading
  };
};

const checkIsAdmin = (members, userId) => {
  let isAdmin = false;
  // Sanity check if member is not empty or undefined
  if (members && members.length > 0) {
    members.forEach((member) => {
      if (member.memberRef._id === userId && member.category === 'Admin') {
        isAdmin = true;
      }
    });
  }

  return isAdmin;
};

const switchCaseMemberStatus = (status) => switchCase({
  Admin: {
    text: 'Admin',
    iconSource: check,
    iconStyle: {
      height: 10,
      width: 13,
      tintColor: '#2dca4a'
    }
  },
  Member: {
    text: 'Member',
    iconSource: check,
    iconStyle: {
      height: 10,
      width: 13,
      tintColor: '#2dca4a'
    }
  },
  JoinRequester: {
    text: 'Requested',
    iconSource: envelope,
    iconStyle: {
      height: 12,
      width: 15
    }
  },
  Invitee: {
    text: 'Respond to Invitation',
    iconSource: envelope,
    iconStyle: {
      height: 12,
      width: 15
    }
  }
})({ text: 'Unknown', iconSource: check })(status);

const switchCasesMemberStatusChangeText = (status) => switchCase({
  Admin: ['Cancel'],
  Member: ['Leave tribe', 'Cancel'],
  JoinRequester: ['Cancel Request', 'Cancel'],
  Invitee: ['Accept', 'Decline', 'Cancel']
})('Member')(status);

const switchCasesCancelIndex = (status) => switchCase({
  Admin: 0,
  Member: 1,
  JoinRequester: 1,
  Invitee: 2
})(0)(status);

export default connect(
  mapStateToProps,
  {
    tribeSelectTab,
    tribeDetailClose,
    requestJoinTribe,
    openTribeInvitModal,
    deleteTribe,
    editTribe,
    reportTribe,
    leaveTribe,
    acceptTribeInvit,
    declineTribeInvit,
    openPostDetail,
    tribeSelectMembersFilter,
    subscribeEntityNotification,
    unsubscribeEntityNotification,
    tribeReset
  }
)(Tribe);
