/**
 * This modal shows the tribe description, when the about button is clicked.
 *
 * @format
 */

import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { View, Image, Text } from 'react-native'
import Constants from 'expo-constants'
import Modal from 'react-native-modal'
import { Icon } from '@ui-kitten/components'
import cancel from '../../../asset/utils/cancel_no_background.png'
import DelayedButton from '../../Common/Button/DelayedButton'

import { default_style, color } from '../../../styles/basic'

class MyTribeDescription extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {}

        this.animations = {}
    }

    componentDidUpdate(prevProps) {
        // Modal is shown
        if (!prevProps.isVisible && this.props.isVisible) {
            // Send request to fetch the number of
            const callback = (count) => {}
        }
    }

    closeModal() {
        this.props.closeModal && this.props.closeModal()
    }

    onModalShow = () => {
        // Mark modal as shown by calling endpoint and update user profile
    }

    render() {
        return (
            <Modal
                backdropColor={'black'}
                backdropOpacity={0.5}
                isVisible={this.props.isVisible}
                onModalShow={this.onModalShow}
                onBackdropPress={() => this.closeModal()}
                onSwipeComplete={() => this.closeModal()}
                swipeDirection={'down'}
                style={{
                    marginTop: Constants.statusBarHeight + 15,
                    borderRadius: 15,
                    margin: 0,
                }}
            >
                <View
                    style={{
                        backgroundColor: color.GM_CARD_BACKGROUND,
                        width: '100%',
                        position: 'absolute',
                        bottom: 0,
                        borderRadius: 5,
                    }}
                >
                    <View
                        style={{
                            ...styles.modalContainerStyle,
                            flex: 1,
                        }}
                    >
                        <View style={styles.header}>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Icon
                                    name="flag-variant"
                                    pack="material-community"
                                    zIndex={1}
                                    style={styles.imageIcon}
                                />
                                <Text style={styles.aboutTitle}>About</Text>
                            </View>
                            <DelayedButton
                                style={{
                                    padding: 16,
                                    position: 'absolute',
                                    right: 0,
                                    top: -17,
                                }}
                                activeOpacity={0.6}
                                onPress={() => this.closeModal()}
                            >
                                <Icon
                                    name="close"
                                    pack="material-community"
                                    zIndex={1}
                                    style={default_style.buttonIcon_1}
                                />
                            </DelayedButton>
                        </View>
                    </View>
                    <View style={styles.aboutContainer}>
                        <Text style={default_style.normalText_1}>
                            {this.props.item.description}
                        </Text>
                    </View>
                </View>
            </Modal>
        )
    }
}

export default connect()(MyTribeDescription)

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    aboutContainer: {
        padding: 20,
        paddingTop: 0,
        paddingBottom: 60,
    },
    aboutTitle: {
        ...default_style.titleText_1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
        paddingHorizontal: 16,
    },
    imageIcon: {
        ...default_style.smallIcon_1,
        marginRight: 10,
    },
    modalContainerStyle: {
        backgroundColor: color.GM_CARD_BACKGROUND,
        borderRadius: 15,
        paddingTop: 16,
        paddingBottom: 16,
    },
}
