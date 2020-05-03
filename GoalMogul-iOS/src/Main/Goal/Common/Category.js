import React from 'react';
import { Text, View } from 'react-native';
import { GM_FONT_FAMILY_2 } from '../../../styles';

const Category = (props) => {
    // TODO: format time
    return (
        <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
            <Text style={styles.containerStyle} ellipsizeMode='tail' numberOfLines={1}>
                in {props.text}
            </Text>
        </View>
    );
};

const styles = {
    containerStyle: {
        fontSize: 11,
        color: '#3B414B',
        fontFamily: GM_FONT_FAMILY_2,
        alignSelf: 'center',
        fontWeight: '500'
    }
};

export default Category;
