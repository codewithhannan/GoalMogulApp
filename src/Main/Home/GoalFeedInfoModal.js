/** @format */

import React from 'react'
import {
    View,
    Modal,
    Image,
    Text,
    Animated,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native'

// Assets
import CancelIcon from '../../asset/utils/cancel_no_background.png'
import HelpIcon from '../../asset/utils/HelpBG2.png'
import ForwardIcon from '../../asset/utils/forward.png'

class GoalFeedInfoModal extends React.PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            opacity: new Animated.Value(0),
        }
    }

    componentDidMount() {
        // const { opacity } = this.props;
        // const value = opacity !== undefined ? opacity : 1;
        Animated.timing(this.state.opacity, {
            useNativeDriver: true,
            duration: 100,
            toValue: 0.4,
        }).start()
    }

    closeModal = () => {
        Animated.timing(this.state.opacity, {
            useNativeDriver: true,
            duration: 150,
            toValue: 0,
        }).start()
    }

    handleCreateGoalOnPress = () => {
        this.handleCancelOnPress()
        const { onAction } = this.props
        if (onAction) onAction()
    }

    handleCancelOnPress = () => {
        this.closeModal()
        const { onClose } = this.props
        if (onClose) onClose()
    }

    renderCancelButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.cancelIconContainerStyle}
                onPress={this.handleCancelOnPress}
            >
                <Image
                    source={CancelIcon}
                    style={{ height: 13, width: 13, tintColor: '#17B3EC' }}
                />
            </TouchableOpacity>
        )
    }

    renderButton() {
        return (
            <View style={styles.buttonTextContainerStyle}>
                <Text style={styles.basicTextStyle}>Try it out: </Text>
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.buttonContainerStyle}
                    onPress={this.handleCreateGoalOnPress}
                >
                    <Text style={styles.buttonTextStyle}>Create Goal</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderHeader() {
        const mdash = String.fromCharCode(8212)
        const headerText = (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.headerBasicTextStyle}>
                    <Text style={{ fontWeight: '700' }}>Goal feed </Text>
                </Text>
                <Text style={styles.headerBasicTextStyle}>
                    {mdash} Give help, get help
                </Text>
            </View>
        )
        const explainText = (
            <Text
                style={{
                    ...styles.basicTextStyle,
                    fontStyle: 'italic',
                    marginTop: 4,
                }}
            >
                You and your friends can share goals & needs here.
            </Text>
        )
        return (
            <View>
                {headerText}
                {explainText}
            </View>
        )
    }

    renderSteps() {
        return (
            <View style={{ flexDirection: 'row', marginTop: 22 }}>
                <View style={{ flex: 1, flexWrap: 'wrap' }}>
                    <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                        <View style={styles.bulletStyle}>
                            <Text
                                style={{
                                    ...styles.basicTextStyle,
                                    fontWeight: '700',
                                }}
                            >
                                1.
                            </Text>
                        </View>
                        <View>
                            <Text
                                style={{
                                    ...styles.basicTextStyle,
                                    flexWrap: 'wrap',
                                }}
                            >
                                Tap that share button on your Goal or Need
                            </Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.bulletStyle}>
                            <Text
                                style={{
                                    ...styles.basicTextStyle,
                                    fontWeight: '700',
                                }}
                            >
                                2.
                            </Text>
                        </View>
                        <View>
                            <Text
                                style={{
                                    ...styles.basicTextStyle,
                                    flexWrap: 'wrap',
                                }}
                            >
                                Watch it appear at the top of the Goal feed!
                            </Text>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View style={styles.forwardButtonContainerStyle}>
                        <Image
                            source={ForwardIcon}
                            style={{ height: 40, width: 40, tintColor: 'gray' }}
                        />
                    </View>
                </View>
            </View>
        )
    }

    render() {
        return (
            <Modal animation="fade" visible={this.props.infoModal} transparent>
                <View style={{ flex: 1 }}>
                    <TouchableWithoutFeedback
                        onPress={this.handleCancelOnPress}
                    >
                        <Animated.View
                            style={{
                                ...styles.backgroundContainerStyle,
                                opacity: this.state.opacity,
                            }}
                        />
                    </TouchableWithoutFeedback>
                    <View style={styles.mainContentContainerStyle}>
                        <View
                            style={{
                                padding: 15,
                                paddingTop: 20,
                                paddingBottom: 20,
                                zIndex: 1,
                            }}
                        >
                            {this.renderCancelButton()}
                            {this.renderHeader()}
                            {this.renderSteps()}
                            {this.renderButton()}
                        </View>
                        <View style={styles.backgroundImageContainerStyle}>
                            <Image style={{ height: 180 }} source={HelpIcon} />
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = {
    backgroundContainerStyle: {
        flex: 1,
        backgroundColor: 'gray',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    mainContentContainerStyle: {
        backgroundColor: 'white',
        marginTop: 180,
        width: '100%',
    },
    cancelIconContainerStyle: {
        position: 'absolute',
        top: 5,
        right: 5,
        padding: 10,
        zIndex: 2,
    },
    headerBasicTextStyle: {
        color: '#7d7d7d',
        fontSize: 18,
    },
    basicTextStyle: {
        color: '#7d7d7d',
        fontSize: 13,
    },
    buttonTextContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    buttonContainerStyle: {
        marginLeft: 8,
        alignItems: 'center',
        backgroundColor: '#17B3EC',
        padding: 10,
        borderRadius: 5,
    },
    buttonTextStyle: {
        color: 'white',
        fontWeight: '700',
        fontSize: 14,
    },
    bulletStyle: {
        width: 14,
    },
    bulletText: {
        flex: 1,
    },
    // Styles for forward button
    forwardButtonContainerStyle: {
        height: 80,
        width: 80,
        borderRadius: 40,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'lightgray',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 1,
    },
    backgroundImageContainerStyle: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 0,
    },
}

export default GoalFeedInfoModal
