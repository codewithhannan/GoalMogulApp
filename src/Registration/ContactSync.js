/** @format */

import React, { Component } from 'react'
import { View, FlatList, ActivityIndicator, Text } from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import * as Animatable from 'react-native-animatable'
import { DotIndicator } from 'react-native-indicators'
import Modal from 'react-native-modal'

/* Components */
import Header from './Common/Header'
import Button from './Common/Button'
import ContactCard from './ContactCard'
import ContactDetail from './ContactDetail'
import ModalHeader from '../Main/Common/Header/ModalHeader'
import EmptyResult from '../Main/Common/Text/EmptyResult'
import DelayedButton from '../Main/Common/Button/DelayedButton'
import LoadingModal from '../Main/Common/Modal/LoadingModal'

/* Styles */
import Styles from './Styles'

/* Actions */
import {
    registrationContactSyncDone,
    contactSyncRefresh,
    contactSyncLoadMore,
    meetContactSyncLoadMore,
} from '../actions'
import { color } from '../styles/basic'

class ContactSync extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: 'registration',
            showUploadingModal: true,
        }
        this.modalTimer = undefined
    }

    UNSAFE_componentWillReceiveProps(props) {
        if (props.type) {
            this.setState({ type: props.type })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.uploading && !this.props.uploading) {
            this.modalTimer = setTimeout(() => {
                this.setState({
                    ...this.state,
                    showUploadingModal: false,
                })
            }, 500)
        }
    }

    componentWillUnmount() {
        if (this.modalTimer !== undefined) {
            clearInterval(this.modalTimer)
        }
    }

    onLoadMore = () => {
        if (this.state.type === 'meet') {
            // No need since it will load all at once
            // return this.props.meetContactSyncLoadMore(false);
        }
        this.props.contactSyncLoadMore()
    }

    handleRefresh = () => {
        if (this.state.type === 'meet') {
            return this.props.meetContactSyncLoadMore(true)
        }
        this.props.contactSyncRefresh()
    }

    handleDoneOnPressed() {
        this.props.registrationContactSyncDone()
    }

    _keyExtractor = (item) => item._id

    renderItem({ item }) {
        return (
            <ContactCard>
                <ContactDetail item={item} />
            </ContactCard>
        )
    }

    renderListEmptyComponent(refreshing, uploading) {
        if (refreshing) return null

        if (uploading) {
            return (
                <View style={{ flex: 1 }}>
                    <EmptyResult
                        text={'Uploading Contacts'}
                        textStyle={{ marginBottom: 20 }}
                    />
                    <DotIndicator size={10} color={color.GM_BLUE} />
                </View>
            )
        }

        return <EmptyResult text={'No contacts found'} />
    }

    renderListFooter(loading, data) {
        if (loading && data.length >= 4) {
            return (
                <View
                    style={{
                        paddingVertical: 20,
                    }}
                >
                    <ActivityIndicator size="large" />
                </View>
            )
        }
        return null
    }

    // Currently this is not being used
    renderUploadingModal() {
        return (
            <Modal
                backdropColor={'black'}
                isVisible={this.state.showUploadingModal}
                backdropOpacity={0.7}
                style={{ alignItems: 'center', justifyContent: 'center' }}
                animationIn="fadeIn"
                animationOut="fadeOut"
                animationOutTiming={500}
                backdropTransitionOutTiming={500}
                onModalHide={() => this.handleRefresh()}
            >
                <View style={styles.modalContainerStyle}>
                    <Text
                        style={{
                            color: 'black',
                            fontWeight: '600',
                            margin: 15,
                            fontSize: 20,
                        }}
                    >
                        Uploading
                    </Text>
                    <View style={{ height: 30 }} />
                    <View style={{ position: 'absolute', bottom: 44 }}>
                        <DotIndicator size={10} color={color.GM_BLUE} />
                    </View>
                </View>
            </Modal>
        )
    }

    // TODO: replace data with this.props.data
    render() {
        const { type, actionCallback } = this.props

        // Assign actionable buttons
        const button =
            type !== undefined && type === 'meet' ? null : (
                <DelayedButton
                    activeOpacity={0.6}
                    onPress={this.handleDoneOnPressed.bind(this)}
                >
                    <View style={styles.footer}>
                        <Button text="Done" />
                    </View>
                </DelayedButton>
            )

        const data =
            type !== undefined && type === 'meet'
                ? this.props.meetMatchedContacts.data
                : this.props.registrationMatchedContacts.data

        const refreshing =
            type !== undefined && type === 'meet'
                ? this.props.meetMatchedContacts.refreshing
                : this.props.registrationMatchedContacts.refreshing

        const loading =
            type !== undefined && type === 'meet'
                ? this.props.meetMatchedContacts.loading
                : this.props.registrationMatchedContacts.loading

        const uploading =
            type !== undefined && type === 'meet'
                ? this.props.meetMatchedContacts.uploading
                : this.props.registrationMatchedContacts.uploading

        // Assign header
        const header =
            type !== undefined && type === 'meet' ? (
                <ModalHeader
                    title="Sync contacts"
                    actionText="Next"
                    back
                    showActionLoading
                    actionLoading={uploading}
                    onAction={() => {
                        Actions.push('friendsTab_contactInvite')
                    }}
                    onCancel={() => {
                        Actions.popTo('meet')
                        actionCallback()
                    }}
                    containerStyles={{
                        elevation: 3,
                        shadowColor: '#666',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.15,
                        shadowRadius: 3,
                        backgroundColor: color.GM_BLUE,
                    }}
                    backButtonStyle={{
                        tintColor: '#21364C',
                    }}
                    actionTextStyle={{
                        color: '#21364C',
                    }}
                    titleTextStyle={{
                        color: '#21364C',
                    }}
                    loadingIndicatorStyle={{
                        color: '#21364C',
                    }}
                />
            ) : (
                <Header contact type="contact" />
            )

        return (
            <View style={Styles.containerStyle}>
                <View
                    style={{
                        shadowColor: 'lightgray',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.3,
                    }}
                >
                    {header}
                </View>
                <View style={{ flex: 1, display: 'flex' }}>
                    <FlatList
                        data={data}
                        renderItem={(item) => this.renderItem(item)}
                        numColumns={1}
                        keyExtractor={this._keyExtractor}
                        refreshing={refreshing}
                        onRefresh={this.handleRefresh}
                        onEndReached={this.onLoadMore}
                        ListEmptyComponent={() =>
                            this.renderListEmptyComponent(refreshing, uploading)
                        }
                        ListFooterComponent={() =>
                            this.renderListFooter(loading, data)
                        }
                        onEndThreshold={0}
                    />
                    {button}
                </View>
            </View>
        )
    }
}

const styles = {
    footer: {},
    modalContainerStyle: {
        height: 150,
        width: 150,
        backgroundColor: 'white',
        borderRadius: 14,
        marginBottom: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadingTextStyle: {},
}

const mapStateToProps = (state) => {
    const meetMatchedContacts = state.meet.matchedContacts
    const registrationMatchedContacts = state.registration.matchedContacts

    return {
        meetMatchedContacts,
        registrationMatchedContacts,
    }
}

export default connect(mapStateToProps, {
    registrationContactSyncDone,
    contactSyncRefresh,
    contactSyncLoadMore,
    meetContactSyncLoadMore,
})(ContactSync)
