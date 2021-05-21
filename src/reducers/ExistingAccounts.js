/** @format */

import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'

const initialState = {
    loading: false,
    allUser: [],
    allTribes: [],
    allChats: [],
    error: '',

    userSkip: 0,
    tribeSkip: 0,
    chatSkip: 0,
    limit: 10,
}

const slice = createSlice({
    name: 'allAccounts',
    initialState,
    reducers: {
        loadAllData: (state, action) => {
            state.loading = action.payload
        },
        getAllUsers: (state, action) => {
            state.allUser = action.payload
        },
        getLoadedUsers: (state, action) => {
            state.userSkip += 10

            state.allUser = [...state.allUser, ...action.payload]
        },

        getAllTribes: (state, action) => {
            state.allTribes = action.payload
        },
        getLoadedTribes: (state, action) => {
            state.tribeSkip += 10
            state.allTribes = [...state.allTribes, ...action.payload]
        },
        getAllChats: (state, action) => {
            state.allChats = action.payload
        },
        getLoadedChats: (state, action) => {
            state.chatSkip += 10

            state.allChats = [...state.allChats, ...action.payload]
        },
        clearExistingSearched: (state) => initialState,
    },
})

export default slice.reducer
export const {
    loadAllData,
    getAllUsers,
    getAllTribes,
    getAllChats,
    getLoadedTribes,
    errorGettingData,
    getLoadedChats,
    getLoadedUsers,
    clearExistingSearched,
} = slice.actions
