/** @format */

import { createSelector } from 'reselect'
import R from 'ramda'

const getBlocks = (state) => state.setting.block.data

export const getBlockees = createSelector([getBlocks], (data) =>
    R.map((block) => ({
        user: R.pipe(R.prop('blockee'), R.prop('users_id'))(block),
        blockId: R.prop('_id')(block),
    }))(data)
)
