/** @format */

import { Actions } from 'react-native-router-flux'

export const back = () => {
    return (dispatch) => {
        dispatch({
            type: '',
        })
        Actions.pop()
    }
}
