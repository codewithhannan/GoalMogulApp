/**
 * NOTE: This file is deprecated and replaced by Input.js
 *
 * @format
 */

import React, { Component } from 'react'
import { View, TextInput, Dimensions } from 'react-native'

import { connect } from 'react-redux'

const window = Dimensions.get('window')

class InputField extends Component {
    constructor(props) {
        super(props)

        this.state = {
            textInputStyle: { ...styles.textInputStyle },
            containerStyle: { ...styles.containerStyle },
        }
    }

    renderOnFocus = () => {
        const textInputStyle = { ...this.state.textInputStyle }
        textInputStyle.fontSize = 18
        this.setState({
            textInputStyle,
        })
    }

    renderOnBlur = () => {
        const textInputStyle = { ...this.state.textInputStyle }
        textInputStyle.fontSize = 18
        this.setState({
            textInputStyle,
        })
    }

    render() {
        const textInputStyle = { ...this.state.textInputStyle }
        const containerStyle = { ...this.state.containerStyle }
        let placeholderTextColor = '#eaeaea'
        if (this.props.value !== '') {
            containerStyle.borderColor = '#34c0dd'
        }

        if (this.props.error) {
            containerStyle.borderColor = '#ff0033'
            placeholderTextColor = '#ff0033'
        }
        return (
            <View style={containerStyle}>
                <TextInput
                    style={textInputStyle}
                    placeholder={this.props.placeholder}
                    secureTextEntry={this.props.secureTextEntry}
                    onChangeText={this.props.onChange}
                    returnKeyType="done"
                    value={this.props.value}
                    onFocus={this.renderOnFocus}
                    onBlur={this.renderOnBlur}
                    autoCorrect={false}
                    placeholderTextColor={placeholderTextColor}
                    clearButtonMode="while-editing"
                    textContentType={this.props.textContentType}
                />
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        borderBottomWidth: 2,
        marginLeft: 18,
        marginRight: 18,
        marginBottom: 10,
        justifyContent: 'center',
        borderColor: '#eaeaea',
        height: 45,
    },
    textInputStyle: {
        fontSize: 18,
        paddingLeft: 18,
        paddingRight: 18,
        paddingBottom: 5,
        paddingTop: 5,
    },
}

export default connect(null, null)(InputField)
