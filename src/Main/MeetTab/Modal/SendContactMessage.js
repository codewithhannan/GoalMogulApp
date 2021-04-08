/** @format */

import React, { Component } from 'react'
import {
    View,
    Text,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native'

import { color } from '../../../styles/basic'
import { Icon } from '@ui-kitten/components'
import { connect } from 'react-redux'
import { SafeAreaView } from 'react-navigation'
import * as Contacts from 'expo-contacts'
import * as Permissions from 'expo-permissions'
import { ActivityIndicator } from 'react-native-paper'

//MiddleWare to get the Invite Link
import { generateInvitationLink } from '../../../redux/middleware/utils'

//To get Stored Data in asyncStorage
import { getData } from '../../../store/storage'

import { api as API } from '../../../redux/middleware/api'
import * as _ from 'underscore'
import { Actions } from 'react-native-router-flux'

const screenHeight = Dimensions.get('screen').height

const DEBUGKEY = ['Contacts Screen']

class MessageToContactsModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            renderData: [],
            isLoading: true,
            currentPage: 1,
            inviteMessage: '',
            itemPerPage: 4000,
            flatListData: [],
        }
    }

    getInviteLink = () => {
        return generateInvitationLink(this.props.inviteCode)
    }

    async componentDidMount() {
        const getInviteMessage = await getData('INVITEMESSAGE')

        this.setState({ inviteMessage: getInviteMessage })
        console.log(
            `${DEBUGKEY} this is the Invite message of User to Send`,
            getInviteMessage
        )
        setTimeout(async () => {
            const { status } = await Permissions.askAsync(Permissions.CONTACTS)
            console.log(
                `${DEBUGKEY} this is the Status of Contacts Permission`,
                status
            )
            try {
                if (status === 'granted') {
                    const { data } = await Contacts.getContactsAsync({
                        fields: [Contacts.Fields.PhoneNumbers],
                    })

                    console.log(
                        `${DEBUGKEY} this is all Contacts we get from the device`,
                        data
                    )

                    if (data.length > 0) {
                        let contacts = []

                        data.map((item) => {
                            if (item.firstName && item.phoneNumbers) {
                                contacts.push({
                                    name: item.firstName,
                                    number: item.phoneNumbers[0],
                                })
                            }
                            return contacts
                        })
                        console.log(
                            `${DEBUGKEY} this is all Contacts only including firstname and number`,
                            contacts
                        )

                        const allData = contacts.map((item, index) => {
                            return {
                                name: item.name,
                                number: item.number.number,
                                id: index,
                            }
                        })

                        let renderData = _.sortBy(allData, 'name')
                        console.log(
                            `${DEBUGKEY} this is sorted Contacts all Contacts `,
                            renderData
                        )

                        const filteredDate = renderData.slice(
                            0,
                            this.state.currentPage * this.state.itemPerPage
                        )

                        this.setState({
                            renderData,
                            flatListData: filteredDate,
                            isLoading: false,
                        })

                        // this.setState(
                        //     { isLoading: false, renderData: contactsData },
                        //     console.log(
                        //         'this is data of contacts',
                        //         this.state.renderData
                        //     )
                        // )
                    }
                }
            } catch (error) {
                console.log(
                    `${DEBUGKEY} this is the error while getting Contacts`,
                    error.message
                )
            }
        }, 2000)
    }

    handleLoadMore = async () => {
        this.setState({
            flatListData: [
                ...this.state.flatListData,
                renderData.slice(
                    this.state.currentPage * this.state.itemPerPage,
                    (this.state.currentPage + 1) * this.state.itemPerPage
                ),
            ], // concat the old and new data together
            currentPage: this.state.currentPage + 1,
            isLoading: true,
        })
    }

    selectItem = (id) => {
        let flatListData = [...this.state.flatListData]
        for (let item of flatListData) {
            if (item.id == id) {
                item.isSelected =
                    item.isSelected == null ? true : !item.isSelected
                break
            }
        }
        this.setState({ flatListData })
    }

    render() {
        const getSelectedData = this.state.renderData.filter((item) => {
            return item.isSelected
        })

        console.log(
            `${DEBUGKEY} this is all selected Contacts we want to send invite Message `,
            getSelectedData
        )

        const inviteLink = this.getInviteLink()

        const renderUser = (item) => (
            <TouchableOpacity
                onPress={() => this.selectItem(item.id)}
                style={{ justifyContent: 'center', alignItems: 'center' }}
            >
                <View
                    style={{
                        backgroundColor: color.GM_CARD_BACKGROUND,

                        width: '80%',
                        marginTop: 5,

                        borderRadius: 5,
                        // flex: 1,
                        height: 80,

                        justifyContent: 'flex-start',
                    }}
                >
                    <View
                        style={{
                            marginTop: 5,
                            padding: 10,
                            marginHorizontal: 6,
                            flexDirection: 'column',
                        }}
                    >
                        <View style={{ flexDirection: 'column' }}>
                            <Text
                                style={{
                                    color: color.GM_BLUE,
                                    width: '100%',
                                    zIndex: 1,
                                    fontFamily: 'SFProDisplay-Semibold',
                                    fontSize: 17,
                                }}
                            >
                                {item.name}
                            </Text>
                        </View>

                        <View style={{ marginTop: 5 }}>
                            <Text
                                style={{
                                    color: '#696868',
                                    width: '100%',

                                    fontFamily: 'SFProDisplay-Regular',
                                    fontSize: 15,
                                }}
                            >
                                {item.number}
                            </Text>
                        </View>
                        {item.isSelected ? (
                            <>
                                <View
                                    style={{
                                        backgroundColor: color.GM_BLUE,
                                        height: 21,
                                        width: 21,
                                        position: 'absolute',

                                        right: 14,
                                        top: 18,
                                        borderRadius: 50,
                                    }}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        right: 17,
                                        top: 21,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Icon
                                        name="done"
                                        pack="material"
                                        style={{
                                            height: 15,
                                            tintColor: 'white',
                                        }}
                                    />
                                </View>
                            </>
                        ) : null}
                    </View>
                </View>
            </TouchableOpacity>
        )

        return (
            <>
                <SafeAreaView
                    style={{
                        flex: 1,
                        backgroundColor: color.PG_BACKGROUND,
                    }}
                >
                    {this.state.isLoading ? (
                        <ActivityIndicator
                            size="medium"
                            color="#42C0F5"
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        />
                    ) : (
                        <>
                            <FlatList
                                style={{ padding: 6 }}
                                data={this.state.flatListData}
                                style={{ flex: 1, height: screenHeight }}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => renderUser(item)}
                                ItemSeparatorComponent={() => (
                                    <View
                                        style={{
                                            borderWidth: 0.5,
                                            borderColor: '#F1EEEE',
                                        }}
                                    ></View>
                                )}
                                onEndReached={this.handleLoadMore}
                            />

                            <TouchableOpacity
                                style={{
                                    marginHorizontal: 100,
                                    left: 20,
                                    justifyContent: 'flex-end',
                                }}
                                onPress={async () => {
                                    try {
                                        const postData = await API.post(
                                            'secure/user/account/send-invite',
                                            {
                                                usersToinvite: getSelectedData,
                                                content: this.state
                                                    .inviteMessage,
                                                link: inviteLink,
                                            }
                                        )
                                        if (postData.status === 200) {
                                            Alert.alert(postData.message, '', [
                                                {
                                                    text: 'Ok',
                                                    onPress: () =>
                                                        Actions.pop(),
                                                },
                                            ])
                                        }
                                    } catch (error) {
                                        console.log('error', error.message)
                                    }
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: '#42C0F5',
                                        width: '80%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 30,
                                        borderColor: '#42C0F5',
                                        borderWidth: 2,
                                        borderRadius: 5,
                                        marginBottom: 10,
                                        top: 5,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontWeight: '500',
                                            fontSize: 12,
                                            fontStyle: 'SFProDisplay-Regular',
                                        }}
                                    >
                                        Send Invite Message
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </>
                    )}
                </SafeAreaView>
            </>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { token } = state.auth.user
    const { user } = state.user
    const { inviteCode } = user

    return {
        token,
        inviteCode,
    }
}

export default connect(mapStateToProps, null)(MessageToContactsModal)
