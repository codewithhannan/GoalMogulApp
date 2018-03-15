import React, { Component } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';

/* Components */
import Header from './Common/Header';
import Button from './Common/Button';
import Divider from './Common/Divider';
import FormContainer from './Common/FormContainer';

/* Styles */
import Styles from './Styles';

/* Actions */
import { registrationNextContact } from '../actions';

class IntroForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      headline: ''
    };
  }

  handleNextOnPressed() {
    this.props.registrationNextContact();
  }

  render() {
    return (
      <View style={Styles.containerStyle}>
        <Header name='John Doe' />
        <View style={Styles.bodyContainerStyle}>
          <Text style={Styles.titleTextStyle}>A brief intro...</Text>
          <View style={{ alignSelf: 'center' }}>
            <Divider
              horizontal
              width={250}
              borderBottomWidth={2}
              color='#f4f4f4'
            />
          </View>

          <View style={{ marginTop: 15 }} />

          <Text style={Styles.explanationTextStyle}>
            Your headline:
          </Text>

          <FormContainer>
            <TextInput
              style={Styles.textInputStyle}
              placeholder="Ex: 'CEO of Wayne Enterprises'"
              onChangeText={(headline) => this.setState({ headline })}
              value={this.state.headline}
            />
          </FormContainer>
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

export default connect(null, { registrationNextContact })(IntroForm);
