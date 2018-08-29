import React, { Component } from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  DatePickerIOS,
  Modal,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
  FieldArray,
  Field,
  reduxForm,
  formValueSelector,
  SubmissionError,
  reset
} from 'redux-form';
import R from 'ramda';
import moment from 'moment';
import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';

// Components
import ModalHeader from '../Common/Header/ModalHeader';
import Button from './Button';
import InputField from '../Common/TextInput/InputField';
import ViewableSettingMenu from './ViewableSettingMenu';

// assets
import defaultUserProfile from '../../asset/utils/defaultUserProfile.png';
import plus from '../../asset/utils/plus.png';
import cancel from '../../asset/utils/cancel_no_background.png';
import dropDown from '../../asset/utils/dropDown.png';

// Actions
// import { } from '../../actions';
import {
  validate,
  submitGoal
} from '../../redux/modules/goal/CreateGoalActions';

const { Popover } = renderers;
const { width } = Dimensions.get('window');

const STEP_PLACE_HOLDER = 'Add an important step to achieving your goal...';
const NEED_PLACE_HOLDER = 'Something you\'re specifically looking for help with';

class CreateGoalModal extends Component {

  componentDidMount() {
    this.initializeForm();
  }

  initializeForm() {
    const values = [{}];

    this.props.initialize({
      steps: [...values],
      needs: [...values],
      shareToMastermind: true,
      category: 'General',
      privacy: 'Friends',
      priority: 1,
      hasTimeline: false,
      startTime: { date: undefined, picker: false },
      endTime: { date: undefined, picker: false },
      title: ''
    });
  }

  handleCatergoryOnSelect = (value) => {
    console.log('category selected is: ', value);
    this.props.change('category', value);
  }

  handlePriorityOnSelect = (value) => {
    console.log('priority selected is: ', value);
    this.props.change('priority', value);
  }

  // Goal creation handler
  /**
   * This is a hacky solution due to the fact that redux-form
   * handleSubmit values differ from the values actually stored.
   * NOTE:
   * Verify by comparing
   * console.log('handleSubmit passed in values are: ', values);
   * console.log('form state values: ', this.props.formVals);
   *
   * Synchronize validate form values, contains simple check
   */
  handleCreate = values => {
    const errors = validate(this.props.formVals.values);
    console.log('values are: ', this.props.formVals.values);
    if (!(Object.keys(errors).length === 0 && errors.constructor === Object)) {
      // throw new SubmissionError(errors);
      return Alert.alert('Error', 'You have incomplete fields.');
    }
    return this.props.submitGoal(
      this.props.formVals.values,
      this.props.user._id,
      () => {
        Actions.pop();
      }
    );
  }

  renderUserInfo() {
    let imageUrl = this.props.user.profile.image;
    let profileImage =
      <Image style={styles.imageStyle} resizeMode='contain' source={defaultUserProfile} />;
    if (imageUrl) {
      imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${imageUrl}`;
      profileImage = <Image style={styles.imageStyle} source={{ uri: imageUrl }} />;
    }
    const callback = R.curry((value) => this.props.change('privacy', value));
    const shareToMastermindCallback = R.curry((value) => this.props.change('shareToMastermind', value));
    return (
      <View style={{ flexDirection: 'row', marginBottom: 15 }}>
        {profileImage}
        <View style={{ marginLeft: 15 }}>
          <Text style={{ fontSize: 18, marginBottom: 8 }}>
            Jordan Gardener
          </Text>
          <ViewableSettingMenu
            viewableSetting={this.props.privacy}
            callback={callback}
            shareToMastermind={this.props.shareToMastermind}
            shareToMastermindCallback={shareToMastermindCallback}
          />
        </View>
      </View>
    );
  }

  renderGoal() {
    const titleText = <Text style={styles.titleTextStyle}>Your Goal</Text>;
    return (
      <View>
        {titleText}
        <Field
          name='title'
          label='title'
          component={InputField}
          editable={this.props.uploading}
          numberOfLines={4}
          style={styles.goalInputStyle}
          placeholder='What are you trying to achieve?'
        />
      </View>
    );
  }

  renderGoalDescription = ({ fields, meta: { error, submitFailed } }) => {
    const button = fields.length > 0 ?
      <Button text='remove description' source={cancel} onPress={() => fields.remove(0)} />
      :
      <Button text='detailed description' source={plus} onPress={() => fields.push({})} />;
    return (
      <View style={{ marginTop: 10 }}>
        {
          fields.map((description, index) => {
            return (
              <Field
                key={`description-${index}`}
                name={description}
                component={InputField}
                editable
                numberOfLines={4}
                style={styles.standardInputStyle}
              />
            );
          })
        }
        {button}
      </View>
    );
  }

  renderCategory = () => {
    const titleText = <Text style={styles.titleTextStyle}>Category</Text>;

    const menu = MenuFactory(
      [
        'General',
        'Learning/Education',
        'Career/Business',
        'Financial',
        'Spiritual',
        'Family/Personal'
      ],
      this.handleCatergoryOnSelect,
      this.props.category,
      { ...styles.triggerContainerStyle },
      () => console.log('animationCallback')
      // () => this.scrollView.scrollTo({ x: 0, y: 50, animated: true })
    );

    return (
      <View style={{ ...styles.sectionMargin }}>
        {titleText}
        {menu}
      </View>
    );
  }

  renderPriority = () => {
    const titleText = <Text style={styles.titleTextStyle}>Priority</Text>;

    const menu = MenuFactory(
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      this.handlePriorityOnSelect,
      this.props.priority,
      { ...styles.triggerContainerStyle, width: 80 },
      () => console.log('animationCallback')
      // () => this.scrollView.scrollTo({ x: 0, y: 50, animated: true })
    );

    return (
      <View style={{ ...styles.sectionMargin }}>
        {titleText}
        {menu}
      </View>
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
              mode='date'
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
              onAction={() =>
                this.props.change('endTime', {
                  date: this.props.endTime.date,
                  picker: false
                })
              }
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
                mode='date'
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

  renderFieldArray = (title, buttonText, placeholder, fields, error) => {
    const button = <Button text={buttonText} source={plus} onPress={() => fields.push()} />;
    const titleText = <Text style={styles.titleTextStyle}>{title}</Text>;
    return (
      <View style={{ ...styles.sectionMargin }}>
        {titleText}
        {
          fields.map((field, index) => {
            const iconOnPress = index === 0 ?
              undefined
              :
              () => fields.remove(index);
            return (
              <Field
                key={`description-${index}`}
                name={field}
                component={InputField}
                editable
                numberOfLines={4}
                style={styles.standardInputStyle}
                placeholder={placeholder}
                iconSource={cancel}
                iconStyle={styles.cancelIconStyle}
                iconOnPress={iconOnPress}
              />
            );
          })
        }
        {button}
      </View>
    );
  }

  renderSteps = ({ fields, meta: { error, submitFailed } }) => {
    return this.renderFieldArray('Steps', 'step', STEP_PLACE_HOLDER, fields, error);
  }

  renderNeeds = ({ fields, meta: { error, submitFailed } }) => {
    return this.renderFieldArray('Needs (optional)', 'need', NEED_PLACE_HOLDER, fields, error);
  }

  render() {
    const { handleSubmit, errors } = this.props;
    return (
      <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
        <KeyboardAvoidingView
          behavior='padding'
          style={{ flex: 1, backgroundColor: '#ffffff' }}
        >
          <ModalHeader
            title='New Goal'
            actionText='Create'
            onCancel={() => Actions.pop()}
            onAction={handleSubmit(this.handleCreate)}
          />
          <ScrollView
            style={{ borderTopColor: '#e9e9e9', borderTopWidth: 1 }}
          >
            <View style={{ flex: 1, padding: 20 }}>
              {this.renderUserInfo()}
              {this.renderGoal()}
              <FieldArray name="description" component={this.renderGoalDescription} />
              {this.renderCategory()}
              {this.renderPriority()}
              {this.renderTimeline()}
              <FieldArray name="steps" component={this.renderSteps} />
              <FieldArray name="needs" component={this.renderNeeds} />
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </MenuProvider>
    );
  }
}

const styles = {
  sectionMargin: {
    marginTop: 20
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
    padding: 30,
    paddingRight: 20,
    paddingLeft: 20
  },
  cancelIconStyle: {
    height: 13,
    width: 13,
    justifyContent: 'flex-end'
  },
  caretStyle: {
    marginRight: 10,
    height: 18,
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
  },
  triggerContainerStyle: {
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
  anchorStyle: {
    backgroundColor: 'white'
  },
  menuOptionsStyles: {
    optionsContainer: {
      width: width - 14,
    },
    optionsWrapper: {

    },
    optionWrapper: {
      flex: 1,
    },
    optionTouchable: {
      underlayColor: 'lightgray',
      activeOpacity: 10,
    },
    optionText: {
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 10,
      paddingRight: 10,
      color: 'black',
    },
  }
};

CreateGoalModal = reduxForm({
  form: 'createGoalModal',
  enableReinitialize: true
})(CreateGoalModal);

const mapStateToProps = state => {
  const selector = formValueSelector('createGoalModal');
  const { user } = state.user;
  const { profile } = user;

  return {
    user,
    profile,
    category: selector(state, 'category'),
    privacy: selector(state, 'privacy'),
    priority: selector(state, 'priority'),
    shareToMastermind: selector(state, 'shareToMastermind'),
    hasTimeline: selector(state, 'hasTimeline'),
    startTime: selector(state, 'startTime'),
    endTime: selector(state, 'endTime'),
    formVals: state.form.createGoalModal
  };
};

export default connect(
  mapStateToProps,
  {
    submitGoal
  }
)(CreateGoalModal);

const MenuFactory = (options, callback, triggerText, triggerContainerStyle, animationCallback) => {

  return (
    <Menu
      onSelect={value => callback(value)}
      rendererProps={{ placement: 'bottom', anchorStyle: styles.anchorStyle }}
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
            style={{ fontSize: 15, margin: 10, marginLeft: 15, flex: 1 }}
          >
            {triggerText}
          </Text>
          <Image style={styles.caretStyle} source={dropDown} />
        </View>
      </MenuTrigger>
      <MenuOptions customStyles={styles.menuOptionsStyles}>
        <FlatList
          data={options}
          renderItem={({ item }) => (
            <MenuOption value={item} text={item} />
          )}
          keyExtractor={(item, index) => index.toString()}
          style={{ height: 200 }}
        />
      </MenuOptions>
    </Menu>
  );
};
