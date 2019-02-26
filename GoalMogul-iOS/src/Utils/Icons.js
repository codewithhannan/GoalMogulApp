import React from 'react';
import {
    Image,
    View
} from 'react-native';

import search_icon from '../asset/utils/search.png';
import right_arrow_icon from '../asset/utils/right_arrow.png';

export const SearchIcon = (props) => {
    const { iconContainerStyle, iconStyle } = props; 

    return (
        <View style={iconContainerStyle}>
            <Image source={search_icon} style={iconStyle} />
        </View>
    );
};

export const RightArrowIcon = (props) => {
    const { iconContainerStyle, iconStyle } = props; 

    return (
        <View style={iconContainerStyle}>
            <Image source={right_arrow_icon} style={iconStyle} />
        </View>
    );
};

