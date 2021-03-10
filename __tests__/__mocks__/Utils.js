/** @format */

import { render } from 'react-native-testing-library'

export const getRandomId = (length = 10) => {
    var str = ''
    for (var i = 1; i < length + 1; i = i + 8) {
        str += Math.random().toString(36).substr(2, 10)
    }
    return ('_' + str).substr(0, length)
}

/**
 * Custom renderer with custom re-renderer. Please note that this returns a new instance
 * of the UI rather than update in memory tree due to the wrapper.
 *
 * @param {React Element} node UI to render
 * @param {Object} options same as render elements
 */
export const customRenderer = (node, options) => {
    const rendered = render(node, options)
    return {
        ...rendered,
        rerender: (ui, options) =>
            customRenderer(ui, { container: rendered.container, ...options }),
    }
}
