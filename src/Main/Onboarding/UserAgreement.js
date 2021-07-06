/**
 * This file is to fulfill Apple review requirement to provide user agreement
 * upon signup and login
 *
 * @format
 */

import React from 'react'
import { View, Dimensions } from 'react-native'
import { WebView } from 'react-native-webview'
import { TERMS_OF_SERVICE_URL } from '../../Utils/Constants'
import OnboardingHeader from './Common/OnboardingHeader'

class UserAgreement extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
        }
    }

    render() {
        const { width } = Dimensions.get('window')
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <OnboardingHeader />
                <WebView
                    javaScriptEnabled={true}
                    scalesPageToFit={true}
                    mixedContentMode={'always'}
                    style={{
                        flex: 1,
                        overflow: 'hidden',
                        resizeMode: 'cover',
                    }}
                    source={{ uri: TERMS_OF_SERVICE_URL }}
                    bounces={false}
                    scrollEnabled
                    showsHorizontalScrollIndicator={false}
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

export default UserAgreement
