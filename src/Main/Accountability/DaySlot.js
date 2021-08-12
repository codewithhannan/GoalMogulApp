/** @format */

// /** @format */

// import React, { useState, useEffect } from 'react'
// import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
// import DateTimePickerModal from 'react-native-modal-datetime-picker'
// import moment from 'moment'
// import DayButton from './DayButton'

// // const days = [
// //   { letter: "M", word: "monday" },
// //   { letter: "T", word: "tuesday" },
// //   { letter: "W", word: "wednesday" },
// //   { letter: "T", word: "thursday" },
// //   { letter: "F", word: "friday" },
// //   { letter: "S", word: "saturday" },
// //   { letter: "S", word: "sudnay" },
// // ];

// function BookingSlot({ onSelect, value = [] }) {
//     const [mode, setMode] = useState('time')
//     const [show, setShow] = useState(false)
//     const [date, setDate] = useState()
//     const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

//     const showDatePicker = () => {
//         setDatePickerVisibility(true)
//     }

//     const hideDatePicker = () => {
//         setDatePickerVisibility(false)
//     }

//     const handleConfirm = (date) => {
//         console.log('A date has been picked: ', date)
//         setDate(date)
//         hideDatePicker()
//     }
//     const [isPickerShow, setIsPickerShow] = useState(false)
//     const [time, setTime] = useState(null)

//     const [selectedDays, setSelectedDays] = useState([])
//     const [days, setDays] = useState([
//         { letter: 'Sun', word: 'sunday', selected: value.includes('sunday') },

//         { letter: 'Mon', word: 'monday', selected: value.includes('monday') },
//         { letter: 'Tue', word: 'tuesday', selected: value.includes('tuesday') },
//         {
//             letter: 'Wed',
//             word: 'wednesday',
//             selected: value.includes('wednesday'),
//         },
//         {
//             letter: 'Thu',
//             word: 'thursday',
//             selected: value.includes('thursday'),
//         },
//         { letter: 'Fri', word: 'friday', selected: value.includes('friday') },
//         {
//             letter: 'Sat',
//             word: 'saturday',
//             selected: value.includes('saturday'),
//         },
//     ])

//     // useEffect(() => {
//     //   onSelect(selectedDays);
//     // }, [selectedDays]);

//     useEffect(() => {
//         if (value.includes('monday')) {
//             let tmp = [...selectedDays]
//             tmp.push('monday')
//             setSelectedDays(tmp)
//         }
//         if (value.includes('tuesday')) {
//             let tmp = [...selectedDays]
//             tmp.push('tuesday')
//             setSelectedDays(tmp)
//         }
//         if (value.includes('wednesday')) {
//             let tmp = [...selectedDays]
//             tmp.push('wednesday')
//             setSelectedDays(tmp)
//         }
//         if (value.includes('thursday')) {
//             let tmp = [...selectedDays]
//             tmp.push('thursday')
//             setSelectedDays(tmp)
//         }
//         if (value.includes('friday')) {
//             let tmp = [...selectedDays]
//             tmp.push('friday')
//             setSelectedDays(tmp)
//         }
//         if (value.includes('saturday')) {
//             let tmp = [...selectedDays]
//             tmp.push('saturday')
//             setSelectedDays(tmp)
//         }
//         if (value.includes('sunday')) {
//             let tmp = [...selectedDays]
//             tmp.push('sunday')
//             setSelectedDays(tmp)
//         }
//     }, [])

//     function onDaySelect(selectedDay) {
//         console.log('day', selectedDay)
//         let tmp = [...selectedDays]
//         tmp.push(selectedDay)
//         setSelectedDays(tmp)
//     }
//     function onDayUnselect(selectedDay) {
//         let tmp = [...selectedDays]
//         let index = tmp.findIndex((day) => day == selectedDay)
//         tmp.splice(index, 1)
//         setSelectedDays(tmp)
//     }

//     const handleDateDay = (selectedDay) => {
//         let tmp = [...selectedDays]
//         tmp.push(selectedDay)
//         setSelectedDays(tmp)
//         console.log('selecte days', tmp)
//         console.log('selected time is:', date)
//         // console.log(" selected day", selectedDay);
//     }

//     return (
//         <View style={{ flex: 1, marginVertical: 25 }}>
//             <Text
//                 style={{
//                     fontSize: 18,
//                     fontWeight: '600',
//                     textAlign: 'center',
//                 }}
//             >
//                 On these days
//             </Text>
//             <View style={styles.timeSlot}>
//                 {days.map((day, index) => {
//                     return (
//                         <View key={index} style={styles.container}>
//                             <DayButton
//                                 day={day}
//                                 onDaySelect={onDaySelect}
//                                 onDayUnselect={onDayUnselect}
//                             />
//                         </View>
//                     )
//                 })}
//             </View>
//             <View
//                 style={{
//                     width: '95%',
//                     height: 1,
//                     backgroundColor: 'lightgray',
//                     alignSelf: 'center',
//                     marginVertical: 10,
//                 }}
//             />

//             <View
//                 style={{
//                     // marginTop: -90,
//                     justifyContent: 'flex-start',
//                     flexDirection: 'row',
//                 }}
//             >
//                 <DateTimePickerModal
//                     isVisible={isDatePickerVisible}
//                     mode="time"
//                     onConfirm={handleConfirm}
//                     onCancel={hideDatePicker}
//                 />
//                 <TouchableOpacity onPress={showDatePicker}>
//                     <View
//                         style={{
//                             width: 100,
//                             height: 40,
//                             marginLeft: 25,
//                             borderWidth: 1,
//                             borderRadius: 5,
//                             marginTop: 10,
//                             marginRight: -10,
//                             borderColor: 'lightgray',
//                         }}
//                     >
//                         <Text
//                             style={{
//                                 justifyContent: 'center',
//                                 textAlign: 'center',
//                                 fontSize: 20,
//                                 marginTop: 8,
//                             }}
//                         >
//                             {date
//                                 ? moment(date).format('hh  :  mm')
//                                 : moment(new Date()).format('hh  :  mm')}
//                         </Text>
//                     </View>
//                 </TouchableOpacity>
//                 <View
//                     style={{
//                         width: 70,
//                         height: 40,
//                         marginLeft: 25,
//                         borderRadius: 5,
//                         backgroundColor: '#DFF6FF',
//                         marginTop: 10,
//                     }}
//                 >
//                     <Text
//                         style={{
//                             justifyContent: 'center',
//                             textAlign: 'center',
//                             fontSize: 20,
//                             marginTop: 8,
//                             color: '#42C0F5',
//                         }}
//                     >
//                         {date
//                             ? moment(date).format('A')
//                             : moment(new Date()).format(' A')}
//                     </Text>
//                 </View>

//                 <Text
//                     style={{
//                         justifyContent: 'center',
//                         textAlign: 'center',
//                         marginLeft: 10,
//                         marginTop: 19,
//                         fontSize: 15,
//                     }}
//                 >
//                     my local time
//                 </Text>
//             </View>
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         padding: 10,
//     },
//     timeSlot: {
//         flexDirection: 'row',
//         // marginBottom: 50,
//         // marginVertical: 20,
//         // flexWrap:s "wrap",
//         justifyContent: 'center',
//         // width: 320
//     },
// })

// export default BookingSlot
