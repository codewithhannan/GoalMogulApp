/** @format */

import React, { Component } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

/* Components */
import SearchBarHeader from '../Common/Header/SearchBarHeader'

// Actions
import { exploreSelectTab } from '../../redux/modules/explore/ExploreActions'

// Assets
import TribeIcon from '../../asset/explore/tribe.png'
import EventIcon from '../../asset/suggestion/event.png'
import PeopleIcon from '../../asset/suggestion/group.png'
import explore_image from '../../asset/explore/ExploreImage.png'
import people_globe from '../../asset/explore/PeopleGlobe.png'
import FlagIcon from '../../asset/footer/navigation/flag.png'

// Styles
import { DEFAULT_STYLE, GM_BLUE } from '../../styles'
import { wrapAnalytics, SCREENS } from '../../monitoring/segment'
import { FlatList } from 'react-native-gesture-handler'
import MyTribe from '../Menu/Tribe/MyTribe'
import { Actions } from 'react-native-router-flux'
import { componentKeyByTab } from '../../redux/middleware/utils'
import { Text, Icon } from '@ui-kitten/components'

class Explore extends Component {
    render() {
        /*
          TODO:
          1. use flatlist instead of scrollview
          2. assign key on for TabButton
        */
        return (
            <View style={{}}>
                <SearchBarHeader rightIcon="menu" />
                <View
                    style={{
                        backgroundColor: 'white',
                        padding: 12,
                        marginBottom: 8,
                        flexDirection: 'row',
                    }}
                >
                    <RoundedButton
                        onPress={() =>
                            Actions.push(
                                componentKeyByTab('exploreTab', 'myTribeTab')
                            )
                        }
                        icon="flag"
                        text="My Tribes"
                    />
                    <RoundedButton
                        onPress={() => Actions.push('explore')}
                        icon="search"
                        text="Discover"
                    />
                </View>
                <FlatList />
            </View>
        )
    }
}

const RoundedButton = (props) => {
    const { onPress, text, icon } = props
    return (
        <TouchableOpacity
            style={{
                margin: 4,
                padding: 8,
                paddingLeft: 17,
                paddingRight: 20,
                borderRadius: 100,
                backgroundColor: '#F2F2F2',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            onPress={onPress}
        >
            <Icon
                name={icon}
                style={{ ...DEFAULT_STYLE.smallIcon_1, marginRight: 8 }}
            />
            <Text style={DEFAULT_STYLE.titleText_2}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = {}

const mapStateToProps = (state) => {
    const { navigationState } = state.explore

    return {
        navigationState,
    }
}

export default connect(mapStateToProps, {
    exploreSelectTab,
})(wrapAnalytics(Explore, SCREENS.EXPLORE_PAGE))
