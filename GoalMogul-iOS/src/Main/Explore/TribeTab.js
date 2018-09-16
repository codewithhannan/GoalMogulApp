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
import TribeTabFilterBar from './TribeTabFilterBar';

class TribeTab extends React.Component {
  _keyExtractor = (item) => item._id;

  handleOnRefresh = () => this.props.refreshTribe();

  handleOnLoadMore = () => this.props.loadMoreTribe();

  renderItem = ({ item }) => {
    return <TribeCard item={item} />;
  }

  renderListHeader() {
    return <TribeTabFilterBar />;
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
          ListHeaderComponent={this.renderListHeader()}
          onEndThreshold={0}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  // const { data, loading } = state.tribeTab;

  const loading = false;
  const data = [
    {
      _id: '123170293817024',
      created: '',
      name: 'SoHo Artists',
      membersCanInvite: true,
      isPubliclyVisible: true,
      membershipLimit: 100,
      description: 'This group is for all artists currently living in or working out of ' +
      'SoHo, NY. We exchange ideas, get feedback from each other and help each other ' +
      'organize exhiits for our work!',
      picture: '',
      members: [
        {
          _id: '1203798700',
          name: 'Jia Zeng',
          profile: {
            image: undefined
          }
        }
      ],
      memberCount: 10,
    },
    {
      _id: '123170293817023',
      created: '',
      name: 'Comic fans',
      membersCanInvite: true,
      isPubliclyVisible: true,
      membershipLimit: 20,
      description: 'This group is dedicated to the fan of comics in LA!',
      picture: '',
      members: [
        {
          _id: '1203798705',
          name: 'Super Andy',
          profile: {
            image: undefined
          }
        }
      ],
      memberCount: 19,
    }
  ];

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
