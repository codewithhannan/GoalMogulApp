/** @format */

import React from 'react'
import {
    View,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Linking,
    SafeAreaView,
    StatusBar,
} from 'react-native'
import { connect } from 'react-redux'
import { MenuProvider } from 'react-native-popup-menu'
import { Actions } from 'react-native-router-flux'
import { copilot } from 'react-native-copilot-gm'
import DateTimePicker from 'react-native-modal-datetime-picker'
import moment from 'moment'
import * as Notifications from 'expo-notifications'
import Modal from 'react-native-modal'
import Button from './Button'

// Components
import ModalHeader from '../Common/Header/ModalHeader'
import NewGoalView from './NewGoal/NewGoalView'

import { refreshProfileData } from '../../actions'

// Actions
import {
    createGoalSwitchTab,
    submitGoal,
    validate,
    refreshTrendingGoals,
} from '../../redux/modules/goal/CreateGoalActions'

// Selector
import { makeGetUserGoals } from '../../redux/modules/User/Selector'

import {
    showNextTutorialPage,
    startTutorial,
    updateNextStepNumber,
} from '../../redux/modules/User/TutorialActions'

import { scheduleNotification } from '../../redux/modules/goal/GoalDetailActions'

// Styles
import Tooltip from '../Tutorial/Tooltip'
import { svgMaskPath } from '../Tutorial/Utils'

//Modal
import GoalVisibleModal from '../../components/GoalVisibleModal'

import {
    track,
    trackWithProperties,
    EVENT as E,
    identifyWithTraits,
} from '../../monitoring/segment'
import { TouchableWithoutFeedback } from '@ui-kitten/components/devsupport'

const DEBUG_KEY = '[ UI CreateGoalModal ]'
let pageAb = ''

class CreateGoalModal extends React.Component {
    constructor(props) {
        super(props)
        this.handleCreate = this.handleCreate.bind(this)
        this.handleGoalReminder = this.handleGoalReminder.bind(this)
        this.handleIndexChange = this.handleIndexChange.bind(this)
        this.state = {
            goalReminderDatePicker: false,
            goalModalVisible: false,
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.showTutorial && this.props.showTutorial === true) {
            console.log(`${DEBUG_KEY}: [ componentDidUpdate ]: tutorial start`)
            this.props.start()
        }
    }

    componentDidMount() {
        const { userId } = this.props

        const pageId = this.props.refreshProfileData(userId)
        pageAb = pageId

        setTimeout(() => {
            trackWithProperties(E.DEEPLINK_CLICKED, {
                FunnelName: this.props.funnel,
            })
        }, 2000)

        this.startTime = new Date()
        track(
            this.props.initializeFromState
                ? E.EDIT_GOAL_MODAL_OPENED
                : E.CREATE_GOAL_MODAL_OPENED
        )
        // Loading trending goals on modal is opened
        this.props.refreshTrendingGoals()

        if (
            this.props.user.isOnBoarded === false &&
            !this.props.isImportedGoal &&
            !this.props.hasShown
        ) {
            // NOTE: don't show tutorial if this is imported goal
            setTimeout(() => {
                console.log(
                    `${DEBUG_KEY}: [ componentDidMount ]: startTutorial: create_goal, page: create_goal_modal`
                )
                this.props.startTutorial('create_goal', 'create_goal_modal')
            }, 600)
        }

        this.props.copilotEvents.on('stop', () => {
            console.log(
                `${DEBUG_KEY}: [ componentDidMount ]: create_goal_modal tutorial stop. Show next page`
            )

            // Close create goal modal
            Actions.pop()
            this.props.updateNextStepNumber(
                'create_goal',
                'create_goal_modal',
                9
            )
            setTimeout(() => {
                this.props.showNextTutorialPage(
                    'create_goal',
                    'create_goal_modal'
                )
            }, 400)
        })

        this.props.copilotEvents.on('stepChange', (step) => {
            const { name, order, visible, target, wrapper } = step
            console.log(
                `${DEBUG_KEY}: [ onStepChange ]: step order: ${order}, step visible: ${name} `
            )

            // We showing current order. SO the next step should be order + 1
            this.props.updateNextStepNumber(
                'create_goal',
                'create_goal_modal',
                order + 1
            )

            // if (order === 5) {
            //     if (this.newGoalView !== undefined) {
            //         // this.newGoalView.scrollToEnd();
            //         // return new Promise(r => setTimeout(r, 4000));
            //     } else {
            //         console.warn(
            //             `${DEBUG_KEY}: [ onStepChange ]: newGoalView ref is undefined`
            //         )
            //     }
            // }
        })
    }

    componentWillUnmount() {
        console.log(`${DEBUG_KEY}: [ componentWillUnmount ]`)

        // Remove tutorial listener
        this.props.copilotEvents.off('stop')
        this.props.copilotEvents.off('stepChange')
    }

    /**
     * This is entry point for creating goal.
     * It passes a callback to schedule goal reminder on create
     */
    handleGoalReminder = async () => {
        const { initializeFromState } = this.props
        if (initializeFromState) {
            // This is updating the goal
            this.handleCreate()
            return
        }

        const { status } = await Notifications.requestPermissionsAsync()
        if (status !== 'granted') {
            return Alert.alert(
                'Goal Reminders',
                'Enable Push Notifications for GoalMogul in your phone’s settings to get reminders',
                [
                    {
                        text: 'Settings',
                        onPress: () => Linking.openURL('app-settings:'),
                    },
                    { text: 'Skip', onPress: () => this.handleCreate() },
                ]
            )
        }

        const hasAskedPermission = true
        Alert.alert(
            'Goal Reminder',
            'Would you like to set a reminder for this goal?',
            [
                {
                    text: 'Tomorrow',
                    onPress: () => {
                        // Add 24 hours to current time
                        const reminderTime = moment(new Date())
                            .add(24, 'hours')
                            .toDate()
                        const scheduleNotificationCallback = (goal) => {
                            this.props.scheduleNotification(
                                reminderTime,
                                goal,
                                hasAskedPermission
                            )
                        }
                        this.handleCreate(scheduleNotificationCallback)
                        // trackWithProperties(EVENT.GOAL_CREATED, {
                        //     reminder_set: true,
                        //     reminder_type: 'tomorrow',
                        // })
                    },
                },
                {
                    text: 'Next Week',
                    onPress: () => {
                        // Add 7 days to current time
                        const reminderTime = moment(new Date())
                            .add(7, 'days')
                            .toDate()
                        const scheduleNotificationCallback = (goal) => {
                            this.props.scheduleNotification(
                                reminderTime,
                                goal,
                                hasAskedPermission
                            )
                        }
                        this.handleCreate(scheduleNotificationCallback)
                        // trackWithProperties(EVENT.GOAL_CREATED, {
                        //     reminder_set: true,
                        //     reminder_type: 'nextweek',
                        // })
                    },
                },
                {
                    text: 'Custom',
                    onPress: () => {
                        this.setState({
                            ...this.state,
                            goalReminderDatePicker: true,
                        })
                        // trackWithProperties(EVENT.GOAL_CREATED, {
                        //     reminder_set: true,
                        //     reminder_type: 'custom',
                        // })
                    },
                },
                {
                    text: 'No Thanks',
                    onPress: () => {
                        // Use chooses not to set reminder
                        this.handleCreate()
                        // trackWithProperties(EVENT.GOAL_CREATED, {
                        //     reminder_set: false,
                        // })
                    },
                    style: 'cancel',
                },
            ],
            { cancelable: false }
        )
    }

    handleIndexChange = (index) => {
        Keyboard.dismiss()
        this.props.createGoalSwitchTab(index)
    }

    handleCreate = (scheduleNotificationCallback) => {
        //Close keyboard no matter what
        Keyboard.dismiss()
        const errors = validate(this.props.formVals.values)
        console.log(
            `${DEBUG_KEY}: raw goal values are: `,
            this.props.formVals.values
        )
        if (
            !(Object.keys(errors).length === 0 && errors.constructor === Object)
        ) {
            // throw new SubmissionError(errors);
            return Alert.alert('Error', 'You have incomplete fields.')
        }

        const { goal, initializeFromState, uploading, goals } = this.props

        if (!uploading) return // when uploading is false, it's actually uploading.
        const goalId = goal ? goal._id : undefined

        const getGoalPrivacy =
            this.props.formVals.values.privacy === 'self' && goals.length == 0

        if (getGoalPrivacy) {
            this.setState({ goalModalVisible: true })
        } else {
            const durationSec =
                (new Date().getTime() - this.startTime.getTime()) / 1000

            identifyWithTraits(this.props.userId, {
                goalsCreated: goals.length + 1,
            })

            trackWithProperties(E.GOAL_CREATED, {
                goal_title: this.props.formVals.values.title,
                category: this.props.formVals.values.category,
                goal_importance: this.props.formVals.values.priority,
                privacy: this.props.formVals.values.privacy,
                start_date: this.props.formVals.values.startTime.date,
                end_date: this.props.formVals.values.endTime.date,
                steps: this.props.formVals.values.steps.length,
                needs: this.props.formVals.values.needs.length,
            })

            return this.props.submitGoal(
                this.props.formVals.values,
                this.props.user._id,
                initializeFromState,
                (createdGoal) => {
                    console.log(`${DEBUG_KEY}: [handleCreate] poping the modal`)
                    if (this.props.callback) {
                        console.log(
                            `${DEBUG_KEY}: [handleCreate] calling callback`
                        )
                        this.props.callback()
                    }
                    if (this.props.onClose) {
                        console.log(
                            `${DEBUG_KEY}: [handleCreate] calling onClose`
                        )
                        this.props.onClose()
                    }

                    if (scheduleNotificationCallback) {
                        // This is to schedule notification on user create goal
                        // Edit goal won't have this callback
                        console.log(
                            `${DEBUG_KEY}: [handleCreate]: [CreateGoalActions]: callback: scheduleNotificationCallback with created goal: `,
                            createdGoal
                        )
                        scheduleNotificationCallback(createdGoal)
                    }
                    Actions.pop()
                },
                goalId,
                {
                    needOpenProfile:
                        this.props.openProfile === undefined ||
                        this.props.openProfile === true,
                    needRefreshProfile: this.props.openProfile === false,
                },
                this.props.pageId
            )
        }
    }

    renderGoalReminderDatePicker() {
        return (
            <DateTimePicker
                isVisible={this.state.goalReminderDatePicker}
                mode="datetime"
                titleIOS="Pick a time"
                minimumDate={new Date()}
                onConfirm={(date) => {
                    this.setState(
                        {
                            ...this.state,
                            goalReminderDatePicker: false,
                        },
                        () => {
                            const scheduleNotificationCallback = (goal) => {
                                this.props.scheduleNotification(
                                    date,
                                    goal,
                                    true
                                )
                            }

                            // Timeout is set to allow animation finished
                            setTimeout(() => {
                                this.handleCreate(scheduleNotificationCallback)
                            }, 100)
                        }
                    )
                }}
                onCancel={() => {
                    this.setState({
                        ...this.state,
                        goalReminderDatePicker: false,
                    })
                }}
            />
        )
    }

    handleModalYes = (scheduleNotificationCallback) => {
        this.setState({ goalModalVisible: false })

        Keyboard.dismiss()
        const errors = validate(this.props.formVals.values)
        console.log(
            `${DEBUG_KEY}: raw goal values are: `,
            this.props.formVals.values
        )
        if (
            !(Object.keys(errors).length === 0 && errors.constructor === Object)
        ) {
            // throw new SubmissionError(errors);
            return Alert.alert('Error', 'You have incomplete fields.')
        }

        const { goal, initializeFromState, uploading, goals } = this.props

        if (!uploading) return // when uploading is false, it's actually uploading.
        const goalId = goal ? goal._id : undefined

        const durationSec =
            (new Date().getTime() - this.startTime.getTime()) / 1000

        identifyWithTraits(this.props.userId, {
            goalsCreated: goals.length + 1,
        })

        trackWithProperties(E.GOAL_CREATED, {
            goal_title: this.props.formVals.values.title,
            category: this.props.formVals.values.category,
            goal_importance: this.props.formVals.values.priority,
            privacy: this.props.formVals.values.privacy,
            start_date: this.props.formVals.values.startTime.date,
            end_date: this.props.formVals.values.endTime.date,
            steps: this.props.formVals.values.steps,
            needs: this.props.formVals.values.needs,
        })

        let changedPrivacy = {
            ...this.props.formVals.values,
            privacy: 'public',
        }

        return this.props.submitGoal(
            changedPrivacy,
            this.props.user._id,
            initializeFromState,
            (createdGoal) => {
                console.log(`${DEBUG_KEY}: [handleCreate] poping the modal`)
                if (this.props.callback) {
                    console.log(`${DEBUG_KEY}: [handleCreate] calling callback`)
                    this.props.callback()
                }
                if (this.props.onClose) {
                    console.log(`${DEBUG_KEY}: [handleCreate] calling onClose`)
                    this.props.onClose()
                }

                if (scheduleNotificationCallback) {
                    // This is to schedule notification on user create goal
                    // Edit goal won't have this callback
                    console.log(
                        `${DEBUG_KEY}: [handleCreate]: [CreateGoalActions]: callback: scheduleNotificationCallback with created goal: `,
                        createdGoal
                    )
                    scheduleNotificationCallback(createdGoal)
                }
                Actions.pop()
            },
            goalId,
            {
                needOpenProfile:
                    this.props.openProfile === undefined ||
                    this.props.openProfile === true,
                needRefreshProfile: this.props.openProfile === false,
            },
            this.props.pageId
        )
    }

    closePrivateGoalModal = (scheduleNotificationCallback) => {
        this.setState({ goalModalVisible: false })
        Keyboard.dismiss()
        const errors = validate(this.props.formVals.values)
        console.log(
            `${DEBUG_KEY}: raw goal values are: `,
            this.props.formVals.values
        )
        if (
            !(Object.keys(errors).length === 0 && errors.constructor === Object)
        ) {
            // throw new SubmissionError(errors);
            return Alert.alert('Error', 'You have incomplete fields.')
        }

        const { goal, initializeFromState, uploading, goals } = this.props

        if (!uploading) return // when uploading is false, it's actually uploading.
        const goalId = goal ? goal._id : undefined

        const durationSec =
            (new Date().getTime() - this.startTime.getTime()) / 1000

        identifyWithTraits(this.props.userId, {
            goalsCreated: goals.length + 1,
        })
        trackWithProperties(E.GOAL_CREATED, {
            goal_title: this.props.formVals.values.title,
            category: this.props.formVals.values.category,
            goal_importance: this.props.formVals.values.priority,
            privacy: this.props.formVals.values.privacy,
            start_date: this.props.formVals.values.startTime.date,
            end_date: this.props.formVals.values.endTime.date,
            steps: this.props.formVals.values.steps,
            needs: this.props.formVals.values.needs,
        })

        return this.props.submitGoal(
            this.props.formVals.values,
            this.props.user._id,
            initializeFromState,
            (createdGoal) => {
                console.log(`${DEBUG_KEY}: [handleCreate] poping the modal`)
                if (this.props.callback) {
                    console.log(`${DEBUG_KEY}: [handleCreate] calling callback`)
                    this.props.callback()
                }
                if (this.props.onClose) {
                    console.log(`${DEBUG_KEY}: [handleCreate] calling onClose`)
                    this.props.onClose()
                }

                if (scheduleNotificationCallback) {
                    // This is to schedule notification on user create goal
                    // Edit goal won't have this callback
                    console.log(
                        `${DEBUG_KEY}: [handleCreate]: [CreateGoalActions]: callback: scheduleNotificationCallback with created goal: `,
                        createdGoal
                    )
                    scheduleNotificationCallback(createdGoal)
                }
                Actions.pop()
            },
            goalId,
            {
                needOpenProfile:
                    this.props.openProfile === undefined ||
                    this.props.openProfile === true,
                needRefreshProfile: this.props.openProfile === false,
            },
            this.props.pageId
        )
    }

    handleModalClose = () => {
        this.setState({ goalModalVisible: false })
    }

    render() {
        const actionText = this.props.initializeFromState ? 'Update' : 'Create'

        const titleText = this.props.initializeFromState
            ? 'Edit Goal'
            : 'New Goal'
        const hasValidFormVals =
            this.props.formVals &&
            this.props.formVals.values &&
            this.props.formVals.values.title &&
            this.props.formVals.values.category &&
            this.props.formVals.values.priority &&
            this.props.formVals.values.title.trim() !== ''

        return (
            <>
                <SafeAreaView style={{ flex: 0, backgroundColor: '#42C0F5' }} />

                <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                    <MenuProvider
                        customStyles={{ backdrop: styles.backdrop }}
                        skipInstanceCheck={true}
                    >
                        {/* <StatusBar
                        animated={true}
                        backgroundColor="#42C0F5"
                        // barStyle={statusBarStyle}
                        // showHideTransition={statusBarTransition}
                    /> */}
                        <GoalVisibleModal
                            isVisible={this.state.goalModalVisible}
                            closeModal={this.closePrivateGoalModal}
                            handleYes={this.handleModalYes}
                            handleClose={this.handleModalClose}
                        />

                        <View style={{ flex: 1, backgroundColor: 'white' }}>
                            {this.renderGoalReminderDatePicker()}

                            <View
                                style={{
                                    backgroundColor: 'white',
                                    height: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <TouchableWithoutFeedback
                                    onLongPress={() => Actions.pop()}
                                    delayLongPress={200}
                                >
                                    <View
                                        style={{
                                            borderWidth: 2.5,
                                            width: 45,
                                            borderRadius: 20,
                                            borderColor: '#828282',
                                        }}
                                    />
                                </TouchableWithoutFeedback>

                                {/* <Button
                                title="go back"
                                color="black"
                                onPress={() => {
                                    const durationSec =
                                        (new Date().getTime() -
                                            this.startTime.getTime()) /
                                        1000
                                    trackWithProperties(
                                        this.props.initializeFromState
                                            ? E.EDIT_GOAL_MODAL_CANCELLED
                                            : E.CREATE_GOAL_MODAL_CANCELLED,
                                        { DurationSec: durationSec }
                                    )
                                    if (this.props.onClose) this.props.onClose()
                                    Actions.pop()
                                }}
                            /> */}
                            </View>

                            {/* <ModalHeader
                        title={titleText}
                        actionText={actionText}
                        back
                        onCancel={() => {
                            const durationSec =
                                (new Date().getTime() -
                                    this.startTime.getTime()) /
                                1000
                            trackWithProperties(
                                this.props.initializeFromState
                                    ? E.EDIT_GOAL_MODAL_CANCELLED
                                    : E.CREATE_GOAL_MODAL_CANCELLED,
                                { DurationSec: durationSec }
                            )
                            if (this.props.onClose) this.props.onClose()
                            Actions.pop()
                        }}
                        onAction={this.handleGoalReminder}
                        actionDisabled={
                            !this.props.uploading || !hasValidFormVals
                        }
                        // tutorialOn={{
                        //     actionText: {
                        //         tutorialText: this.props.tutorialText[8],
                        //         order: 8,
                        //         name: 'create_goal_create_goal_modal_8'
                        //     }
                        // }}
                    /> */}

                            <NewGoalView
                                initializeFromState={
                                    this.props.initializeFromState
                                }
                                isImportedGoal={this.props.isImportedGoal}
                                goal={this.props.goal}
                                tutorialText={this.props.tutorialText}
                                // onRef={(r) => {
                                //     this.newGoalView = r
                                // }}
                                createButtonTitle={actionText}
                                handleCreateButton={this.handleGoalReminder}
                                actionDisabled={
                                    !this.props.uploading || !hasValidFormVals
                                }
                                prefilledTitle={this.props.preffiled}
                            />
                        </View>
                    </MenuProvider>
                </SafeAreaView>
            </>
        )
    }
}

const styles = {
    backdrop: {
        backgroundColor: 'transparent',
    },
}

const mapStateToProps = (state, props) => {
    const getUserGoals = makeGetUserGoals()

    const { userId } = state.user
    const goals = getUserGoals(state, userId, pageAb)

    const { navigationState, uploading } = state.createGoal
    const { user } = state.user
    // Tutorial related
    const { create_goal } = state.tutorials

    const { create_goal_modal } = create_goal
    const { hasShown, showTutorial, tutorialText } = create_goal_modal

    return {
        navigationState,
        uploading,
        userId,
        goals,
        formVals: state.form.createGoalModal,
        user,
        // Tutorial related
        hasShown,
        // showTutorial,

        tutorialText,
    }
}

const CreateGoalModalExplained = copilot({
    overlay: 'svg', // or 'view'
    animated: true, // or false
    stepNumberComponent: () => <View />,
    tooltipComponent: Tooltip,
    svgMaskPath: svgMaskPath,
})(CreateGoalModal)

export default connect(mapStateToProps, {
    createGoalSwitchTab,
    submitGoal,
    validate,
    refreshTrendingGoals,
    scheduleNotification,
    // Tutorial related
    showNextTutorialPage,
    startTutorial,
    updateNextStepNumber,
    refreshProfileData,
})(CreateGoalModalExplained)
