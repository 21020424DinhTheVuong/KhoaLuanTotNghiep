import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react"
import { Text, StyleSheet, View, Image, TouchableOpacity, StatusBar } from "react-native"
import { COLORS } from "../../hooks/useTheme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAuth } from "../../hooks/Auth/authContext";
import { baseURL } from "../../constants";
import apiClient from "../../hooks/ApiRequest/apiClient";

export default function Header() {
    const navigation = useNavigation<any>()
    const { user } = useAuth();
    const [avatar, setAvatar] = useState(user?.avatar)
    const getUserInfor = async () => {
        try {
            const response = await apiClient.get(`accounts/${user?.id}`);
            setAvatar(response.data.avatar)
        } catch (error) {

        }
    }
    useFocusEffect(
        useCallback(() => {
            getUserInfor(); // Fetch fresh data when this screen is focused
        }, [])
    );
    return (
        <View style={styles.headerContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            <TouchableOpacity onPress={() => { navigation.navigate("Home") }}>
                <Image source={require('../../assets/logo.png')} style={styles.image} />

            </TouchableOpacity>
            <View style={{ display: "flex", flexDirection: "row", columnGap: 10 }}>
                <TouchableOpacity onPress={() => { navigation.navigate("Search") }}>
                    <Ionicons name='search-circle-outline' size={40} color={"white"} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { navigation.navigate("Profile") }}>
                    {
                        user?.avatar ?
                            <Image source={{ uri: `${baseURL}/${avatar}` }} style={styles.avatar} />
                            :
                            <Image source={require("../../assets/avatar.png")} style={styles.avatar} />
                    }
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    headerContainer: {
        height: 60,
        display: "flex",
        flexDirection: "row",
        backgroundColor: COLORS.gray,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    image: {
        height: 40,
        width: 40
    },
    avatar: {
        height: 40,
        width: 40,
        borderRadius: 50
    },
});