import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React, { useRef } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import apiClient from '../../hooks/ApiRequest/apiClient'
import { useAuth } from '../../hooks/Auth/authContext'
import SnackBarCustom, { SnackBarCustomRef } from '../../common/SnackBar'

type BookID = {
    bookId: any;
}
const Comments = ({ bookId }: BookID) => {
    const { user } = useAuth()
    const navigation = useNavigation<any>()
    const [text, onChangeText] = React.useState('');
    const snackbarRef = useRef<SnackBarCustomRef>(null);

    const handleShowSnackbar = (message: string, color: string) => {
        snackbarRef.current?.showMessage(message, color); // Pass text color
    };
    const addComment = async () => {
        if (text.trim() === '') {
            handleShowSnackbar("Hãy nhập bình luận!", "red");
            return;
        }
        try {
            const response = await apiClient.post(`comment/${user?.id}`, {
                book_id: bookId,
                content: text.trim()
            });
            handleShowSnackbar(response.data, "green");
            onChangeText("")
        } catch (error) {
            handleShowSnackbar("Bình luận thất bại!", "red")
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <View style={styles.titleContainer1}>
                    <Ionicons name='chatbubbles-outline' size={20} />
                    <Text style={styles.title}>Bình luận</Text>
                </View>
                <TouchableOpacity style={styles.titleContainer1}
                    onPress={() => { navigation.navigate("Comment", { bookId: Number(bookId) }) }}>
                    <Text style={{ fontSize: 16, textDecorationLine: "underline", color: "salmon" }}>Xem tất cả</Text>
                    <Ionicons name='arrow-forward' size={18} color={"salmon"} />
                </TouchableOpacity>
            </View>

            <View style={styles.inputComment}>
                <TextInput
                    editable
                    multiline
                    numberOfLines={4}
                    maxLength={100}
                    onChangeText={text => onChangeText(text)}
                    value={text}
                    style={styles.input}
                    placeholder='Nhập bình luận của bạn tại đây...'
                />
            </View>
            <View style={{ position: "absolute", right: 0, bottom: 0, borderWidth: 0.5, paddingVertical: 10, paddingHorizontal: 15, backgroundColor: "red", borderRadius: 10 }}>
                <TouchableOpacity onPress={() => addComment()}>
                    <Text style={{ fontSize: 16, color: "white", fontWeight: 600 }}>Đăng</Text>
                </TouchableOpacity>
            </View>

            <View style={{ marginRight: 30 }}>
                <SnackBarCustom defaultTextColor='white' ref={snackbarRef} />
            </View>

        </View>
    )
}

export default Comments

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 30,
        // marginBottom: 50
        paddingBottom: 40
    },
    titleContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    titleContainer1: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    title: {
        fontSize: 20
    },
    inputComment: {

    },
    input: {
        height: 100,
        marginVertical: 16,
        borderWidth: 1,
        padding: 10,
        borderRadius: 4,
        textAlignVertical: 'top'
    },
})