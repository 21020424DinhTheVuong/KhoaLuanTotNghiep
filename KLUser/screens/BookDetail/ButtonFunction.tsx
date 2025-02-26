import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useAuth } from "../../hooks/Auth/authContext";
import apiClient from "../../hooks/ApiRequest/apiClient";
import { useRoute } from "@react-navigation/native";
import SnackBarCustom, { SnackBarCustomRef } from "../../common/SnackBar";

const ButtonFunction = () => {
    const route = useRoute<any>()
    const bookID = route.params.idBook;
    const { user } = useAuth();
    const [like, setLike] = useState(false)


    const checkBookInFavourite = async () => {
        try {
            const response = await apiClient.get(`accounts/${bookID}/favourite/${user?.id}`);
            if (response.data === true) {
                setLike(true)
            } else {
                setLike(false)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const addToFavourite = async () => {
        try {
            await apiClient.post("accounts/add", {
                userId: user?.id,
                bookId: bookID
            })
            checkBookInFavourite()
        } catch (error) {

        }
    }
    useEffect(() => {

        checkBookInFavourite()
    }, [])

    // console.log(user)
    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.button, { width: "48%", backgroundColor: "#ff3860" }]}>

                <View style={styles.touch}>
                    <Ionicons name='heart' color={"white"} />
                    <Text style={styles.functionText}>Theo dõi</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { width: "48%", backgroundColor: "#bd10e0" }]} onPress={addToFavourite}>
                {
                    like ?
                        <View style={[styles.touch]}>
                            <Ionicons name='thumbs-up' color={"white"} />
                            <Text style={[styles.functionText]}>Đã Thích</Text>
                        </View>
                        :
                        <View style={styles.touch}>
                            <Ionicons name='thumbs-up' color={"white"} />
                            <Text style={styles.functionText}>Thích</Text>
                        </View>
                }

            </TouchableOpacity>


        </View>
    )
}

export default ButtonFunction;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        columnGap: 5,
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        padding: 10,

    },
    button: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        height: 40,
        borderColor: 'transparent',
        borderRadius: 5,
        marginBottom: 5,
        justifyContent: "center",
        alignItems: 'center',
    },
    touch: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        columnGap: 5,
    },
    functionText: {
        color: "white"
    }
})