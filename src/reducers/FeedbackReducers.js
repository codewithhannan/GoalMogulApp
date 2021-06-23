/** @format */

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    feedBackimages: [],
    imagesToSend: [],
}

const slice = createSlice({
    name: 'feedback',
    initialState,
    reducers: {
        feedbackImagesSelected: (state, action) => {
            state.feedBackimages = [...state.feedBackimages, action.payload]
        },
        feedbackImagesToSend: (state, action) => {
            state.imagesToSend = [...state.imagesToSend, action.payload]
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
    feedbackImagesToSend,
} = slice.actions
