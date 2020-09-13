/**
 * https://www.figma.com/file/5CNnuTKGZeoJDGaC2rku7v/Happy-Flow?node-id=994%3A1956
 *
 * @format
 * */

import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    FlatList,
    TextInput,
    Keyboard,
} from 'react-native'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu'

// actions
import {
    refreshMyUserGoals,
    loadMoreMyUserGoals,
} from '../../redux/modules/goal/GoalActions'

import { default_style } from '../../styles/basic'
import DelayedButton from '../Common/Button/DelayedButton'

import { color } from '../../styles/basic'
import { HEADER_STYLES } from '../../styles/Header'
import CompactGoalCard from '../Goal/GoalCard/CompactGoalCard'
import { connect } from 'react-redux'

const { height } = Dimensions.get('window')
const listMaxHeight = height - HEADER_STYLES.headerContainer.height - 105
const listMinHeight = height / 3

/**
 * @param onSelect(goalItem)
 * @param triggerDisabled disablesTrigger's touchable opacity
 * @param triggerWrapperStyle
 * @param triggerComponent
 * @param topOffSet min distance modal needs to keep from top
 */
class AttachGoal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchInput: '',
        }
        this.renderItem = this.renderItem.bind(this)
    }

    componentDidMount() {
        if (typeof this.props.onRef === 'function') this.props.onRef(this)
        this.props.refreshMyUserGoals()
    }

    open() {
        if (this.menu) this.menu.open()
    }

    close() {
        if (this.menu) this.menu.close()
    }

    renderItem({ item }) {
        return (
            <MenuOption
                customStyles={{
                    optionTouchable: {
                        underlayColor: 'white',
                    },
                }}
                onSelect={() => this.props.onSelect(item)}
            >
                <CompactGoalCard item={item} disabled={true} />
            </MenuOption>
        )
    }

    renderItemSeparator() {
        return <View style={default_style.cardHorizontalSeparator} />
    }

    renderHeader() {
        return [
            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Text style={default_style.titleText_1}>Select Goal</Text>
                    <DelayedButton
                        activeOpacity={0.6}
                        onPress={() => {
                            this.menu && this.menu.close()
                        }}
                    >
                        <Text
                            style={[
                                default_style.buttonText_1,
                                { color: color.GM_BLUE },
                            ]}
                        >
                            Cancel
                        </Text>
                    </DelayedButton>
                </View>
                <TextInput
                    style={[
                        {
                            marginTop: 12,
                            padding: 10,
                            backgroundColor: color.GM_LIGHT_GRAY,
                            borderRadius: 4,
                        },
                        default_style.normalText_1,
                    ]}
                    placeholder="Search"
                    onChangeText={(text) =>
                        this.setState({ searchInput: text || '' })
                    }
                    numberOfLines={1}
                />
            </View>,
            this.renderItemSeparator(),
            /* <View
                style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Text style={default_style.buttonText_1}>10 Goals</Text>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <DelayedButton style={{ paddingHorizontal: 5 }}>
                        <Icon
                            pack="material-community"
                            name="arrow-up-down"
                            style={default_style.normalIcon_1}
                        />
                    </DelayedButton>
                    <Text style={default_style.buttonText_1}>
                        Sort by
                    </Text>
                </View>
            </View>,
            this.renderItemSeparator() */
        ]
    }

    render() {
        // filter searched goals
        const data =
            this.props.data &&
            this.props.data.filter(
                (item) =>
                    item.title && item.title.includes(this.state.searchInput)
            )

        return (
            <Menu
                ref={(ref) => (this.menu = ref)}
                rendererProps={{ placement: 'bottom' }}
                renderer={renderers.SlideInMenu}
                name="ATTACH_GOAL_MENU"
                onOpen={this.props.onOpen}
                onClose={this.props.onClose}
            >
                <MenuTrigger
                    onPress={Keyboard.dismiss}
                    disabled={this.props.triggerDisabled}
                    customStyles={{
                        TriggerTouchableComponent: TouchableOpacity,
                        triggerWrapper: this.props.triggerWrapperStyle,
                    }}
                >
                    {this.props.triggerComponent}
                </MenuTrigger>
                <MenuOptions
                    customStyles={{
                        optionsWrapper: {
                            backgroundColor: color.GM_CARD_BACKGROUND,
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                        },
                        optionsContainer: {
                            backgroundColor: color.GM_CARD_BACKGROUND,
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                        },
                    }}
                >
                    {this.renderHeader()}
                    <FlatList
                        keyboardShouldPersistTaps="always"
                        data={data}
                        renderItem={this.renderItem}
                        keyExtractor={(item) => item._id}
                        refreshing={this.props.refreshing || false}
                        onRefresh={this.props.refreshMyUserGoals}
                        onEndReached={this.props.loadMoreMyUserGoals}
                        onEndReachedThreshold={2}
                        ItemSeparatorComponent={this.renderItemSeparator}
                        style={{
                            maxHeight:
                                listMaxHeight - (this.props.topOffSet || 0),
                            minHeight: listMinHeight,
                            marginBottom: 8,
                        }}
                    />
                </MenuOptions>
            </Menu>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { myGoals } = state.goals
    const { data, refreshing, loading, filter } = myGoals
    return {
        data,
        loading,
        filter,
        refreshing,
    }
}

export default connect(mapStateToProps, {
    refreshMyUserGoals,
    loadMoreMyUserGoals,
})(AttachGoal)
