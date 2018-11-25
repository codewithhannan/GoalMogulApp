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
  refreshEvent,
  loadMoreEvent,
  closeMyEventTab,
  myEventSelectTab
} from '../../../redux/modules/event/MyEventTabActions';
import {
  openNewEventModal
} from '../../../redux/modules/event/NewEventActions';

// Components
import MyEventCard from './MyEventCard';
import ModalHeader from '../../Common/Header/ModalHeader';
import MyEventFilterBar from './MyEventFilterBar';
import TabButtonGroup from '../../Common/TabButtonGroup';
import EmptyResult from '../../Common/Text/EmptyResult';

// Assets
import plus from '../../../asset/utils/plus.png';

class MyEventTab extends React.Component {

  _keyExtractor = (item) => item._id;

  handleOnRefresh = () => this.props.refreshEvent();

  handleOnLoadMore = () => this.props.loadMoreEvent();

  handleIndexChange = (index) => {
    this.props.myEventSelectTab(index);
  }

  renderItem = ({ item }) => {
    return <MyEventCard item={item} />;
  }

  renderTabs = props => {
    return (
      <TabButtonGroup buttons={props} />
    );
  }

  renderListHeader() {
    return (
      <View>
        <MyEventFilterBar />
      </View>
    );
  }

  renderCreateEventButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.iconContainerStyle}
        onPress={() => this.props.openNewEventModal()}
      >
        <Image style={styles.iconStyle} source={plus} />
      </TouchableOpacity>
    );
  }
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
            title='My Events'
            actionText='Create'
            cancelText='Close'
            onCancel={() => this.props.closeMyEventTab()}
            onAction={() => this.props.openNewEventModal()}
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
              <EmptyResult text={'No Events found'} />
            }
            onEndThreshold={0}
          />
          {this.renderCreateEventButton()}
        </MenuProvider>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { showModal, data, navigationState, loading } = state.myEventTab;

  const testData = [
    {
      _id: '980987230941',
      created: '2018-09-03T05:46:44.038Z',
      creator: {
        // User ref
        name: 'Jia Zeng'
      },
      title: 'Jay\'s end of internship party',
      start: '2018-09-05T05:46:44.038Z',
      durationHours: 2,
      participantsCanInvite: true,
      isInviteOnly: true,
      participantLimit: 100,
      location: '100 event ave, NY',
      description: 'Let\'s get together to celebrate Jay\'s birthday',
      picture: '',
      participants: [
        {
          _id: '123698172691',
          name: 'Super Andy',
          profile: {
            image: undefined
          }
        },
        {
          _id: '123698172692',
          name: 'Mike Gai',
          profile: {
            image: undefined
          }
        }
      ],
      participantCount: 2,
    },
    {
      _id: '980987230942',
      created: '2018-6-03T05:46:44.038Z',
      creator: {
        // User ref
        name: 'David Bogger'
      },
      title: 'Back to school party',
      start: '2018-09-10T05:46:44.038Z',
      durationHours: 3,
      participantsCanInvite: false,
      isInviteOnly: true,
      participantLimit: 30,
      location: 'TBD',
      description: 'We do nothing and simple enjoy life',
      picture: '',
      participants: [
        {
          participantRef: {
            _id: '123698172693',
            name: 'Batman',
            profile: {
              image: undefined
            }
          },
          rsvp: 'Invited'
        },
        {
          participantRef: {
            _id: '123698172694',
            name: 'Captain America',
            profile: {
              image: undefined
            }
          },
          rsvp: 'Interested'
        }
      ],
      participantCount: 2,
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
    refreshEvent,
    loadMoreEvent,
    closeMyEventTab,
    openNewEventModal,
    myEventSelectTab
  }
)(MyEventTab);
