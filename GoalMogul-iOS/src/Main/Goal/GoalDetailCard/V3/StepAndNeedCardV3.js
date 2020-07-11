/** @format */

import React, { Component } from 'react'
import { View, Image, Text } from 'react-native'

// Components
import SectionCardV2 from '../../Common/SectionCardV2'
import { DotIcon } from '../../../../Utils/Icons'

// Assets
import HelpIcon from '../../../../asset/utils/help.png'
import StepIcon from '../../../../asset/utils/steps.png'

// Styles
import { DEFAULT_STYLE } from '../../../../styles'

class StepAndNeedCardV3 extends Component {
    renderSectionTitle(item) {
        if (item.sectionTitle === 'needs') {
            return (
                <SectionTitle
                    iconSource={HelpIcon}
                    iconStyle={{
                        ...DEFAULT_STYLE.normalIcon_1,
                        tintColor: '#333',
                    }}
                    text="Needs"
                    count={item.count}
                />
            )
        }
        return (
            <SectionTitle
                iconSource={StepIcon}
                iconStyle={{ ...DEFAULT_STYLE.normalIcon_1, tintColor: '#333' }}
                text="Steps"
                count={item.count}
            />
        )
    }

    render() {
        const { item } = this.props

        if (item.sectionTitle) {
            return this.renderSectionTitle(item)
        }

        return <SectionCardV2 type={item.type} {...this.props} />
    }
}

const styles = {
    sectionTitleStyle: {
        containerStyle: {
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: '#F2F2F2',
            height: 38,
            paddingLeft: 15,
        },
        iconStyle: {
            ...DEFAULT_STYLE.smallIcon_1,
            tintColor: '#616161',
        },
        textStyle: {
            ...DEFAULT_STYLE.smallTitle_1,
            marginTop: 2,
            marginLeft: 8,
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
        <View style={sectionTitleStyle.containerStyle}>
            {image}
            <Text
                style={{ ...sectionTitleStyle.textStyle, ...props.textStyle }}
            >
                {`${props.text}  |  ${props.count}`}
            </Text>
        </View>
    )
}

export default StepAndNeedCardV3
