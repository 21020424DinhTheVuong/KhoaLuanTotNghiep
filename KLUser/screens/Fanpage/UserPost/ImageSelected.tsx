import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

type Props = {
    imageUrl: string,
    action: any
    // id: number
}

const ImageSelected = ({ imageUrl, action }: Props) => {
    return (
        <View style={styles.imageList}>
            <TouchableOpacity style={styles.deleteImage} onPress={() => { action() }}>
                <Ionicons name="close" size={20} />
            </TouchableOpacity>
            <Image source={{ uri: imageUrl }} style={styles.image} />

        </View>
    )
}

export default ImageSelected

const styles = StyleSheet.create({
    imageList: {
        marginBottom: 10,
        marginRight: 10
    },
    deleteImage: {
        position: "absolute",
        backgroundColor: "gray",
        width: 20,
        borderRadius: 100,
        opacity: 0.5,
        right: 5,
        top: 5,
        zIndex: 99
    },
    image: {
        height: 250,
        width: 250,
        // borderRadius: 10
    }
})