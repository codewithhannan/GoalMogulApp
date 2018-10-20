import { createSelector } from 'reselect';

const getEventParticipants = (state) => {
  if (state.event.item) {
    return state.event.item.participants;
  }
  return [];
};

const getMyEventParticipants = (state) => {
  if (state.myEvent.item) {
    return state.myEvent.item.participants;
  }
  return [];
};
const getUserId = (state) => state.user.userId;
const getParticipantsFilter = (state) => state.event.participantsFilter;

/*
 * Transform a goal's need and step to become
 * [ {needTitle: 'needs'}, ..., {stepTitle: 'steps'}, ...]
 */
export const getUserStatus = createSelector(
  [getEventParticipants, getUserId],
  (participants, userId) => {
    if (!participants) return '';

    let status;
    participants.map((participant) => {
      if (participant.participantRef._id === userId) {
        status = participant.rsvp;
      }
      return '';
    });
    return status;
  }
);

export const getMyEventUserStatus = createSelector(
  [getMyEventParticipants, getUserId],
  (participants, userId) => {
    if (!participants) return '';

    let status;
    participants.map((participant) => {
      if (participant.participantRef._id === userId) {
        status = participant.rsvp;
      }
      return '';
    });
    return status;
  }
);

// Select participants based on the filter option
export const participantSelector = createSelector(
  [getParticipantsFilter, getEventParticipants],
  (filter, participants) => {
    if (!participants) return '';

    return participants.filter((participant) => participant.rsvp === filter);
  }
);
