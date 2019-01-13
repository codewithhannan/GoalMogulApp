// This is the V2 design of the meettab with design spec
import React from 'react';
import {
    View,
    FlatList,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';

/* Components */
import FriendInvitationCTR from './V2/FriendInvitationCTR';
import SearchBarHeader from '../Common/Header/SearchBarHeader';

/* Assets */
import People from '../../asset/utils/People.png';
import ContactSyncIcon from '../../asset/utils/ContactSync.png';

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
        // Refresh incoming/outgoing request
        // Refresh friend list
    }

    handleSyncContact = () => {

    }

    handleDiscoverFriend = () => {

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

    renderItem = ({ item }) => {
        // render FriendCardView or FriendRequestCardView based on item type
    }

    render() {
        const { refreshing } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <SearchBarHeader rightIcon='menu' />
                <FlatList
                    data={this.props.data || []}
                    renderItem={this.renderItem}
                    numColumns={1}
                    keyExtractor={this.keyExtractor}
                    refreshing={refreshing}
                    onRefresh={this.handleOnRefresh}
                    ListHeaderComponent={this.renderListHeader()}
                />
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
    return {
        refreshing: false
    };
};

export default connect(
    mapStateToProps,
    {

    }
)(MeetTabV2);
