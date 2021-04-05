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
import { color, default_style } from '../../../styles/basic'
import { Icon } from '@ui-kitten/components'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-navigation'

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
            renderData: Data,
        }
    }

    selectItem = (id) => {
        let renderData = [...this.state.renderData]
        for (let item of renderData) {
            if (item.id == id) {
                item.isSelected = !item.isSelected
                break
            }
        }
        this.setState({ renderData }, () =>
            console.log('state set hiorai ha', renderData)
        )
    }

    render() {
        const renderUser = (item) => (
            <TouchableOpacity onPress={() => this.selectItem(item.id)}>
                <View
                    style={{
                        backgroundColor: color.GM_CARD_BACKGROUND,

                        // width: '100%',
                        marginTop: 5,
                        borderRadius: 5,
                        flex: 1,

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
                                {item.first_name}
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

        console.log('this is cpontats', this.props.contacts)
        return (
            <>
                <SafeAreaView
                    style={{
                        flex: 1,
                        backgroundColor: color.PG_BACKGROUND,
                    }}
                >
                    <View
                        style={{
                            width: '90%',
                            marginHorizontal: 20,
                            paddingHorizontal: 20,
                            borderRadius: 10,
                        }}
                    >
                        <View
                            style={{
                                height: screenHeight,
                                flexDirection: 'row',
                            }}
                        >
                            <ScrollView style={{ flex: 1 }}>
                                <View
                                    style={
                                        {
                                            // marginHorizontal: 30,
                                        }
                                    }
                                >
                                    <FlatList
                                        style={{ padding: 6 }}
                                        data={this.state.renderData}
                                        extraData={
                                            (this.state.selectedId, // for single item
                                            this.state.selectedIds) // for multiple items
                                        }
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item }) =>
                                            renderUser(item)
                                        }
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
                            </ScrollView>
                        </View>
                    </View>
                </SafeAreaView>
            </>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { token } = state.auth.user

    const { contacts } = state.contacts
    console.log('contactss', contacts)

    return {
        token,
        contacts,
    }
}

export default connect(mapStateToProps, null)(MessageToContactsModal)
