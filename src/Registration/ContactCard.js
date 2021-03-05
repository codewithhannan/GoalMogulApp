/** @format */

import React from 'react'
import { View } from 'react-native'

const ContactCard = (props) => {
    return <View style={styles.containerStyle}>{props.children}</View>
}

const styles = {
    containerStyle: {
        minHeight: 50,
        flex: 1,
        flexDirection: 'row',
        borderColor: '#eaeaea',
        borderBottomWidth: 1,
        alignItems: 'center',
    },
}

export default ContactCard
