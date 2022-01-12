/** @format */

import React, { Component } from 'react'
import {
    View,
    Text,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ScrollView,
    SafeAreaView,
} from 'react-native'

import { color } from '../../../styles/basic'
import { Icon } from '@ui-kitten/components'
import { connect } from 'react-redux'
// import { SafeAreaView } from 'react-navigation'
import { TextInput } from 'react-native-paper'
import * as Contacts from 'expo-contacts'
import { ActivityIndicator } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'

import SearchBarHeader from '../../Common/Header/SearchBarHeader'

//MiddleWare to get the Invite Link
import { generateInvitationLink } from '../../../redux/middleware/utils'

//To get Stored Data in asyncStorage
import { getData } from '../../../store/storage'

import { api as API } from '../../../redux/middleware/api'
import * as _ from 'underscore'
import { Actions } from 'react-native-router-flux'

import { Image } from 'react-native-animatable'

const screenHeight = Dimensions.get('screen').height

const DEBUGKEY = ['Contacts Screen']

const HEADER_HEIGHT = 50

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
            friendsSearchText: '',
            pageSize: 40,
            pageOffset: 0,
            currentPagination: [],
            friendsFilteredData: [],
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
            const { status } = await Contacts.requestPermissionsAsync()
            console.log(
                `${DEBUGKEY} this is the Status of Contacts Permission`,
                status
            )
            try {
                if (status === 'granted') {
                    const { data } = await Contacts.getContactsAsync({
                        fields: [
                            Contacts.Fields?.Name,
                            Contacts.Fields?.PhoneNumbers,
                            Contacts.Fields?.Image,
                        ],
                        sort: Contacts.SortTypes.FirstName,
                    })

                    console.log(
                        `${DEBUGKEY} this is all Contacts we get from the device`,
                        data
                    )

                    if (data.length > 0) {
                        let contacts = []
                        data.map((item) => {
                            if (item.name && item.phoneNumbers) {
                                contacts.push({
                                    name: `${item?.name}`,
                                    number: item?.phoneNumbers[0],
                                    image: item?.imageAvailable
                                        ? item?.image.uri
                                        : null,
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
                                value: item?.name,
                                number: item?.number.number,
                                image: item?.image,
                                id: index,
                                // key: index.toString(),
                            }
                        })
                        let renderData = _.sortBy(allData, 'value')
                        console.log(
                            `${DEBUGKEY} this is sorted Contacts all Contacts `,
                            renderData
                        )

                        this.setState({
                            isLoading: false,
                            flatListData: renderData,
                        })
                    }
                } else if (status === 'denied') {
                    this.setState({ isLoading: false })
                    Alert.alert('Please give access of your Contacts')
                }
            } catch (error) {
                // this.setState({ isLoading: true })
                console.log(
                    `${DEBUGKEY} this is the error while getting Contacts`,
                    error.message
                )
            }
        }, 2000)
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

    searchFriends = (input) => {
        const { friendsSearchText } = this.state

        this.setState({ friendsSearchText: input })
        // this.setState({ input })

        let friendsFilteredData = this.state.flatListData.filter(function (
            item
        ) {
            return item.value.includes(input)
        })

        this.setState({ friendsFilteredData: friendsFilteredData })
    }

    renderProfileImage(item) {
        if (item == null) {
            return require('../../../asset/utils/defaultUserProfile.png')
        } else {
            return { uri: item }
        }
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

        const renderUser = ({ item }) => {
            // console.log('CONTACT ITEMS======>', item)
            return (
                <>
                    <TouchableOpacity
                        onPress={() => this.selectItem(item.id)}
                        style={{
                            width: '60%',
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: color.GM_CARD_BACKGROUND,

                                marginTop: 5,

                                borderRadius: 10,
                                // flex: 1,
                                height: 80,
                                marginHorizontal: 50,

                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                            }}
                        >
                            <View style={{ marginTop: 5 }}>
                                <Image
                                    source={this.renderProfileImage(item.image)}
                                    style={{
                                        height: 60,
                                        width: 60,
                                        borderRadius: 150 / 2,
                                        overflow: 'hidden',
                                    }}
                                />
                            </View>

                            <View
                                style={{
                                    marginTop: 5,
                                    padding: 10,
                                }}
                            >
                                <View style={{ flexDirection: 'column' }}>
                                    <Text
                                        style={{
                                            color: '#000000',
                                            width: '100%',
                                            zIndex: 1,
                                            fontFamily: 'SFProDisplay-Regular',
                                            fontSize: 18,
                                        }}
                                    >
                                        {/* {item.value} */}
                                        {item.value.length < 27
                                            ? `${item.value}`
                                            : `${item.substring(0, 26)}...`}
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

                                <View style={{ right: 100, bottom: 50 }}>
                                    <View
                                        style={{
                                            backgroundColor: item.isSelected
                                                ? color.GM_BLUE
                                                : 'transparent',
                                            height: 21,
                                            width: 22,

                                            position: 'absolute',
                                            left: 0,
                                            top: 15,
                                            borderRadius: 4,
                                            borderColor: item.isSelected
                                                ? 'transparent'
                                                : 'grey',
                                            borderWidth: 0.5,
                                        }}
                                    />
                                    <View
                                        style={{
                                            position: 'absolute',
                                            left: 2,
                                            top: 17,

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
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <View
                        style={{
                            width: '86%',
                            color: 'black',
                            marginHorizontal: 25,
                            borderColor: '#DADADA',

                            borderWidth: 0.5,
                        }}
                    />
                </>
            )
        }

        return (
            <>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: color.GM_CARD_BACKGROUND,
                    }}
                >
                    <SearchBarHeader title={'Contacts'} backButton />

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
                            <View
                                style={{
                                    justifyContent: 'center',
                                    marginTop: 10,
                                }}
                            >
                                <TextInput
                                    theme={{
                                        colors: {
                                            primary: color.GM_BLUE,
                                            underlineColor: 'transparent',
                                        },
                                    }}
                                    value={this.state.friendsSearchText}
                                    onChangeText={this.searchFriends}
                                    style={{
                                        backgroundColor: 'white',
                                        borderRadius: 5,
                                        borderWidth: 1,
                                        borderColor: 'lightgrey',
                                        width: '95%',
                                        height: 35,
                                        marginHorizontal: 10,

                                        // padding: 10,
                                    }}
                                    underlineColor={'transparent'}
                                    placeholder={'Search'}
                                    left={
                                        <TextInput.Icon
                                            name={() => (
                                                <MaterialIcons
                                                    name={'search'}
                                                    size={20}
                                                    color="grey"
                                                />
                                            )}
                                        />
                                    }
                                />
                            </View>

                            <FlatList
                                data={
                                    this.state.friendsFilteredData &&
                                    this.state.friendsFilteredData.length > 0
                                        ? this.state.friendsFilteredData
                                        : this.state.flatListData
                                }
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={(item) => renderUser(item)}
                                listKey={Math.random()
                                    .toString(36)
                                    .substr(2, 9)}
                                refreshing={this.state.isLoading}
                                ListEmptyComponent={
                                    this.props.refreshing ? null : (
                                        <View
                                            style={{
                                                height: 50,
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Text>No Contacts Found</Text>
                                        </View>
                                    )
                                }
                            />
                            <SafeAreaView>
                                <TouchableOpacity
                                    style={{}}
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
                                                Alert.alert(
                                                    postData.message,
                                                    '',
                                                    [
                                                        {
                                                            text: 'Ok',
                                                            onPress: () =>
                                                                Actions.pop(),
                                                        },
                                                    ]
                                                )
                                            }
                                        } catch (error) {
                                            console.log('error', error.message)
                                        }
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: '#42C0F5',
                                            width: '90%',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: 40,
                                            borderColor: '#42C0F5',
                                            borderWidth: 2,
                                            borderRadius: 5,

                                            marginHorizontal: 20,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontWeight: '500',
                                                fontSize: 12,
                                                // fontStyle:
                                                //     'SFProDisplay-Regular',
                                            }}
                                        >
                                            Send Invite Message
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </SafeAreaView>
                        </>
                    )}
                </View>
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
