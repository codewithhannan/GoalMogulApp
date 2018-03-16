import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';

/* Components */
import Header from './Common/Header';
import Button from './Common/Button';
import Divider from './Common/Divider';
import ContactCard from './ContactCard';
import ContactDetail from './ContactDetail';

/* Styles */
import Styles from './Styles';

class ContactSync extends Component {

  constructor(props) {
    super(props);
    this.state = {
      age: 0
    };
  }

  render() {
    return (
      <View style={Styles.containerStyle}>
        <Header contact type='contact' />
        <View style={Styles.bodyContainerStyle}>
          <ScrollView>
            <ContactCard>
              <ContactDetail />
            </ContactCard>
          </ScrollView>
          <View style={styles.footer}>
            <Button text='Done' />
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  footer: {

  }
};

export default ContactSync;
