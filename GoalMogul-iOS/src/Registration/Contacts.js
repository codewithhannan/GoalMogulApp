import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';

/* Components */
import Header from './Common/Header';
import Button from './Common/Button';
import Divider from './Common/Divider';

/* Styles */
import Styles from './Styles';

/* Actions */
import { registrationNextContactSync } from '../actions';

class Contacts extends Component {

  handleNextOnPressed() {
    this.props.registrationNextContactSync();
  }

  render() {
    return (
      <View style={Styles.containerStyle}>
        <Header name='John Doe' />
        <View style={Styles.bodyContainerStyle}>
          <Text style={Styles.titleTextStyle}>Find your friends</Text>
          <View style={{ alignSelf: 'center' }}>
            <Divider
              horizontal
              width={250}
              borderBottomWidth={2}
              color='#f4f4f4'
            />
          </View>

          <View style={{ marginTop: 15 }} />

          <Text style={Styles.contactSyncPromptingText}>
            Syncing your contacts can help
          </Text>

          <Text style={Styles.contactSyncPromptingText}>
            you find your friends on GoalMogul.
          </Text>

          <Text style={Styles.contactNoteText}>
            Note: we do not collect or share contact data.
          </Text>

          <TouchableWithoutFeedback onPress={this.handleNextOnPressed.bind(this)}>
            <View>
              <Button text='Sync' />
            </View>
          </TouchableWithoutFeedback>

          <Button text='Skip' arrow />
        </View>
      </View>
    );
  }
}

export default connect(null, { registrationNextContactSync })(Contacts);
