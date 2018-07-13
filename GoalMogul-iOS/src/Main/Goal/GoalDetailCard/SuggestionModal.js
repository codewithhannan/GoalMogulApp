import React, { Component } from 'react';
import {
  View,
  Modal,
  Text,
  FlatList,
  Image,
  TouchableWithoutFeedback
} from 'react-native';
import { SearchBar } from 'react-native-elements';

// Components
import ModalHeader from '../../../Main/Common/Header/ModalHeader';
import PeopleCard from '../Common/PeopleCard';
import PeopleCardDetail from '../Common/PeopleCardDetail';

// Asset
import Book from '../../../asset/suggestion/book.png';
import Chat from '../../../asset/suggestion/chat.png';
import Event from '../../../asset/suggestion/event.png';
import Flag from '../../../asset/suggestion/flag.png';
import Friend from '../../../asset/suggestion/friend.png';
import Group from '../../../asset/suggestion/group.png';
import Link from '../../../asset/suggestion/link.png';
import Other from '../../../asset/suggestion/other.png';

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
        autoFocus={false}
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

  renderIconItem = ({ item, index }) => {
    const selected = 1;
    const style = index === selected ?
      {
        ...styles.selectedSuggestionIconStyle,
        ...item.value.iconStyle
      } : {
        ...styles.suggestionIconStyle,
        ...item.value.iconStyle
      };

    const textStyle = index === selected ? { ...styles.selectedSuggestionTextStyle }
      : { ...styles.suggestionTextStyle };
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'flex-start',
          justifyContent: 'center',
          marginBottom: 7,
          marginLeft: 45
        }}
      >
        <TouchableWithoutFeedback onPress={() => console.log('press icon with indexL ', index)}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Image source={item.value.iconSource} style={style} />
          <Text style={textStyle}>{item.key.toUpperCase()}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderOptions() {
    const options = (
      <View style={{ padding: 10 }}>
      <FlatList
        data={IconMap}
        renderItem={this.renderIconItem}
        keyExtractor={(item) => item.key}
        numColumns={2}
      />
      </View>
    );

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
        {options}
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
  },
  // Options style
  selectedSuggestionIconStyle: {
    tintColor: '#45C9F6',
    height: 20,
    width: 20
  },
  suggestionIconStyle: {
    tintColor: '#b8c7cb',
    height: 20,
    width: 20
  },
  selectedSuggestionTextStyle: {
    color: 'black',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 15
  },
  suggestionTextStyle: {
    color: '#b8c7cb',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 15
  }
};

const IconMap = [
  {
    key: 'book',
    value: {
      iconSource: Book,
      iconStyle: {

      }
    }
  },
  {
    key: 'chat',
    value: {
      iconSource: Chat,
      iconStyle: {

      }
    }
  },
  {
    key: 'event',
    value: {
      iconSource: Event,
      iconStyle: {

      }
    }
  },
  {
    key: 'flag',
    value: {
      iconSource: Flag,
      iconStyle: {

      }
    }
  },
  {
    key: 'friend',
    value: {
      iconSource: Friend,
      iconStyle: {

      }
    }
  },
  {
    key: 'group',
    value: {
      iconSource: Group,
      iconStyle: {

      }
    }
  },
  {
    key: 'link',
    value: {
      iconSource: Link,
      iconStyle: {

      }
    }
  },
  {
    key: 'other',
    value: {
      iconSource: Other,
      iconStyle: {

      }
    }
  },
];

export default SuggestionModal;
