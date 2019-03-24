import React from 'react';
import {
  View,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash'

// Actions
import {
  refreshTribe,
  loadMoreTribe
} from '../../redux/modules/tribe/TribeTabActions';

// Components
import TribeCard from './TribeCard';
import TribeTabFilterBar from './TribeTabFilterBar';
import EmptyResult from '../Common/Text/EmptyResult';

class TribeTab extends React.Component {
  componentDidMount() {  
    if (!this.props.data || _.isEmpty(this.props.data)) {
      this.handleOnRefresh();
    }
  }
  
  _keyExtractor = (item) => item._id;

  handleOnRefresh = () => this.props.refreshTribe();

  handleOnLoadMore = () => this.props.loadMoreTribe();

  renderItem = ({ item }) => {
    return <TribeCard item={item} />;
  }

  renderListHeader() {
    return <TribeTabFilterBar value={{ sortBy: this.props.sortBy }}/>;
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
          ListEmptyComponent={
            this.props.loading ? null :
            <EmptyResult text={'No Recommendations'} />
          }
          onEndThreshold={0}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { data, loading, sortBy } = state.tribeTab;

  // const loading = false;
  const testData = [
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
          memberRef: {
            _id: '1203798700',
            name: 'Jia Zeng',
            profile: {
              image: undefined
            }
          },
          category: 'Member'
        },
        {
          memberRef: {
            _id: '1203798701',
            name: 'Aditya Zheng',
            profile: {
              image: undefined
            }
          },
          category: 'Admin'
        },
        {
          memberRef: {
            _id: '1203798703',
            name: 'Requester',
            profile: {
              image: undefined
            }
          },
          category: 'JoinRequester'
        }
      ],
      memberCount: 3,
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
          memberRef: {
            _id: '1203798705',
            name: 'Super Andy',
            profile: {
              image: undefined
            }
          },
          category: 'Member'
        }
      ],
      memberCount: 19,
    }
  ];

  return {
    // data: [...data, ...testData],
    data,
    loading,
    sortBy
  };
};

export default connect(
  mapStateToProps,
  {
    refreshTribe,
    loadMoreTribe
  }
)(TribeTab);
