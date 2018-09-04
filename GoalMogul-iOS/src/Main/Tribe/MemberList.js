import React from 'react';
import {
  View,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';

import MemberListCard from './MemberListCard';

class MemberList extends React.Component {

  keyExtractor = (item) => item._id;

  renderItem = ({ item }) => {
    return <MemberListCard item={item} />;
  }

  render() {
    return (
      <View>
        <FlatList
          data={this.props.data}
          renderItem={this.renderItem}
          numColumns={1}
          keyExtractor={this.keyExtractor}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const item = state.tribe;

  return {
    data: item.members
  };
};

export default connect(
  mapStateToProps,
  null
)(MemberList);
