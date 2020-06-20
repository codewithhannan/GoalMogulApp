/** @format */

import React, { Component } from 'react'
import _ from 'lodash'
import { View, FlatList } from 'react-native'
import { connect } from 'react-redux'

/* Actions */
import { openCameraRoll, registrationCameraRollLoadPhoto } from '../actions'

/* Components */
import ImageRow from './Common/ImageRow'

class cameraRollModal extends Component {
    componentDidMount() {
        // this.props.registrationCameraRollLoadPhoto();
    }

    _keyExtractor = (item, index) => item.node.image.uri

    renderRow(data) {
        // console.log('rendering item p: ', data.item);
        const p = data.item
        return <ImageRow photo={p} key={p.node.image.uri} />
    }

    render() {
        return (
            <View>
                <FlatList
                    enableEmptySections
                    data={this.props.photos}
                    renderItem={(item) => this.renderRow(item)}
                    numColumns={3}
                    keyExtractor={this._keyExtractor}
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { cameraRollModalOpen } = state.registration
    const photos = _.map(state.cameraRoll, (val, uid) => {
        return { ...val, uid }
    })

    return { photos, cameraRollModalOpen }
}

export default connect(mapStateToProps, {
    openCameraRoll,
    registrationCameraRollLoadPhoto,
})(cameraRollModal)
