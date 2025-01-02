import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

const ButtonFunction = () => {
    return (
        <View style={styles.container}>
            <View style={[styles.button, { width: "48%", backgroundColor: "#8bc34a" }]}>
                <TouchableOpacity style={styles.touch}>
                    <Ionicons name='book' color={"white"} />
                    <Text style={styles.functionText}>Đọc từ đầu</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.button, { width: "48%", backgroundColor: "#ff3860" }]}>
                <TouchableOpacity style={styles.touch}>
                    <Ionicons name='heart' color={"white"} />
                    <Text style={styles.functionText}>Theo dõi</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.button, { width: "40%", backgroundColor: "#bd10e0" }]}>
                <TouchableOpacity style={styles.touch}>
                    <Ionicons name='thumbs-up' color={"white"} />
                    <Text style={styles.functionText}>Thích</Text>
                </TouchableOpacity>
            </View>
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