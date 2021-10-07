/**
 * This component is used in GoalDetailCard which is replaced by GoalDetailCard2
 * So this component is no longer being used.
 * Note: This is the old implementation where Goal Detail is pinned
 * and commenttab is scrollable
 *
 * @format
 */

import React, { Component } from 'react'
import { View, MaskedViewIOS, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Icon } from 'react-native-elements'

import SectionCard from '../Common/SectionCard'

const testNeed = [
    {
        text: 'Get in contact with Nuclear expert',
    },
    {
        text: 'Introduction to someone from Bill and Melinda Gates foundation',
    },
    {
        text: 'Introduction to someone from Bill and Melinda Gates foundation',
    },
]

class CommentTab extends Component {
    renderSections(needs) {
        const sections = needs.map((section, index) => {
            if (index < 2) {
                return (
                    <SectionCard
                        key={Math.random().toString(36).substr(2, 9)}
                        item={section}
                        type="need"
                    />
                )
            }
            if (index === 2) {
                return (
                    <View
                        style={{ backgroundColor: 'white', marginTop: 0.5 }}
                        key={Math.random().toString(36).substr(2, 9)}
                    >
                        <MaskedViewIOS
                            style={{ maxHeight: 300 }}
                            maskElement={
                                <LinearGradient
                                    colors={['white', 'transparent']}
                                    style={{ flex: 1 }}
                                    start={[0, 0.4]}
                                    end={[0, 0.7]}
                                />
                            }
                        >
                            <SectionCard item={section} type="need" />
                        </MaskedViewIOS>
                    </View>
                )
            }
            return null
        })
        if (needs.length < 3) {
            sections.push(
                <View
                    style={{
                        height: 40,
                        backgroundColor: 'white',
                        marginTop: 0.5,
                    }}
                    key={Math.random().toString(36).substr(2, 9)}
                />
            )
        }
        return <View>{sections}</View>
    }

    renderViewGoal() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 10,
                    position: 'absolute',
                    bottom: 10,
                    left: 0,
                    right: 0,
                }}
            >
                <Text style={styles.viewGoalTextStyle}>View Goal</Text>
                <View style={{ alignSelf: 'center', alignItems: 'center' }}>
                    <Icon
                        name="ios-arrow-round-forward"
                        type="ionicon"
                        color="#17B3EC"
                        iconStyle={styles.iconStyle}
                    />
                </View>
            </View>
        )
    }

    render() {
        const needs = this.props.item ? this.props.item : testNeed
        return (
            <View style={{ flex: 1 }}>
                {this.renderSections(needs)}
                <View style={{ backgroundColor: 'white' }}>
                    {this.renderViewGoal()}
                </View>
            </View>
        )
    }
}

const styles = {
    viewGoalTextStyle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#17B3EC',
        alignSelf: 'center',
    },
    iconStyle: {
        alignSelf: 'center',
        fontSize: 20,
        marginLeft: 5,
        marginTop: 2,
    },
}

export default CommentTab
