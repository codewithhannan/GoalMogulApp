/** @format */

import React from 'react'
import { View } from 'react-native'

const ContactCard = (props) => {
    return <View style={styles.containerStyle}>{props.children}</View>
}

const styles = {
    containerStyle: {
        height: 50,
        flex: 1,
        flexDirection: 'row',
        // borderColor: '#eaeaea',
        // borderBottomWidth: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
}

export default ContactCard
