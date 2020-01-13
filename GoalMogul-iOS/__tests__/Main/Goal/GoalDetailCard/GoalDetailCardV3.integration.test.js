/**
 * This is for full integration test on GoalDetailCardV3.
 * Required app state is setup and it's using deep rendering.
 * It simulates the user interaction with the App including press, swipe, scroll and input.
 * Following are just initial setup code which are not functioning right now. Need 
 * further investigation for full setup.
 */

import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from 'react-native-testing-library';
import _ from 'lodash';
import { GoalDetailCardV3 } from '../../../../src/Main/Goal/GoalDetailCard/GoalDetailCardV3';
import { DEFAULT_GOAL } from '../../../__mocks__/MockGoals';
import { INITIAL_NAVIGATION_STATE_V2 } from '../../../../src/redux/modules/goal/Goals';
import { MAIN_NAVIGATION_ROUTES } from '../../../../src/reducers/NavigationReducers';
import mockStore from '../../../__mocks__/ReduxMockStore';
import { store as ReduxStore } from '../../../../src/store';

// const componentWrapperWithStore = (store) => ({ children }) => {
//     return (
//         <Provider store={store}>
//             {children}
//         </Provider>
//     );
// };

// describe("goal detail v3", () => {
//     // let store;
//     let store;
//     let wrapper;
//     let component;
//     beforeAll(() => {
//         // store = mockStore({
//         //     user: {
//         //         userId: ''
//         //     },
//         // });
//         store = ReduxStore;
//         wrapper = componentWrapperWithStore(store);
//         component = render(
//             <GoalDetailCardV3 {...DEFAULT_GOALDETAIL_PROPS} />,
//             { wrapper }
//         );
//     });

//     it("should render basic goal detail v3 page", () => {
//         const { toJSON } = component;
//         expect(toJSON()).toMatchSnapshot();
//     });
// });

// const DEFAULT_GOALDETAIL_FUNCTIONS = {
//     closeGoalDetail: jest.fn(),
//     closeGoalDetailWithoutPoping: jest.fn(),
//     attachSuggestion: jest.fn(),
//     cancelSuggestion: jest.fn(),
//     openSuggestionModal: jest.fn(),
//     goalDetailSwitchTabV2: jest.fn(),
//     goalDetailSwitchTabV2ByKey: jest.fn(),
//     removeSuggestion: jest.fn(),
//     createCommentFromSuggestion: jest.fn(),
//     resetCommentType: jest.fn(),
//     updateNewComment: jest.fn(),
//     createCommentForSuggestion: jest.fn(),
//     createSuggestion: jest.fn(),
//     editGoal: jest.fn(),
//     markGoalAsComplete: jest.fn(),
//     refreshGoalDetailById: jest.fn(),
//     refreshComments: jest.fn(),
//     markUserViewGoal: jest.fn(),
//     // Tutorial related
//     showNextTutorialPage: jest.fn(),
//     startTutorial: jest.fn(),
//     updateNextStepNumber: jest.fn(),
//     pauseTutorial: jest.fn(),
//     saveTutorialState: jest.fn(),
// };

// const DEFAULT_GOALDETAIL_DATA = {
//     commentLoading: false,
//     stepsAndNeeds: [],
//     comments: [],
//     originalComments: [], // All comments in raw form
//     goalDetail: DEFAULT_GOAL,
//     navigationState: _.cloneDeep(INITIAL_NAVIGATION_STATE_V2),
//     showingModalInDetail: false, // Can be potentially cleaned up
//     showSuggestionModal: false,
//     isSelf: true,
//     tab: MAIN_NAVIGATION_ROUTES[0], // Default set to homeTab
//     // When on focusTab, show the count for focusedItem
//     focusedItemCount: 0,
//     updating: false,
//     newComment: undefined,
//     // Tutorial related
//     tutorialText: '', 
//     hasShown: true, 
//     showTutorial: false
// };

// const DEFAULT_GOALDETAIL_PROPS = {
//     ...DEFAULT_GOALDETAIL_FUNCTIONS,
//     ...DEFAULT_GOALDETAIL_DATA
// };