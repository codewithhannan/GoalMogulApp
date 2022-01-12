/** @format */

import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'

const initialState = {
    loading: false,
    weekly: {
        time: Date.now(),
        days: [],
    },
    monthly: {
        time: Date.now(),
        startData: '',
        endDate: '',
    },

    error: '',
}

const slice = createSlice({
    name: 'accountability',
    initialState,
    reducers: {
        loading: (state, action) => {
            state.loading = action.payload
        },
        selectWeeklyTime: (state, action) => {
            state.weekly.time = action.payload
        },
        selectWeeklyDays: (state, action) => {
            let selectedDays = []
            const { days } = action.payload
            selectedDays.push(days)
            state.weekly.days = selectedDays
        },
        selectedWeek: (state, action) => {
            state.weekly.selected = action.payload
        },
        selecMonthlyTime: (state, action) => {
            state.monthly.time = action.payload
        },
        selectedMonth: (state, action) => {
            state.monthly.selected = action.payload
        },

        error: (state, action) => {
            state.loading = action.payload
        },
        clearAccountability: () => initialState,
    },
})

export default slice.reducer
export const {
    loading,
    error,
    selectWeeklyTime,
    selecMonthlyTime,
    selectWeeklyDays,
    selectedWeek,
    selectedMonth,
    clearAccountability,
} = slice.actions
