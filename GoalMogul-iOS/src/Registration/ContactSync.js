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

  constructor(props) {
    super(props);
    this.state = {
      age: 0
    };
  }

  handleDoneOnPressed() {
    this.props.registrationContactSyncDone();
  }

  _keyExtractor = (item, index) => index;

  renderItem(item) {
    // TODO: render item
    return (
      <ContactCard>
        <ContactDetail item={item} />
      </ContactCard>
    );
  }

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
  const { contacts } = state.registration;

  return {
    contacts
  };
};

export default connect(mapStateToProps, { registrationContactSyncDone })(ContactSync);
