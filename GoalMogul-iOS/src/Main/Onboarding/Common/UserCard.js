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

/**
 * Sync Contact related user card. This card has two modes. 
 * 1. User already on GM
 * 2. User 
 * 
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 */
class UserCard extends React.Component {


}

export default UserCard;