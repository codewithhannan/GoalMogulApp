/** @format */

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

// Assets
import dropDown from '../../asset/utils/dropDown.png'

const { width } = Dimensions.get('window')
const { Popover } = renderers
export const MenuFactory = (
    options,
    callback,
    triggerText,
    triggerContainerStyle,
    animationCallback
) => {
    const triggerTextView = triggerText ? (
        <Text style={{ fontSize: 15, margin: 10, marginLeft: 15, flex: 1 }}>
            {triggerText}
        </Text>
    ) : null
    return (
        <Menu
            onSelect={(value) => callback(value)}
            rendererProps={{
                placement: 'bottom',
                anchorStyle: styles.anchorStyle,
            }}
            renderer={Popover}
            onOpen={animationCallback}
        >
            <MenuTrigger
                customStyles={{
                    TriggerTouchableComponent: TouchableOpacity,
                }}
            >
                <View style={triggerContainerStyle}>
                    {triggerTextView}
                    <Image
                        source={dropDown}
                        style={{
                            width: 10,
                            height: 10,
                        }}
                    />
                </View>
            </MenuTrigger>
            <MenuOptions customStyles={styles.menuOptionsStyles}>
                <FlatList
                    data={options}
                    renderItem={({ item }) => (
                        <MenuOption value={item} text={item} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ flex: 1 }}
                />
            </MenuOptions>
        </Menu>
    )
}

const styles = {
    // Menu related style
    triggerContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
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
        },
        optionTouchable: {
            underlayColor: 'lightgray',
            activeOpacity: 10,
        },
        optionText: {
            paddingTop: 5,
            paddingBottom: 5,
            color: '#555',
        },
    },
}
