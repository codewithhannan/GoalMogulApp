/**
 * This component corresponds to My Goals2.2-1 design. New user page
 * condensed goal layout
 * https://www.figma.com/file/5CNnuTKGZeoJDGaC2rku7v/Happy-Flow?node-id=994%3A1956
 *
 * @format
 */

import React from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import timeago from 'timeago.js'
import _ from 'lodash'

// Components
import Timestamp from '../Common/Timestamp'
import DelayedButton from '../../Common/Button/DelayedButton'

// Actions
import { openGoalDetail } from '../../../redux/modules/home/mastermind/actions'
import { default_style, color } from '../../../styles/basic'
import { PRIVACY_OPTIONS } from '../../../Utils/Constants'
import { Icon } from '@ui-kitten/components'
import { GOALS_STYLE, PRIORTY_PILL_STYLES } from '../../../styles/Goal'

class CompactGoalCard extends React.Component {
    /**
     * Open Goal Detail page on Card pressed
     */
    handleOnCardPress = (item) => {
        this.props.onPress
            ? this.props.onPress(item)
            : this.props.openGoalDetail(item)
    }

    /**
     * This method renders category and timestamp
     */
    renderHeader(item) {
        const { category, created, privacy, isCompleted, priority } = item
        const privacyObj = PRIVACY_OPTIONS.find(
            ({ value }) => value === privacy
        )

        const PRIORTY_PILL_STYLE =
            PRIORTY_PILL_STYLES[((priority || 1) - 1) % 10]

        return (
            <View style={styles.headerContainerStyle}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={default_style.smallTitle_1}>
                        {category} |{' '}
                    </Text>
                    <Timestamp time={timeago().format(created)} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* Privacy pill */}
                    {privacy && (
                        <View
                            style={[
                                GOALS_STYLE.commonPillContainer,
                                {
                                    // width: GOALS_STYLE.privacyPillWidth,
                                    borderWidth: isCompleted ? 0.25 : 0,
                                    borderColor: color.GM_MID_GREY,
                                },
                            ]}
                        >
                            <Icon
                                pack="material-community"
                                name={privacyObj.materialCommunityIconName}
                                style={[GOALS_STYLE.commonPillIcon]}
                            />
                            <Text style={[GOALS_STYLE.commonPillText]}>
                                {privacyObj.text}
                            </Text>
                        </View>
                    )}
                    {/* Priority pill */}
                    {priority && (
                        <View
                            style={[
                                GOALS_STYLE.commonPillContainer,
                                {
                                    width: GOALS_STYLE.priorityPillWidth,
                                    backgroundColor:
                                        PRIORTY_PILL_STYLE.backgroundColor,
                                    borderColor: PRIORTY_PILL_STYLE.color,
                                    borderWidth: isCompleted ? 0.25 : 0,
                                    marginLeft: 8,
                                },
                            ]}
                        >
                            <Icon
                                pack="material-community"
                                name={
                                    PRIORTY_PILL_STYLE.materialCommunityIconName
                                }
                                style={[
                                    GOALS_STYLE.commonPillIcon,
                                    { tintColor: PRIORTY_PILL_STYLE.color },
                                ]}
                            />
                            <Text
                                style={[
                                    GOALS_STYLE.commonPillText,
                                    { color: PRIORTY_PILL_STYLE.color },
                                ]}
                            >
                                {priority}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        )
    }

    /**
     * This method renders goal title
     */
    renderTitle(item) {
        const { title } = item
        return (
            <Text
                style={{
                    ...default_style.goalTitleText_1,
                    flex: 1,
                    flexWrap: 'wrap',
                }}
                numberOfLines={3}
                ellipsizeMode="tail"
            >
                {title}
            </Text>
        )
    }

    render() {
        const { item, disabled, index } = this.props
        if (!item || _.isEmpty(item)) return null

        const backgroundColor = item.isCompleted
            ? '#F6F6F6'
            : color.GM_CARD_BACKGROUND
        return (
            <DelayedButton
                key={index}
                activeOpacity={1}
                style={[styles.cardContainerStyle, { backgroundColor }]}
                onPress={() => this.handleOnCardPress(item)}
                disabled={disabled}
            >
                {this.renderHeader(item)}
                {this.renderTitle(item)}
            </DelayedButton>
        )
    }
}

const styles = {
    cardContainerStyle: {
        padding: 16,
        borderRadius: 2,
    },
    headerContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        marginBottom: 8,
    },
    // Stats component default style
    statsContainerStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
}

export default connect(null, {
    openGoalDetail,
})(CompactGoalCard)
