import React from 'react';
import {
    Image,
    View,
    TouchableWithoutFeedback
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';

// default profile picture
import defaultProfilePic from '../../asset/utils/defaultUserProfile.png';

// actions
import {
    openProfile
} from '../../actions';

// Constants
import {
    IMAGE_BASE_URL
} from '../../Utils/Constants';
import { DEFAULT_STYLE } from '../../styles';


const DEBUG_KEY = '[ UI ProfileImage ]';
/*
 * props: imageUrl, resizeMode, imageContainerStyle, imageStyle
 */
class ProfileImage extends React.Component {

    shouldComponentUpdate(nextProps) {
        if (this.props.imageUrl !== nextProps.imageUrl) {
            return true;
        }
        return false;
    }

    handleProfileImageOnPress = () => {
        const { userId, disabled } = this.props;
        if (!userId || _.isEmpty(userId) || disabled) return;

        if (this.props.actionDecorator) {
            this.props.actionDecorator(() => this.props.openProfile(userId));
        } else {
            this.props.openProfile(userId);
        }
    }

    render() {
        let { imageUrl } = this.props;
        const { imageContainerStyle, imageStyle, defaultImageSource } = this.props;
        const resizeMode = setValue(this.props.resizeMode).withDefaultCase('cover');

        let defaultImageStyle;
        if (this.props.defaultImageStyle) defaultImageStyle = { ...this.props.defaultImageStyle };
        else if (imageStyle) defaultImageStyle = { ...imageStyle };
        else defaultImageStyle =  DEFAULT_STYLE.profileImage_2;

        const defaultImageContainerStyle = this.props.defaultImageContainerStyle || imageContainerStyle || {
                ...styles.imageContainerStyle,
                borderColor: '#BDBDBD',
                borderWidth: 1
            };

        if (imageUrl) {
            imageUrl = typeof imageUrl == "string" && imageUrl.indexOf('https://') != 0 ?
                `${IMAGE_BASE_URL}${imageUrl}` : imageUrl;
        }

        return (
            <TouchableWithoutFeedback onPress={this.handleProfileImageOnPress}>
                <View style={imageUrl ? { ...imageContainerStyle, borderRadius: 100 } : defaultImageContainerStyle}>
                    <Image
                        style={imageUrl ? (imageStyle && { ...imageStyle, borderRadius: 100 }) || DEFAULT_STYLE.profileImage_1 : defaultImageStyle}
                        source={imageUrl ? { uri: imageUrl } : defaultImageSource || defaultProfilePic}
                        resizeMode={resizeMode}
                    />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const setValue = (value) => ({
    withDefaultCase(defaultValue) {
        return value === undefined ? defaultValue : value;
    }
});

const styles = {
    imageContainerStyle : {
        borderWidth: 0.5,
        borderColor: 'lightgray',
        alignItems: 'center',
        borderRadius: 100,
        alignSelf: 'flex-start',
        backgroundColor: 'white'
    }
}

export default connect(
    null,
    {
        openProfile
    }
)(ProfileImage);
