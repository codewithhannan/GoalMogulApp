import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { SearchBar, Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { MenuProvider } from 'react-native-popup-menu';

// Component
import BaseOverlay from './BaseOverlay';
import SearchFilterBar from './SearchFilterBar';

class SearchOverlay extends Component {

  componentDidMount() {
    this.refs.searchBar.focus();
  }

  handleCancel = () => {
    //TODO: potentially clear search state
    Actions.pop();
  }

  handleClear = () => {
    console.log('user clear search input');
  }

  handleChangeText = value => {
    console.log('input is: ', value);
  }

  searchIcon = () => (
    <View style={{ flexDirection: 'row' }}>
      <Icon
        type='font-awesome'
        name='search'
        style={styles.searchIconStyle}
      />
      <Text>Search GoalMogul</Text>
    </View>
  );

  render() {
    return (

      <BaseOverlay verticalPercent={1} horizontalPercent={1}>
        <MenuProvider>
          <View style={styles.headerContainerStyle}>
            <SearchBar
              ref='searchBar'
              platform='ios'
              round
              inputStyle={styles.searchInputStyle}
              inputContainerStyle={styles.searchInputContainerStyle}
              containerStyle={styles.searchContainerStyle}
              placeholder='Search GoalMogul'
              cancelButtonTitle='Cancel'
              onCancel={this.handleCancel}
              onChangeText={this.handleChangeText}
              onClear={this.handleClear}
              cancelButtonProps={{ color: '#45C9F6' }}
            />
          </View>
          <SearchFilterBar />
        </MenuProvider>
      </BaseOverlay>
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
  },
  headerContainerStyle: {
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export default connect(null, null)(SearchOverlay);
