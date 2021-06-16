/** @format */

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    feedBackimages: [],
}

const slice = createSlice({
    name: 'feedback',
    initialState,
    reducers: {
        feedbackImagesSelected: (state, action) => {
            state.feedBackimages = [...state.feedBackimages, action.payload]
        },
        deleteFeedbackImage: (state, action) => {
            filtered = state.feedBackimages.filter((feedback, index) => {
                if (index !== action.payload) {
                    return feedback
                }
            })

            state.feedBackimages = filtered
        },

        clearfeedbackImages: () => initialState,
    },
})

export default slice.reducer
export const {
    feedbackImagesSelected,
    clearfeedbackImages,
    deleteFeedbackImage,
} = slice.actions
