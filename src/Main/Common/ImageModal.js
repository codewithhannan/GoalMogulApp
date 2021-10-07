/** @format */

import * as FileSystem from 'expo-file-system'
import React from 'react'
import {
    Alert,
    Dimensions,
    Image,
    Platform,
    TouchableOpacity,
    View,
} from 'react-native'
import CameraRoll from '@react-native-community/cameraroll'
import * as ImagePicker from 'expo-image-picker'
import ImageViewer from 'react-native-image-zoom-viewer'
import Modal from 'react-native-modal'
// Assets
import cancel from '../../asset/utils/cancel_no_background.png'
// Constants
import { IMAGE_BASE_URL } from '../../Utils/Constants'

const { width, height } = Dimensions.get('window')

const DEBUG_KEY = '[ UI ImageModal ]'

class ImageModal extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        if (
            this.props.mediaRef !== nextProps.mediaRef ||
            this.props.mediaModal !== nextProps.mediaModal
        ) {
            return true
        }
        // No need to re-render if mediaRef is the same
        return false
    }
    async saveToCameraRoll() {
        // const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        const {
            status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
            return Alert.alert(
                'Denied',
                "Enable sharing photos in your phone's settings to continue..."
            )
        }

        let urlToRender = this.props.mediaRef
        if (!urlToRender.includes(IMAGE_BASE_URL) && !this.props.isLocalFile) {
            urlToRender = `${IMAGE_BASE_URL}${urlToRender}`
        }

        if (Platform.OS === 'android') {
            FileSystem.downloadAsync(
                urlToRender,
                `${FileSystem.cacheDirectory}saveChatImage/${toHashCode(
                    urlToRender
                )}`
            ).then((res) => {
                CameraRoll.save(res.path()).then(
                    Alert.alert('Saved', 'Photo saved to camera roll')
                )
            })
        } else {
            CameraRoll.save(urlToRender).then(
                Alert.alert('Saved', 'Photo saved to camera roll')
            )
        }
    }

    closeModal() {
        this.props.closeModal && this.props.closeModal()
    }

    render() {
        if (!this.props.mediaRef) return null

        let urlToRender = this.props.mediaRef
        if (!urlToRender.includes(IMAGE_BASE_URL) && !this.props.isLocalFile) {
            urlToRender = `${IMAGE_BASE_URL}${urlToRender}`
        }

        return (
            <Modal
                backdropColor={'transparent'}
                isVisible={this.props.mediaModal}
                backdropOpacity={1}
                onSwipeComplete={this.closeModal.bind(this)}
                swipeDirection="down"
                deviceWidth={width}
                style={{
                    padding: 0,
                    margin: 0,
                }}
            >
                <ImageViewer
                    imageUrls={[
                        {
                            url: urlToRender,
                        },
                    ]}
                    renderIndicator={() => null}
                    enableSwipeDown={true}
                    onCancel={this.closeModal.bind(this)}
                    menuContext={{
                        saveToLocal: 'Save to Photos',
                        cancel: 'Cancel',
                    }}
                    onSave={this.saveToCameraRoll.bind(this)}
                    swipeDownThreshold={150}
                />
            </Modal>
        )

        // return (
        //     <Modal
        //         backdropColor={'black'}
        //         isVisible={this.props.mediaModal}
        //         backdropOpacity={1}
        //         onSwipe={() => this.closeModal()}
        //         swipeDirection="down"
        //         style={{ flex: 1 }}
        //         deviceWidth={width}
        //     >
        //         <View
        //             style={{
        //                 flex: 1,
        //                 alignItems: 'center',
        //                 justifyContent: 'center',
        //             }}
        //         >
        //             <TouchableOpacity
        //                 activeOpacity={0.6}
        //                 onPress={() => {
        //                     this.closeModal()
        //                 }}
        //                 style={{
        //                     position: 'absolute',
        //                     top: 5,
        //                     left: 5,
        //                     padding: 10,
        //                     zIndex: 2,
        //                 }}
        //             >
        //                 <Image
        //                     source={cancel}
        //                     style={{
        //                         ...styles.cancelIconStyle,
        //                         tintColor: 'white',
        //                     }}
        //                 />
        //             </TouchableOpacity>
        //             <TouchableOpacity
        //                 activeOpacity={0.8}
        //                 onLongPress={this.saveToCameraRoll.bind(this)}
        //             >
        //                 <Image
        //                     source={{ uri: urlToRender }}
        //                     style={{ width, height }}
        //                     resizeMode="contain"
        //                 />
        //             </TouchableOpacity>
        //         </View>
        //     </Modal>
        // )
    }
}

ImageModal.defaultPros = {}

const styles = {
    cancelIconStyle: {
        height: 20,
        width: 20,
        justifyContent: 'flex-end',
    },
    imageContainerStyle: {
        borderWidth: 0.5,
        padding: 1.5,
        borderColor: 'lightgray',
        alignItems: 'center',
        borderRadius: 6,
        alignSelf: 'flex-start',
        backgroundColor: 'white',
    },
}

export default ImageModal
