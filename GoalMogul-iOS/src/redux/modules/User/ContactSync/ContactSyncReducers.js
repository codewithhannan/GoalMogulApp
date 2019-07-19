/**
 * NOTE: This is reducers for contact sync functions. There might be 
 */
import _ from 'lodash';
import {
    arrayUnique,
    hasTypePrefix
} from '../../../middleware/utils';

const INITIAL_STATE = {
    contacts: {
        data: [],
        hasUploaded: false
    },
    remoteMatches: {
        data: [],
        limit: 20,
        skip: 0,
        hasNextPage: undefined
    }
};

export const CONTACT_SYNC_LOAD_CONTACT_DONE = 'contact_sync_load_contact_done';
export const CONTACT_SYNC_INVITE_CONTACT = 'contact_sync_invite_contact';
export const CONTACT_SYNC_FINISH = 'contact_sync_finish';

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CONTACT_SYNC_LOAD_CONTACT_DONE: {
            let newState = _.cloneDeep(state);
            const { data } = action.payload;
            // Only keep contacts that contactType is person
            const filteredData = data.filter((c) => c && c.contactType === 'person');
            newState = _.set(newState, 'contacts.data', filteredData);
            return newState;
        }

        // User invite a contact. Mark it as invited
        case CONTACT_SYNC_INVITE_CONTACT: {
            let newState = _.cloneDeep(state);
            const { data } = action.payload;
            const oldData = _.get(newState, 'contacts.data');
            
            // Mark user as invited
            const newData = oldData.map(c => {
                if (_.isEqual(c, data)) {
                    return {
                        ...c,
                        isInvited: true
                    };
                }
                return c;
            });

            newState = _.set(newState, 'contacts.data', newData);
            return newState;
        }

        default: 
            return { ...state };
    }
};
