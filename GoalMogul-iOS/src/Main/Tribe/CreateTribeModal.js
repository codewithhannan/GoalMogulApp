import React from 'react';
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
import { CheckBox } from 'react-native-elements';
import {
  FieldArray,
  Field,
  reduxForm,
  formValueSelector,
  SubmissionError,
  reset
} from 'redux-form'
import R from 'ramda';
import moment from 'moment';
import {
  MenuProvider,
} from 'react-native-popup-menu';

// Components
import ModalHeader from '../Common/Header/ModalHeader';
import InputField from '../Common/TextInput/InputField';

// Actions
import {
  cancelCreatingNewTribe,
  createNewTribe
} from '../../redux/modules/tribe/NewTribeActions';


// const { Popover } = renderers;
const { width } = Dimensions.get('window');

class CreateTribeModal extends React.Component {

  componentDidMount() {
    this.initializeForm();
  }

  initializeForm() {
    const defaulVals = {
      name: undefined,
      membersCanInvite: false,
      isPubliclyVisible: false,
      membershipLimit: 100,
      description: '',
      picture: undefined,
    };

    // Initialize based on the props, if it's opened through edit button
    // const initialVals = this.props.initializeFromState
    //   ? { ...goalToFormAdaptor(this.props.goalDetail) }
    //   : { ...defaulVals };

    this.props.initialize({
      // ...initialVals
      ...defaulVals
    });
  }

  handleCreate = values => {
    console.log('values are: ', this.props.formVals.values);
  }

  renderTribeName() {
    const titleText = <Text style={styles.titleTextStyle}>Tribe Name</Text>;
    return (
      <View>
        {titleText}
        <Field
          name='name'
          label='name'
          component={InputField}
          editable={this.props.uploading}
          numberOfLines={1}
          style={styles.goalInputStyle}
          placeholder='Enter the name...'
        />
      </View>
    );
  }

  renderTribeDescription() {
    const titleText = <Text style={styles.titleTextStyle}>Description</Text>;
    return (
      <View>
        {titleText}
        <Field
          name='description'
          label='description'
          component={InputField}
          editable={this.props.uploading}
          numberOfLines={1}
          style={styles.goalInputStyle}
          placeholder='Describe your tribe...'
        />
      </View>
    );
  }

  renderOptions() {
    return (
      <View>
        <CheckBox
          title='Members can invite new member'
          checked={this.props.membersCanInvite}
          onPress={() => this.props.change('membersCanInvite', !this.props.membersCanInvite)}
        />
        <CheckBox
          title='Public visible'
          checked={this.props.isPubliclyVisible}
          onPress={() => this.props.change('isPubliclyVisible', !this.props.isPubliclyVisible)}
        />
      </View>
    );
  }

  render() {
    const { handleSubmit, errors } = this.props;
    const actionText = this.props.initializeFromState ? 'Update' : 'Create';
    const titleText = this.props.initializeFromState ? 'Edit Tribe' : 'New Tribe';

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
          >
            <View style={{ flex: 1, padding: 20 }}>
              {this.renderTribeName()}
              {this.renderTribeDescription()}
              {this.renderOptions()}
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </MenuProvider>
    );
  }
}

CreateTribeModal = reduxForm({
  form: 'createTribeModal',
  enableReinitialize: true
})(CreateTribeModal);

const mapStateToProps = state => {
  const selector = formValueSelector('createTribeModal');
  const { user } = state.user;
  const { profile } = user;
  const { uploading } = state.newTribe;

  return {
    user,
    profile,
    name: selector(state, 'name'),
    membersCanInvite: selector(state, 'membersCanInvite'),
    isPubliclyVisible: selector(state, 'isPubliclyVisible'),
    membershipLimit: selector(state, 'membershipLimit'),
    description: selector(state, 'description'),
    picture: selector(state, 'picture'),
    formVals: state.form.createTribeModal,
    uploading
  };
};

export default connect(
  mapStateToProps,
  {
    cancelCreatingNewTribe,
    createNewTribe
  }
)(CreateTribeModal);

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
