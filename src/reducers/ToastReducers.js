/** @format */

import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'

const initialState = {
    loading: false,
    toastsData: {
        friendsProfileToVisit: [],
        showImageToast: false,
        showGreenBadge: false,
        showGetGreenBadge: false,
        showGetBronzeBadge: false,
        showGetSilverBadge: false,
        showGetGoldBadge: { toShow: false, friendsWithBronzeBadge: 0 },
        closeFriendsToVisit: [],
    },
    error: '',
}

const slice = createSlice({
    name: 'toasts',
    initialState,
    reducers: {
        loadToastData: (state, action) => {
            state.loading = true
        },
        getToastData: (state, action) => {
            // state.toastsData.friendsProfileToVisit = action.payload
            // state.toastsData.showImageToast = action.payload
            // state.toastsData.showGreenBadge = action.payload
            // state.toastsData.showGetGreenBadge = action.payload
            // state.toastsData.showGetBronzeBadge = action.payload
            // state.toastsData.showGetSilverBadge = action.payload
            // state.toastsData.showGetGoldBadge = action.payload

            state.toastsData = action.payload
            state.loading = false
        },
        resetToastData: () => initialState,
    },
})

export default slice.reducer
export const { loadToastData, getToastData, resetToastData } = slice.actions
