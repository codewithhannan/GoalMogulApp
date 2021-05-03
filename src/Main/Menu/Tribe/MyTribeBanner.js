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
import { default_style, color } from '../../../styles/basic'
import { Actions } from 'react-native-router-flux'

class MyTribeBanner extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        const { tribe, tribeId, pageId } = this.props
        return (
            <View style={styles.containerStyle}>
                <View style={styles.imageContainer}>
                    <Image style={styles.imageStyle} source={bulbIcon}></Image>
                </View>
                <View style={styles.aboutContainer}>
                    <Text style={styles.header}>
                        {`Spread H.O.P.E.\nHelp One Person Everyday`}
                    </Text>
                    <Text style={styles.copy}>
                        {`Be the FIRST to:\nIntroduce yourself. Spread positive vibes. Share your goals. Be encouraging. Offer help. Give congrats. Play full out.`}
                    </Text>
                    {/* TODO: Add your onClick handler here, for the share your goal button. */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() =>
                            Actions.push('myTribeGoalShareView', {
                                tribe,
                                tribeId,
                                pageId,
                            })
                        }
                    >
                        <Text
                            style={[
                                default_style.titleText_1,
                                { marginTop: 12, color: color.GM_BLUE },
                            ]}
                        >
                            Tap here to share a goal!
                        </Text>
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
        backgroundColor: color.GM_CARD_BACKGROUND,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 5,
    },
    aboutContainer: {
        flex: 1,
        padding: 20,
        paddingRight: 16,
    },
    header: {
        ...default_style.titleText_1,
        marginBottom: 8,
    },
    copy: default_style.normalText_1,
    imageStyle: {
        width: 40 * default_style.uiScale,
        height: 40 * default_style.uiScale,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16,
    },
}
