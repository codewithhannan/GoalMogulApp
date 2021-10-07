/** @format */

import React, { Component } from 'react'
import {
    View,
    FlatList,
    TouchableOpacity,
    Text,
    Image,
    Alert,
    StyleSheet,
    SafeAreaView,
} from 'react-native'
import _ from 'lodash'
import { Actions } from 'react-native-router-flux'
import { Icon } from '@ui-kitten/components'
import { TextInput } from 'react-native-paper'
import { ActivityIndicator } from 'react-native-paper'
// import { SafeAreaView } from 'react-navigation'
import { MaterialIcons } from '@expo/vector-icons'
import { connect } from 'react-redux'

import { color } from '../../../../styles/basic'
import { IMAGE_BASE_URL } from '../../../../Utils/Constants'
import SearchBarHeader from '../../../Common/Header/SearchBarHeader'
import UserCard from './UserCard'
import SendContactMessage from '../../../MeetTab/Modal/SendContactMessage'

import { getNewCommentByTab } from '../../../../redux/modules/feed/comment/CommentSelector'
import { arrayUnique } from '../../../../reducers/MeetReducers'
import {
    handleSearch,
    clearSearchState,
    refreshSearchResult,
    onLoadMore,
    refreshPreloadData,
    loadMorePreloadData,
} from '../../../../redux/modules/feed/comment/SuggestionSearchActions'

class FriendsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            renderData: [],
            isLoading: false,
            currentPage: 1,
            inviteMessage: '',
            itemPerPage: 4000,
            flatListData: [],
            friendsSearchText: '',
            pageSize: 40,
            pageOffset: 0,
            imageUrl: '',
            currentPagination: [],
            selectedItem: null,
            friendsFilteredData: [],
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true })

        const filteredData = this.props.userFriends.map((item) => {
            return {
                id: item._id,
                name: item.name,
                image: item.profile.image,
            }
        })

        this.setState({ flatListData: filteredData })

        this.setState({ isLoading: false })
    }

    searchFriends = (input) => {
        const { friendsSearchText } = this.state

        this.setState({ friendsSearchText: input })

        let friendsFilteredData = this.state.flatListData.filter(function (
            item
        ) {
            return item.name.includes(input)
        })

        this.setState({ friendsFilteredData: friendsFilteredData })
    }

    renderProfileImage(item) {
        if (item == null) {
            return require('../../../../asset/utils/defaultUserProfile.png')
        } else {
            return { uri: `${IMAGE_BASE_URL}${item}` }
        }
    }

    render() {
        const RenderUser = ({ item, onPress, checked }) => {
            console.log('item===>', item)
            return (
                <>
                    <View style={styles.itemContainer}>
                        <TouchableOpacity
                            onPress={onPress}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <View
                                style={[
                                    styles.itemSelected,
                                    {
                                        backgroundColor: checked
                                            ? color.GM_BLUE
                                            : 'transparent',
                                        borderColor: checked
                                            ? 'transparent'
                                            : 'grey',
                                    },
                                ]}
                            />
                            <View style={styles.iconContainer}>
                                <Icon
                                    name="done"
                                    pack="material"
                                    style={{
                                        height: 20,
                                        tintColor: 'white',
                                    }}
                                />
                            </View>
                            <View
                                style={{
                                    marginHorizontal: 5,
                                    paddingRight: 10,
                                }}
                            >
                                <Image
                                    source={this.renderProfileImage(
                                        item.item.image
                                    )}
                                    style={{
                                        height: 40,
                                        width: 40,
                                        borderRadius: 150 / 2,
                                        overflow: 'hidden',
                                    }}
                                />
                            </View>
                            <Text
                                style={{
                                    color: '#000000',
                                    width: '100%',
                                    zIndex: 1,
                                    fontFamily: 'SFProDisplay-Regular',
                                    fontSize: 16,
                                }}
                            >
                                {item.item.name}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.separator} />
                </>
            )
        }

        const { selectedItem } = this.state
        return (
            <View
                style={{ flex: 1, backgroundColor: color.GM_CARD_BACKGROUND }}
            >
                <SearchBarHeader title={'Friends'} backButton />
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
                                marginVertical: 15,
                            }}
                        >
                            <TextInput
                                theme={{
                                    colors: {
                                        primary: 'grey',
                                        underlineColor: 'transparent',
                                    },
                                }}
                                value={this.state.friendsSearchText}
                                onChangeText={this.searchFriends}
                                style={styles.search}
                                underlineColor={'transparent'}
                                placeholder={'Search'}
                                placeholderTextColor={'lightgray'}
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
                        <View style={styles.subTitle}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                All Friends
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.separator,
                                { width: '110%', alignSelf: 'center' },
                            ]}
                        />
                        <FlatList
                            data={
                                this.state.friendsFilteredData &&
                                this.state.friendsFilteredData.length > 0
                                    ? this.state.friendsFilteredData
                                    : this.state.flatListData
                            }
                            renderItem={(item) => (
                                <RenderUser
                                    item={item}
                                    checked={item.item.id === selectedItem}
                                    onPress={() =>
                                        this.setState({
                                            selectedItem: item.item.id,
                                        })
                                    }
                                />
                            )}
                            listKey={Math.random().toString(36).substr(2, 9)}
                            refreshing={this.state.isLoading}
                            ListEmptyComponent={
                                this.props.refreshing ? null : (
                                    <View style={styles.emtypList}>
                                        <Text>No Friends Found</Text>
                                    </View>
                                )
                            }
                        />
                        <SafeAreaView>
                            <TouchableOpacity
                                style={{}}
                                onPress={async () => {}}
                            >
                                <View style={styles.buttonContainer}>
                                    <Text style={styles.buttonText}>Done</Text>
                                </View>
                            </TouchableOpacity>
                        </SafeAreaView>
                    </>
                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    itemContainer: {
        backgroundColor: color.GM_CARD_BACKGROUND,
        marginTop: 5,
        borderRadius: 10,
        height: 50,
        // marginHorizontal: 50,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    },
    profileImage: {
        height: 40,
        width: 40,
        borderRadius: 150 / 2,
        overflow: 'hidden',
    },
    itemText: {
        color: '#000000',
        width: '100%',
        zIndex: 1,
        fontFamily: 'SFProDisplay-Regular',
        fontSize: 18,
    },
    itemNUmber: {
        color: '#696868',
        width: '100%',
        fontFamily: 'SFProDisplay-Regular',
        fontSize: 15,
    },
    iconContainer: {
        position: 'absolute',
        left: 16,
        bottom: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemSelected: {
        height: 22,
        width: 22,
        marginHorizontal: 15,
        // position: 'absolute',
        // left: 0,
        // top: 15,
        borderRadius: 4,
        borderWidth: 0.5,
    },
    separator: {
        width: '80%',
        marginLeft: 60,
        marginVertical: 5,
        // alignSelf: 'center',
        // marginHorizontal: 55,
        borderColor: '#d3d3d3',
        borderWidth: 0.5,
    },
    search: {
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'lightgrey',
        width: '95%',
        height: 35,
        marginHorizontal: 10,
    },
    emtypList: {
        height: 50,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subTitle: {
        marginVertical: 15,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        backgroundColor: '#42C0F5',
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        borderColor: '#42C0F5',
        borderWidth: 2,
        borderRadius: 5,
        marginHorizontal: 20,
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        // fontStyle: 'SFProDisplay-Regular',
    },
})

const mapStateToProps = (state, props) => {
    const { data } = state.meet.friends

    return {
        userFriends: data,
    }
}

// const mapStateToProps = (state, props) => {
//     // const { suggestionType, selectedItem } = getNewCommentByTab(
//     //     state,
//     //     props.pageId
//     // ).tmpSuggestion
//     const {
//         searchRes,
//         searchContent,
//         preloadData,
//         searchType,
//     } = state.suggestionSearch
//     const { data, loading, refreshing, hasNextPage } = searchRes

//     let dataToRender = data
//     let refreshingToUse = refreshing
//     let loadingToUse = loading
//     if (_.has(preloadData, searchType)) {
//         // Get the preloaded data with the right path
//         // e.g. User.data, Event.data...
//         const preloadDataToRender = _.get(preloadData, `${searchType}.data`)
//         const preloadDataLoadingState = _.get(
//             preloadData,
//             `${searchType}.loading`
//         )
//         const preloadDataRefreshingState = _.get(
//             preloadData,
//             `${searchType}.refreshing`
//         )

//         if (searchContent === undefined || searchContent.trim() === '') {
//             // Use preload data when searchContent is empty
//             dataToRender = preloadDataToRender
//             refreshingToUse = preloadDataRefreshingState
//         } else if (hasNextPage === false) {
//             // Data concat with preload data when hasNextPage is false
//             dataToRender = arrayUnique(data.concat(preloadDataToRender))
//             loadingToUse = preloadDataLoadingState
//         }
//     }

//     return {
//         // suggestionType,
//         data: dataToRender,
//         loading: loadingToUse,
//         refreshing: refreshingToUse,
//         searchContent,
//         // selectedItem,
//         searchType,
//         hasNextPage, // For handleLoadMore to determine whether to load more preload data or search data
//     }
// }

export default connect(mapStateToProps, null)(FriendsList)
