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
  Alert,
  TextInput,
  SafeAreaView
} from 'react-native';
import _ from 'lodash';
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
import Slider from 'react-native-slider';
import DraggableFlatlist from 'react-native-draggable-flatlist';

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
  submitGoal,
  goalToFormAdaptor
} from '../../redux/modules/goal/CreateGoalActions';

// Selector
import {
  getGoalDetailByTab
} from '../../redux/modules/goal/selector';

const { Popover } = renderers;
const { width } = Dimensions.get('window');

const STEP_PLACE_HOLDER = 'Add an important step to achieving your goal...';
const NEED_PLACE_HOLDER = 'Something you\'re specifically looking for help with';

class CreateGoalModal extends Component {
  constructor(props) {
    super(props);
    this.initializeForm();
    this.state = {
      scrollEnabled: true
    };
  }

  componentDidMount() {
    this.initializeForm();
  }

  initializeForm() {
    const values = [{}];
    const defaulVals = {
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
    };

    // Initialize based on the props, if it's opened through edit button
    const { initializeFromState, goal } = this.props;
    const initialVals = initializeFromState
      ? { ...goalToFormAdaptor(goal) }
      : { ...defaulVals };

    this.props.initialize({
      ...initialVals
    });
  }

  handleCatergoryOnSelect = (value) => {
    console.log('category selected is: ', value);
    this.props.change('category', value);
  }

  handlePriorityOnSelect = (value) => {
    // console.log('priority selected is: ', value);
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

    const { goal, initializeFromState, uploading } = this.props;
    if (!uploading) return; // when uploading is false, it's actually uploading.
    const goalId = goal ? goal._id : undefined;

    return this.props.submitGoal(
      this.props.formVals.values,
      this.props.user._id,
      initializeFromState,
      () => {
        Actions.pop();
      },
      goalId
    );
  }

  /**
   * This is added on ms2 polish as a new way to render textinput
   */
  renderInput = (props) => {
    const {
      input: { onFocus, value, onChange, ...restInput },
      multiline,
      editable,
      numberOfLines,
      placeholder,
      style,
      maxHeight,
      meta: { touched, error },
      ...custom
    } = props;

    return (
      <View style={styles.inputContainerStyle}>
        <TextInput
          placeholder={placeholder}
          onChangeText={(val) => onChange(val)}
          style={style}
          editable={editable}
          maxHeight={maxHeight}
          multiline={multiline}
          minHeight={70}
          value={_.isEmpty(value) ? '' : value}
        />
      </View>
    );
  }

  renderUserInfo(user) {
    if (!user) return '';
    let imageUrl = user.profile.image;
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
            {user.name}
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

    const fieldsComponet = fields.length > 0 ?
      fields.map((description, index) => {
        return (
          <Field
            key={`goal-description-${index}`}
            name={description}
            component={this.renderInput}
            editable={this.props.uploading}
            style={styles.standardInputStyle}
            placeholder="Decribe your goal"
            multiline
            maxHeight={200}
          />
        );
      }) : '';
    return (
      <View style={{ marginTop: 10 }}>
        {fieldsComponet}
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
        'Family/Personal',
        'Physical',
        'Charity/Philanthropy',
        'Travel',
        'Things'
      ],
      this.handleCatergoryOnSelect,
      this.props.category,
      { ...styles.triggerContainerStyle },
      () => console.log('animationCallback')
      // () => this.scrollView.scrollTo({ x: 0, y: 50, animated: true })
    );

    return (
      <View 
        style={{ 
          ...styles.sectionMargin, 
          justifyContent: 'flex-start',
          flex: 1
        }}
      >
        {titleText}
        {menu}
      </View>
    );
  }

  renderPriority = () => {
    // const menu = MenuFactory(
    //   ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    //   this.handlePriorityOnSelect,
    //   this.props.priority,
    //   { ...styles.triggerContainerStyle, width: 80 },
    //   () => console.log('animationCallback')
    //   // () => this.scrollView.scrollTo({ x: 0, y: 50, animated: true })
    // );
    const valueText = (
      <Text
        style={{
          ...styles.titleTextStyle,
          fontSize: 14,
          fontWeight: '700'
        }}
      >
        {this.props.priority}
      </Text>
    );
    
    const titleText = (
      <Text style={styles.titleTextStyle}>
        Priority  {valueText}
      </Text>
    );

    const menu = (
      <Slider
        value={this.props.priority}
        onValueChange={value => this.handlePriorityOnSelect(value)}
        step={1}
        minimumValue={1}
        maximumValue={10}
        disabled={!this.props.uploading}
      />
    );

    return (
      <View style={{ ...styles.sectionMargin, justifyContent: 'flex-start', flex: 1 }}>
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
          <TouchableOpacity activeOpacity={0.85}
            style={{
              height: 40,
              width: 90,
              backgroundColor: '#fafafa',
              borderRadius: 4,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 8,
              flexDirection: 'row',
              padding: 10
            }}
            onPress={() => this.props.change('hasTimeline', true)}
          >
            <Image source={plus} style={{ height: 11, width: 11 }} />
            <Text style={{ fontSize: 14, fontWeight: '600', marginLeft: 4 }}>
              Timeline
            </Text>
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
          <TouchableOpacity activeOpacity={0.85}
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
            activeOpacity={0.85}
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
            activeOpacity={0.85}
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

  renderFieldArrayItem = (props, placeholder, fields, canDrag) => {
    const { item, index, move, moveEnd } = props;
    const iconOnPress = index === 0 ?
      undefined
      :
      () => fields.remove(index);
    return (
      <View
        style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
        <Field
          key={`description-${index}`}
          name={`${item.item}.description`}
          component={InputField}
          editable={this.props.uploading}
          numberOfLines={4}
          style={styles.standardInputStyle}
          placeholder={placeholder}
          iconSource={cancel}
          iconStyle={styles.cancelIconStyle}
          iconOnPress={iconOnPress}
          move={move}
          moveEnd={moveEnd}
          canDrag={canDrag}
        />
        </SafeAreaView>
      </View>
    );
  }

  renderFieldArray = (title, buttonText, placeholder, fields, error) => {
    const button = <Button text={buttonText} source={plus} onPress={() => fields.push({})} />;
    const titleText = <Text style={styles.titleTextStyle}>{title}</Text>;

    let dataToRender = [];
    fields.forEach((field, index) => {
      const dataToPush = {
        item: _.cloneDeep(field),
        index
      };
      dataToRender.push(dataToPush);
    });
    const fieldsComponent = fields.length > 0 ?
      (
        <DraggableFlatlist
          renderItem={(props) => this.renderFieldArrayItem(props, placeholder, fields, true)}
          data={dataToRender}
          keyExtractor={item => `${item.index}`}
          onMoveEnd={e => {
            // console.log('moving end for e: ', e);
            fields.move(e.from, e.to);
            this.setState({
              ...this.state,
              scrollEnabled: true
            });
          }}
          onMoveBegin={(index) => {
            // console.log('index is being moved: ', index);
            this.setState({
              ...this.state,
              scrollEnabled: false
            });
          }}
        />
      )
      // This is the original version to render undraggable list
      // fields.map((field, index) => {
      //   const iconOnPress = index === 0 ?
      //     undefined
      //     :
      //     () => fields.remove(index);
      //   return (
      //     <Field
      //       key={`description-${index}`}
      //       name={`${field}.description`}
      //       component={InputField}
      //       editable={this.props.uploading}
      //       numberOfLines={4}
      //       style={styles.standardInputStyle}
      //       placeholder={placeholder}
      //       iconSource={cancel}
      //       iconStyle={styles.cancelIconStyle}
      //       iconOnPress={iconOnPress}
      //     />
      //   );
      // })
      : '';

    return (
      <View style={{ ...styles.sectionMargin }}>
        {titleText}
        {fieldsComponent}
        {button}
      </View>
    );
  }

  renderSteps = ({ fields, meta: { error, submitFailed } }) => {
    return this.renderFieldArray(
      'Steps',
      'step',
      STEP_PLACE_HOLDER,
      fields,
      error
    );
  }

  renderNeeds = ({ fields, meta: { error, submitFailed } }) => {
    return this.renderFieldArray('Needs (optional)', 'need', NEED_PLACE_HOLDER, fields, error);
  }

  render() {
    const { handleSubmit, errors, user } = this.props;
    const actionText = this.props.initializeFromState ? 'Update' : 'Create';
    const titleText = this.props.initializeFromState ? 'Edit Goal' : 'New Goal';

    return (
      <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
        <KeyboardAvoidingView
          behavior='padding'
          style={{ flex: 1, backgroundColor: '#ffffff' }}
        >
          <ModalHeader
            title={titleText}
            actionText={actionText}
            onCancel={() => Actions.pop()}
            onAction={handleSubmit(this.handleCreate)}
          />
          <ScrollView
            style={{ borderTopColor: '#e9e9e9', borderTopWidth: 1 }}
            scrollEnabled={this.state.scrollEnabled}
          >
            <View style={{ flex: 1, padding: 20 }}>
              {this.renderUserInfo(user)}
              {this.renderGoal()}
              <FieldArray name="details" component={this.renderGoalDescription} />
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  {this.renderCategory()}
                </View>
                <View style={{ flex: 1 }}>
                  {this.renderPriority()}
                </View>
              </View>
              
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
    paddingTop: 13,
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
    height: 20,
    width: 20,
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
  const { uploading } = state.createGoal;

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
    needs: selector(state, 'needs'),
    steps: selector(state, 'steps'),
    formVals: state.form.createGoalModal,
    goalDetail: getGoalDetailByTab(state),
    uploading
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
