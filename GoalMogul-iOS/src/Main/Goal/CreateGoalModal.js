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
import { copilot } from 'react-native-copilot-gm';

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

import {
  showNextTutorialPage,
  startTutorial,
  saveTutorialState,
  updateNextStepNumber
} from '../../redux/modules/User/TutorialActions';

// Styles
import {
  APP_DEEP_BLUE,
  APP_BLUE
} from '../../styles';
import Tooltip from '../Tutorial/Tooltip';

const DEBUG_KEY = '[ UI CreateGoalModal ]';

class CreateGoalModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleIndexChange = this.handleIndexChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!this.props.hasShown && !prevProps.showTutorial && this.props.showTutorial === true) {
      console.log(`${DEBUG_KEY}: [ componentDidUpdate ]: tutorial start`);
      this.props.start();
    }
  }

  componentDidMount() {
    // Loading trending goals on modal is opened
    this.props.refreshTrendingGoals();

    if (!this.props.user.isOnBoarded) {
      setTimeout(() => {
        console.log(`${DEBUG_KEY}: [ componentDidMount ]: startTutorial: create_goal, page: create_goal_modal`);
        this.props.startTutorial('create_goal', 'create_goal_modal');
      }, 600);
    }

    this.props.copilotEvents.on('stop', () => {
      console.log(`${DEBUG_KEY}: [ componentDidMount ]: create_goal_modal tutorial stop. Show next page`);

      // Close create goal modal
      Actions.pop();
      this.props.updateNextStepNumber('create_goal', 'create_goal_modal', 8);
      setTimeout(() => {
        this.props.showNextTutorialPage('create_goal', 'create_goal_modal');
      }, 400);
    });

    this.props.copilotEvents.on('stepChange', (step) => {
      const { name, order, visible, target, wrapper } = step;
      console.log(`${DEBUG_KEY}: [ onStepChange ]: step order: ${order}, step visible: ${name} `);

      // We showing current order. SO the next step should be order + 1
      this.props.updateNextStepNumber('create_goal', 'create_goal_modal', order + 1);

      if (order === 5) {
        if (this.newGoalView !== undefined) {
          // this.newGoalView.scrollToEnd();
          // return new Promise(r => setTimeout(r, 4000));
        } else {
          console.warn(`${DEBUG_KEY}: [ onStepChange ]: newGoalView ref is undefined`);
        }
      }
    });
  }

  componentWillUnmount() {
    console.log(`${DEBUG_KEY}: [ componentWillUnmount ]`);

    // Remove tutorial listener
    this.props.copilotEvents.off('stop');
    this.props.copilotEvents.off('stepChange');
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
        console.log(`${DEBUG_KEY}: [handleCreate] poping the modal`);
        if (this.props.callback) {
          console.log(`${DEBUG_KEY}: [handleCreate] calling callback`);
          this.props.callback();
        }
        if (this.props.onClose) {
          console.log(`${DEBUG_KEY}: [handleCreate] calling onClose`);
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
        isImportedGoal={this.props.isImportedGoal}
        goal={this.props.goal}
        tutorialText={this.props.tutorialText}
        onRef={r => { this.newGoalView = r; }}
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
              tutorialOn={{
                actionText: {
                  tutorialText: this.props.tutorialText[7],
                  order: 7,
                  name: 'create_goal_create_goal_modal_7'
                }
              }}
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

  // Tutorial related
  const { create_goal } = state.tutorials;
  const { create_goal_modal } = create_goal;
  const { hasShown, showTutorial, tutorialText } = create_goal_modal;

  return {
    navigationState,
    uploading,
    formVals: state.form.createGoalModal,
    user,
    // Tutorial related
    hasShown, showTutorial, tutorialText
  };
};

const CreateGoalModalExplained = copilot({
  overlay: 'svg', // or 'view'
  animated: true, // or false
  stepNumberComponent: () => <View />,
  tooltipComponent: Tooltip
})(CreateGoalModal);

export default connect(
  mapStateToProps,
  {
    createGoalSwitchTab,
    submitGoal,
    validate,
    refreshTrendingGoals,
    // Tutorial related
    showNextTutorialPage,
    startTutorial,
    saveTutorialState,
    updateNextStepNumber
  }
)(CreateGoalModalExplained);
