/** @format */

import React from 'react'
import { View, Text, FlatList } from 'react-native'
import _ from 'lodash'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import OnboardingHeader from './Common/OnboardingHeader'
import OnboardingFooter from './Common/OnboardingFooter'
import {
    BUTTON_STYLE as buttonStyle,
    TEXT_STYLE as textStyle,
    GM_BLUE,
    GM_FONT_SIZE,
    FONT_FAMILY_2,
} from '../../styles'
import { inviteExistingUser } from '../../redux/modules/registration/RegistrationActions'
import { inviteUser } from '../../redux/modules/User/ContactSync/ContactSyncActions'
import { TabView } from 'react-native-tab-view'
import TabButtonGroup from '../Common/TabButtonGroup'
import UserCard from './Common/UserCard'

/**
 * Sync Contact Invitation page
 *
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 */
class SyncContactInvite extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // navigationState should be state to the page
            navigationState: {
                index: 0,
                routes: [
                    { key: 'matchedContacts', title: 'On GoalMogul' },
                    { key: 'contacts', title: 'Not on GoalMogul' },
                ],
            },
        }
    }

    _keyExtractor = (item, index) => `${item.name}_${index}`

    switchTab = (index) => {
        let navigationState = _.cloneDeep(this.state.navigationState)
        navigationState = _.set(navigationState, 'index', index)

        this.setState({
            ...this.state,
            navigationState,
        })
    }

    onBack = () => {
        Actions.pop()
    }

    onNext = () => {
        Actions.push('registration_transition')
    }

    /**
     * Invite user.
     * // TODO: type might not be needed
     */
    inviteUser = (type) => (item) => {
        if (type == 'contacts') {
            this.props.inviteUser(item)
            return
        }

        if (type == 'matchedContacts') {
            // Send friend request
            this.props.inviteExistingUser(item._id)
            return
        }

        // TODO: add sentry logging
    }

    renderUserCard = (props, type, callback) => {
        // Render user card based on props and type.
        // Callback is to invite and withdraw invitation
        return <UserCard {...props} type={type} callback={callback} />
    }

    renderScene = ({ route }) => {
        switch (route.key) {
            case 'matchedContacts':
                return (
                    <FlatList
                        data={this.props.matchedContacts.data}
                        renderItem={(props) =>
                            this.renderUserCard(
                                props,
                                'matchedContacts',
                                this.inviteUser('matchedContacts')
                            )
                        }
                        keyExtractor={this._keyExtractor}
                        refresing={this.props.matchedContacts.refreshing}
                    />
                )

            case 'contacts':
                return (
                    <FlatList
                        data={this.props.contacts.data}
                        renderItem={(props) =>
                            this.renderUserCard(
                                props,
                                'contacts',
                                this.inviteUser('contacts')
                            )
                        }
                        keyExtractor={this._keyExtractor}
                        refreshing={this.props.contacts.refreshing}
                    />
                )

            default:
                return null
        }
    }

    renderTabs = (props) => {
        return (
            <View
                style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    backgroundColor: 'white',
                    paddingBottom: 10,
                    marginBottom: 10,
                }}
            >
                <TabButtonGroup
                    buttons={props}
                    buttonStyle={{
                        selected: {
                            backgroundColor: GM_BLUE,
                            tintColor: 'white',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: GM_FONT_SIZE.FONT_2,
                            fontFamily: FONT_FAMILY_2,
                        },
                        unselected: {
                            backgroundColor: '#F2F2F2',
                            tintColor: '#828282',
                            color: '#828282',
                            fontWeight: '600',
                            fontSize: GM_FONT_SIZE.FONT_2,
                            fontFamily: FONT_FAMILY_2,
                        },
                    }}
                    buttonGroupContainerStyle={{
                        marginLeft: 20,
                        marginRight: 20,
                    }}
                    borderRadius={15}
                />
            </View>
        )
    }

    render() {
        const { inviteOnly } = this.props
        return (
            <View style={styles.containerStyle}>
                <OnboardingHeader />
                <View style={{ flex: 1, backgroundColor: '#EAE8EA' }}>
                    <View
                        style={{
                            paddingTop: 20,
                            paddingBottom: 20,
                            backgroundColor: 'white',
                        }}
                    >
                        {inviteOnly ? (
                            <Text style={textStyle.onboardingTitleTextStyle}>
                                Invite friends to join!
                            </Text>
                        ) : (
                            [
                                <Text
                                    style={textStyle.onboardingTitleTextStyle}
                                >
                                    Add some friends or
                                </Text>,
                                <Text
                                    style={textStyle.onboardingTitleTextStyle}
                                >
                                    invite friends to join!
                                </Text>,
                            ]
                        )}
                    </View>
                    {inviteOnly ? (
                        // Render user contact cards only for invitation
                        <FlatList
                            data={this.props.contacts.data}
                            renderItem={(props) =>
                                this.renderUserCard(
                                    props,
                                    'contacts',
                                    this.inviteUser('contacts')
                                )
                            }
                            contentContainerStyle={{ marginTop: 20 }}
                        />
                    ) : (
                        <TabView
                            navigationState={this.state.navigationState}
                            renderScene={this.renderScene}
                            renderTabBar={this.renderTabs}
                            onIndexChange={this.switchTab}
                            useNativeDriver
                        />
                    )}
                </View>
                <OnboardingFooter
                    totalStep={0}
                    currentStep={0}
                    onNext={this.onNext}
                    onPrev={this.onBack}
                />
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: 'white',
    },
}

const mapStateToProps = (state) => {
    return {
        contacts: state.contactSync.contacts || testContacts,
        matchedContacts:
            state.registration.matchedContacts || testMatchedContacts,
        // contacts: testContacts,
        // matchedContacts: testMatchedContacts,
    }
}

const testContacts = {
    data: [
        {
            name: 'Jia Zeng',
            phoneNumbers: [{ label: 'mobile', number: '9194912504' }],
        },
        {
            name: 'Jay Patel',
            phoneNumbers: [{ label: 'mobile', number: '9194912504' }],
        },
    ],
}

const testMatchedContacts = {
    data: [
        {
            name: 'Jia Zeng',
            headline: 'I am so cool',
            maybeInvitationType: '',
            maybeInvitationId: '',
            profile: {},
        },
    ],
}

export default connect(mapStateToProps, {
    inviteUser,
    inviteExistingUser,
})(SyncContactInvite)
