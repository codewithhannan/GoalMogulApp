import React, { Component } from 'react';
import {
  View,
  Image,
  Dimensions,
  Text,
  FlatList,
  TouchableOpacity
 } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { MenuProvider } from 'react-native-popup-menu';
import R from 'ramda';
import { Actions } from 'react-native-router-flux';

// Components
import SearchBarHeader from '../../Common/Header/SearchBarHeader';
import TabButtonGroup from '../../Common/TabButtonGroup';
import Divider from '../../Common/Divider';
import About from './MyTribeAbout';
import MemberListCard from '../../Tribe/MemberListCard';
import { MenuFactory } from '../../Common/MenuFactory';
import { actionSheet, switchByButtonIndex } from '../../Common/ActionSheetFactory';

import ProfilePostCard from '../../Post/PostProfileCard/ProfilePostCard';
import { switchCase } from '../../../redux/middleware/utils';

// Asset
import check from '../../../asset/utils/check.png';
import plus from '../../../asset/utils/plus.png';
import post from '../../../asset/utils/post.png';

import TestEventImage from '../../../asset/TestEventImage.png';

// Actions
import {
  tribeSelectTab,
  tribeDetailClose,
  myTribeAdminRemoveUser,
  myTribeAdminPromoteUser,
  myTribeAdminDemoteUser,
  myTribeSelectMembersFilter
} from '../../../redux/modules/tribe/MyTribeActions';
import {
  openTribeInvitModal,
  deleteTribe,
  editTribe,
  reportTribe,
  leaveTribe,
  acceptTribeInvit,
  declineTribeInvit,
} from '../../../redux/modules/tribe/TribeActions';

// Selector
import {
  getMyTribeUserStatus,
  myTribeMemberSelector,
  getMyTribeNavigationState,
  getMyTribeMemberNavigationState
} from '../../../redux/modules/tribe/TribeSelector';

const DEBUG_KEY = '[ UI MyTribe ]';
const { width } = Dimensions.get('window');
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CANCEL_REQUEST_INDEX = 1;
const CANCEL_REQUEST_OPTIONS = ['Cancel the request', 'Cancel'];
const REQUEST_OPTIONS = ['Request to join', 'Cancel'];
/**
 * This is the UI file for a single event.
 */
class MyTribe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageLoading: false,
      showPlus: true
    };
  }

  /**
   * This function is passed to MemberListCard when setting icon is clicked
   * and remove user option is chosen
   */
  handleRemoveUser = (userId) => {
    const { _id } = this.props.item;
    this.props.myTribeAdminRemoveUser(userId, _id);
  }

  /**
   * This function is passed to MemberListCard when setting icon is clicked
   * and promote user option is chosen
   */
  handlePromoteUser = (userId) => {
    const { _id } = this.props.item;
    this.props.myTribeAdminPromoteUser(userId, _id);
  }

  /**
   * This function is passed to MemberListCard when setting icon is clicked
   * and demote user option is chosen
   */
  handleDemoteUser = (userId) => {
    const { _id } = this.props.item;
    this.props.myTribeAdminDemoteUser(userId, _id);
  }

  /**
   * On plus clicked, show two icons. Post and Invite
   * const { textStyle, iconStyle, iconSource, text, onPress } = button;
   */
  handlePlus = (item) => {
    const { _id } = item;
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
          Actions.pop();
          Actions.createPostModal({ belongsToTribe: _id });
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
          Actions.pop();
          this.props.openTribeInvitModal(_id);
        }
      }
    ];
    this.setState({
      ...this.state,
      showPlus: false
    });
    Actions.push('createButtonOverlay', { buttons });
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

  // This function is deprecated and replaced by renderPlus
  handleInvite = (_id) => {
    return this.props.openTribeInvitModal(_id);
  }

  // Tab related functions
  _handleIndexChange = (index) => {
    this.props.tribeSelectTab(index);
  };

  _renderHeader = props => {
    return (
      <TabButtonGroup buttons={props} />
    );
  };

  handleStatusChange = (isMember) => {
    let options;
    if (isMember === 'Member') {
      options = switchByButtonIndex([
        [R.equals(0), () => {
          console.log(`${DEBUG_KEY} User chooses to remove request`);
          this.props.leaveTribe(_id, 'mytribe');
        }]
      ]);
    } else if (isMember === 'JoinRequester') {
      options = switchByButtonIndex([
        [R.equals(0), () => {
          console.log(`${DEBUG_KEY} User chooses to remove request`);
          this.props.requestJoinTribe(_id, false, 'mytribe');
        }]
      ]);
    } else if (isMember === 'Invitee') {
      options = switchByButtonIndex([
        [R.equals(0), () => {
          console.log(`${DEBUG_KEY} User chooses to accept`);
          this.props.acceptTribeInvit(_id, 'mytribe');
        }],
        [R.equals(1), () => {
          console.log(`${DEBUG_KEY} User chooses to decline`);
          this.props.declineTribeInvit(_id, 'mytribe');
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
    const statusActionSheet = actionSheet(
      requestOptions,
      CANCEL_REQUEST_INDEX,
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
          this.props.requestJoinTribe(_id, false, 'mytribe');
        }]
      ]);
    } else {
      options = switchByButtonIndex([
        [R.equals(0), () => {
          console.log(`${DEBUG_KEY} User chooses to join the tribe`);
          this.props.requestJoinTribe(_id, true, 'mytribe');
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

  /**
   * Caret to show options for a tribe.
   * If owner, options are delete and edit.
   * Otherwise, option is report.
   *
   * NOTE: this is currently deprecated and replaced by handlePageSetting
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
          () => this.props.reportTribe(_id),
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
    const tribeVisibility = item.isPubliclyVisibl
      ? 'Publicly Visible'
      : 'Private Tribe';

    return (
      <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10, alignItems: 'center' }}>
        <Text style={styles.tribeStatusTextStyle}>{tribeVisibility}</Text>
        <Divider orthogonal height={12} borderColor='gray' />
        {this.renderMemberStatus(item)}
      </View>
    );
  }

  renderMemberStatus() {
    // TODO: remove test var
    // const isUserMemeber = isMember(item.members, this.props.user);
    const { isMember, hasRequested } = this.props;
    const tintColor = isMember ? '#2dca4a' : 'gray';

    if (isMember) {
      const { text, icon } = switchCaseMemberStatus(isMember);
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
            {text}
          </Text>
        </View>
      );
    }
    // Return view to request to join
    const requestText = hasRequested ? 'Cancel Request' : 'Request to Join';
    return (
      <TouchableOpacity
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
        <Icon name='dot-single' type='entypo' color="#616161" size={16} />
        <Text style={{ ...styles.tribeSizeTextStyle }}>
          Created {date}
        </Text>
      </View>
    );
  }

  renderMemberTabs() {
    const { memberNavigationState } = this.props;
    const { routes } = memberNavigationState;

    const props = {
      jumpToIndex: (i) => this.props.myTribeSelectMembersFilter(routes[i].key, i),
      navigationState: this.props.memberNavigationState
    };
    return (
        <TabButtonGroup buttons={props} />
    );
  }

  renderTribeOverview(item) {
    const { name, _id, picture } = item;

    // const filterBar = this.props.tab === 'members'
    //   ? (
    //     <MemberFilterBar
    //       onSelect={(option) => this.props.myTribeSelectMembersFilter(option)}
    //     />
    //   )
    //   : '';

    const filterBar = this.props.tab === 'members'
      ? this.renderMemberTabs()
      : '';

    // Invite button is replaced by renderPlus
    const inviteButton = this.props.tab === 'members'
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
        <View style={{ height: 70, backgroundColor: '#1998c9' }} />
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
        {
          this._renderHeader({
            jumpToIndex: (i) => this._handleIndexChange(i),
            navigationState: this.props.navigationState
          })
        }
        {filterBar}
      </View>
    );
  }

  renderItem = (props) => {
    const { routes, index } = this.props.navigationState;
    const { isUserAdmin } = this.props;

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

      case 'members': {
        return (
          <MemberListCard
            item={props.item.memberRef}
            category={props.item.category}
            key={props.index}
            isAdmin={isUserAdmin}
            onRemoveUser={this.handleRemoveUser}
            onPromoteUser={this.handlePromoteUser}
            onDemoteUser={this.handleDemoteUser}
          />
        );
      }

      default:
        return <View key={props.index} />;
    }
  }

  renderPlus(item) {
    const { isMember } = this.props;
    if (this.state.showPlus && (isMember === 'Admin' || isMember === 'Member')) {
      return (
        <TouchableOpacity style={styles.iconContainerStyle} onPress={() => this.handlePlus(item)}>
          <Image style={styles.iconStyle} source={plus} />
        </TouchableOpacity>
      );
    }
    return '';
  }

  render() {
    const { item, data } = this.props;
    if (!item) return <View />;

    console.log('data is: ', data);

    return (
      <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
        <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
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
            ListHeaderComponent={this.renderTribeOverview(item)}
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
  memberStatusContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    width: 100,
    height: 25,
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
    // backgroundColor: '#45C9F6',
    backgroundColor: '#4096c6',
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
  const { item, feed, hasRequested } = state.myTribe;
  const { userId } = state.user;
  const navigationState = getMyTribeNavigationState(state);
  const memberNavigationState = getMyTribeMemberNavigationState(state);

  const { routes, index } = navigationState;
  const data = ((key) => {
    switch (key) {
      case 'about':
        return [item];

      case 'members':
        return myTribeMemberSelector(state);

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
    isMember: getMyTribeUserStatus(state),
    hasRequested,
    tab: routes[index].key,
    userId,
    isUserAdmin: checkIsAdmin(item ? item.members : [], userId),
    memberNavigationState
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

export default connect(
  mapStateToProps,
  {
    tribeSelectTab,
    tribeDetailClose,
    openTribeInvitModal,
    deleteTribe,
    editTribe,
    reportTribe,
    leaveTribe,
    acceptTribeInvit,
    declineTribeInvit,
    myTribeAdminRemoveUser,
    myTribeAdminPromoteUser,
    myTribeAdminDemoteUser,
    myTribeSelectMembersFilter
  }
)(MyTribe);

const switchCaseMemberStatus = (status) => switchCase({
  Admin: {
    text: 'Admin',
    icon: undefined
  },
  Member: {
    text: 'Member',
    icon: undefined
  },
  JoinRequester: {
    text: 'requsted',
    icon: undefined
  },
  Invitee: {
    text: 'accept',
    icon: undefined
  }
})('Member')(status);

const switchCasesMemberStatusChangeText = (status) => switchCase({
  Admin: ['Cancel'],
  Member: ['Leave tribe', 'Cancel'],
  JoinRequester: ['Cancel Request', 'Cancel'],
  Invitee: ['Accept', 'Decline', 'Cancel']
})('Member')(status);