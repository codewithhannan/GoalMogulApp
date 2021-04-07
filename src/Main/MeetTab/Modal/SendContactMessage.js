/** @format */

import React, { Component } from 'react'
import {
    View,
    Image,
    Text,
    Dimensions,
    FlatList,
    TouchableOpacity,
} from 'react-native'
import Checkbox from 'expo-checkbox'
import { color, default_style } from '../../../styles/basic'
import { Icon } from '@ui-kitten/components'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-navigation'
import { generateInvitationLink } from '../../../redux/middleware/utils'
import * as Contacts from 'expo-contacts'
import { getData } from '../../../store/storage'
import { ActivityIndicator } from 'react-native-paper'
import { api as API } from '../../../redux/middleware/api'

const screenWidth = Dimensions.get('screen').width
const screenHeight = Dimensions.get('screen').height

const Data = [
    {
        id: 1,
        first_name: 'Sile',
    },
    {
        id: 2,
        first_name: 'Clementia',
    },
    {
        id: 3,
        first_name: 'Brita',
    },
    {
        id: 4,
        first_name: 'Duke',
    },
    {
        id: 5,
        first_name: 'Hedvig',
    },
    {
        id: 6,
        first_name: 'Paulie',
    },
    {
        id: 7,
        first_name: 'Munmro',
    },
    {
        id: 8,
        first_name: 'Dyanna',
    },
    {
        id: 9,
        first_name: 'Shanta',
    },
    {
        id: 10,
        first_name: 'Bambi',
    },
]

class MessageToContactsModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            renderData: [],
            isLoading: true,
            selectedItems: [],
            inviteMessage: '',
        }
    }

    getInviteLink = () => {
        return generateInvitationLink(this.props.inviteCode)
    }

    async componentDidMount() {
        const getInviteMessage = await getData('INVITEMESSAGE')

        this.setState({ inviteMessage: getInviteMessage })
        console.log('this is get invite', getInviteMessage)

        const { status } = await Contacts.requestPermissionsAsync()
        console.log('status', status)

        try {
            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.PhoneNumbers],
                })

                console.log('data of contacts', data)

                if (data.length > 0) {
                    const contactsData = data.map((data, index) => {
                        return {
                            name: data.firstName,
                            number: data.phoneNumbers[0].number,
                            id: index,
                        }
                    })

                    this.setState({ renderData: contactsData, loading: false })

                    // Actions.push('ContactMessage')

                    console.log(
                        `This is the response of getting all contacts`,
                        contactsData
                    )
                }
            }
        } catch (error) {
            console.log(
                ` This is the error of getting conatacts `,
                error.message
            )
        }
    }

    // let newData = [...this.state.renderData]

    // const data = newData.map((newItem) => {
    //     if (newItem.id == id) {
    //         return {
    //             ...newItem,
    //             isSelected: true,
    //         }
    //     }
    //     return {
    //         ...newItem,
    //         isSelected: false,
    //     }
    // })
    // this.setState({ renderData: data })

    selectItem = (id) => {
        let renderData = [...this.state.renderData]
        for (let item of renderData) {
            if (item.id == id) {
                item.isSelected =
                    item.isSelected == null ? true : !item.isSelected
                break
            }
        }
        this.setState({ renderData })
    }

    // const index = newData.findIndex((item) => item.id == id)
    // console.log('indeexxx', index)
    // newData[index].isSelected = true
    // this.setState({ renderData: newData }, () => {
    //     console.log('state update horai ha', newData)
    //     console.log('state update horai ha1', this.state.renderData)
    // })

    render() {
        const getSelectedData = this.state.renderData.filter((item) => {
            return item.isSelected
        })

        console.log('getSelectedData', getSelectedData)

        const inviteLink = this.getInviteLink()

        console.log('this is inviteCode', inviteLink)

        const renderUser = (item) => (
            <TouchableOpacity onPress={() => this.selectItem(item.id)}>
                <View
                    style={{
                        backgroundColor: color.GM_CARD_BACKGROUND,

                        // width: '100%',
                        marginTop: 5,

                        borderRadius: 5,
                        flex: 1,
                        height: 80,
                        justifyContent: 'flex-start',

                        justifyContent: 'space-around',
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

        // console.log('this is cpontats', this.props.contacts)
        return (
            <>
                <SafeAreaView
                    style={{
                        flex: 1,
                        backgroundColor: color.PG_BACKGROUND,
                    }}
                >
                    {this.state.loading ? (
                        <ActivityIndicator />
                    ) : (
                        <>
                            <View
                                style={{
                                    marginTop: 50,
                                    // alignItems: 'center',
                                }}
                            >
                                <FlatList
                                    style={{ padding: 6 }}
                                    data={this.state.renderData}
                                    // style={{ height: screenHeight * 0.7 }}
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
                                />
                            </View>

                            <TouchableOpacity
                                style={{ marginHorizontal: 100, left: 20 }}
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
                                        console.log(
                                            'POST DATA RESPONSE',
                                            postData
                                        )
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
                                        height: 40,
                                        borderColor: '#42C0F5',
                                        borderWidth: 2,
                                        borderRadius: 7,
                                        marginTop: 20,
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

    // const { contacts } = state.contacts
    // console.log('contactss', contacts)

    return {
        token,
        inviteCode,
        // contacts,
    }
}

export default connect(mapStateToProps, null)(MessageToContactsModal)
