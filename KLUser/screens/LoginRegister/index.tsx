import React from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import Login from './Login'
import Register from './Register'

const Stack = createStackNavigator()
export default function LoginRegister() {
    return (
        <Stack.Navigator initialRouteName='Login'
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />

        </Stack.Navigator>
    )
}