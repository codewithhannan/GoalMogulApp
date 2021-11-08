/**
 * @format
 * --------------------------------------------------------
 * This components should be placed outise of SafeViewArea
 * --------------------------------------------------------
 * */

import React from 'react'
import {
    ActivityIndicator,
    Image,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { CopilotStep, walkthroughable } from 'react-native-copilot-gm'
import { Actions } from 'react-native-router-flux'
import { default_style, color } from '../../../styles/basic'
import DelayedButton from '../Button/DelayedButton'
import { HEADER_STYLES } from '../../../styles/Header'
import { Icon } from '@ui-kitten/components'

const WalkableView = walkthroughable(View)

const ModalHeader = (props) => {
    const {
        title,
        actionText,
        showActionLoading, // Should show spinner at the action text
        actionLoading, // When showActionLoading is true and actionLoading is true, loading spinner will be shown
        loadingIndicatorStyle,
        onCancel,
        onAction,
        actionDisabled,
        cancelText,
        back,
        actionHidden,
        titleIcon,
        titleIconContainerStyle,
        titleIconStyle,
        actionIcon,
        tutorialOn,
        cross,
    } = props
    const cancel = cancelText || 'Cancel'

    let leftComponent =
        back || cross ? (
            <Icon
                name={cross ? 'close' : 'chevron-left'}
                pack="material-community"
                style={HEADER_STYLES.nakedButton}
            />
        ) : (
            <Text style={styles.cancelTextStyle}>{cancel}</Text>
        )

    let actionComponent = (
        <DelayedButton
            activeOpacity={0.6}
            style={{ alignItems: 'center', opacity: actionHidden ? 0 : 1 }}
            onPress={onAction}
            disabled={actionDisabled}
        >
            {showActionLoading && actionLoading && (
                <View
                    style={{
                        ...styles.loadingIndicatorContainerStyle,
                        zIndex: 2,
                    }}
                >
                    <ActivityIndicator
                        size="small"
                        animating={!!(showActionLoading && actionLoading)}
                        {...loadingIndicatorStyle}
                    />
                </View>
            )}
            {actionIcon}
            {!!actionText && (
                <Text
                    style={[
                        styles.actionTextStyle,
                        { opacity: actionDisabled ? 0.6 : 1 },
                    ]}
                >
                    {actionText}
                </Text>
            )}
        </DelayedButton>
    )

    if (tutorialOn && tutorialOn.actionText) {
        const { tutorialText, name, order } = tutorialOn.actionText
        actionComponent = (
            <CopilotStep text={tutorialText} order={order} name={name}>
                <WalkableView>{actionComponent}</WalkableView>
            </CopilotStep>
        )
    }

    let titleIconFragment = null
    if (titleIcon) {
        if (titleIconContainerStyle || titleIconStyle) {
            titleIconFragment = (
                <View style={titleIconContainerStyle}>
                    <Image
                        style={titleIconStyle}
                        source={titleIcon}
                        resizeMode="contain"
                    />
                </View>
            )
        } else {
            titleIconFragment = (
                <Image style={styles.titleTextIconStyle} source={titleIcon} />
            )
        }
    }

    return (
        <View
            style={{
                zIndex: 1000,
            }}
        >
            <StatusBar barStyle="dark-content" />
            <View style={styles.containerStyle}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={onCancel !== undefined ? onCancel : Actions.pop}
                >
                    {leftComponent}
                </TouchableOpacity>

                <View style={styles.titleTextContainerStyle}>
                    {titleIconFragment}
                    <Text style={styles.titleTextStyle} numberOfLines={1}>
                        {title}
                    </Text>
                </View>

                {actionComponent}
            </View>
        </View>
    )
}

const styles = {
    containerStyle: {
        ...HEADER_STYLES.headerContainer,
        justifyContent: 'center',
    },
    actionTextStyle: HEADER_STYLES.buttonText,
    titleTextStyle: HEADER_STYLES.title,
    titleTextIconStyle: {
        ...default_style.buttonIcon_1,
        tintColor: null,
        borderRadius: 100,
        marginRight: 6,
        padding: 1,
        backgroundColor: '#fff',
    },
    titleTextContainerStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelTextStyle: HEADER_STYLES.buttonText,
    loadingIndicatorContainerStyle: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: color.GM_BLUE,
        alignItems: 'center',
        justifyContent: 'center',
    },
}

export default ModalHeader
