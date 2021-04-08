/** @format */

import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import { api as API } from '../redux/middleware/api/index'

const initialState = {
    FIRST_GOAL: {
        status: false,
        created: '',
    },
    SEVEN_GOALS: {
        status: false,
        created: '',
    },
    SILVER_BADGE: {
        status: false,
        created: '',
    },
    GOLD_BADGE: {
        status: false,
        created: '',
    },
    GREEN_BADGE: {
        status: false,
        created: '',
    },
    BRONZE_BADGE: {
        status: false,
        created: '',
    },
    STREAK: {
        status: false,
        created: '',
    },
    STREAK_MISSED: {
        status: false,
        created: '',
    },
}

const slice = createSlice({
    name: 'popup',
    initialState,
    reducers: {
        setPopupData: (state, action) => {
            // console.log('\nsetPopupData is called in reducer')
            state = action.payload.data
            return state
        },
        updatePopupData: (state, action) => {
            state = action.payload.data
            return state
        },
    },
})

export default slice.reducer
export const { setPopupData, updatePopupData } = slice.actions
