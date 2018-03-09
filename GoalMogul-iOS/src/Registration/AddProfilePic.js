import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';

/* Components */
import Header from './Header';
import Button from './Button';
import Divider from './Divider';

/* Styles */
import Styles from './Styles';

class AddProfilePic extends Component {

  render() {
    return (
      <View style={Styles.containerStyle}>
        <Header name='John Doe' />
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
          <View style={styles.profilePicStyle} />
          <Button text='Next' />
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

export default AddProfilePic;
