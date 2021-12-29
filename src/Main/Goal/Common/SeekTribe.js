/** @format */

import React from 'react'
import _ from 'lodash'
import {
    View,
    Text,
    FlatList,
    Animated,
    Image,
    Dimensions,
    StyleSheet,
} from 'react-native'
import { connect } from 'react-redux'
import right_arrow_icon from '../../../asset/utils/right_arrow.png'
import DelayedButton from '../../Common/Button/DelayedButton'

import { text, color, default_style } from '../../../styles/basic'
import OnboardingStyles from '../../../styles/Onboarding'

import { registrationFetchTribes } from '../../../redux/modules/registration/RegistrationActions'
import * as Animatable from 'react-native-animatable'

import { Icon } from '@ui-kitten/components'
import TribeDiscoverCard from '../../Tribe/TribeDiscoverCard'
import { tribeDetailOpen } from '../../../redux/modules/tribe/MyTribeActions'
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import {
    refreshTribe,
    loadMoreTribe,
} from '../../../redux/modules/tribe/TribeTabActions'

import {
    getUserTribes,
    postHelpTribe,
} from '../../../redux/modules/SeekHelp/seekHelpAction'

import { SearchBar } from 'react-native-elements'
import { SearchIcon } from '../../../Utils/Icons'

const AnimatedFlatList = Animatable.createAnimatableComponent(FlatList)

class TribeDiscover extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            scroll: new Animated.Value(1),
            searchContent: '',
            tribesSearchText: '',
            tribesFilteredData: [],
        }
    }

    componentDidMount() {
        setTimeout(() => {
            if (this.scrollView) {
                this.scrollView.bounce(1000)
            }
        }, 1000)

        this.handleRefresh()
    }

    handleRefresh = () => {
        if (this.props.handleRefresh) {
            return this.props.handleRefresh()
        }
        this.props.getUserTribes()
        return this.props.refreshTribe()
    }

    handleLoadMore = () => {
        if (this.props.handleLoadMore) {
            // onboarding tribe load more
            return this.props.handleLoadMore()
        }
        // tribe discover load more
        return this.props.loadMoreTribe()
    }

    handleAnimatableTextRef = (ref) => (this.scrollView = ref)

    keyExtractor = (item) => item._id

    renderItem = ({ item, index, separators }) => {
        const { itemOnPress, canSelect } = this.props

        return (
            <>
                <View
                    style={{
                        height: 1,
                        width: '100%',
                        backgroundColor: '#F2F2F2',
                    }}
                />
                <TribeDiscoverCard
                    item={item}
                    onPress={(tribeDoc) => {
                        this.props.postHelpTribe({
                            tribeDoc: tribeDoc,
                            helpText: this.props.helpText,
                            user: this.props.user,
                            goal: this.props.lateGoal,
                        })
                    }}
                    isSeekTribe={true}
                    canSelect={canSelect}
                />
            </>
        )
    }

    renderHeader = () => {
        if (this.props.renderHeader) {
            return this.props.renderHeader()
        }
        return <SearchBarHeader backButton title="Seek Help from Tribes" />
    }

    renderHeaderText = () => {
        if (this.props.renderHeaderText) {
            return this.props.renderHeaderText()
        }
        return null
    }

    renderScroll = (tribesToRender) => {
        if (this.props.renderScroll) {
            return this.props.renderScroll(tribesToRender)
        }

        // Tribe list is too short
        if (!tribesToRender || tribesToRender.length <= 3) {
            return null
        }

        // Only render scroll when iphone model < 8
        const opacity = this.state.scroll.interpolate({
            inputRange: [0, 120],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        })

        return (
            <Animatable.View
                style={{
                    opacity,
                    position: 'absolute',
                    bottom: 10,
                    alignSelf: 'center',
                }}
                ref={this.handleAnimatableTextRef}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#DEF7FF',
                        padding: 7,
                        width: 94,
                        borderRadius: 4,
                    }}
                >
                    <Image
                        source={right_arrow_icon}
                        style={{
                            transform: [{ rotate: '90deg' }],
                            tintColor: '#2F80ED',
                            height: 12,
                            width: 15,
                            marginRight: 5,
                        }}
                    />
                    <Text
                        style={{
                            fontSize: text.TEXT_FONT_SIZE.FONT_2,
                            fontFamily: text.FONT_FAMILY.BOLD,
                            color: '#2F80ED',
                            paddingTop: 2,
                            textAlign: 'center',
                        }}
                    >
                        Scroll
                    </Text>
                </View>
            </Animatable.View>
        )
    }

    renderCategorySelector = () => {
        if (this.props.renderCategorySelector) {
            return this.props.renderCategorySelector()
        }
        return null
    }

    getTribesToRender = () => {
        const { tribesToRender, data, useTribesToRender } = this.props

        return useTribesToRender ? tribesToRender : data
    }
    searchTribes = (input) => {
        const { tribesSearchText } = this.state

        const tribesToRender = this.getTribesToRender()

        this.setState({ tribesSearchText: input })
        // this.setState({ input })

        let tribesFilteredData = tribesToRender.filter((item) => {
            return item.name.includes(input)
        })

        this.setState({ tribesFilteredData })
    }

    render() {
        const tribesToRender = this.getTribesToRender()
        console.log('THIS IS TRIBE TO RENDER', this.props.helpText)
        const { tribeSeek } = this.props

        return (
            <View
                style={[
                    OnboardingStyles.container.page,
                    {
                        paddingBottom: 0,
                        backgroundColor: '#EAE8EA',
                        justifyContent: 'center',
                    },
                ]}
            >
                {this.renderHeader()}
                {this.renderHeaderText()}
                {this.renderCategorySelector()}
                <View style={{ backgroundColor: 'white' }}>
                    <SearchBar
                        round
                        placeholder="Search"
                        placeholderTextColor="#D3D3D3"
                        containerStyle={[
                            styles.searchBar.container,
                            { margin: 8, marginTop: 8 },
                        ]}
                        inputContainerStyle={styles.searchBar.inputContainer}
                        searchIcon={() => (
                            <SearchIcon
                                iconContainerStyle={
                                    styles.searchBar.icon.container
                                }
                                iconStyle={styles.searchBar.icon.style}
                            />
                        )}
                        inputStyle={default_style.subTitleText_1}
                        onChangeText={this.searchTribes}
                        onCancel={() => this.setState({ tribesSearchText: '' })}
                        value={this.state.tribesSearchText}
                    />
                </View>
                <View
                    style={{
                        backgroundColor: 'white',
                        width: '100%',
                        height: 45,
                        justifyContent: 'center',
                        padding: 10,
                        marginTop: 2,
                    }}
                >
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                        Select ONE Tribe
                    </Text>
                </View>
                <AnimatedFlatList
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: { y: this.state.scroll },
                                },
                            },
                        ],
                        { useNativeDriver: false }
                    )}
                    // onRefresh={this.handleRefresh}
                    onEndReached={this.handleLoadMore}
                    // refreshing={this.props.refreshing}
                    data={tribeSeek}
                    renderItem={(item, index) => this.renderItem(item, index)}
                    keyExtractor={this.keyExtractor}
                    numColumns={1}
                    //  ListHeaderComponent={()=> <View style={{height:0.5,width:'100%',backgroundColor:'grey'}}/>}
                    contentContainerStyle={{
                        backgroundColor: color.GM_CARD_BACKGROUND,
                        paddingBottom: 16,
                    }}
                    bounces={
                        this.props.bounces === false ? this.props.bounces : true
                    }
                />
                {/* {this.renderScroll(tribesToRender)} */}
            </View>
        )
    }
}

const styles = {
    searchBar: {
        container: {
            backgroundColor: 'white',
            padding: 0,
            borderWidth: 1,
            borderTopColor: '#E0E0E0',
            borderBottomColor: '#E0E0E0',
            borderColor: '#E0E0E0',
            borderRadius: 5,
        },
        inputContainer: {
            backgroundColor: 'white',
            padding: 0,
            margin: 0,
        },
        icon: {
            container: {
                marginBottom: 1,
                marginTop: 1,
            },
            style: {
                ...default_style.normalIcon_1,
                tintColor: '#828282',
            },
        },
    },
}

const mapStateToProps = (state) => {
    const { data, loading, sortBy } = state.tribeTab
    const seekHelp = state.seekHelp
    const { tribeSeek } = seekHelp
    const { user, token } = state.user
    const lateGoal = state.profile.lateGoal

    return {
        data,
        loading,
        sortBy,
        tribeSeek,
        user,
        token,
        lateGoal,
    }
}

export default connect(mapStateToProps, {
    registrationFetchTribes,
    tribeDetailOpen,
    refreshTribe,
    getUserTribes,
    loadMoreTribe,
    postHelpTribe,
})(TribeDiscover)
