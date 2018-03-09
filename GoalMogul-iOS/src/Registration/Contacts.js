import React, { Component } from 'react';
import { View, Text } from 'react-native';

/* Components */
import Header from './Header';
import Button from './Button';
import Divider from './Divider';

/* Styles */
import Styles from './Styles';

class Contacts extends Component {

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

          <Text style={Styles.explanationTextStyle}>
            Your headline:
          </Text>

          <Button text='Sync' />
          <Button text='Skip' arrow />
        </View>
      </View>
    );
  }
}

export default Contacts;
