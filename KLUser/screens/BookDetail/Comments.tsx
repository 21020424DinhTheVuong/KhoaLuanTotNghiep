import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'

const Comments = () => {
    const navigation = useNavigation<any>()
    const [text, onChangeText] = React.useState('');
    const [number, onChangeNumber] = React.useState('');

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <View style={styles.titleContainer1}>
                    <Ionicons name='chatbubbles-outline' size={20} />
                    <Text style={styles.title}>Bình luận</Text>
                </View>
                <TouchableOpacity style={styles.titleContainer1}
                    onPress={() => { navigation.navigate("Comment") }}>
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
        </View>
    )
}

export default Comments

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 30
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