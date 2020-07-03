/** @format */

import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'

// Components

// Assets
import defaultUserProfile from '../../../asset/utils/defaultUserProfile.png'
import next from '../../../asset/utils/next.png'

// Actions
import { updateFriendship, openProfile, UserBanner } from '../../../actions'
import DelayedButton from '../../Common/Button/DelayedButton'
import ProfileImage from '../../Common/ProfileImage'
import { EVENT, trackWithProperties } from '../../../monitoring/segment'

const DEBUG_KEY = '[ Component SearchUserCard ]'

class SearchUserCard extends Component {
    constructor(props) {
        super(props)
        this.handleSelectClick = this.handleSelectClick.bind(this)
        this.handleRemoveClick = this.handleRemoveClick.bind(this)
        this.state = { isLoggedIn: false }
    }

    handleSelectClick() {
        this.setState({ isLoggedIn: true })
    }

    handleRemoveClick() {
        this.setState({ isLoggedIn: false })
    }

    state = {
        imageLoading: false,
    }

    onButtonClicked = (_id) => {
        console.log(`${DEBUG_KEY} open profile with id: `, _id)
        trackWithProperties(EVENT.SEARCH_RESULT_CLICKED, {
            Type: 'people',
            Id: _id,
        })
        if (this.props.onSelect && this.props.onSelect instanceof Function) {
            return this.props.onSelect(_id, this.props.item)
        }
        this.props.openProfile(_id)
    }

    renderProfileImage() {
        const { profile, _id } = this.props.item
        const { image } = profile
        return (
            <ProfileImage
                imageStyle={{ height: 55, width: 55, borderRadius: 5 }}
                imageUrl={image}
                rounded
                imageContainerStyle={styles.imageContainerStyle}
                defaultImageSource={defaultUserProfile}
                userId={_id}
            />
        )
    }

    renderButton(_id) {
        const { cardIconSource, cardIconStyle } = this.props
        const iconSource = cardIconSource || next
        const iconStyle = {
            ...styles.iconStyle,
            opacity: 0.8,
            ...cardIconStyle,
        }
        return (
            <View style={styles.iconContainerStyle}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={this.onButtonClicked.bind(this, _id)}
                    style={{ padding: 15 }}
                >
                    <Image source={iconSource} style={iconStyle} />
                </TouchableOpacity>
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
                <UserBanner
                    user={item}
                    iconStyle={{ marginLeft: 3, height: 16, width: 14 }}
                />
            </View>
        )
    }

    renderCardContent(item) {
        let content
        if (item.headline) {
            content = item.headline
        } else if (item.occupation) {
            content = item.occupation
        }

        return (
            <View
                style={{
                    justifyContent: 'flex-start',
                    flex: 1,
                    marginLeft: 10,
                    marginTop: 13,
                }}
            >
                {this.renderTitle(item)}
            </View>
        )
    }

    render() {
        const { item } = this.props
        if (!item) return null

        const itemIsSelected = this.props.itemIsSelected

        const { _id } = item
        let { cardContainerStyles } = this.props
        if (!cardContainerStyles) {
            cardContainerStyles = {}
        }

        let button
        if (!itemIsSelected) {
            button = (
                <TouchableOpacity
                    style={styles.buttonStyleAdd}
                    underlayColor="#fff"
                    onPress={() => {
                        this.onButtonClicked(_id)
                        this.handleRemoveClick()
                    }}
                >
                    <Text style={styles.buttonText}>Added</Text>
                </TouchableOpacity>
            )
        } else {
            button = (
                <TouchableOpacity
                    style={styles.buttonStyle}
                    underlayColor="#fff"
                    onPress={() => {
                        this.onButtonClicked(_id)
                        this.handleSelectClick()
                    }}
                >
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
            )
        }
        return (
            <View style={{ ...styles.containerStyle, ...cardContainerStyles }}>
                {this.renderProfileImage(item)}
                {this.renderCardContent(item)}
                {button}
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        flexDirection: 'row',
        paddingLeft: 12,
        paddingRight: 12,
        marginTop: 1,
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
    buttonStyle: {
        flexGrow: 0,
        marginRight: 10,
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#42C0F5',
        borderRadius: 3,
        borderColor: '#fff',
    },
    buttonStyleAdd: {
        flexGrow: 0,
        marginRight: 10,
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#BDBDBD',
        borderRadius: 3,
        borderColor: '#fff',
    },
    buttonText: {
        color: 'white',
    },
}

export default connect(null, {
    updateFriendship,
    openProfile,
})(SearchUserCard)
