/** @format */

import CountryPicker from 'react-native-country-picker-modal'
import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    PixelRatio,
    StatusBarIOS,
    Image,
} from 'react-native'

export default class Example extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cca2: 'US',
            withFilter: true,
            withFlagButton: true,
            withFlag: true,
            withEmoji: true,
            withModal: true,
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Welcome to Country Picker !</Text>
                <CountryPicker
                    onSelect={(value) =>
                        this.setState({ country: value, cca2: value.cca2 })
                    }
                    cca2={this.state.cca2}
                    withFilter={this.state.withFilter}
                    withFlagButton={this.state.withFlagButton}
                    withFlag={this.state.withFlag}
                    withEmoji={this.state.withEmoji}
                    withModal={this.state.withModal}
                    countryCode={this.state.cca2}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        fontSize: 12,
        textAlign: 'center',
        color: '#888',
        marginBottom: 5,
    },
    data: {
        padding: 15,
        marginTop: 10,
        backgroundColor: '#ddd',
        borderColor: '#888',
        borderWidth: 1 / PixelRatio.get(),
        color: '#777',
    },
})
