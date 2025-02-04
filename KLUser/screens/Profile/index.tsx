import React from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import MainProfile from './MainProfile'
import ChangeInformation from './ChangeInformation'
import MyAccount from './MyAccount'
import FavouriteBook from './FavouriteBook'
import ChangePassword from './ChangePassword'
import MyPost from './MyPost'
import ReplyPost from '../Fanpage/ReplyPost'
import EditPost from '../Fanpage/UserProfile/EditPost'
// import EditPost from './MyPost/EditPost'
const Stack = createStackNavigator()
export default function Profile() {
    return (
        <Stack.Navigator initialRouteName='MainProfile'
            screenOptions={{
                // headerTitle: "Hồ sơ",
                headerTitleStyle: { fontWeight: 900 }
            }}>
            <Stack.Screen name="MainProfile" component={MainProfile}
                options={{
                    headerTitle: "Hồ sơ"
                }} />
            <Stack.Screen name="ChangeInformation" component={ChangeInformation}
                options={{
                    headerTitle: "Thay đổi thông tin",
                    headerBackTitle: "Hồ sơ"
                }} />
            <Stack.Screen name="MyAccount" component={MyAccount}
                options={{
                    headerTitle: "Tài khoản của tôi",
                    headerBackTitle: "Hồ sơ"
                }} />
            <Stack.Screen name="FavouriteBook" component={FavouriteBook}
                options={{
                    headerTitle: "Danh sách yêu thích",
                    headerBackTitle: "Hồ sơ"
                }} />
            <Stack.Screen name="ChangePassword" component={ChangePassword}
                options={{
                    headerTitle: "Đổi mật khẩu",
                    headerBackTitle: "Hồ sơ"
                }} />
            <Stack.Screen name="MyPost" component={MyPost}
                options={{
                    headerTitle: "Trở về",
                    headerBackTitle: "Hồ sơ"
                }} />
            <Stack.Screen name="ReplyPost" component={ReplyPost}
                options={{
                    headerShown: false
                }} />
            <Stack.Screen name="EditPost" component={EditPost}
                options={{
                    headerShown: false
                }} />
        </Stack.Navigator>
    )
}