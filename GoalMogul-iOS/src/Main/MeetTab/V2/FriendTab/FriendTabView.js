/**
 * This is the central hub for current friends management
 */
import _ from 'lodash';
import React from 'react';
import { ActivityIndicator, FlatList, View, Text } from 'react-native';
import { connect } from 'react-redux';
// Constants
import { MEET_REQUEST_LIMIT } from '../../../../reducers/MeetReducers';
/* Actions */
import { handleRefreshFriend, loadMoreRequest } from '../../../../redux/modules/meet/MeetActions';
/* Styles */
import { BACKGROUND_COLOR, GM_FONT_FAMILY_1, GM_FONT_2 } from '../../../../styles';
import SearchBarHeader from '../../../Common/Header/SearchBarHeader';
/* Components */
import EmptyResult from '../../../Common/Text/EmptyResult';
import FriendTabCardView from './FriendTabCardView';


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
        return (
            <View style={{ paddingTop: 10, paddingLeft: 16, paddingRight: 16 }}>
                <FriendTabCardView item={item} />
            </View>
        );
    }

    renderListFooter() {
        const { loading, data } = this.props;
        // console.log(`${DEBUG_KEY}: loading is: ${loadingMore}, data length is: ${data.length}`);
        if (loading && data.length >= MEET_REQUEST_LIMIT) {
            return (
                <View style={{ paddingVertical: 20 }}>
                    <ActivityIndicator size='small' />
                </View>
            );
        }
    }

    render() {
        const { user } = this.props;
        const modalTitle = `${user.name}'s Friends`;
        const friendCount = this.props.data ? this.props.data.length : 0;
        return (
            <View style={styles.containerStyle}>
                <SearchBarHeader backButton title={modalTitle} />
                <Text style={{
                    fontFamily: GM_FONT_FAMILY_1,
                    fontWeight: 'bold',
                    fontSize: GM_FONT_2,
                    letterSpacing: 0.3,
                    marginLeft: 24,
                    marginTop: 24
                }}>{friendCount} Friend{friendCount !== 1 ? 's' : null }</Text>
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
        backgroundColor: 'white'
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
