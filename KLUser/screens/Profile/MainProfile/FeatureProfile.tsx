import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useAuth } from '../../../hooks/Auth/authContext'

type Props = {}

function FeatureProfile() {
    const navigation = useNavigation<any>()
    const { logout } = useAuth()
    const features = [
        { id: 1, feature: "Tài khoản của tôi", icon: "person-outline", color: "black", bgColor: "#D2CECE", navigate: "MyAccount" },
        { id: 2, feature: "Danh sách yêu thích", icon: "heart", color: "red", bgColor: "#D2CECE", navigate: "FavouriteBook" },
        { id: 3, feature: "Bài viết đã đăng", icon: "albums-outline", color: "red", bgColor: "#D2CECE", navigate: "MyPost", screen: "" },
        // { id: 4, feature: "Đăng xuất", icon: "log-out-outline", color: "black", bgColor: "#D2CECE", navigate: "LoginRegister",  }
    ]
    return (
        <View style={styles.container}>
            {
                features.map((item) => (
                    <TouchableOpacity key={item.id} onPress={() => { navigation.navigate(item.navigate, { screen: item.screen }); }}>
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
            <TouchableOpacity onPress={() => { logout() }}>
                <View style={styles.featureContainer}>
                    <View style={styles.feature}>
                        <Ionicons name='log-out-outline' size={20} style={styles.icon} color={"black"} />
                        <Text style={{ fontSize: 16, fontWeight: 600 }}>Đăng xuất</Text>
                    </View>

                    <Ionicons name="chevron-forward" size={16} />
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default FeatureProfile

const styles = StyleSheet.create({
    container: {
        rowGap: 10,
        marginTop: 10,
        marginBottom: 30,
        borderWidth: 1,
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
        borderBottomWidth: 1,
        borderBottomColor: "white"
    },
    icon: {
        // backgroundColor: "#D2CECE",
        // borderRadius: 100,
        // padding: 5
    }
})