import React from 'react';
import {
  View,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';

// Actions
import {
  refreshTribe,
  loadMoreTribe
} from '../../redux/modules/tribe/TribeTabActions';

// Components
import TribeCard from './TribeCard';

class TribeTab extends React.Component {
  _keyExtractor = (item, index) => index;

  handleOnRefresh = () => this.props.refreshTribe();

  handleOnLoadMore = () => this.props.loadMoreTribe();

  renderItem = ({ item }) => {
    console.log('item to render in Tribe tab is: ', item);
    return <View style={{ height: 20, backgroundColor: 'red', marginTop: 2 }} />;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.props.data}
          renderItem={this.renderItem}
          numColumns={1}
          keyExtractor={this._keyExtractor}
          refreshing={this.props.loading}
          onRefresh={this.handleOnRefresh}
          onEndReached={this.handleOnLoadMore}
          onEndThreshold={0}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { data, loading } = state.tribeTab;

  return {
    data,
    loading
  };
};

export default connect(
  mapStateToProps,
  {
    refreshTribe,
    loadMoreTribe
  }
)(TribeTab);
