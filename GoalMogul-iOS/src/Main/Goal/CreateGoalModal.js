import React from 'react';
import {
  View,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import { TabView, SceneMap } from 'react-native-tab-view';
import { MenuProvider } from 'react-native-popup-menu';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';

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
  validate
} from '../../redux/modules/goal/CreateGoalActions';
import { State } from 'react-native-gesture-handler';

const DEBUG_KEY = '[ UI CreateGoalModal ]';

class CreateGoalModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleIndexChange = this.handleIndexChange.bind(this);
  }

  componentWillUnmount() {
    console.log(`${DEBUG_KEY}: unmounting CreateGoalModal`);
  }

  handleIndexChange = (index) => {
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
        Actions.pop();
      },
      goalId
    );
  }

  renderHeader = props => {
    return (
      <TabButtonGroup buttons={props} />
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
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <ModalHeader
            title={titleText}
            actionText={actionText}
            onCancel={() => Actions.pop()}
            onAction={this.handleCreate}
          />
          <TabView
            navigationState={this.props.navigationState}
            renderScene={this.renderScene}
            renderTabBar={this.renderHeader}
            onIndexChange={this.handleIndexChange.bind(this)}
            useNativeDriver
          />
        </View>
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

export default connect(
  mapStateToProps,
  {
    createGoalSwitchTab,
    submitGoal,
    validate
  }
)(CreateGoalModal);
