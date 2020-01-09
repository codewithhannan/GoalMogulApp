import mockStore from '../../../../__mocks__/ReduxMockStore';
import { 
    markGoalAsComplete,
    markNeedAsComplete,
    markStepAsComplete
} from '../../../../src/redux/modules/goal/GoalDetailActions';


// NOTE: avoid using the same mockStore. Always create a new one since the async is not 
// properly added in all the actions
describe("Test goal update actions", () => { 
    let store;
    let getState;
    // Create a new store before each test
    beforeEach(() => {
        store = mockStore({});
        getState = () => ({
            user: { token: '' },
            navigation: { tab: '' }
        });
    });

    it('should dispatch goal update success with complete as true', async () => {
        fetch.mockResponseSuccess(JSON.stringify({}));
        markGoalAsComplete(1, true, 1)(store.dispatch, getState);
        // Wait for change to populate in store. This might get funky
        await new Promise((r) => setTimeout(r, 200));
        expect(store.getActions()).toMatchSnapshot();
    });

    it('should dispatch goal update success with complete as false', async () => {
        fetch.mockResponseSuccess(JSON.stringify({}));
        markGoalAsComplete(1, false, 1)(store.dispatch, getState);
        // Wait for change to populate in store. This might get funky
        await new Promise((r) => setTimeout(r, 200));
        expect(store.getActions()).toMatchSnapshot();
    });
});
