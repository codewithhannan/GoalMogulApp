/**
 * /* eslint no-use-before-define: ["error", { "variables": false }]
 *
 * @format
 */

import PropTypes from 'prop-types'
import React from 'react'
import {
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewPropTypes,
} from 'react-native'
import ImageModal from '../../Common/ImageModal'
export default class ChatMessageImage extends React.Component {
    UNSAFE_componentWillMount() {
        this.setState({
            imageOpen: false,
        })
    }

    openImage = () => {
        this.setState({
            imageOpen: true,
        })
    }

    render() {
        const {
            containerStyle,
            imageProps,
            imageStyle,
            currentMessage,
        } = this.props
        return (
            <TouchableOpacity
                style={[styles.container, containerStyle]}
                activeOpacity={0.6}
                onPress={this.openImage}
            >
                <View style={[styles.container, containerStyle]}>
                    <Image
                        {...imageProps}
                        style={[styles.image, imageStyle]}
                        source={{ uri: currentMessage.image }}
                    />
                    <ImageModal
                        mediaRef={currentMessage.image}
                        mediaModal={this.state.imageOpen}
                        closeModal={() => this.setState({ imageOpen: false })}
                    />
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 108,
        width: 'auto',
    },
    image: {
        width: 'auto',
        minWidth: 150,
        height: 100,
        borderRadius: 13,
        margin: 3,
        resizeMode: 'cover',
    },
    imageActive: {
        flex: 1,
        resizeMode: 'contain',
    },
})

ChatMessageImage.defaultProps = {
    currentMessage: {
        image: null,
    },
    containerStyle: {},
    imageStyle: {},
    imageProps: {},
    lightboxProps: {},
}

ChatMessageImage.propTypes = {
    currentMessage: PropTypes.object,
    containerStyle: ViewPropTypes.style,
    imageStyle: Image.propTypes.style,
    imageProps: PropTypes.object,
    lightboxProps: PropTypes.object,
}
