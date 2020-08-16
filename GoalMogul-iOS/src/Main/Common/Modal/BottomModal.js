/**
 * This modal shows content from the bottom of the screen, currently used in About for Tribes.
 *
 * @format
 */

import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { View, Image, Text } from 'react-native'
import Constants from 'expo-constants'
import Modal from 'react-native-modal'
import cancel from '../../../asset/utils/cancel_no_background.png'
import DelayedButton from '../../Common/Button/DelayedButton'

import flagIcon from '../../../asset/icons/flag.png'

class BottomModal extends React.PureComponent {
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

    renderCancelButton() {
        return (
            <View
                style={{ position: 'absolute', top: 0, right: 0, padding: 10 }}
            >
                <DelayedButton
                    activeOpacity={0.6}
                    onPress={() => this.closeModal()}
                    style={styles.modalCancelIconContainerStyle}
                >
                    <Image
                        source={cancel}
                        style={styles.modalCancelIconStyle}
                    />
                </DelayedButton>
            </View>
        )
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
                        backgroundColor: 'white',
                        width: '100%',
                        position: 'absolute',
                        bottom: 0,
                        borderRadius: 5,
                    }}
                >
                    <View
                        style={{
                            ...styles.modalContainerStyle,
                            backgroundColor: 'transparent',
                            flex: 1,
                        }}
                    >
                        {this.renderCancelButton()}
                        <View style={styles.aboutTitle}>
                            <Image source={flagIcon} style={styles.imageIcon} />
                            <Text style={styles.header}>About</Text>
                        </View>
                    </View>
                    <View style={styles.aboutContainer}>
                        <Text>{this.props.item.description}</Text>
                    </View>
                </View>
            </Modal>
        )
    }
}

export default connect()(BottomModal)

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    aboutContainer: {
        padding: 20,
        paddingTop: 0,
        paddingBottom: 39,
    },
    header: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: '700',
    },
    aboutTitle: {
        paddingLeft: 20,
        paddingTop: 10,
        flexDirection: 'row',
    },
    imageIcon: {
        marginTop: 5,
        marginRight: 10,
    },

    modalContainerStyle: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 5,
        alignItems: 'left',
    },

    modalCancelIconContainerStyle: {
        height: 30,
        width: 30,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    modalCancelIconStyle: {
        height: 14,
        width: 14,
        tintColor: 'black',
    },
}
