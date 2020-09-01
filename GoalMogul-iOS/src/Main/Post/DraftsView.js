/** @format */

import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    FlatList,
    Image,
} from 'react-native'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu'

import { default_style } from '../../styles/basic'
import DelayedButton from '../Common/Button/DelayedButton'

import cancelImage from '../../asset/utils/cancel_no_background.png'
import { color } from '../../styles/basic'

const { width } = Dimensions.get('window')

/**
 * @param onSelect(index)
 * @param onDelete(index)
 * @param drafts
 */
class DraftsView extends Component {
    renderItem({ item: { post, mediaRef }, index }) {
        const deleteIconStyle = {
            ...default_style.smallIcon_1,
            tintColor: color.GM_RED,
        }
        const textWidth = width - 3 * 16 - deleteIconStyle.width - 30

        return (
            <MenuOption onSelect={() => this.props.onSelect(index)}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            ...styles.bodyText,
                            width: mediaRef
                                ? textWidth - 75 * default_style.uiScale - 16
                                : textWidth,
                        }}
                        numberOfLines={1}
                    >
                        {post}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            marginRight: 16,
                        }}
                    >
                        {mediaRef && (
                            <Image
                                style={styles.media}
                                source={{ uri: mediaRef }}
                            />
                        )}
                        <DelayedButton
                            activeOpacity={0.6}
                            onPress={() => this.props.onDelete(index)}
                            style={styles.cancelWrapper}
                        >
                            <Image
                                style={deleteIconStyle}
                                source={cancelImage}
                            />
                        </DelayedButton>
                    </View>
                </View>
            </MenuOption>
        )
    }

    renderItemSeparator() {
        return <View style={default_style.cardHorizontalSeparator} />
    }

    render() {
        return (
            <Menu
                rendererProps={{ placement: 'bottom' }}
                renderer={renderers.Popover}
                name="DRAFT_MENU"
            >
                <MenuTrigger
                    disabled={this.props.disabled}
                    customStyles={{
                        TriggerTouchableComponent: TouchableOpacity,
                    }}
                >
                    <Text
                        style={{
                            ...default_style.subTitleText_1,
                            textDecorationLine: 'underline',
                        }}
                    >
                        View Drafts
                    </Text>
                </MenuTrigger>
                <MenuOptions
                    customStyles={{
                        optionsWrapper: {
                            position: 'absolute',
                            top: 0,
                            right: -52,
                            width: width - 20,
                            backgroundColor: color.GM_CARD_BACKGROUND,
                            borderRadius: 10,
                        },
                        optionsContainer: {
                            backgroundColor: color.GM_CARD_BACKGROUND,
                            borderRadius: 10,
                        },
                    }}
                >
                    <FlatList
                        keyboardShouldPersistTaps="always"
                        data={this.props.drafts}
                        keyExtractor={(item) => item._id}
                        ItemSeparatorComponent={this.renderItemSeparator}
                        style={{
                            maxHeight: this.props.maxModalHeight,
                            paddingVertical: 5,
                        }}
                        renderItem={(props) => this.renderItem(props)}
                    />
                </MenuOptions>
            </Menu>
        )
    }
}

const styles = {
    media: {
        height: 50 * default_style.uiScale,
        width: 75 * default_style.uiScale,
        borderRadius: 5,
        marginRight: 16,
    },
    bodyText: {
        ...default_style.subTitleText_1,
        margin: 10,
    },
    cancelWrapper: {
        backgroundColor: '#F2F2F2',
        borderRadius: 100,
        padding: 10,
    },
}

export default DraftsView
