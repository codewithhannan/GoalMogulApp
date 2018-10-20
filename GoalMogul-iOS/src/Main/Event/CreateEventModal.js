import React from 'react';
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
} from 'react-native';
import { connect } from 'react-redux';
import { CheckBox } from 'react-native-elements';
import moment from 'moment';
import {
  Field,
  reduxForm,
  formValueSelector,
  SubmissionError
} from 'redux-form';
import R from 'ramda';
import {
  MenuProvider,
} from 'react-native-popup-menu';

// Components
import ModalHeader from '../Common/Header/ModalHeader';

// Actions
import {
  cancelCreatingNewEvent,
  createNewEvent,
  eventToFormAdapter
} from '../../redux/modules/event/NewEventActions';
import { openCameraRoll, openCamera } from '../../actions';

// assets
import cancel from '../../asset/utils/cancel_no_background.png';
import camera from '../../asset/utils/camera.png';
import cameraRoll from '../../asset/utils/cameraRoll.png';
import photoIcon from '../../asset/utils/photoIcon.png';
import expand from '../../asset/utils/expand.png';

// const { Popover } = renderers;
const { width } = Dimensions.get('window');

class CreateEventModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mediaModal: false
    };
  }

  componentDidMount() {
    this.initializeForm();
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
    };

    // Initialize based on the props, if it's opened through edit button
    const { initializeFromState, event } = this.props;
    const initialVals = initializeFromState
      ? { ...eventToFormAdapter(event) }
      : { ...defaulVals };

    this.props.initialize({
      ...initialVals
    });
  }

  handleCreate = values => {
    const { initializeFromState, event, picture } = this.props;
    const eventId = event ? event._id : undefined;
    const needUpload =
      (initializeFromState && event.picture && event.picture !== picture)
      || (!initializeFromState && picture);
    this.props.createNewEvent(
      this.props.formVals.values,
      needUpload,
      initializeFromState, // isEdit
      eventId // eventId for updating
    );
  }

  handleOpenCamera = () => {
    this.props.openCamera((result) => {
      this.props.change('picture', result.uri);
    });
  }

  handleOpenCameraRoll = () => {
    const callback = R.curry((result) => {
      this.props.change('picture', result.uri);
    });
    this.props.openCameraRoll(callback);
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
    };

    let multiline = true;
    if (numberOfLines && numberOfLines === 1) {
      multiline = false;
    }
    return (
      <SafeAreaView
        style={{
          backgroundColor: 'white',
          borderBottomWidth: 0.5,
          margin: 5,
          borderColor: 'lightgray'
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
        />
      </SafeAreaView>
    );
  }

  // Renderer for timeline
  renderTimeline = () => {
    const titleText = <Text style={styles.titleTextStyle}>Timeline</Text>;
    if (!this.props.hasTimeline) {
      return (
        <View style={{ ...styles.sectionMargin }}>
          {titleText}
          <TouchableOpacity
            style={{
              height: 40,
              width: 90,
              backgroundColor: '#fafafa',
              borderRadius: 4,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 8
            }}
            onPress={() => this.props.change('hasTimeline', true)}
          >
            <Text style={{ padding: 10, fontSize: 13 }}>timeline</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const startDatePicker =
      (
        <Modal
          animationType="fade"
          transparent={false}
          visible={this.props.startTime.picker}
        >
          <ModalHeader
            title='Select start time'
            actionText='Done'
            onAction={() =>
              this.props.change('startTime', {
                date: this.props.startTime.date,
                picker: false
              })
            }
            onCancel={() =>
              this.props.change('startTime', {
                date: this.props.startTime.date,
                picker: false
              })
            }
          />
          <View style={{ flex: 1 }}>
            <DatePickerIOS
              date={this.props.startTime.date}
              onDateChange={(date) => this.props.change('startTime', { date, picker: true })}
            />
          </View>

        </Modal>
      );

      const endDatePicker =
        (
          <Modal
            animationType="fade"
            transparent={false}
            visible={this.props.endTime.picker}
          >
            <ModalHeader
              title='Select end time'
              actionText='Done'
              onAction={() => {
                this.props.change('endTime', {
                  date: this.props.endTime.date,
                  picker: false
                });
              }}
              onCancel={() =>
                this.props.change('endTime', {
                  date: this.props.endTime.date,
                  picker: false
                })
              }
            />
            <View style={{ flex: 1 }}>
              <DatePickerIOS
                date={this.props.endTime.date}
                onDateChange={(date) => this.props.change('endTime', { date, picker: true })}
              />
            </View>

          </Modal>
        );

    const startTime = this.props.startTime.date ?
      <Text>{moment(this.props.startTime.date).format('DD/MM/YYYY')}</Text> :
      <Text style={{ fontSize: 9 }}>Start</Text>;

    const endTime = this.props.endTime.date ?
      <Text>{moment(this.props.endTime.date).format('DD/MM/YYYY')}</Text> :
      <Text style={{ fontSize: 9 }}>End</Text>;

    return (
      <View style={{ ...styles.sectionMargin }}>
        {titleText}
        <View style={{ marginTop: 8, flexDirection: 'row' }}>
          <TouchableOpacity
            style={{
              height: 50,
              width: 130,
              alignItems: 'center',
              justifyContent: 'center',
              ...styles.borderStyle
            }}
            onPress={() =>
              this.props.change('startTime', {
                date: this.props.startTime.date ? this.props.startTime.date : new Date(),
                picker: true
              })
            }
          >
            {startTime}
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              height: 50,
              width: 130,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 15,
              ...styles.borderStyle
            }}
            onPress={() =>
              this.props.change('endTime', {
                date: this.props.endTime.date ? this.props.endTime.date : new Date(),
                picker: true
              })
            }
          >
            {endTime}
          </TouchableOpacity>

          <TouchableOpacity
            style={{ justifyContent: 'center', padding: 10 }}
            onPress={() => {
              this.props.change('hasTimeline', false);
              this.props.change('endTime', {
                date: undefined, picker: false
              });
              this.props.change('startTime', {
                date: undefined, picker: false
              });
            }}
          >
            <Image source={cancel} style={{ ...styles.cancelIconStyle }} />
          </TouchableOpacity>
        </View>
        {startDatePicker}
        {endDatePicker}
      </View>
    );
  }

  renderActionIcons() {
    const actionIconStyle = { ...styles.actionIconStyle };
    const actionIconWrapperStyle = { ...styles.actionIconWrapperStyle };
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
        <TouchableOpacity style={actionIconWrapperStyle} onPress={this.handleOpenCamera}>
          <Image style={actionIconStyle} source={camera} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...actionIconWrapperStyle, marginLeft: 5 }}
          onPress={this.handleOpenCameraRoll}
        >
          <Image style={actionIconStyle} source={cameraRoll} />
        </TouchableOpacity>
      </View>
    );
  }

  // Current media type is only picture
  renderMedia() {
    const { initializeFromState, event, picture } = this.props;
    let imageUrl = picture;
    if (initializeFromState && picture) {
      const hasImageModified = event.picture && event.picture !== picture;
      if (!hasImageModified) {
        // If editing a tribe and image hasn't changed, then image source should
        // be from server
        imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${picture}`;
      }
    }

    if (picture) {
      return (
        <ImageBackground
          style={styles.mediaStyle}
          source={{ uri: imageUrl }}
          imageStyle={{ borderRadius: 8, opacity: 0.7, resizeMode: 'cover' }}
        >
          <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
            <Image
              source={photoIcon}
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                height: 40,
                width: 50,
                tintColor: '#fafafa'
              }}
            />
          </View>

          <TouchableOpacity
            onPress={() => this.setState({ mediaModal: true })}
            style={{ position: 'absolute', top: 10, right: 15 }}
          >
            <Image
              source={expand}
              style={{ width: 15, height: 15, tintColor: '#fafafa' }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.change('picture', false)}
            style={{ position: 'absolute', top: 10, left: 15 }}
          >
            <Image
              source={cancel}
              style={{ width: 15, height: 15, tintColor: '#fafafa' }}
            />
          </TouchableOpacity>
        </ImageBackground>
      );
    }
    return '';
  }

  renderImageModal() {
    if (this.props.picture) {
      return (
        <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.mediaModal}
        >
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'black'
            }}
          >
            <TouchableOpacity
              onPress={() => { this.setState({ mediaModal: false }); }}
              style={{ position: 'absolute', top: 30, left: 15, padding: 10 }}
            >
              <Image
                source={cancel}
                style={{
                  ...styles.cancelIconStyle,
                  tintColor: 'white'
                }}
              />
            </TouchableOpacity>
            <Image
              source={{ uri: this.props.picture }}
              style={{ width, height: 200 }}
              resizeMode='cover'
            />
          </View>
        </Modal>
      );
    }
    return '';
  }

  renderEventTitle() {
    const titleText = <Text style={styles.titleTextStyle}>Event Title</Text>;
    return (
      <View style={{ marginBottom: 5 }}>
        {titleText}
        <Field
          name='title'
          label='title'
          component={this.renderInput}
          editable={!this.props.uploading}
          numberOfLines={1}
          multiline
          style={styles.goalInputStyle}
          placeholder='Enter the title...'
        />
      </View>
    );
  }

  renderEventLocation() {
    const titleText = <Text style={styles.titleTextStyle}>Event Location</Text>;
    return (
      <View style={{ marginBottom: 5 }}>
        {titleText}
        <Field
          name='location'
          label='location'
          component={this.renderInput}
          editable={!this.props.uploading}
          numberOfLines={1}
          keyboardType='default'
          style={styles.goalInputStyle}
          placeholder='Enter the location...'
        />
      </View>
    );
  }

  renderEventDescription() {
    const titleText = <Text style={styles.titleTextStyle}>Description</Text>;
    return (
      <View style={{ marginBottom: 5 }}>
        {titleText}
        <Field
          name='description'
          label='description'
          component={this.renderInput}
          editable={!this.props.uploading}
          numberOfLines={5}
          style={styles.goalInputStyle}
          placeholder='Describe your event...'
        />
      </View>
    );
  }

  renderOptions() {
    return (
      <View>
        <CheckBox
          title='Participants can invite'
          checked={this.props.participantsCanInvite}
          onPress={() =>
            this.props.change('participantsCanInvite', !this.props.participantsCanInvite)
          }
        />
        <CheckBox
          title='Invite only'
          checked={this.props.isInviteOnly}
          onPress={() => this.props.change('isInviteOnly', !this.props.isInviteOnly)}
        />
      </View>
    );
  }

  render() {
    const { handleSubmit, errors } = this.props;
    const actionText = this.props.initializeFromState ? 'Update' : 'Create';
    const titleText = this.props.initializeFromState ? 'Edit Event' : 'New Event';

    return (
      <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
        <KeyboardAvoidingView
          behavior='padding'
          style={{ flex: 1, backgroundColor: '#ffffff' }}
        >
          <ModalHeader
            title={titleText}
            actionText={actionText}
            onCancel={() => this.props.cancelCreatingNewEvent()}
            onAction={handleSubmit(this.handleCreate)}
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
              {this.renderMedia()}
              {this.renderActionIcons()}
            </View>

          </ScrollView>
          {this.renderImageModal()}
        </KeyboardAvoidingView>
      </MenuProvider>
    );
  }
}

CreateEventModal = reduxForm({
  form: 'createEventModal',
  enableReinitialize: true
})(CreateEventModal);

const mapStateToProps = state => {
  const selector = formValueSelector('createEventModal');
  const { user } = state.user;
  const { profile } = user;
  const { uploading } = state.newTribe;

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
    uploading
  };
};

export default connect(
  mapStateToProps,
  {
    cancelCreatingNewEvent,
    createNewEvent,
    openCameraRoll,
    openCamera,
  }
)(CreateEventModal);

const styles = {
  sectionMargin: {
    marginTop: 10,
    marginBottom: 10
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
    padding: 2
  },
  standardInputStyle: {
    flex: 1,
    fontSize: 12,
    padding: 13,
    paddingRight: 14,
    paddingLeft: 14
  },
  goalInputStyle: {
    fontSize: 20,
    padding: 20,
    paddingRight: 15,
    paddingLeft: 15
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
    justifyContent: 'flex-end'
  },
  mediaStyle: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionIconWrapperStyle: {
    backgroundColor: '#fafafa',
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4
  },
  actionIconStyle: {
    tintColor: '#4a4a4a',
    height: 15,
    width: 18
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
    backgroundColor: 'transparent'
  }
};
