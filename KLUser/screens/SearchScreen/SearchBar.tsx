import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const SearchBar = () => {
    const [text, onChangeText] = useState('');

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
                placeholder="Tìm kiếm truyện"
            />
            <TouchableOpacity style={{ top: -40 }}>
                <Ionicons name="search" size={20} color="black" style={styles.icon} />
                {/* <Text>Tk</Text> */}
            </TouchableOpacity>
        </View>
    )
}

export default SearchBar

const styles = StyleSheet.create({
    container: {
        marginBottom: 30,
        marginHorizontal: 10
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
    },
    icon: {
        position: 'absolute',
        right: 25,
    }
})