import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props = {}

const features = [
    { id: 1, feature: "Đổi mật khẩu", icon: "key-outline", color: "black", bgColor: "#D2CECE", screen: "ChangePassword" },
]
const MoreFeature = () => {
    const navigation = useNavigation<any>()
    return (
        <View style={styles.container}>

            {
                features.map((item) => (
                    <TouchableOpacity key={item.id} onPress={() => { navigation.navigate(item.screen) }}>
                        <View style={styles.featureContainer}>
                            <View style={styles.feature}>
                                <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={20} style={styles.icon} color={item.color} />
                                <Text style={{ fontSize: 16, fontWeight: 600 }}>{item.feature}</Text>
                            </View>

                            <Ionicons name="chevron-forward" size={16} />
                        </View>
                    </TouchableOpacity>
                ))
            }
        </View>
    )
}

export default MoreFeature

const styles = StyleSheet.create({
    container: {
        rowGap: 10,
        borderWidth: 1,
        marginTop: 5,
        borderRadius: 10
    },
    featureContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 10
    },
    feature: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        display: "flex",
        flexDirection: "row",
        columnGap: 20,
        alignItems: "center",

    },
    icon: {
        // backgroundColor: "#D2CECE",
        // borderRadius: 100,
        // padding: 5
    }
})