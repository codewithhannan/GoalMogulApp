/** @format */

import React, { Component } from 'react'
import { View, Text } from 'react-native'

/* Components */
import Card from './Card'

// TODO: use redux instead of passed in props
class ProfileAboutMeCard extends Component {
    render() {
        const { about } = this.props.data.profile
        if (!about) {
            return null
        }
        return (
            <Card>
                <View style={styles.containerStyle}>
                    <View style={styles.headerContainerStyle}>
                        <Text style={styles.titleTextStyle}>About Me</Text>
                    </View>
                    <View style={styles.detailContainerStyle}>
                        <Text stye={styles.detailTextStyle}>{about}</Text>
                    </View>
                </View>
            </Card>
        )
    }
}

const styles = {
    containerStyle: {
        display: 'flex',
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 15,
    },
    headerContainerStyle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 20,
    },
    titleTextStyle: {
        fontSize: 23,
        marginRight: 10,
    },
    occupationTextStyle: {
        fontSize: 15,
    },
    detailContainerStyle: {
        display: 'flex',
        minHeight: 60,
    },
    detailTextStyle: {
        fontSize: 20,
    },
}

export default ProfileAboutMeCard
