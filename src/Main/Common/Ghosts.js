/** @format */

import React from 'react'
import { View } from 'react-native'
import SkeletonContent from 'react-native-skeleton-content'

export const ActivityGhost = () => {
    return (
        <View style={{ flex: 1, marginBottom: 8 }}>
            <SkeletonContent
                containerStyle={styles.top}
                animationDirection="horizontalLeft"
                layout={[
                    // Profile Image Placeholder Circle with diameter = (screenWidth / 8)
                    {
                        key: 'activity-ghost-1',
                        width: 50,
                        height: 50,
                        marginTop: 10,
                        marginLeft: 10,
                        borderRadius: 25,
                    },
                    // Name and Chat preview - horizontal ghost bars with the top being shorter
                    {
                        key: 'activity-ghost-2',
                        flexDirection: 'column',
                        marginRight: 10,
                        children: [
                            {
                                key: 'activity-ghost-3',
                                // First bar - width = 1/4 screen
                                width: 100,
                                height: 20,
                                marginBottom: 3,
                                marginTop: 10,
                                marginLeft: 10,
                            },
                            {
                                key: 'activity-ghost-4',
                                // Second bar - width = 1/10 screen
                                width: 40,
                                height: 20,
                                marginTop: 3,
                                marginLeft: 10,
                            },
                        ],
                    },
                ]}
                isLoading={true}
            />
            <SkeletonContent
                containerStyle={{ flex: 1, width: 400 }}
                animationDirection="horizontalLeft"
                layout={[
                    {
                        key: 'activity-ghost-5',
                        width: 400,
                        height: 20,
                        marginBottom: 3,
                        marginTop: 10,
                        marginLeft: 10,
                        marginRight: 10,
                    },
                    {
                        key: 'activity-ghost-6',
                        width: 400,
                        height: 20,
                        marginBottom: 3,
                        marginTop: 3,
                        marginLeft: 10,
                        marginRight: 10,
                    },
                ]}
                isLoading={true}
            />
            <SkeletonContent
                containerStyle={styles.bottom}
                animationDirection="horizontalLeft"
                layout={[
                    // short line right aligned
                    {
                        key: 'activity-ghost-7',
                        width: 100,
                        height: 15,
                        marginTop: 0,
                        marginLeft: 20,
                        paddingLeft: 3,
                        borderRadius: 25,
                    },
                    {
                        key: 'activity-ghost-8',
                        flexDirection: 'column',
                        marginRight: 3,
                        children: [
                            {
                                key: 'activity-ghost-9',
                                width: 100,
                                height: 15,
                                marginBottom: 3,
                                marginTop: 0,
                                marginLeft: 0,
                                borderRadius: 25,
                            },
                        ],
                    },
                ]}
                isLoading={true}
            />
            <SkeletonContent
                containerStyle={{ flex: 1, width: 400 }}
                animationDirection="horizontalLeft"
                layout={[
                    {
                        key: 'activity-ghost-10',
                        width: 400,
                        height: 15,
                        marginBottom: 10,
                        marginTop: 3,
                        marginLeft: 10,
                        marginRight: 10,
                        borderRadius: 25,
                    },
                ]}
                isLoading={true}
            />
        </View>
    )
}

const styles = {
    top: {
        width: 300,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'left',
        justifyContent: 'left',
        padding: 20,
    },
    bottom: {
        width: 400,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
    },
}
