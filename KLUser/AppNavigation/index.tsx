import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Profile from '../screens/Profile';
import LoginRegister from '../screens/LoginRegister';
import ForumScreen from '../screens/Fanpage';
import { AuthProvider, useAuth } from '../hooks/Auth/authContext';
import GenerateScreen from '../screens/Generate';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator()
export default function AppNavigation() {
    const { user } = useAuth()
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LoginRegister"
                screenOptions={{
                    // header: () => <Header />
                    headerShown: false
                }}
            >
                {
                    user ? (
                        <>
                            <Stack.Screen name="Home" component={HomeScreen} />

                            <Stack.Screen name="Profile" component={Profile} />
                            <Stack.Screen name='ForumScreen' component={ForumScreen} />
                            <Stack.Screen name='Generate' component={GenerateScreen} />

                        </>
                    )

                        : (
                            <>
                                <Stack.Screen name="LoginRegister" component={LoginRegister} />
                            </>
                        )
                }

                {/* <Stack.Screen name="BookDetail" component={BookDetailScreen} /> */}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
