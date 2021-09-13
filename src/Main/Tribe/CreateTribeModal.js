/** @format */

import React from 'react'
import {
    View,
    KeyboardAvoidingView,
    ScrollView,
    SafeAreaView,
    TextInput,
    Image,
    Text,
    TouchableOpacity,
    Dimensions,
    ImageBackground,
    Modal,
    FlatList,
} from 'react-native'
import { connect } from 'react-redux'
import { CopilotStep, walkthroughable } from 'react-native-copilot-gm'
import { CheckBox } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons'
import {
    Field,
    reduxForm,
    formValueSelector,
    SubmissionError,
} from 'redux-form'
import R from 'ramda'
import { MenuProvider } from 'react-native-popup-menu'

// Components
import ModalHeader from '../Common/Header/ModalHeader'
import ImageModal from '../Common/ImageModal'
import dropDown from '../../asset/utils/dropDown.png'
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu'

// Actions
import {
    cancelCreatingNewTribe,
    createNewTribe,
    tribeToFormAdapter,
} from '../../redux/modules/tribe/NewTribeActions'
import { openCameraRoll, openCamera } from '../../actions'

// assets
import cancel from '../../asset/utils/cancel_no_background.png'
import camera from '../../asset/utils/camera.png'
import cameraRoll from '../../asset/utils/cameraRoll.png'
import imageOverlay from '../../asset/utils/imageOverlay.png'
import expand from '../../asset/utils/expand.png'
import { IMAGE_BASE_URL } from '../../Utils/Constants'
import {
    track,
    EVENT as E,
    trackWithProperties,
} from '../../monitoring/segment'
import { default_style, text } from '../../styles/basic'
import { UI_SCALE } from '../../styles'
import { color } from 'react-native-reanimated'

const { Popover } = renderers
const { width } = Dimensions.get('window')
const height = Dimensions.get('window').height
const WalkableView = walkthroughable(View)

class CreateTribeModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mediaModal: false,
            catogary: '',
        }
    }

    componentDidMount() {
        this.startTime = new Date()
        track(
            this.props.initializeFromState
                ? E.EDIT_TRIBE_MODAL_OPENED
                : E.CREATE_TRIBE_MODAL_OPENED
        )
        this.initializeForm()
    }

    initializeForm() {
        const defaulVals = {
            name: undefined,
            membersCanInvite: false,
            isAutoAcceptEnabled: false,
            isPubliclyVisible: false,
            membershipLimit: undefined,
            description: '',
            picture: undefined,
        }

        // Initialize based on the props, if it's opened through edit button
        const { initializeFromState, tribe } = this.props
        const initialVals = initializeFromState
            ? { ...tribeToFormAdapter(tribe) }
            : { ...defaulVals }

        this.props.initialize({
            // ...initialVals
            ...initialVals,
        })
    }

    handleCreate = (values) => {
        const { initializeFromState, tribe, picture } = this.props
        const tribeId = tribe ? tribe._id : undefined
        const needUpload =
            (initializeFromState &&
                tribe.picture &&
                tribe.picture !== picture) || // picture has changed
            (initializeFromState &&
                tribe.picture == undefined &&
                picture !== undefined) || // picture is updated
            (!initializeFromState && picture) // create new tribe with picture
        // const durationSec =
        //     (new Date().getTime() - this.startTime.getTime()) / 1000
        // trackWithProperties(
        //     initializeFromState ? E.TRIBE_UPDATED : E.TRIBE_CREATED,
        //     { ...this.props.formVals.values, DurationSec: durationSec }
        // )

        let valuesToSend = { ...this.props.formVals.values }
        valuesToSend['category'] = this.state.catogary

        this.props.createNewTribe(
            valuesToSend,
            needUpload,
            initializeFromState, // isEdit
            tribeId // tribeId
        )
    }

    handleOpenCamera = () => {
        this.props.openCamera((result) => {
            this.props.change('picture', result.uri)
        })
    }

    handleOpenCameraRoll = () => {
        const callback = R.curry((result) => {
            console.log('result is: ', result)
            this.props.change('picture', result.uri)
        })
        this.props.openCameraRoll(callback)
    }

    renderInput = ({
        input: { onChange, onFocus, value, ...restInput },
        editable,
        numberOfLines,
        meta: { touched, error },
        placeholder,
        keyboardType,
        ...custom
    }) => {
        const inputStyle = {
            ...styles.inputStyle,
        }

        let multiline = true
        if (numberOfLines && numberOfLines === 1) {
            multiline = false
        }
        return (
            <SafeAreaView
                style={{
                    backgroundColor: 'white',
                    borderBottomWidth: 0.5,
                    margin: 5,
                    borderColor: 'lightgray',
                }}
            >
                <TextInput
                    placeholder={placeholder}
                    onChangeText={onChange}
                    style={inputStyle}
                    editable={editable}
                    maxHeight={150}
                    keyboardType={keyboardType || 'default'}
                    multiline={multiline}
                    value={value}
                    autoCorrect
                />
            </SafeAreaView>
        )
    }

    renderActionIcons() {
        const actionIconStyle = { ...styles.actionIconStyle }
        const actionIconWrapperStyle = { ...styles.actionIconWrapperStyle }
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginTop: 10,
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={actionIconWrapperStyle}
                    onPress={this.handleOpenCamera}
                >
                    <Image style={actionIconStyle} source={camera} />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={{ ...actionIconWrapperStyle, marginLeft: 5 }}
                    onPress={this.handleOpenCameraRoll}
                >
                    <Image style={actionIconStyle} source={cameraRoll} />
                </TouchableOpacity>
            </View>
        )
    }

    // Current media type is only picture
    renderMedia() {
        const { initializeFromState, tribe, picture } = this.props
        let imageUrl = picture
        if (initializeFromState && picture) {
            const hasImageModified =
                (tribe.picture && tribe.picture !== picture) || // Picture has changed
                (tribe.picture == undefined && picture !== undefined) // Picture is added
            if (!hasImageModified) {
                // If editing a tribe and image hasn't changed, then image source should
                // be from server
                imageUrl = `${IMAGE_BASE_URL}${picture}`
            }
        }

        if (this.props.picture) {
            return (
                <View style={{ backgroundColor: 'gray' }}>
                    <ImageBackground
                        style={styles.mediaStyle}
                        source={{ uri: imageUrl }}
                        imageStyle={{
                            borderRadius: 8,
                            opacity: 0.7,
                            resizeMode: 'cover',
                        }}
                    >
                        <View
                            style={{
                                alignSelf: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Image
                                source={imageOverlay}
                                style={{
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    height: 40,
                                    width: 50,
                                    tintColor: '#fafafa',
                                }}
                            />
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => this.setState({ mediaModal: true })}
                            style={{
                                position: 'absolute',
                                top: 10,
                                right: 15,
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                                padding: 2,
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Image
                                source={expand}
                                style={{
                                    width: 16,
                                    height: 16,
                                    tintColor: '#fafafa',
                                    borderRadius: 4,
                                }}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => this.props.change('picture', false)}
                            style={{
                                position: 'absolute',
                                top: 10,
                                left: 15,
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Image
                                source={cancel}
                                style={{
                                    width: 16,
                                    height: 16,
                                    tintColor: '#fafafa',
                                    borderRadius: 8,
                                    padding: 2,
                                }}
                            />
                        </TouchableOpacity>
                    </ImageBackground>
                    {this.renderImageModal(imageUrl)}
                </View>
            )
        }
        return null
    }

    renderImageModal(imageUrl) {
        const { initializeFromState, tribe, picture } = this.props

        return (
            <ImageModal
                mediaRef={imageUrl}
                mediaModal={this.state.mediaModal}
                closeModal={() => this.setState({ mediaModal: false })}
                isLocalFile={
                    !(
                        initializeFromState &&
                        tribe.picture &&
                        tribe.picture === picture
                    )
                }
            />
        )
    }

    renderTribeName() {
        const titleText = <Text style={styles.titleTextStyle}>Tribe Name</Text>
        return (
            <View style={{ marginBottom: 5 }}>
                {titleText}
                <Field
                    name="name"
                    label="name"
                    component={this.renderInput}
                    editable={!this.props.uploading}
                    numberOfLines={1}
                    multiline
                    style={styles.goalInputStyle}
                    placeholder="Enter the name..."
                />
            </View>
        )
    }

    renderTribeMemberLimit() {
        const titleText = (
            <Text style={styles.titleTextStyle}>Member Limit (Optional)</Text>
        )
        return (
            <View style={{ marginBottom: 5 }}>
                {titleText}
                <Field
                    name="membershipLimit"
                    label="membershipLimit"
                    component={this.renderInput}
                    editable={!this.props.uploading}
                    numberOfLines={1}
                    keyboardType="number-pad"
                    style={styles.goalInputStyle}
                    placeholder="Enter a number..."
                />
            </View>
        )
    }

    renderTribeDescription() {
        const titleText = <Text style={styles.titleTextStyle}>Description</Text>
        return (
            <View style={{ marginBottom: 5 }}>
                {titleText}
                <Field
                    name="description"
                    label="description"
                    component={this.renderInput}
                    editable={!this.props.uploading}
                    numberOfLines={5}
                    style={styles.goalInputStyle}
                    placeholder="Describe your tribe..."
                />
            </View>
        )
    }

    renderOptions() {
        return (
            <View>
                <CheckBox
                    title="Members can invite new members"
                    textStyle={{ fontWeight: 'normal' }}
                    checked={this.props.membersCanInvite}
                    checkedIcon={
                        <MaterialIcons name="done" color="#111" size={21} />
                    }
                    uncheckedIcon={
                        <MaterialIcons name="done" color="#CCC" size={21} />
                    }
                    onPress={() =>
                        this.props.change(
                            'membersCanInvite',
                            !this.props.membersCanInvite
                        )
                    }
                />
                <CheckBox
                    title="Auto accept join request"
                    textStyle={{ fontWeight: 'normal' }}
                    checked={this.props.isAutoAcceptEnabled}
                    checkedIcon={
                        <MaterialIcons name="done" color="#111" size={21} />
                    }
                    uncheckedIcon={
                        <MaterialIcons name="done" color="#CCC" size={21} />
                    }
                    onPress={() =>
                        this.props.change(
                            'isAutoAcceptEnabled',
                            !this.props.isAutoAcceptEnabled
                        )
                    }
                />
                <CheckBox
                    title="Publicly visible"
                    textStyle={{ fontWeight: 'normal' }}
                    checked={this.props.isPubliclyVisible}
                    checkedIcon={
                        <MaterialIcons name="done" color="#111" size={21} />
                    }
                    uncheckedIcon={
                        <MaterialIcons name="done" color="#CCC" size={21} />
                    }
                    onPress={() =>
                        this.props.change(
                            'isPubliclyVisible',
                            !this.props.isPubliclyVisible
                        )
                    }
                />
            </View>
        )
    }

    // Render field to select an image for tribe
    renderImageSelection() {
        const titleText = (
            <Text style={styles.titleTextStyle}>Select a photo</Text>
        )
        return (
            <View style={{ marginTop: 4 }}>
                {titleText}
                {this.renderMedia()}
                {this.renderActionIcons()}
            </View>
        )
    }

    handleTribeCatogary = (value) => {
        this.setState({ catogary: value })
    }

    renderTribeCategory = () => {
        const menu = MenuFactory(
            [
                'General',
                'Career/Business',
                'Charity/Philanthropy',
                'Financial/Wealth',
                'Health/Wellness',
                'Learning/Mindset',
                'Personal/Relationships',
                'Spiritual',
                'Travel',
                'Things to Buy',
            ],
            this.handleTribeCatogary,
            this.state.catogary == ''
                ? 'Select a category'
                : this.state.catogary,
            styles.triggerContainerStyle,
            () => console.log('animationCallback')
        )

        return (
            <View
                style={{
                    marginTop: 5,
                    justifyContent: 'flex-start',
                    color: '#828282',
                }}
            >
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.subTitleTextStyle}>Category</Text>
                </View>

                {menu}
            </View>
        )
    }

    render() {
        const { handleSubmit, errors } = this.props
        const actionText = this.props.initializeFromState ? 'Update' : 'Create'
        const titleText = this.props.initializeFromState
            ? 'Edit Tribe'
            : 'New Tribe'

        return (
            <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
                <KeyboardAvoidingView
                    behavior="padding"
                    style={{ flex: 1, backgroundColor: '#ffffff' }}
                >
                    <ModalHeader
                        title={titleText}
                        actionText={actionText}
                        onCancel={() => {
                            const durationSec =
                                (new Date().getTime() -
                                    this.startTime.getTime()) /
                                1000
                            trackWithProperties(
                                this.props.initializeFromState
                                    ? E.EDIT_TRIBE_MODAL_CANCELLED
                                    : E.CREATE_TRIBE_MODAL_CANCELLED,
                                { DurationSec: durationSec }
                            )
                            this.props.cancelCreatingNewTribe()
                        }}
                        onAction={handleSubmit(this.handleCreate)}
                        actionDisabled={this.props.uploading}
                    />

                    <ScrollView
                        style={{ borderTopColor: '#e9e9e9', borderTopWidth: 1 }}
                    >
                        <View style={{ flex: 1, padding: 20 }}>
                            {this.renderTribeName()}
                            {this.renderTribeDescription()}
                            {this.renderTribeMemberLimit()}
                            {this.renderTribeCategory()}
                            {this.renderOptions()}
                            {this.renderImageSelection()}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </MenuProvider>
        )
    }
}

CreateTribeModal = reduxForm({
    form: 'createTribeModal',
    enableReinitialize: true,
})(CreateTribeModal)

const mapStateToProps = (state) => {
    const selector = formValueSelector('createTribeModal')
    const { user } = state.user
    const { profile } = user
    const { uploading } = state.newTribe

    return {
        user,
        profile,
        name: selector(state, 'name'),
        membersCanInvite: selector(state, 'membersCanInvite'),
        isAutoAcceptEnabled: selector(state, 'isAutoAcceptEnabled'),
        isPubliclyVisible: selector(state, 'isPubliclyVisible'),
        membershipLimit: selector(state, 'membershipLimit'),
        description: selector(state, 'description'),
        picture: selector(state, 'picture'),
        formVals: state.form.createTribeModal,
        uploading,
    }
}

export default connect(mapStateToProps, {
    cancelCreatingNewTribe,
    createNewTribe,
    openCameraRoll,
    openCamera,
})(CreateTribeModal)

const styles = {
    sectionMargin: {
        marginTop: 20,
    },
    inputContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#e9e9e9',
        shadowColor: '#ddd',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        elevation: 1,
    },
    imageStyle: {
        height: 54,
        width: 54,
        borderRadius: 5,
    },
    titleTextStyle: {
        fontSize: 11,
        color: '#a1a1a1',
        padding: 2,
    },
    standardInputStyle: {
        flex: 1,
        fontSize: 12,
        padding: 13,
        paddingRight: 14,
        paddingLeft: 14,
    },
    goalInputStyle: {
        fontSize: 20,
        padding: 20,
        paddingRight: 15,
        paddingLeft: 15,
    },
    inputStyle: {
        paddingTop: 6,
        paddingBottom: 6,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 22,
    },
    subTitleTextStyle: {
        fontSize: 11,
        color: '#a1a1a1',
        padding: 2,
    },
    cancelIconStyle: {
        height: 20,
        width: 20,
        justifyContent: 'flex-end',
    },
    triggerContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#E0E0E0',
        height: 40,
        marginBottom: 10,
        width: '95%',
        alignSelf: 'center',
    },
    mediaStyle: {
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionIconWrapperStyle: {
        backgroundColor: '#fafafa',
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    actionIconStyle: {
        tintColor: '#4a4a4a',
        height: 15,
        width: 18,
    },
    anchorStyle: {
        backgroundColor: 'white',
    },
    caretStyle: {
        ...default_style.smallIcon_1,
        marginRight: 12,
        tintColor: '#a1a1a1',
    },

    menuOptionsStyles: {
        optionsContainer: {
            padding: 5,
            height: height * 0.45,
            width: width * 0.9,
            // width: '100%',
            bottom: 50,
            // left: 50,
        },

        optionWrapper: {
            flex: 1,
        },
        optionsContainerStyle: {},
        optionTouchable: {
            underlayColor: 'lightgray',
            activeOpacity: 10,
        },
        optionText: {
            ...default_style.subTitleText_1,
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
        },
        carouselContainer: {
            marginTop: 50,
        },
    },
    borderStyle: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#e9e9e9',
        shadowColor: '#ddd',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
    },
    // Menu related style
    backdrop: {
        backgroundColor: 'transparent',
    },
}

const MenuFactory = (
    options,
    callback,
    triggerText,
    triggerContainerStyle,
    animationCallback
) => {
    return (
        <Menu
            onSelect={(value) => callback(value)}
            rendererProps={{
                placement: 'bottom',
                anchorStyle: styles.anchorStyle,
            }}
            renderer={Popover}
            onOpen={animationCallback}
        >
            <MenuTrigger
                customStyles={{
                    TriggerTouchableComponent: TouchableOpacity,
                }}
            >
                <View style={triggerContainerStyle}>
                    <Text
                        style={{
                            margin: 10,
                            flex: 1,
                            color: '#a1a1a1',
                        }}
                    >
                        {triggerText}
                    </Text>
                    <Image
                        resizeMode="contain"
                        style={styles.caretStyle}
                        source={dropDown}
                    />
                </View>
            </MenuTrigger>
            <MenuOptions customStyles={styles.menuOptionsStyles}>
                <FlatList
                    data={options}
                    renderItem={({ item }) => (
                        <MenuOption value={item} text={item} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    // style={{ height: 200 }}
                />
            </MenuOptions>
        </Menu>
    )
}
