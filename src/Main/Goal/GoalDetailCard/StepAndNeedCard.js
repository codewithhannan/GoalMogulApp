/** @format */

import React, { Component } from 'react'
import { View, Image, Text } from 'react-native'

// Components
import SectionCard from '../Common/SectionCard'
import { DotIcon } from '../../../Utils/Icons'

// Assets
import HelpIcon from '../../../asset/utils/help.png'
import StepIcon from '../../../asset/utils/steps.png'

// Styles
import { cardBoxBorder } from '../../../styles'

class StepAndNeedCard extends Component {
    renderSectionTitle(item) {
        if (item.sectionTitle === 'needs') {
            return (
                <SectionTitle
                    iconSource={HelpIcon}
                    text="Needs"
                    count={item.count}
                    goalRef={this.props.goalRef}
                />
            )
        }
        return (
            <SectionTitle
                iconSource={StepIcon}
                iconStyle={{ height: 20, width: 20 }}
                text="Steps"
                count={item.count}
                goalRef={this.props.goalRef}
            />
        )
    }

    render() {
        const { item, goalRef } = this.props

        if (item.sectionTitle) {
            return this.renderSectionTitle(item)
        }

        return (
            <View style={cardBoxBorder}>
                <SectionCard
                    item={item}
                    onPress={() => {
                        this.props.onPress()
                    }}
                    type={item.type}
                    goalRef={goalRef}
                    isSelf={this.props.isSelf}
                />
            </View>
        )
    }
}

const styles = {
    iconStyle: {
        alignSelf: 'center',
        fontSize: 20,
        marginLeft: 5,
        marginTop: 2,
    },
    sectionTitleStyle: {
        containerStyle: {
            alignItems: 'center',
            flexDirection: 'row',
            height: 38,
            marginLeft: 15,
        },
        iconStyle: {
            height: 26,
            width: 26,
            tintColor: '#616161',
        },
        textStyle: {
            fontSize: 11,
            marginLeft: 8,
            color: '#616161',
        },
        countTextStyle: {
            fontSize: 11,
            color: '#616161',
        },
    },
}

const SectionTitle = (props) => {
    const { sectionTitleStyle } = styles
    const image = props.iconSource ? (
        <Image
            source={props.iconSource}
            style={{ ...sectionTitleStyle.iconStyle, ...props.iconStyle }}
        />
    ) : null

    return (
        <View style={{ ...sectionTitleStyle.containerStyle }}>
            {image}
            <Text
                style={{ ...sectionTitleStyle.textStyle, ...props.textStyle }}
            >
                {props.text}
            </Text>
            <DotIcon
                iconStyle={{
                    tintColor: '#616161',
                    width: 3,
                    height: 3,
                    marginLeft: 4,
                    marginRight: 4,
                }}
            />
            {/* <Icon name='dot-single' type='entypo' color='#616161' size={20} /> */}
            <Text style={sectionTitleStyle.countTextStyle}>{props.count}</Text>
        </View>
    )
}

export default StepAndNeedCard
