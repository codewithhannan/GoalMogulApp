/**
 * This is the file for People tab in discovery tab
 */
import React from 'react';
import {
    View,
    FlatList
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

// Actions
import {
    exploreRefreshPeople,
    exploreLoadMorePeople
} from '../../../redux/modules/explore/ExploreActions';

// Selectors
import {
    makeGetUsers
} from '../../../redux/modules/explore/selector';

// Components
import EmptyResult from '../../Common/Text/EmptyResult';
import FriendCardView from '../../MeetTab/V2/FriendCardView';

class PeopleTab extends React.Component {
    componentDidMount() {
        if (!this.props.data || _.isEmpty(this.props.data)) {
            this.handleOnRefresh();
        }
    }

    _keyExtractor = (item) => item._id;

    handleOnRefresh = () => this.props.exploreRefreshPeople();

    handleOnLoadMore = () => this.props.exploreLoadMorePeople();

    renderItem = ({ item }) => {
        return <FriendCardView item={item} />;
    }

    renderListHeader() {
        // return <EventTabFilterBar value={{ sortBy: this.props.sortBy }}/>;
        return null;
    }

    render() {
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={this.props.data}
                renderItem={this.renderItem}
                numColumns={1}
                keyExtractor={this._keyExtractor}
                refreshing={this.props.refreshing}
                onRefresh={this.handleOnRefresh}
                onEndReached={this.handleOnLoadMore}
                ListHeaderComponent={this.renderListHeader()}
                ListEmptyComponent={
                    this.props.refreshing ? null :
                    <EmptyResult text={'No Recommendations'} />
                }
                onEndThreshold={0}
            />
        </View>
    );
    }
}

const makeMapStateToProps = () => {
    const getUsers = makeGetUsers();

    const mapStateToProps = (state, props) => {
        const { refreshing, loading } = state.explore.people;
        
    
        return {
            data: getUsers(state), // Selector to transform ids to user objects
            loading,
            refreshing
        };
    };
    return mapStateToProps;
};


export default connect(
    makeMapStateToProps,
    {
        exploreRefreshPeople,
        exploreLoadMorePeople
    }
)(PeopleTab);
