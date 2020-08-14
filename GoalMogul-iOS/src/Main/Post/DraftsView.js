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

import { default_style, color } from '../../styles/basic'
import DelayedButton from '../Common/Button/DelayedButton'

import cancelImage from '../../asset/utils/cancel_no_background.png'

/**
 * @param onDraftSelect(index)
 * @param drafts
 */
class DraftsView extends Component {
    render() {
        const { width, height } = Dimensions.get('window')
        const cancelIconStyle = {
            ...default_style.smallIcon_1,
            tintColor: '#EB5757',
        }
        const textWidth = width - 3 * 16 - cancelIconStyle.width - 30
        return (
            <Menu
                rendererProps={{ placement: 'bottom' }}
                renderer={renderers.Popover}
                name="DRAFT_MENU"
            >
                <MenuTrigger
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
                <MenuOptions>
                    <View style={styles.headerWrapper}>
                        <Text
                            style={{
                                ...default_style.titleText_1,
                                color: 'white',
                            }}
                        >
                            Drafts
                        </Text>
                    </View>
                    <FlatList
                        data={this.props.drafts}
                        renderItem={({ item: { post, mediaRef }, index }) => {
                            return (
                                <MenuOption
                                    onSelect={() => this.props.onSelect(index)}
                                >
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
                                                    ? textWidth -
                                                      75 *
                                                          default_style.uiScale -
                                                      16
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
                                                onPress={() =>
                                                    this.props.onDelete(index)
                                                }
                                                style={styles.cancelWrapper}
                                            >
                                                <Image
                                                    style={cancelIconStyle}
                                                    source={cancelImage}
                                                />
                                            </DelayedButton>
                                        </View>
                                    </View>
                                </MenuOption>
                            )
                        }}
                        ItemSeparatorComponent={() => (
                            <View
                                style={{
                                    ...default_style.cardSeparator,
                                    height: 1.5,
                                }}
                            />
                        )}
                        style={{
                            maxHeight: height / 2,
                            paddingVertical: 5,
                        }}
                    />
                </MenuOptions>
            </Menu>
        )
    }
}

const styles = {
    headerWrapper: {
        backgroundColor: color.GM_BLUE,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 0.1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    media: {
        height: 50 * default_style.uiScale,
        width: 75 * default_style.uiScale,
        borderRadius: 5,
        marginRight: 16,
    },
    bodyText: {
        ...default_style.subTitleText_1,
        margin: 16,
    },
    cancelWrapper: {
        backgroundColor: '#F2F2F2',
        borderRadius: 100,
        padding: 10,
    },
}

export default DraftsView
