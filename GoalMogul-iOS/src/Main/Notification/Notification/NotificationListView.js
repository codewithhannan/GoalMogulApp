/**
 * This list view display the full list of notifications in 
 * notification Panel
 */
import React from 'react';
import {
    View,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';

// Components
import NotificationCard from './NotificationCard';
import SearchBarHeader from '../../Common/Header/SearchBarHeader';
import EmptyResult from '../../Common/Text/EmptyResult';

// Actions
import {
    loadMoreNotifications,
    refreshNotifications
} from '../../../redux/modules/notification/NotificationTabActions';

// Styles
import {
    BACKGROUND_COLOR
} from '../../../styles';

class NotificationListView extends React.PureComponent {

    handleRefresh = () => {
        this.props.refreshNotifications();
    }

    handleOnLoadMore = () => {
        this.props.loadMoreNotifications();
    }

    keyExtractor = (item) => item._id;

    renderItem = ({ item }) => {
        return <NotificationCard item={item} />;
    }

    renderListFooter() {
        const { loading, data } = this.props;
        // console.log(`${DEBUG_KEY}: loading is: ${loadingMore}, data length is: ${data.length}`);
        if (loading && data.length >= 10) {
            return (
                <View
                    style={{
                        paddingVertical: 12
                    }}
                >
                    <ActivityIndicator size='large' />
                </View>
            );
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
                <SearchBarHeader backButton title='Notifications' />
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
                        <EmptyResult text={'You have no notifications'} textStyle={{ paddingTop: 200 }} />
                    }
                    ListFooterComponent={this.renderListFooter()}
                />
            </View>
        );
    }
}

const mapStateToProps = state => {
    const { notifications } = state.notification;
    const {
        data,
        refreshing,
        loading
    } = notifications;

    return {
        data,
        refreshing,
        loading
    };
};

export default connect(
    mapStateToProps,
    {
        loadMoreNotifications,
        refreshNotifications
    }
)(NotificationListView);
