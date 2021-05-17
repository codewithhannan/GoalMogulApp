/** @format */

// import { Green, Bronze3D, Silver3D, Gold3D } from '../../../asset/banner'
import Green from '../../../asset/banner/BigGreenBadge.png'
import Bronze from '../../../asset/banner/BigBronzeBadge.png'
import Silver from '../../../asset/banner/BigSilverBadge.png'
import Gold from '../../../asset/banner/BigGoldBadge.png'
import NoBadge from '../../../asset/banner/NoBadge.png'

export const getBagdeIconByTier = (tier) => {
    if (tier === 0) return NoBadge
    if (tier === 1) return Green
    if (tier === 2) return Bronze
    if (tier === 3) return Silver
    if (tier === 4) return Gold
    return null
}

export const getBadgeTextByTier = (tier) => {
    if (tier === 1) return 'Green'
    if (tier === 2) return 'Bronze'
    if (tier === 3) return 'Silver'
    if (tier === 4) return 'Gold'
    return undefined
}
