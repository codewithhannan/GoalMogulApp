/** @format */

import R from 'ramda'
import _ from 'lodash'

import { arrayUnique } from '../../../middleware/utils'

/**
 * This reducer is servered as denormalized comment stores
 */
const INITIAL_STATE = {
    category: undefined,
}
