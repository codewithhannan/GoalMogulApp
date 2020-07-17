/**
 * Right now we decide to move the fb plug in for connect with messenger to web
 * This is for legacy reference in case we need to plug this in later on
 *
 * @format
 */

import React from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

const APP_ID = '543421933041871'
const PAGE_ID = '391422631718856'

class OnboardingFbPlugin extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
        }
    }

    onMessage = (message) => {
        console.log('message is:', message)
        console.log('data is:', message.nativeEvent.data)
        // const data = message.nativeEvent.data;
        // console.log("data 1: ", data.state)

        // if (Array.isArray(data)) {
        //     data.map(d => console.log(d));
        // }
    }

    getWebviewContent() {
        const userId = '5b82f41b15f7df001aa03633'
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
                        fb-messenger-checkbox {
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

                        function confirmOptIn() {
                            FB.AppEvents.logEvent('MessengerCheckboxUserConfirmation', null, {
                              'app_id':${APP_ID},
                              'page_id':${PAGE_ID},
                              'ref':'',
                              'user_ref':${userId}
                            });
                        }
                    </script>
                    <script>
                        window.fbAsyncInit = function() {
                            FB.init({
                                appId            : ${APP_ID},
                                autoLogAppEvents : true,
                                xfbml            : true,
                                version          : 'v7.0'
                            });

                            FB.Event.subscribe('messenger_checkbox', function(e) {
                                window.ReactNativeWebView.postMessage("messenger_checkbox event");
                                window.ReactNativeWebView.postMessage(e);
                                
                                if (e.event == 'rendered') {
                                    window.ReactNativeWebView.postMessage("Plugin was rendered");
                                } else if (e.event == 'checkbox') {
                                    var checkboxState = e.state;
                                    window.ReactNativeWebView.postMessage("Checkbox state: " + checkboxState);
                                } else if (e.event == 'not_you') {
                                    window.ReactNativeWebView.postMessage("User clicked 'not you'");
                                } else if (e.event == 'hidden') {
                                    window.ReactNativeWebView.postMessage("Plugin was hidden");
                                    window.ReactNativeWebView.postMessage("state: " + e.state);
                                }
                                
                            });
                        };
                    </script>
                    
                    <script async defer src="https://connect.facebook.net/en_US/sdk.js"></script>
                </head>
                <body> 
                    <div>this si adlkfj a;lskdjf ;laksjdf;lak sl;</div>
                    <div>this si adlkfj a;lskdjf ;laksjdf;lak sl;</div>
                    <div class="fb-messenger-checkbox"  
                        origin="https://1f9d6e690468.ngrok.io/"
                        page_id="${PAGE_ID}"
                        messenger_app_id="${APP_ID}"
                        user_ref=${userId}
                        allow_login="true"
                        size="standard"
                        skin="dark"
                        center_align="true">
                    </div>
                    <div>hi</div>
                    <input type="button" onclick="confirmOptIn()" value="Confirm Opt-in"/>
                </body>
            </html>`

        return originalForm
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <WebView
                    javaScriptEnabled={true}
                    mixedContentMode={'always'}
                    style={{ flex: 1, backgroundColor: 'transparent' }}
                    source={{
                        html: this.getWebviewContent(),
                        baseUrl: 'https://goalmogul.com', // <-- SET YOUR DOMAIN HERE
                    }}
                    // source={{ uri: "https://"}}
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
        )
    }
}

export default OnboardingFbPlugin
