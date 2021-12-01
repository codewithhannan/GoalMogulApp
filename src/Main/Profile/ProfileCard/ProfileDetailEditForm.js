/** @format */

import React, { Component } from 'react'
import {
    View,
    TouchableOpacity,
    ActionSheetIOS,
    Dimensions,
    SafeAreaView,
    Keyboard,
    Platform,
} from 'react-native'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { TextField } from 'react-native-material-textfield-gm'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { DotIndicator } from 'react-native-indicators'
import {
    EVENT as E,
    track,
    trackWithProperties,
} from '../../../monitoring/segment'

/* Component */
import FormHeader from '../../Common/Header/FormHeader'
import LoadingModal from '../../Common/Modal/LoadingModal'

/* Actions */
import {
    submitUpdatingProfile,
    openCamera,
    openCameraRoll,
} from '../../../actions'

// Selectors
import {
    getUserDataByPageId,
    getUserData,
} from '../../../redux/modules/User/Selector'

/** Constants */
import { color, default_style } from '../../../styles/basic'
import { Icon } from '@ui-kitten/components'
import ProfileImage from '../../Common/ProfileImage'

import {
    getProfileImageOrDefault,
    getProfileImageOrDefaultFromUser,
} from '../../../redux/middleware/utils'
import BottomButtonsSheet from '../../Common/Modal/BottomButtonsSheet'
import { getButtonBottomSheetHeight } from '../../../styles'
import { resetTutorial } from '../../../redux/modules/User/TutorialActions'
import { getToastsData } from '../../../actions/ToastActions'
import { refreshActivityFeed } from '../../../redux/modules/home/feed/actions'

const BUTTONS = ['Take a Picture', 'Camera Roll', 'Cancel']
const TAKING_PICTURE_INDEX = 0
const CAMERA_ROLL_INDEX = 1
const CANCEL_INDEX = 2

const { width } = Dimensions.get('window')
const DEBUG_KEY = '[ UI ProfileDetailEditForm ]'

class ProfileDetailEditForm extends Component {
    updateRef(name, ref) {
        this[name] = ref
    }

    refreshActivity = () => this.props.refreshActivityFeed()

    submit = (values) => {
        console.log(
            '\ninitialValues from submit in ProfileDetailEditForm',
            this.props.initialValues
        )
        console.log(
            '\nprofile from submit in ProfileDetailEditForm',
            values.profile
        )

        const refreshActivity = () => {
            this.refreshActivity()
        }

        const hasImageModified =
            JSON.stringify(this.props.initialValues.profile.image) !==
            JSON.stringify(values.profile.image)
        this.props.submitUpdatingProfile(
            { values, hasImageModified },
            this.props.pageId,
            refreshActivity
        )

        track(E.PROFILE_UPDATED)
    }

    _scrollToInput(reactNode) {
        // Add a 'scroll' ref to your ScrollView
        this.scrollview.props.scrollToFocusedInput(reactNode)
    }

    // handleOnFocus = (position) => {
    //     console.log('on focus')
    //     this.refs.scrollview.scrollTo({ x: 0, y: position, animated: true })
    // }

    chooseImage = async () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
            },
            (buttonIndex) => {
                console.log('button clicked', BUTTONS[buttonIndex])
                switch (buttonIndex) {
                    case TAKING_PICTURE_INDEX:
                        this.props.openCamera((result) => {
                            this.props.change('profile.image', result.uri)
                        })
                        break
                    case CAMERA_ROLL_INDEX:
                        this.props.openCameraRoll((result) => {
                            console.log('CAMERA ROLLL', result)
                            this.props.change('profile.image', result.uri)
                        })
                        break
                    default:
                        return
                }
            }
        )
    }

    renderCameraRollBottomSheet = () => {
        const options = this.makeCameraRefOptions()

        const sheetHeight = getButtonBottomSheetHeight(options.length)

        return (
            <BottomButtonsSheet
                ref={(r) => (this.CameraRefBottomSheetRef = r)}
                buttons={options}
                height={sheetHeight}
            />
        )
    }
    openCameraRollBottomSheet = () => this.CameraRefBottomSheetRef.open()
    closeNotificationBottomSheet = () => this.CameraRefBottomSheetRef.close()
    makeCameraRefOptions = () => {
        return [
            {
                text: 'Take a Picture',
                onPress: () => {
                    this.closeNotificationBottomSheet(),
                        setTimeout(() => {
                            this.props.openCamera((result) => {
                                this.props.change('profile.image', result.uri)
                            })
                        }, 500)
                },
            },
            {
                text: 'Camera Roll',
                onPress: () => {
                    this.closeNotificationBottomSheet()
                    setTimeout(() => {
                        this.props.openCameraRoll((result) => {
                            this.props.change('profile.image', result.uri)
                        })
                    }, 500)
                },
            },
        ]
    }

    renderImage = ({ input: { value } }) => {
        return (
            <View style={{ width: '100%' }}>
                <View
                    style={{
                        height: 90 * default_style.uiScale,
                        backgroundColor: color.GM_BLUE_LIGHT_LIGHT,
                    }}
                />
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={
                        Platform.OS == 'ios'
                            ? this.chooseImage
                            : this.openCameraRollBottomSheet
                    }
                >
                    <View style={styles.imageContainerStyle}>
                        <View style={styles.imageWrapperStyle}>
                            <ProfileImage
                                imageStyle={styles.imageStyle}
                                imageUrl={getProfileImageOrDefault(value)}
                            />
                        </View>
                    </View>
                    <View style={styles.iconContainerStyle}>
                        <Icon
                            name="edit"
                            pack="material"
                            style={styles.editIconStyle}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
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
                    enablesReturnKeyAutomatically={
                        enablesReturnKeyAutomatically
                    }
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
                            onNextPress()
                        }
                    }}
                    {...custom}
                    {...restInput}
                />
            </View>
        )
    }

    render() {
        const {
            headline,
            about,
            elevatorPitch,
            handleSubmit,
            uploading,
        } = this.props
        const isValidValues = validValues({ headline, about, elevatorPitch })

        return (
            <View style={{ flex: 1 }}>
                <FormHeader
                    segmants
                    title="Profile"
                    onSubmit={handleSubmit(this.submit)}
                    actionDisabled={!isValidValues || uploading}
                />
                <SafeAreaView
                    forceInset={{ bottom: 'always' }}
                    style={{ backgroundColor: 'white', flex: 1 }}
                    onPress={() => {
                        Keyboard.dismiss()
                    }}
                >
                    <LoadingModal
                        visible={this.props.uploading}
                        customIndicator={
                            <DotIndicator size={12} color="white" />
                        }
                    />
                    <KeyboardAwareScrollView
                        enableOnAndroid
                        innerRef={(ref) => {
                            this.scrollview = ref
                        }}
                        extraScrollHeight={Platform.select({
                            ios: 13,
                            default: 100,
                        })}
                        contentContainerStyle={{
                            backgroundColor: 'white',
                            flexGrow: 1,
                        }}
                    >
                        <Field
                            name="profile.image"
                            label="Profile Picture"
                            component={this.renderImage.bind(this)}
                        />
                        <Field
                            name="name"
                            label="Name"
                            component={this.renderInput}
                            disabled={uploading}
                            returnKeyType="next"
                            autoCorrect
                        />
                        <Field
                            ref="headline"
                            name="headline"
                            label="Headline"
                            component={this.renderInput}
                            limitation={42}
                            disabled={uploading}
                            returnKeyType="next"
                            onNextPress={() => {
                                this.refs['occupation']
                                    .getRenderedComponent()
                                    .focus()
                            }}
                            autoCorrect
                        />
                        <Field
                            ref="occupation"
                            name="profile.occupation"
                            label="Occupation"
                            component={this.renderInput}
                            disabled={uploading}
                            onNextPress={() => {
                                this.refs['location']
                                    .getRenderedComponent()
                                    .focus()
                            }}
                            returnKeyType="next"
                            autoCorrect
                        />
                        {/* <Field
                            name="profile.location"
                            label="Location"
                            component={this.renderInput}
                            disabled={uploading}
                            autoCorrect
                        />
                        <Field
                            name="profile.elevatorPitch"
                            label="Elevator Pitch"
                            component={this.renderInput}
                            disabled={uploading}
                            limitation={250}
                            multiline
                            clearButtonMode="while-editing"
                            autoCorrect
                            returnKeyType="Enter"
                        /> */}
                        <Field
                            name="profile.about"
                            label="About"
                            component={this.renderInput}
                            limitation={500}
                            disabled={uploading}
                            multiline
                            autoCorrect
                            returnKeyType="done"
                        />
                        {this.renderCameraRollBottomSheet()}
                    </KeyboardAwareScrollView>
                </SafeAreaView>
            </View>
        )
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
        return false
    }

    if (about && about.length > 500) {
        return false
    }

    if (elevatorPitch && elevatorPitch.length > 250) {
        return false
    }

    return true
}

const styles = {
    inputContainerStyle: {
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 5,
    },
    imageStyle: {
        width: 120 * default_style.uiScale,
        height: 120 * default_style.uiScale,
        borderRadius: 60 * default_style.uiScale,
    },
    imageContainerStyle: {
        height: 60 * default_style.uiScale,
        backgroundColor: 'white',
    },
    imageWrapperStyle: {
        alignItems: 'center',
        borderRadius: 60 * default_style.uiScale,
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        backgroundColor: 'white',
    },
    iconContainerStyle: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: 10 * default_style.uiScale,
        right: width * 0.5 - 40 * default_style.uiScale - 20,

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
        elevation: 1,
    },
    editIconStyle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        tintColor: '#BBB',
    },
}

ProfileDetailEditForm = reduxForm({
    form: 'profileDetailEditForm',
    enableReinitialize: true,
})(ProfileDetailEditForm)

const mapStateToProps = (state, props) => {
    const { userId, pageId } = props

    const selector = formValueSelector('profileDetailEditForm')

    const uploading = getUserDataByPageId(state, userId, pageId, 'uploading')
    const user = getUserData(state, userId, 'user')

    return {
        // uploading: state.profile.uploading,
        // initialValues: state.profile.user // This is before reducer redesign way
        uploading,
        initialValues: user,
        headline: selector(state, 'headline'),
        elevatorPitch: selector(state, 'profile.elevatorPitch'),
        about: selector(state, 'profile.about'),
    }
}

export default connect(mapStateToProps, {
    submitUpdatingProfile,
    openCamera,
    openCameraRoll,
    getToastsData,
    refreshActivityFeed,
})(ProfileDetailEditForm)
