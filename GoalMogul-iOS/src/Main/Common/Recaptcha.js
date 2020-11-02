/** @format */

import React, { Component } from 'react'
import { View, Platform } from 'react-native'
import { WebView } from 'react-native-webview'
import Constants from 'expo-constants'
import Modal from 'react-native-modal'
import ConfirmGoogleCaptcha from 'react-native-google-recaptcha-v2'
import { SentryRequestBuilder } from '../../monitoring/sentry'
import {
    SENTRY_TAGS,
    SENTRY_MESSAGE_LEVEL,
} from '../../monitoring/sentry/Constants'
import getEnvVars from '../../../environment'

const DEBUG_KEY = '[Recaptcha]'
const { GOOGLE_RECAPTCHA_KEY } = getEnvVars()

class Recaptcha extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
        }
    }

    closeModal() {
        this.setState({
            ...this.state,
            loaded: false,
        })
        this.props.closeModal && this.props.closeModal()
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.showRecaptcha &&
            Platform.OS === 'android' &&
            this.captchaForm !== undefined
        ) {
            this.captchaForm.show()
            return
        }
    }

    onMessage = (event) => {
        if (event && event.nativeEvent.data) {
            if (event.nativeEvent.data == 'close') {
                if (Platform.OS === 'android') {
                    this.captchaForm.hide()
                }
                this.closeModal()
                return
            }

            if (
                ['cancel', 'error', 'expired'].includes(event.nativeEvent.data)
            ) {
                let message = `${DEBUG_KEY} returns ${event.nativeEvent.data}`
                new SentryRequestBuilder(message)
                    .withTag(SENTRY_TAGS.GOOGLE_SERVIVE, 'Recaptcha')
                    .withLevel(SENTRY_MESSAGE_LEVEL.INFO)
                    .send()
                if (Platform.OS === 'android') {
                    this.captchaForm.hide()
                }
                return
            } else {
                if (Platform.OS === 'android') {
                    this.captchaForm.hide()
                }

                if (this.props.onSuccess) {
                    this.props.onSuccess()
                }
            }
        }
    }

    getWebviewContent() {
        var originalForm = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta name="viewport" content="initial-scale=1.2, maximum-scale=1.2">
                    <style>
                        body {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-direction: column;
                            background-color: transparent;
                        }
                        g-recaptcha {
                            display: inline-block;
                            padding-top: 100;
                        }
                    </style>
                    <script type="text/javascript"> 
                        window.onDataCallback = function onDataCallback(response) { 
                            window.ReactNativeWebView.postMessage(response)
                        };  
                        window.onDataExpiredCallback = function(error) {  window.ReactNativeWebView.postMessage("expired"); };  
                        window.onDataErrorCallback = function(error) {  window.ReactNativeWebView.postMessage("error"); }
                        window.onCloseCallback = function(message) { window.ReactNativeWebView.postMessage("close"); }
                    </script>
                    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
                </head>
                <body>
                    
                    <div id="g-recaptcha" class="g-recaptcha"
                        data-sitekey="${GOOGLE_RECAPTCHA_KEY}"
                        data-callback="onDataCallback"  
                        data-expired-callback="onDataExpiredCallback"  
                        data-error-callback="onDataErrorCallback"
                        data-badge="inline">
                    </div>
                    <div style="width: 100vw; height: 100vh;" onclick="onCloseCallback();"></div>
                </body>
            </html>`

        return originalForm
    }

    render() {
        if (Platform.OS === 'android') {
            return (
                <ConfirmGoogleCaptcha
                    ref={(_ref) => (this.captchaForm = _ref)}
                    siteKey={GOOGLE_RECAPTCHA_KEY}
                    baseUrl="https://goalmogul.com"
                    languageCode="en"
                    onMessage={this.onMessage}
                />
            )
        }
        return (
            <Modal
                style={{
                    flex: 1,
                    marginTop: Constants.statusBarHeight + 15,
                    backgroundColor: 'transparent',
                    marginHorizontal: 0,
                    marginBottom: 0,
                }}
                isVisible={this.props.showRecaptcha}
                // isVisible
                animationIn="fadeIn"
                animationOut="fadeOut"
                useNativeDriver
                customBackdrop={
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'black',
                            opacity: 0.3,
                        }}
                    />
                }
            >
                <View style={{ flex: 1, opacity: this.state.loaded ? 1 : 0 }}>
                    <WebView
                        javaScriptEnabled={true}
                        mixedContentMode={'always'}
                        style={{ flex: 1, backgroundColor: 'transparent' }}
                        source={{
                            html: this.getWebviewContent(),
                            baseUrl: 'https://goalmogul.com', // <-- SET YOUR DOMAIN HERE
                        }}
                        onMessage={this.onMessage}
                        bounces={false}
                        scrollEnabled={false}
                        onLoadEnd={(e) => {
                            if (!this.state.loaded) {
                                // Wait for WebView to be fully loaded and converted to transparent.
                                // Otherwise, it will be a white glitch.
                                setTimeout(() => {
                                    this.setState({ loaded: true })
                                }, 100)
                            }
                        }}
                    />
                </View>
            </Modal>
        )
    }
}

export default Recaptcha
