/** @format */

import { Actions } from 'react-native-router-flux'
import { componentKeyByTab } from '../redux/middleware/utils'

import { CHALLENGES_OPEN_CHALLENGES } from './types'

const DEBUG_KEY = '[ Challenges Action ]'

export const openChallenges = (webpageUrl) => (dispatch, getState) => {
    const { tab } = getState().navigation
    const componentKeyToOpen = componentKeyByTab(tab, 'challenges')

    console.log(`${DEBUG_KEY}: componentKeyToOpen: ${componentKeyToOpen}`)
    dispatch({
        type: CHALLENGES_OPEN_CHALLENGES,
    })
    Actions.push(`${componentKeyToOpen}`, {
        url: webpageUrl,
    })
}
