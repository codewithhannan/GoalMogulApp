/**
 * This is the central hub for current friends management
 */
import _ from 'lodash';
import React from 'react';
import { ActivityIndicator, FlatList, View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
// Constants
import { MEET_REQUEST_LIMIT } from '../../../../reducers/MeetReducers';
/* Actions */
import { handleRefreshFriend, loadMoreRequest } from '../../../../redux/modules/meet/MeetActions';
/* Styles */
import { BACKGROUND_COLOR, GM_FONT_FAMILY_1, GM_FONT_2, GM_FONT_FAMILY_3, GM_BLUE } from '../../../../styles';
import SearchBarHeader from '../../../Common/Header/SearchBarHeader';
/* Components */
import EmptyResult from '../../../Common/Text/EmptyResult';
import FriendTabCardView from './FriendTabCardView';
import Icons from '../../../../asset/base64/Icons';
import DelayedButton from '../../../Common/Button/DelayedButton';
import { Actions } from 'react-native-router-flux';
import { componentKeyByTab } from '../../../../redux/middleware/utils';


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

    handleManageInvitation = () => {
        const componentKeyToOpen = componentKeyByTab(this.props.navigationTab, 'requestTabView');
        Actions.push(componentKeyToOpen);
    }

    keyExtractor = (item) => item._id;

    renderItem = ({ item }) => {
        return (
            <FriendTabCardView item={item} />
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

    /**
     * List header with All Friends title and searchbar for friends
     */
    renderListHeader() {
        return (
            <View style={{ padding: 16, backgroundColor: BACKGROUND_COLOR, alignItems: "center" }}>
                <View style={{ flexDirection: "row", width: "100%" }}>
                    <Text style={{ fontFamily: GM_FONT_FAMILY_1, fontSize: 16, marginTop: 2 }}>
                        All Friends
                    </Text>
                    <View style={{ flex: 1 }} />
                    <DelayedButton style={{ flexDirection: "row", alignItems: "center"}} onPress={this.handleManageInvitation}>
                        <Text style={{ fontFamily: GM_FONT_FAMILY_3, fontWeight: "500", fontSize: 13, color: GM_BLUE, textDecorationLine: "underline" }}>
                            Manage Invitations
                        </Text>
                        <View style={{ height: 8, width: 5, marginLeft: 9 }}>
                            <Image source={Icons.ChevronLeft} style={{ height: 8, width: 5, tintColor: GM_BLUE, transform: [{ rotate: '180deg' }] }} resizeMode="cover" />
                        </View>
                    </DelayedButton>
                </View>
            </View>
        )
    }

    render() {
        const { user } = this.props;
        const modalTitle = `${user.name}'s Friends`;
        const friendCount = this.props.data ? this.props.data.length : 0;
        return (
            <View style={styles.containerStyle}>
                <SearchBarHeader backButton title={modalTitle} />
                {/* <Text style={{
                    fontFamily: GM_FONT_FAMILY_1,
                    fontWeight: 'bold',
                    fontSize: GM_FONT_2,
                    letterSpacing: 0.3,
                    marginLeft: 24,
                    marginTop: 24
                }}>{friendCount} Friend{friendCount !== 1 ? 's' : null }</Text> */}
                {this.renderListHeader()}
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
        backgroundColor: "#FAFAFA",
    },
}

const mapStateToProps = state => {
    const { friends } = state.meet;
    const { user } = state.user;
    const { data, refreshing } = friends;
    const navigationTab = state.navigation.tab;
    return {
        data,
        refreshing,
        user,
        navigationTab
    };
};

export default connect(
    mapStateToProps,
    {
        loadMoreRequest,
        handleRefreshFriend
    }
)(FriendTabView);
