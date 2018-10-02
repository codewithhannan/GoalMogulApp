import { createSelector } from 'reselect';

const getEventParticipants = (state) => {
  if (state.event.item) {
    return state.event.item.participants;
  }
  return [];
};
const getUserId = (state) => state.user.userId;

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
