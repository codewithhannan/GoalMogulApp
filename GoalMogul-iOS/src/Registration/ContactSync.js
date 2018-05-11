import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableWithoutFeedback, FlatList } from 'react-native';
import { connect } from 'react-redux';

/* Components */
import Header from './Common/Header';
import Button from './Common/Button';
import Divider from './Common/Divider';
import ContactCard from './ContactCard';
import ContactDetail from './ContactDetail';

/* Styles */
import Styles from './Styles';

/* Actions */
import { registrationContactSyncDone } from '../actions';

const testData = [
  {
    name: 'Jia Zeng',
    headline: 'Students at Duke University',
    request: false
  },
  {
    name: 'Peter Kushner',
    headline: 'CEO at start industries',
    request: false
  }
];

class ContactSync extends Component {

  onLoadMore = () => {
    
  }

  handleDoneOnPressed() {
    this.props.registrationContactSyncDone();
  }

  _keyExtractor = (item, index) => index;

  renderItem(item) {
    return (
      <ContactCard>
        <ContactDetail item={item} />
      </ContactCard>
    );
  }

  // TODO: replace data with this.props.data
  render() {
    return (
      <View style={Styles.containerStyle}>
        <Header contact type='contact' />
        <View style={Styles.bodyContainerStyle}>

          <FlatList
            enableEmptySections
            data={testData}
            renderItem={(item) => this.renderItem(item)}
            numColumns={1}
            keyExtractor={this._keyExtractor}
            refreshing={this.props.refreshing}
            onEndReached={this.onLoadMore}
            onEndThreshold={0}
          />

          {/*
            <ScrollView>
              <ContactCard>
                <ContactDetail />
              </ContactCard>
            </ScrollView>

          */}

          <TouchableWithoutFeedback onPress={this.handleDoneOnPressed.bind(this)}>
            <View style={styles.footer}>
              <Button text='Done' />
            </View>
          </TouchableWithoutFeedback>
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
  const { matchedContacts } = state.registration;
  const { limit, skip, refreshing, data } = matchedContacts;

  return {
    limit, skip, refreshing, data
  };
};

export default connect(mapStateToProps, { registrationContactSyncDone })(ContactSync);
