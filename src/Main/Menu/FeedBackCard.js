/** @format */

import React, { Component } from 'react'

import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
} from 'react-native'

import * as Progress from 'react-native-progress'
import { Entypo } from '@expo/vector-icons'
import { connect } from 'react-redux'
import { deleteFeedback } from '../../actions/FeedbackActions'

const screenWidth = Dimensions.get('screen').width

class FeedBackCard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            progress: 0,
            indeterminate: true,
            percentage: 0,
        }
    }

    componentDidMount() {
        this.animate()
    }

    animate() {
        let progress = 0
        let percentage = 0
        this.setState({ progress, percentage })
        setTimeout(() => {
            this.setState({ indeterminate: false })
            let progressInterval = setInterval(() => {
                if (progress === 99) {
                    clearInterval(progressInterval)
                }
                progress += Math.random() / 2
                this.setState({ progress })
            }, 500)

            let percentageInterval = setInterval(() => {
                if (percentage === 99) {
                    clearInterval(percentageInterval)
                }
                percentage += 1
                this.setState({ percentage })
            }, 10)
        }, 1500)
    }

    render() {
        const { item, index } = this.props

        if (!item) return
        return (
            <View style={styles.container}>
                <Image
                    style={{
                        height: 70,
                        width: 70,
                        alignSelf: 'center',
                        marginHorizontal: 20,
                        overflow: 'hidden',

                        borderRadius: 10,
                    }}
                    source={{ uri: item.path }}
                />

                <View>
                    <View style={{ flexDirection: 'row', top: 20 }}>
                        <Text style={{}}>{item.path.slice(220)}</Text>
                        <Text
                            style={{
                                position: 'absolute',
                                right: 0,
                            }}
                        >{`${this.state.percentage}%`}</Text>
                    </View>
                    <Progress.Bar
                        style={styles.progress}
                        progress={this.state.progress}
                        indeterminate={this.state.indeterminate}
                        color="#42C0F5"
                        width={screenWidth * 0.56}
                        height={3}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => this.props.deleteFeedback(index)}
                    style={{ position: 'absolute', right: 25, top: 20 }}
                >
                    <View
                        style={{
                            height: 20,
                            width: 20,
                            borderRadius: 50,
                            backgroundColor: '#E5F7FF',
                        }}
                    />
                    <Entypo
                        name="cross"
                        size={15}
                        color="#42C0F5"
                        style={{ position: 'absolute', padding: 2 }}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        marginTop: 10,
        bottom: 6,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    circles: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progress: {
        marginTop: 30,
    },
})

const mapStateToProps = (state, props) => {
    const { token } = state.auth.user
    const feedback = state.feedback.feedBackimages

    return {
        token,
        feedback,
    }
}

export default connect(mapStateToProps, {
    deleteFeedback,
})(FeedBackCard)
