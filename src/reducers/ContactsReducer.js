/** @format */

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loading: false,
    contacts: [],
    error: '',
}

const slice = createSlice({
    name: 'contacts',
    initialState,
    reducers: {
        loadingPhoneContacts: (state, action) => {
            state.loading = action.payload
        },
        setPhoneContacts: (state, action) => {
            state.contacts = action.payload
        },
        phoneContactsError: (state, action) => {
            state.loading = true
            state.error = action.payload
        },
    },
})

export default slice.reducer
export const {
    loadingPhoneContacts,
    setPhoneContacts,
    phoneContactsError,
} = slice.actions
