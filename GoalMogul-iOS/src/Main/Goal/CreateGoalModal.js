import React from 'react';
import {
  View,
  Alert,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native';
import { connect } from 'react-redux';
import { TabView, SceneMap } from 'react-native-tab-view';
import { MenuProvider } from 'react-native-popup-menu';
import { Actions } from 'react-native-router-flux';
import { copilot } from 'react-native-copilot';

// Components
import ModalHeader from '../Common/Header/ModalHeader';
import TabButtonGroup from '../Common/TabButtonGroup';
import NewGoalView from './NewGoal/NewGoalView';
import TrendingGoalView from './NewGoal/TrendingGoalView';

// Actions
// import { } from '../../actions';
import {
  createGoalSwitchTab,
  submitGoal,
  validate,
  refreshTrendingGoals,
} from '../../redux/modules/goal/CreateGoalActions';

// Styles
import {
  APP_DEEP_BLUE,
  APP_BLUE
} from '../../styles';

const DEBUG_KEY = '[ UI CreateGoalModal ]';

class CreateGoalModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleIndexChange = this.handleIndexChange.bind(this);
  }

  componentDidMount() {
    // Loading trending goals on modal is opened
    this.props.refreshTrendingGoals();
  }

  componentWillUnmount() {
    console.log(`${DEBUG_KEY}: unmounting CreateGoalModal`);
  }

  handleIndexChange = (index) => {
    Keyboard.dismiss();
    this.props.createGoalSwitchTab(index);
  }

  handleCreate = () => {
    const errors = validate(this.props.formVals.values);
    console.log(`${DEBUG_KEY}: raw goal values are: `, this.props.formVals.values);
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
        console.log(`${DEBUG_KEY}: poping the modal`);
        if (this.props.callback) {
          this.props.callback();
        }
        if (this.props.onClose) {
          this.props.onClose();
        } 
        Actions.pop();
      },
      goalId,
      {
        needOpenProfile: this.props.openProfile === undefined || this.props.openProfile === true,
        needRefreshProfile: this.props.openProfile === false
      },
      this.props.pageId
    );
  }

  renderHeader = props => {
    return (
      <TabButtonGroup 
        buttons={props}
        buttonStyle={{
          selected: {
            backgroundColor: APP_DEEP_BLUE,
            tintColor: 'white',
            color: 'white',
            fontWeight: '700'
          },
          unselected: {
            backgroundColor: '#FCFCFC',
            tintColor: '#616161',
            color: '#616161',
            fontWeight: '600'
          }
        }}   
      />
    );
  };

  renderScene = SceneMap({
    newGoal: () => (
      <NewGoalView 
        initializeFromState={this.props.initializeFromState}
        goal={this.props.goal}
      />
    ),
    trendingGoal: TrendingGoalView,
  });

  render() {
    const actionText = this.props.initializeFromState ? 'Update' : 'Create';
    const titleText = this.props.initializeFromState ? 'Edit Goal' : 'New Goal';

    return (
      <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
        <KeyboardAvoidingView
            behavior='padding'
            style={{ flex: 1, backgroundColor: '#ffffff' }}
          >
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ModalHeader
              title={titleText}
              actionText={actionText}
              onCancel={() => {
                if (this.props.onClose) {
                  this.props.onClose();
                }
                Actions.pop();
              }}
              onAction={this.handleCreate}
              actionDisabled={!this.props.uploading}
            />
            <TabView
              navigationState={this.props.navigationState}
              renderScene={this.renderScene}
              renderTabBar={this.renderHeader}
              onIndexChange={this.handleIndexChange.bind(this)}
              useNativeDriver
            />
          </View>
        </KeyboardAvoidingView>
      </MenuProvider>
    );
  }
}

const styles = {
  backdrop: {
    backgroundColor: 'transparent'
  },
};

const mapStateToProps = state => {
  const { navigationState, uploading } = state.createGoal;
  const { user } = state.user;

  return {
    navigationState,
    uploading,
    formVals: state.form.createGoalModal,
    user
  };
};

const CreateGoalModalExplained = copilot({
  overlay: 'svg', // or 'view'
  animated: true, // or false
  stepNumberComponent: () => <View />
})(CreateGoalModal);

export default connect(
  mapStateToProps,
  {
    createGoalSwitchTab,
    submitGoal,
    validate,
    refreshTrendingGoals
  }
)(CreateGoalModalExplained);
