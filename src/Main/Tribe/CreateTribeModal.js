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
    Platform,
    FlatList,
} from 'react-native'
import { connect } from 'react-redux'
import { CopilotStep, walkthroughable } from 'react-native-copilot-gm'
import { CheckBox } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons'
// import { RadioButton } from 'react-native-paper';
import RadioForm, {
    RadioButton,
    RadioButtonInput,
    RadioButtonLabel,
} from 'react-native-simple-radio-button'
import ToggleSwitch from 'toggle-switch-react-native'
import { Tooltip } from 'react-native-elements'

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
import BottomButtonsSheet from '../Common/Modal/BottomButtonsSheet'
import { getButtonBottomSheetHeight } from '../../styles'
import DelayedButton from '../Common/Button/DelayedButton'
// Actions
import {
    cancelCreatingNewTribe,
    createNewTribe,
    tribeToFormAdapter,
    clearTribeError,
} from '../../redux/modules/tribe/NewTribeActions'
import { refreshTribeHub } from '../../redux/modules/tribe/TribeHubActions'
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

var radio_props = [
    { label: 'Public', value: 1 },
    { label: 'Private', value: 0 },
]

class CreateTribeModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mediaModal: false,
            catogary: '',
            privacy: 'public',
        }
    }

    componentDidMount() {
        this.startTime = new Date()
        // track(
        //     this.props.initializeFromState
        //         ? E.EDIT_TRIBE_MODAL_OPENED
        //         : E.CREATE_TRIBE_MODAL_OPENED
        // )
        this.initializeForm()
    }
    componentWillUnmount() {
        this.props.clearTribeError()
        this.props.refreshTribeHub()
    }
    initializeForm() {
        const defaulVals = {
            name: undefined,
            isMemberInviteEnabled: false,
            isAutoAcceptEnabled: false,
            isPubliclyVisible: false,
            membershipLimit: undefined,
            description: '',
            picture: undefined,
            category: 'General',
            tribeInviteCode: undefined,
            guidelines: undefined,
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

        // let valuesToSend = { ...this.props.formVals.values }
        // valuesToSend['category'] = this.state.catogary

        this.props.createNewTribe(
            this.props.formVals.values,
            needUpload,
            initializeFromState, // isEdit
            tribeId // tribeId
        )
    }
    handleImageIconOnClick = () => {
        this.bottomSheetRef && this.bottomSheetRef.open()
    }

    handleOpenCamera = () => {
        this.bottomSheetRef.close()

        this.props.openCamera((result) => {
            this.props.change('picture', result.uri)
        })
    }

    handleOpenCameraRoll = () => {
        this.bottomSheetRef.close()

        const callback = R.curry((result) => {
            console.log('result is: ', result)
            this.props.change('picture', result.uri)
        })
        setTimeout(() => this.props.openCameraRoll(callback), 500)
    }

    renderInput = ({
        input: { onChange, onFocus, value, ...restInput },
        editable,
        numberOfLines,
        meta: { touched, error },
        placeholder,
        keyboardType,
        isDesc,
        tribeInvite,
        ...custom
    }) => {
        console.log('value', value)
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
                    borderWidth: 0.5,
                    margin: 5,
                    borderColor: 'lightgray',
                    height: isDesc ? 120 : 35,
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
    renderNextButton(handleSubmit) {
        const actionText = this.props.initializeFromState ? 'Update' : 'Create'
        return (
            <DelayedButton
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 40,
                    width: '90%',
                    backgroundColor: '#42C0F5',
                    alignSelf: 'center',
                    marginVertical: 10,
                    justifyContent: 'center',
                    borderRadius: 2,
                }}
                onPress={handleSubmit(this.handleCreate)}
            >
                <Text
                    style={{
                        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                        fontWeight: '600',
                        fontSize: 15,
                        color: 'white',
                    }}
                >
                    {actionText}
                </Text>
            </DelayedButton>
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
        const options = [
            {
                text: 'Open Gallery',
                onPress: this.handleOpenCameraRoll,
            },
            {
                text: 'Open Camera',
                onPress: this.handleOpenCamera,
            },
        ]

        return (
            <>
                <BottomButtonsSheet
                    ref={(r) => (this.bottomSheetRef = r)}
                    buttons={options}
                    height={getButtonBottomSheetHeight(options.length)}
                />
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={this.handleImageIconOnClick}
                >
                    {/* <Image style={styles.mediaStyle} source={require("../../asset/icons/tribe_image_icon.png")} resizeMode="cover"/> */}
                    {imageUrl === undefined || imageUrl === null ? (
                        <Image
                            style={styles.mediaStyle}
                            source={require('../../asset/icons/tribe_image_icon.png')}
                            resizeMode="cover"
                        />
                    ) : (
                        <Image
                            style={styles.mediaStyle}
                            source={{ uri: imageUrl }}
                            resizeMode="cover"
                        />
                    )}
                    {/* <ImageBackground
                        style={styles.mediaStyle}
                        source={{ uri: imageUrl }}
                        imageStyle={{
                            borderRadius: 8,
                            opacity: 0.7,
                            resizeMode: 'contain',
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
                                    height: 30,
                                    width: 40,
                                    tintColor: '#fafafa',
                                    resizeMode: 'contain',
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
                    </ImageBackground> */}
                    {/* {this.renderImageModal(imageUrl)} */}
                </TouchableOpacity>
            </>
        )
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
        const titleText = <Text style={styles.titleTextStyle}>*Tribe Name</Text>
        return (
            <View style={{ marginBottom: 5, paddingLeft: 10, width: '82%' }}>
                {titleText}
                <Field
                    name="name"
                    label="name"
                    component={this.renderInput}
                    editable={!this.props.uploading}
                    numberOfLines={1}
                    multiline
                    style={styles.goalInputStyle}
                    placeholder="Tribe Name"
                />
            </View>
        )
    }
    renderInviteCode(handleSubmit) {
        // console.log('TEST TRIBE', this.props.tribeErr.message.includes('30'))
        const titleText = (
            <Text style={[styles.titleTextStyle, { paddingRight: 5 }]}>
                Invite Code:
            </Text>
        )
        const bottomText = (
            <Text
                style={[
                    styles.bottomTextStyle,
                    {
                        marginVertical: 3,
                        color: this.props.tribeErr?.message.includes('30')
                            ? 'red'
                            : 'grey',
                    },
                ]}
            >
                {this.props.tribeErr?.message.includes('30')
                    ? this.props.tribeErr?.message
                    : `Note- You may only change the Tribe Invite code once per 30 days.`}
            </Text>
        )
        return (
            <View
                style={{
                    marginBottom: 5,
                    marginTop: 5,
                    backgroundColor: 'white',
                    padding: 10,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {titleText}
                    <Tooltip
                        overlayColor="rgba(250, 250, 250, 0)"
                        height={70}
                        width={222}
                        backgroundColor="#42C0F5"
                        popover={
                            <Text style={{ fontSize: 12, color: 'white' }}>
                                Non-GoalMogul users can use this Tribe Invite
                                Code to sign up to join GoalMogul!
                            </Text>
                        }
                    >
                        <Image
                            source={require('../../asset/icons/question_mark.png')}
                            style={{
                                height: 18,
                                width: 18,
                                resizeMode: 'contain',
                            }}
                        />
                    </Tooltip>
                </View>
                <Field
                    name="tribeInviteCode"
                    label="tribeInviteCode"
                    component={this.renderInput}
                    editable={!this.props.uploading}
                    numberOfLines={1}
                    multiline
                    tribeInvite
                    style={styles.goalInputStyle}
                    placeholder="Invite Code"
                />
                {bottomText}
                {this.renderNextButton(handleSubmit)}
            </View>
        )
    }
    renderTribeGuidelines() {
        const titleText = (
            <Text style={styles.titleTextStyle}>*Tribe Guidelines:</Text>
        )
        return (
            <View
                style={{
                    marginBottom: 5,
                    marginTop: 5,
                    backgroundColor: 'white',
                }}
            >
                {titleText}
                <Field
                    name="guidelines"
                    label="guidelines"
                    component={this.renderInput}
                    editable={!this.props.uploading}
                    numberOfLines={1}
                    multiline
                    isDesc={true}
                    style={styles.goalInputStyle}
                    placeholder="Rules, guidelines"
                />
            </View>
        )
    }

    renderTribeMemberLimit() {
        const titleText = (
            <Text style={styles.subTitleTextStyle}>
                Member Limit (No Limit if left blank)
            </Text>
        )
        console.log(this.props)
        return (
            <View
                style={{
                    marginBottom: 5,
                    backgroundColor: 'white',
                    padding: 10,
                }}
            >
                {this.renderOptions()}

                {titleText}
                <Field
                    name="membershipLimit"
                    label="membershipLimit"
                    component={this.renderInput}
                    editable={!this.props.uploading}
                    numberOfLines={1}
                    keyboardType="number-pad"
                    style={styles.goalInputStyle}
                    placeholder="Default = 0 (No limit)"
                />
                <View
                    style={{
                        flexDirection: 'row',
                        marginVertical: 10,
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={[
                            styles.subTitleTextStyle,
                            { paddingRight: '28%' },
                        ]}
                    >
                        Members can invite their friends
                    </Text>
                    <ToggleSwitch
                        size="small"
                        isOn={this.props.isMemberInviteEnabled}
                        animationSpeed={100}
                        onToggle={() =>
                            this.props.change(
                                'isMemberInviteEnabled',
                                !this.props.isMemberInviteEnabled
                            )
                        }
                        thumbOffStyle={{
                            borderWidth: 1,
                            borderColor: '#45C9F6',
                            height: 21,
                            width: 21,
                            borderRadius: 20,
                            position: 'absolute',
                            left: -5,
                            backgroundColor: 'white',
                        }}
                        trackOffStyle={{
                            borderWidth: 2,
                            borderColor: '#45C9F6',
                            width: 40,
                            backgroundColor: 'white',
                        }}
                        thumbOnStyle={{
                            borderWidth: 0.5,
                            borderColor: '#45C9F6',
                            height: 21,
                            width: 21,
                            borderRadius: 20,
                            position: 'absolute',
                            left: -5,
                            backgroundColor: 'white',
                        }}
                        trackOnStyle={{
                            width: 40,
                            borderWidth: 2,
                            borderColor: '#45C9F6',
                            backgroundColor: '#45C9F6',
                        }}
                    />
                </View>
            </View>
        )
    }

    renderTribeDescription() {
        const titleText = (
            <Text style={styles.titleTextStyle}>*Description:</Text>
        )
        return (
            <View
                style={{
                    marginBottom: 5,
                    marginTop: 5,
                    backgroundColor: 'white',
                    padding: 10,
                }}
            >
                {titleText}
                <Field
                    name="description"
                    label="description"
                    component={this.renderInput}
                    editable={!this.props.uploading}
                    numberOfLines={5}
                    style={styles.goalInputStyle}
                    isDesc={true}
                    placeholder="Who is this tribe for and what is it about?"
                />
                {this.renderTribeCategory()}
                {this.renderTribeGuidelines()}
            </View>
        )
    }

    renderOptions() {
        const titleText = <Text style={styles.titleTextStyle}>*Privacy</Text>
        return (
            <View style={{ marginBottom: 5, backgroundColor: 'white' }}>
                {titleText}
                <View
                    style={{
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        marginTop: 10,
                        marginBottom: 15,
                    }}
                >
                    <Text
                        style={[
                            styles.subTitleTextStyle,
                            { fontWeight: '300', fontSize: 14, flex: 1 },
                        ]}
                    >
                        Tribe Visibility
                    </Text>
                    {/* <View style={{flexDirection:'row' ,alignItems:'center',justifyContent:'flex-end',flex:2,marginRight:'5%'}}>
                <Text style={[styles.subTitleTextStyle,{fontWeight:'300',fontSize:13}]}>Public</Text>
                <RadioButton
        value={true}
        uncheckedColor="#CCC"
        color="#42C0F5"
        status={ this.props.membersCanInvite === true ? 'checked' : 'unchecked' }
        onPress={() =>
            this.props.change(
                'membersCanInvite',
                true
            )}
      />
      <Text style={[styles.subTitleTextStyle,{fontWeight:'300',fontSize:13}]}>Private</Text>
      <RadioButton
        value={false}
        color="#42C0F5"
        uncheckedColor="#CCC"
        status={ this.props.membersCanInvite === false ? 'checked' : 'unchecked' }
        onPress={() =>
            this.props.change(
                'membersCanInvite',
                false
            )}
      />
                </View> */}
                    {/* <RadioForm
  radio_props={radio_props}
  formHorizontal={true}
  initial={0}
  buttonColor={'#42424273'}
  buttonSize={20}
  onPress={(value) => {
      console.log(value);
      this.props.change(
    'membersCanInvite',
    value===1?true:false)}}
/> */}
                    <RadioForm
                        formHorizontal={true}
                        animation={true}
                        style={{ marginRight: 20 }}
                    >
                        {/* To create radio buttons, loop through your array of options */}
                        {radio_props.map((obj, i) => {
                            var ind =
                                this.props.isPubliclyVisible === true ? 0 : 1
                            return (
                                <RadioButton labelHorizontal={true} key={i}>
                                    {/*  You can set RadioButtonLabel before RadioButtonInput */}
                                    <RadioButtonInput
                                        obj={obj}
                                        index={i}
                                        isSelected={ind === i}
                                        onPress={(value) => {
                                            console.log(value)
                                            this.props.change(
                                                'isPubliclyVisible',
                                                value === 1 ? true : false
                                            )
                                        }}
                                        borderWidth={1}
                                        buttonInnerColor={'#42C0F5'}
                                        buttonOuterColor={
                                            this.props.isPubliclyVisible ===
                                            true
                                                ? '#42C0F5'
                                                : '#42424273'
                                        }
                                        buttonSize={12}
                                        buttonOuterSize={16}
                                        buttonStyle={{}}
                                        buttonWrapStyle={{ marginLeft: 10 }}
                                    />
                                    <RadioButtonLabel
                                        obj={obj}
                                        index={i}
                                        labelHorizontal={true}
                                        onPress={(value) => {
                                            console.log(value)
                                            this.props.change(
                                                'isMemberInviteEnabled',
                                                value === 1 ? true : false
                                            )
                                        }}
                                        labelStyle={{
                                            fontSize: 14,
                                            color: '#000000',
                                            fontWeight: '500',
                                        }}
                                        labelWrapStyle={{}}
                                    />
                                </RadioButton>
                            )
                        })}
                    </RadioForm>
                </View>
                {/* <CheckBox
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
                /> */}
                {/* <CheckBox
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
                /> */}
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
                {/* {titleText} */}
                {this.renderMedia()}
                {/* {this.renderActionIcons()} */}
            </View>
        )
    }

    handleTribeCatogary = (value) => {
        this.props.change('category', value)
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
            this.props.category,
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
                    <Text style={styles.titleTextStyle}>*Category</Text>
                </View>

                {menu}
            </View>
        )
    }

    render() {
        const { handleSubmit, errors } = this.props
        const titleText = this.props.initializeFromState
            ? 'Edit Tribe'
            : 'New Tribe'

        console.log('THIS IS PROPSSS', this.props)

        return (
            <MenuProvider
                customStyles={{ backdrop: styles.backdrop }}
                skipInstanceCheck={true}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1, backgroundColor: '#E5E5E5' }}
                >
                    <ModalHeader
                        title={titleText}
                        // actionText={actionText}
                        onCancel={() => {
                            // const durationSec =
                            //     (new Date().getTime() -
                            //         this.startTime.getTime()) /
                            //     1000
                            // trackWithProperties(
                            //     this.props.initializeFromState
                            //         ? E.EDIT_TRIBE_MODAL_CANCELLED
                            //         : E.CREATE_TRIBE_MODAL_CANCELLED,
                            //     { DurationSec: durationSec }
                            // )
                            this.props.cancelCreatingNewTribe()
                        }}
                        // onAction={handleSubmit(this.handleCreate)}
                        // actionDisabled={this.props.uploading}
                    />

                    <ScrollView
                        style={{ borderTopColor: '#E5E5E5', borderTopWidth: 1 }}
                    >
                        <View style={{ flex: 1 }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    width: '100%',
                                    backgroundColor: 'white',
                                    padding: 10,
                                }}
                            >
                                {this.renderImageSelection()}
                                {this.renderTribeName()}
                            </View>
                            {this.renderTribeDescription()}
                            {this.renderTribeMemberLimit()}
                            {this.renderInviteCode(handleSubmit)}
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
    const { uploading, tribeErr } = state.newTribe

    return {
        user,
        profile,
        name: selector(state, 'name'),
        isMemberInviteEnabled: selector(state, 'isMemberInviteEnabled'),
        isAutoAcceptEnabled: selector(state, 'isAutoAcceptEnabled'),
        isPubliclyVisible: selector(state, 'isPubliclyVisible'),
        membershipLimit: selector(state, 'membershipLimit'),
        description: selector(state, 'description'),
        category: selector(state, 'category'),
        picture: selector(state, 'picture'),
        guidelines: selector(state, 'guidelines'),
        tribeInviteCode: selector(state, 'tribeInviteCode'),
        tribeErr: selector(state, 'tribeErr'),
        formVals: state.form.createTribeModal,
        uploading,
        tribeErr,
    }
}

export default connect(mapStateToProps, {
    cancelCreatingNewTribe,
    refreshTribeHub,
    createNewTribe,
    openCameraRoll,
    openCamera,
    clearTribeError,
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
        fontSize: 14,
        fontWeight: '700',
        padding: 2,
    },
    bottomTextStyle: {
        fontSize: 12,
        fontWeight: '400',
        padding: 2,
        color: 'grey',
        textAlign: 'center',
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
        fontSize: 14,
        fontWeight: '600',
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
        height: 65,
        width: 65,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 32.5,
        backgroundColor: '#4a4a4a',
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
                            color: 'black',
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
