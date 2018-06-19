import React, { Component } from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';
import { FieldArray, Field, reduxForm, formValueSelector } from 'redux-form';
import R from 'ramda';
import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';

/* Components */
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
import { } from '../../actions';

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
      viewableSetting: 'Friends',
      priority: 1
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

  renderUserInfo() {
    let imageUrl = this.props.user.profile.image;
    let profileImage =
      <Image style={styles.imageStyle} resizeMode='contain' source={defaultUserProfile} />;
    if (imageUrl) {
      imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${imageUrl}`;
      profileImage = <Image style={styles.imageStyle} source={{ uri: imageUrl }} />;
    }
    const callback = R.curry((value) => this.props.change('viewableSetting', value));
    const shareToMastermindCallback = R.curry((value) => this.props.change('shareToMastermind', value));
    return (
      <View style={{ flexDirection: 'row', marginBottom: 15 }}>
        {profileImage}
        <View style={{ marginLeft: 15 }}>
          <Text style={{ fontSize: 18, marginBottom: 8 }}>
            Jordan Gardener
          </Text>
          <ViewableSettingMenu
            viewableSetting={this.props.viewableSetting}
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
          name='goal'
          label='goal'
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
      <View style={{ marginTop: 15 }}>
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
      <View style={{ marginTop: 15 }}>
        {titleText}
        {menu}
      </View>
    );
  }

  renderTimeline = () => {
    
  }

  renderFieldArray = (title, buttonText, placeholder, fields, error) => {
    const button = <Button text={buttonText} source={plus} onPress={() => fields.push()} />;
    const titleText = <Text style={styles.titleTextStyle}>{title}</Text>;
    return (
      <View style={{ marginTop: 15 }}>
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
          <ModalHeader title='New Goal' actionText='Create' />
          <ScrollView
            style={{ borderTopColor: '#e9e9e9', borderTopWidth: 1 }}
          >
            <View style={{ flex: 1, padding: 20 }}>
              {this.renderUserInfo()}
              {this.renderGoal()}
              <FieldArray name="description" component={this.renderGoalDescription} />
              {this.renderCategory()}
              {this.renderPriority()}
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
    fontSize: 13,
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
    viewableSetting: selector(state, 'viewableSetting'),
    priority: selector(state, 'priority'),
    shareToMastermind: selector(state, 'shareToMastermind'),
  };
};

export default connect(
  mapStateToProps,
  null
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
