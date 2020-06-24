/** @format */

import { ActionSheetIOS } from 'react-native'

import R from 'ramda'

export const actionSheet = R.curry(
    (options, cancelIndex, switchCases) => () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex: cancelIndex,
            },
            (buttonIndex) => {
                console.log('button clicked', options[buttonIndex])
                switchCases(buttonIndex)
            }
        )
    }
)

export const switchByButtonIndex = R.curry((func, buttonIndex) =>
    // R.pipe(
    //   // Filter based on condition
    //   R.filter((a) => a.key === buttonIndex, func),
    //   // Execute the function
    //   (res) => res.f
    // )
    R.cond(func)(buttonIndex)
)
