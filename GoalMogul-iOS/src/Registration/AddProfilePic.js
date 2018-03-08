import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';

/* Components */
import Header from './Header';
import Button from './Button';
import Divider from './Divider';
import RegistrationContainer from './RegistrationContainer';
import RegistrationBody from './RegistrationBody';

class AddProfilePic extends Component {

  render() {
    return (
      <RegistrationContainer>
        <Header name='John Doe' />
        <RegistrationBody>
          <Text style={styles.titleTextStyle}>Add a picture</Text>
          <View style={{ alignSelf: 'center' }}>
            <Divider
              horizontal
              width={250}
              borderBottomWidth={2}
              color='#f4f4f4'
            />
          </View>
          <Text style={styles.explanationTextStyle}>
            It helps your friends identify you
          </Text>
          <View style={styles.profilePicStyle} />
          <Button text='Next' />
          <Button text='Skip' arrow />
        </RegistrationBody>
      </RegistrationContainer>
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
  },
  titleTextStyle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#646464',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 18
  },
  explanationTextStyle: {
    marginTop: 20,
    marginBottom: 17,
    alignSelf: 'center',
    color: '#858585',
    fontSize: 15
  }
};

export default AddProfilePic;
