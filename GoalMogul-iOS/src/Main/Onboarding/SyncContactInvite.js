import React from 'react';
import {
    View,
    Text,
    Dimensions,
    Image,
    FlatList
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { connect } from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import OnboardingHeader from './Common/OnboardingHeader';
import OnboardingFooter from './Common/OnboardingFooter';
import { BUTTON_STYLE as buttonStyle, TEXT_STYLE as textStyle } from '../../styles';
import { registrationTribeSelection } from '../../redux/modules/registration/RegistrationActions';
import { REGISTRATION_SYNC_CONTACT_NOTES } from '../../redux/modules/registration/RegistrationReducers';
import { TabView } from 'react-native-tab-view';
import TabButtonGroup from '../Common/TabButtonGroup';
import UserCard from './Common/UserCard';

/**
 * Sync Contact Invitation page
 * 
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 */
class SyncContactInvite extends React.Component {

    onBack = () => {

    }

    onNext = () => {

    }

    /**
     * Invite user.
     * // TODO: type might not be needed
     */
    inviteUser = (type) => (invite) => {

    }

    renderItem = (props, type, callback) => {
        // Render user card based on props and type. 
        // Callback is to invite and withdraw invitation
        // TODO: implement user card and hook up with the call. 
        return <UserCard {...props} {...type} callback={callback} />;
    }

    renderScene = ({ route }) => {
        switch (route.key) {
            case "matchedContacts":
                return (
                    <FlatList 
                        data={this.props.matchedContacts.data}
                        renderItem={(props) => this.renderUserCard(props, "matchedContacts", this.inviteUser("matchedContacts"))}
                        refresing={this.props.matchedContacts.refreshing}
                    />
                );
        
            case "contacts":
                return (
                    <FlatList 
                        data={this.props.contacts.data}
                        renderItem={(props) => this.renderUserCard(props, "contacts", this.inviteUser("matchedContacts"))}
                        refreshing={this.props.contacts.refreshing}
                    />
                );

            default: return null;
        }
    }

    renderTabs = (props) => {
        return (
            <TabButtonGroup
                buttons={props}
                buttonStyle={{
                    selected: {
                        backgroundColor: GM_BLUE,
                        tintColor: 'white',
                        color: 'white',
                        fontWeight: '700'
                    },
                    unselected: {
                        backgroundColor: '#FCFCFC',
                        tintColor: '#616161',
                        color: '#616161',
                        fontWeight: '600'
                    }
                }}
            />
        );
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                <OnboardingHeader />
                <View style={{ flex: 1, alignItems: "center", paddingLeft: 20, paddingRight: 20 }}>
                    <View style={{ marginTop: 35, marginBottom: 20 }}>
                        <Text style={textStyle.onboardingTitleTextStyle}>Add some friends or</Text>
                        <Text style={textStyle.onboardingTitleTextStyle}>invite friends to join!</Text>
                    </View>
                    <TabView 
                        navigationState={this.props.navigationState}
						renderScene={this._renderScene}
						renderTabBar={this._renderHeader}
						onIndexChange={this.props.selectChatMembersTab}
						useNativeDriver
                    />
                </View>
                <OnboardingFooter totalStep={4} currentStep={4} onNext={this.onNext} onPrev={this.onBack} />
            </View>  
        );
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: "white"
    }
};

const mapStateToProps = state => {

    return {
        contacts: state.contactSync.contacts,
        matchedContacts: state.registration.matchedContacts
    };
};

export default connect(
    mapStateToProps,
    {

    }
)(SyncContactInvite);