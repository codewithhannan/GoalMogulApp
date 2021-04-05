/** @format */

import React from 'react'
import { StyleSheet, View, Text, StatusBar } from 'react-native'
import DropdownAlert from 'react-native-dropdownalert-jia'

// State management
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'

// Reducers
import { persistor, store } from './src/store'

// Components
import { DropDownHolder } from './src//Main/Common/Modal/DropDownModal'

// Router
import Router from './src/Router'

import SocketIOManager from './src/socketio/SocketIOManager'
import LiveChatService from './src/socketio/services/LiveChatService'
import MessageStorageService from './src/services/chat/MessageStorageService'
import { initSegment } from './src/monitoring/segment'
import { initSentry } from './src/monitoring/sentry'

// UI theme provider
import ThemeProvider from './theme/ThemeProvider'
import { OnboardingAddPhotos } from './src/Main/Onboarding'
import { YellowBox } from 'react-native'
import PrivateGoalsNudge from './src/components/PrivateGoalsNudge'
import Popup from './src/Main/Journey/Popup'
import OnboardingInviteCode from './src/Main/Onboarding/OnboardingInviteCode'
import MessageToContactsModal from './src/Main/MeetTab/Modal/SendContactMessage'

// Disable font scaling at the start of the App
Text.defaultProps = Text.defaultProps || {}
Text.defaultProps.allowFontScaling = false

// Initialize Segment
initSegment()

// Initialize Sentry
initSentry()

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            appReady: false,
            image: null,
        }

        // must be initialized in this order as each depends on the previous
        SocketIOManager.initialize()
        LiveChatService.initialize()
        MessageStorageService.initialize()
        StatusBar.setBarStyle('light-content')
    }

    render() {
        console.disableYellowBox = true
        return (
            <ThemeProvider>
                <ReduxProvider store={store}>
                    <PersistGate persistor={persistor}>
                        <View style={styles.container}>
                            <Router />
                        </View>
                        <DropdownAlert
                            ref={(ref) => DropDownHolder.setDropDown(ref)}
                            closeInterval={7500}
                            containerStyle={styles.toastCustomContainerStyle}
                        />
                        {/* <OnboardingAddPhotos /> */}
                    </PersistGate>
                </ReduxProvider>
            </ThemeProvider>
            // <MessageToContactsModal />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    toastCustomContainerStyle: {
        backgroundColor: '#2B73B6',
    },
    // cancel button is currently not used
    cancelBtnImageStyle: {
        padding: 6,
        width: 30,
        height: 30,
        alignSelf: 'center',
    },
})
