/** @format */

import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'

/* Components */
import Header from './Common/Header'
import Button from './Common/Button'
import Divider from './Common/Divider'
import AddingProfilePicture from './Common/AddingProfilePicture'

/* Styles */
import Styles from './Styles'

/* Actions */
import { registrationNextIntro } from '../actions'
import DelayedButton from '../Main/Common/Button/DelayedButton'

class AddProfilePic extends Component {
    handleNextOnPressed() {
        this.props.registrationNextIntro(false)
    }

    handleSkipOnPressed() {
        console.log('skip on pressed callign action')
        this.props.registrationNextIntro(true)
    }

    render() {
        return (
            <View style={Styles.containerStyle}>
                <Header
                    name={this.props.name}
                    type="profile"
                    hasBackButton={false}
                />
                <View style={Styles.bodyContainerStyle}>
                    <Text style={Styles.titleTextStyle}>Upload a picture</Text>
                    <View style={{ alignSelf: 'center' }}>
                        <Divider
                            horizontal
                            width={250}
                            borderBottomWidth={2}
                            color="#f4f4f4"
                        />
                    </View>
                    <Text style={Styles.explanationTextStyle}>
                        It helps your friends identify you
                    </Text>
                    <AddingProfilePicture />
                    <DelayedButton
                        activeOpacity={0.6}
                        onPress={this.handleNextOnPressed.bind(this)}
                    >
                        <View>
                            <Button text="Next" />
                        </View>
                    </DelayedButton>
                    <DelayedButton
                        activeOpacity={0.6}
                        onPress={this.handleSkipOnPressed.bind(this)}
                    >
                        <View>
                            <Button text="Skip" arrow />
                        </View>
                    </DelayedButton>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { name } = state.registration
    return {
        name,
    }
}

export default connect(mapStateToProps, { registrationNextIntro })(
    AddProfilePic
)
