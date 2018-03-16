import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, ActionSheetIOS } from 'react-native';
import { connect } from 'react-redux';

/* Components */
import Header from './Common/Header';
import Button from './Common/Button';
import Divider from './Common/Divider';

/* Styles */
import Styles from './Styles';

/* Actions */
import { registrationNextIntro } from '../actions';

/* Action sheet specific */
//TODO: abstract out as util function
const BUTTONS = ['Taking Pictures', 'Camera Roll', 'Cancel'];
const CANCEL_INDEX = 2;

class AddProfilePic extends Component {

  handleNextOnPressed() {
    this.props.registrationNextIntro();
  }

  handlePictureOnPressed() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: CANCEL_INDEX,
    },
    (buttonIndex) => {
      console.log('button clicked', BUTTONS[buttonIndex]);
      // this.setState({ clicked: BUTTONS[buttonIndex] });
    });
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
          <TouchableWithoutFeedback onPress={this.handlePictureOnPressed.bind(this)}>
            <View style={styles.profilePicStyle} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.handleNextOnPressed.bind(this)}>
            <View>
              <Button text='Next' />
            </View>
          </TouchableWithoutFeedback>
          <Button text='Skip' arrow />
        </View>
      </View>
    );
  }
}

const styles = {
  profilePicStyle: {
    height: 200,
    width: 200,
    alignSelf: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  }
};

export default connect(null, { registrationNextIntro })(AddProfilePic);
