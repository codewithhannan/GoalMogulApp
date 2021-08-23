/** @format */

/** @format */

/** @format */

import React, { Component, useState, useEffect } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'

import { View, StyleSheet, Text } from 'react-native'

const MONTH = [
    { label: 'January', value: 'January' },
    { label: 'February', value: 'February' },
    { label: 'March', value: 'March' },
    { label: 'April', value: 'April' },
    { label: 'May', value: 'May' },
    { label: 'June', value: 'June' },
    { label: 'July', value: 'July' },
    { label: 'September', value: 'September' },
    { label: 'October', value: 'October' },
    { label: 'November', value: 'November' },
    { label: 'Decemeber', value: 'December' },
]
const DATE = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '10', value: '10' },
    { label: '11', value: '11' },
    { label: '12', value: '12' },
    { label: '13', value: '13' },
    { label: '14', value: '14' },
    { label: '15', value: '15' },
    { label: '16', value: '16' },
    { label: '17', value: '17' },
    { label: '18', value: '18' },
    { label: '19', value: '19' },
    { label: '20', value: '20' },
    { label: '21', value: '21' },
    { label: '22', value: '22' },
    { label: '23', value: '23' },
    { label: '24', value: '24' },
    { label: '25', value: '25' },
    { label: '26', value: '26' },
    { label: '27', value: '27' },
    { label: '28', value: '28' },
    { label: '29', value: '29' },
    { label: '30', value: '30' },
    { label: '31', value: '31' },
]
let startingYear = new Date().getFullYear() - 13 //2008
let endingYear = 1950
let yearsArray = []
for (let index = startingYear; index >= endingYear; index--) {
    let year = {
        label: startingYear,
        value: startingYear,
    }
    yearsArray.push(year)
    startingYear--
}

function CustomDropdown({ dateOfBirth, change }) {
    const [openMonth, setMonthOpen] = useState(false)
    const [monthValue, setMonthValue] = useState(null)
    const [months, setMonths] = useState(MONTH)

    const [openDate, setDateOpen] = useState(false)
    const [dateValue, setDateValue] = useState(null)
    const [dates, setDates] = useState(DATE)

    const [openYear, setYearOpen] = useState(false)
    const [yearValue, setYearValue] = useState(null)
    const [years, setYears] = useState(yearsArray)

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                <Text
                    style={{
                        color: 'grey',
                        fontSize: 14,
                        fontWeight: '600',
                        marginHorizontal: 4,
                    }}
                >
                    Date of Birth
                </Text>
            </View>

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 10,
                }}
            >
                <DropDownPicker
                    open={openMonth}
                    value={monthValue}
                    onChangeValue={(value) => {
                        change(`${value}-${dateValue}-${yearValue}`)
                    }}
                    items={months}
                    setOpen={setMonthOpen}
                    setValue={setMonthValue}
                    setItems={setMonths}
                    placeholder="Month"
                    dropDownContainerStyle={{
                        backgroundColor: 'white',
                        borderColor: 'grey',
                        borderWidth: 0.3,
                        borderRadius: 4,
                    }}
                    textStyle={{
                        fontSize: 13,
                    }}
                    containerStyle={{
                        width: '30%',
                    }}
                    style={{
                        borderRadius: 5,
                        height: 40,

                        borderWidth: 0.8,
                        borderColor: '#c5c5c5',
                    }}
                    maxHeight={140}
                    closeAfterSelecting
                    showTickIcon={false}
                />
                <DropDownPicker
                    open={openDate}
                    value={dateValue}
                    items={dates}
                    setOpen={setDateOpen}
                    setValue={setDateValue}
                    setItems={setDates}
                    placeholder="Date"
                    onChangeValue={(value) => {
                        change(`${monthValue}-${value}-${yearValue}`)
                    }}
                    dropDownContainerStyle={{
                        backgroundColor: 'white',
                        borderColor: 'grey',
                        borderWidth: 0.3,
                        borderRadius: 4,
                    }}
                    containerStyle={{
                        width: '25%',
                    }}
                    textStyle={{
                        fontSize: 13,
                    }}
                    style={{
                        borderRadius: 5,
                        height: 40,
                        borderWidth: 0.8,
                        borderColor: '#c5c5c5',
                    }}
                    maxHeight={140}
                    showTickIcon={false}
                />
                <DropDownPicker
                    open={openYear}
                    value={yearValue}
                    items={years}
                    setOpen={setYearOpen}
                    setValue={setYearValue}
                    setItems={setYears}
                    onChangeValue={(value) => {
                        change(`${monthValue}-${dateValue}-${value}`)
                    }}
                    va
                    placeholder="Year"
                    dropDownContainerStyle={{
                        backgroundColor: 'white',
                        borderColor: 'grey',
                        borderWidth: 0.3,
                        borderRadius: 4,
                    }}
                    containerStyle={{
                        width: '35%',
                    }}
                    textStyle={{
                        fontSize: 13,
                    }}
                    style={{
                        borderRadius: 5,
                        height: 40,
                        borderWidth: 0.8,
                        borderColor: '#c5c5c5',
                    }}
                    maxHeight={140}
                    showTickIcon={false}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        top: 5,
        zIndex: 1,
    },
})

export default CustomDropdown
