/**
 * This component uses ui-kitten <Divider /> to implement horizontal spacer
 * with specified height and customized styles
 *
 * @format
 */

import React from 'react'
import { Divider } from '@ui-kitten/components'
import _ from 'lodash'

function Spacer(props) {
    const { size } = props

    return (
        <Divider
            style={[
                {
                    padding: _.get(sizeMapper, size, 1),
                    backgroundColor: '#F2F2F2',
                },
            ]}
        />
    )
}

const sizeMapper = {
    1: 1,
    2: 2,
    3: 4,
}

export default Spacer
