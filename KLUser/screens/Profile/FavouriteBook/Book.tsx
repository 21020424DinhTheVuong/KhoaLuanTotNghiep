import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState, useRef } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import apiClient from '../../../hooks/ApiRequest/apiClient'
import { useAuth } from '../../../hooks/Auth/authContext'
import { baseURL } from '../../../constants'
import SnackBarCustom, { SnackBarCustomRef } from '../../../common/SnackBar'

type BookType = {
    id: number,
    book_name: string;
    artist: string;
    cover_image: string;
    action: () => void
}
const Book = ({ id, book_name, artist, cover_image, action }: BookType) => {
    const { user } = useAuth()
    const navigation = useNavigation<any>()


    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => {
                navigation.navigate("Home", {
                    screen: "BookDetail",
                    params: {              // Parameters to pass
                        idBook: id
                    }
                })
            }}>
                <View style={styles.titleContainer}>
                    <Image source={{ uri: `${baseURL}/${cover_image}` }} style={styles.image} />
                    <View style={styles.title}>
                        <Text style={{ fontSize: 17, fontWeight: 600, textTransform: "capitalize" }} >{book_name}</Text>
                        <Text>{artist}</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={action}>
                <Ionicons name='close' size={25} />

            </TouchableOpacity>
           
        </View>
    )
}

export default Book
const styles = StyleSheet.create({
    container: {
        // height: 120,
        borderBottomWidth: 1,
        borderRadius: 5,
        padding: 5,
        paddingLeft: 10,
        marginHorizontal: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    titleContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 20
    },
    image: {
        height: 100,
        width: 70,
        borderRadius: 5,
    },
    title: {
        maxWidth: 200
    }
})