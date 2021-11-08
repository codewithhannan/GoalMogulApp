/** @format */

import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'

const initialState = {
    videoUri: 'test',
    videoFromCameraRollUri: '',
    voiceUri: '',
}

const slice = createSlice({
    name: 'profileSwiper',
    initialState,
    reducers: {
        setVideoUri: (state, action) => {
            state.videoUri = action.payload
        },
        setVideoFromCameraUri: (state, action) => {
            state.videoFromCameraRollUri = action.payload
        },
        setVoiceUri: (state, action) => {
            state.voiceUri = action.payload
        },
        backToInitialState: () => initialState,
    },
})

export default slice.reducer
export const {
    setVideoUri,
    setVoiceUri,
    setVideoFromCameraUri,
    backToInitialState,
} = slice.actions
