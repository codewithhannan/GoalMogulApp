import React, { Component } from 'react';
import {
  View,
  Modal,
  Text,
  FlatList
} from 'react-native';
import { SearchBar } from 'react-native-elements';

// Components
import ModalHeader from '../../../Main/Common/Header/ModalHeader';
import PeopleCard from '../Common/PeopleCard';
import PeopleCardDetail from '../Common/PeopleCardDetail';

const testData = [
  {
    name: 'Jia Zeng',
    headline: 'Students at Duke University',
    request: false,
    _id: '120937109287091'
  },
  {
    name: 'Peter Kushner',
    headline: 'CEO at start industries',
    request: false,
    _id: '019280980248303'
  }
];

class SuggestionModal extends Component {
  state = {
    query: ''
  }

  // Flatlist handler
  handleRefresh = () => {

  }

  handleOnLoadMore = () => {

  }

  // Search Query handler
  handleSearchCancel = () => this.handleQueryChange('');
  handleSearchClear = () => this.handleQueryChange('');

  handleQueryChange = query => {
    this.setState(state => ({ ...state, query: query || '' }));
  }

  renderSearch() {
    return (
      <SearchBar
        platform='ios'
        round
        autoFocus
        inputStyle={styles.searchInputStyle}
        inputContainerStyle={styles.searchInputContainerStyle}
        containerStyle={styles.searchContainerStyle}
        placeholder='Search by name, occupation, etc.'
        cancelButtonTitle='Cancel'
        onCancel={this.handleSearchCancel}
        onChangeText={this.handleQueryChange}
        cancelButtonProps={{ color: '#45C9F6' }}
        showLoading={this.props.loading}
        onClear={this.handleSearchClear}
        value={this.state.query}
      />
    );
  }

  renderOptions() {
    return (
      <View style={{ backgroundColor: 'white', marginTop: 0.5 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '700',
            alignSelf: 'center',
            justifyContent: 'center',
            marginTop: 10,
            marginBottom: 10
          }}
        >
          Suggest a...
        </Text>
      </View>
    );
  }

  renderItem = (item) => (
    <PeopleCard>
      <PeopleCardDetail item={item} />
    </PeopleCard>
  )

  renderQueryResult() {
    return (
      <View style={{ flex: 1, marginTop: 0.5, backgroundColor: 'white' }}>
        <FlatList
          data={testData}
          renderItem={this.renderItem}
          keyExtractor={(item) => item._id}
          onEndReached={this.handleOnLoadMore}
          onEndReachedThreshold={0}
        />
      </View>
    );
    // onRefresh={this.handleRefresh}
    // refreshing={this.props.refreshing}
    // ListEmptyComponent={<EmptyResult text={'You haven\'t added any friends'} />}
  }

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={this.props.visible}
      >
        <View style={{ flex: 1, backgroundColor: 'lightgray' }}>
          <ModalHeader
            title='Suggestion'
            actionText='Attach'
            onCancel={this.props.onCancel}
            onAction={() => console.log('Action')}
          />
          {this.renderOptions()}
          {this.renderSearch()}
          {this.renderQueryResult()}
        </View>
      </Modal>
    );
  }
}

const styles = {
  searchContainerStyle: {
    padding: 0,
    marginRight: 3,
    marginTop: 0.5,
    backgroundColor: '#ffffff',
    // backgroundColor: '#45C9F6',
    borderTopColor: '#ffffff',
    borderBottomColor: '#ffffff',
    alignItems: 'center',
  },
  searchInputContainerStyle: {
    backgroundColor: '#f3f4f6',
    // backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInputStyle: {
    fontSize: 15,
  },
  searchIconStyle: {
    top: 15,
    fontSize: 13
  }
};

export default SuggestionModal;
