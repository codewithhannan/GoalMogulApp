/** @format */

import * as React from 'react'
import { View, useWindowDimensions, Text, Dimensions } from 'react-native'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import Calendar from './Calender'
import BookingSlot from './DaySlot'
const windowHeight = Dimensions.get('window').height

export default function TimePickers({ time, setTime }) {
    const layout = useWindowDimensions()

    const [index, setIndex] = React.useState(0)
    const [selectedDays, setselectedDays] = React.useState([])
    const [routes] = React.useState([
        { key: 'first', title: 'Weekly' },
        { key: 'second', title: 'Monthly' },
    ])

    const FirstRoute = () => (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <BookingSlot
                onSelect={(days) => {
                    setselectedDays(days)
                    console.log('selectedDays', selectedDays)
                }}
            />
        </View>
    )

    const SecondRoute = () => (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Calendar />
        </View>
    )

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
    })
    const renderTabBar = (props) => {
        // const { routes } = state
        return (
            <TabBar
                renderLabel={({ route, focused, color }) => (
                    <Text
                        style={{
                            color: focused ? 'white' : '#828282',
                            marginBottom: 20,
                            bottom: 3,
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: focused ? '400' : '300',
                        }}
                    >
                        {route.title}
                    </Text>
                )}
                {...props}
                indicatorStyle={{
                    backgroundColor: '#42C0F5',
                    height: 34,
                    borderRadius: 30,
                }}
                style={{
                    backgroundColor: '#F2F2F2',
                    borderRadius: 50,
                    width: '90%',
                    height: 34,
                    justifyContent: 'center',
                    alignSelf: 'center',
                }}
            />
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white', marginTop: 12 }}>
            <TabView
                renderTabBar={renderTabBar}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
            />
        </View>
    )
}
