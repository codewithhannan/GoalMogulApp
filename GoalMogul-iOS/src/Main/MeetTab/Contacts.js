import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';

// Components
import MeetFilterBar from './MeetFilterBar';

// actions
import {
  handleRefresh
} from '../../actions';

// tab key
const key = 'contacts';

/* TODO: delete the test data */
const testData = [
  {
    name: 'Jia Zeng'
  }
];

class Contacts extends Component {

  _keyExtractor = (item) => item.id

  handleRefresh = () => {
    console.log('Refreshing tab: ', key);
    this.props.handleRefresh(key);
  }

  renderItem = item => {
    // TODO: render item
  }

  handleSyncContact = () => {
    // TODO: redirect to contact sync page
  }

  renderSyncContact() {
    console.log('data for contact is: ', this.props.data);
    if (this.props.data === undefined || this.props.data.length === 0) {
      return (
        <View style={styles.labelContainerStyle}>
          <Text style={styles.labelTextStyle}>
            Find friends on GoalMogul.
          </Text>
          <TouchableOpacity onPress={this.handleSyncContact}>
            <Text style={styles.buttonTextStyle}>
              Sync your contacts
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>

        <View style={{ flex: 1 }}>
          {this.renderSyncContact()}
          <FlatList
            data={this.props.data}
            renderItem={this.renderItem}
            keyExtractor={this._keyExtractor}
            onRefresh={this.handleRefresh.bind()}
            refreshing={this.props.refreshing}
          />
        </View>
        {/*
          onEndReached={this.onLoadMore}
        */}
      </View>
    );
  }
}

const styles = {
  // Extract label color out
  labelContainerStyle: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    justifyContent: 'center'
  },
  labelTextStyle: {
    fontWeight: '600',
    color: '#969696',
    fontSize: 11
  },
  buttonTextStyle: {
    marginLeft: 5,
    color: '#45C9F6',
    fontSize: 11
  }
};

const mapStateToProps = state => {
  const { contacts } = state.meet;
  const { data, refreshing } = contacts;

  return {
    contacts,
    data,
    refreshing
  };
};

export default connect(
  mapStateToProps,
  {
    handleRefresh
  }
)(Contacts);
