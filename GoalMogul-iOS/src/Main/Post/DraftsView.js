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


const { height } = Dimensions.get('window');
/**
 * @param onDraftSelect(index)
 * @param drafts
 */
class DraftsView extends Component {

    render() {
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
                                                ...DEFAULT_STYLE.subTitleText_1,
                                                margin: 16,
                                                flex: mediaRef ? 3 : 9
                                            }}
                                            numberOfLines={1}
                                        >
                                            {post}
                                        </Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', flex: 2, marginRight: 16 }}>
                                            {mediaRef && <Image
                                                style={{ height: 50, width: 75, borderRadius: 5, marginRight: 16 }}
                                                source={{ uri: mediaRef }}
                                            />}
                                            <DelayedButton
                                                activeOpacity={0.6}
                                                onPress={() => this.props.onDelete(index)}
                                            >
                                                <Image style={DEFAULT_STYLE.buttonIcon_1} source={cancelImage} />
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
};

export default DraftsView;
