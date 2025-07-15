import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../hooks/Auth/authContext';
import { baseURL } from '../../../constants';

type Props = {}

function UserPost() {
    const navigation = useNavigation<any>()
    const { user } = useAuth()
    // const [contentPost, setContentPost] = useState('')

    return (
        <View style={styles.container}>
            <View>
                {
                    user?.avatar ?
                        <Image source={{ uri: `${baseURL}/${user.avatar}` }} style={styles.avatar} />
                        :
                        <Image source={require("../../../assets/avatar.png")} style={styles.avatar} />
                }
            </View>

            <View>
                <Text style={{ fontSize: 17, fontWeight: 700 }}>{user?.display_name}</Text>
                <TouchableOpacity onPress={() => { navigation.navigate("UserPost", { imageUrl: "a" }) }}>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ color: "gray" }}>
                            Có gì mới?
                        </Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.actionPost}>
                    <TouchableOpacity onPress={() => { navigation.navigate("UserPost") }}>
                        <Ionicons name='images-outline' size={22} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { navigation.navigate("UserPost") }}>
                        <Ionicons name='camera-outline' size={22} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default UserPost

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        columnGap: 10,
        borderBottomWidth: 0.3,
        paddingVertical: 20
    },
    avatar: {
        height: 45,
        width: 45,
        borderWidth: 0.5,
        borderRadius: 100
    },
    input: {
        maxWidth: 300
    },
    actionPost: {
        display: "flex",
        flexDirection: "row",
        columnGap: 15
    }
})