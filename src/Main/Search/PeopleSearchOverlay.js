/**
 * This is a search overlay for user.
 * Currently, it's used in Invite friends for Tribe and Events
 *
 * @format
 */

import React, { Component } from 'react'
import { View, Platform, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import { SearchBar } from 'react-native-elements'
import { MenuProvider } from 'react-native-popup-menu'
import Constants from 'expo-constants'
import _ from 'lodash'

// Component
import BaseOverlay from './BaseOverlay'
import FriendsSearch from './People/FriendsSearch'

// Actions
import {
    handleSearch,
    clearSearchState,
} from '../../redux/modules/search/SearchActions'

import { inviteUserToTribe } from '../../redux/modules/tribe/MyTribeActions'

import { inviteParticipantToEvent } from '../../redux/modules/event/EventActions'

import { openProfile } from '../../actions'

// Constants
import { IPHONE_MODELS, DEVICE_MODEL } from '../../Utils/Constants'
import { SearchIcon } from '../../Utils/Icons'

const DEBUG_KEY = '[ People Search ]'
const SEARCH_TYPE = 'friends'

class PeopleSearchOverlay extends Component {
    constructor(props) {
        super(props)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleOnEndSubmitting = this.handleOnEndSubmitting.bind(this)
        this.state = {
            searchContent: undefined,
        }
    }

    handleOnResSelect = (_id) => {
        const { searchFor, callback } = this.props
        if (!searchFor) return this.props.openProfile(_id)
        const {
            type, // event or tribe
            id, // eventId or TribeId
        } = searchFor
        if (type === 'tribe' || type === 'myTribe') {
            // _id is invitee id
            return this.props.inviteUserToTribe(id, _id, callback)
        }
        if (type === 'event' || type === 'myEvent') {
            return this.props.inviteParticipantToEvent(id, _id, callback)
        }

        if (type === 'directChat' || type == 'addChatMember') {
            callback(_id)
            this.handleCancel()
            return
        }
    }

    handleOnEndSubmitting = ({ nativeEvent }) => {
        const { text, eventCount, taget } = nativeEvent
        // Close the search modal if nothing is entered
        if (
            text === undefined ||
            text === null ||
            text === '' ||
            text.trim() === ''
        ) {
            this.handleCancel()
        }
    }

    // Search bar functions
    handleCancel = () => {
        //TODO: potentially clear search state
        console.log(`${DEBUG_KEY} handle cancel`)
        this.props.clearSearchState()
        // Actions.pop();
        this.refs.baseOverlay.closeModal()
    }

    handleChangeText = (value) => {
        if (value === undefined) {
            return
        }

        this.setState(
            {
                ...this.state,
                searchContent: value,
            },
            () => {
                if (value === '') {
                    return this.props.clearSearchState(SEARCH_TYPE)
                }
                this.props.debouncedSearch(value.trim(), SEARCH_TYPE)
            }
        )
    }

    render() {
        const searchPlaceHolder = this.props.searchPlaceHolder
            ? this.props.searchPlaceHolder
            : 'Search a person'

        const marginTop =
            Platform.OS === 'ios' && IPHONE_MODELS.includes(DEVICE_MODEL)
                ? 20
                : 30

        return (
            <BaseOverlay
                verticalPercent={1}
                horizontalPercent={1}
                ref="baseOverlay"
            >
                <MenuProvider
                    customStyles={{ backdrop: styles.backdrop }}
                    skipInstanceCheck={true}
                >
                    <KeyboardAvoidingView
                        behavior="padding"
                        style={{ flex: 1 }}
                        enabled
                    >
                        <View
                            style={{
                                ...styles.headerContainerStyle,
                                marginTop,
                            }}
                        >
                            <SearchBar
                                platform="ios"
                                round
                                autoFocus
                                searchIcon={
                                    <SearchIcon
                                        iconContainerStyle={{
                                            marginBottom: 3,
                                            marginTop: 1,
                                        }}
                                        iconStyle={{
                                            tintColor: '#17B3EC',
                                            height: 15,
                                            width: 15,
                                        }}
                                    />
                                }
                                inputStyle={styles.searchInputStyle}
                                inputContainerStyle={
                                    styles.searchInputContainerStyle
                                }
                                containerStyle={styles.searchContainerStyle}
                                placeholder={searchPlaceHolder}
                                cancelButtonTitle="Cancel"
                                onCancel={this.handleCancel}
                                onChangeText={this.handleChangeText}
                                clearIcon={null}
                                cancelButtonProps={{ color: '#17B3EC' }}
                                showLoading={this.props.loading}
                                onSubmitEditing={this.handleOnEndSubmitting}
                                value={this.state.searchContent}
                            />
                        </View>
                        <FriendsSearch
                            reducerPath=""
                            onSelect={this.handleOnResSelect}
                            {...this.props}
                        />
                    </KeyboardAvoidingView>
                </MenuProvider>
            </BaseOverlay>
        )
    }
}

const styles = {
    searchContainerStyle: {
        padding: 0,
        marginRight: 3,
        backgroundColor: '#ffffff',
        borderTopColor: '#ffffff',
        borderBottomColor: '#ffffff',
        alignItems: 'center',
    },
    searchInputContainerStyle: {
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchInputStyle: {
        fontSize: 15,
    },
    headerContainerStyle: {
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.7,
    },
}

const mapStateToProps = (state) => {
    const { selectedTab, navigationState } = state.search
    const { loading } = state.search.friends

    return {
        selectedTab,
        navigationState,
        loading,
    }
}

const mapDispatchToProps = (dispatch) => {
    const debouncedSearch = _.debounce(
        (value, type) => dispatch(handleSearch(value, type)),
        400
    )

    return {
        debouncedSearch,
        clearSearchState: clearSearchState(dispatch),
        inviteParticipantToEvent: (eventId, inviteeId, callback) =>
            dispatch(inviteParticipantToEvent(eventId, inviteeId, callback)),
        openProfile: (userId) => dispatch(openProfile(userId)),
        inviteUserToTribe: (tribeId, inviteeId) =>
            dispatch(inviteUserToTribe(tribeId, inviteeId)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
    // {
    //   ...mapDispatchToProps,
    //   inviteUserToTribe,
    //   openProfile,
    //   inviteParticipantToEvent
    // }
)(PeopleSearchOverlay)
