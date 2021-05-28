/** @format */

import React, { Component } from 'react'
import { View, Image, Text, Keyboard } from 'react-native'

// Components
import SectionCardV2 from '../../Common/SectionCardV2'
import { DotIcon } from '../../../../Utils/Icons'

// Assets
import HelpIcon from '../../../../asset/utils/help.png'
import StepIcon from '../../../../asset/utils/steps.png'
import { Icon } from '@ui-kitten/components'
import DelayedButton from '../../../Common/Button/DelayedButton'
import { createSuggestion } from '../../../../redux/modules/feed/comment/CommentActions'
import { getNewCommentByTab } from '../../../../redux/modules/feed/comment/CommentSelector'
import { getUserData } from '../../../../redux/modules/User/Selector'
import { connect } from 'react-redux'

// Styles
import { default_style } from '../../../../styles/basic'

class StepAndNeedCardV3 extends Component {
    constructor(props) {
        super(props)
    }

    renderSectionTitle(item) {
        if (item.sectionTitle === 'needs') {
            return (
                <SectionTitle
                    iconSource={HelpIcon}
                    iconStyle={{
                        ...default_style.normalIcon_1,
                        tintColor: '#333',
                    }}
                    text="Needs"
                    count={item.count}
                    renderSuggestionIcon={() =>
                        renderSuggestionIcon(this.props)
                    }
                />
            )
        }
        return (
            <SectionTitle
                iconSource={StepIcon}
                iconStyle={{ ...default_style.normalIcon_1, tintColor: '#333' }}
                text="Steps"
                count={item.count}
                renderSuggestionIcon={() => renderSuggestionIcon(this.props)}
            />
        )
    }

    render() {
        const { item } = this.props
        // console.log('Received props2:', this.props)

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
            paddingTop: 4,
        },
        iconStyle: {
            ...default_style.smallIcon_1,
            tintColor: '#616161',
        },
        textStyle: {
            ...default_style.smallTitle_1,
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
            {props.renderSuggestionIcon()}
        </View>
    )
}

const renderSuggestionIcon = (props) => {
    const { newComment, pageId, goalId } = props
    // const { mediaRef, commentType } = newComment
    // const disableButton = mediaRef !== undefined && mediaRef !== ''
    // if (commentType === 'Reply') return null

    return !props.isSelf ? (
        <DelayedButton
            activeOpacity={0.6}
            onPress={() => {
                Keyboard.dismiss()
                props.createSuggestion(goalId, pageId)
            }}
            // disabled={disableButton}
        >
            <Icon
                name="lightbulb-on-outline"
                pack="material-community"
                style={{
                    width: 20,
                    height: 20,
                    position: 'relative',
                    left: 10,
                    tintColor: '#F2C94C',
                }}
            />
        </DelayedButton>
    ) : null
}

const mapStateToProps = (state, props) => {
    // console.log('Received props1:', props)
    const { userId } = state.user
    const user = getUserData(state, userId, 'user')
    const appUser = state.user.user
    return {
        // newComment: getNewCommentByTab(state, props.pageId),
        isSelf: user && appUser && userId === appUser._id,
        ...props,
        user,
    }
}

export default connect(mapStateToProps, { createSuggestion })(StepAndNeedCardV3)
