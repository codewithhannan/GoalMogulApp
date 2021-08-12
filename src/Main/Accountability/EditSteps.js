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
import VerticalDots from '../../asset/icons/verticaldots.png'

// import { BackgroundImage } from "react-native-elements/dist/config";
let row = []
let prevOpenedRow
class EditSteps extends Component {
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
            <Swipeable
                ref={(ref) => (row[index] = ref)}
                // leftThreshold={80}
                // rightThreshold={40}
                // friction={2}
                renderRightActions={() => this.rightSwipeActions(item, index)}
                onSwipeableOpen={this.closeRow(index)}
            >
                <View
                    style={{
                        // flexDirection: 'row',
                        // justifyContent: 'flex-start',
                        paddingHorizontal: 20,
                        paddingVertical: 5,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <TouchableOpacity
                            onLongPress={drag}
                            // delayLongPress={-1000}
                        >
                            <Image
                                source={VerticalDots}
                                style={{
                                    width: 15,
                                    height: 15,
                                    resizeMode: 'contain',
                                }}
                            />
                        </TouchableOpacity>
                        <Text
                            style={{
                                fontSize: 15,
                                lineHeight: 30,
                            }}
                        >
                            {item.title}
                        </Text>
                    </View>
                    <View
                        style={{
                            height: 1,
                            width: '100%',
                            backgroundColor: '#607D8B',
                            marginVertical: 5,
                        }}
                    />
                </View>
            </Swipeable>
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
                            // marginVertical: 20,
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}
                    >
                        Edit Steps
                    </Text>
                </View>
                <View
                    style={{
                        width: 200,
                        height: 50,
                        // backgroundColor: "red",
                        // padding: 20,
                    }}
                >
                    <Text style={{ marginHorizontal: 20 }}>
                        Finish writing my book
                    </Text>
                </View>
                <View style={{ width: '100%', height: 180, marginVertical: 0 }}>
                    <DraggableFlatList
                        ref={(ref) => {
                            if (ref && ref.containerRef)
                                this.flatList = ref.flatlistRef.current
                        }}
                        data={this.state.arrayHolder}
                        // extraData={this.state.arrayHolder}
                        // ItemSeparatorComponent={this.FlatListItemSeparator}
                        renderItem={(item) => this.renderItem(item)}
                        keyExtractor={(item, index) => index.toString()}
                        onDragEnd={({ data }) => {
                            this.setState({ arrayHolder: data })
                        }}
                    />
                </View>
                <View
                    style={{
                        width: '100%',
                        // height: 30,
                        marginHorizontal: 20,
                        // marginVertical: 15
                    }}
                >
                    <Text style={{}}>
                        Add new Steps you're committed to talking:
                    </Text>
                </View>
                <TextInput
                    // clearButtonMode="always"
                    placeholder="What's something you should do?"
                    onChangeText={(data) =>
                        this.setState({ textInput_Holder: data })
                    }
                    // onChangeText={(text) => this.setState({ text })}
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
                        marginVertical: 15,
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
                        Confirm
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    MainContainer: {
        // justifyContent: "center",
        // alignItems: "center",
        flex: 1,
        // margin: 2,
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

export default EditSteps
