/** @format */

import { Green, Bronze3D, Silver3D, Gold3D } from '../../../asset/banner'

export const getBagdeIconByTier = (tier) => {
    if (tier === 1) return Green
    if (tier === 2) return Bronze3D
    if (tier === 3) return Silver3D
    if (tier === 4) return Gold3D
    return null
}

export const getBadgeTextByTier = (tier) => {
    if (tier === 1) return 'Green'
    if (tier === 2) return 'Bronze'
    if (tier === 3) return 'Silver'
    if (tier === 4) return 'Gold'
    return undefined
}
