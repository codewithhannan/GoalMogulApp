/** @format */

import React from 'react'
import { View, Keyboard } from 'react-native'
import { connect } from 'react-redux'

// Components
import CommentUserDetail from './CommentUserDetail'

const DEBUG_KEY = '[ UI CommentCard ]'

class CommentCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            childCommentLayouts: {},
            totalViewHeight: 0,
            keyboardHeight: 216,
            commentLength: 0,
        }
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow
        )
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide
        )
        const { childComments } = this.props.item

        if (!childComments) return

        const { commentLength } = this.state

        // Update child comment length if new child comment is added
        if (commentLength !== childComments.length) {
            this.setState({
                ...this.state,
                commentLength: childComments.length,
            })
        }
    }

    onLayout = (e, index) => {
        const childCommentLayouts = this.state.childCommentLayouts
        childCommentLayouts[index] = {
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
            x: e.nativeEvent.layout.x,
            y: e.nativeEvent.layout.y,
        }
        this.setState({
            childCommentLayouts,
            totalViewHeight: getTotalViewHeight(this.state),
        })
    }

    componentWillUnMount() {
        this.keyboardDidHideListener.remove()
        this.keyboardDidShowListener.remove()
    }

    _keyboardDidShow = (e) => {
        this.setState({
            keyboardHeight: e.endCoordinates.height,
        })
    }

    _keyboardDidHide = (e) => {
        this.setState({
            keyboardHeight: e.endCoordinates.height,
        })
    }

    // update user detail layout for childcomments computing
    updateUserDetailLayout = (layout) => {
        this.setState({
            userDetailLayout: layout,
            totalViewHeight: getTotalViewHeight(this.state),
        })
    }

    render() {
        const viewOffset =
            getTotalPrevHeight(this.state) - this.state.keyboardHeight
        // console.log(`${DEBUG_KEY} item is: `, this.props.item);
        return (
            <View style={styles.cardContainerStyle}>
                <CommentUserDetail
                    {...this.props}
                    ref="userDetail"
                    onLayout={(layout) => this.updateUserDetailLayout(layout)}
                    viewOffset={viewOffset}
                    userId={this.props.userId}
                />
            </View>
        )
    }
}

const getTotalPrevHeight = (state, index) => {
    const { childCommentLayouts } = state
    const i = index === undefined ? -1 : index

    const totalHeights = Object.entries(childCommentLayouts).reduce(
        (total, [key, value]) => {
            if (parseInt(key, 10) > i) {
                return total + parseInt(value.height, 10)
            }
            return total
        },
        0
    )

    return totalHeights
}

const getTotalViewHeight = (state) => {
    const { userDetailLayout, childCommentLayouts } = state

    let totalHeights = Object.entries(childCommentLayouts).reduce(
        (total, [key, value]) => {
            return total + parseInt(value.height, 10)
        },
        0
    )
    if (userDetailLayout && userDetailLayout.height) {
        totalHeights -= userDetailLayout.height
    }

    return totalHeights
}

const styles = {
    cardContainerStyle: {
        marginBottom: 0.5,
    },

    // Styles related to child comments
    replyIconStyle: {
        height: 20,
        width: 20,
        tintColor: '#d2d2d2',
    },
    replyIconContainerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
    },
}

const mapStateToProps = (state) => {
    const { userId } = state.user

    return {
        userId,
    }
}

export default connect(mapStateToProps, null)(CommentCard)
