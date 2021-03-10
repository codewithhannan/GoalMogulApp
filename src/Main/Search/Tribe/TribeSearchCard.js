/** @format */

import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'

// Components

// Assets
import tribe_default_icon from '../../../asset/utils/tribeIcon.png'
import next from '../../../asset/utils/next.png'

// Actions
import { selectTribe } from '../../../redux/modules/feed/post/ShareActions'
import { tribeDetailOpen } from '../../../redux/modules/tribe/MyTribeActions'
import DelayedButton from '../../Common/Button/DelayedButton'
import ProfileImage from '../../Common/ProfileImage'
import { trackWithProperties, EVENT } from '../../../monitoring/segment'

const DEBUG_KEY = '[ Component SearchTribeCard ]'

class SearchTribeCard extends Component {
    state = {
        imageLoading: false,
    }

    /**
     * @param type: ['GeneralSearch', 'SearchSuggestion']
     * @param item: search result item
     */
    onButtonClicked = (item, type) => {
        const { onItemSelect, selectTribe, tribeDetailOpen } = this.props
        trackWithProperties(EVENT.SEARCH_RESULT_CLICKED, {
            Type: 'tribe',
            Id: item._id,
        })
        if (!type || type === 'SearchSuggestion') {
            console.log(`${DEBUG_KEY} select tribe: `, item)

            // This is passed in through EventSearchOverlay. It is initially used by ChatRoomConversation
            if (onItemSelect) {
                onItemSelect(item._id)
                return
            }

            selectTribe(item, this.props.callback)
            return
        }

        if (type === 'GeneralSearch') {
            console.log('open tribe detail with type GeneralSearch')
            tribeDetailOpen(item)
            return
        }
    }

    renderTribeImage() {
        const { picture } = this.props.item
        return (
            <ProfileImage
                imageStyle={{ height: 55, width: 55 }}
                imageUrl={picture}
                rounded
                imageContainerStyle={styles.imageContainerStyle}
                defaultUserProfile={tribe_default_icon}
            />
        )
    }

    renderButton(item, type) {
        return (
            <View style={styles.iconContainerStyle}>
                <DelayedButton
                    activeOpacity={0.6}
                    onPress={() => this.onButtonClicked(item, type)}
                    style={{ padding: 15 }}
                >
                    <Image
                        source={next}
                        style={{ ...styles.iconStyle, opacity: 0.8 }}
                    />
                </DelayedButton>
            </View>
        )
    }

    renderTitle(item) {
        let title = item.name

        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: 2,
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{ color: 'black', fontSize: 18, fontWeight: '600' }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {title}
                </Text>
            </View>
        )
    }

    /**
     * Render member information
     */
    renderInformation(item) {
        let count = item.memberCount
        if (count > 999) {
            count = '1k+'
        }
        const defaultTextStyle = { color: '#abb1b0', fontSize: 10 }

        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 3,
                }}
            >
                {/*<Text style={defaultTextStyle}>{category}</Text>
				<Dot />*/}
                {count ? (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ ...defaultTextStyle, color: '#15aad6' }}>
                            {count}
                        </Text>
                        <Text style={defaultTextStyle}>
                            &nbsp;{item.memberCount > 1 ? 'members' : 'member'}
                        </Text>
                    </View>
                ) : null}
            </View>
        )
    }

    renderCardContent(item) {
        let content
        if (item.description) {
            content = item.description
        }

        return (
            <View
                style={{
                    justifyContent: 'flex-start',
                    flex: 1,
                    marginLeft: 10,
                }}
            >
                {this.renderTitle(item)}
                <View style={{ marginTop: item.memberCount ? 3 : 6 }}>
                    <Text
                        style={{
                            flex: 1,
                            flexWrap: 'wrap',
                            color: '#838f97',
                            fontSize: 15,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {content}
                    </Text>
                </View>
                {this.renderInformation(item)}
            </View>
        )
    }

    render() {
        const { item, type } = this.props
        return (
            <DelayedButton
                activeOpacity={0.6}
                onPress={() => this.onButtonClicked(item, type)}
            >
                <View style={styles.containerStyle}>
                    {this.renderTribeImage()}
                    {this.renderCardContent(item)}
                </View>
            </DelayedButton>
        )
    }
}

const styles = {
    containerStyle: {
        flexDirection: 'row',
        marginTop: 1,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: '#ffffff',
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    iconContainerStyle: {
        marginLeft: 8,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    iconStyle: {
        height: 25,
        width: 26,
        transform: [{ rotateY: '180deg' }],
        tintColor: '#17B3EC',
    },
    imageContainerStyle: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
    },
}

export default connect(null, {
    selectTribe,
    tribeDetailOpen,
})(SearchTribeCard)