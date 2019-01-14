// This is the V2 design of the meettab with design spec
import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    RefreshControl
} from 'react-native';
import { connect } from 'react-redux';

/* Components */
import FriendCardView from './V2/FriendCardView';
import FriendRequestCardView from './V2/FriendRequestCardView';
import FriendInvitationCTR from './V2/FriendInvitationCTR';
import SearchBarHeader from '../Common/Header/SearchBarHeader';

/* Actions */
import {
    handleRefresh
} from '../../redux/modules/meet/MeetActions';

/* Assets */
import People from '../../asset/utils/People.png';
import ContactSyncIcon from '../../asset/utils/ContactSync.png';

/* Selectors */
import {
    getIncomingUserFromFriendship,
    getOutgoingUserFromFriendship
} from '../../redux/modules/meet/selector';

const NumCardsToShow = 3;

class MeetTabV2 extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnRefresh = this.handleOnRefresh.bind(this);
    }
    componentDidMount() {
        // Preloading data by calling handleOnRefresh
        this.handleOnRefresh();
    }

    keyExtractor = (item) => item._id;

    // MeetTab refresh
    handleOnRefresh = () => {
        this.props.handleRefresh();
    }

    handleSyncContact = () => {

    }

    handleDiscoverFriend = () => {

    }

    handleSeeAllFriends = () => {

    }

    handleSeeAllRequests = () => {

    }

    // List header is the FriendInvitationCTR, Sync Conacts and Discover Friends option
    renderListHeader() {
        return (
            <View>
                <FriendInvitationCTR />
                <View style={{ flexDirection: 'row', marginTop: 12, backgroundColor: 'white', ...styles.shadow, alignItems: 'center' }}>
                    <TouchableOpacity 
                        activeOpacity={0.85}
                        style={styles.CTRContainerStyle} 
                        onPress={this.handleSyncContact}
                    >
                        <Image 
                            source={ContactSyncIcon} 
                            style={styles.iconStyle} 
                            resizeMode='contain' 
                        />
                        <Text style={styles.CTRTextStyle}>Sync Contacts</Text>
                    </TouchableOpacity>
                    <View style={{ height: 25, width: 0.5, backgroundColor: 'lightgray' }} />
                    <TouchableOpacity 
                        activeOpacity={0.85}
                        style={styles.CTRContainerStyle} 
                        onPress={this.handleDiscoverFriend}
                    >
                        <Image 
                            source={People} 
                            style={styles.iconStyle} 
                            resizeMode='contain' 
                        />
                        <Text style={styles.CTRTextStyle}>Discover Friends</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
        );
    }

    renderRequests = (incomingRequests, outgoingRequests) => {
        // render FriendCardView or FriendRequestCardView based on item type
        const inLength = incomingRequests ? incomingRequests.length : 0;
        const outLength = outgoingRequests ? outgoingRequests.length : 0;
        const totalLength = inLength + outLength;
        const dataToRender = requestDataToRender(
            incomingRequests, 
            outgoingRequests, 
            NumCardsToShow
        );

        const ret = dataToRender.map((d) => <FriendRequestCardView item={d} />);
        if (totalLength > NumCardsToShow) {
            ret.push(this.renderSeeAll(totalLength, this.handleSeeAllRequests));
        }
        return ret;
        // If total length is less than threshold, then don't render See All
    }

    renderFriends = (friends, friendCount) => {
        const length = friends ? friends.length : 0;
        const dataToRender = length > NumCardsToShow ? friends.slice(0, NumCardsToShow) : friends;

        const ret = dataToRender.map(d => <FriendCardView item={d} />);
        if (friendCount > NumCardsToShow) {
            ret.push(this.renderSeeAll(friendCount, this.handleSeeAllRequests));
        }
        return ret;
    }

    render() {
        const { incomingRequests, outgoingRequests, friends, friendCount } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <SearchBarHeader rightIcon='menu' />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.refreshing}
                            onRefresh={this.handleOnRefresh}
                        />
                    }
                >
                    {this.renderListHeader()}
                    {this.renderRequests(incomingRequests, outgoingRequests)}
                    {this.renderFriends(friends, friendCount)}
                </ScrollView>
            </View>
        );
    }
}

const styles = {
    iconStyle: {
        width: 25,
        height: 25,
        marginRight: 10
    },
    CTRContainerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1,
        padding: 10
    },
    CTRTextStyle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#5e5e5e'
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    }
};

const mapStateToProps = state => {
    // Use new selector to cache the format the meettab data
    const { requests, friends } = state.meet;
    const { data, count } = friends;
    const { incoming, outgoing } = requests;
    const incomingRequests = getIncomingUserFromFriendship(state);
    const outgoingRequests = getOutgoingUserFromFriendship(state);
    return {
        // Meet tab is on refreshing state if one of them is refreshing
        refreshing: incoming.refreshing || outgoing.refreshing || friends.refreshing, 
        incomingRequests,
        outgoingRequests,
        friends: data,
        friendCount: count
    };
};

const requestDataToRender = (incomingRequests, outgoingRequests, threshold) => {
    let dataToRender = [];
    const inLength = incomingRequests ? incomingRequests.length : 0;
    const outLength = outgoingRequests ? outgoingRequests.length : 0;
    const totalLength = inLength + outLength;
    if (totalLength <= threshold) {
        dataToRender = [...incomingRequests, ...outgoingRequests];
    } else if (inLength > threshold) {
        // Render all incoming requests
        dataToRender = incomingRequests.slice(0, threshold);
    } else {
        // Incoming request is not sufficient, use outgoing request to fulfill the length
        dataToRender = [
            ...incomingRequests, 
            ...outgoingRequests.slice(0, threshold - inLength)
        ];
    }
    return dataToRender;
};

export default connect(
    mapStateToProps,
    {
        handleRefresh
    }
)(MeetTabV2);
