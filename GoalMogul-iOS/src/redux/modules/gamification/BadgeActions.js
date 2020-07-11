import { Green, Bronze3D, Silver3D, Gold3D } from "../../../asset/banner";


export const getBagdeIconByTier = (tier) => {
    if (tier === 0) return Green;
    if (tier === 1) return Bronze3D;
    if (tier === 2) return Silver3D;
    if (tier === 3) return Gold3D;
    return Green;
};

export const getBadgeTextByTier = (tier) => {
    if (tier === 0) return 'Green';
    if (tier === 1) return 'Bronze';
    if (tier === 2) return 'Silver';
    if (tier === 3) return 'Gold';
    return 'Green';
};
