/** @format */

import {
    setPhoneContacts,
    loadingPhoneContacts,
    phoneContactsError,
} from '../reducers/ContactsReducer'
import * as Contacts from 'expo-contacts'
import { Actions } from 'react-native-router-flux'

const DEBUG_KEY = '[ ContactActions ]'

export const getAllContacts = () => {
    return async (dispatch, getState) => {
        const { status } = await Contacts.requestPermissionsAsync()

        try {
            if (status === 'granted') {
                dispatch(loadingPhoneContacts(true))
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.PhoneNumbers],
                })

                if (data.length > 0) {
                    const contactsData = data.map((data, index) => {
                        return {
                            name: data.firstName,
                            number: data.phoneNumbers[0].number,
                            id: index,
                        }
                    })

                    dispatch(setPhoneContacts(contactsData))
                    // Actions.push('ContactMessage')

                    console.log(
                        `${DEBUG_KEY} This is the response of getting all contacts`,
                        contactsData
                    )
                    dispatch(loadingPhoneContacts(false))
                }
            }
        } catch (error) {
            dispatch(phoneContactsError(error.message))
            console.log(
                `${DEBUG_KEY} This is the error of getting conatacts `,
                error.message
            )
        }
    }
}
