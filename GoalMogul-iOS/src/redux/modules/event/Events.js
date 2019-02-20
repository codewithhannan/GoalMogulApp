/**
 * This reducer is the source of truth for Events related Components based on the design
 * https://docs.google.com/document/d/1JxjCLZGsp5x_Sy0R56y05aUgAUALtuSVAgJIway9JTg/edit?usp=sharing
 */

import _ from 'lodash';


const INITIAL_STATE = {

};

const DEBUG_KEY = '[ Reducers Events ]';

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        default: 
            return { ...state };
    }
};
