import React, { Component } from 'react';
import {
  View,
  Modal,
  Text
} from 'react-native';
import { SearchBar } from 'react-native-elements';

// Components
import ModalHeader from '../../../Main/Common/Header/ModalHeader';

class SuggestionModal extends Component {

  renderSearch() {
    return (
      <SearchBar
        platform='ios'
        round
        autoFocus
        inputStyle={styles.searchInputStyle}
        inputContainerStyle={styles.searchInputContainerStyle}
        containerStyle={styles.searchContainerStyle}
        placeholder='Search GoalMogul'
        cancelButtonTitle='Cancel'
        onCancel={this.handleCancel}
        onChangeText={this.handleChangeText}
        clearIcon={null}
        cancelButtonProps={{ color: '#45C9F6' }}
        showLoading={this.props.loading}
      />
    );
  }

  renderOptions() {
    return (
      <View style={{ backgroundColor: 'color', marginTop: 0.5 }}>
        <Text
          style={{ fontSize: 14, fontWeight: '700', alignSelf: 'center', justifyContent: 'center' }}
        >
          Suggest a...
        </Text>
      </View>
    );
  }

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible
      >
        <View style={{ flex: 1, backgroundColor: 'gray' }}>
          <ModalHeader
            title='Suggestion'
            actionText='Attach'
            onCancel={() => console.log('Cancel')}
            onAction={() => console.log('Action')}
          />
        {this.renderOptions()}
        {this.renderSearch()}
        </View>
      </Modal>
    );
  }
}

const styles = {
  searchContainerStyle: {
    padding: 0,
    marginRight: 3,
    backgroundColor: '#ffffff',
    borderTopColor: '#ffffff',
    borderBottomColor: '#ffffff',
    alignItems: 'center',

  },
  searchInputContainerStyle: {
    backgroundColor: '#f3f4f6',
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
