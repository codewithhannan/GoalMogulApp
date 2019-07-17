/**
 * NOTE: This is the second step in MeetTabV2 sync contact. It allows user to send
 * Invite to the contacts that are not currently using the app
 */
import React from 'react';
import { 
    FlatList,
    View
} from 'react-native';
import { connect } from 'react-redux';
import ModalHeader from '../../Common/Header/ModalHeader';
import { APP_BLUE } from '../../../styles';
import EmptyResult from '../../Common/Text/EmptyResult';

const DEBUG_KEY = '[ UI ContactInvitePage ]';

class ContactInvitePage extends React.PureComponent {

    _keyExtractor = (item) => `${item.name}_`;

    renderItem = ({ item }) => {
        return null;
    }

    // When user has no contacts
    renderListEmptyComponent() {
        return (
            <EmptyResult text={'No contacts found'} style={{ paddingTop: 150 }} />
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ModalHeader 
                    title='Sync contacts'
                    actionText='Finish'
                    back
                    onAction={() => console.log(`${DEBUG_KEY}: Finished`)}
                    containerStyles={{
                        elevation: 3,
                        shadowColor: '#666',
                        shadowOffset: { width: 0, height: 1, },
                        shadowOpacity: 0.15,
                        shadowRadius: 3,
                        backgroundColor: APP_BLUE
                    }}
                    backButtonStyle={{
                        tintColor: '#21364C',
                    }}
                    actionTextStyle={{
                        color: '#21364C'
                    }}
                    titleTextStyle={{
                        color: '#21364C',
                    }}
                />
                <View style={{ flex: 1 }}>
                    <FlatList 
                        data={data}
                        renderItem={(item) => this.renderItem(item)}
                        numColumns={1}
                        keyExtractor={this._keyExtractor}
                        ListEmptyComponent={() => this.renderListEmptyComponent()}
                    />
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {

    return {

    };
};

export default connect(
    mapStateToProps,
    null
)(ContactInvitePage);