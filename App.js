/** @format */

import React from 'react'

import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    Settings,
    Platform,
    AppState,
    Alert,
} from 'react-native'
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
import {
    initSegment,
    EVENT as E,
    track,
    trackWithProperties,
} from './src/monitoring/segment'

import { initSentry } from './src/monitoring/sentry'
import * as Linking from 'expo-linking'
import MultipleImagePicker from './src/Main/Menu/MutlipleImagePicker'
import EditModal from './src/Main/Accountability/EditModal'

import { setJSExceptionHandler } from 'react-native-exception-handler' // If an error occurs or app crashes these functions are called we used them to send sengments

// UI theme provider
import ThemeProvider from './theme/ThemeProvider'

// import CustomDropDown from './src/Main/Onboarding/Common/CustomDropdown'
// Disable font scaling at the start of the App
Text.defaultProps = Text.defaultProps || {}
Text.defaultProps.allowFontScaling = false

const DEBUG_KEY = '[APP ROOT]'

// Initialize Segment
initSegment()

// Initialize Sentry
// initSentry()

setJSExceptionHandler((error, isFatal) => {
    console.log(`${DEBUG_KEY} Error while doing the action`, error)
    trackWithProperties(E.ERROR_OCCURED, {
        error_name: error,
    })
}, true)

// setNativeExceptionHandler((errorString) => {
//     console.log('setNativeExceptionHandler')
// })

const prefix = Linking.makeUrl('/')

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            appReady: false,
            image: null,
            data: null,
        }

        // must be initialized in this order as each depends on the previous
        SocketIOManager.initialize()
        LiveChatService.initialize()
        MessageStorageService.initialize()
        StatusBar.setBarStyle('light-content')
    }

    // getInitialUrl = async () => {
    //     const initialUrl = await Linking.getInitialURL()
    //     console.log('THIS IS DATA OF INISITAL', initialUrl)
    //     if (initialUrl) this.setState({ data: Linking.parse(initialUrl) })
    // }

    // handleDeepLink = (event) => {
    //     let data = Linking.parse(event.url)
    //     this.setState({ data })
    // }

    // componentDidMount() {
    //     Linking.addEventListener('url', this.handleDeepLink)
    //     if (!this.state.data) {
    //         this.getInitialUrl()
    //     }
    // }

    // componentWillUnmount() {
    //     Linking.removeEventListener('url')
    // }

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
                    </PersistGate>
                </ReduxProvider>
            </ThemeProvider>
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
