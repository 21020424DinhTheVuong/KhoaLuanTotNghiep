import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { baseURL } from '../../../constants'
import { useAuth } from '../../../hooks/Auth/authContext'

type UserResult = {
    id: number;
    username: string;
    display_name: string;
    avatar: string
}
function SearchResult({ userData }: { userData: UserResult }) {
    const { user } = useAuth()
    const navigation = useNavigation<any>()
    return (
        <TouchableOpacity onPress={() => { navigation.navigate(user?.id === userData.id ? "MyPost" : "UserProfile", { userData: userData }) }}>

            <View style={styles.container}>
                {
                    userData.avatar ?
                        <Image source={{ uri: `${baseURL}/${userData.avatar}` }} style={styles.avatar} />
                        :
                        <Image source={require("../../../assets/avatar.png")} style={styles.avatar} />
                }

                <View style={styles.userInforContainer}>
                    <Text style={{ fontSize: 18, fontWeight: 600 }}>{userData.display_name}</Text>
                    <Text style={{ color: "gray" }}>{userData.username}</Text>
                </View>

                <Ionicons name="chevron-forward" size={25} style={{ marginLeft: "40%" }} />

            </View>
        </TouchableOpacity>

    )
}

export default SearchResult

const styles = StyleSheet.create({
    container: {
        marginVertical: 15,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 15,
        borderBottomWidth: 0.3,
        paddingBottom: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 100,
        borderWidth: 0.3
    },
    userInforContainer: {
        // borderBottomWidth: 0.3,
        // paddingBottom: 15
    }
})