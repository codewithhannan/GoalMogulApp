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
import ModalHeader from '../../Common/Header/ModalHeader';
import MyTribeFilterBar from './MyTribeFilterBar';
import TabButtonGroup from '../../Common/TabButtonGroup';
import EmptyResult from '../../Common/Text/EmptyResult';

// Assets
import plus from '../../../asset/utils/plus.png';

class MyTribeTab extends React.Component {
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
      <TabButtonGroup buttons={props} />
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
        activeOpacity={0.85}
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
          <ModalHeader
            title='My Tribes'
            actionText='Create'
            cancelText='Close'
            onCancel={() => this.props.closeMyTribeTab()}
            onAction={() => this.props.openNewTribeModal()}
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
              this.props.loading ? '' :
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
          category: 'JoinRequester'
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
      memberCount: 1,
    }
  ];

  return {
    data: [...data],
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
    // backgroundColor: '#46C8F5',
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
