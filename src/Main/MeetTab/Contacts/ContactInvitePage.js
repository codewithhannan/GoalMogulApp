/**
 * NOTE: This is the second step in MeetTabV2 sync contact. It allows user to send
 * Invite to the contacts that are not currently using the app
 *
 * @format
 */

import React from 'react'
import { FlatList, View } from 'react-native'
import { connect } from 'react-redux'
import ModalHeader from '../../Common/Header/ModalHeader'
import { color } from '../../../styles/basic'
import EmptyResult from '../../Common/Text/EmptyResult'
import { Actions } from 'react-native-router-flux'
import ContactInviteCard from './ContactInviteCard'

const DEBUG_KEY = '[ UI ContactInvitePage ]'

class ContactInvitePage extends React.PureComponent {
    renderItemSeparator = () => {
        return (
            <View
                style={{ width: '100%', height: 0.5, backgroundColor: '#eee' }}
            />
        )
    }

    _keyExtractor = (item) => item.id

    renderItem = ({ item, index }) => {
        return <ContactInviteCard contact={item} />
    }

    // When user has no contacts
    renderListEmptyComponent() {
        return (
            <EmptyResult
                text={'No contacts found'}
                style={{ paddingTop: 150 }}
            />
        )
    }

    render() {
        const { data } = this.props
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <ModalHeader
                    title="Sync contacts"
                    actionText="Finish"
                    back
                    onCancel={() => Actions.pop()}
                    onAction={() => Actions.popTo('meet')}
                    containerStyles={{
                        elevation: 3,
                        shadowColor: '#666',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.15,
                        shadowRadius: 3,
                        backgroundColor: color.GM_BLUE,
                    }}
                    backButtonStyle={{
                        tintColor: '#21364C',
                    }}
                    actionTextStyle={{
                        color: '#21364C',
                    }}
                    titleTextStyle={{
                        color: '#21364C',
                    }}
                />
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={data}
                        renderItem={(item) => this.renderItem(item)}
                        ItemSeparatorComponent={this.renderItemSeparator}
                        numColumns={1}
                        keyExtractor={this._keyExtractor}
                        ListEmptyComponent={() =>
                            this.renderListEmptyComponent()
                        }
                    />
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { data } = state.contactSync.contacts

    return {
        data,
    }
}

export default connect(mapStateToProps, null)(ContactInvitePage)
