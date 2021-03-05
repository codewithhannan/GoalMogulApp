/** @format */

// Actions for suggestion modal

export const createSuggestion = () => {}

export const cancelSuggestion = () => {}

export const chooseCategory = (category) => (dispatch) =>
    dispatch({
        payload: category,
    })

export const submitSuggestion = () => (dispatch, getState) => {}
