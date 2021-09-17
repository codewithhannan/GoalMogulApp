/** @format */

import React from 'react'
import { View } from 'react-native'

import { DotIcon } from '../../Utils/Icons'

const Pagination = (props) => {
    const { total, current } = props

    const pagination = []

    for (let i = 0; i < total; i += 1) {
        let color = ''
        if (i <= current) {
            color = '#ffffff'
        } else {
            color = '#2ea1b8'
        }

        const key = `registration-pagination-${i}`
        pagination.push(
            <DotIcon
                key={Math.random().toString(36).substr(2, 9)}
                iconContainerStyle={{ ...styles.iconContainerStyle }}
                iconStyle={{ tintColor: color, height: 10, width: 10 }}
            />
        )
    }
    {
        /**
        <Icon
        name='primitive-dot'
        type='octicon'
        color={color}
        size={21}
        key={key}
        containerStyle={styles.iconContainerStyle}
      />
      */
    }

    return <View style={styles.containerStyle}>{pagination}</View>
}

const styles = {
    containerStyle: {
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 7,
    },
    iconContainerStyle: {
        alignSelf: 'center',
        width: 11,
        marginLeft: 8,
        marginRight: 8,
    },
}

export default Pagination
