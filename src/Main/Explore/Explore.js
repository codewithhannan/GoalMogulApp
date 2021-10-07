/** @format */

import React, { Component } from 'react'
import { View, Animated, Dimensions, Image, Text } from 'react-native'
import { connect } from 'react-redux'
import { TabView, SceneMap } from 'react-native-tab-view'
import { MenuProvider } from 'react-native-popup-menu'

/* Components */
import TabButtonGroup from '../Common/TabButtonGroup'
import SearchBarHeader from '../Common/Header/SearchBarHeader'

import TribeTab from './TribeTab'
import EventTab from './EventTab'
import PeopleTab from './People/PeopleTab'
import ChatTab from './Chat/ChatTab'

// Actions
import { exploreSelectTab } from '../../redux/modules/explore/ExploreActions'

// Assets
import TribeIcon from '../../asset/explore/tribe.png'
import EventIcon from '../../asset/suggestion/event.png'
import PeopleIcon from '../../asset/suggestion/group.png'
import explore_image from '../../asset/explore/ExploreImage.png'
import people_globe from '../../asset/explore/PeopleGlobe.png'
import IconChat from '../../asset/footer/navigation/chat.png'

// Styles
import { wrapAnalytics, SCREENS } from '../../monitoring/segment'

const { width } = Dimensions.get('window')

const TabIconMap = {
    events: {
        iconSource: EventIcon,
        iconStyle: {
            height: 17,
            width: 17,
        },
    },
    tribes: {
        iconSource: TribeIcon,
        iconStyle: {
            height: 15,
            width: 15,
        },
    },
    people: {
        iconSource: PeopleIcon,
        iconStyle: {
            height: 15,
            width: 17,
        },
    },
    chatRooms: {
        iconSource: IconChat,
        iconStyle: {
            height: 15,
            width: 17,
        },
    },
}

class Explore extends Component {
    _renderHeaderBackgroundImage = () => {
        return (
            <View style={styles.backgroundImageContainerStyle}>
                <Image
                    source={explore_image}
                    style={{
                        alignSelf: 'flex-end',
                        height: width / 4.7,
                        width: width / 2.5,
                        marginLeft: 10,
                    }}
                    resizeMode="cover"
                />
                <View style={{ flex: 1 }} />
                <View style={{ padding: 10 }}>
                    <Image
                        source={people_globe}
                        style={{
                            width: width / 4.6,
                            height: width / 4.6,
                        }}
                        resizeMode="cover"
                    />
                </View>
            </View>
        )
    }

    _renderHeader = (props) => {
        return (
            <Animated.View>
                <View
                    style={{
                        alignItems: 'center',
                        height: width / 4.2 + 20,
                        justifyContent: 'center',
                    }}
                >
                    {this._renderHeaderBackgroundImage()}
                    <View
                        style={{
                            flex: 1,
                            zIndex: 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 19,
                                fontWeight: '800',
                                color: '#606060',
                            }}
                        >
                            Discover
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                marginTop: 7,
                                color: '#5b5a5a',
                            }}
                        >
                            Find Members, Tribes and Events to help you
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                marginTop: 5,
                                color: '#5b5a5a',
                            }}
                        >
                            achieve your goal even faster.
                        </Text>
                    </View>
                </View>
                <TabButtonGroup buttons={props} tabIconMap={TabIconMap} />
            </Animated.View>
        )
    }

    _renderScene = SceneMap({
        people: PeopleTab,
        tribes: TribeTab,
        events: EventTab,
        chatRooms: ChatTab,
    })

    _keyExtractor = (item, index) => index

    render() {
        /*
          TODO:
          1. use flatlist instead of scrollview
          2. assign key on for TabButton
        */
        return (
            <MenuProvider
                customStyles={{ backdrop: styles.backdrop }}
                skipInstanceCheck={true}
            >
                <View style={styles.homeContainerStyle}>
                    <SearchBarHeader backButton />
                    <TabView
                        navigationState={this.props.navigationState}
                        renderScene={this._renderScene}
                        renderTabBar={this._renderHeader}
                        onIndexChange={this.props.exploreSelectTab}
                        useNativeDriver
                    />
                </View>
            </MenuProvider>
        )
    }
}

const styles = {
    homeContainerStyle: {
        backgroundColor: '#f8f8f8',
        flex: 1,
    },
    textStyle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#696969',
    },
    onSelectTextStyle: {
        fontSize: 12,
        fontWeight: '600',
        color: 'white',
    },
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.5,
    },
    // Header images style
    globeImageContainerStyle: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        padding: 10,
        height: width / 4,
    },
    globeImageStyle: {
        height: width / 4,
    },
    exploreImageContainerStyle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: width / 4,
        flex: 1,
    },
    exploreImageStyle: {},
    backgroundImageContainerStyle: {
        zIndex: 1,
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: 'white',
    },
}

const mapStateToProps = (state) => {
    const { navigationState } = state.explore

    return {
        navigationState,
    }
}

export default connect(mapStateToProps, {
    exploreSelectTab,
})(wrapAnalytics(Explore, SCREENS.EXPLORE_PAGE))
