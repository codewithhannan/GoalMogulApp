/**
 * This is a wrapper class for image view. This component is not yet ready to user.
 *
 * @format
 */

import React from 'react'
import {
    Image,
    View,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from 'react-native'

// default profile picture
import profilePic from '../../asset/utils/defaultUserProfile.png'

// Constants
import { IMAGE_BASE_URL } from '../../Utils/Constants'

const styles = {
    defaultImageContainerStyle: {},
    defaultImageStyle: {
        height: 54,
        width: 54,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'white',
    },
}

/**
 * Props
 *
 * onPress
 * disabled
 *
 * imageStyle,
 * imageContainerStyle,
 * showLoading,
 * imageUrl,
 *
 * showLoading
 *
 * // Default image props
 * defaultImageSource,
 * defaultImageStyle,
 * defaultImageContainerStyle
 */

class ImageView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            imageLoading: false,
        }
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.imageUrl !== nextProps.imageUrl) {
            return true
        }
        return false
    }

    handleImageOnPress = () => {
        const { disabled, onPress } = this.props
        if (!disabled && onPress) {
            onPress()
        }
    }

    render() {
        const {
            imageStyle,
            imageContainerStyle,
            showLoading,
            imageUrl,
            onPress,
            // Default image props
            defaultImageSource,
            defaultImageStyle,
            defaultImageContainerStyle,
        } = props
        const resizeMode = setValue(this.props.resizeMode).withDefaultCase(
            'cover'
        )

        let defaultImageStyle
        if (this.props.defaultImageStyle) {
            defaultImageStyle = { ...this.props.defaultImageStyle }
        } else if (imageStyle) {
            defaultImageStyle = { ...imageStyle }
        } else {
            defaultImageStyle = { ...styles.defaultImageStyle }
        }

        if (rounded) {
            defaultImageStyle = _.set(defaultImageStyle, 'borderRadius', 5)
        }

        const defaultImageContainerStyle = defaultImageContainerStyle
            ? { ...defaultImageContainerStyle }
            : { ...styles.defaultImageContainerStyle }

        let profileImage = (
            <TouchableWithoutFeedback onPress={this.handleImageOnPress}>
                <View
                    style={[
                        defaultImageContainerStyle ||
                            styles.imageContainerStyle,
                    ]}
                >
                    <Image
                        onLoadStart={() =>
                            this.setState({ imageLoading: true })
                        }
                        onLoadEnd={() => this.setState({ imageLoading: false })}
                        style={defaultImageStyle}
                        resizeMode={resizeMode}
                        source={defaultImageSource || profilePic}
                    />
                </View>
            </TouchableWithoutFeedback>
        )
        if (imageUrl && typeof imageUrl !== 'number') {
            imageUrl =
                typeof imageUrl == 'string' && imageUrl.indexOf('https://') != 0
                    ? `${IMAGE_BASE_URL}${imageUrl}`
                    : imageUrl
            profileImage = (
                <TouchableWithoutFeedback onPress={this.handleImageOnPress}>
                    <View
                        style={
                            imageContainerStyle || styles.imageContainerStyle
                        }
                    >
                        <Image
                            onLoadStart={() =>
                                this.setState({ imageLoading: true })
                            }
                            onLoadEnd={() =>
                                this.setState({ imageLoading: false })
                            }
                            style={imageStyle || styles.imageStyle}
                            source={{ uri: imageUrl }}
                            resizeMode={resizeMode}
                        />
                    </View>
                </TouchableWithoutFeedback>
            )
        }
        return profileImage
    }
}

const setValue = (value) => ({
    withDefaultCase(defaultValue) {
        return value === undefined ? defaultValue : value
    },
})

export default ImageView
