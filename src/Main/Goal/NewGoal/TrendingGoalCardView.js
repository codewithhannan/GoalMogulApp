/** @format */

// This is the view for a TrendingGoalCard
import React from 'react'
import { View, TouchableOpacity, Image, Text, Dimensions } from 'react-native'
import { connect } from 'react-redux'

// Actions
import { selectTrendingGoals } from '../../../redux/modules/goal/CreateGoalActions'

// Assets
import plus from '../../../asset/utils/plus.png'

// Utils
import { nFormatter } from '../../../redux/middleware/utils'

// Styles
import { color, default_style } from '../../../styles/basic'
import { Actions } from 'react-native-router-flux'

class TrendingGoalCard extends React.PureComponent {
    onPress = (title) => {
        if (this.props.maybeOpenModal) {
            Actions.push('createGoalModal')
            this.props.selectTrendingGoals(title)
        } else {
            this.props.selectTrendingGoals(title)
            Actions.pop()
        }
    }

    renderStats(item) {
        const { title } = item
        return (
            <TouchableOpacity
                style={styles.plusIconContainerStyle}
                onPress={() => this.onPress(title)}
            >
                <Image
                    source={plus}
                    style={{ ...default_style.smallIcon_1, tintColor: 'white' }}
                />
            </TouchableOpacity>
        )
    }

    renderTitle(item) {
        const { frequency, title } = item
        return (
            <View
                style={{
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingRight: 5,
                    flex: 1,
                }}
            >
                <Text
                    style={{ ...default_style.titleText_2, flex: 1 }}
                    ellipsizeMode="tail"
                    numberOfLines={3}
                >
                    {title}
                </Text>
                <Text
                    style={{ ...default_style.smallText_1, color: '#9B9B9B' }}
                >
                    {nFormatter(frequency) + ' '}users have this goal in common
                </Text>
            </View>
        )
    }

    renderRank(index) {
        return (
            <View
                style={{
                    padding: 15,
                    paddingRight: 4,
                    justifyContent: 'center',
                }}
            >
                <Text style={default_style.titleText_2}>#{index}</Text>
            </View>
        )
    }

    render() {
        const { item, index } = this.props
        if (!item) return
        return (
            <View style={styles.containerStyle}>
                {this.renderRank(index)}
                <View
                    style={{ width: 1, margin: 8, backgroundColor: '#DADADA' }}
                />
                {this.renderTitle(item)}
                <View style={{ justifyContent: 'center' }}>
                    {this.renderStats(item)}
                </View>
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: color.GM_CARD_BACKGROUND,
        flexDirection: 'row',
        alignItems: 'stretch',

        borderWidth: 1,
        borderColor: '#e9e9e9',

        marginLeft: 16,
        marginRight: 16,
        marginBottom: 5,
    },
    plusIconContainerStyle: {
        backgroundColor: color.GM_BLUE,
        margin: 12,
        padding: 8,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
}

export default connect(null, {
    selectTrendingGoals,
})(TrendingGoalCard)
