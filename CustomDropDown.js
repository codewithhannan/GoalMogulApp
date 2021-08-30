/** @format */

import * as React from 'react'
import { Button } from 'react-native-paper'
import { DatePickerModal } from 'react-native-paper-dates'
import { View } from 'react-native'

export default function ReadMeExampleSingle() {
    let oneYearFromNow = new Date()
    let newDate = oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() - 13)

    const [date, setDate] = React.useState(new Date(newDate))
    const [open, setOpen] = React.useState(false)

    const onDismissSingle = React.useCallback(() => {
        setOpen(false)
    }, [setOpen])

    const onConfirmSingle = React.useCallback(
        (params) => {
            setOpen(false)
            setDate(params.date)
        },
        [setOpen, setDate]
    )

    return (
        <>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Button
                    onPress={() => setOpen(true)}
                    uppercase={false}
                    mode="outlined"
                >
                    Pick single date
                </Button>
                <DatePickerModal
                    // locale={'en'} optional, default: automatic
                    mode="single"
                    visible={open}
                    onDismiss={onDismissSingle}
                    date={date}
                    onConfirm={onConfirmSingle}
                    validRange={{
                        endDate: new Date(newDate), // optional
                    }}
                    onChange={(date) => console.log('COMFIMRRR DATE', date)} // same props as onConfirm but triggered without confirmed by user
                    saveLabel="Confirm" // optional
                    label="Select date of Birth" // optional
                    animationType="fade" // optional, default is 'slide' on ios/android and 'none' on web
                />
            </View>
        </>
    )
}
