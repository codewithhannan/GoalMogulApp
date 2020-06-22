/** @format */

import React, { Component } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

/* Component */
import Content from './Content'
import Timestamp from './Timestamp'
import Headline from './Headline'

class ContentContainer extends Component {
    render() {
        return (
            <View style={styles.containerStyle}>
                <Headline name="John Doe" category="Personal Development" />
                <Timestamp time="5 mins ago" />
                <Content content="Read 100 books" />
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        marginTop: 2,
        marginLeft: 14,
        marginRight: 10,
        flex: 1,
    },
}

export default ContentContainer
