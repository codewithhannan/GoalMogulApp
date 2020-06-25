/** @format */

import { createSelector } from 'reselect'
import _ from 'lodash'
import { INITIAL_POST_OBJECT, INITIAL_POST_PAGE } from './Posts'

const getNavigationTab = (state) => {
    const { tab } = state.navigation
    return tab
}

const getPost = (state) => state.postDetail
const getShare = (state) => state.shareDetail

/*
 * Iterate through member list to check if user is a current member
 */
export const getPostDetailByTab = () =>
    createSelector([getNavigationTab, getPost], (tab, post) => {
        const path =
            !tab || tab === 'homeTab' ? 'post' : `post${capitalizeWord(tab)}`
        return _.get(post, `${path}`)
    })

export const getShareDetailByTab = () => {
    return createSelector([getNavigationTab, getShare], (tab, share) => {
        const path =
            !tab || tab === 'homeTab' ? 'share' : `share${capitalizeWord(tab)}`
        return _.get(share, `${path}`)
    })
}

const capitalizeWord = (word) => {
    if (!word) return ''
    return word.replace(/^\w/, (c) => c.toUpperCase())
}

const getPostById = (state, postId) => {
    const posts = state.posts
    if (_.has(posts, `${postId}.post`)) {
        return _.get(posts, `${postId}.post`)
    }
    return { ...INITIAL_POST_OBJECT }
}

const getPostPage = (state, postId, pageId) => {
    const posts = state.posts
    if (_.has(posts, `${postId}.${pageId}`)) {
        return _.get(posts, `${postId}.${pageId}`)
    }
    return { ...INITIAL_POST_PAGE }
}

export const makeGetPostById = () =>
    createSelector([getPostById, getPostPage], (post, postPage) => {
        return {
            post,
            postPage,
        }
    })
