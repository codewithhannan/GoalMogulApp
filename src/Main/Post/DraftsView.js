/** @format */

import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    FlatList,
    Image,
    Keyboard,
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
import { HEADER_STYLES } from '../../styles/Header'

const { height, width } = Dimensions.get('window')
const MODAL_MAX_HEIGHT = height - HEADER_STYLES.headerContainer.height - 105
const MODAL_MIN_HEIGHT = height / 3

/**
 * @param onSelect(index)
 * @param onDelete(index)
 * @param drafts
 */
class DraftsView extends Component {
    renderItem({ item: { post, mediaRef }, index }) {
        const deleteIconStyle = {
            ...default_style.smallIcon_1,
            tintColor: color.GM_BLUE,
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
                {this.renderItemSeparator()}
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
                renderer={renderers.SlideInMenu}
                onOpen={this.props.onOpen}
                onClose={this.props.onClose}
                name="DRAFT_MENU"
            >
                <MenuTrigger
                    onPress={Keyboard.dismiss}
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
                        View all Drafts
                    </Text>
                </MenuTrigger>
                <MenuOptions>
                    <FlatList
                        keyboardShouldPersistTaps="always"
                        data={this.props.drafts}
                        keyExtractor={(item) => item._id}
                        style={{
                            maxHeight:
                                MODAL_MAX_HEIGHT - (this.props.topOffSet || 0),
                            minHeight: MODAL_MIN_HEIGHT,
                            marginBottom: 8,
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
        backgroundColor: '#D6F1FD',
        borderRadius: 100,
        padding: 10,
    },
}

export default DraftsView
