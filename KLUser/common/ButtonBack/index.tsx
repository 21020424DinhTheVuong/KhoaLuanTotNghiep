import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const ButtonBack = () => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity onPress={() => { navigation.goBack() }} style={styles.container}>
            <Ionicons name='arrow-back' size={25} />
        </TouchableOpacity>
    )
}

export default ButtonBack;

const styles = StyleSheet.create({
    container: {
        // backgroundColor: "#fff",
        width: 25,
        borderRadius: 5
    }
})