/**
 * This component is refactored out from Headline.js as an individual MenuFactory based on props on
 * version 0.3.9 and above. This refactoring enables opening menu programmatically.
 *
 * @format
 */

import React from 'react'
import {
    TouchableOpacity,
    View,
    Image,
    Text,
    FlatList,
    Dimensions,
} from 'react-native'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu'
import _ from 'lodash'
import { walkthroughable, CopilotStep } from 'react-native-copilot-gm'

/* Asset */
import { Icon } from '@ui-kitten/components'
import { default_style } from '../../../styles/basic'

const { width } = Dimensions.get('window')
const DEBUG_KEY = '[ UI Menu ]'
const WalkableView = walkthroughable(View)

const { Popover } = renderers
class MenuFactory extends React.Component {
    onRef = (r) => {
        this.menu = r
    }

    openMenu() {
        if (this.menu !== undefined) {
            this.menu.open()
        } else {
            console.warn(`${DEBUG_KEY}: [ openMenu ]: menu is undefined`)
        }
    }

    renderItem = ({ item }) => {
        const {
            iconSource,
            option,
            tutorialText,
            order,
            name,
            iconStyle,
        } = item
        if (!tutorialText || !name) {
            // render normally
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {iconSource ? (
                        <View
                            style={{
                                paddingTop: 10,
                                paddingBottom: 10,
                                paddingLeft: 10,
                                paddingRight: 5,
                            }}
                        >
                            <Image
                                source={iconSource}
                                style={{ ...styles.iconStyle, ...iconStyle }}
                            />
                        </View>
                    ) : null}
                    <View style={{ flex: 1 }}>
                        <MenuOption value={option} text={option} />
                    </View>
                </View>
            )
        }
        return (
            <CopilotStep text={tutorialText} order={order} name={name}>
                <WalkableView
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                    {iconSource ? (
                        <View
                            style={{
                                paddingTop: 10,
                                paddingBottom: 10,
                                paddingLeft: 10,
                                paddingRight: 5,
                            }}
                        >
                            <Image
                                source={iconSource}
                                style={{ ...styles.iconStyle, ...iconStyle }}
                            />
                        </View>
                    ) : null}
                    <View style={{ flex: 1 }}>
                        <MenuOption value={option} text={option} />
                    </View>
                </WalkableView>
            </CopilotStep>
        )
    }

    render() {
        const {
            options,
            callback,
            triggerText,
            triggerContainerStyle,
            animationCallback,
            shouldExtendOptionLength,
            menuName,
        } = this.props

        const triggerTextView = triggerText ? (
            <Text style={{ fontSize: 15, margin: 10, marginLeft: 15, flex: 1 }}>
                {triggerText}
            </Text>
        ) : null

        // console.log(`${DEBUG_KEY}: shouldExtendOptionLength:`, shouldExtendOptionLength);
        const menuOptionsStyles =
            shouldExtendOptionLength === true
                ? getUpdatedStyles()
                : styles.menuOptionsStyles

        const basicLineHeight = options.some((option) => option.tutorialText)
            ? 40
            : 37
        // console.log(`${DEBUG_KEY}: styles.menuOptionsStyles is:`, styles.menuOptionsStyles);
        // console.log(`${DEBUG_KEY}: shouldExtendOptionLength: ${shouldExtendOptionLength}, menuOptionsStyles:`, menuOptionsStyles);
        return (
            <Menu
                onSelect={(value) => callback(value)}
                rendererProps={{
                    placement: 'bottom',
                    anchorStyle: styles.anchorStyle,
                }}
                renderer={Popover}
                onOpen={animationCallback}
                name={menuName}
                ref={this.onRef}
            >
                <MenuTrigger
                    customStyles={{
                        TriggerTouchableComponent: TouchableOpacity,
                    }}
                >
                    <View style={triggerContainerStyle}>
                        {triggerTextView}
                        <Icon
                            name="dots-horizontal"
                            pack="material-community"
                            style={[
                                default_style.buttonIcon_1,
                                { tintColor: '#828282' },
                            ]}
                        />
                    </View>
                </MenuTrigger>
                <MenuOptions customStyles={menuOptionsStyles}>
                    <FlatList
                        data={options}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        style={{ height: 37 * options.length }}
                    />
                </MenuOptions>
            </Menu>
        )
    }
}

const getUpdatedStyles = () => {
    let ret = _.cloneDeep(styles.menuOptionsStyles)
    ret = _.set(ret, 'optionsContainer.width', 220)
    ret = _.set(ret, 'optionsContainer.paddingLeft', 0)
    ret = _.set(ret, 'optionsContainer.paddingRight', 0)
    return ret
}

const styles = {
    containerStyle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    caretContainer: {
        paddingBottom: 8,
        paddingRight: 8,
        paddingLeft: 10,
        paddingTop: 1,
    },
    imageStyle: {
        alignSelf: 'center',
        marginLeft: 3,
        marginRight: 3,
    },
    iconStyle: {
        height: 17,
        width: 17,
        tintColor: '#555',
    },
    // Menu related style
    triggerContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#e9e9e9',
        shadowColor: '#ddd',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        elevation: 1,
    },
    anchorStyle: {
        backgroundColor: 'white',
    },
    menuOptionsStyles: {
        optionsContainer: {
            width: width / 3,
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
        },
        optionsWrapper: {},
        optionWrapper: {
            flex: 1,
            width: '100%',
        },
        optionTouchable: {
            underlayColor: 'lightgray',
            activeOpacity: 10,
            flex: 1,
        },
        optionText: {
            paddingTop: 5,
            paddingBottom: 5,
            color: '#555',
        },
    },
}

export default MenuFactory
