/** @format */

import React from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    StatusBar,
    Platform,
    ActivityIndicator,
} from 'react-native'
import { walkthroughable, CopilotStep } from 'react-native-copilot-gm'

import { GM_BLUE, DEFAULT_STYLE } from '../../../styles'

import { IPHONE_MODELS, DEVICE_MODEL } from '../../../Utils/Constants'

import BackButton from '../../../asset/utils/back.png'
import DelayedButton from '../Button/DelayedButton'

const WalkableView = walkthroughable(View)

const paddingTop =
    Platform.OS === 'ios' && IPHONE_MODELS.includes(DEVICE_MODEL) ? 40 : 55

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
        containerStyles,
        actionTextStyle,
        backButtonStyle,
        titleTextStyle,
        tutorialOn,
    } = props
    const cancel =
        cancelText !== null && cancelText !== undefined ? cancelText : 'Cancel'

    const extraBackButtonStyle = backButtonStyle || {}
    let leftComponent = back ? (
        <Image
            source={BackButton}
            style={{
                height: 25,
                width: 25,
                tintColor: 'white',
                marginRight: 20,
                ...extraBackButtonStyle,
            }}
        />
    ) : (
        <Text style={styles.cancelTextStyle}>{cancel}</Text>
    )

    if (cancelText === null) {
        leftComponent = null
    }

    const extraContainerStyles = containerStyles || {}
    const extraActionTextStyle = actionTextStyle || {}
    const extraTitleTextStyle = titleTextStyle || {}

    const primaryActionTextStyle = actionDisabled
        ? { ...styles.actionTextStyle, opacity: 0.6 }
        : styles.actionTextStyle

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
                        zIndex: showActionLoading && actionLoading ? 2 : 0,
                    }}
                >
                    <ActivityIndicator
                        size="small"
                        animating={!!(showActionLoading && actionLoading)}
                        {...loadingIndicatorStyle}
                    />
                </View>
            )}
            <Text style={[primaryActionTextStyle, extraActionTextStyle]}>
                {actionText}
            </Text>
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

    return (
        <View
            style={{
                zIndex: 1000,
            }}
        >
            <StatusBar barStyle="dark-content" />
            <View
                style={[
                    styles.containerStyle,
                    { paddingTop, ...extraContainerStyles },
                ]}
            >
                <TouchableOpacity activeOpacity={0.6} onPress={onCancel}>
                    {leftComponent}
                </TouchableOpacity>

                <View style={styles.titleTextContainerStyle}>
                    {titleIcon && (
                        <Image
                            style={styles.titleTextIconStyle}
                            source={titleIcon}
                        />
                    )}
                    <Text
                        style={[styles.titleTextStyle, extraTitleTextStyle]}
                        numberOfLines={1}
                    >
                        {title}
                    </Text>
                </View>

                {actionComponent}
            </View>
        </View>
    )
}

const padding = 7

const styles = {
    containerStyle: {
        flexDirection: 'row',
        backgroundColor: GM_BLUE,
        paddingTop: 25,
        paddingLeft: 12,
        paddingRight: 12,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionTextStyle: {
        ...DEFAULT_STYLE.subTitleText_1,
        color: 'white',
        paddingTop: padding,
        paddingBottom: padding,
        paddingHorizontal: 10,
    },
    titleTextStyle: {
        ...DEFAULT_STYLE.titleText_1,
        paddingTop: padding,
        paddingBottom: padding,
        textAlign: 'center',
        color: 'white',
    },
    titleTextIconStyle: {
        ...DEFAULT_STYLE.buttonIcon_1,
        tintColor: null,
        borderRadius: 100,
        marginTop: 4,
        marginRight: 6,
        padding: 1,
        border: '1px solid #F1F1F1',
        backgroundColor: '#fff',
    },
    titleTextContainerStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelTextStyle: {
        ...DEFAULT_STYLE.subTitleText_1,
        paddingTop: padding,
        paddingBottom: padding,
        paddingHorizontal: 12,
        color: 'white',
    },
    loadingIndicatorContainerStyle: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: GM_BLUE,
        alignItems: 'center',
        justifyContent: 'center',
    },
}

export default ModalHeader
