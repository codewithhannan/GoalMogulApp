/** @format */

import React, { Component } from 'react'
import { Dimensions, Image, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux'

import { registrationCameraRollOnImageChoosen } from '../../actions'

const { width } = Dimensions.get('window')

class ImageRow extends Component {
    handleOnImageChoosen(uri) {
        this.props.registrationCameraRollOnImageChoosen(uri)
    }

    render() {
        const uri = this.props.photo.node.image.uri
        return (
            <TouchableWithoutFeedback
                onPress={() => this.handleOnImageChoosen(uri)}
            >
                <Image
                    source={{ uri }}
                    style={{
                        width: width / 3,
                        height: width / 3,
                    }}
                />
            </TouchableWithoutFeedback>
        )
    }
}

export default connect(null, { registrationCameraRollOnImageChoosen })(ImageRow)
