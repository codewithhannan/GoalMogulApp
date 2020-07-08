/** @format */

import React from 'react'
import {
    View,
    Text,
    Keyboard,
    FlatList,
    KeyboardAvoidingView,
} from 'react-native'
import { connect } from 'react-redux'
import timeago from 'timeago.js'

// Components
import CommentUserDetail from './CommentUserDetail'
import ChildCommentCard from './ChildCommentCard'
import DelayedButton from '../../../Common/Button/DelayedButton'

// Assets
import { GM_BLUE, DEFAULT_STYLE } from '../../../../styles'
import ProfileImage from '../../../Common/ProfileImage'
import ModalHeader from '../../../Common/Header/ModalHeader'
import Headline from '../../Common/Headline'
import Timestamp from '../../Common/Timestamp'
import { MenuProvider } from 'react-native-popup-menu'

const DEBUG_KEY = '[ UI CommentCard ]'

class ReplyThread extends React.Component {
    constructor(props) {
        super(props)
    }

    _renderItem({ item }) {
        ;<CommentUserDetail
            {...this.props}
            ref="userDetail"
            onLayout={(layout) => this.updateUserDetailLayout(layout)}
            userId={this.props.userId}
        />
    }

    renderHeader() {
        const { item } = this.props
        const { owner, created } = item

        const timeStamp =
            created === undefined || created.length === 0 ? new Date() : created
        console.log(item)
        return (
            <View>
                <View style={{ flexDirection: 'row' }}>
                    <ProfileImage
                        imageUrl={
                            owner && owner.profile
                                ? owner.profile.image
                                : undefined
                        }
                        userId={owner._id}
                    />
                    <View style={{ marginLeft: 12, marginTop: 2, flex: 1 }}>
                        <Headline
                            name={owner.name || ''}
                            user={owner}
                            textStyle={DEFAULT_STYLE.titleText_2}
                        />
                        <View style={{ marginTop: 2 }} />
                        <Timestamp time={timeago().format(timeStamp)} />
                    </View>
                </View>
            </View>
        )
    }

    render() {
        return (
            <MenuProvider>
                <KeyboardAvoidingView style={styles.cardContainerStyle}>
                    <ModalHeader back />
                    {this.renderHeader()}
                    <FlatList />
                </KeyboardAvoidingView>
            </MenuProvider>
        )
    }
}

const styles = {
    cardContainerStyle: {},
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

export default connect(mapStateToProps, {})(ReplyThread)
