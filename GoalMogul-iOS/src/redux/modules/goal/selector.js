/** @format */

import { createSelector } from 'reselect'
import _ from 'lodash'
import { INITIAL_GOAL_PAGE, INITIAL_UPDATES_OBJECT } from './Goals'

import { getCommentWithPageInfo } from '../feed/comment/CommentSelector'

const DEBUG_KEY = '[ Selector Goal ]'

const getNeeds = (state) => state.goalDetail.goal.needs
const getSteps = (state) => state.goalDetail.goal.steps

const getGoalUpdates = (state, goalId, pageId) =>
    _.get(state, `goals.updates.${goalId}.${pageId}`, INITIAL_UPDATES_OBJECT)

const getComments = (state) => state.comment

const getCommentsV2 = (state, goalId, pageId) =>
    getCommentWithPageInfo(state, goalId, pageId)

const getPageId = (state, pageId) => pageId

const getTab = (state) => state.navigation.tab
const getState = (state) => state.goalDetail

/*
 * Transform a goal's need and step to become
 * [ {needTitle: 'needs'}, ..., {stepTitle: 'steps'}, ...]
 * in GoalDetailCard2
 */
export const getGoalStepsAndNeeds = createSelector(
    [getState, getTab, getComments, getPageId],
    (goalDetails, tab, allComments, pageId) => {
        const path =
            !tab || tab === 'homeTab' ? 'goal' : `goal${capitalizeWord(tab)}`
        const goal = _.get(goalDetails, `${path}.goal`)

        const page = pageId ? `${pageId}` : 'default'
        const commentPath = !tab ? `homeTab.${page}` : `${tab}.${page}`
        const comments = _.get(allComments, `${commentPath}`)

        const { needs, steps } = goal
        let res = []
        if (steps && steps.length > 0) {
            res.push({
                sectionTitle: 'steps',
                count: steps.length,
                _id: 'step-title',
            })
        }

        // Transform needs to have a type
        let newSteps = []
        if (steps && steps.length !== 0) {
            newSteps = steps.map((step) => {
                const stepComments = comments.transformedComments.filter(
                    (c) => {
                        if (
                            c.suggestion &&
                            c.suggestion.suggestionForRef &&
                            c.suggestion.suggestionForRef === step._id
                        ) {
                            return true
                        }
                        return false
                    }
                )

                let count = 0
                stepComments.forEach((c) => {
                    if (c.childComments && c.childComments.length > 0) {
                        // Count all the childComments
                        count += c.childComments.length
                    }
                    // Count the current comment
                    count += 1
                })

                // console.log(`${DEBUG_KEY}: count is: `, count);
                return {
                    ...step,
                    type: 'step',
                    count,
                }
            })
        }

        res = res.concat(newSteps)

        if (needs && needs.length > 0) {
            res.push({
                sectionTitle: 'needs',
                count: needs.length,
                _id: 'need-title',
            })
        }
        // Transform needs to have a type
        let newNeeds = []
        if (needs && needs.length !== 0) {
            newNeeds = needs.map((need) => {
                const needComments = comments.transformedComments.filter(
                    (c) => {
                        if (
                            c.suggestion &&
                            c.suggestion.suggestionForRef &&
                            c.suggestion.suggestionForRef === need._id
                        ) {
                            return true
                        }
                        return false
                    }
                )

                let count = 0
                needComments.forEach((c) => {
                    if (c.childComments && c.childComments.length > 0) {
                        // Count all the childComments
                        count += c.childComments.length
                    }
                    // Count the current comment
                    count += 1
                })

                return {
                    ...need,
                    type: 'need',
                    count,
                }
            })
        }

        res = res.concat(newNeeds)
        return res
    }
)

export const makeGetGoalStepsAndNeedsV2 = () =>
    createSelector(
        [getGoal, getCommentsV2, (...args) => args[args.length - 1]],
        (goal, comments, props) => {
            const { isSelf } = props
            const { needs, steps } = goal
            let res = []
            if (isSelf || (steps && steps.length > 0)) {
                res.push({
                    sectionTitle: 'steps',
                    count: steps.length,
                })
            }

            // Transform needs to have a type
            let newSteps = []
            if (steps && steps.length !== 0) {
                newSteps = steps.map((step) => {
                    const stepComments = comments.transformedComments.filter(
                        (c) => {
                            const isSuggestionForStep =
                                c.suggestion &&
                                c.suggestion.suggestionForRef &&
                                c.suggestion.suggestionForRef === step._id

                            const isCommentForStep = c.stepRef === step._id
                            if (isCommentForStep || isSuggestionForStep) {
                                return true
                            }
                            return false
                        }
                    )

                    let count = 0
                    stepComments.forEach((c) => {
                        if (c.childComments && c.childComments.length > 0) {
                            // Count all the childComments
                            count += c.childComments.length
                        }
                        // Count the current comment
                        count += 1
                    })

                    // console.log(`${DEBUG_KEY}: count is: `, count);
                    return {
                        ...step,
                        type: 'step',
                        count,
                    }
                })
            }

            res = res.concat(newSteps)
            if (isSelf)
                res.push({
                    type: 'step',
                    isCreateCard: true,
                    description: '',
                })

            if (isSelf || (needs && needs.length > 0)) {
                res.push({
                    sectionTitle: 'needs',
                    count: needs.length,
                })
            }
            // Transform needs to have a type
            let newNeeds = []
            if (needs && needs.length !== 0) {
                newNeeds = needs.map((need) => {
                    const needComments = comments.transformedComments.filter(
                        (c) => {
                            const isSuggestionForNeed =
                                c.suggestion &&
                                c.suggestion.suggestionForRef &&
                                c.suggestion.suggestionForRef === need._id

                            const isCommentForNeed = c.needRef === need._id
                            if (isSuggestionForNeed || isCommentForNeed) {
                                return true
                            }
                            return false
                        }
                    )

                    let count = 0
                    needComments.forEach((c) => {
                        if (c.childComments && c.childComments.length > 0) {
                            // Count all the childComments
                            count += c.childComments.length
                        }
                        // Count the current comment
                        count += 1
                    })

                    return {
                        ...need,
                        type: 'need',
                        count,
                    }
                })
            }

            res = res.concat(newNeeds)
            if (isSelf)
                res.push({
                    type: 'need',
                    isCreateCard: true,
                    description: '',
                })
            return res
        }
    )

// Get goal detail by tabs
export const getGoalDetailByTab = createSelector(
    [getState, getTab],
    (goalDetails, tab) => {
        const path =
            !tab || tab === 'homeTab' ? 'goal' : `goal${capitalizeWord(tab)}`
        return _.get(goalDetails, `${path}`)
    }
)

export const getGoal = (state, goalId) => {
    const goals = state.goals
    if (_.has(goals, `${goalId}.goal`)) {
        return _.get(goals, `${goalId}.goal`)
    }
    return {}
}

const getGoalPage = (state, goalId, pageId) => {
    const goals = state.goals
    if (_.has(goals, `${goalId}.${pageId}`)) {
        return _.get(goals, `${goalId}.${pageId}`)
    }
    return { ...INITIAL_GOAL_PAGE }
}

export const makeGetGoalDetailById = () => {
    return createSelector([getGoal], (goal) => goal)
}

export const makeGetGoalUpdatesById = () => {
    return createSelector([getGoalUpdates], (data) => data)
}

export const makeGetGoalPageDetailByPageId = () => {
    return createSelector([getGoal, getGoalPage], (goal, goalPage) => {
        return {
            goal,
            goalPage,
        }
    })
}

const capitalizeWord = (word) => {
    if (!word) return ''
    return word.replace(/^\w/, (c) => c.toUpperCase())
}
