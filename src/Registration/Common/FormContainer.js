/** @format */

import React from 'react'
import { View } from 'react-native'

const FormContainer = (props) => {
    return <View style={styles.formContainer}>{props.children}</View>
}

const styles = {
    formContainer: {
        display: 'flex',
        borderWidth: 2,
        borderColor: '#eaeaea',
        marginBottom: 12,
        marginRight: 18,
        marginLeft: 18,
    },
}

export default FormContainer
