import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

/* Components */
import Header from './Common/Header';
import Button from './Common/Button';
import ContactCard from './ContactCard';
import ContactDetail from './ContactDetail';
import ModalHeader from '../Main/Common/Header/ModalHeader';
import EmptyResult from '../Main/Common/Text/EmptyResult';

/* Styles */
import Styles from './Styles';

/* Actions */
import {
  registrationContactSyncDone,
  contactSyncRefresh,
  contactSyncLoadMore,
  meetContactSyncLoadMore
} from '../actions';

const testData = [
  {
    name: 'Jia Zeng',
    headline: 'Students at Duke University',
    request: false,
    _id: '120937109287091'
  },
  {
    name: 'Peter Kushner',
    headline: 'CEO at start industries',
    request: false,
    _id: '019280980248303'
  }
];

class ContactSync extends Component {
  state = {
    type: 'registration'
  }

  componentWillReceiveProps(props) {
    if (props.type) {
      this.setState({ type: props.type });
    }
  }

  onLoadMore = () => {
    if (this.state.type === 'meet') {
      // return this.props.meetContactSyncLoadMore(false);
      return;
    }
    this.props.contactSyncLoadMore();
  }

  handleRefresh = () => {
    if (this.state.type === 'meet') {
      return this.props.meetContactSyncLoadMore(true);
    }
    this.props.contactSyncRefresh();
  }

  handleDoneOnPressed() {
    this.props.registrationContactSyncDone();
  }

  _keyExtractor = (item) => item._id;

  renderItem(item) {
    return (
      <ContactCard>
        <ContactDetail item={item} />
      </ContactCard>
    );
  }

  // TODO: replace data with this.props.data
  render() {
    const { type, actionCallback } = this.props;

    // Assign header
    const header = (type !== undefined && type === 'meet') ?
      (<ModalHeader
        cancelText={null}
        title='Sync contacts'
        actionText='Done'
        onAction={() => {
          Actions.popTo('goal');
          actionCallback();
        }}
      />)
      :
      <Header contact type='contact' />;

    // Assign actionable buttons
    const button = (type !== undefined && type === 'meet') ?
    '' :
    (<TouchableOpacity onPress={this.handleDoneOnPressed.bind(this)}>
      <View style={styles.footer}>
        <Button text='Done' />
      </View>
    </TouchableOpacity>);

    const data = (type !== undefined && type === 'meet') ?
      this.props.meetMatchedContacts.data : this.props.registrationMatchedContacts.data;

    const refreshing = (type !== undefined && type === 'meet') ?
      this.props.meetMatchedContacts.refreshing : this.props.registrationMatchedContacts.refreshing;

    return (
      <View style={Styles.containerStyle}>
        {header}
        <View style={Styles.bodyContainerStyle}>

          <FlatList
            enableEmptySections
            data={data}
            renderItem={(item) => this.renderItem(item)}
            numColumns={1}
            keyExtractor={this._keyExtractor}
            refreshing={refreshing}
            onRefresh={this.handleRefresh}
            onEndReached={this.onLoadMore}
            ListEmptyComponent={
              refreshing ? '' :
              <EmptyResult text={'No contacts found'} />
            }
            onEndThreshold={0}
          />
          {button}
        </View>

      </View>
    );
  }
}

const styles = {
  footer: {

  }
};

const mapStateToProps = state => {
  const meetMatchedContacts = state.meet.matchedContacts;
  const registrationMatchedContacts = state.registration.matchedContacts;

  return {
    meetMatchedContacts,
    registrationMatchedContacts
  };
};

export default connect(
  mapStateToProps,
  {
    registrationContactSyncDone,
    contactSyncRefresh,
    contactSyncLoadMore,
    meetContactSyncLoadMore
  }
)(ContactSync);
