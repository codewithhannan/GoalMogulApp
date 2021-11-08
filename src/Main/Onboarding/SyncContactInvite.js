/** @format */

import React from 'react'
import { View, Text, FlatList } from 'react-native'
import _ from 'lodash'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import OnboardingHeader from './Common/OnboardingHeader'
import OnboardingFooter from './Common/OnboardingFooter'

import { default_style, color } from '../../styles/basic'
import OnboardingStyles from '../../styles/Onboarding'

import { inviteExistingUser } from '../../redux/modules/registration/RegistrationActions'
import { inviteUser } from '../../redux/modules/User/ContactSync/ContactSyncActions'
import { TabView } from 'react-native-tab-view'
import TabButtonGroup from '../Common/TabButtonGroup'
import UserCard from './Common/UserCard'
import { contactSyncLoadMore } from '../../actions'
import { EVENT as E } from '../../monitoring/segment'

const { text: textStyle } = OnboardingStyles
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
                index: props.inviteOnly ? 1 : 0,
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
        const { navigateToHome } = this.props

        if (navigateToHome) {
            return Actions.replace('drawer')
        } else {
            return Actions.push('registration_community_guideline')
        }
    }

    /**
     * Invite user.
     * // TODO: type might not be needed
     */
    inviteUser = (type) => (item) => {
        if (type == 'contacts') {
            this.props.inviteUser(
                item,
                E.REG_CONTACT_INVITE_CLICKED,
                E.REG_CONTACT_INTIVE_SENT
            )
            return
        }

        if (type == 'matchedContacts') {
            // Send friend request
            this.props.inviteExistingUser(item._id, E.REG_CONTACT_MEMBER_ADDED)
            return
        }

        // TODO: add sentry logging
    }

    renderEmptyMatchedContacts = () => {
        return (
            <View style={{ paddingTop: 50, alignItems: 'center' }}>
                <Text style={[default_style.goalTitleText_1]}>
                    No matched contacts found
                </Text>
            </View>
        )
    }

    renderUserCard = (props, type, callback) => {
        // Render user card based on props and type.
        // Callback is to invite and withdraw invitation
        return <UserCard {...props} type={type} callback={callback} />
    }

    renderScene = ({ route }) => {
        switch (route.key) {
            case 'matchedContacts':
                // Render matched contacts
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
                        onEndThreshold={0}
                        onEndReached={() => this.props.contactSyncLoadMore()}
                        ListEmptyComponent={this.renderEmptyMatchedContacts}
                    />
                )

            case 'contacts':
                // Render contacts
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
                    paddingLeft: 12,
                    paddingRight: 12,
                    backgroundColor: color.GM_CARD_BACKGROUND,
                    paddingBottom: 2,
                    marginBottom: 10,
                }}
            >
                <TabButtonGroup buttons={props} />
            </View>
        )
    }

    render() {
        const { inviteOnly } = this.props

        console.log('THIS IS PROPSSS', this.props)
        return (
            <View style={styles.containerStyle}>
                <OnboardingHeader />
                <View style={{ flex: 1, backgroundColor: '#EAE8EA' }}>
                    <View
                        style={{
                            paddingTop: 20,
                            paddingBottom: 12,
                            backgroundColor: color.GM_CARD_BACKGROUND,
                        }}
                    >
                        {inviteOnly ? (
                            <Text style={[textStyle.title]}>
                                Invite friends to join!
                            </Text>
                        ) : (
                            [
                                <Text style={textStyle.title}>
                                    Add some friends or
                                </Text>,
                                <Text style={textStyle.title}>
                                    invite friends to join!
                                </Text>,
                            ]
                        )}
                    </View>
                    <TabView
                        navigationState={this.state.navigationState}
                        renderScene={this.renderScene}
                        renderTabBar={this.renderTabs}
                        onIndexChange={this.switchTab}
                        useNativeDriver
                    />
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
    const { userId } = state.user

    return {
        // NOTE: local contacts are fired by callback of
        // redux/modules/registration/RegistrationActions#uploadContacts
        // "loadContactCallback"
        // It will store the local contacts in ContactSyncReducer
        // As future improvement, we should refactor both into one places
        // for registration + meet tab loading contacts
        contacts: state.contactSync.contacts,
        matchedContacts: state.registration.matchedContacts,
        userId,
    }
}

export default connect(mapStateToProps, {
    inviteUser,
    inviteExistingUser,
    contactSyncLoadMore,
})(SyncContactInvite)
