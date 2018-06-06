import {
  HOME_CLOSE_CREATE_OVERLAY,
  HOME_MASTERMIND_OPEN_CREATE_OVERLAY
} from '../../../../reducers/Home';

export const openCreateOverlay = () => ({
  type: HOME_MASTERMIND_OPEN_CREATE_OVERLAY
});

export const closeCreateOverlay = (tab) => ({
  type: HOME_CLOSE_CREATE_OVERLAY,
  payload: tab
});
