import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { COLORS } from '../../hooks/useTheme'

const Footer = () => {
    return (
        <View style={styles.container}>
            <Image source={require("../../assets/logo.png")} style={styles.image} />
            <Text style={{ color: "white", fontSize: 20 }}>Được tài trợ bởi DTV.</Text>
        </View >
    )
}

export default Footer

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.gray,
        paddingHorizontal: 20,
        paddingVertical: 20,
        display: "flex",
        flexDirection: "row",
        columnGap: 50,
        alignItems: "center"
    },
    image: {
        height: 60,
        width: 60
    }
})