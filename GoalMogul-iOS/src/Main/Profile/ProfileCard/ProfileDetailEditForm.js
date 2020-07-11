import React, { Component } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    ActionSheetIOS,
    Dimensions,
    SafeAreaView,
    Keyboard
} from 'react-native';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { TextField } from 'react-native-material-textfield-gm';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { DotIndicator } from 'react-native-indicators';

/* Component */
import FormHeader from '../../Common/Header/FormHeader';
import LoadingModal from '../../Common/Modal/LoadingModal';

/* Asset */
import editImage from '../../../asset/utils/edit.png';
import defaultProfilePic from '../../../asset/utils/defaultUserProfile.png';

/* Actions */
import { submitUpdatingProfile, openCamera, openCameraRoll } from '../../../actions';

// Selectors
import {
    getUserDataByPageId,
    getUserData
} from '../../../redux/modules/User/Selector';

/** Constants */
import { IMAGE_BASE_URL } from '../../../Utils/Constants';
import { GM_BLUE_LIGHT_LIGHT, GM_BLUE, DEFAULT_STYLE } from '../../../styles';

const BUTTONS = ['Take a Picture', 'Camera Roll', 'Cancel'];
const TAKING_PICTURE_INDEX = 0;
const CAMERA_ROLL_INDEX = 1;
const CANCEL_INDEX = 2;

const { width } = Dimensions.get('window');
const DEBUG_KEY = '[ UI ProfileDetailEditForm ]';

class ProfileDetailEditForm extends Component {

    updateRef(name, ref) {
        this[name] = ref;
    }

    submit = values => {
        if (!values.profile.location || values.profile.location === '') values.profile.location = ' ';
        const hasImageModified = JSON.stringify(this.props.initialValues.profile.image) !==
            JSON.stringify(values.profile.image);
        this.props.submitUpdatingProfile({ values, hasImageModified }, this.props.pageId);
    };

    _scrollToInput(reactNode) {
        // Add a 'scroll' ref to your ScrollView
        this.scrollview.props.scrollToFocusedInput(reactNode)
    }

    handleOnFocus = (position) => {
        console.log('on focus');
        this.refs.scrollview.scrollTo({ x: 0, y: position, animated: true });
    }

    chooseImage = async () => {
        ActionSheetIOS.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: CANCEL_INDEX,
        },
            (buttonIndex) => {
                console.log('button clicked', BUTTONS[buttonIndex]);
                switch (buttonIndex) {
                    case TAKING_PICTURE_INDEX:
                        this.props.openCamera((result) => {
                            this.props.change('profile.image', result.uri);
                        });
                        break;
                    case CAMERA_ROLL_INDEX:
                        this.props.openCameraRoll((result) => {
                            this.props.change('profile.image', result.uri);
                        });
                        break;
                    default:
                        return;
                }
            });
    }

    renderImage = ({ input: { value }}) => {
        const hasImageModified = JSON.stringify(this.props.initialValues.profile.image) !== JSON.stringify(value);
        
        let image = null;
        if (value) {
            if (hasImageModified) {
                image = value;
            } else {
                image = `${IMAGE_BASE_URL}${value}`;
            }
        }
        
        const imageStyle = image ? styles.imageStyle : {
            width: 30,
            height: 30,
            margin: 40 * DEFAULT_STYLE.uiScale
        };
        const imageWrapperStyle = [styles.imageWrapperStyle, image ? {} : {
            borderColor: '#BDBDBD',
            borderWidth: 2
        }];
        return (
            <View style={{ width: '100%' }}>
                <View style={{ height: 90 * DEFAULT_STYLE.uiScale, backgroundColor: GM_BLUE_LIGHT_LIGHT }} />
                <TouchableOpacity activeOpacity={0.6} onPress={this.chooseImage}>
                    <View style={styles.imageContainerStyle}>
                        <View style={imageWrapperStyle}>
                            <Image
                                source={ image ? { uri: image } : defaultProfilePic}
                                style={imageStyle}
                            />
                        </View>
                    </View>
                    <View style={styles.iconContainerStyle}>
                        <Image style={styles.editIconStyle} source={editImage} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    // TODO: convert this to an independent component
    renderInput = ({
        input: { onChange, onFocus, ...restInput },
        label,
        secure,
        limitation,
        multiline,
        disabled,
        clearButtonMode,
        enablesReturnKeyAutomatically,
        forFocus,
        onNextPress,
        autoCorrect,
        meta: { error },
        returnKeyType,
        ...custom
    }) => {
        return (
            <View style={styles.inputContainerStyle}>
                <TextField
                    label={label}
                    title={custom.title}
                    autoCapitalize={'none'}
                    autoCorrect={autoCorrect || true}
                    onChangeText={onChange}
                    error={error}
                    enablesReturnKeyAutomatically={enablesReturnKeyAutomatically}
                    returnKeyType={returnKeyType || 'done'}
                    secureTextEntry={secure}
                    characterRestriction={limitation}
                    multiline={multiline}
                    clearButtonMode={clearButtonMode}
                    onFocus={forFocus}
                    disabled={disabled}
                    autoCorrect
                    onKeyPress={(key) => {
                        if (key === 'next' && onNextPress) {
                            onNextPress();
                        }
                    }}
                    {...custom}
                    {...restInput}
                />
            </View>
        );
    };

    render() {
        const { headline, about, elevatorPitch, handleSubmit, uploading } = this.props;
        const isValidValues = validValues({ headline, about, elevatorPitch });

        return (
            <SafeAreaView
                forceInset={{ bottom: 'always' }}
                style={{ backgroundColor: GM_BLUE }}
                onPress={() => {
                    Keyboard.dismiss()
                }}
            >
                <View style={{ paddingBottom: 150, backgroundColor: 'white' }}>
                <LoadingModal
                    visible={this.props.uploading}
                    customIndicator={<DotIndicator size={12} color='white' />}
                />
                <FormHeader
                    title='Profile'
                    onSubmit={handleSubmit(this.submit)}
                    actionDisabled={!isValidValues || uploading}
                />
                <KeyboardAwareScrollView
                    innerRef={ref => { this.scrollview = ref }}
                    style={{  }}
                    extraScrollHeight={13}
                    contentContainerStyle={{
                        backgroundColor: 'white',
                        flexGrow: 1
                    }}
                >
                    <Field name='profile.image' label='Profile Picture' component={this.renderImage.bind(this)} />
                    <Field
                        name='name'
                        label='Name'
                        component={this.renderInput}
                        disabled={uploading}
                        autoCorrect
                    />
                    <Field
                        ref='headline'
                        name='headline'
                        label='Headline'
                        component={this.renderInput}
                        limitation={42}
                        disabled={uploading}
                        returnKeyType='next'
                        onNextPress={() => {
                            this.refs['occupation'].getRenderedComponent().focus();
                        }}
                        autoCorrect
                    />
                    <Field
                        ref='occupation'
                        name='profile.occupation'
                        label='Occupation'
                        component={this.renderInput}
                        disabled={uploading}
                        onNextPress={() => {
                            this.refs['location'].getRenderedComponent().focus();
                        }}
                        autoCorrect
                    />
                    <Field
                        ref='location'
                        name='profile.location'
                        label='Location'
                        component={this.renderInput}
                        disabled={uploading}
                        autoCorrect
                    />
                    <Field
                        name='profile.elevatorPitch'
                        label='Elevator Pitch'
                        component={this.renderInput}
                        disabled={uploading}
                        limitation={250}
                        multiline
                        clearButtonMode='while-editing'
                        autoCorrect
                        returnKeyType='Enter'
                    />
                    <Field
                        name='profile.about'
                        label='About'
                        component={this.renderInput}
                        limitation={250}
                        disabled={uploading}
                        multiline
                        autoCorrect
                        returnKeyType='Enter'
                    />
                </KeyboardAwareScrollView>
                </View>
            </SafeAreaView>
        );
    }
}

/**
 * Validate critical form values
 * @param {*} headline 
 * @param {*} about 
 * @param {*} elevatorPitch 
 */
const validValues = ({ headline, about, elevatorPitch }) => {
    if (headline && headline.length > 42) {
        return false;
    }

    if (about && about.length > 250) {
        return false;
    }

    if (elevatorPitch && elevatorPitch.length > 250) {
        return false;
    }

    return true;
};

const styles = {
    inputContainerStyle: {
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 5,
    },
    imageStyle: {
        width: 120 * DEFAULT_STYLE.uiScale,
        height: 120 * DEFAULT_STYLE.uiScale,
        borderRadius: 60 * DEFAULT_STYLE.uiScale
    },
    imageContainerStyle: {
        height: 60 * DEFAULT_STYLE.uiScale,
        backgroundColor: 'white'
    },
    imageWrapperStyle: {
        alignItems: 'center',
        borderRadius: 60 * DEFAULT_STYLE.uiScale,
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        backgroundColor: 'white'
    },
    iconContainerStyle: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: 10 * DEFAULT_STYLE.uiScale,
        right: (width * 0.5) - 40 * DEFAULT_STYLE.uiScale - 20,

        width: 40,
        height: 40,
        borderRadius: 20,
        borderColor: '#DDD',
        borderWidth: 0.5,

        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: 'white',
        shadowColor: '#DDD',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 1
    },
    editIconStyle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        tintColor: '#BBB'
    }
};

ProfileDetailEditForm = reduxForm({
    form: 'profileDetailEditForm',
    enableReinitialize: true
})(ProfileDetailEditForm);

const mapStateToProps = (state, props) => {
    const { userId, pageId } = props;

    const selector = formValueSelector('profileDetailEditForm');

    const uploading = getUserDataByPageId(state, userId, pageId, 'uploading');
    const user = getUserData(state, userId, 'user');

    return {
        // uploading: state.profile.uploading,
        // initialValues: state.profile.user // This is before reducer redesign way
        uploading,
        initialValues: user,
        headline: selector(state, 'headline'),
        elevatorPitch: selector(state, 'profile.elevatorPitch'),
        about: selector(state, 'profile.about')
    };
};

export default connect(
    mapStateToProps,
    {
        submitUpdatingProfile,
        openCamera,
        openCameraRoll
    }
)(ProfileDetailEditForm);
