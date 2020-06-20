/** @format */

import React, { Component } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { SearchBar } from 'react-native-elements'

/* Import icons */
import LikeIcon from '../asset/utils/like.png'
import BulbIcon from '../asset/utils/bulb.png'
import ShareIcon from '../asset/utils/share.png'

import profilePic from '../asset/utils/defaultUserProfile.png'

/* Component */
import Card from './Card'
import ContentContainer from './ContentContainer'
import ProgressBar from './ProgressBar'

class PostCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            buttons: [
                {
                    key: 'like',
                    title: '',
                    icon: LikeIcon,
                    data: 13,
                },
                {
                    key: 'share',
                    title: '',
                    icon: ShareIcon,
                    data: 1000,
                },
                {
                    key: 'bulk',
                    title: '',
                    icon: BulbIcon,
                    data: 128,
                },
            ],
        }
    }

    handleButtonPressedRelease(event) {}

    renderButtonGroup() {
        return this.state.buttons.map((b) => {
            return (
                <View
                    style={styles.buttonContainerStyle}
                    onResponderRelease={this.handleButtonPressedRelease.bind(
                        this
                    )}
                    nativeID={b.key}
                >
                    <Image style={styles.buttonStyle} source={b.icon} />
                    <Text style={styles.buttonCountStyle}>{b.data}</Text>
                </View>
            )
        })
    }

    render() {
        return (
            <Card>
                <View style={styles.bodyContainerStyle}>
                    <View style={styles.imageContainerStyle}>
                        <Image style={styles.imageStyle} source={profilePic} />
                    </View>
                    <ContentContainer />
                </View>

                <ProgressBar startTime="Mar 2013" endTime="Nov 2011" />

                <View style={styles.buttonGroupStyle}>
                    {this.renderButtonGroup()}
                </View>
            </Card>
        )
    }
}

const styles = StyleSheet.create({
    buttonGroupStyle: {
        borderTopWidth: 1,
        borderTopColor: '#f4f4f4',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 8,
        paddingBottom: 8,
    },
    buttonContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    buttonStyle: {
        marginRight: 8,
    },
    buttonCountStyle: {
        alignSelf: 'center',
        fontSize: 10,
        fontWeight: '600',
    },
    bodyContainerStyle: {
        margin: 12,
        flexDirection: 'row',
    },
    progressBarContainerStyle: {
        display: 'flex',
        marginLeft: 14,
        marginRight: 14,
        marginBottom: 14,
    },
    imageContainerStyle: {
        height: 60,
        width: 60,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#f4f4f4',
        padding: 2,
    },
    imageStyle: {
        height: 54,
        width: 54,
        borderRadius: 5,
    },
})

export default PostCard
