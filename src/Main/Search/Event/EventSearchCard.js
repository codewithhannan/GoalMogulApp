/** @format */

import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'

// Components
import DelayedButton from '../../Common/Button/DelayedButton'

// Assets
import event_default_image from '../../../asset/utils/eventIcon.png'
import next from '../../../asset/utils/next.png'

// Actions
import { selectEvent } from '../../../redux/modules/feed/post/ShareActions'
import { eventDetailOpen } from '../../../redux/modules/event/MyEventActions'
import ProfileImage from '../../Common/ProfileImage'
import { trackWithProperties, EVENT as E } from '../../../monitoring/segment'

const DEBUG_KEY = '[ Component SearchEventCard ]'

class SearchEventCard extends Component {
    state = {
        imageLoading: false,
    }

    /**
     * @param type: ['GeneralSearch', 'SearchSuggestion']
     * @param item: search result item
     */
    onButtonClicked = (item, type) => {
        const { onItemSelect, selectEvent, eventDetailOpen } = this.props
        // trackWithProperties(E.SEARCH_RESULT_CLICKED, {
        //     Type: 'event',
        //     Id: item._id,
        // })
        if (!type || type === 'SearchSuggestion') {
            console.log(`${DEBUG_KEY} select event: `, item)

            // This is passed in through EventSearchOverlay. It is initially used by ChatRoomConversation
            if (onItemSelect) {
                onItemSelect(item._id)
                return
            }

            selectEvent(item, this.props.callback)
            return
        }
        if (type === 'GeneralSearch') {
            console.log('open event detail with type GeneralSearch')
            eventDetailOpen(item)
            return
        }
        // Open event page
    }

    renderEventImage() {
        const { picture } = this.props.item
        return (
            <ProfileImage
                imageStyle={{ height: 55, width: 55, borderRadius: 5 }}
                imageUrl={picture}
                rounded
                imageContainerStyle={styles.imageContainerStyle}
                defaultUserProfile={event_default_image}
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
        let title = item.title

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
        let count = item.participantCount
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
                            &nbsp;
                            {item.participantCount > 1 ? 'members' : 'member'}
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
                <View style={{ marginTop: item.participantCount ? 3 : 6 }}>
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
                    {this.renderEventImage()}
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
        borderWidth: 0.5,
        padding: 1.5,
        borderColor: 'lightgray',
        alignItems: 'center',
        borderRadius: 6,
        alignSelf: 'center',
        backgroundColor: 'white',
    },
}

export default connect(null, {
    selectEvent,
    eventDetailOpen,
})(SearchEventCard)
