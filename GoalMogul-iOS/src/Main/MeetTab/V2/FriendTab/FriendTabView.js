/**
 * This is the central hub for current friends management
 */
import React from 'react';
import {
    FlatList,
    View,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

/* Components */
import EmptyResult from '../../../Common/Text/EmptyResult';
import SearchBarHeader from '../../../Common/Header/SearchBarHeader';
import FriendTabCardView from './FriendTabCardView';

/* Actions */
import {
    loadMoreRequest,
    handleRefreshFriend
} from '../../../../redux/modules/meet/MeetActions';

// Constants
import {
    MEET_REQUEST_LIMIT
} from '../../../../reducers/MeetReducers';

/* Styles */
import {
    BACKGROUND_COLOR
} from '../../../../styles';

const KEY = 'friends';
const DEBUG_KEY = '[ UI FriendTabView ]';

class FriendTabView extends React.Component {
    componentDidMount() {
        if (_.isEmpty(this.props.data)) this.props.handleRefreshFriend();
    }

    handleRefresh = () => {
        this.props.handleRefreshFriend();
    }

    handleOnLoadMore = () => {
        this.props.loadMoreRequest(KEY);
    }

    keyExtractor = (item) => item._id;

    renderItem = ({ item }) => {
        return <FriendTabCardView item={item} />;
    }

    renderListFooter() {
        const { loading, data } = this.props;
        // console.log(`${DEBUG_KEY}: loading is: ${loadingMore}, data length is: ${data.length}`);
        if (loading && data.length >= MEET_REQUEST_LIMIT) {
            return (
            <View
                style={{
                paddingVertical: 20
                }}
            >
                <ActivityIndicator size='small' />
            </View>
            );
        }
    }

    render() {
        const { user } = this.props;
        const modalTitle = `${user.name}'s Friends`;
        return (
            <View style={styles.containerStyle}>
                <SearchBarHeader backButton title={modalTitle} />
                <FlatList
                    data={this.props.data}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    onRefresh={this.handleRefresh}
                    refreshing={this.props.refreshing}
                    onEndReached={this.handleOnLoadMore}
                    onEndReachedThreshold={0}
                    ListEmptyComponent={
                    this.props.refreshing ? null :
                        <EmptyResult text={'You haven\'t added any friends'} />
                    }
                    ListFooterComponent={this.renderListFooter()}
                />
            </View>
        );
    }
}

const styles = {
    containerStyle: {
      flex: 1, 
      backgroundColor: BACKGROUND_COLOR,
      backgroundColor: '#f8f8f8',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
    },
  }

const mapStateToProps = state => {
    const { friends } = state.meet;
    const { user } = state.user;
    const { data, refreshing } = friends;
    return {
        data,
        refreshing,
        user
    };
};

export default connect(
    mapStateToProps,
    {
        loadMoreRequest,
        handleRefreshFriend
    }
)(FriendTabView);
