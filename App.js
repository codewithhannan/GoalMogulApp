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
import { enableScreens } from 'react-native-screens'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import 'react-native-reanimated'
import DeepLinking from 'react-native-deep-linking'

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
import CustomDropdown from './CustomDropDown'
import { color } from './src/styles/basic'

// import CustomDropDown from './src/Main/Onboarding/Common/CustomDropdown'
// Disable font scaling at the start of the App
Text.defaultProps = Text.defaultProps || {}
Text.defaultProps.allowFontScaling = false

const DEBUG_KEY = '[APP ROOT]'

if (!__DEV__) {
    enableScreens()
}

// Initialize Segment
initSegment()

// Initialize Sentry
initSentry()

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
let scheme = 'goalmogulapp'

const theme = {
    ...DefaultTheme,
    dark: true,
    colors: {
        ...DefaultTheme.colors,
        primary: color.GM_BLUE,
        accent: 'red',
        text: 'rgba(0, 141, 200, 1)',
    },
}

export default class App extends React.Component {
    constructor(props) {
        super(props)
        // this.handleOpenURL = this.handleOpenURL.bind(this)
        this.state = {
            appReady: false,
            image: null,
            data: null,
            response: {},
        }

        // must be initialized in this order as each depends on the previous
        SocketIOManager.initialize()
        LiveChatService.initialize()
        MessageStorageService.initialize()
        StatusBar.setBarStyle('light-content')
    }

    // componentDidMount() {
    //     Linking.getInitialURL()
    //         .then((url) => this.handleOpenURL({ url }))
    //         .catch(console.error)

    //     Linking.addEventListener('url', this.handleOpenURL)
    // }

    // componentWillUnmount() {
    //     Linking.removeEventListener('url', this.handleOpenURL)
    // }

    // handleOpenURL(event) {
    //     Alert.alert(event.url)
    // }

    render() {
        console.disableYellowBox = true
        enableScreens(false)
        return (
            // <View
            //     style={{
            //         flex: 1,
            //         justifyContent: 'center',
            //         alignItems: 'center',
            //     }}
            // >
            //     <Text style={{ color: 'blue', fontSize: 20 }}>GOALMOGUL</Text>
            // </View>
            <ThemeProvider>
                <ReduxProvider store={store}>
                    <PersistGate persistor={persistor}>
                        <View style={styles.container}>
                            <Router />
                            {/* <PaperProvider theme={theme}>
                                <CustomDropdown />
                            </PaperProvider> */}
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
