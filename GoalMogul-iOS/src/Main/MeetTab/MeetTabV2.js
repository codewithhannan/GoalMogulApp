// This is the V2 design of the meettab with design spec
import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    Platform
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { Constants } from 'expo';
import { Actions } from 'react-native-router-flux';

/* Components */
import FriendCardView from './V2/FriendCardView';
import FriendRequestCardView from './V2/FriendRequestCardView';
import FriendInvitationCTR from './V2/FriendInvitationCTR';
import SearchBarHeader from '../Common/Header/SearchBarHeader';

/* Actions */
import {
    handleRefresh,
} from '../../redux/modules/meet/MeetActions';

import { 
    meetContactSync
} from '../../actions';

/* Assets */
import People from '../../asset/utils/People.png';
import ContactSyncIcon from '../../asset/utils/ContactSync.png';

/* Selectors */
import {
    getIncomingUserFromFriendship,
    getOutgoingUserFromFriendship
} from '../../redux/modules/meet/selector';

/* Styles */
import {
    APP_BLUE
} from '../../styles';

/* Constants */
import { IPHONE_MODELS } from '../../Utils/Constants';

const DEBUG_KEY = '[ UI MeetTabV2 ]'; 
const NumCardsToShow = Platform.OS === 'ios' &&
  IPHONE_MODELS.includes(Constants.platform.ios.model.toLowerCase())
  ? 5 : 3;

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
        console.log(`${DEBUG_KEY}: refreshing`);
        this.props.handleRefresh();
    }

    handleSyncContact = () => {
        this.props.meetContactSync(this.handleOnRefresh);
    }

    handleDiscoverFriend = () => {
        Actions.discoverTabView();
    }

    handleSeeAllFriends = () => {
        Actions.friendTabView();
    }

    handleSeeAllRequests = () => {
        Actions.requestTabView();
    }

    handleInviteFriends = () => {
        Actions.push('friendInvitationView');
    }

    // List header is the FriendInvitationCTR, Sync Conacts and Discover Friends option
    renderListHeader() {
        return (
            <View>
                <FriendInvitationCTR handleInviteFriends={this.handleInviteFriends.bind(this)} />
                <View 
                    style={{ 
                        flexDirection: 'row', 
                        marginTop: 12, 
                        marginBottom: 5,
                        backgroundColor: 'white', 
                        ...styles.shadow, 
                        alignItems: 'center', 
                    }}
                >
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

    // Render compacted friend request cards
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

        let ret = [];

        ret = ret.concat(dataToRender.map((d) => <FriendRequestCardView item={d} key={d._id} />));
        if (totalLength > 0) {
            ret.push(this.renderSectionTitle('Friend requests'));
        }
        // TODO: delete the following line
        // ret.push(this.renderSeeAll(totalLength, this.handleSeeAllRequests, 'request-see-all-test'));
        if (totalLength > NumCardsToShow) {
            ret.push(this.renderSeeAll(totalLength, this.handleSeeAllRequests, 'request-see-all'));
        }
        return ret;
        // If total length is less than threshold, then don't render See All
    }

    // Render compacted friend cards
    renderFriends = (friends, friendCount) => {
        const length = friends ? friends.length : 0;
        const dataToRender = length > NumCardsToShow ? friends.slice(0, NumCardsToShow) : friends;
        let ret = [];
        if (length > 0) {
            ret.push(this.renderSectionTitle('Your Friends'));
        }
        ret = ret.concat(dataToRender.map((d) => <FriendCardView item={d} key={d._id} />));
        if (friendCount > NumCardsToShow) {
            ret.push(this.renderSeeAll(friendCount, this.handleSeeAllFriends, 'friends-see-all'));
        }
        return ret;
    }

    renderSectionTitle = (title) => {
        return (
            <View style={{ padding: 13 }} key={`${title}`}>
                <Text style={{ color: '#616161', fontWeight: '700', fontSize: 12 }}>
                    {title}
                </Text>
            </View>
        );
    }

    renderSeeAll = (count, onPress, key) => {
        const { seeAllContainerStyle, seeAllTextStyle, shadow } = styles; 
        return (
            <TouchableOpacity 
                style={{ ...seeAllContainerStyle, ...shadow }}
                activeOpacity={0.85} 
                onPress={onPress}
                key={key}
            >
                <Text style={seeAllTextStyle}>See All ({count})</Text>
                <View style={{ alignSelf: 'center', alignItems: 'center' }}>
                    <Icon
                        name='ios-arrow-round-forward'
                        type='ionicon'
                        color='#17B3EC'
                        iconStyle={styles.arrowIconStyle}
                    />
                </View>
            </TouchableOpacity>
        );
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
    },
    // See all related styles
    seeAllContainerStyle: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 7
    },
    seeAllTextStyle: {
        color: APP_BLUE,
        fontSize: 12,
        fontWeight: '700'
    },
    arrowIconStyle: {
        alignSelf: 'center',
        fontSize: 20,
        marginLeft: 5,
        marginTop: 2
      },
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
        handleRefresh,
        meetContactSync
    }
)(MeetTabV2);
