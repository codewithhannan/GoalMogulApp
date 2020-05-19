import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, FlatList, Image } from 'react-native';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
} from 'react-native-popup-menu';

import { DEFAULT_STYLE, GM_BLUE } from '../../styles';
import DelayedButton from '../Common/Button/DelayedButton';

import cancelImage from '../../asset/utils/cancel_no_background.png';

/**
 * @param onDraftSelect(index)
 * @param drafts
 */
class DraftsView extends Component {

    render() {
        const { width, height } = Dimensions.get('window');
        const textWidth = width - 3*16 - DEFAULT_STYLE.buttonIcon_1.width - 30;
        return (
            <Menu
                rendererProps={{ placement: 'bottom' }}
                renderer={renderers.SlideInMenu}
                name="DRAFT_MENU"
            >
                <MenuTrigger customStyles={{ TriggerTouchableComponent: TouchableOpacity }}>
                        <Text style={{ ...DEFAULT_STYLE.subTitleText_1, textDecorationLine: 'underline' }}>View Drafts</Text>
                </MenuTrigger>
                <MenuOptions>
                    <View style={styles.headerWrapper}>
                        <Text style={{ ...DEFAULT_STYLE.titleText_1, color: 'white' }}>Drafts</Text>
                    </View>
                    <FlatList
                        data={this.props.drafts}
                        renderItem={({ item: { post, mediaRef }, index }) => {
                            return (
                                <MenuOption onSelect={() => this.props.onSelect(index)}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text
                                            style={{
                                                ...styles.bodyText,
                                                width: mediaRef ? textWidth - 75 * DEFAULT_STYLE.uiScale - 16
                                                    : textWidth
                                            }}
                                            numberOfLines={1}
                                        >
                                            {post}
                                        </Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginRight: 16 }}>
                                            {mediaRef && <Image
                                                style={styles.media}
                                                source={{ uri: mediaRef }}
                                            />}
                                            <DelayedButton
                                                activeOpacity={0.6}
                                                onPress={() => this.props.onDelete(index)}
                                                style={styles.cancelWrapper}
                                            >
                                                <Image style={{ ...DEFAULT_STYLE.smallIcon_1, margin: 15, tintColor: 'white' }} source={cancelImage} />
                                            </DelayedButton>
                                        </View>
                                    </View>
                                </MenuOption>
                            );
                        }}
                        ItemSeparatorComponent={()=>(<View style={{ ...DEFAULT_STYLE.shadow, height: 1.5 }} />)}
                        style={{ maxHeight: height/2, paddingTop: 5, paddingBottom: 35 }}
                    />
                </MenuOptions>
            </Menu>
        );
    }
}

const styles = {
    headerWrapper: {
        backgroundColor: GM_BLUE,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 0.1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    media: {
        height: 50 * DEFAULT_STYLE.uiScale,
        width: 75 * DEFAULT_STYLE.uiScale,
        borderRadius: 5,
        marginRight: 16
    },
    bodyText: {
        ...DEFAULT_STYLE.subTitleText_1,
        margin: 16
    },
    cancelWrapper: {
        backgroundColor: '#EB5757',
        borderRadius: 100
    }
};

export default DraftsView;
