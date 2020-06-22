/** @format */

import { createSelector } from 'reselect'
import R from 'ramda'

const getFilter = (state) => state.search

export const getFilteredSearch = createSelector()
