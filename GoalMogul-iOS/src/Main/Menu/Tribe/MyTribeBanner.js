/**
 * This modal shows the congradulation message for user earning a new badge
 *
 * @format
 */

import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { View, Image, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import bulbIcon from '../../../asset/icons/bulb.png'
import { DEFAULT_STYLE, GM_BLUE } from '../../../styles'

class MyTribeBanner extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                <View style={styles.imageContainer}>
                    <Image style={styles.imageStyle} source={bulbIcon}></Image>
                </View>
                <View style={styles.aboutContainer}>
                    <Text style={styles.header}>Get tips and suggestions</Text>
                    <Text style={styles.copy}>
                        By sharing your goals to the selected tribe, you can
                        recieve tips and suggestions even faster.
                    </Text>
                    {/* TODO: Add your onClick handler here, for the share your goal button. */}
                    <TouchableOpacity>
                        <Text style={styles.link}>Share your goal</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default connect()(MyTribeBanner)

const styles = {
    containerStyle: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 16,
        marginRight: 16,
        borderRadius: 5,
    },
    aboutContainer: {
        padding: 20,
    },
    header: {
        ...DEFAULT_STYLE.titleText_1,
        marginBottom: 8,
    },
    copy: DEFAULT_STYLE.normalText_1,
    imageStyle: {
        width: 40 * DEFAULT_STYLE.uiScale,
        height: 40 * DEFAULT_STYLE.uiScale,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16,
    },
    link: {
        marginTop: 12,
        color: GM_BLUE,
    },
}
