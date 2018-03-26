import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { connect } from 'react-redux';

/* Components */
import Header from './Common/Header';
import Button from './Common/Button';
import Divider from './Common/Divider';
import AddingProfilePicture from './Common/AddingProfilePicture';

/* Styles */
import Styles from './Styles';

/* Actions */
import { registrationNextIntro } from '../actions';

class AddProfilePic extends Component {

  handleNextOnPressed() {
    this.props.registrationNextIntro(false);
  }

  handleSkipOnPressed() {
    console.log('skip on pressed callign action');
    this.props.registrationNextIntro(true);
  }

  render() {
    return (
      <View style={Styles.containerStyle}>
        <Header name='John Doe' type='profile' />
        <View style={Styles.bodyContainerStyle}>
          <Text style={Styles.titleTextStyle}>Add a picture</Text>
          <View style={{ alignSelf: 'center' }}>
            <Divider
              horizontal
              width={250}
              borderBottomWidth={2}
              color='#f4f4f4'
            />
          </View>
          <Text style={Styles.explanationTextStyle}>
            It helps your friends identify you
          </Text>
          <AddingProfilePicture />
          <TouchableWithoutFeedback onPress={this.handleNextOnPressed.bind(this)}>
            <View>
              <Button text='Next' />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.handleSkipOnPressed.bind(this)}>
            <View>
              <Button text='Skip' arrow />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

export default connect(null, { registrationNextIntro })(AddProfilePic);
