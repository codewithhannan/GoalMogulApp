/** @format */

// /** @format */

import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import moment from 'moment'
import DayButton from './DayButton'
import { connect } from 'react-redux'

import {
    selectWeeklyDays,
    selectWeeklyTime,
    selectedWeek,
} from '../../reducers/AccountabilityTimePicker'
import { storeData } from '../../store/storage'

function BookingSlot({
    selectWeeklyTime,
    onSelect,
    selectWeeklyDays,
    selectedWeek,
}) {
    const [date, setDate] = useState()
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

    const showDatePicker = () => {
        setDatePickerVisibility(true)
    }

    const hideDatePicker = () => {
        setDatePickerVisibility(false)
    }

    const handleConfirm = (date) => {
        console.log('A date has been picked: ', date)
        setDate(date)
        selectWeeklyTime(date)
        hideDatePicker()
    }
    const [isPickerShow, setIsPickerShow] = useState(false)

    const [selectedDays, setSelectedDays] = useState([])
    const [days, setDays] = useState([
        { letter: 'Mon', word: 'monday' },
        { letter: 'Tue', word: 'tuesday' },
        { letter: 'Wed', word: 'wednesday' },
        { letter: 'Thurs', word: 'thursday' },
        { letter: 'Fri', word: 'friday' },
        { letter: 'Sat', word: 'saturday' },
        { letter: 'Sun', word: 'sudnay' },
    ])

    useEffect(() => {
        // onSelect(selectedDays)
    }, [])

    const onDaySelect = async (selectedDay) => {
        let tmp = [...selectedDays]
        tmp.push(selectedDay)
        setSelectedDays(tmp)
    }
    const onDayUnselect = async (selectedDay) => {
        let tmp = [...selectedDays]
        let index = tmp.findIndex((day) => day == selectedDay)
        tmp.splice(index, 1)
        setSelectedDays(tmp)
    }

    console.log('DAYSSSSSSSS', selectedDays)
    return (
        <View style={{ flex: 1, marginVertical: 25 }}>
            <Text
                style={{
                    fontSize: 18,
                    fontWeight: '600',
                    textAlign: 'center',
                }}
            >
                On these days
            </Text>
            <View style={styles.timeSlot}>
                {days.map((day, index) => {
                    return (
                        <View key={index} style={styles.container}>
                            <DayButton
                                day={day}
                                onDaySelect={onDaySelect}
                                onDayUnselect={onDayUnselect}
                            />
                        </View>
                    )
                })}
            </View>
            <View
                style={{
                    width: '95%',
                    height: 1,
                    backgroundColor: 'lightgray',
                    alignSelf: 'center',
                    marginVertical: 10,
                }}
            />

            <View
                style={{
                    // marginTop: -90,
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                }}
            >
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="time"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
                <TouchableOpacity onPress={showDatePicker}>
                    <View
                        style={{
                            width: 100,
                            height: 40,
                            marginLeft: 25,
                            borderWidth: 1,
                            borderRadius: 5,
                            marginTop: 10,
                            marginRight: -10,
                            borderColor: 'lightgray',
                        }}
                    >
                        <Text
                            style={{
                                justifyContent: 'center',
                                textAlign: 'center',
                                fontSize: 20,
                                marginTop: 8,
                            }}
                        >
                            {date
                                ? moment(date).format('hh  :  mm')
                                : moment(new Date()).format('hh  :  mm')}
                        </Text>
                    </View>
                </TouchableOpacity>
                <View
                    style={{
                        width: 70,
                        height: 40,
                        marginLeft: 25,
                        borderRadius: 5,
                        backgroundColor: '#DFF6FF',
                        marginTop: 10,
                    }}
                >
                    <Text
                        style={{
                            justifyContent: 'center',
                            textAlign: 'center',
                            fontSize: 20,
                            marginTop: 8,
                            color: '#42C0F5',
                        }}
                    >
                        {date
                            ? moment(date).format('A')
                            : moment(new Date()).format(' A')}
                    </Text>
                </View>

                <Text
                    style={{
                        justifyContent: 'center',
                        textAlign: 'center',
                        marginLeft: 10,
                        marginTop: 19,
                        fontSize: 15,
                    }}
                >
                    my local time
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    timeSlot: {
        flexDirection: 'row',

        justifyContent: 'center',
    },
})

const mapStateToProps = (state) => {
    const accountability = state.accountabilityTime
    // console.log('accountability', accountability)

    return {
        // accountability,
    }
}
export default connect(mapStateToProps, {
    selectWeeklyDays,
    selectWeeklyTime,
    selectedWeek,
})(BookingSlot)
