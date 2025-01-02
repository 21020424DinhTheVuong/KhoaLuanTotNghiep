import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native"

const InformationBook = () => {
    return (
        <View>
            <View style={styles.inforContainer}>
                <View style={styles.inforChildren}>
                    <Text style={styles.title}>
                        <Ionicons name="add" />
                        Tên khác</Text>
                </View>

                <View style={[styles.inforChildren, { maxWidth: "75%" }]}>
                    <Text style={styles.title}>Vua Hải tặc, Đảo hải tặc, Vua Hải tặc</Text>
                </View>
            </View>

            <View style={styles.inforContainer1}>
                <View style={styles.inforChildren}>
                    {/* <Text>Tên khác</Text> */}
                    <Text style={styles.title}>
                        <Ionicons name="people" />
                        Tác giả</Text>
                    <Text style={styles.title}>
                        <Ionicons name="wifi" />
                        Tình trạng</Text>
                    <Text style={styles.title}>
                        <Ionicons name="thumbs-up" />
                        Lượt thích</Text>
                    <Text style={styles.title}>
                        <Ionicons name="heart" />
                        Lượt theo dõi</Text>
                    <Text style={styles.title}>
                        <Ionicons name="eye" />
                        Lượt xem</Text>
                </View>

                <View style={styles.inforChildren}>
                    {/* <Text>Vua Hải tặc, Đảo hải tặc, Vua Hải tặc, Đảo hải tặc, Vua Hải tặc, Đảo hải tặc</Text> */}
                    <Text style={{ fontSize: 16 }}>Eichiiro Oda</Text>
                    <Text style={styles.title}>Đang cập nhật</Text>
                    <Text style={{ fontSize: 16 }}>34423</Text>
                    <Text style={{ fontSize: 16 }}>3423243</Text>
                    <Text style={styles.title}>3*</Text>
                </View>
            </View>
        </View>
    )
}

export default InformationBook;

const styles = StyleSheet.create({
    inforContainer: {
        display: "flex",
        flexDirection: "row",
        marginHorizontal: 40,
        paddingRight: 20,
        columnGap: 50,
        marginTop: 15
    },
    inforContainer1: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 40,
        columnGap: 20
    },
    inforChildren: {
        display: "flex",
        flexDirection: "column",
        // paddingLeft: 10,
    },
    title: {
        fontWeight: 600,
        fontSize: 16
    }
})