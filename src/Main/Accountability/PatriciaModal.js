/** @format */

// /** @format */

// import React, { useState, useEffect } from 'react'
// import {
//     Button,
//     Text,
//     View,
//     Image,
//     TouchableOpacity,
//     Dimensions,
// } from 'react-native'
// import Modal from 'react-native-modal'
// import Patricia from './Patricia'

// // const windowWidth = Dimensions.get("window").width;
// // const height = Dimensions.get("screen").height;

// function PatriciaModal() {
//     const [isModalVisible, setModalVisible] = useState(false)
//     // const [isVisible, setIsVisible] = useState(true);

//     const toggleModal = (props) => {
//         setModalVisible(!isModalVisible)
//     }

//     return (
//         <View
//             style={{
//                 // marginRight: 30,
//                 backgroundColor: 'gray',
//                 flex: 1,
//                 backgroundColor: 'white',
//                 // opacity: 0.7,

//                 // backgroundColor: "transparent",
//                 justifyContent: 'center',
//             }}
//         >
//             <Button title="Show modal" onPress={toggleModal} />

//             <Modal
//                 transparent
//                 isVisible={isModalVisible}
//                 animationType="slide"
//                 swipeDirection="down"
//                 onSwipeComplete={() => setModalVisible(false)}
//                 style={{
//                     marginRight: 0.1,
//                     marginLeft: 0.1,
//                     backgroundColor: 'transparent',
//                 }}
//             >
//                 <View
//                     style={{
//                         flex: 1,
//                         backgroundColor: 'white',
//                         marginTop: 100,
//                         // width: 200,
//                         height: '30%',
//                         // aspectRatio: 1 / 2,

//                         // height: height * 0.6,
//                     }}
//                 >
//                     <TouchableOpacity
//                         style={{
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                         }}
//                         onPress={toggleModal}
//                     >
//                         <Image
//                             style={{
//                                 width: 40,
//                                 height: 10,
//                             }}
//                             source={require('../assets/line.jpg')}
//                         />
//                         <Image
//                             style={{
//                                 width: 40,
//                                 height: 10,
//                                 marginLeft: 330,
//                             }}
//                             source={require('../assets/download.png')}
//                         />
//                     </TouchableOpacity>

//                     <Patricia />
//                 </View>
//             </Modal>
//         </View>
//     )
// }
// export default PatriciaModal
