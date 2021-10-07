/**
 * Notification Message Bar at the top when receiving the message.
 * This component is initialized at the end of the stack navigator so that it appears on the top
 * of the whole screen with zIndex --> infinite
 *
 * @format
 */

import React from 'react'
import { View } from 'react-native'
import * as Notifications from 'expo-notifications'

export default class extends React.Component {
    componentDidMount() {
        // Register the alert located on this master page
        // This MessageBar will be accessible from the current (same) component, and from its child component
        // The MessageBar is then declared only once, in your main component.
        this.notificationSubscription = Notifications.addNotificationReceivedListener(
            this.handleNotification
        )
    }

    componentWillUnmount() {
        // Remove the alert located on this master page from the manager
    }

    handleNotification = () => {
        // Added notification to the redux store for notification
        // If notification.origin is 'selected', it means user clicks to open the notification
        // Use linking to open the specific page
        // If notification.origin is 'received', it means app is foreground. Do nothing or
        // Show customized notification
    }

    render() {
        return <View />
    }
}
