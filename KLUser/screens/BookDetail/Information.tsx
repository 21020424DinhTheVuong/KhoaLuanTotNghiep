import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

type InforBook = {
    otherName: any;
    artist: any;
    status: any;
    likeVote: any;
    reading_times: any;
    vote: any;
    rating: any
};
const InformationBook = ({
    otherName,
    artist,
    status,
    likeVote,
    reading_times,
    vote,
    rating
}: InforBook) => {
    return (
        <View>
            <View style={styles.inforContainer}>
                <View style={styles.inforChildren}>
                    <Text style={styles.title}>
                        <Ionicons name="add" />
                        Tên khác
                    </Text>
                </View>

                <View style={[styles.inforChildren, { maxWidth: "75%" }]}>
                    <Text style={styles.title}>{otherName}</Text>
                </View>
            </View>

            <View style={styles.inforContainer1}>
                <View style={styles.inforChildren}>
                    {/* <Text>Tên khác</Text> */}
                    <Text style={styles.title}>
                        <Ionicons name="people" />
                        Tác giả
                    </Text>
                    <Text style={styles.title}>
                        <Ionicons name="wifi" color={"blue"} />
                        Tình trạng
                    </Text>
                    <Text style={styles.title}>
                        <Ionicons name="thumbs-up" color={"red"} />
                        Lượt thích
                    </Text>
                    <Text style={styles.title}>
                        <Ionicons name="eye" />
                        Lượt xem
                    </Text>
                    <Text style={styles.title}>
                        <Ionicons name="newspaper" />
                        Lượt đánh giá
                    </Text>
                    <Text style={styles.title}>
                        <Ionicons name="star" color={"orange"} />
                        Đánh giá
                    </Text>
                </View>

                <View style={styles.inforChildren}>
                    {/* <Text>Vua Hải tặc, Đảo hải tặc, Vua Hải tặc, Đảo hải tặc, Vua Hải tặc, Đảo hải tặc</Text> */}
                    <Text style={{ fontSize: 16 }}>{artist}</Text>
                    <Text style={styles.title}>{status}</Text>
                    <Text style={{ fontSize: 16 }}>{likeVote}</Text>
                    <Text style={{ fontSize: 16 }}>{reading_times}</Text>
                    <Text style={{ fontSize: 16 }}>{vote}</Text>
                    <Text style={styles.title}>
                        {rating}
                        <Ionicons name="star" color={"orange"} size={20} />
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default InformationBook;

const styles = StyleSheet.create({
    inforContainer: {
        display: "flex",
        flexDirection: "row",
        marginHorizontal: 40,
        paddingRight: 20,
        columnGap: 45,
        marginTop: 15,
    },
    inforContainer1: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 40,
        columnGap: 10,
    },
    inforChildren: {
        display: "flex",
        flexDirection: "column",
        // padding: 10,
    },
    title: {
        fontWeight: 600,
        fontSize: 16,
    },
});
