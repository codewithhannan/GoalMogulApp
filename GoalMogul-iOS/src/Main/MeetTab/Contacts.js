/**
 * NOTE: This is used in MeetTab and replaced by ContactSync from registration path
 *
 * @format
 */

import React, { Component } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

// Components
import MeetFilterBar from './MeetFilterBar'
import ContactCard from './Contacts/ContactCard'

// actions
import { handleRefresh, meetOnLoadMore, meetContactSync } from '../../actions'

// tab key
const key = 'contacts'
const DEBUG_KEY = '[ Component Contacts ]'

/* TODO: delete the test data */
const testData = [
    {
        name: 'Jia Zeng',
        _id: 1,
    },
]

class Contacts extends Component {
    componentDidMount() {
        this.handleRefresh()
    }

    _keyExtractor = (item) => item._id

    handleRefresh = () => {
        console.log(`${DEBUG_KEY} Refreshing tab: `, key)
        this.props.handleRefresh(key)
    }

    handleOnLoadMore = () => {
        console.log(`${DEBUG_KEY} Loading more for tab: `, key)
        this.props.meetOnLoadMore(key)
    }

    handleSyncContact = () => {
        this.props.meetContactSync(() => this.handleRefresh())
    }

    renderItem = ({ item }) => <ContactCard item={item} />

    renderSyncContact() {
        if (this.props.data === undefined || this.props.data.length === 0) {
            return (
                <View style={styles.labelContainerStyle}>
                    <Text style={styles.labelTextStyle}>
                        Find friends on GoalMogul.
                    </Text>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={this.handleSyncContact}
                    >
                        <Text style={styles.buttonTextStyle}>
                            Sync your contacts
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    render() {
        console.log(`${DEBUG_KEY}: data for contact is: `, this.props.contacts)
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={this.props.data}
                        renderItem={this.renderItem}
                        keyExtractor={this._keyExtractor}
                        onRefresh={this.handleRefresh}
                        refreshing={this.props.refreshing}
                        onEndReached={this.handleOnLoadMore}
                        onEndReachedThreshold={0}
                        ListEmptyComponent={this.renderSyncContact()}
                    />
                </View>
                {/*
          onEndReached={this.onLoadMore}
        */}
            </View>
        )
    }
}

const styles = {
    // Extract label color out
    labelContainerStyle: {
        flex: 1,
        marginTop: 20,
        marginBottom: 10,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    labelTextStyle: {
        fontWeight: '600',
        color: '#969696',
        fontSize: 13,
    },
    buttonTextStyle: {
        marginTop: 5,
        color: '#17B3EC',
        fontSize: 15,
    },
}

const mapStateToProps = (state) => {
    const { contacts } = state.meet
    const { data, refreshing } = contacts

    return {
        contacts,
        data,
        refreshing,
    }
}

export default connect(mapStateToProps, {
    handleRefresh,
    meetOnLoadMore,
    meetContactSync,
})(Contacts)
