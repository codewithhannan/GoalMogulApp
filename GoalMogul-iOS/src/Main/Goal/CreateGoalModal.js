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
import DateTimePicker from 'react-native-modal-datetime-picker';
import R from 'ramda';
import moment from 'moment';
import { Permissions } from 'expo';

// Components
import ModalHeader from '../Common/Header/ModalHeader';
import TabButtonGroup from '../Common/TabButtonGroup';
import NewGoalView from './NewGoal/NewGoalView';
import TrendingGoalView from './NewGoal/TrendingGoalView';
import { actionSheet, switchByButtonIndex } from '../Common/ActionSheetFactory';

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
  updateNextStepNumber
} from '../../redux/modules/User/TutorialActions';

import {
  scheduleNotification
} from '../../redux/modules/goal/GoalDetailActions';

// Styles
import {
  APP_DEEP_BLUE,
  APP_BLUE
} from '../../styles';
import Tooltip from '../Tutorial/Tooltip';
import { svgMaskPath } from '../Tutorial/Utils';

const DEBUG_KEY = '[ UI CreateGoalModal ]';

class CreateGoalModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleGoalReminder = this.handleGoalReminder.bind(this);
    this.handleIndexChange = this.handleIndexChange.bind(this);
    this.state = {
      goalReminderDatePicker: false
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.showTutorial && this.props.showTutorial === true) {
      console.log(`${DEBUG_KEY}: [ componentDidUpdate ]: tutorial start`);
      this.props.start();
    }
  }

  componentDidMount() {
    // Loading trending goals on modal is opened
    this.props.refreshTrendingGoals();

    if (this.props.user.isOnBoarded === false && !this.props.isImportedGoal && !this.props.hasShown) {
      // NOTE: don't show tutorial if this is imported goal
      setTimeout(() => {
        console.log(`${DEBUG_KEY}: [ componentDidMount ]: startTutorial: create_goal, page: create_goal_modal`);
        this.props.startTutorial('create_goal', 'create_goal_modal');
      }, 600);
    }

    this.props.copilotEvents.on('stop', () => {
      console.log(`${DEBUG_KEY}: [ componentDidMount ]: create_goal_modal tutorial stop. Show next page`);

      // Close create goal modal
      Actions.pop();
      this.props.updateNextStepNumber('create_goal', 'create_goal_modal', 9);
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

  /**
   * This is entry point for creating goal.
   * It passes a callback to schedule goal reminder on create
   */
  handleGoalReminder = async () => {
    const { initializeFromState } = this.props;
    if (initializeFromState) {
      // This is updating the goal
      this.handleCreate();
      return;
    }

    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      return Alert.alert('Denied', 'Enable Push Notifications for GoalMogul in your phone’s settings to get reminders');
    };

    const hasAskedPermission = true;
    const goalReminderSwitch = switchByButtonIndex([
      [R.equals(0), () => {
        // Add 24 hours to current time
        const reminderTime = moment(new Date()).add(24, 'hours').toDate();
        const scheduleNotificationCallback = (goal) => {
          this.props.scheduleNotification(reminderTime, goal, hasAskedPermission);
        };
        this.handleCreate(scheduleNotificationCallback);
      }],
      [R.equals(1), () => {
        // Add 7 days to current time
        const reminderTime = moment(new Date()).add(7, 'days').toDate();
        const scheduleNotificationCallback = (goal) => {
          this.props.scheduleNotification(reminderTime, goal, hasAskedPermission);
        };
        this.handleCreate(scheduleNotificationCallback);
      }],
      [R.equals(2), () => {
        // Add 1 months
        const reminderTime = moment(new Date()).add(1, 'month').toDate();
        const scheduleNotificationCallback = (goal) => {
          this.props.scheduleNotification(reminderTime, goal, hasAskedPermission);
        };
        this.handleCreate(scheduleNotificationCallback);
      }],
      [R.equals(3), () => {
        // Show customized time picker
        this.setState({
          ...this.state,
          goalReminderDatePicker: true
        });
      }]
    ]);

    const shareToActionSheet = actionSheet(
      ['Tomorrow', 'Next Week', 'Next Month', 'Custom', 'No Thanks'],
      4,
      goalReminderSwitch
    );
    return shareToActionSheet();
  }

  handleIndexChange = (index) => {
    Keyboard.dismiss();
    this.props.createGoalSwitchTab(index);
  }

  handleCreate = (scheduleNotificationCallback) => {
    // Close keyboard no matter what
    Keyboard.dismiss();
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
      (createdGoal) => {
        console.log(`${DEBUG_KEY}: [handleCreate] poping the modal`);
        if (this.props.callback) {
          console.log(`${DEBUG_KEY}: [handleCreate] calling callback`);
          this.props.callback();
        }
        if (this.props.onClose) {
          console.log(`${DEBUG_KEY}: [handleCreate] calling onClose`);
          this.props.onClose();
        }
        
        if (scheduleNotificationCallback) {
          // This is to schedule notification on user create goal
          // Edit goal won't have this callback
          console.log(`${DEBUG_KEY}: [handleCreate]: [CreateGoalActions]: callback: scheduleNotificationCallback with created goal: `, createdGoal);
          scheduleNotificationCallback(createdGoal);
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

  renderGoalReminderDatePicker() {
    return (
      <DateTimePicker
        isVisible={this.state.goalReminderDatePicker}
        mode='datetime'
        titleIOS='Pick a time'
        minimumDate={new Date()}
        onConfirm={(date) => {
          this.setState({
            ...this.state,
            goalReminderDatePicker: false
          }, () => {
            const scheduleNotificationCallback = (goal) => {
              this.props.scheduleNotification(date, goal, true);
            };

            // Timeout is set to allow animation finished
            setTimeout(() => {
              this.handleCreate(scheduleNotificationCallback);
            }, 100);
          });
        }}
        onCancel={() => {
          this.setState({
            ...this.state,
            goalReminderDatePicker: false
          }, () => {
            // Timeout is set to allow animation finished
            setTimeout(() => {
              this.handleCreate();
            }, 100);
          });
        }}
      />
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
            {this.renderGoalReminderDatePicker()}
            <ModalHeader
              title={titleText}
              actionText={actionText}
              onCancel={() => {
                if (this.props.onClose) {
                  this.props.onClose();
                }
                Actions.pop();
              }}
              onAction={this.handleGoalReminder}
              actionDisabled={!this.props.uploading}
              tutorialOn={{
                actionText: {
                  tutorialText: this.props.tutorialText[8],
                  order: 8,
                  name: 'create_goal_create_goal_modal_8'
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
  tooltipComponent: Tooltip,
  svgMaskPath: svgMaskPath
})(CreateGoalModal);

export default connect(
  mapStateToProps,
  {
    createGoalSwitchTab,
    submitGoal,
    validate,
    refreshTrendingGoals,
    scheduleNotification,
    // Tutorial related
    showNextTutorialPage,
    startTutorial,
    updateNextStepNumber,
  }
)(CreateGoalModalExplained);
