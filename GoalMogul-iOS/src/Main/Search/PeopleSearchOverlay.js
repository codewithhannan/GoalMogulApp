/**
 * This is a search overlay for user.
 * Currently, it's used in Invite friends for Tribe and Events
 */
import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import { SearchBar, Icon } from 'react-native-elements';
import { MenuProvider } from 'react-native-popup-menu';
import _ from 'lodash';

// Component
import BaseOverlay from './BaseOverlay';
import PeopleSearch from './People/PeopleSearch';

import {
  handleSearch,
  clearSearchState,
} from '../../redux/modules/search/SearchActions';

import {
  inviteUserToTribe
} from '../../redux/modules/tribe/TribeActions';

import {
  inviteParticipantToEvent
} from '../../redux/modules/event/EventActions';

import { openProfile } from '../../actions';

 const DEBUG_KEY = '[ People Search ]';
 const SEARCH_TYPE = 'people';

 class PeopleSearchOverlay extends Component {
    handleOnResSelect = (_id) => {
      const { searchFor, callback } = this.props;
      if (!searchFor) return this.props.openProfile(_id);
      const {
        type, // event or tribe
        id // eventId or TribeId
      } = searchFor;
      if (type === 'tribe' || type === 'myTribe') {
        // _id is invitee id
        return this.props.inviteUserToTribe(id, _id, callback);
      }
      if (type === 'event' || type === 'myEvent') {
        return this.props.inviteParticipantToEvent(id, _id, callback);
      }
    }

   // Search bar functions
   handleCancel = () => {
     //TODO: potentially clear search state
     console.log(`${DEBUG_KEY} handle cancel`);
     this.props.clearSearchState();
     // Actions.pop();
     this.refs.baseOverlay.closeModal();
   }

  handleChangeText = (value) => {
    if (value === undefined) {
      return;
    }
     if (value === '') {
      return this.props.clearSearchState(SEARCH_TYPE);
    }
    console.log('debouced serach is: ', this.props.debouncedSearch);
    this.props.debouncedSearch(value.trim(), SEARCH_TYPE);
  }

   render() {
      const searchPlaceHolder = this.props.searchPlaceHolder
        ? this.props.searchPlaceHolder
        : 'Search a person';

     return (
       <BaseOverlay verticalPercent={1} horizontalPercent={1} ref='baseOverlay'>
         <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
           <View style={styles.headerContainerStyle}>
             <SearchBar
               platform='ios'
               round
               autoFocus
               inputStyle={styles.searchInputStyle}
               inputContainerStyle={styles.searchInputContainerStyle}
               containerStyle={styles.searchContainerStyle}
               placeholder={searchPlaceHolder}
               cancelButtonTitle='Cancel'
               onCancel={this.handleCancel}
               onChangeText={this.handleChangeText}
               clearIcon={null}
               cancelButtonProps={{ color: '#17B3EC' }}
               showLoading={this.props.loading}
             />
           </View>
           <PeopleSearch reducerPath='' onSelect={this.handleOnResSelect} {...this.props} />
         </MenuProvider>
       </BaseOverlay>
     );
   }
 }

 const styles = {
   searchContainerStyle: {
     padding: 0,
     marginRight: 3,
     backgroundColor: '#ffffff',
     borderTopColor: '#ffffff',
     borderBottomColor: '#ffffff',
     alignItems: 'center',

   },
   searchInputContainerStyle: {
     backgroundColor: '#f3f4f6',
     alignItems: 'center',
     justifyContent: 'center',
   },
   searchInputStyle: {
     fontSize: 15,
   },
   headerContainerStyle: {
     marginTop: 15,
     justifyContent: 'center',
     alignItems: 'center'
   },
   backdrop: {
     backgroundColor: 'gray',
     opacity: 0.7,
   }
 };

 const mapStateToProps = state => {
   const { selectedTab, navigationState } = state.search;
   const { loading } = state.search.people;

   return {
     selectedTab,
     navigationState,
     loading
   };
 };

 const mapDispatchToProps = (dispatch) => {
   const debouncedSearch = _.debounce((value, type) => dispatch(handleSearch(value, type)), 400);

   return ({
     debouncedSearch,
     clearSearchState: clearSearchState(dispatch),
     inviteParticipantToEvent: (eventId, inviteeId, callback) =>
      dispatch(inviteParticipantToEvent(eventId, inviteeId, callback)),
     openProfile: (userId) =>
      dispatch(openProfile(userId)),
     inviteUserToTribe: (tribeId, inviteeId) =>
      dispatch(inviteUserToTribe(tribeId, inviteeId))
   });
 };

export default connect(
  mapStateToProps,
  mapDispatchToProps
  // {
  //   ...mapDispatchToProps,
  //   inviteUserToTribe,
  //   openProfile,
  //   inviteParticipantToEvent
  // }
)(PeopleSearchOverlay);
