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
    DatePickerIOS,
} from 'react-native'
import { connect } from 'react-redux'
import { CheckBox } from 'react-native-elements'
import moment from 'moment'
import { MaterialIcons } from '@expo/vector-icons'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import R from 'ramda'
import { MenuProvider } from 'react-native-popup-menu'
import DateTimePicker from 'react-native-modal-datetime-picker'

// Components
import ModalHeader from '../Common/Header/ModalHeader'
import ImageModal from '../Common/ImageModal'

// Actions
import {
    cancelCreatingNewEvent,
    createNewEvent,
    eventToFormAdapter,
} from '../../redux/modules/event/NewEventActions'
import { openCameraRoll, openCamera } from '../../actions'

// assets
import cancel from '../../asset/utils/cancel_no_background.png'
import camera from '../../asset/utils/camera.png'
import cameraRoll from '../../asset/utils/cameraRoll.png'
import imageOverlay from '../../asset/utils/imageOverlay.png'
import expand from '../../asset/utils/expand.png'

// Constants
import { IMAGE_BASE_URL } from '../../Utils/Constants'
import {
    track,
    trackWithProperties,
    EVENT as E,
} from '../../monitoring/segment'

// const { Popover } = renderers;
const { width } = Dimensions.get('window')
const DEBUG_KEY = '[ UI CreateEventModal ]'

class CreateEventModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mediaModal: false,
        }
    }

    componentDidMount() {
        this.startTime = new Date()
        track(
            this.props.initializeFromState
                ? E.EDIT_EVENT_MODAL_OPENED
                : E.CREATE_EVENT_MODAL_OPENED
        )
        this.initializeForm()
    }

    initializeForm() {
        const defaulVals = {
            title: '',
            participantsCanInvite: false,
            isInviteOnly: false,
            location: '',
            description: '',
            startTime: { date: new Date(), picker: false },
            endTime: { date: new Date(), picker: false },
            picture: undefined,
        }

        // Initialize based on the props, if it's opened through edit button
        const { initializeFromState, event } = this.props
        // console.log(`${DEBUG_KEY}: initializeFromState: `, initializeFromState);
        // console.log(`${DEBUG_KEY}: event: `, event);
        const initialVals = initializeFromState
            ? { ...eventToFormAdapter(event) }
            : { ...defaulVals }

        this.props.initialize({
            ...initialVals,
        })
    }

    handleCreate = (values) => {
        const { initializeFromState, event, picture } = this.props
        const eventId = event ? event._id : undefined
        const needUpload =
            (initializeFromState &&
                event.picture &&
                event.picture !== picture) ||
            (!initializeFromState && picture)

        const { startTime, endTime } = this.props.formVals.values
        const { isValid, callback } = isTimeValid(startTime.date, endTime.date)

        if (!isValid) {
            callback()
            return
        }

        const durationSec =
            (new Date().getTime() - this.startTime.getTime()) / 1000
        trackWithProperties(
            initializeFromState ? E.EVENT_EDITED : E.EVENT_CREATED,
            { ...this.props.formVals.values, DurationSec: durationSec }
        )

        this.props.createNewEvent(
            this.props.formVals.values,
            needUpload,
            initializeFromState, // isEdit
            eventId // eventId for updating
        )
    }

    handleOpenCamera = () => {
        this.props.openCamera((result) => {
            this.props.change('picture', result.uri)
        })
    }

    handleOpenCameraRoll = () => {
        const callback = R.curry((result) => {
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
                    autoCorrect
                    keyboardType={keyboardType || 'default'}
                    multiline={multiline}
                    value={value}
                />
            </SafeAreaView>
        )
    }

    // Renderer for timeline
    renderTimeline = () => {
        const titleText = <Text style={styles.titleTextStyle}>Timeline</Text>
        // Timeline is required to create an event
        // if (!this.props.hasTimeline) {
        //   return (
        //     <View style={{ ...styles.sectionMargin }}>
        //       {titleText}
        //       <TouchableOpacity activeOpacity={0.6}
        //         style={{
        //           height: 40,
        //           width: 90,
        //           backgroundColor: '#fafafa',
        //           borderRadius: 4,
        //           alignItems: 'center',
        //           justifyContent: 'center',
        //           marginTop: 8,
        //           flexDirection: 'row',
        //           padding: 10
        //         }}
        //         onPress={() => this.props.change('hasTimeline', true)}
        //       >
        //         <Image source={plus} style={{ height: 11, width: 11 }} />
        //         <Text style={{ fontSize: 14, fontWeight: '600', marginLeft: 4 }}>
        //           timeline
        //         </Text>
        //       </TouchableOpacity>
        //     </View>
        //   );
        // }
        if (this.props.startTime === undefined) return

        const newPicker = true
        const startDatePicker = newPicker ? (
            <DateTimePicker
                isVisible={this.props.startTime.picker}
                date={
                    this.props.startTime && this.props.startTime.date
                        ? this.props.startTime.date
                        : new Date()
                }
                mode="datetime"
                onConfirm={(date) => {
                    if (!validateTime(date, this.props.endTime.date)) {
                        // If start date is later than end date, set the end date to
                        // be the same as start date
                        this.props.change('endTime', { date, picker: false })
                    }
                    // alert('Start time cannot be later than end time');
                    this.props.change('startTime', { date, picker: false })
                }}
                onCancel={() =>
                    this.props.change('startTime', {
                        date: this.props.startTime.date,
                        picker: false,
                    })
                }
            />
        ) : (
            <Modal
                animationType="fade"
                transparent={false}
                visible={this.props.startTime.picker}
            >
                <ModalHeader
                    title="Select start time"
                    actionText="Done"
                    onAction={() =>
                        this.props.change('startTime', {
                            date: this.props.startTime.date,
                            picker: false,
                        })
                    }
                    onCancel={() =>
                        this.props.change('startTime', {
                            date: this.props.startTime.date,
                            picker: false,
                        })
                    }
                />
                <View style={{ flex: 1 }}>
                    <DatePickerIOS
                        date={this.props.startTime.date}
                        onDateChange={(date) =>
                            this.props.change('startTime', {
                                date,
                                picker: true,
                            })
                        }
                    />
                </View>
            </Modal>
        )

        const endDatePicker = newPicker ? (
            <DateTimePicker
                isVisible={this.props.endTime.picker}
                date={
                    this.props.endTime && this.props.endTime.date
                        ? this.props.endTime.date
                        : new Date()
                }
                mode="datetime"
                onConfirm={(date) => {
                    if (!validateTime(this.props.startTime.date, date)) {
                        // If end date is early than start date, set the start date to
                        // be the same as end date
                        this.props.change('startTime', { date, picker: false })
                    }
                    // alert('End time cannot be early than start time');
                    this.props.change('endTime', { date, picker: false })
                }}
                onCancel={() =>
                    this.props.change('endTime', {
                        date: this.props.endTime.date,
                        picker: false,
                    })
                }
            />
        ) : (
            <Modal
                animationType="fade"
                transparent={false}
                visible={this.props.endTime.picker}
            >
                <ModalHeader
                    title="Select end time"
                    actionText="Done"
                    onAction={() => {
                        this.props.change('endTime', {
                            date: this.props.endTime.date,
                            picker: false,
                        })
                    }}
                    onCancel={() =>
                        this.props.change('endTime', {
                            date: this.props.endTime.date,
                            picker: false,
                        })
                    }
                />
                <View style={{ flex: 1 }}>
                    <DatePickerIOS
                        date={this.props.endTime.date}
                        onDateChange={(date) =>
                            this.props.change('endTime', { date, picker: true })
                        }
                    />
                </View>
            </Modal>
        )

        const startTime = this.props.startTime.date ? (
            <View>
                <Text>{moment(this.props.startTime.date).format('LL')}</Text>
                <Text>{moment(this.props.startTime.date).format('LT')}</Text>
            </View>
        ) : (
            <Text style={{ fontSize: 15 }}>Start</Text>
        )

        const endTime = this.props.endTime.date ? (
            <View>
                <Text>{moment(this.props.endTime.date).format('LL')}</Text>
                <Text>{moment(this.props.endTime.date).format('LT')}</Text>
            </View>
        ) : (
            <Text style={{ fontSize: 15 }}>End</Text>
        )

        // Show cancel button if there is date set
        const cancelButton =
            this.props.endTime.date || this.props.startTime.date ? (
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={{
                        justifyContent: 'center',
                        padding: 10,
                        marginLeft: 5,
                    }}
                    onPress={() => {
                        this.props.change('hasTimeline', false)
                        this.props.change('endTime', {
                            date: undefined,
                            picker: false,
                        })
                        this.props.change('startTime', {
                            date: undefined,
                            picker: false,
                        })
                    }}
                >
                    <Image
                        source={cancel}
                        style={{ ...styles.cancelIconStyle }}
                    />
                </TouchableOpacity>
            ) : null

        return (
            <View style={{ ...styles.sectionMargin }}>
                {titleText}
                <View
                    style={{
                        marginTop: 8,
                        marginLeft: 10,
                        flexDirection: 'row',
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={0.6}
                        style={{
                            height: 50,
                            width: 130,
                            alignItems: 'center',
                            justifyContent: 'center',
                            ...styles.borderStyle,
                        }}
                        onPress={() =>
                            this.props.change('startTime', {
                                date: this.props.startTime.date
                                    ? this.props.startTime.date
                                    : new Date(),
                                picker: true,
                            })
                        }
                    >
                        {startTime}
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.6}
                        style={{
                            height: 50,
                            width: 130,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: 15,
                            ...styles.borderStyle,
                        }}
                        onPress={() =>
                            this.props.change('endTime', {
                                date: this.props.endTime.date
                                    ? this.props.endTime.date
                                    : new Date(),
                                picker: true,
                            })
                        }
                    >
                        {endTime}
                    </TouchableOpacity>

                    {cancelButton}
                </View>
                {startDatePicker}
                {endDatePicker}
            </View>
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
        const { initializeFromState, event, picture } = this.props
        let imageUrl = picture
        if (initializeFromState && picture) {
            const hasImageModified = event.picture && event.picture !== picture
            if (!hasImageModified) {
                // If editing a tribe and image hasn't changed, then image source should
                // be from server
                imageUrl = `${IMAGE_BASE_URL}${picture}`
            }
        }

        if (picture) {
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
        const { initializeFromState, event, picture } = this.props

        return (
            <ImageModal
                mediaRef={imageUrl}
                mediaModal={this.state.mediaModal}
                closeModal={() => this.setState({ mediaModal: false })}
                isLocalFile={
                    !(
                        initializeFromState &&
                        event.picture &&
                        event.picture === picture
                    )
                }
            />
        )
    }

    renderEventTitle() {
        const titleText = <Text style={styles.titleTextStyle}>Event Title</Text>
        return (
            <View style={{ marginBottom: 5 }}>
                {titleText}
                <Field
                    name="title"
                    label="title"
                    component={this.renderInput}
                    editable={!this.props.uploading}
                    numberOfLines={1}
                    multiline
                    style={styles.goalInputStyle}
                    placeholder="Enter the title..."
                />
            </View>
        )
    }

    renderEventLocation() {
        const titleText = (
            <Text style={styles.titleTextStyle}>Event Location</Text>
        )
        return (
            <View style={{ marginBottom: 5 }}>
                {titleText}
                <Field
                    name="location"
                    label="location"
                    component={this.renderInput}
                    editable={!this.props.uploading}
                    numberOfLines={1}
                    keyboardType="default"
                    style={styles.goalInputStyle}
                    placeholder="Enter the location..."
                />
            </View>
        )
    }

    renderEventDescription() {
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
                    placeholder="Describe your event..."
                />
            </View>
        )
    }

    renderOptions() {
        const participantOptions = this.props.isInviteOnly ? (
            <CheckBox
                title="Participants can invite others"
                textStyle={{ fontWeight: 'normal' }}
                checked={this.props.participantsCanInvite}
                checkedIcon={
                    <MaterialIcons name="done" color="#111" size={21} />
                }
                uncheckedIcon={
                    <MaterialIcons name="done" color="#CCC" size={21} />
                }
                onPress={() =>
                    this.props.change(
                        'participantsCanInvite',
                        !this.props.participantsCanInvite
                    )
                }
            />
        ) : null
        return (
            <View>
                <CheckBox
                    title="Invite only"
                    textStyle={{ fontWeight: 'normal' }}
                    checked={this.props.isInviteOnly}
                    checkedIcon={
                        <MaterialIcons name="done" color="#111" size={21} />
                    }
                    uncheckedIcon={
                        <MaterialIcons name="done" color="#CCC" size={21} />
                    }
                    onPress={() =>
                        this.props.change(
                            'isInviteOnly',
                            !this.props.isInviteOnly
                        )
                    }
                />
                {participantOptions}
            </View>
        )
    }

    // Render field to select an image for event
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

    render() {
        const { handleSubmit, errors } = this.props
        const actionText = this.props.initializeFromState ? 'Update' : 'Create'
        const titleText = this.props.initializeFromState
            ? 'Edit Event'
            : 'New Event'

        return (
            <MenuProvider
                customStyles={{ backdrop: styles.backdrop }}
                skipInstanceCheck={true}
            >
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
                                    ? E.EDIT_EVENT_MODAL_CANCELLED
                                    : E.CREATE_EVENT_MODAL_CANCELLED,
                                { DurationSec: durationSec }
                            )
                            this.props.cancelCreatingNewEvent()
                        }}
                        onAction={handleSubmit(this.handleCreate)}
                        actionDisabled={this.props.uploading}
                    />
                    <ScrollView
                        style={{ borderTopColor: '#e9e9e9', borderTopWidth: 1 }}
                    >
                        <View style={{ flex: 1, padding: 20 }}>
                            {this.renderEventTitle()}
                            {this.renderEventDescription()}
                            {this.renderEventLocation()}
                            {this.renderTimeline()}
                            {this.renderOptions()}
                            {this.renderImageSelection()}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </MenuProvider>
        )
    }
}

const validateTime = (start, end) => {
    if (!start || !end) return true
    if (moment(start) > moment(end)) return false
    return true
}

const isTimeValid = (start, end) => {
    let ret = { isValid: true }

    if (!start) {
        ret = {
            isValid: false,
            callback: () => {
                alert('Missing start time')
            },
        }
        return ret
    }

    if (!end) {
        ret = {
            isValid: false,
            callback: () => {
                alert('Missing end time')
            },
        }
        return ret
    }

    if (moment(start) > moment(end)) {
        ret = {
            isValid: false,
            callback: () => {
                alert('End time should be early than start time')
            },
        }
        return ret
    }

    return {
        isValid: true,
    }
}

CreateEventModal = reduxForm({
    form: 'createEventModal',
    enableReinitialize: true,
})(CreateEventModal)

const mapStateToProps = (state) => {
    const selector = formValueSelector('createEventModal')
    const { user } = state.user
    const { profile } = user
    const { uploading } = state.newEvent

    return {
        user,
        profile,
        title: selector(state, 'title'),
        // start: selector(state, 'start'),
        // durationHours: selector(state, 'durationHours'),
        startTime: selector(state, 'startTime'),
        endTime: selector(state, 'endTime'),
        participantsCanInvite: selector(state, 'participantsCanInvite'),
        isInviteOnly: selector(state, 'isInviteOnly'),
        location: selector(state, 'location'),
        description: selector(state, 'description'),
        picture: selector(state, 'picture'),
        hasTimeline: selector(state, 'hasTimeline'),
        formVals: state.form.createEventModal,
        uploading,
    }
}

export default connect(mapStateToProps, {
    cancelCreatingNewEvent,
    createNewEvent,
    openCameraRoll,
    openCamera,
})(CreateEventModal)

const styles = {
    sectionMargin: {
        marginTop: 10,
        marginBottom: 10,
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
    cancelIconStyle: {
        height: 20,
        width: 20,
        justifyContent: 'flex-end',
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
