/** @format */

import React, { Component } from 'react'
import {
    StyleSheet,
    // FlatList,
    Text,
    View,
    Alert,
    Image,
    TouchableOpacity,
    TextInput,
    AppRegistry,
    BackgroundImage,
} from 'react-native'
import DraggableFlatList from 'react-native-draggable-flatlist'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import Trash from '../../asset/icons/trash.png'
import VerticalDots from '../../asset/icons/delete.png'

let row = []
let prevOpenedRow
class FinishingEdit extends Component {
    constructor(props) {
        super(props)

        this.state = {
            arrayHolder: [],

            textInput_Holder: '',
        }
        this.refsArray = []
    }

    joinData = () => {
        const demeArray = this.state.arrayHolder
        demeArray.push({
            title: this.state.textInput_Holder,
            id: Math.random() * 100,
        })

        this.setState({
            arrayHolder: demeArray,
        })
        this.setState({ textInput_Holder: '' })
    }

    handleDelete = (item, index) => {
        const filteredData = this.state.arrayHolder.filter(
            (i) => i.id !== item.id
        )

        this.setState({ arrayHolder: filteredData })
        prevOpenedRow.close()
    }

    FlatListItemSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: '#607D8B',
                }}
            />
        )
    }

    rightSwipeActions = (item, index) => {
        return (
            <View
                style={{
                    backgroundColor: '#FF5757',
                    height: 50,

                    justifyContent: 'center',
                }}
            >
                <TouchableOpacity
                    onPress={() => this.handleDelete(item, index)}
                >
                    <Image
                        resizeMode="contain"
                        source={Trash}
                        style={{
                            marginHorizontal: 15,
                            width: 35,
                            height: 35,
                        }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    closeRow = (index) => {
        if (prevOpenedRow && prevOpenedRow !== row[index]) {
            prevOpenedRow.close()
        }
        prevOpenedRow = row[index]
    }

    renderItem = ({ item, drag, isActive, index }) => {
        return (
            <View
                style={{
                    paddingHorizontal: 20,
                    marginTop: 10,
                    borderWidth: 1,
                    width: '90%',
                    height: 47,
                    borderRadius: 5,
                    alignSelf: 'center',
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        // alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            // backgroundColor: 'red',
                            width: 270,
                            fontSize: 15,
                            lineHeight: 40,
                        }}
                    >
                        {item.title}
                    </Text>
                    <TouchableOpacity
                        onPress={() => this.handleDelete(item, index)}
                        style={{}}
                    >
                        <Image
                            source={VerticalDots}
                            style={{
                                width: 20,
                                height: 20,
                                marginTop: 10,
                                resizeMode: 'contain',
                            }}
                        />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        width: '100%',
                        backgroundColor: '#607D8B',
                        marginVertical: 5,
                    }}
                />
            </View>
        )
    }

    render() {
        return (
            <View style={styles.MainContainer}>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            marginVertical: 20,
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: '#42C0F5',
                            // width: 250,
                            // height: 21,
                        }}
                    >
                        Finishing writing my book
                    </Text>
                </View>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}
                    >
                        Edit Steps
                    </Text>
                </View>

                <View style={{ width: '100%', height: 180, marginVertical: 0 }}>
                    <DraggableFlatList
                        ref={(ref) => {
                            if (ref && ref.containerRef)
                                this.flatList = ref.flatlistRef.current
                        }}
                        data={this.state.arrayHolder}
                        renderItem={(item) => this.renderItem(item)}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}
                    >
                        Add New Steps
                    </Text>
                </View>

                <TextInput
                    placeholder="Something to make progress"
                    onChangeText={(data) =>
                        this.setState({ textInput_Holder: data })
                    }
                    // clearTextOnFocus="true"
                    value={this.state.textInput_Holder}
                    // enablesReturnKeyAutomatically="true"
                    style={{
                        padding: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: 15,
                        width: '90%',
                        borderRadius: 5,

                        alignSelf: 'center',
                        height: 50,
                        borderWidth: 1,
                    }}
                    underlineColorAndroid="transparent"
                />

                <TouchableOpacity
                    onPress={this.joinData}
                    activeOpacity={0.7}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        //   marginVertical: 1,
                        width: '90%',
                        borderRadius: 5,
                        alignSelf: 'center',
                        height: 50,

                        borderWidth: 1,
                        borderColor: '#45C9F6',
                    }}
                >
                    <Text
                        style={{
                            justifyContent: 'center',
                            textAlign: 'center',
                            color: '#45C9F6',
                            fontSize: 20,
                        }}
                    >
                        + Add Steps
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    // onPress={() => }
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: 90,
                        width: '90%',
                        borderRadius: 5,
                        alignSelf: 'center',
                        height: 40,
                        backgroundColor: '#45C9F6',
                    }}
                >
                    <Text
                        style={{
                            justifyContent: 'center',
                            textAlign: 'center',
                            color: '#fff',
                            fontSize: 20,
                            // marginTop: 4,
                        }}
                    >
                        Save
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
    },

    item: {
        padding: 10,
        fontSize: 18,
        // height: 44,
    },

    textInputStyle: {
        textAlign: 'center',
        height: 40,
        width: '90%',
        borderWidth: 1,
        borderColor: '#4CAF50',
        borderRadius: 7,
        marginTop: 12,
    },

    button: {
        width: '90%',
        height: 40,
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        marginTop: 10,
    },

    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
})

export default FinishingEdit
