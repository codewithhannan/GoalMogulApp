/** @format */

import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'

const initialState = {
    loading: false,
    allUser: [],
    allTribes: [],
    allChats: [],
    error: '',
    skip: 0,
    limit: 20,
}

const slice = createSlice({
    name: 'allAccounts',
    initialState,
    reducers: {
        loadAllData: (state, action) => {
            state.loading = action.payload
        },
        getAllUsers: (state, action) => {
            state.skip += 20
            state.allUser = action.payload
        },
        getLoadedUsers: (state, action) => {
            state.skip += 20
            state.allUser = [...state.allUser, ...action.payload]
        },

        getAllTribes: (state, action) => {
            state.allTribes = action.payload
        },
        getAllChats: (state, action) => {
            state.allChats = action.payload
        },
        errorGettingData: (state, action) => {
            state.loading = action.payload
        },
    },
})

export default slice.reducer
export const {
    loadAllData,
    getAllUsers,
    getAllTribes,
    getAllChats,
    errorGettingData,
    getLoadedUsers,
} = slice.actions
