import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';

/* Components */
import Header from './Header';
import Button from './Button';
import Divider from './Divider';
import RegistrationContainer from './RegistrationContainer';
import RegistrationBody from './RegistrationBody';
import FormContainer from './FormContainer';

/* Styles */
import Styles from './Styles';

class IntroForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      headline: ''
    };
  }

  render() {
    return (
      <RegistrationContainer>
        <Header name='John Doe' />
        <RegistrationBody>
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

          <Button text='Next' />
          <Button text='Skip' arrow />
        </RegistrationBody>
      </RegistrationContainer>
    );
  }
}

export default IntroForm;
