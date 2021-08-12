/** @format */

// /** @format */

// import * as React from 'react'
// import { View } from 'react-native'
// import { NavigationContainer } from '@react-navigation/native'
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
// import MonthlyPicker from './Calender'
// import WeeklyPicker from './DaySlot'

// function HomeScreen(props) {
//     return (
//         <View
//             style={{ backgroundColor: 'white', flex: 1, alignSelf: 'center' }}
//         >
//             <WeeklyPicker
//             // weekDays={props.onSelectWeekDays}
//             // timSlot={props.onSelectTime}
//             />
//         </View>
//     )
// }

// function SettingsScreen({ onSelectTime }) {
//     return (
//         <View style={{ flex: 1, backgroundColor: 'white' }}>
//             <MonthlyPicker
//                 // startDate={props.onSelectStartDate}
//                 // endDate={props.onSelectEndDate}
//                 onTime={(value) => onSelectTime(value)}
//             />
//         </View>
//     )
// }

// const Tab = createMaterialTopTabNavigator()

// export default (props) => {
//     return (
//         <View style={{ flex: 1 }}>
//             <NavigationContainer>
//                 <Tab.Navigator
//                     sceneContainerStyle={{ backgroundColor: 'white' }}
//                     tabBarOptions={{
//                         activeTintColor: 'white',
//                         inactiveTintColor: 'black',
//                         tabStyle: {
//                             marginVertical: -8,
//                         },
//                         style: {
//                             alignSelf: 'center',
//                             width: 300,
//                             height: 30,
//                             borderRadius: 30,
//                             backgroundColor: '#F2F2F2',
//                         },
//                         indicatorStyle: {
//                             backgroundColor: '#42C0F5',
//                             height: 30,
//                             borderRadius: 30,
//                         },
//                         labelStyle: {
//                             fontSize: 15,
//                             fontWeight: 'bold',
//                         },
//                     }}
//                 >
//                     <Tab.Screen name="Weekly" component={HomeScreen} />
//                     <Tab.Screen
//                         name="Monthly"
//                         children={() => (
//                             <MonthlyPicker
//                                 onTime={(val) => props.onTimeSelect(val)}
//                                 endDate={(val) => props.onEndDate(val)}
//                                 startDate={(val) => props.onStartDate(val)}
//                             />
//                         )}
//                     />
//                 </Tab.Navigator>
//             </NavigationContainer>
//         </View>
//     )
// }
