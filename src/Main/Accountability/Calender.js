/** @format */

// /** @format */

import React, { useState, useEffect } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Button,
} from 'react-native'
import CalendarPicker from 'react-native-calendar-picker'

import DateTimePickerModal from 'react-native-modal-datetime-picker'

import moment from 'moment'
import style from '../Tutorial/style'

export default (props) => {
    const { onTime, startDate, endDate } = props
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false)

    const [selectedStartDate, setSelectedStartDate] = useState(null)
    const [selectedEndDate, setSelectedEndDate] = useState(null)

    const [time, setTime] = useState()

    const [mode, setMode] = useState('time')
    const [show, setShow] = useState(false)

    const showTimePicker = () => {
        setTimePickerVisibility(true)
    }

    const hideTimePicker = () => {
        setTimePickerVisibility(false)
    }

    const handleConfirm = (date) => {
        // console.log('A time has been picked: ', moment(date).format('hh:mm A'))
        setTime(date)
        const formatedTime = moment(date).format('hh:mm A')
        hideTimePicker()
        onTime(formatedTime)
        console.log('DATEEE', date)
    }

    const onDateChange = (date, type) => {
        console.log('DATATEEE', date)
        if (type === 'END_DATE') {
            setSelectedEndDate(date)
        } else {
            setSelectedEndDate(null)
            setSelectedStartDate(date)
        }
    }

    const customDatHeaderStylesCallback = ({ dayOfWeek, month, year }) => {
        switch (dayOfWeek) {
            case 1:
                return {
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 'bold',
                    },
                }
            case 2:
                return {
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 'bold',
                    },
                }
            case 3:
                return {
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 'bold',
                    },
                }
            case 4:
                return {
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 'bold',
                    },
                }
            case 5:
                return {
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 'bold',
                    },
                }
            case 6:
                return {
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 'bold',
                    },
                }
            case 7:
                return {
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 'bold',
                    },
                }
        }
    }

    const customDatesStylesCallback = (date) => {
        switch (date.isoWeekday()) {
            case 1:
                return {
                    textStyle: {
                        fontSize: 16,
                        color: '#42C0F5',
                        fontWeight: '400',
                    },
                }
            case 2:
                return {
                    textStyle: {
                        fontSize: 16,
                        color: '#42C0F5',
                        fontWeight: '400',
                    },
                }
            case 3:
                return {
                    textStyle: {
                        fontSize: 16,
                        color: '#42C0F5',
                        fontWeight: '400',
                    },
                }
            case 4:
                return {
                    textStyle: {
                        fontSize: 16,
                        color: '#42C0F5',
                        fontWeight: '400',
                    },
                }
            case 5:
                return {
                    textStyle: {
                        fontSize: 16,
                        color: '#42C0F5',
                        fontWeight: '400',
                    },
                }
            case 6:
                return {
                    textStyle: {
                        fontSize: 16,
                        color: '#42C0F5',
                        fontWeight: '400',
                    },
                }
            case 7:
                return {
                    textStyle: {
                        fontSize: 16,
                        color: '#42C0F5',
                        fontWeight: '400',
                    },
                }
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text
                    style={{
                        textAlign: 'center',
                        color: '#BDBDBD',
                    }}
                >
                    (Tap on the days you want to check in on)
                </Text>
                <View style={{ marginVertical: 0 }}>
                    {/* <CalendarPicker
                        width={430}
                        height={320}
                        // showDayStragglers={true}
                        disabledDatesTextStyle={{
                            // backgroundColor: 'red',
                            color: '#7FC5E3',
                        }}
                        dayLabelsWrapper={{
                            padding: 20,
                        }}
                        yearTitleStyle={{
                            color: '#42C0F5',
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}
                        monthTitleStyle={{
                            fontWeight: 'bold',
                            fontSize: 20,
                            color: '#42C0F5',
                        }}
                        allowRangeSelection={true}
                        minDate={new Date(2019, 1, 1)}
                        maxDate={new Date(2025, 1, 1)}
                        weekdays={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
                        customDayHeaderStyles={customDatHeaderStylesCallback}
                        customDatesStyles={customDatesStylesCallback}
                        headerWrapperStyle={{
                            height: 31,
                        }}
                        months={[
                            'January',
                            'Febraury',
                            'March',
                            'April',
                            'May',
                            'June',
                            'July',
                            'August',
                            'September',
                            'October',
                            'November',
                            'December',
                        ]}
                        previousTitleStyle={{
                            marginLeft: 100,
                            color: '#42C0F5',
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}
                        nextTitleStyle={{
                            marginRight: 100,
                            fontSize: 20,
                            color: '#42C0F5',
                            fontWeight: 'bold',
                            // width: 30,
                        }}
                        previousTitle="<"
                        nextTitle=">"
                        todayBackgroundColor="#DFF6FF"
                        selectedDayColor="#DFF6FF"
                        selectedDayTextColor="#42C0F5"
                        selectedRangeStartStyle={{
                            backgroundColor: '#42C0F5',
                        }}
                        selectedRangeStartTextStyle={{ color: 'white' }}
                        selectedRangeEndTextStyle={{ color: 'white' }}
                        selectedRangeEndStyle={{
                            backgroundColor: '#42C0F5',
                        }}
                        textStyle={{
                            fontFamily: 'Avenir',
                            fontSize: 15,
                            color: '#000000',
                        }}
                        onDateChange={onDateChange}
                    /> */}
                    <CalendarPicker
                        width={430}
                        height={320}
                        // showDayStragglers={true}
                        disabledDatesTextStyle={{
                            // backgroundColor: 'red',
                            color: '#7FC5E3',
                        }}
                        dayLabelsWrapper={{
                            padding: 20,
                        }}
                        yearTitleStyle={{
                            color: '#42C0F5',
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}
                        monthTitleStyle={{
                            fontWeight: 'bold',
                            fontSize: 20,
                            color: '#42C0F5',
                        }}
                        allowRangeSelection={true}
                        minDate={new Date(2019, 1, 1)}
                        maxDate={new Date(2025, 1, 1)}
                        weekdays={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
                        customDayHeaderStyles={customDatHeaderStylesCallback}
                        customDatesStyles={customDatesStylesCallback}
                        headerWrapperStyle={{
                            height: 31,
                        }}
                        months={[
                            'January',
                            'Febraury',
                            'March',
                            'April',
                            'May',
                            'June',
                            'July',
                            'August',
                            'September',
                            'October',
                            'November',
                            'December',
                        ]}
                        previousTitleStyle={{
                            marginLeft: 100,
                            color: '#42C0F5',
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}
                        nextTitleStyle={{
                            marginRight: 100,
                            fontSize: 20,
                            color: '#42C0F5',
                            fontWeight: 'bold',
                            // width: 30,
                        }}
                        previousTitle="<"
                        nextTitle=">"
                        todayBackgroundColor="#DFF6FF"
                        selectedDayColor="#DFF6FF"
                        selectedDayTextColor="#42C0F5"
                        selectedRangeStartStyle={{
                            backgroundColor: '#42C0F5',
                        }}
                        selectedRangeStartTextStyle={{ color: 'white' }}
                        selectedRangeEndTextStyle={{ color: 'white' }}
                        selectedRangeEndStyle={{
                            backgroundColor: '#42C0F5',
                        }}
                        textStyle={{
                            fontFamily: 'Avenir',
                            fontSize: 15,
                            color: '#000000',
                        }}
                        // onDateChange={this.onDateChange}
                        onDateChange={onDateChange}
                    />
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: 5,
                        marginHorizontal: 25,
                    }}
                >
                    <TouchableOpacity onPress={showTimePicker}>
                        <View
                            style={{
                                width: 100,
                                height: 40,
                                borderWidth: 1,
                                borderRadius: 5,
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
                                {time
                                    ? moment(time).format('hh  :  mm')
                                    : moment(new Date()).format('hh  :  mm')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View
                        style={{
                            width: 70,
                            height: 40,
                            borderRadius: 5,
                            backgroundColor: '#DFF6FF',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginHorizontal: 15,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: 20,
                                color: '#42C0F5',
                            }}
                        >
                            {time
                                ? moment(time).format('A')
                                : moment(new Date()).format(' A')}
                        </Text>
                    </View>

                    <Text
                        style={{
                            fontSize: 18,
                        }}
                    >
                        my local time
                    </Text>
                </View>
            </View>

            <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleConfirm}
                onCancel={hideTimePicker}
            />
        </SafeAreaView>
    )
}
// export default Calendar

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        marginTop: 10,
        // flex: 1,
        // paddingTop: 30,
        // backgroundColor: "#ffffff",
        // padding: 16,
        backgroundColor: 'white',
    },
    textStyle: {
        marginTop: 10,
        fontSize: 17,
    },
    titleStyle: {
        // textAlign: "center",
        // fontSize: 20,
        // margin: 20,
    },
})
