/**
 * This is the central hub for current friends management
 */
import React from 'react';
import {
    FlatList,
    View
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

    render() {
        const { user } = this.props;
        const modalTitle = `${user.name}'s Friends`;
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
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
                    this.props.refreshing ? '' :
                        <EmptyResult text={'You haven\'t added any friends'} />
                    }
                />
            </View>
        );
    }
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
