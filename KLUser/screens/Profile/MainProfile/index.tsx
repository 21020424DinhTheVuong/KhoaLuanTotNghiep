import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState, useCallback } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FeatureProfile from './FeatureProfile'
import MoreFeature from './MoreFeature'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { useAuth } from '../../../hooks/Auth/authContext'
import apiClient from '../../../hooks/ApiRequest/apiClient'
import { baseURL } from '../../../constants'

type Props = {}
type UserInfor = {
    username: string,
    display_name: string;
    sex: string;
    create_at: string;
    avatar: string
}
const MainProfile = () => {
    const navigation = useNavigation<any>()
    const { user } = useAuth();
    // console.log(user)
    const [userInfor, setUserInfor] = useState<UserInfor>()
    const getUserInfor = async () => {
        try {
            const response = await apiClient.get(`accounts/${user?.id}`);
            setUserInfor(response.data)
        } catch (error) {

        }
    }
    // useEffect(() => {

    //     getUserInfor()
    // }, [])
    useFocusEffect(
        useCallback(() => {
            getUserInfor(); // Fetch fresh data when this screen is focused
        }, [])
    );
    return (
        <View style={styles.container}>
            <View style={styles.mainInfor}>
                {
                    user?.avatar ?
                        <Image source={{ uri: `${baseURL}/${userInfor?.avatar}`, cache: "reload" }} style={styles.avatar} />
                        :
                        <Image source={
                            require("../../../assets/avatar.png")
                        } style={styles.avatar} />
                }

                <View style={styles.infor}>
                    <Text style={{ fontSize: 20, color: "white", fontWeight: 700 }}>{userInfor?.display_name}</Text>
                    <Text style={{ color: "white" }}>{user?.username}</Text>
                </View>

                <View style={{ borderRadius: 100, borderWidth: 1, borderColor: "white", padding: 5 }}>
                    <TouchableOpacity onPress={() => { navigation.navigate("ChangeInformation") }}>
                        <Ionicons name='pencil' size={20} color={"white"} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ marginTop: 20, }}>
                <Text style={{ fontSize: 16, fontWeight: 600 }}>Chức năng chính</Text>
                <FeatureProfile />
            </View>

            <View>
                <Text style={{ fontSize: 16, fontWeight: 600 }}>Chức năng khác</Text>
                <MoreFeature />
            </View>
        </View>
    )
}

export default MainProfile

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 30,
    },
    mainInfor: {
        display: "flex",
        flexDirection: "row",
        // columnGap: 10,
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#E83030",
        padding: 15,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#F27878"
    },
    avatar: {
        height: 60,
        width: 60,
        borderRadius: 100,
        borderWidth: 2
    },
    infor: {
        rowGap: 5,
        marginLeft: 10,
        marginRight: 60,
        maxWidth: "50%"
    }
})