import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { Text, View } from 'react-native'
import MainForum from './MainForum'
import UserPost from './UserPost'
import ReplyPost from './ReplyPost'
import Search from './Search'
import UserProfile from './UserProfile'
import EditPost from './UserProfile/EditPost'
import ReplyPostChildren from './ReplyPostChidren'
import MyPost from '../Profile/MyPost'

const Stack = createStackNavigator()
const ForumScreen = () => {
    return (
        <Stack.Navigator initialRouteName='Forum'
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name='Forum' component={MainForum} />
            <Stack.Screen name="UserPost" component={UserPost} />
            <Stack.Screen name="ReplyPost" component={ReplyPost} />
            <Stack.Screen name="ReplyPostChildren" component={ReplyPostChildren} />
            <Stack.Screen name='SearchUser' component={Search} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="EditPost" component={EditPost} />
            <Stack.Screen name="MyPost" component={MyPost}
                options={{
                    headerShown: true,
                    headerTitle: "Trở về"
                }} />
        </Stack.Navigator>
    )
}

export default ForumScreen