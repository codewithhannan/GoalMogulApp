import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import { MenuProvider } from 'react-native-popup-menu';

// Actions
import {
  refreshTribe,
  loadMoreTribe,
  closeMyTribeTab,
  myTribeSelectTab
} from '../../../redux/modules/tribe/MyTribeTabActions';

import {
  openNewTribeModal
} from '../../../redux/modules/tribe/NewTribeActions';

// Components
import MyTribeCard from './MyTribeCard';
import SearchBarHeader from '../../Common/Header/SearchBarHeader';
import MyTribeFilterBar from './MyTribeFilterBar';
import TabButtonGroup from '../../Common/TabButtonGroup';
import EmptyResult from '../../Common/Text/EmptyResult';

// Assets
import plus from '../../../asset/utils/plus.png';

// Styles
import { APP_DEEP_BLUE } from '../../../styles';

const DEBUG_KEY = '[ UI MyTribeTab ]';

class MyTribeTab extends React.Component {
  componentDidMount() {
    const { initial } = this.props;
    if (initial && initial.openNewTribeModal) {
      setTimeout(() => {
        this.props.openNewTribeModal();
      }, 300);
    }
  }

  _keyExtractor = (item) => item._id;

  handleOnRefresh = () => this.props.refreshTribe();

  handleOnLoadMore = () => this.props.loadMoreTribe();

  handleIndexChange = (index) => {
    this.props.myTribeSelectTab(index);
  }

  renderItem = ({ item }) => {
    return <MyTribeCard item={item} />;
  }

  renderTabs = props => {
    return (
      <TabButtonGroup 
        buttons={props} 
        noBorder
        buttonStyle={{
          selected: {
            backgroundColor: APP_DEEP_BLUE,
            tintColor: 'white',
            color: 'white',
            fontWeight: '700'
          },
          unselected: {
            backgroundColor: '#FCFCFC',
            tintColor: '#616161',
            color: '#616161',
            fontWeight: '600'
          }
        }}  
      />
    );
  }

  renderListHeader() {
    return (
      <View>
        <MyTribeFilterBar />
      </View>
    );
  }

  renderCreateTribeButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.iconContainerStyle}
        onPress={() => this.props.openNewTribeModal()}
      >
        <Image style={styles.iconStyle} source={plus} />
      </TouchableOpacity>
    );
  }
  // ListHeaderComponent={this.renderListHeader()}
  // <Modal
  //   style={{ flex: 1 }}
  //   animationType='fade'
  //   visible={this.props.showModal}
  // >

  render() {
    return (
      <View
        style={{ flex: 1, backgroundColor: 'white' }}
      >
        <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
          <SearchBarHeader 
            backButton 
            title='My Tribes' 
            onBackPress={() => this.props.closeMyTribeTab()}
          />
          {
            this.renderTabs({
              jumpToIndex: (i) => this.handleIndexChange(i),
              navigationState: this.props.navigationState
            })
          }
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
              <EmptyResult text={'No Tribes found'} />
            }
            onEndThreshold={0}
          />
          {this.renderCreateTribeButton()}
        </MenuProvider>
      </View>

    );
  }
}

const mapStateToProps = state => {
  const { showModal, loading, data, navigationState } = state.myTribeTab;

  return {
    data,
    loading,
    showModal,
    navigationState
  };
};

const styles = {
  backdrop: {
    backgroundColor: 'gray',
    opacity: 0.5,
  },
  createButtonContainerStyle: {
    height: 30,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginRight: 20,
    backgroundColor: '#efefef',
    borderRadius: 5
  },
  separator: {
    width: 0.5,
    color: 'gray'
  },
  iconContainerStyle: {
    position: 'absolute',
    bottom: 20,
    right: 15,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#17B3EC',
    backgroundColor: '#4096c6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  iconStyle: {
    height: 26,
    width: 26,
    tintColor: 'white',
  },
};

export default connect(
  mapStateToProps,
  {
    refreshTribe,
    loadMoreTribe,
    closeMyTribeTab,
    openNewTribeModal,
    myTribeSelectTab
  }
)(MyTribeTab);
