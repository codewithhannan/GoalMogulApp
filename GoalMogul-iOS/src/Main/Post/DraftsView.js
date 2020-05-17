import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, FlatList, Image } from 'react-native';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
} from 'react-native-popup-menu';

import { IMAGE_BASE_URL } from '../../Utils/Constants';
import { DEFAULT_STYLE, BACKGROUND_COLOR } from '../../styles';


const { width, height } = Dimensions.get('window');
/**
 * @param onDraftSelect(index)
 * @param drafts
 */
class DraftsView extends Component {

    handleOnMenuSelect = (value) => {
        this.props.onDraftSelect(value);
    }

    render() {
        const {
            drafts
        } = this.props;

        return (
            <Menu
                rendererProps={{ placement: 'bottom' }}
                renderer={renderers.SlideInMenu}
            >
                <MenuTrigger customStyles={{ TriggerTouchableComponent: TouchableOpacity }}>
                        <Text style={{ ...DEFAULT_STYLE.subTitleText_1, textDecorationLine: 'underline' }}>View Drafts</Text>
                </MenuTrigger>
                <MenuOptions>
                    <FlatList
                        data={drafts}
                        renderItem={({ item: { post, mediaRef }, index }) => {
                            return (
                                <MenuOption onSelect={() => this.handleOnMenuSelect(index)}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text
                                            style={{
                                                ...DEFAULT_STYLE.subTitleText_1,
                                                padding: 16
                                            }}
                                            numberOfLines={1}
                                        >
                                            {post}
                                        </Text>
                                        {mediaRef && <Image
                                            style={{ height: 50, width: 75 }}
                                            source={{ uri: mediaRef }}
                                        />}
                                    </View>
                                </MenuOption>
                            );
                        }}
                        ItemSeparatorComponent={()=>(<View style={{ ...DEFAULT_STYLE.shadow, height: 1.5 }} />)}
                        style={{ maxHeight: height/3, paddingTop: 5 }}
                    />
                </MenuOptions>
            </Menu>
        );
    }
}

const styles = {
    
};

export default DraftsView;
