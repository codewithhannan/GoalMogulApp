import React, { Component } from 'react';
import { View, FlatList } from 'react-native';

/* Component */
import ProfileDetailCard from './ProfileDetailCard';

const testData = [
  {

  }
];

class ProfileDetail extends Component {

  keyExtractor = (item, index) => item.node.image.uri;

  renderRow(data) {
    // console.log('rendering item p: ', data.item);
    const p = data.item;
    return (
      <ProfileDetailCard />
    );
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <FlatList
          enableEmptySections
          data={testData}
          renderItem={(item) => this.renderRow(item)}
          numColumns={1}
          keyExtractor={this.keyExtractor}
        />
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1
  }
};

export default ProfileDetail;
